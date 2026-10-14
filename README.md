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

For future deployments, run `pnpm deploy`. If connecting the repository to
Workers Builds, set the build command to `pnpm build:cloudflare` and the deploy
command to `pnpm exec opennextjs-cloudflare deploy`.

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
