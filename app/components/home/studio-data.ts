export type Level = "info" | "http" | "warn" | "error" | "event";

export type LogLine = {
  at: string;
  level: Level;
  source: string;
  text: string;
};

export const script: LogLine[] = [
  { at: "12:04:31.002", level: "info", source: "server", text: "blyp ready · bun 1.3 · studio on :3003" },
  { at: "12:04:31.418", level: "http", source: "hono", text: "GET  /api/cart  200  18ms" },
  { at: "12:04:31.430", level: "info", source: "cart", text: "cart hydrated · 3 items · usr_29a1" },
  { at: "12:04:32.106", level: "http", source: "hono", text: "POST /api/checkout  202  84ms" },
  { at: "12:04:32.191", level: "warn", source: "stripe", text: "payment_intent retry 1/3 · rate_limited" },
  { at: "12:04:32.497", level: "event", source: "checkout", text: "checkout.completed" },
  { at: "12:04:33.012", level: "error", source: "worker", text: "BlypError INVENTORY_LOCKED · sku_9f2" },
  { at: "12:04:33.540", level: "http", source: "hono", text: "GET  /api/orders  200  22ms" },
];

export const levelStyles: Record<Level, string> = {
  info: "text-level-info bg-level-info/10",
  http: "text-muted-foreground bg-muted",
  warn: "text-level-warn bg-level-warn/12",
  error: "text-primary bg-primary/12",
  event: "text-primary-foreground bg-primary",
};

export const STEP_MS = 1150;

export type StudioView = "logs" | "traces" | "errors" | "connectors" | "database" | "ai";
