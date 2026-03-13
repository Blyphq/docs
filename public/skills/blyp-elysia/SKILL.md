---
name: blyp-elysia
description: Portable Blyp add-on skill for Elysia services using blyp-js/elysia, createLogger() as a plugin, and ctx.log for request-scoped logging.
---

# Blyp Elysia

## What this skill is for

Use this add-on when Blyp is being wired into an Elysia application.

## When to use it

- Adding Blyp as an Elysia plugin
- Logging inside Elysia handlers
- Enabling client ingestion in an Elysia server

## Blyp-specific rules and constraints

- Install `blyp-core` first.
- Import from `blyp-js/elysia`.
- Use `createLogger()` as an Elysia plugin via `.use(...)`.
- Access the request logger as `ctx.log` or `{ log }` in handlers.
- Keep ingestion behavior aligned with the configured path when client logging is enabled.

## Required implementation steps

1. Import `createLogger` from `blyp-js/elysia`.
2. Add the plugin with `.use(createLogger(...))`.
3. Prefer `ctx.log` for request-scoped logging instead of a root logger inside handlers.
4. Keep any request metadata additions in `customProps`.
5. If browser ingestion is enabled, verify the configured path is the one Elysia accepts for client logs.

## Verification checklist

- The app imports from `blyp-js/elysia`
- Blyp is mounted through `.use(createLogger(...))`
- Handlers log with `ctx.log`
- Client ingestion path is consistent with config

## References

- Import path: `blyp-js/elysia`
- Main API: `createLogger()`
- Request logger: `ctx.log`
