# Ads optimization playbook for KuchniaTwist

This site is the controlled instant-monetization test. The goal is not to show the maximum number of ads on day one. The goal is to find the best revenue per 1,000 Facebook clicks while keeping the site believable, readable, and safe for future cleanup.

## Current baseline

Use this as the default stack while the site is young:

```env
ADSENSE_ENABLE=0
DISPLAY_ADS_ENABLE=1
DISPLAY_ADS_PROVIDER=adsterra
MONETAG_ENABLE=1
MONETAG_POST_ONLY=1
MONETAG_INSTALL_CHECK=0
MONETAG_SCRIPT_SRC=
MONETAG_ZONE_ID=
MONETAG_ONCLICK_BASE64=
MONETAG_PUSH_BASE64=
MONETAG_INPAGE_PUSH_MINUTES=0
MONETAG_VIGNETTE_MINUTES=5
MONETAG_ONCLICK_MINUTES=60
MONETAG_PUSH_MINUTES=0
```

Recommended visible display stack:

- Keep `DISPLAY_AD_AFTER_INTRO_BASE64` active.
- Keep `DISPLAY_AD_MID_CONTENT_BASE64` active.
- Keep `DISPLAY_AD_BELOW_CONTENT_BASE64` empty at first.
- Keep `DISPLAY_AD_SIDEBAR_BASE64` empty at first.
- Add `below_content` only if RPM is weak and mobile readability stays good.

Recommended Monetag stack:

- Keep In-Page Push active if ad quality is acceptable.
- Keep Vignette active only if it does not create bad user reports or Facebook reach collapse.
- Keep OnClick/Popunder off until after the first payout.
- Keep Push Notifications off unless there is a clear long-term reason to build subscribers.

## Quality controls

Ask every ad network to block these categories where possible:

- Adult and sexual intent.
- Dating.
- Casino, gambling, and betting.
- Fake download, system warning, antivirus, cleaner, or software-update creatives.
- Misleading health, miracle cure, or fear-based creatives.
- Deceptive subscription or sweepstakes creatives.

Ad quality varies by GEO, device, browser, and advertiser inventory. A bad Morocco preview does not always mean the same ad will show to the Facebook audience, but it is still a warning signal. If one format repeatedly shows low-quality creatives, pause that format before pausing the whole stack.

## Test method

Change one thing at a time and leave it running long enough to measure. A clean test needs at least 48 hours or 2,000-5,000 Facebook clicks, whichever comes later.

Track this for every test:

```text
Date range:
Traffic source:
Post URLs:
Facebook clicks:
Pageviews:
Pages/session:
Mobile share:
Adsterra revenue:
Monetag revenue:
Finalized paid revenue:
Revenue per 1,000 Facebook clicks:
Complaints or bad ad examples:
Facebook reach change:
Decision:
```

Main KPI:

```text
Revenue per 1,000 Facebook clicks = finalized paid revenue / Facebook clicks * 1000
```

Do not optimize only for dashboard CPM. A format can show high CPM and still reduce real earnings if it hurts Facebook reach, causes users to leave, or gets rejected before payout.

## Experiment ladder

Use this order. Do not jump to the bottom early.

1. Baseline: Adsterra after-intro + mid-content, Monetag In-Page Push, Monetag Vignette every 5 minutes.
2. Cleaner mode: pause Vignette if adult/redirect-heavy ads appear, keep In-Page Push plus display.
3. More display: add below-content 320x50 or native only if readability remains good.
4. Desktop sidebar: add sidebar only if desktop traffic is meaningful.
5. Aggressive test: add OnClick/Popunder only after first payout, with provider cap plus `MONETAG_ONCLICK_MINUTES=60`.
6. Direct/SmartLink test: only use as a real "more recipe ideas" link, never as fake navigation or a fake button.

## Coolify controls

To pause Monetag instantly:

```env
MONETAG_ENABLE=0
```

To pause only Vignette:

```env
MONETAG_VIGNETTE_BASE64=
```

To keep Vignette but reduce frequency:

```env
MONETAG_VIGNETTE_MINUTES=10
```

To pause all display/native ads:

```env
DISPLAY_ADS_ENABLE=0
```

To make the page cleaner without disabling display entirely:

```env
DISPLAY_AD_BELOW_CONTENT_BASE64=
DISPLAY_AD_SIDEBAR_BASE64=
```

## Stop rules

Stop or reduce the current test if any of these happen:

- Facebook reach drops sharply after posting links.
- Users report forced redirects, adult ads, fake warnings, or scam-like creatives.
- Ads cover recipe content or make the page hard to scroll.
- The dashboard shows traffic-quality, policy, or payment warnings.
- Dashboard revenue is high but finalized revenue is cut heavily.

When in doubt, protect the domain. A slightly lower RPM on a clean site is better than a short spike that kills the traffic source or makes the domain hard to reuse.
