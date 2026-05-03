# Project Status

This is the handoff note for future work on KuchniaTwist.

## Current Role

This repo is the English monetization test site. Keep the Romanian sister site separate and AdSense-clean; use this repo for controlled instant-ad experiments.

## Production Defaults

```env
ADSENSE_ENABLE=0
KT_AD_MODE=baseline
KT_PRELANDER_ENABLE=0
KEPOLI_AUTOSEED_ENABLE=1
KEPOLI_FORCE_RESEED=0
DISPLAY_ADS_ENABLE=1
MONETAG_ENABLE=1
MONETAG_POST_ONLY=1
HISTATS_ENABLE=1
HISTATS_EXCLUDE_ADMINS=1
```

Keep `MONETAG_ONCLICK_BASE64`, `MONETAG_VIGNETTE_BASE64`, `MONETAG_PUSH_BASE64`, `DISPLAY_AD_HEADER_BASE64`, `DISPLAY_AD_CARD_GRID_BASE64`, and `DISPLAY_AD_SIDEBAR_BASE64` empty unless running a deliberate short test.

## Content Workflow

- Admin stays English.
- Public content stays English.
- Use the external AI prompt to generate only title and clean plain-text content.
- In WordPress, choose `Recipe` or `Article`, then use `Auto fill`.
- For long posts, use `Auto split` or `2 parts` / `3 parts`.
- Smart split is tuned for monetization tests: `420+` words for 2 parts and `1100+` words for 3 parts.

## Ad Workflow

- Control ads only from Coolify env.
- Do not paste ad code into WordPress widgets, posts, plugins, or theme editor.
- Add one ad slot at a time and wait at least 48 hours or enough Facebook clicks before judging.
- If redirects or bad ads appear, pause Monetag first, then reading-option/below-content display slots.

## Deployment Rules

- Normal redeploys must not reseed content.
- Keep `KEPOLI_FORCE_RESEED=0` unless intentionally repairing seed data.
- If a repair needs reseed, set `KEPOLI_FORCE_RESEED=1` temporarily, run the repair, then immediately set it back to `0`.

## Checks Before Push

```powershell
node scripts\preflight-launch.mjs
git diff --check
```

For live deploy checks, temporarily set `KEPOLI_DEPLOY_FINGERPRINT=1`, redeploy, run `node scripts\preflight-launch.mjs --live https://kuchniatwist.pl`, then turn the fingerprint off.

## Key Docs

- `docs/ad-operations-manual.md`: daily ad operations and pause order.
- `docs/ad-code-inventory.md`: provider snippets and base64 values.
- `docs/ads-optimization-playbook.md`: testing strategy and stop rules.
- `docs/author-workflow.md`: posting and auto-fill workflow.
- `docs/coolify.md`: deployment and seed safety rules.