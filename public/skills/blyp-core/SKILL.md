---
name: blyp-core
description: Portable Blyp integration skill for installing blyp-js, choosing the right runtime export, configuring blyp.config.*, wiring /inngest ingestion, and keeping server, browser, and Expo logging production-safe.
---

# Blyp Core

## What this skill is for

Use this skill whenever an agent needs to add, review, or change Blyp logging in an application. This is the baseline skill for all Blyp work.

## When to use it

- Installing `blyp-js` in a new project
- Choosing the correct Blyp import path for the runtime
- Adding or updating `blyp.config.*`
- Enabling browser or Expo log ingestion
- Preparing the project for Blyp connector add-ons or framework add-ons

## Blyp-specific rules and constraints

- The npm package name is `blyp-js`.
- Always choose the subpath that matches the runtime instead of forcing the root package everywhere.
- Prefer shared project config in `blyp.config.ts`, `blyp.config.mts`, `blyp.config.cts`, `blyp.config.js`, `blyp.config.mjs`, `blyp.config.cjs`, or `blyp.config.json`.
- Default client ingestion path is `/inngest`.
- Browser and Expo connector delivery still posts to Blyp ingestion first. They do not send directly to PostHog, Sentry, or OTLP vendors.
- Prefer production-safe defaults over the shortest demo snippet.
- When client logging is enabled, verify that the mounted handler path matches the configured ingestion path exactly.
- Treat unsupported presets as out of scope unless another Blyp skill explicitly covers them.

## Required implementation steps

1. Install `blyp-js` with the package manager already used by the repo.
2. Identify the runtime and select the matching Blyp entry:
   - `blyp-js` for root logger, standalone logger, config helpers, structured logs, and errors
   - `blyp-js/client` for browser logging
   - `blyp-js/expo` for Expo apps
   - `blyp-js/<framework>` for framework adapters such as `nextjs`, `express`, `hono`, `elysia`, or `workers`
3. Add or update `blyp.config.*` if the project needs shared log level, file logging, client ingestion, or connector configuration.
4. If browser logging is enabled, keep the ingestion path aligned across config and server route mounting. Default to `/inngest` unless the repo already standardizes a different path.
5. If connectors are involved, configure them on the server side first. Client and Expo requests depend on server connector configuration.
6. Reuse existing Blyp helpers where possible:
   - `logger`
   - `createStandaloneLogger`
   - `createStructuredLog`
   - `createError`
   - `parseError`
7. Add a framework or connector add-on skill when runtime-specific behavior matters.

## Verification checklist

- `blyp-js` is installed and imported from the correct subpath
- Any shared Blyp settings live in a supported `blyp.config.*` file
- Client ingestion uses the expected path, defaulting to `/inngest`
- Browser or Expo connector requests are backed by server connector configuration
- No framework-specific wiring is guessed when an adapter-specific Blyp skill exists
- The final implementation favors safe config and correct handler mounting over the smallest possible snippet

## References

- Package: `blyp-js`
- Config files: `blyp.config.ts`, `blyp.config.mts`, `blyp.config.cts`, `blyp.config.js`, `blyp.config.mjs`, `blyp.config.cjs`, `blyp.config.json`
- Core imports: `logger`, `createStandaloneLogger`, `createStructuredLog`, `createError`, `parseError`
- Related add-ons: `blyp-nextjs`, `blyp-express`, `blyp-hono`, `blyp-elysia`, `blyp-workers`, `blyp-client-expo`, `blyp-posthog`, `blyp-sentry`, `blyp-otlp`
