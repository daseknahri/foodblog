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
```

The theme supports these placements:

- `header`: below the site header on single posts only.
- `after_intro`: automatically inserted after the second paragraph on single posts.
- `reading_option`: automatically inserted after the sixth paragraph on single posts, intended for a native/display unit that looks like sponsored reading suggestions while remaining clearly labeled as an ad.
- `mid_content`: automatically inserted near the middle of single posts.
- `part_continue`: optional ad before the honest "continue to part 2/3" panel on paginated posts.
- `below_content`: after the main post body.
- `card_grid`: optional sponsored card inside recipe/guide/archive grids, inserted after six real cards.
- `sidebar`: near the bottom of the sidebar.

The display layer does not render on homepage, search, 404, feeds, static pages, legal/policy pages, or logged-in admin views.

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
DISPLAY_AD_CARD_GRID_BASE64=PASTE_BASE64_HERE
DISPLAY_AD_SIDEBAR_BASE64=PASTE_BASE64_HERE
```

## Recommended first setup

Start with cleaner display/native placements:

1. `after_intro`: one native/banner unit.
2. `mid_content`: one native/banner unit.
3. `below_content`: one native/banner unit.
4. `reading_option`: optional next test, preferably a native recommendation unit.
5. `part_continue`: optional 320x50 or 300x250 unit for posts split into 2-3 parts.
6. `card_grid`: optional listing-page test, preferably a native card or 300x250 unit.
7. `sidebar`: optional desktop-friendly native/banner unit.
8. Skip `header` at first unless revenue is weak.

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
5. Watch mobile layout and Facebook engagement for the first 48-72 hours.
