import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];

const env = readEnv('.env.example');
const compose = readFile('docker-compose.yml');
const functionsPhp = readFile('wp-content/themes/kepoli/functions.php');
const singlePhp = readFile('wp-content/themes/kepoli/single.php');
const sidebarPhp = readFile('wp-content/themes/kepoli/template-parts-sidebar.php');
const listingGridPhp = [
  readFile('wp-content/themes/kepoli/archive.php'),
  readFile('wp-content/themes/kepoli/index.php'),
  readFile('wp-content/themes/kepoli/page-recipes.php'),
  readFile('wp-content/themes/kepoli/page-guides.php'),
  readFile('wp-content/themes/kepoli/page-about-author.php'),
].join('\n');
const styleCss = readFile('wp-content/themes/kepoli/style.css');
const styleMinCss = readFile('wp-content/themes/kepoli/style.min.css');
const docs = readFile('docs/display-ads-readiness.md');

checkEnv();
checkCompose();
checkTheme();
checkStyles();
checkDocs();

if (failures.length === 0) {
  console.log('Display ads readiness OK.');
} else {
  console.log(`Display ads readiness found ${failures.length} required fix${failures.length === 1 ? '' : 'es'}.`);
  console.log('\nRequired fixes:');
  for (const failure of failures) {
    console.log(`- ${failure}`);
  }
}

process.exit(failures.length > 0 ? 1 : 0);

function readFile(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    failures.push(`Missing file: ${relativePath}`);
    return '';
  }

  return fs.readFileSync(absolutePath, 'utf8');
}

function readEnv(relativePath) {
  const values = new Map();
  const content = readFile(relativePath);
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const equalIndex = trimmed.indexOf('=');
    if (equalIndex === -1) continue;
    values.set(trimmed.slice(0, equalIndex), trimmed.slice(equalIndex + 1));
  }

  return values;
}

function envValue(key) {
  return String(env.get(key) ?? '').trim();
}

function occurrences(value, pattern) {
  return (String(value).match(new RegExp(escapeRegExp(pattern), 'g')) || []).length;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function requireIncludes(label, content, patterns) {
  for (const pattern of patterns) {
    if (!pattern.test(content)) {
      failures.push(`${label} is missing: ${pattern}`);
    }
  }
}

function checkEnv() {
  const defaults = new Map([
    ['DISPLAY_ADS_ENABLE', '0'],
    ['DISPLAY_ADS_PROVIDER', 'adsterra'],
    ['DISPLAY_AD_HEADER_BASE64', ''],
    ['DISPLAY_AD_AFTER_INTRO_BASE64', ''],
    ['DISPLAY_AD_READING_OPTION_BASE64', ''],
    ['DISPLAY_AD_MID_CONTENT_BASE64', ''],
    ['DISPLAY_AD_PART_CONTINUE_BASE64', ''],
    ['DISPLAY_AD_BELOW_CONTENT_BASE64', ''],
    ['DISPLAY_AD_CARD_GRID_BASE64', ''],
    ['DISPLAY_AD_SIDEBAR_BASE64', ''],
    ['DISPLAY_AD_STICKY_BOTTOM_BASE64', ''],
    ['DISPLAY_AD_STICKY_BOTTOM_MIN_SECONDS', '35'],
    ['DISPLAY_AD_STICKY_BOTTOM_MIN_SCROLL', '30'],
    ['DISPLAY_AD_STICKY_BOTTOM_COOLDOWN_MINUTES', '30'],
  ]);

  for (const [key, expected] of defaults.entries()) {
    if (!env.has(key)) {
      failures.push(`.env.example is missing ${key}.`);
    } else if (envValue(key) !== expected) {
      failures.push(`.env.example must default ${key}=${expected}.`);
    }
  }
}

function checkCompose() {
  for (const key of [
    'DISPLAY_ADS_ENABLE',
    'DISPLAY_ADS_PROVIDER',
    'DISPLAY_AD_HEADER_BASE64',
    'DISPLAY_AD_AFTER_INTRO_BASE64',
    'DISPLAY_AD_READING_OPTION_BASE64',
    'DISPLAY_AD_MID_CONTENT_BASE64',
    'DISPLAY_AD_PART_CONTINUE_BASE64',
    'DISPLAY_AD_BELOW_CONTENT_BASE64',
    'DISPLAY_AD_CARD_GRID_BASE64',
    'DISPLAY_AD_SIDEBAR_BASE64',
    'DISPLAY_AD_STICKY_BOTTOM_BASE64',
    'DISPLAY_AD_STICKY_BOTTOM_MIN_SECONDS',
    'DISPLAY_AD_STICKY_BOTTOM_MIN_SCROLL',
    'DISPLAY_AD_STICKY_BOTTOM_COOLDOWN_MINUTES',
  ]) {
    if (occurrences(compose, key) < 2) {
      failures.push(`docker-compose.yml must pass ${key} to both wordpress and wp-init.`);
    }
  }
}

function checkTheme() {
  requireIncludes('theme display ad helpers', functionsPhp, [
    /function\s+kepoli_display_ads_enabled\s*\(/,
    /function\s+kepoli_display_ads_should_render\s*\(/,
    /function\s+kepoli_display_ad_code\s*\(/,
    /function\s+kepoli_display_ad_slot\s*\(/,
    /function\s+kepoli_display_sticky_bottom_ad\s*\(/,
    /function\s+kepoli_display_card_grid_ad\s*\(/,
    /function\s+kepoli_multipart_continue_ad\s*\(/,
    /function\s+kepoli_multipart_page_links\s*\(/,
    /function\s+kepoli_content_display_ads\s*\(/,
    /DISPLAY_ADS_ENABLE/,
    /DISPLAY_ADS_PROVIDER/,
    /DISPLAY_AD_'\s*\.\s*\$slot_key\s*\.\s*'_BASE64/,
    /base64_decode\(\$encoded,\s*true\)/,
    /data-display-ad-slot/,
    /data-sticky-bottom-ad/,
    /ad-slot__label/,
  ]);

  requireIncludes('display ad public-only gate', functionsPhp, [
    /is_admin\(\)/,
    /wp_doing_ajax\(\)/,
    /is_feed\(\)/,
    /is_search\(\)/,
    /is_404\(\)/,
    /is_user_logged_in\(\)\s*&&\s*current_user_can\('manage_options'\)/,
    /is_singular\('post'\)/,
  ]);

  requireIncludes('display ad automatic insertion', functionsPhp, [
    /kepoli_ad_slot\('after_intro'\)/,
    /kepoli_ad_slot\('reading_option'/,
    /kepoli_ad_slot\('mid_content'\)/,
    /kepoli_insert_after_nth_paragraph/,
    /add_filter\('the_content',\s*'kepoli_content_display_ads',\s*12\)/,
  ]);

  if (listingGridPhp.includes('kepoli_display_card_grid_ad()')) {
    failures.push('Listing templates must not inject card-grid ads automatically; keep listing pages clean and stable.');
  }

  requireIncludes('single post display slots', singlePhp, [
    /kepoli_ad_slot\('below_content'\)/,
    /kepoli_multipart_continue_ad\(\)/,
    /kepoli_multipart_page_links\(\)/,
  ]);

  requireIncludes('sidebar display slot', sidebarPhp, [
    /kepoli_ad_slot\('sidebar'/,
  ]);
}

function checkStyles() {
  requireIncludes('style.css display ad styles', styleCss, [
    /\.ad-slot--display/,
    /\.ad-slot__label/,
    /\.ad-slot__creative/,
    /\.ad-slot--after-intro/,
    /\.ad-slot--mid-content/,
    /\.ad-slot--card-grid/,
    /\.ad-slot--sticky-bottom/,
  ]);

  requireIncludes('style.min.css display ad styles', styleMinCss, [
    /\.ad-slot--display/,
    /\.ad-slot__label/,
    /\.ad-slot__creative/,
    /\.ad-slot--sticky-bottom/,
  ]);
}

function checkDocs() {
  requireIncludes('docs/display-ads-readiness.md', docs, [
    /DISPLAY_ADS_ENABLE=0/,
    /DISPLAY_AD_AFTER_INTRO_BASE64=/,
    /DISPLAY_AD_READING_OPTION_BASE64=/,
    /DISPLAY_AD_MID_CONTENT_BASE64=/,
    /DISPLAY_AD_PART_CONTINUE_BASE64=/,
    /DISPLAY_AD_BELOW_CONTENT_BASE64=/,
    /DISPLAY_AD_CARD_GRID_BASE64=/,
    /DISPLAY_AD_SIDEBAR_BASE64=/,
    /DISPLAY_AD_STICKY_BOTTOM_BASE64=/,
    /base64/i,
    /homepage/i,
    /legal/i,
    /logged-in admin/i,
  ]);
}
