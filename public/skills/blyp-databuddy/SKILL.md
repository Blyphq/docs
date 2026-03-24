---
name: blyp-databuddy
description: Portable Blyp connector add-on skill for Databuddy using connectors.databuddy, auto or manual delivery, and browser or Expo forwarding through Blyp ingestion.
---

# Blyp Databuddy

## What this skill is for

Use this add-on when Blyp logs or handled errors should be forwarded into Databuddy.

## When to use it

- Configuring `connectors.databuddy`
- Choosing `mode: "auto"` or `mode: "manual"`
- Using Databuddy manual helper APIs
- Supporting browser or Expo requests that ask Blyp to forward into Databuddy

## Blyp-specific rules and constraints

- Install `blyp-core` first.
- Configure Databuddy on the server in `connectors.databuddy`.
- Supported delivery modes are `auto` and `manual`.
- `apiKey` and `websiteId` are both required. Without both values, the connector remains `missing`.
- Browser and Expo Databuddy requests still send to Blyp ingestion first.
- In `auto` mode, Blyp forwards normal server logs automatically and captures handled server errors as Databuddy `error` events.
- If manual control is required, use `@blyp/core/databuddy`.

## Required implementation steps

1. Add or update `connectors.databuddy` in `blyp.config.*`.
2. Set `enabled: true` and choose `mode: "auto"` or `mode: "manual"`.
3. Provide `apiKey`, `websiteId`, and optional delivery settings such as `enableBatching`.
4. If manual control is required, import from `@blyp/core/databuddy` instead of assuming auto delivery.
5. If browser or Expo code requests `connector: "databuddy"`, verify the server connector is configured first.

## Verification checklist

- `connectors.databuddy` exists in `blyp.config.*`
- `apiKey` and `websiteId` are both present
- The chosen mode is explicit: `auto` or `manual`
- Browser or Expo Databuddy forwarding still targets Blyp ingestion first
- Manual code imports from `@blyp/core/databuddy` when auto mode is not desired

## References

- Config key: `connectors.databuddy`
- Manual import path: `@blyp/core/databuddy`
- Manual APIs: `createDatabuddyLogger()`, `createStructuredDatabuddyLogger()`, `createDatabuddyErrorTracker()`, `captureDatabuddyException()`
