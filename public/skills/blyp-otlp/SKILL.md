---
name: blyp-otlp
description: Portable Blyp connector add-on skill for named OTLP targets using connectors.otlp, explicit target names, auto or manual delivery modes, and client or Expo forwarding requests through Blyp.
---

# Blyp OTLP

## What this skill is for

Use this add-on when Blyp forwards logs to Grafana Cloud, Datadog, Honeycomb, or another OTLP-compatible target.

## When to use it

- Configuring `connectors.otlp`
- Managing multiple named OTLP targets
- Choosing `mode: "auto"` or `mode: "manual"`
- Supporting browser or Expo requests that target a named OTLP connector

## Blyp-specific rules and constraints

- Install `blyp-core` first.
- Configure OTLP as an array under `connectors.otlp`.
- Every OTLP target must have a unique `name`.
- Supported delivery modes are `auto` and `manual`.
- Manual OTLP APIs and client or Expo forwarding requests must target an explicit connector name.
- Browser and Expo OTLP requests still go through Blyp ingestion first.

## Required implementation steps

1. Add or update the `connectors.otlp` array in `blyp.config.*`.
2. For each target, set `name`, `enabled`, `mode`, and `endpoint`.
3. Add `auth`, `headers`, or `serviceName` if required by the backend.
4. If manual control is required, import from `blyp-js/otlp` and pass the target `name`.
5. If browser or Expo code requests OTLP forwarding, use `{ type: "otlp", name: "<target>" }` and verify the named server connector exists.

## Verification checklist

- `connectors.otlp` is an array
- Each OTLP target has a stable `name`
- The chosen mode is explicit for each target
- Manual or client forwarding paths always include a connector name
- Browser or Expo forwarding still targets Blyp ingestion first

## References

- Config key: `connectors.otlp`
- Manual import path: `blyp-js/otlp`
- Manual APIs: `createOtlpLogger()`, `createStructuredOtlpLogger()`
