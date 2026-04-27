# kuchniatwist WordPress Blog

kuchniatwist is a GitHub-driven WordPress food blog for English recipes and practical kitchen guides. The repo contains the Docker Compose stack, custom theme, launch content, image plan, featured images, and WP-CLI bootstrap used by Coolify.

## What This Repo Builds

- WordPress with MariaDB, deployed by Docker Compose with kuchniatwist-specific images built from this repo.
- A reusable internal `kepoli` theme focused on reading, recipes, internal links, newsletter capture, and ad-safe layouts.
- Production Apache settings for static asset caching, compression, and small security headers.
- A one-shot `wp-init` seed profile for manual reseeding, plus a self-seeding MU plugin for platforms that skip the profile service.
- A compact authoring plugin that keeps the WordPress admin in English and helps fill SEO, image, recipe, internal-link, and split-post fields.
- Google Site Kit installation for later Search Console, Analytics, or AdSense connection from WordPress admin.
- Ezoic-first monetization defaults: direct ad rendering stays off unless explicit environment variables enable it.

## Content Status

- 20 original English launch posts: 15 recipes and 5 guides.
- 12 public pages: home, recipes, guides, about, author, contact, privacy, cookies, advertising/consent, editorial policy, terms, and culinary disclaimer.
- 20 matching featured-image files in `content/images/`.
- Image metadata and generation prompts are stored in `content/image-plan.json`.

## Coolify

1. Push this repo to GitHub.
2. In Coolify, create a Docker Compose application from the GitHub repo.
3. Use only `docker-compose.yml`.
4. Add the environment variables from `.env.example`.
5. Assign `https://kuchniatwist.pl` to the `wordpress` service on port `80`. The compose file also exposes `SERVICE_FQDN_WORDPRESS_80=https://kuchniatwist.pl` for Coolify's proxy routing.
6. Keep the `seed` profile disabled for normal deploys. WordPress self-seeds automatically from the app image.
7. Enable GitHub auto-deploy on push.

The `CANONICAL_REDIRECT_HOSTS` value should include hostnames that may reach the app, such as `www.kuchniatwist.pl`. The MU plugin redirects those hosts to `SITE_URL` so readers and search engines see one canonical site.

If you need to manually reseed after launch, run:

```sh
docker compose --profile seed run --rm wp-init
```

## Ezoic Notes

This clone is set up for Ezoic review first. Keep direct AdSense placements disabled during review:

```env
ADSENSE_ENABLE=0
GA_ENABLE=0
```

After approval, configure Ezoic from the dashboard or through the integration method Ezoic recommends for the account. Confirm the final `ads.txt` setup from Ezoic before enabling live monetization.

For Ezoic Ads.txt Manager, set one of these in Coolify after Ezoic gives the value:

```env
EZOIC_ADSTXT_ACCOUNT_ID=19390
# or
EZOIC_ADSTXT_REDIRECT_URL=https://srv.adstxtmanager.com/19390/kuchniatwist.pl
```

## Newsletter

The newsletter signup is a small native WordPress form on the front page and the About kuchniatwist page. Signups are stored in WordPress admin under `Newsletter`, where they can be reviewed or exported as CSV.

## Author Writing

The `kepoli-author-tools` plugin keeps the writing workflow simple for beginner publishers. It can auto-fill excerpt, meta description, related links, featured-image metadata, recipe schema fields, category suggestions, tags, FAQ blocks, and post splits. See `docs/author-workflow.md` for the exact writing flow.

## Checks

Run these before pushing a launch change:

```sh
node scripts/preflight-launch.mjs
```

To include the live site too:

```sh
node scripts/preflight-launch.mjs --live https://kuchniatwist.pl
```

## Media

The current repo includes SVG logo assets and generated starter featured images. If you add exact bitmap brand assets later, place them at:

- `wp-content/themes/kepoli/assets/img/kuchniatwist-wordmark.png`
- `wp-content/themes/kepoli/assets/img/kuchniatwist-icon.png`
- `wp-content/themes/kepoli/assets/img/writer-photo.jpg`

The theme automatically prefers those filenames when present.
