import { createStructuredLog, createStandaloneLogger, logger } from "@blyp/core";

logger.info("server started", {
  service: "api",
});

const standaloneLogger = createStandaloneLogger({
  level: "debug",
});

standaloneLogger.debug("debug logging enabled");

const requestLogger = logger.child({
  requestId: "req_456",
  route: "/payments",
});

requestLogger.info("payment request received");

const structuredLog = createStructuredLog("payment", {
  service: "api",
  requestId: "req_456",
});

structuredLog.info("payment authorized");
structuredLog.emit({
  level: "success",
  message: "payment completed",
  status: 200,
});
