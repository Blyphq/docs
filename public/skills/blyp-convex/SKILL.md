---
name: blyp-convex
description: Portable Blyp add-on skill for Convex isolate logging with @blyp/core/convex, shared blyp.config.ts via @blyp/core/config, handler wrap(), and action-only HTTP export for PostHog, Axiom, Better Stack, Sentry, Databuddy, HTTP, and OTLP.
compatibility: Requires a Convex project; remote connector export runs from Convex actions.
---

# Blyp Convex

## What this skill is for

Use this add-on when the runtime is Convex rather than Node.js or Bun server adapters.

## When to use it

- Logging from Convex queries, mutations, or actions
- Sharing one `blyp.config.ts` with an HTTP API in a monorepo
- Exporting action logs to PostHog, Axiom, Better Stack, Sentry, Databuddy, HTTP webhooks, Grafana, or another OTLP HTTP logs endpoint

## Blyp-specific rules and constraints

- Install `blyp-core` first, but override its Node/Bun assumptions with Convex rules.
- Import from `@blyp/core/convex`. Never import the root `@blyp/core` logger inside Convex functions.
- If Convex imports `blyp.config.ts`, that file must use `defineConfig` from `@blyp/core/config`, not `@blyp/core`.
- Pass the shared config object into `configureConvexLogger(blypConfig)`. Convex does not walk the filesystem.
- Use the default `logger`. Call `configureConvexLogger()` once in a shared Convex module.
- Use `createConvexLogger()` only for a second instance.
- Keep importing `mutation`, `query`, and `action` from `convex/server`. Do not look for Blyp re-exports of those builders.
- Convex uses `level`, `redact`, and isolate-safe HTTP export for `posthog`, `axiom`, `betterstack`, `sentry`, `databuddy`, `http`, and auto `connectors.otlp`.
- Shared `connectors.posthog`, `connectors.betterstack`, `connectors.sentry`, `connectors.databuddy`, and `connectors.http` map to the same action-only `fetch` sinks. Do not duplicate them as raw `connectors.otlp` unless you need a collector that is not one of those vendors.
- File logging, database destinations, delivery queues, client ingestion, and vendor exception SDKs are ignored. Blyp warns once for each.
- Without a usable remote sink, Convex writes `console.*` only and warns once.
- Convex-only config can be `configureConvexLogger({ posthog, axiom, betterstack, sentry, databuddy, http, otlp })`.
- `otlp: false` disables every remote export. `posthog: false` (and the other vendor `false` flags) skip that vendor.
- Queries and mutations can only write `console.*`. They cannot `fetch`.
- Actions and HTTP actions can export over JSON HTTP `fetch` when a sink is configured.
- Wrap the handler, not Convex's `action` helper: `handler: logger.wrap(async (ctx, args) => { ... })`.
- `wrap` binds `ctx` and flushes remote export for actions, including when the handler throws.
- If you skip `wrap` on an action, call `logger.bind(ctx)` and `await logger.flush()` yourself.

## Required implementation steps

1. If the repo shares `blyp.config.ts` with Convex, import `defineConfig` from `@blyp/core/config`.
2. Configure PostHog, Better Stack, Sentry, Databuddy, HTTP, and OTLP under `connectors.*`, or pass `posthog` / `axiom` / `betterstack` / `sentry` / `databuddy` / `http` / `otlp` to `configureConvexLogger()`.
3. Import that config into `convex/logger.ts` and call `configureConvexLogger(blypConfig)`.
4. Import `logger` from that Convex module, not `@blyp/core`.
5. For actions, wrap the handler with `logger.wrap(...)` so `ctx` is bound and remote export flushes.
6. Leave file, database, delivery queues, and exception autocapture to the HTTP API. Expect Convex warnings for those Node-only sinks.

## Verification checklist

- Convex functions import from `@blyp/core/convex`
- Shared `blyp.config.ts` imports `defineConfig` from `@blyp/core/config` when Convex loads it
- `configureConvexLogger()` receives that config object
- A vendor object or auto connector exists if action logs should leave Convex
- Convex builders still come from `convex/server`
- Action handlers use `logger.wrap(...)` or manual `bind` plus `flush`
- Queries and mutations are not expected to export remotely

## References

- Import path: `@blyp/core/convex`
- Shared config: `@blyp/core/config`
- Main APIs: `logger`, `configureConvexLogger()`, `createConvexLogger()`, `defineConfig()`
- Handler binding: `logger.wrap()`, `logger.bind()`, `logger.flush()`
