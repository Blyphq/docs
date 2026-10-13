"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Activity, ArrowUpRight, ChevronDown, CornerDownLeft, Radio, Sparkles } from "lucide-react";
import LatticeLoader from "@/app/components/react-bits/micro/lattice-loader";
import RubberSegment from "@/app/components/react-bits/micro/rubber-segment";
import { levelStyles, script, STEP_MS, type LogLine, type StudioView } from "@/app/components/home/studio-data";

const ease = [0.16, 1, 0.3, 1] as const;
const spring = { type: "spring", stiffness: 420, damping: 34 } as const;

/* ── Traces ─────────────────────────────────────────────── */

type SpanKind = "http" | "db" | "ext" | "ai" | "tool" | "log" | "err";
type Trace = { id: string; method: string; path: string; ms: number; status: number; spans: [string, number, number, SpanKind][] };

export const traces: Trace[] = [
  {
    id: "req_84f2",
    method: "POST",
    path: "/api/checkout",
    ms: 312,
    status: 202,
    spans: [
      ["POST /api/checkout", 0, 312, "http"],
      ["validate cart", 6, 10, "http"],
      ["reserve inventory", 11, 32, "db"],
      ["stripe.paymentIntents", 34, 290, "ext"],
      ["retry 1/3", 120, 288, "ext"],
      ["emit structured log", 304, 305, "log"],
    ],
  },
  {
    id: "req_7c1e",
    method: "POST",
    path: "/api/support",
    ms: 1842,
    status: 200,
    spans: [
      ["POST /api/support", 0, 1842, "http"],
      ["db.query tickets", 70, 250, "db"],
      ["streamText", 290, 1730, "ai"],
      ["tool lookupOrder", 420, 674, "tool"],
      ["emit ai_trace", 1736, 1760, "log"],
    ],
  },
  {
    id: "req_9f20",
    method: "POST",
    path: "/api/inventory/lock",
    ms: 41,
    status: 409,
    spans: [
      ["POST /api/inventory/lock", 0, 41, "http"],
      ["db.lock sku_9f2", 4, 37, "db"],
      ["throw BlypError", 37, 39, "err"],
    ],
  },
  {
    id: "req_51ad",
    method: "GET",
    path: "/api/cart",
    ms: 18,
    status: 200,
    spans: [
      ["GET /api/cart", 0, 18, "http"],
      ["db.query cart", 3, 14, "db"],
    ],
  },
  {
    id: "req_c3b8",
    method: "GET",
    path: "/api/orders",
    ms: 22,
    status: 200,
    spans: [
      ["GET /api/orders", 0, 22, "http"],
      ["db.query orders", 2, 17, "db"],
      ["serialize", 17, 21, "http"],
    ],
  },
];

const spanColor: Record<SpanKind, string> = {
  http: "bg-foreground/60",
  db: "bg-level-info",
  ext: "bg-level-warn",
  ai: "bg-primary",
  tool: "bg-level-warn",
  log: "bg-level-ok",
  err: "bg-primary",
};

const statusTone = (status: number) =>
  status >= 400 ? "text-primary bg-primary/12" : status >= 300 ? "text-level-warn bg-level-warn/12" : "text-level-ok bg-level-ok/12";

export function TracesView({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  const trace = traces.find((t) => t.id === selected) ?? traces[0];
  return (
    <div className="flex h-full flex-col gap-3 p-3">
      <ul className="flex flex-col gap-0.5">
        {traces.map((t) => {
          const on = t.id === trace.id;
          return (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => onSelect(t.id)}
                className="relative flex h-8 w-full items-center gap-2.5 rounded-md px-2 text-left font-mono text-[0.7rem] transition-colors hover:bg-muted"
              >
                {on ? <motion.span layoutId="studio-trace" className="absolute inset-0 rounded-md bg-primary-soft" transition={spring} /> : null}
                <span className="relative w-10 shrink-0 text-muted-foreground">{t.method}</span>
                <span className={`relative min-w-0 flex-1 truncate ${on ? "text-primary-soft-foreground" : "text-foreground"}`}>{t.path}</span>
                <span className="relative hidden w-16 shrink-0 text-muted-foreground sm:inline">{t.id}</span>
                <span className="relative w-14 shrink-0 text-right tabular-nums text-muted-foreground">{t.ms.toLocaleString("en-US")}ms</span>
                <span className={`relative shrink-0 rounded-[4px] px-1.5 py-0.5 text-[0.6rem] ${statusTone(t.status)}`}>{t.status}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex min-h-0 flex-1 flex-col rounded-lg border border-border bg-card p-3 shadow-xs">
        <div className="flex items-center justify-between font-mono text-[0.66rem] text-muted-foreground">
          <span>
            <span className="text-foreground">{trace.id}</span> · {trace.spans.length} spans
          </span>
          <span className="tabular-nums">{trace.ms.toLocaleString("en-US")}ms</span>
        </div>
        <ul className="mt-3 flex flex-col gap-1.5">
          {trace.spans.map(([label, start, end, kind], i) => (
            <li key={`${trace.id}-${label}`} className="group/span grid grid-cols-[7.5rem_minmax(0,1fr)_3rem] items-center gap-2 sm:grid-cols-[9.5rem_minmax(0,1fr)_3rem]">
              <span className="truncate font-mono text-[0.66rem] text-muted-foreground transition-colors group-hover/span:text-foreground" style={{ paddingLeft: i ? "0.6rem" : 0 }}>
                {label}
              </span>
              <span className="relative h-4">
                <span className="absolute inset-x-0 top-1/2 h-px bg-border/70" />
                <motion.span
                  className={`absolute top-1/2 h-2.5 -translate-y-1/2 rounded-[3px] transition-[height] group-hover/span:h-3.5 ${spanColor[kind]} ${label.startsWith("retry") ? "blyp-stream opacity-80" : ""}`}
                  style={{ left: `${(start / trace.ms) * 100}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(((end - start) / trace.ms) * 100, 0.8)}%` }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease }}
                />
              </span>
              <span className="text-right font-mono text-[0.62rem] tabular-nums text-muted-foreground">{end - start}ms</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ── Errors ─────────────────────────────────────────────── */

const errorGroups = [
  {
    code: "INVENTORY_LOCKED",
    status: 409,
    message: "Inventory is locked for sku_9f2",
    source: "worker",
    trace: "req_9f20",
    base: 2,
    why: "Another checkout still holds the reservation.",
    fix: "Release the lock in finally, or retry after its TTL.",
    trend: [1, 0, 2, 1, 0, 0, 3, 1, 2, 4, 2, 3],
  },
  {
    code: "PAYMENT_FAILED",
    status: 402,
    message: "Payment failed",
    source: "checkout",
    trace: "req_84f2",
    base: 1,
    why: "Stripe declined the card after one rate-limited retry.",
    fix: "Ask for another payment method and surface the decline code.",
    trend: [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
  },
  {
    code: "RATE_LIMITED",
    status: 429,
    message: "Stripe rate limit reached",
    source: "stripe",
    trace: "req_84f2",
    base: 4,
    why: "A burst of payment_intent updates hit the account limit.",
    fix: "Back off between retries and batch intent updates.",
    trend: [2, 3, 1, 4, 2, 5, 3, 2, 4, 3, 5, 4],
  },
];

export function ErrorsView({ liveErrors, onOpenTrace }: { liveErrors: number; onOpenTrace: (id: string) => void }) {
  const [open, setOpen] = useState(errorGroups[0].code);
  return (
    <ul className="flex flex-col gap-2 p-3">
      {errorGroups.map((g, gi) => {
        const isOpen = open === g.code;
        const count = g.base + (gi === 0 ? liveErrors : 0);
        const peak = Math.max(...g.trend);
        return (
          <li key={g.code} className={`overflow-hidden rounded-lg border bg-card shadow-xs transition-colors ${isOpen ? "border-primary/35" : "border-border"}`}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? "" : g.code)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-muted/60"
            >
              <span className={`rounded-[4px] px-1.5 py-0.5 font-mono text-[0.62rem] ${g.status >= 429 ? "bg-level-warn/12 text-level-warn" : "bg-primary/12 text-primary"}`}>
                {g.status}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-mono text-[0.72rem] text-foreground">{g.code}</span>
                <span className="block truncate text-[0.68rem] text-muted-foreground">
                  {g.message} · {g.source}
                </span>
              </span>
              <span className="hidden h-6 items-end gap-[2px] sm:flex" aria-hidden>
                {g.trend.map((v, i) => (
                  <motion.span
                    key={i}
                    className={`w-1 rounded-[1px] ${i === g.trend.length - 1 ? "bg-primary" : "bg-foreground/25"}`}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(12, (v / peak) * 100)}%` }}
                    transition={{ duration: 0.5, delay: gi * 0.06 + i * 0.025, ease }}
                  />
                ))}
              </span>
              <motion.span key={count} initial={{ scale: 1.35 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 18 }} className="w-6 text-right font-mono text-[0.72rem] tabular-nums text-foreground">
                ×{count}
              </motion.span>
              <ChevronDown className={`size-3.5 shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} aria-hidden />
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease }}
                >
                  <div className="border-t border-dashed border-border px-3 py-2.5 font-mono text-[0.68rem] leading-5">
                    <p className="text-muted-foreground">
                      <span className="text-primary">throw</span> createError({"{"}
                    </p>
                    {(
                      [
                        ["status", String(g.status), "num"],
                        ["code", g.code, "str"],
                        ["why", g.why, "str"],
                        ["fix", g.fix, "str"],
                      ] as const
                    ).map(([k, v, kind], i) => (
                      <motion.p
                        key={k}
                        className="truncate pl-4 text-muted-foreground"
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 + i * 0.05, duration: 0.3, ease }}
                      >
                        <span className="text-foreground">{k}</span>: {kind === "num" ? <span className="text-level-warn">{v}</span> : <span className="text-level-ok">&quot;{v}&quot;</span>},
                      </motion.p>
                    ))}
                    <p className="text-muted-foreground">{"})"}</p>
                    <button
                      type="button"
                      onClick={() => onOpenTrace(g.trace)}
                      className="group/open mt-2 inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 font-sans text-[0.68rem] text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary-soft hover:text-primary-soft-foreground"
                    >
                      Open trace {g.trace}
                      <ArrowUpRight className="size-3 transition-transform group-hover/open:-translate-y-px group-hover/open:translate-x-px" aria-hidden />
                    </button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}

/* ── Connectors ─────────────────────────────────────────── */

type Connector = { id: string; name: string; logo?: string; tone?: string; icon?: typeof Radio; enabled: boolean; base: number };

const connectorList: Connector[] = [
  { id: "posthog", name: "PostHog", logo: "/logos/posthog.svg", enabled: true, base: 1284 },
  { id: "betterstack", name: "Better Stack", logo: "/logos/better-stack.png", enabled: true, base: 2310 },
  { id: "sentry", name: "Sentry", logo: "/logos/sentry.svg", tone: "dark:invert", enabled: true, base: 41 },
  { id: "otlp", name: "OTLP · grafana", icon: Radio, enabled: true, base: 2306 },
  { id: "databuddy", name: "Databuddy", logo: "/logos/databuddy.svg", tone: "invert dark:invert-0", enabled: false, base: 0 },
  { id: "newrelic", name: "New Relic", icon: Activity, enabled: false, base: 0 },
];

function Switch({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onToggle}
      className={`flex h-4 w-7 shrink-0 items-center rounded-full p-0.5 transition-colors duration-300 active:scale-95 ${on ? "justify-end bg-primary" : "justify-start bg-muted-foreground/30"}`}
    >
      <motion.span layout transition={{ type: "spring", stiffness: 700, damping: 30 }} className="size-3 rounded-full bg-background shadow-sm" />
    </button>
  );
}

export function ConnectorsView() {
  const reduceMotion = useReducedMotion() ?? false;
  const [enabled, setEnabled] = useState(() => Object.fromEntries(connectorList.map((c) => [c.id, c.enabled])) as Record<string, boolean>);
  const [sent, setSent] = useState(() => Object.fromEntries(connectorList.map((c) => [c.id, c.base])) as Record<string, number>);
  const [history, setHistory] = useState(() =>
    Object.fromEntries(connectorList.map((c, i) => [c.id, Array.from({ length: 14 }, (_, j) => (c.enabled ? 2 + ((i * 7 + j * 5) % 6) : 0))])) as Record<string, number[]>,
  );
  const enabledRef = useRef(enabled);
  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      const bumps = Object.fromEntries(connectorList.map((c) => [c.id, enabledRef.current[c.id] ? 1 + Math.floor(Math.random() * 6) : 0]));
      setSent((s) => Object.fromEntries(Object.entries(s).map(([k, v]) => [k, v + bumps[k]])));
      setHistory((h) => Object.fromEntries(Object.entries(h).map(([k, v]) => [k, [...v.slice(1), bumps[k]]])));
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  return (
    <div className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2">
      {connectorList.map((c) => {
        const on = enabled[c.id];
        const Icon = c.icon;
        return (
          <div key={c.id} className={`flex flex-col gap-2.5 rounded-lg border bg-card p-3 shadow-xs transition-[border-color,opacity] duration-300 ${on ? "border-border" : "border-dashed border-border opacity-70"}`}>
            <div className="flex items-center gap-2">
              <span className="grid size-7 shrink-0 place-items-center rounded-md bg-muted">
                {c.logo ? (
                  <Image src={c.logo} alt="" width={16} height={16} className={`size-4 object-contain ${c.tone ?? ""} ${on ? "" : "grayscale"}`} />
                ) : Icon ? (
                  <Icon className={`size-4 ${on ? "text-level-info" : "text-muted-foreground"}`} aria-hidden />
                ) : null}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.76rem] font-medium">{c.name}</span>
                <span className="block font-mono text-[0.6rem] text-muted-foreground">{on ? 'mode: "auto"' : "disabled"}</span>
              </span>
              <Switch on={on} label={`Toggle ${c.name}`} onToggle={() => setEnabled((e) => ({ ...e, [c.id]: !e[c.id] }))} />
            </div>
            <div className="flex items-end justify-between gap-3">
              <span className="flex h-6 flex-1 items-end gap-[2px]" aria-hidden>
                {history[c.id].map((v, i) => (
                  <span
                    key={i}
                    className={`flex-1 rounded-[1px] transition-[height] duration-500 ${on ? (i === history[c.id].length - 1 ? "bg-primary" : "bg-foreground/25") : "bg-muted-foreground/20"}`}
                    style={{ height: `${Math.max(8, (v / 7) * 100)}%` }}
                  />
                ))}
              </span>
              <span className="font-mono text-[0.66rem] tabular-nums text-muted-foreground">
                <span className="text-foreground">{sent[c.id].toLocaleString("en-US")}</span> sent
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Database ───────────────────────────────────────────── */

const adapters = {
  prisma: { label: "Prisma", query: "prisma.blypLog.findMany({ orderBy: { timestamp: \"desc\" } })", note: "BlypLog model" },
  drizzle: { label: "Drizzle", query: "SELECT * FROM blyp_logs ORDER BY timestamp DESC LIMIT 8", note: "blyp_logs table" },
  mongodb: { label: "MongoDB", query: "db.blyp_logs.find().sort({ timestamp: -1 }).limit(8)", note: "blyp_logs collection" },
};

export function DatabaseView({ rows }: { rows: LogLine[] }) {
  const [adapter, setAdapter] = useState<keyof typeof adapters>("prisma");
  const a = adapters[adapter];
  const ordered = [...rows].reverse();
  return (
    <div className="flex h-full flex-col gap-3 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <RubberSegment
          aria-label="Database adapter"
          items={Object.entries(adapters).map(([value, x]) => ({ value, label: x.label }))}
          value={adapter}
          onChange={(v) => setAdapter(v as keyof typeof adapters)}
          size="sm"
          radius={999}
          trackColor="var(--muted)"
          thumbColor="var(--card)"
          textColor="var(--graphite)"
          activeTextColor="var(--ink)"
          className="shadow-[inset_0_0_0_1px_var(--rule)]"
        />
        <span className="font-mono text-[0.62rem] text-muted-foreground">
          {a.note} · {rows.length} rows
        </span>
      </div>
      <div className="overflow-hidden rounded-md border border-border bg-card px-3 py-2 font-mono text-[0.66rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={adapter}
            className="truncate text-muted-foreground"
            initial={{ opacity: 0, y: 6, filter: "blur(3px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(3px)" }}
            transition={{ duration: 0.25, ease }}
          >
            <span className="text-primary">›</span> <span className="text-foreground">{a.query}</span>
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-border bg-card shadow-xs">
        <div className="grid grid-cols-[2.5rem_3.5rem_minmax(0,1fr)_5.5rem] gap-2 border-b border-border px-3 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground sm:grid-cols-[2.5rem_3.5rem_4.5rem_minmax(0,1fr)_5.5rem]">
          <span>id</span>
          <span>level</span>
          <span className="hidden sm:block">source</span>
          <span>message</span>
          <span className="text-right">timestamp</span>
        </div>
        <ul className="font-mono text-[0.66rem]">
          <AnimatePresence initial={false}>
            {ordered.map((r) => {
              const id = script.indexOf(r) + 1;
              return (
                <motion.li
                  key={r.at}
                  layout="position"
                  initial={{ opacity: 0, backgroundColor: "color-mix(in oklch, var(--signal) 18%, transparent)" }}
                  animate={{ opacity: 1, backgroundColor: "color-mix(in oklch, var(--signal) 0%, transparent)" }}
                  transition={{ duration: 1.2, ease }}
                  className="grid grid-cols-[2.5rem_3.5rem_minmax(0,1fr)_5.5rem] items-center gap-2 border-b border-border/60 px-3 py-1.5 sm:grid-cols-[2.5rem_3.5rem_4.5rem_minmax(0,1fr)_5.5rem]"
                >
                  <span className="tabular-nums text-muted-foreground">{id}</span>
                  <span className={`w-fit rounded-[3px] px-1 text-[0.56rem] uppercase ${levelStyles[r.level]}`}>{r.level}</span>
                  <span className="hidden truncate text-muted-foreground sm:block">{r.source}</span>
                  <span className="truncate text-foreground">{r.text}</span>
                  <span className="text-right tabular-nums text-muted-foreground">{r.at.slice(0, 8)}</span>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}

/* ── Ask AI ─────────────────────────────────────────────── */

const prompts = [
  {
    q: "Why did the checkout payment retry?",
    a: "Stripe answered the first payment_intent with rate_limited, so the call retried once (1/3). The retry went through and checkout.completed was emitted at 12:04:32.497 with payment.retries = 1.",
    cites: [
      { label: "12:04:32.191 warn · stripe", view: "logs" as StudioView },
      { label: "12:04:32.497 event · checkout", view: "logs" as StudioView },
    ],
  },
  {
    q: "What is failing in the worker?",
    a: "One BlypError: INVENTORY_LOCKED on sku_9f2 at 12:04:33.012, status 409. Another checkout still held the reservation. Releasing the lock in a finally block, or retrying after its TTL, clears it.",
    cites: [
      { label: "INVENTORY_LOCKED ×3", view: "errors" as StudioView },
      { label: "trace req_9f20", view: "traces" as StudioView },
    ],
  },
  {
    q: "Summarize req_84f2",
    a: "POST /api/checkout took 312ms. Cart validation and the inventory reservation finished in under 30ms; most of the time was Stripe, including one retry. One structured log with 6 fields went out to PostHog, Better Stack, Sentry, and OTLP.",
    cites: [
      { label: "trace req_84f2", view: "traces" as StudioView },
      { label: "4 connector deliveries", view: "connectors" as StudioView },
    ],
  },
];

export function AskAiView({ onNavigate }: { onNavigate: (view: StudioView) => void }) {
  const reduceMotion = useReducedMotion() ?? false;
  const [asked, setAsked] = useState(0);
  const [phase, setPhase] = useState<"thinking" | "typing" | "done">("thinking");
  const [chars, setChars] = useState(0);
  const prompt = prompts[asked];

  useEffect(() => {
    setChars(0);
    if (reduceMotion) {
      setChars(prompt.a.length);
      setPhase("done");
      return;
    }
    setPhase("thinking");
    const think = window.setTimeout(() => setPhase("typing"), 1100);
    return () => window.clearTimeout(think);
  }, [asked, prompt.a.length, reduceMotion]);

  useEffect(() => {
    if (phase !== "typing") return;
    const id = window.setInterval(() => {
      setChars((c) => {
        const next = Math.min(prompt.a.length, c + 3);
        if (next >= prompt.a.length) setPhase("done");
        return next;
      });
    }, 18);
    return () => window.clearInterval(id);
  }, [phase, prompt.a.length]);

  return (
    <div className="flex h-full flex-col p-3">
      <div className="flex min-h-0 flex-1 flex-col justify-end gap-3">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={`q-${asked}`}
            className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-primary px-3 py-2 text-[0.78rem] text-primary-foreground shadow-xs"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={spring}
          >
            {prompt.q}
          </motion.div>
          <motion.div
            key={`a-${asked}`}
            className="max-w-[92%] rounded-2xl rounded-bl-md border border-border bg-card px-3 py-2.5 text-[0.78rem] leading-6 text-foreground shadow-xs"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ ...spring, delay: 0.12 }}
          >
            {phase === "thinking" ? (
              <LatticeLoader label="Reading 8 log lines" status="working" pattern="rain" grid={3} shape="square" cellSize={4} gap={1.5} fontSize={12.5} color="var(--signal)" className="text-muted-foreground" />
            ) : (
              <>
                <p>
                  {prompt.a.slice(0, chars)}
                  {phase === "typing" ? <span className="blyp-caret ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-foreground/70" aria-hidden /> : null}
                </p>
                <AnimatePresence>
                  {phase === "done" ? (
                    <motion.div className="mt-2 flex flex-wrap gap-1.5" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease }}>
                      {prompt.cites.map((c) => (
                        <button
                          key={c.label}
                          type="button"
                          onClick={() => onNavigate(c.view)}
                          className="group/cite inline-flex items-center gap-1 rounded-md border border-border bg-background px-1.5 py-0.5 font-mono text-[0.62rem] text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary-soft hover:text-primary-soft-foreground"
                        >
                          {c.label}
                          <ArrowUpRight className="size-2.5 transition-transform group-hover/cite:-translate-y-px group-hover/cite:translate-x-px" aria-hidden />
                        </button>
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {prompts.map((p, i) =>
          i === asked ? null : (
            <motion.button
              key={p.q}
              type="button"
              layout
              onClick={() => setAsked(i)}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-[0.7rem] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <Sparkles className="size-3 text-primary" aria-hidden />
              {p.q}
            </motion.button>
          ),
        )}
      </div>
      <div className="mt-2 flex items-center gap-2 rounded-lg border border-border-strong bg-card px-3 py-2 shadow-xs">
        <span className="flex-1 truncate text-[0.74rem] text-muted-foreground">Ask about acme-api…</span>
        <span className="hidden rounded-[4px] bg-muted px-1.5 py-0.5 font-mono text-[0.58rem] text-muted-foreground sm:inline">OPENROUTER_MODEL</span>
        <CornerDownLeft className="size-3.5 text-muted-foreground" aria-hidden />
      </div>
    </div>
  );
}
