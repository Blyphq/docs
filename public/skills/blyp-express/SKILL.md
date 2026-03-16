---
name: blyp-express
description: Portable Blyp add-on skill for Express apps using @blyp/core/express, req.blypLog, and createExpressErrorLogger() in the correct middleware order.
---

# Blyp Express

## What this skill is for

Use this add-on when the project runs on Express and needs Blyp middleware, request logging, or HTTP error logging.

## When to use it

- Adding Blyp to an Express app or router
- Reading the request logger from `req.blypLog`
- Enabling browser ingestion in an Express server
- Fixing middleware order so Blyp can emit `http_error` records

## Blyp-specific rules and constraints

- Install `blyp-core` first.
- Import from `@blyp/core/express`.
- Use `createLogger()` as standard Express middleware.
- Use `req.blypLog` for request-scoped logging.
- `createExpressErrorLogger()` must run before the app's final error handler so Blyp can capture thrown errors on `res.locals`.

## Required implementation steps

1. Import `createLogger` and `createExpressErrorLogger` from `@blyp/core/express`.
2. Mount `createLogger(...)` before routes that need request-scoped logging.
3. Replace ad hoc request log access with `req.blypLog`.
4. If browser ingestion is enabled, keep the configured path aligned with the mounted Blyp middleware behavior.
5. Mount `createExpressErrorLogger()` before the terminal error responder middleware.
6. Leave the application's final error serialization in place after Blyp's error logger middleware.

## Verification checklist

- The server imports from `@blyp/core/express`
- Routes log through `req.blypLog`
- `createLogger()` runs before routes
- `createExpressErrorLogger()` runs before the final error handler
- Error responses still work after Blyp middleware is inserted

## References

- Import path: `@blyp/core/express`
- Main APIs: `createLogger()`, `createExpressErrorLogger()`
- Request logger: `req.blypLog`
