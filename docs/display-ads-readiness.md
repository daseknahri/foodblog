# Display/native ad readiness for KuchniaTwist

KuchniaTwist can run clean native/display ad snippets alongside Monetag. This layer is disabled by default and controlled only from Coolify.

## Coolify variables

Keep AdSense disabled while testing third-party display snippets:

```env
ADSENSE_ENABLE=0
```

Display/native defaults:

```env
DISPLAY_ADS_ENABLE=0
DISPLAY_ADS_PROVIDER=adsterra
DISPLAY_AD_HEADER_BASE64=
DISPLAY_AD_AFTER_INTRO_BASE64=
DISPLAY_AD_READING_OPTION_BASE64=
DISPLAY_AD_MID_CONTENT_BASE64=
DISPLAY_AD_PART_CONTINUE_BASE64=
DISPLAY_AD_BELOW_CONTENT_BASE64=
DISPLAY_AD_CARD_GRID_BASE64=
DISPLAY_AD_SIDEBAR_BASE64=
DISPLAY_AD_STICKY_BOTTOM_BASE64=
DISPLAY_AD_STICKY_BOTTOM_MIN_SECONDS=35
DISPLAY_AD_STICKY_BOTTOM_MIN_SCROLL=30
DISPLAY_AD_STICKY_BOTTOM_COOLDOWN_MINUTES=30
```

The theme supports these placements:

- `header`: below the site header on single posts only.
- `after_intro`: automatically inserted after the second paragraph on single posts.
- `reading_option`: automatically inserted after the sixth paragraph on single posts, intended for a native/display unit that looks like sponsored reading suggestions while remaining clearly labeled as an ad.
- `mid_content`: automatically inserted near the middle of single posts.
- `part_continue`: optional light unit before simple part navigation on paginated posts.
- `below_content`: after the main post body.
- `card_grid`: reserved for future controlled tests. Do not inject it automatically into listing grids because third-party native widgets can break mobile layout or listing stability.
- `sidebar`: near the bottom of the sidebar.
- `sticky_bottom`: optional mobile-only sticky display unit. It loads after the time and scroll gates, includes a close button, and honors the close cooldown.

The display layer does not render on homepage, search, 404, feeds, static pages, legal/policy pages, or logged-in admin views.

For debugging only, append `?kt_sticky_debug=1` to a single post URL after deployment. This bypasses the mobile, time, scroll, and close-cooldown gates for that request so you can confirm the sticky slot is configured and rendered. Do not use the debug URL in Facebook posts.

## Encoding provider snippets

Create the native/banner zone in the provider dashboard, then encode the exact HTML/JS snippet before adding it to Coolify.

PowerShell example:

```powershell
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes(@'
PASTE_PROVIDER_SNIPPET_HERE
'@))
```

Then paste the encoded value into the matching placement, for example:

```env
DISPLAY_ADS_ENABLE=1
DISPLAY_ADS_PROVIDER=adsterra
DISPLAY_AD_AFTER_INTRO_BASE64=PASTE_BASE64_HERE
DISPLAY_AD_READING_OPTION_BASE64=PASTE_BASE64_HERE
DISPLAY_AD_MID_CONTENT_BASE64=PASTE_BASE64_HERE
DISPLAY_AD_PART_CONTINUE_BASE64=PASTE_BASE64_HERE
DISPLAY_AD_BELOW_CONTENT_BASE64=PASTE_BASE64_HERE
DISPLAY_AD_CARD_GRID_BASE64=
DISPLAY_AD_SIDEBAR_BASE64=PASTE_BASE64_HERE
DISPLAY_AD_STICKY_BOTTOM_BASE64=
```

## Recommended first setup

Start with cleaner display/native placements:

1. `after_intro`: one native/banner unit.
2. `mid_content`: one native/banner unit.
3. `part_continue`: one light unit before simple part navigation on paginated posts.
4. `reading_option`: optional next test, preferably a native recommendation unit.
5. `below_content`: optional, only if readability remains good.
6. `sticky_bottom`: optional high-viewability mobile test with a `320x50` banner, only after baseline ads are stable.
7. `card_grid`: keep empty unless we intentionally re-test listing ads later.
8. `sidebar`: optional desktop-friendly native/banner unit.
9. Skip `header` at first unless revenue is weak.

Do not add fake download buttons, misleading labels, or SmartLink-style CTAs inside display slots. The wrapper already labels the placement as "Advertisement".

## Acceptance checks

Run before deploy:

```bash
node scripts/audit-display-ads-readiness.mjs
node scripts/preflight-launch.mjs
git diff --check
```

Manual checks after deploy:

1. With `DISPLAY_ADS_ENABLE=0`, no display/native snippets should appear.
2. With `DISPLAY_ADS_ENABLE=1`, a public post should show configured display slots.
3. Homepage, legal pages, search, 404, feeds, and logged-in admin views should not show display snippets.
4. Confirm Monetag still works on public posts if `MONETAG_ENABLE=1`.
5. Confirm the sticky slot with `?kt_sticky_debug=1`, then test the normal URL on mobile after the time and scroll gates.
6. Watch mobile layout and Facebook engagement for the first 48-72 hours.
