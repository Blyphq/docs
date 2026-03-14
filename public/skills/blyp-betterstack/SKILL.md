---
name: blyp-betterstack
description: Portable Blyp connector add-on skill for Better Stack using connectors.betterstack, auto or manual log delivery, and Better Stack error tracking through the Sentry SDK.
---

# Blyp Better Stack

## What this skill is for

Use this add-on when Blyp logs or handled errors should be forwarded into Better Stack.

## When to use it

- Configuring `connectors.betterstack`
- Choosing `mode: "auto"` or `mode: "manual"` for server log forwarding
- Enabling Better Stack error tracking
- Supporting browser or Expo requests that ask Blyp to forward into Better Stack

## Blyp-specific rules and constraints

- Install `blyp-core` first.
- Configure Better Stack on the server in `connectors.betterstack`.
- Supported log delivery modes are `auto` and `manual`.
- `ingestingHost` must be an absolute `http://` or `https://` URL.
- Better Stack error tracking is configured under `connectors.betterstack.errorTracking`.
- Blyp uses the Sentry SDK for Better Stack error tracking and reuses an existing Sentry client if one is already initialized.
- Browser and Expo Better Stack requests still send to Blyp ingestion first.
- Client `error` and `critical` logs are promoted to Better Stack exceptions when server-side Better Stack error tracking is configured.

## Required implementation steps

1. Add or update `connectors.betterstack` in `blyp.config.*`.
2. Set `enabled: true` and choose `mode: "auto"` or `mode: "manual"` for log forwarding.
3. Provide `sourceToken`, `ingestingHost`, and optional `serviceName`.
4. If the application wants Blyp-managed handled error capture, configure `errorTracking.dsn` and related options.
5. If manual control is required, use `blyp-js/betterstack` APIs instead of assuming auto delivery.
6. If browser or Expo code requests `connector: "betterstack"`, verify the server connector is configured first.

## Verification checklist

- `connectors.betterstack` exists in `blyp.config.*`
- The connector mode is explicit
- `ingestingHost` is a valid absolute URL
- Better Stack error tracking is configured intentionally when needed
- Existing app-level Sentry initialization is not accidentally replaced
- Browser or Expo Better Stack forwarding still targets Blyp ingestion first
- Manual code imports from `blyp-js/betterstack` when auto mode is not desired

## References

- Config key: `connectors.betterstack`
- Manual import path: `blyp-js/betterstack`
- Manual APIs: `createBetterStackLogger()`, `createStructuredBetterStackLogger()`, `createBetterStackErrorTracker()`, `captureBetterStackException()`
