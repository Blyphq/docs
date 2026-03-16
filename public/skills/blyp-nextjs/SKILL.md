---
name: blyp-nextjs
description: Portable Blyp add-on skill for Next.js App Router projects using @blyp/core/nextjs, withLogger(), and clientLogHandler on the configured ingestion path.
---

# Blyp Next.js

## What this skill is for

Use this add-on when the project uses Next.js App Router and needs Blyp route logging or client ingestion.

## When to use it

- Adding Blyp to `app/**/route.ts`
- Wrapping handlers with `withLogger(...)`
- Mounting `clientLogHandler` for browser logging
- Auditing whether the configured ingestion path matches the mounted route

## Blyp-specific rules and constraints

- Install `blyp-core` first and keep its baseline rules in force.
- Import from `@blyp/core/nextjs`.
- Create the adapter with `createLogger()`.
- Wrap App Router handlers with `nextLogger.withLogger(...)`.
- Mount `nextLogger.clientLogHandler` on the same path configured for client logging, usually `/inngest`.
- If the mounted route path does not match the configured ingestion path, Blyp returns a `500` mismatch response.

## Required implementation steps

1. Import `createLogger` from `@blyp/core/nextjs`.
2. Create a shared adapter instance if the project benefits from one.
3. Wrap each route handler that should expose request logging with `withLogger(...)`.
4. Use the injected `{ log }` helper inside the wrapped handler instead of inventing a parallel logger.
5. If browser ingestion is enabled, create the route file for the configured path and export `POST = nextLogger.clientLogHandler`.
6. Keep `blyp.config.*` and the mounted route aligned on the same ingestion path.

## Verification checklist

- The project imports from `@blyp/core/nextjs`
- Route handlers use `withLogger(...)`
- Request logging reads from the injected `log`
- The ingestion route exports `clientLogHandler`
- Mounted path and configured path match exactly

## References

- Import path: `@blyp/core/nextjs`
- Main API: `createLogger()`
- Handler wrapper: `withLogger(...)`
- Client ingestion handler: `clientLogHandler`
