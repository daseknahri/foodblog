# Monetag readiness for KuchniaTwist

KuchniaTwist uses Monetag as the instant monetization test while the Romanian sister site waits for AdSense approval. Monetag is controlled only by environment variables in Coolify and is disabled by default in source.

## Coolify variables

Keep AdSense disabled for this test:

```env
ADSENSE_ENABLE=0
ADSENSE_CLIENT_ID=
ADSENSE_PUB_ID=
```

Add Monetag only after the dashboard gives the exact values:

```env
MONETAG_ENABLE=0
MONETAG_VERIFY_META_NAME=
MONETAG_VERIFY_META_CONTENT=
MONETAG_SCRIPT_SRC=
MONETAG_ZONE_ID=
MONETAG_CFASYNC=false
MONETAG_INPAGE_PUSH_BASE64=
MONETAG_VIGNETTE_BASE64=
MONETAG_ONCLICK_BASE64=
MONETAG_PUSH_BASE64=
MONETAG_INPAGE_PUSH_MINUTES=0
MONETAG_VIGNETTE_MINUTES=0
MONETAG_ONCLICK_MINUTES=0
MONETAG_PUSH_MINUTES=0
MONETAG_POST_ONLY=1
MONETAG_INSTALL_CHECK=0
MONETAG_SW_JS_BASE64=
```

Use this sequence:

1. Set only `MONETAG_VERIFY_META_NAME` and `MONETAG_VERIFY_META_CONTENT`.
2. Redeploy and verify the site in Monetag.
3. Prefer individual zones over Multitag when you want control. Add the exact tags as base64 snippets in `MONETAG_INPAGE_PUSH_BASE64`, `MONETAG_VIGNETTE_BASE64`, `MONETAG_ONCLICK_BASE64`, or `MONETAG_PUSH_BASE64`.
4. If you intentionally use one Multitag, add its script URL to `MONETAG_SCRIPT_SRC` and the `data-zone` number to `MONETAG_ZONE_ID`.
5. If Monetag gives you a `sw.js` file, place it at `content/monetag/sw.js` in the repo, or encode it and add the value to `MONETAG_SW_JS_BASE64`.
6. Set `MONETAG_ENABLE=1` only when the channel is ready.
7. If Monetag's installation checker still fails, temporarily set `MONETAG_INSTALL_CHECK=1`, redeploy, run the checker, then set `MONETAG_INSTALL_CHECK=0` again after the checker passes.
8. Redeploy and test one public post on mobile.

The theme renders the Monetag verification meta tag in the public `<head>` when both verification values exist. The ad script renders only on public single posts. It does not render for logged-in admins, search, 404, feeds, static pages, or legal/policy pages. The homepage remains clean unless temporary installation-check mode is enabled with `MONETAG_INSTALL_CHECK=1`. The MU plugin serves Monetag's HTTPS service-worker file at `/sw.js` when `MONETAG_ENABLE=1`, first from `MONETAG_SW_JS_BASE64` if set, otherwise from the bundled `content/monetag/sw.js` file.

PowerShell command to encode a downloaded `sw.js` file:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\path\to\sw.js"))
```

Example from a Monetag Multitag snippet:

```html
<script src="https://quge5.com/88/tag.min.js" data-zone="235077" async data-cfasync="false"></script>
```

Coolify values:

```env
MONETAG_SCRIPT_SRC=https://quge5.com/88/tag.min.js
MONETAG_ZONE_ID=235077
MONETAG_CFASYNC=false
MONETAG_INSTALL_CHECK=0
```

Example for an individual tag:

```powershell
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes(@'
PASTE_MONETAG_INPAGE_PUSH_OR_VIGNETTE_TAG_HERE
'@))
```

Then set only the format you want:

```env
MONETAG_INPAGE_PUSH_BASE64=PASTE_BASE64_HERE
MONETAG_VIGNETTE_BASE64=PASTE_BASE64_HERE
MONETAG_ONCLICK_BASE64=
MONETAG_PUSH_BASE64=
MONETAG_INPAGE_PUSH_MINUTES=0
MONETAG_VIGNETTE_MINUTES=5
MONETAG_ONCLICK_MINUTES=60
MONETAG_PUSH_MINUTES=0
MONETAG_SCRIPT_SRC=
MONETAG_ZONE_ID=
```

Frequency values are optional client-side guards for individual base64 snippets. `0` means no extra guard. `5` means the format is injected at most once every five minutes per browser. Use provider dashboard frequency caps first when they exist; use these variables as an extra safety belt for formats like Vignette or OnClick.

## Monetag dashboard setup

1. Add `kuchniatwist.pl`.
2. Verify ownership with the meta tag.
3. For controlled optimization, create separate individual zones instead of one Multitag.
4. Week 1 formats: enable In-Page Push and Vignette Banner.
5. Week 1 formats: keep Popunder, Direct Link, SmartLink, and Push Notifications off.
6. Week 2 formats: if earnings are weak and stats look accepted, test OnClick/Popunder with max 1 per user/session if the dashboard allows frequency control.
7. After first payout: if Monetag pays correctly but RPM is weak, test SmartLink only as a real internal "more recipe ideas" CTA. Never make it look like a fake button or site navigation.

Recommended controlled-aggressive defaults:

```env
MONETAG_INPAGE_PUSH_MINUTES=0
MONETAG_VIGNETTE_MINUTES=5
MONETAG_ONCLICK_MINUTES=60
MONETAG_PUSH_MINUTES=0
```

If users report adult, dating, casino, misleading, or redirect-heavy ads, pause the most intrusive format first. Usually that means clearing `MONETAG_ONCLICK_BASE64`, then `MONETAG_VIGNETTE_BASE64`, while keeping cleaner display/native placements active.

## Traffic ramp

Use UTM links for every Facebook post:

```text
https://kuchniatwist.pl/post-slug/?utm_source=facebook&utm_medium=social&utm_campaign=kuchnia_monetag_test&utm_content=post_slug_or_hook
```

Ramp slowly:

1. Days 1-3: 300-500 visitors/day.
2. Days 4-7: 800-1,000 visitors/day.
3. Days 8-14: 1,500-3,000 visitors/day only if stats look normal.
4. Scale harder only after the first payout is received.

Main KPI:

```text
Revenue per 1,000 Facebook clicks = finalized paid revenue / Facebook clicks * 1000
```

Supporting KPIs:

- Pages/session.
- Mobile share.
- Monetag impressions vs pageviews.
- Bounce/engagement.
- Facebook reach after posting links.
- Finalized paid revenue vs dashboard revenue.

## Safety rules

- Do not enable AdSense at the same time during this Monetag test.
- Do not place Monetag on legal, policy, About, Contact, search, 404, or feeds.
- Use homepage rendering only as a temporary Monetag installation check, then turn `MONETAG_INSTALL_CHECK=0` again.
- Do not use fake buttons, fake download actions, misleading CTAs, or forced navigation.
- Do not send Facebook traffic directly to SmartLink at first.
- Do not judge ad quality only from your own country. Check at least one target audience country/device mix because remnant ads can look different by GEO.
- Ask each network to block adult, dating, casino, malware, and misleading software/download categories when available.
- If KuchniaTwist later applies to AdSense, remove aggressive Monetag formats and run clean for 30-60 days before submitting.
- Keep all changes repo-controlled so a redeploy can remove Monetag instantly by setting `MONETAG_ENABLE=0`.

## Acceptance checks

Run source checks before deploy:

```bash
node scripts/verify-content.mjs
node scripts/audit-adsense-readiness.mjs
node scripts/audit-ezoic-readiness.mjs
node scripts/audit-monetag-readiness.mjs
git diff --check
```

Manual checks after deploy:

1. With `MONETAG_ENABLE=0`, view source on the homepage and a post. No Monetag script should appear.
2. With verification env values set, view source on the homepage. The verification meta tag should appear.
3. With `MONETAG_ENABLE=1` and individual base64 tags set, view source on one public recipe/article post. The enabled Monetag snippets should appear.
4. With `MONETAG_ENABLE=1` and `MONETAG_INSTALL_CHECK=1`, view source on the homepage. The Monetag script should appear for the checker.
5. After Monetag passes the installation check, set `MONETAG_INSTALL_CHECK=0`, redeploy, and confirm the homepage script disappears.
6. With `MONETAG_ENABLE=1`, open `https://kuchniatwist.pl/sw.js`. It should return JavaScript, not an HTML page.
7. Check search, 404, feeds, About, Contact, Privacy, Cookies, Advertising, Editorial, Terms, and Disclaimer pages. The Monetag script should not appear.
8. Log in as admin and view a post. The Monetag script should not appear for the admin session.
9. Check the first 3 days for counted impressions, no obvious mobile layout break, no Facebook reach collapse, and no payment or traffic-quality warning.
