# Blyp Docs

Documentation site for [Blyp](https://github.com/Blyphq/blyp), built with `@farming-labs/docs` on Next.js.

## Run locally

```bash
pnpm dev
```

## Cloudflare Workers

Wrangler uses your local Cloudflare login. Authenticate a new machine with
`pnpm exec wrangler login`, then check the account with `pnpm exec wrangler whoami`.

```bash
pnpm build:cloudflare  # Build Next.js and prepare the Worker
pnpm preview           # Build and run in Cloudflare's local runtime
pnpm deploy            # Build and deploy to Cloudflare
```

`wrangler.jsonc` configures the `blyp-docs` Worker, assets, and domain routes.
The production site uses `www.blyp.dev`; `blyp.dev` redirects there and preserves
paths and query strings. Both domains are served by Cloudflare Workers.

Pushes to `main` automatically deploy through
[Deploy to Cloudflare](.github/workflows/deploy-cloudflare.yml) in GitHub Actions.
The workflow installs dependencies from the lockfile, builds and prepares the
Worker, then deploys through OpenNext's Wrangler integration. Deployments are
serialized so production uploads cannot overlap. You can also run the workflow
manually from the Actions tab on `main`.

One-time setup: create a Cloudflare API token using the **Edit Cloudflare Workers**
template, scoped to the account and `blyp.dev` zone in `wrangler.jsonc`. Add it as
the `CLOUDFLARE_API_TOKEN` repository secret under **Settings → Secrets and
variables → Actions**. The account ID is already configured in `wrangler.jsonc`.
See [Cloudflare's GitHub Actions setup](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/)
for token permissions. CI uses this token instead of a local Wrangler login.

You can still deploy locally with `pnpm deploy`. If using Cloudflare Workers
Builds instead of GitHub Actions, set the production branch to `main`, the build
command to `pnpm build:cloudflare`, and the deploy command to
`pnpm exec opennextjs-cloudflare deploy`. Use one automatic deployment integration
to avoid deploying each push twice.

The existing server bundle exceeds the Workers Free plan's 10 ms CPU limit.
Workers Paid is required for the dynamic docs APIs and image generation.

Prebuilt pages use the static assets incremental cache, so no R2 bucket is
required. The preparation script bundles documentation sources into the Worker
and restores them into Cloudflare's request-local `/tmp` filesystem for the docs
framework's search, markdown, and MCP handlers. A pnpm patch defers the framework's
Node-only code-validation loader until code validation is actually requested.

Public analytics and canonical URL defaults are preserved. Authentication
credentials remain in Wrangler's user configuration outside this repository.

## Docs content

The landing page lives at `/`, and documentation lives under `app/docs/`.

```bash
pnpm build
pnpm check:examples
```
