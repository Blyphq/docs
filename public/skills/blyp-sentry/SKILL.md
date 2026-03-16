---
name: blyp-sentry
description: Portable Blyp connector add-on skill for Sentry using connectors.sentry, auto or manual delivery modes, and browser or Expo forwarding requests through Blyp ingestion.
---

# Blyp Sentry

## What this skill is for

Use this add-on when Blyp logs or structured events should be forwarded into Sentry.

## When to use it

- Configuring `connectors.sentry`
- Choosing `mode: "auto"` or `mode: "manual"`
- Reusing an existing Sentry client in the application
- Supporting browser or Expo requests that ask Blyp to forward into Sentry

## Blyp-specific rules and constraints

- Install `blyp-core` first.
- Configure Sentry on the server in `connectors.sentry`.
- Supported delivery modes are `auto` and `manual`.
- If Sentry is already initialized by the application, Blyp reuses the existing client.
- Browser and Expo Sentry requests still go through Blyp ingestion first.

## Required implementation steps

1. Add or update `connectors.sentry` in `blyp.config.*`.
2. Set `enabled: true` and choose `mode: "auto"` or `mode: "manual"`.
3. Provide `dsn` and optional `environment` or `release`.
4. If manual control is required, import from `@blyp/core/sentry`.
5. If browser or Expo code requests `connector: "sentry"`, verify the server connector is configured first.

## Verification checklist

- `connectors.sentry` exists in `blyp.config.*`
- The connector mode is explicit
- Existing app-level Sentry initialization is not accidentally replaced
- Browser or Expo forwarding still targets Blyp ingestion first
- Manual code imports from `@blyp/core/sentry` when needed

## References

- Config key: `connectors.sentry`
- Manual import path: `@blyp/core/sentry`
- Manual APIs: `createSentryLogger()`, `createStructuredSentryLogger()`
