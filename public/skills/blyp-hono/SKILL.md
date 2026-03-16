---
name: blyp-hono
description: Portable Blyp add-on skill for Hono apps using @blyp/core/hono, middleware on *, context.get("blypLog"), and automatic /inngest interception when enabled.
---

# Blyp Hono

## What this skill is for

Use this add-on when Blyp needs to run inside a Hono application.

## When to use it

- Mounting Blyp as Hono middleware
- Reading the request logger from context variables
- Enabling client ingestion in a Hono server

## Blyp-specific rules and constraints

- Install `blyp-core` first.
- Import from `@blyp/core/hono`.
- Mount the middleware on `"*"` unless the repo intentionally limits coverage.
- Read the request logger with `context.get("blypLog")`.
- When client logging is enabled, Blyp automatically intercepts `POST /inngest` on the configured path.

## Required implementation steps

1. Import `createLogger` from `@blyp/core/hono`.
2. Mount the middleware with `app.use("*", createLogger(...))` unless the repo has a narrower route strategy.
3. Replace request-scoped log access with `context.get("blypLog")`.
4. Keep custom props and ignore path logic inside the Blyp middleware config rather than in ad hoc wrappers.
5. If client ingestion is enabled, verify that the configured path still matches the expected route.

## Verification checklist

- The app imports from `@blyp/core/hono`
- Blyp middleware is mounted on `"*"` or an intentional equivalent
- Request logging uses `context.get("blypLog")`
- Client ingestion path remains aligned with the Blyp config

## References

- Import path: `@blyp/core/hono`
- Main API: `createLogger()`
- Request logger: `context.get("blypLog")`
