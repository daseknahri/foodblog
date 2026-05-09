# Ezoic Readiness

This clone is prepared for Ezoic review as an English health-facts blog on `https://health.ibnbatoutaweb.com`.

## Before Submission

- Publish real English recipes and kitchen guides.
- Use original or properly licensed food images.
- Keep the author page, about page, contact page, privacy policy, cookie policy, editorial policy, terms, and advertising/consent page published.
- Keep direct ads disabled in hosting: `ADSENSE_ENABLE=0`.
- Do not add popup newsletter code or Reader Revenue Manager scripts.
- Keep the native newsletter form only on the home/about areas unless the design changes later.
- Make sure `www.health.ibnbatoutaweb.com` redirects to `https://health.ibnbatoutaweb.com`.
- Keep `/ads.txt` reachable. Before Ezoic gives you an Ads.txt Manager ID, the site serves a harmless placeholder. After Ezoic gives the ID, set `EZOIC_ADSTXT_ACCOUNT_ID`.
- Keep `EZOIC_PLUGIN_ENABLE=0` until you intentionally enable the Ezoic WordPress plugin from the Ezoic dashboard flow.

## After Ezoic Approval

- Configure the site from the Ezoic dashboard or the integration method Ezoic recommends for the account.
- Let Ezoic handle ad placement until there is enough traffic data to tune placements.
- Confirm `ads.txt` using Ezoic's Ads.txt Manager. Ezoic's current docs say ads.txt setup is required for publishers using Ezoic and recommend the WordPress plugin for WordPress sites. This repo also supports a server-side redirect:

```env
EZOIC_ADSTXT_ACCOUNT_ID=19390
```

If Ezoic gives a custom redirect URL instead of just an account ID, use:

```env
EZOIC_ADSTXT_REDIRECT_URL=https://srv.adstxtmanager.com/19390/health.ibnbatoutaweb.com
```

- Configure consent/privacy messaging from the monetization platform or approved CMP path before personalized ads are shown.
- Keep direct AdSense variables empty unless you intentionally run direct AdSense placements outside Ezoic.

## Environment Defaults

For the initial Ezoic submission:

```env
SITE_URL=https://health.ibnbatoutaweb.com
SITE_EMAIL=contact@health.ibnbatoutaweb.com
WP_LOCALE=en_US
CANONICAL_REDIRECT_HOSTS=www.health.ibnbatoutaweb.com
ADSENSE_ENABLE=0
EZOIC_ADSTXT_ACCOUNT_ID=
EZOIC_ADSTXT_REDIRECT_URL=
EZOIC_PLUGIN_ENABLE=0
GA_ENABLE=0
```

`ADSENSE_*` variables remain in the project only because the original theme engine supports direct AdSense slots. They are inactive unless explicitly enabled.

## Checks

Before submission or after a deploy, run:

```sh
node scripts/audit-ezoic-readiness.mjs
```

To check the live site too:

```sh
node scripts/audit-ezoic-readiness.mjs --live https://health.ibnbatoutaweb.com
```
