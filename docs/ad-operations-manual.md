# KuchniaTwist ad operations manual

This is the day-to-day operating guide for ads on KuchniaTwist. Use it when adding, removing, testing, or debugging ads. The goal is simple: keep the site profitable, readable, and controllable from Coolify.

The Romanian sister site is not part of this setup and stays AdSense-clean.

## Control model

All ads are controlled through Coolify environment variables.

Do not paste ad code into:

- WordPress theme editor.
- WordPress widgets.
- Random ad plugins.
- Post content.
- Template PHP.

The repo provides safe placements. Coolify decides which placements are active.

## Current safe baseline

This is the default working stack for Facebook/mobile traffic:

```env
ADSENSE_ENABLE=0
KT_AD_MODE=baseline
KT_PRELANDER_ENABLE=0
KT_ACTION_AD_MIN_SECONDS=45
KT_ACTION_AD_MIN_SCROLL=35
DISPLAY_ADS_ENABLE=1
DISPLAY_ADS_PROVIDER=adsterra
MONETAG_ENABLE=1
MONETAG_POST_ONLY=1
MONETAG_INSTALL_CHECK=0
```

Recommended active slots:

| Env variable | Recommended format | Where it appears | Risk |
| --- | --- | --- | --- |
| `DISPLAY_AD_AFTER_INTRO_BASE64` | Adsterra `300x250` | After early intro paragraphs on single posts | Low |
| `DISPLAY_AD_MID_CONTENT_BASE64` | Adsterra `468x60` or `300x250` | Around the middle of single posts | Low |
| `DISPLAY_AD_PART_CONTINUE_BASE64` | Adsterra `320x50` | Before simple Part 1 / Part 2 navigation | Low |
| `DISPLAY_AD_READING_OPTION_BASE64` | Adsterra Native Banner | After the reader has consumed more content | Medium |
| `DISPLAY_AD_BELOW_CONTENT_BASE64` | Adsterra `320x50` | After post content | Low-medium |
| `DISPLAY_AD_STICKY_BOTTOM_BASE64` | Adsterra `320x50` | Mobile-only sticky slot after time + scroll gates | Medium |
| `MONETAG_INPAGE_PUSH_BASE64` | Monetag In-Page Push | Single posts only, if mode allows it | Medium |

Recommended empty slots for now:

```env
DISPLAY_AD_HEADER_BASE64=
DISPLAY_AD_CARD_GRID_BASE64=
DISPLAY_AD_SIDEBAR_BASE64=
DISPLAY_AD_STICKY_BOTTOM_BASE64=
MONETAG_VIGNETTE_BASE64=
MONETAG_ONCLICK_BASE64=
MONETAG_PUSH_BASE64=
MONETAG_SW_JS_BASE64=
```

## Slot rules

`after_intro` is for a normal display unit. Use `300x250` first. It is usually the best balance of visibility and UX.

`mid_content` is for a clean banner/display unit. Use `468x60` if the page feels too heavy, or `300x250` if RPM is weak.

`part_continue` is for monetizing engaged readers who click through multipart posts. Use `320x50`; do not use heavy native widgets here.

`reading_option` is for Native Banner only. It can earn, but it must stay clearly labeled by the wrapper as an ad. Do not make it look like site navigation.

`below_content` is optional. It is safer than popups, but can make the page feel ad-heavy if every earlier slot is already active.

`sticky_bottom` is a mobile-only high-viewability test. Use a `320x50` unit, keep the close button, and keep the default time/scroll/cooldown gates.

`card_grid` must stay empty unless we intentionally test it. Third-party native widgets can break mobile listing pages.

`sidebar` is desktop-only testing territory. It is not important for Facebook/mobile traffic.

`header` should stay empty while the site is young. Header ads make the site feel cheap very quickly.

## Monetag mode rules

`baseline` is the normal mode. Use display ads and optionally a clean In-Page Push only if we decide the UX is acceptable. Keep Vignette, OnClick, Push, and Direct Link off.

`medium` is for controlled tests. It allows action-triggered OnClick only after real user intent, time on page, and scroll depth.

`aggressive` is for short experiments only. Never leave the whole site in aggressive mode.

Use these guard values:

```env
KT_ACTION_AD_MIN_SECONDS=45
KT_ACTION_AD_MIN_SCROLL=35
MONETAG_ONCLICK_MINUTES=60
MONETAG_VIGNETTE_MINUTES=15
```

## How to add a new display ad

1. Choose the placement from the slot table.
2. Get the exact ad snippet from Adsterra.
3. Encode it to Base64 in PowerShell.
4. Paste the Base64 value into the matching Coolify env variable.
5. Redeploy.
6. Test one mobile post and one desktop post.
7. Leave the test running for at least 48 hours or 2,000 Facebook clicks before judging.

PowerShell encoder:

```powershell
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes(@'
PASTE_PROVIDER_SNIPPET_HERE
'@))
```

Do not add more than one new placement in the same test window.

## How to remove or pause ads fast

Pause all display/native ads:

```env
DISPLAY_ADS_ENABLE=0
```

Pause Monetag:

```env
MONETAG_ENABLE=0
```

Return to the cleanest safe stack:

```env
KT_AD_MODE=baseline
DISPLAY_AD_CARD_GRID_BASE64=
DISPLAY_AD_HEADER_BASE64=
DISPLAY_AD_SIDEBAR_BASE64=
DISPLAY_AD_STICKY_BOTTOM_BASE64=
MONETAG_VIGNETTE_BASE64=
MONETAG_ONCLICK_BASE64=
MONETAG_PUSH_BASE64=
MONETAG_SW_JS_BASE64=
```

If users report forced redirects, pause in this order:

1. `MONETAG_ONCLICK_BASE64`
2. `MONETAG_VIGNETTE_BASE64`
3. `MONETAG_PUSH_BASE64`
4. `MONETAG_INPAGE_PUSH_BASE64`
5. `DISPLAY_AD_READING_OPTION_BASE64`
6. `DISPLAY_AD_STICKY_BOTTOM_BASE64`
7. `DISPLAY_AD_BELOW_CONTENT_BASE64`

## Test ladder

Use this order when increasing monetization:

1. Baseline display: `after_intro`, `mid_content`, `part_continue`.
2. Add `below_content` if mobile still feels clean.
3. Add `reading_option` with Native Banner.
4. Add `sticky_bottom` with a `320x50` unit only if mobile still feels clean.
5. Add Monetag In-Page Push only if display RPM is weak.
6. Test prelander links for selected Facebook posts.
7. Test `medium` mode with action-triggered OnClick only after tracking is working.
8. Test Vignette only in a short `aggressive` window with cooldown.
9. Test Direct Link only as a real optional "more ideas" link, never as fake navigation.

## Do not use yet

Avoid these until there is analytics, first payout confidence, and a clear test window:

- Monetag OnClick/Popunder.
- Monetag Vignette.
- Monetag Push Notifications.
- Monetag Direct Link.
- Adsterra `card_grid`.
- Header ads.
- Fake download or fake continue buttons.

## Measurement template

Create one row per test:

```text
Date range:
Ad change:
Coolify env changed:
Post URLs:
Facebook clicks:
Pageviews:
Average time:
Pages/session:
Adsterra revenue:
Monetag revenue:
Finalized revenue:
Revenue per 1,000 Facebook clicks:
Bad ad reports:
Facebook reach change:
Decision:
```

Main KPI:

```text
Revenue per 1,000 Facebook clicks = finalized paid revenue / Facebook clicks * 1000
```

Do not judge only by dashboard CPM. Finalized revenue and Facebook reach matter more.

## Pre-deploy checks

Run these before pushing ad-code or ad-contract changes:

```bash
node scripts/audit-display-ads-readiness.mjs
node scripts/audit-monetag-readiness.mjs
node scripts/audit-ad-ops-readiness.mjs
node scripts/preflight-launch.mjs
git diff --check
```

## Related docs

- `docs/ad-code-inventory.md`: raw provider code and Base64 values.
- `docs/ads-optimization-playbook.md`: strategy, ramp, and stop rules.
- `docs/display-ads-readiness.md`: display/native slot contract.
- `docs/monetag-readiness.md`: Monetag env contract and safety rules.
