---
name: blyp-react-router
description: Portable Blyp add-on skill for React Router apps using @blyp/core/react-router, middleware, request-scoped context logging, and clientLogHandler(request).
---

# Blyp React Router

## What this skill is for

Use this add-on when the project uses React Router and needs Blyp request logging or browser ingestion.

## When to use it

- Adding Blyp to React Router middleware
- Reading the request-scoped logger from `context`
- Mounting `clientLogHandler(request)` in a route action
- Auditing whether the mounted ingestion route matches the configured path

## Blyp-specific rules and constraints

- Install `blyp-core` first and keep its baseline rules in force.
- Import from `@blyp/core/react-router`.
- Create the adapter with `createLogger()`.
- Mount `reactRouterLogger.middleware` in the React Router middleware array.
- Use `reactRouterLogger.getLogger(context)` for request-scoped logging.
- `getLogger(context)` falls back to the shared logger if no scoped logger is stored yet.
- Mount `reactRouterLogger.clientLogHandler(request)` on the same path configured for client logging, usually `/inngest`.
- If the mounted route path does not match the configured ingestion path, Blyp returns a `500` mismatch response.

## Required implementation steps

1. Import `createLogger` from `@blyp/core/react-router`.
2. Create a shared adapter instance if the project benefits from one.
3. Add `reactRouterLogger.middleware` to the exported middleware array.
4. Use `reactRouterLogger.getLogger(context)` inside loaders, actions, or middleware-aware handlers instead of inventing a parallel request logger.
5. If browser ingestion is enabled, export a route action that calls `reactRouterLogger.clientLogHandler(request)`.
6. Keep `blyp.config.*` and the mounted route aligned on the same ingestion path.

## Verification checklist

- The project imports from `@blyp/core/react-router`
- Middleware includes `reactRouterLogger.middleware`
- Request logging reads from `getLogger(context)`
- The ingestion route action calls `clientLogHandler(request)`
- Mounted path and configured path match exactly

## References

- Import path: `@blyp/core/react-router`
- Main API: `createLogger()`
- Middleware: `middleware`
- Request logger access: `getLogger(context)`
- Client ingestion handler: `clientLogHandler(request)`
