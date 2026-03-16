---
name: blyp-workers
description: Portable Blyp add-on skill for Cloudflare Workers using @blyp/core/workers, initWorkersLogger(), createWorkersLogger(), and explicit request emit() calls.
---

# Blyp Workers

## What this skill is for

Use this add-on when the runtime is Cloudflare Workers rather than Node.js or Bun server adapters.

## When to use it

- Initializing Blyp in a Worker
- Creating request-scoped Worker loggers
- Emitting request or error records manually

## Blyp-specific rules and constraints

- Install `blyp-core` first, but override its Node/Bun assumptions with Workers rules.
- Import from `@blyp/core/workers`.
- Use `initWorkersLogger()` for shared worker-level setup.
- Use `createWorkersLogger(request)` per request.
- Workers do not use `blyp.config.*`.
- Workers do not support file logging.
- Workers do not auto-register client ingestion.
- Request records are emitted manually through `emit()`.

## Required implementation steps

1. Import `initWorkersLogger` and `createWorkersLogger` from `@blyp/core/workers`.
2. Initialize the worker logger once during startup.
3. Create a request logger inside the `fetch` handler.
4. Set request-scoped fields with `log.set(...)` as needed.
5. Call `log.emit({ response })` on success and `log.emit({ error })` on failure.
6. Do not add Node-oriented config files or file logging settings to Workers code.

## Verification checklist

- The worker imports from `@blyp/core/workers`
- `initWorkersLogger()` runs once
- `createWorkersLogger(request)` is used per request
- `emit()` is called explicitly
- No `blyp.config.*` or file logging assumptions leak into the Worker implementation

## References

- Import path: `@blyp/core/workers`
- Main APIs: `initWorkersLogger()`, `createWorkersLogger()`
- Request emission: `emit()`
