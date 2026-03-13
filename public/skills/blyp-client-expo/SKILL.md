---
name: blyp-client-expo
description: Portable Blyp add-on skill for browser and Expo logging with blyp-js/client, blyp-js/expo, default /inngest ingestion, retry queues, and connector forwarding requests through Blyp.
---

# Blyp Client and Expo

## What this skill is for

Use this add-on when Blyp should emit logs from browsers or Expo apps into a Blyp-enabled backend.

## When to use it

- Adding `createClientLogger()` in a browser app
- Adding `createExpoLogger()` in an Expo app
- Enabling remote sync to Blyp ingestion
- Requesting PostHog, Sentry, or OTLP forwarding from the client side

## Blyp-specific rules and constraints

- Install `blyp-core` first.
- Browser apps import from `blyp-js/client`.
- Expo apps import from `blyp-js/expo`.
- Browser ingestion defaults to `/inngest`.
- Browser delivery retries retryable failures with an in-memory queue.
- Expo requires an absolute `http://` or `https://` ingestion endpoint.
- Expo requires `expo-network` for connectivity-aware retry behavior.
- Browser and Expo connector requests still go through Blyp ingestion first.

## Required implementation steps

1. Pick the correct runtime import:
   - Browser: `createClientLogger` from `blyp-js/client`
   - Expo: `createExpoLogger` from `blyp-js/expo`
2. Keep the endpoint aligned with the server ingestion route:
   - Browser default: `/inngest`
   - Expo: absolute backend URL such as `https://api.example.com/inngest`
3. Configure delivery options only when the repo needs custom retry behavior.
4. If connector forwarding is requested, set `connector` on the client logger and verify the server connector exists.
5. For Expo, ensure `expo-network` is installed before relying on remote sync.

## Verification checklist

- Browser code imports `blyp-js/client`
- Expo code imports `blyp-js/expo`
- Browser endpoint defaults to or matches `/inngest`
- Expo endpoint is absolute
- `expo-network` is installed when Expo remote sync is enabled
- Any connector request is backed by a server-side Blyp connector

## References

- Browser import path: `blyp-js/client`
- Expo import path: `blyp-js/expo`
- Main APIs: `createClientLogger()`, `createExpoLogger()`
- Connector request shapes: `"posthog"`, `"sentry"`, `{ type: "otlp", name: "<target>" }`
