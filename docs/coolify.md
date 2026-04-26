# Coolify Deployment Checklist

1. Connect the GitHub repository to Coolify as a Docker Compose application.
2. Set the branch to `main`.
3. Use the root `docker-compose.yml` only.
4. Let Coolify build the repo image `kuchniatwist-wordpress`.
5. Assign the domain `https://kuchniatwist.pl` to service `wordpress`, port `80`.
   - The compose file also defines `SERVICE_FQDN_WORDPRESS_80=https://kuchniatwist.pl` and `PORT=80` for Coolify's proxy routing.
   - Do not publish host port `80` with a `ports:` mapping in production; Coolify's proxy should route to the container's internal port `80`.
6. Add persistent volumes created by Compose:
   - `kuchniatwist_db`
   - `kuchniatwist_wordpress`
   - `kuchniatwist_uploads`
7. Add all required variables from `.env.example`.
8. Enable GitHub auto-deploy.
9. Leave the `seed` profile disabled for normal deploys. The `wordpress` container self-seeds automatically.

If a manual reseed is needed later, run:

```sh
docker compose --profile seed run --rm wp-init
```

`wp-init` is intentionally one-shot and is hidden behind the `seed` Compose profile so Coolify does not treat its clean exit as a failed deployment. The public service to monitor is `wordpress`.

Do not use `docker-compose.local.yml` in Coolify. That override publishes host port `8080` for local development and can fail on shared servers when the port is already allocated. Production should use domain routing to the `wordpress` service on container port `80`.

If Coolify skips or stops the one-shot service, the `wordpress` image already contains `seed` and `content`; the `kepoli-autoseed` MU plugin runs the seed once on the next request and activates the kuchniatwist theme.

For a temporary deploy check, set `KEPOLI_DEPLOY_FINGERPRINT=1`, redeploy, then verify the public site is actually on the current repo build:

```sh
node scripts/check-live-deploy.mjs https://kuchniatwist.pl
```

What the result means:

- `Live target` mismatch: Coolify is still serving an older image or did not redeploy the latest commit.
- `Live current` mismatch: the new code reached production, but the seed version on the live database did not catch up yet.
- Missing `kepoli-seed-*` meta tags: the fingerprint flag is disabled, or the public site is still on a build older than the deploy fingerprint update. The meta tag prefix is an internal implementation name and does not affect the public brand.

Turn `KEPOLI_DEPLOY_FINGERPRINT` back off after the check so normal production pages do not expose internal deployment details.
