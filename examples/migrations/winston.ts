import { createStructuredLog, createStandaloneLogger, logger } from "@blyp/core";

const standaloneLogger = createStandaloneLogger({
  level: "info",
  destination: "file",
});

standaloneLogger.info("server started", {
  service: "api",
});

const requestLogger = logger.child({
  requestId: "req_123",
});

requestLogger.info("request received", {
  route: "/checkout",
});

const structuredLog = createStructuredLog("checkout", {
  service: "api",
  requestId: "req_123",
});

structuredLog.set({
  user: { id: "usr_123" },
  cart: { items: 2, total: 4900 },
});

structuredLog.emit({
  level: "info",
  message: "checkout completed",
  status: 200,
});
