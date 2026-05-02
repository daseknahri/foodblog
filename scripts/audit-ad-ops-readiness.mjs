import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];

const playbook = readFile('docs/ads-optimization-playbook.md');
const monetagDocs = readFile('docs/monetag-readiness.md');
const displayDocs = readFile('docs/display-ads-readiness.md');
const preflight = readFile('scripts/preflight-launch.mjs');

checkPlaybook();
checkDocsLinkedToOperations();
checkPreflight();

if (failures.length === 0) {
  console.log('Ad operations readiness OK.');
} else {
  console.log(`Ad operations readiness found ${failures.length} required fix${failures.length === 1 ? '' : 'es'}.`);
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

function requireIncludes(label, content, patterns) {
  for (const pattern of patterns) {
    if (!pattern.test(content)) {
      failures.push(`${label} is missing: ${pattern}`);
    }
  }
}

function checkPlaybook() {
  requireIncludes('docs/ads-optimization-playbook.md', playbook, [
    /Revenue per 1,000 Facebook clicks/,
    /DISPLAY_AD_AFTER_INTRO_BASE64/,
    /DISPLAY_AD_MID_CONTENT_BASE64/,
    /MONETAG_INPAGE_PUSH_MINUTES=0/,
    /MONETAG_VIGNETTE_MINUTES=5/,
    /MONETAG_ONCLICK_MINUTES=60/,
    /KT_AD_MODE=baseline/,
    /KT_PRELANDER_ENABLE=0/,
    /\/prelander\/\{post-slug\}\//,
    /Adult and sexual intent/i,
    /Change one thing at a time/i,
    /48 hours|2,000-5,000 Facebook clicks/,
    /Stop rules/i,
    /first payout/i,
  ]);
}

function checkDocsLinkedToOperations() {
  requireIncludes('docs/monetag-readiness.md operations notes', monetagDocs, [
    /frequency/i,
    /adult/i,
    /MONETAG_VIGNETTE_MINUTES=5/,
  ]);

  requireIncludes('docs/display-ads-readiness.md operations notes', displayDocs, [
    /after_intro/i,
    /mid_content/i,
    /Watch mobile layout and Facebook engagement/i,
  ]);
}

function checkPreflight() {
  requireIncludes('scripts/preflight-launch.mjs', preflight, [
    /Ad operations readiness/,
    /audit-ad-ops-readiness\.mjs/,
    /audit-prelander-readiness\.mjs/,
  ]);
}
