---
name: blyp-nuxt
description: Portable Blyp add-on skill for Nuxt apps using @blyp/core/nuxt, serverPlugin, getLogger(event), and clientLogHandler in server API routes.
---

# Blyp Nuxt

## What this skill is for

Use this add-on when the project uses Nuxt and needs Blyp request logging or browser ingestion.

## When to use it

- Registering Blyp in `server/plugins`
- Reading the request-scoped logger with `getLogger(event)`
- Mounting `clientLogHandler` in `server/api/*.post.ts`
- Keeping Nuxt ingestion routes aligned with `blyp.config.*`

## Blyp-specific rules and constraints

- Install `blyp-core` first and keep its baseline rules in force.
- Import from `@blyp/core/nuxt`.
- Create the adapter with `createLogger()`.
- Export `nuxtLogger.serverPlugin` from a Nuxt server plugin file.
- Use `nuxtLogger.getLogger(event)` for request-scoped logging inside Nuxt server handlers.
- Mount `nuxtLogger.clientLogHandler` on the configured ingestion path, usually `/inngest`.
- Nuxt reuses Blyp's Nitro request lifecycle internally, so follow Nitro-style event handling rather than inventing a custom adapter layer.

## Required implementation steps

1. Import `createLogger` from `@blyp/core/nuxt`.
2. Create a shared adapter instance if the project benefits from one.
3. Export `nuxtLogger.serverPlugin` from `server/plugins/blyp.ts` or the repo's equivalent Nuxt plugin location.
4. Use `nuxtLogger.getLogger(event)` inside server handlers that need request-scoped logging.
5. If browser ingestion is enabled, export `nuxtLogger.clientLogHandler` from the configured `server/api` route.
6. Keep `blyp.config.*` and the mounted route aligned on the same ingestion path.

## Verification checklist

- The project imports from `@blyp/core/nuxt`
- A server plugin exports `nuxtLogger.serverPlugin`
- Request logging reads from `getLogger(event)`
- The ingestion route exports `clientLogHandler`
- Mounted path and configured path match exactly

## References

- Import path: `@blyp/core/nuxt`
- Main API: `createLogger()`
- Server plugin: `serverPlugin`
- Request logger access: `getLogger(event)`
- Client ingestion handler: `clientLogHandler`
