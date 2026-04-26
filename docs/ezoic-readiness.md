# Ezoic Readiness

This clone is prepared for Ezoic review as an English food blog on `https://kuchniatwist.pl`.

## Before Submission

- Publish real English recipes and kitchen guides.
- Use original or properly licensed food images.
- Keep the author page, about page, contact page, privacy policy, cookie policy, editorial policy, terms, and advertising/consent page published.
- Keep direct ads disabled in hosting: `ADSENSE_ENABLE=0`.
- Do not add popup newsletter code or Reader Revenue Manager scripts.
- Keep the native newsletter form only on the home/about areas unless the design changes later.
- Make sure `www.kuchniatwist.pl` redirects to `https://kuchniatwist.pl`.

## After Ezoic Approval

- Configure the site from the Ezoic dashboard or the integration method Ezoic recommends for the account.
- Let Ezoic handle ad placement until there is enough traffic data to tune placements.
- Confirm `ads.txt` using the method Ezoic requires for the active integration.
- Configure consent/privacy messaging from the monetization platform or approved CMP path before personalized ads are shown.
- Keep direct AdSense variables empty unless you intentionally run direct AdSense placements outside Ezoic.

## Environment Defaults

For the initial Ezoic submission:

```env
SITE_URL=https://kuchniatwist.pl
SITE_EMAIL=contact@kuchniatwist.pl
WP_LOCALE=en_US
CANONICAL_REDIRECT_HOSTS=www.kuchniatwist.pl
ADSENSE_ENABLE=0
GA_ENABLE=0
```

`ADSENSE_*` variables remain in the project only because the original theme engine supports direct AdSense slots. They are inactive unless explicitly enabled.
