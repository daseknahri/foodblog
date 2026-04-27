import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const warnings = [];
const args = parseArgs(process.argv.slice(2));
const env = readEnv('.env.example');
const pages = readJson('content/pages.json');
const posts = readJson('content/posts.json');
const categories = readJson('content/categories.json');
const imagePlan = readJson('content/image-plan.json');

checkEnv();
checkContentDepth();
checkPolicyPages();
checkImages();
checkPublicCode();

if (args.live) {
  await checkLive(String(args.live).replace(/\/+$/, ''));
}

if (failures.length === 0) {
  console.log('Ezoic readiness audit passed.');
} else {
  console.log(`Ezoic readiness audit found ${failures.length} required fix${failures.length === 1 ? '' : 'es'}.`);
}

if (warnings.length > 0) {
  console.log(`Ezoic readiness audit found ${warnings.length} warning${warnings.length === 1 ? '' : 's'}.`);
}

printSection('Required fixes', failures);
printSection('Warnings', warnings);

process.exit(failures.length > 0 ? 1 : 0);

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (!item.startsWith('--')) continue;
    const key = item.slice(2);
    const next = argv[index + 1];
    if (next && !next.startsWith('--')) {
      parsed[key] = next;
      index += 1;
    } else {
      parsed[key] = true;
    }
  }
  return parsed;
}

function readEnv(relativePath) {
  const content = readFile(relativePath);
  const values = new Map();
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const equalIndex = trimmed.indexOf('=');
    if (equalIndex === -1) continue;
    values.set(trimmed.slice(0, equalIndex), trimmed.slice(equalIndex + 1));
  }
  return values;
}

function readJson(relativePath) {
  const content = readFile(relativePath);
  if (!content) return [];
  try {
    const value = JSON.parse(content);
    if (!Array.isArray(value)) {
      failures.push(`${relativePath} must contain a JSON array.`);
      return [];
    }
    return value;
  } catch (error) {
    failures.push(`${relativePath} is invalid JSON: ${error.message}`);
    return [];
  }
}

function readFile(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    failures.push(`Missing file: ${relativePath}`);
    return '';
  }
  return fs.readFileSync(absolutePath, 'utf8');
}

function envValue(key) {
  return String(env.get(key) || '').trim();
}

function checkEnv() {
  const siteUrl = envValue('SITE_URL');
  if (!/^https:\/\/[^/]+/i.test(siteUrl)) failures.push('SITE_URL must be an https:// URL.');
  if (envValue('ADSENSE_ENABLE') !== '0') warnings.push('Keep ADSENSE_ENABLE=0 while Ezoic review/setup is pending.');
  if (envValue('GA_ENABLE') !== '0') warnings.push('Keep GA_ENABLE=0 until consent is configured.');
  if (envValue('EZOIC_PLUGIN_ENABLE') !== '0') warnings.push('Keep EZOIC_PLUGIN_ENABLE=0 until you intentionally enable Ezoic integration.');
  if (envValue('WP_ADMIN_LOCALE') !== 'en_US') warnings.push('Keep WP_ADMIN_LOCALE=en_US for a simple English admin workflow.');
  if (!envValue('CANONICAL_REDIRECT_HOSTS').includes('www.')) warnings.push('CANONICAL_REDIRECT_HOSTS should include the www host.');
}

function checkContentDepth() {
  if (posts.length < 20) failures.push(`Expected at least 20 posts before Ezoic submission; found ${posts.length}.`);
  if (categories.length < 4) failures.push(`Expected at least 4 categories; found ${categories.length}.`);

  const recipeCount = posts.filter((post) => post.kind === 'recipe').length;
  const guideCount = posts.filter((post) => post.kind === 'article').length;
  if (recipeCount < 10) warnings.push(`Recipe count is ${recipeCount}; more recipes can strengthen a food-site review.`);
  if (guideCount < 4) warnings.push(`Guide count is ${guideCount}; practical guides help show editorial depth.`);

  for (const post of posts) {
    if (!post.title || !post.excerpt || !post.meta_description) failures.push(`Incomplete SEO fields for post: ${post.slug || '(unknown)'}`);
    if (post.kind === 'recipe' && (!Array.isArray(post.ingredients) || !Array.isArray(post.steps))) {
      failures.push(`Recipe missing ingredients or steps: ${post.slug || '(unknown)'}`);
    }
    if (post.kind === 'article' && (!Array.isArray(post.sections) || post.sections.length < 4)) {
      failures.push(`Guide needs at least 4 sections: ${post.slug || '(unknown)'}`);
    }
  }
}

function checkPolicyPages() {
  const slugs = new Set(pages.map((page) => String(page.slug || '')));
  const required = [
    'about-kuchniatwist',
    'about-author',
    'contact',
    'privacy-policy',
    'cookie-policy',
    'advertising-and-consent',
    'editorial-policy',
    'terms-and-conditions',
    'culinary-disclaimer',
  ];

  for (const slug of required) {
    if (!slugs.has(slug)) failures.push(`Missing Ezoic review page: ${slug}`);
  }
}

function checkImages() {
  const planSlugs = new Set(imagePlan.map((image) => String(image.slug || '')));
  for (const post of posts) {
    if (!planSlugs.has(post.slug)) failures.push(`Missing image plan for post: ${post.slug}`);
  }

  for (const image of imagePlan) {
    if (!image.filename || !fs.existsSync(path.join(root, 'content/images', image.filename))) {
      failures.push(`Missing image file: ${image.filename || image.slug || '(unknown)'}`);
    }
    if (!image.alt || String(image.alt).length < 25) failures.push(`Image alt text too short: ${image.slug || image.filename}`);
  }
}

function checkPublicCode() {
  const adtech = readFile('wp-content/mu-plugins/kepoli-adtech.php');
  if (!adtech.includes('EZOIC_ADSTXT_ACCOUNT_ID')) failures.push('ads.txt helper must support EZOIC_ADSTXT_ACCOUNT_ID.');
  if (!adtech.includes('/ads.txt')) failures.push('ads.txt endpoint helper is missing.');

  const compose = readFile('docker-compose.yml');
  for (const key of ['EZOIC_ADSTXT_ACCOUNT_ID', 'EZOIC_ADSTXT_REDIRECT_URL', 'EZOIC_PLUGIN_ENABLE']) {
    if (!compose.includes(key)) failures.push(`docker-compose.yml is missing ${key}.`);
  }
}

async function checkLive(baseUrl) {
  const urls = [
    '/',
    '/contact/',
    '/privacy-policy/',
    '/cookie-policy/',
    '/advertising-and-consent/',
    '/editorial-policy/',
    '/category/quick-recipes/',
    '/ads.txt',
    '/robots.txt',
    '/wp-sitemap.xml',
  ];

  for (const suffix of urls) {
    const url = `${baseUrl}${suffix}`;
    try {
      const response = await fetch(url, { redirect: 'manual' });
      const ok = response.status >= 200 && response.status < 400;
      if (!ok) failures.push(`Live check failed: ${url} returned ${response.status}`);
    } catch (error) {
      failures.push(`Live check failed: ${url} (${error.message})`);
    }
  }
}

function printSection(title, items) {
  if (items.length === 0) return;
  console.log(`\n${title}`);
  for (const item of items) console.log(`- ${item}`);
}
