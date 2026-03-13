---
name: blyp-posthog
description: Portable Blyp connector add-on skill for PostHog using connectors.posthog, auto or manual delivery modes, and server-side error tracking that can receive browser or Expo forwarding requests through Blyp.
---

# Blyp PostHog

## What this skill is for

Use this add-on when Blyp logs or errors should be forwarded into PostHog.

## When to use it

- Configuring `connectors.posthog`
- Choosing `mode: "auto"` or `mode: "manual"`
- Enabling PostHog error tracking
- Supporting browser or Expo requests that ask Blyp to forward into PostHog

## Blyp-specific rules and constraints

- Install `blyp-core` first.
- Configure PostHog on the server in `connectors.posthog`.
- Supported delivery modes are `auto` and `manual`.
- Error tracking is configured under `connectors.posthog.errorTracking`.
- Browser and Expo PostHog requests still send to Blyp ingestion first.
- Client `error` and `critical` logs are promoted to PostHog exceptions only when server-side PostHog error tracking is enabled in `auto` mode.

## Required implementation steps

1. Add or update `connectors.posthog` in `blyp.config.*`.
2. Set `enabled: true` and choose `mode: "auto"` or `mode: "manual"`.
3. Provide `projectKey` and optional `host` or `serviceName`.
4. If the application wants Blyp-managed exception capture, configure `errorTracking`.
5. If manual control is required, use `blyp-js/posthog` APIs instead of assuming auto delivery.
6. If browser or Expo code requests `connector: "posthog"`, verify the server connector is configured first.

## Verification checklist

- `connectors.posthog` exists in `blyp.config.*`
- The chosen mode is explicit: `auto` or `manual`
- Error tracking is configured intentionally when needed
- Browser or Expo PostHog forwarding still targets Blyp ingestion first
- Manual code imports from `blyp-js/posthog` when auto mode is not desired

## References

- Config key: `connectors.posthog`
- Manual import path: `blyp-js/posthog`
- Manual APIs: `createPosthogLogger()`, `createStructuredPosthogLogger()`, `createPosthogErrorTracker()`, `capturePosthogException()`
