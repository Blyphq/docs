"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Activity,
  Bot,
  Cable,
  ChevronDown,
  CircleAlert,
  Database,
  GitBranch,
  ScrollText,
  Search,
} from "lucide-react";
import LatticeLoader from "@/app/components/react-bits/micro/lattice-loader";
import CallChip, { type CallChipStatus } from "@/app/components/react-bits/micro/call-chip";
import StatusMark, { type StatusMarkStatus } from "@/app/components/react-bits/micro/status-mark";
import { levelStyles, script, STEP_MS, type StudioView } from "@/app/components/home/studio-data";
import { AskAiView, ConnectorsView, DatabaseView, ErrorsView, TracesView } from "@/app/components/home/studio-views";

const HOLD_STEPS = 4;
const CYCLE = script.length + HOLD_STEPS;

type Timeline<T> = [step: number, value: T][];

const at = <T,>(timeline: Timeline<T>, step: number): T => {
  let value = timeline[0][1];
  for (const [s, v] of timeline) if (step >= s) value = v;
  return value;
};

const connectors: { name: string; argument: string; timeline: Timeline<CallChipStatus> }[] = [
  { name: "posthog", argument: "capture(checkout.completed)", timeline: [[0, "idle"], [6, "running"], [7, "done"]] },
  { name: "betterstack", argument: "ingest · 6 records", timeline: [[0, "idle"], [6, "running"], [8, "done"]] },
  { name: "sentry", argument: "captureException(INVENTORY_LOCKED)", timeline: [[0, "idle"], [7, "running"], [8, "done"]] },
  { name: "otlp", argument: "POST /v1/logs", timeline: [[0, "idle"], [6, "running"], [7, "error"], [9, "running"], [10, "done"]] },
];

const spans: { label: string; ms: string; timeline: Timeline<StatusMarkStatus> }[] = [
  { label: "validate cart", ms: "4ms", timeline: [[0, "pending"], [3, "running"], [4, "done"]] },
  { label: "reserve inventory", ms: "21ms", timeline: [[0, "pending"], [4, "running"], [5, "done"]] },
  { label: "charge card", ms: "302ms", timeline: [[0, "pending"], [5, "running"], [6, "done"]] },
  { label: "emit structured log", ms: "1ms", timeline: [[0, "pending"], [6, "running"], [7, "done"]] },
];

const nav: { id: StudioView; icon: typeof ScrollText; label: string; count?: string; meta: string }[] = [
  { id: "logs", icon: ScrollText, label: "Logs", count: "2.4k", meta: "" },
  { id: "traces", icon: GitBranch, label: "Traces", count: "318", meta: "5 recent · grouped by request" },
  { id: "errors", icon: CircleAlert, label: "Errors", count: "3", meta: "BlypError groups · last hour" },
  { id: "connectors", icon: Cable, label: "Connectors", count: "4", meta: "blyp.config.ts · connectors" },
  { id: "database", icon: Database, label: "Database", meta: "logs as rows" },
  { id: "ai", icon: Bot, label: "Ask AI", meta: "answers from this project's logs" },
];

function useStep(reduceMotion: boolean) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(reduceMotion ? script.length + 3 : 0);

  useEffect(() => {
    if (reduceMotion) {
      setStep(script.length + 3);
      return;
    }
    const el = rootRef.current;
    if (!el) return;
    let id: number | undefined;
    const io = new IntersectionObserver(([entry]) => {
      window.clearInterval(id);
      if (entry.isIntersecting) id = window.setInterval(() => setStep((s) => (s + 1) % CYCLE), STEP_MS);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, [reduceMotion]);

  return { rootRef, step };
}

export function StudioMock() {
  const reduceMotion = useReducedMotion() ?? false;
  const { rootRef, step } = useStep(reduceMotion);
  const visible = script.slice(0, Math.min(step + 1, script.length));
  const streaming = step < script.length;
  const errorCount = visible.filter((l) => l.level === "error").length;
  const [view, setView] = useState<StudioView>("logs");
  const [traceId, setTraceId] = useState("req_84f2");
  const current = nav.find((n) => n.id === view) ?? nav[0];
  const CurrentIcon = current.icon;

  const openTrace = (id: string) => {
    setTraceId(id);
    setView("traces");
  };

  return (
    <div
      ref={rootRef}
      className="relative flex h-[34rem] w-full overflow-hidden rounded-lg border border-border bg-background text-left shadow-stage sm:h-[38rem]"
      aria-label="Blyp Studio preview with sample data"
      role="region"
    >
      {/* Sidebar */}
      <aside className="hidden w-[12.5rem] shrink-0 flex-col gap-4 border-r border-border bg-sidebar px-3 py-4 md:flex">
        <div className="flex items-center gap-2 px-1">
          <span className="grid size-6 place-items-center rounded-[5px] bg-foreground font-heading text-[0.8rem] font-bold text-background">
            b
          </span>
          <span className="font-heading text-[0.95rem] font-semibold tracking-[-0.03em]">blyp studio</span>
        </div>

        <div className="flex flex-col gap-1 px-1">
          <span className="text-[0.7rem] text-muted-foreground">Project</span>
          <span className="flex h-8 items-center justify-between rounded-md border border-border-strong bg-card px-2.5 text-[0.8rem] shadow-xs">
            acme-api
            <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden />
          </span>
        </div>

        <nav className="flex flex-col gap-0.5 border-t border-border pt-3" aria-label="Studio sections">
          {nav.map(({ id, icon: Icon, label, count }) => {
            const active = id === view;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setView(id)}
                aria-current={active ? "page" : undefined}
                className={`group/nav relative flex h-8 items-center gap-2.5 rounded-md px-2 text-left text-[0.8rem] transition-colors duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  active ? "text-primary-soft-foreground" : "text-foreground/80 hover:bg-sidebar-accent hover:text-foreground"
                }`}
              >
                {active ? (
                  <motion.span
                    layoutId="studio-nav"
                    className="absolute inset-0 rounded-md bg-primary-soft"
                    transition={{ type: "spring", stiffness: 500, damping: 36 }}
                  />
                ) : null}
                <Icon
                  className="relative size-3.5 transition-transform duration-300 ease-out-expo group-hover/nav:-rotate-6 group-hover/nav:scale-110"
                  aria-hidden
                />
                <span className="relative">{label}</span>
                {count ? (
                  <span className="relative ml-auto font-mono text-[0.68rem] tabular-nums text-muted-foreground">
                    {id === "errors" ? errorCount + 2 : count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto rounded-md border border-border bg-card p-2.5 shadow-xs">
          <div className="flex items-center justify-between text-[0.7rem] text-muted-foreground">
            <span>Retention</span>
            <span className="font-mono tabular-nums">62%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[62%] rounded-full bg-foreground/80" />
          </div>
          <p className="mt-2 text-[0.68rem] leading-snug text-muted-foreground">
            NDJSON · rotates at 10 MB
          </p>
        </div>
      </aside>

      {/* Stream */}
      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border px-4">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={view}
              className="flex min-w-0 items-center gap-2"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {view === "logs" ? (
                <LatticeLoader
                  label={streaming ? "Streaming" : "Idle"}
                  doneLabel="Caught up in"
                  status={streaming ? "working" : "done"}
                  pattern="rain"
                  grid={3}
                  shape="square"
                  cellSize={4}
                  gap={1.5}
                  fontSize={12.5}
                  color="var(--signal)"
                  doneColor="var(--level-ok)"
                  className="text-foreground"
                />
              ) : (
                <>
                  <CurrentIcon className="size-3.5 shrink-0 text-primary" aria-hidden />
                  <span className="text-[0.82rem] font-medium">{current.label}</span>
                  <span className="hidden truncate text-[0.7rem] text-muted-foreground sm:inline">· {current.meta}</span>
                </>
              )}
            </motion.div>
          </AnimatePresence>
          <div className={`ml-auto hidden items-center gap-1.5 ${view === "logs" ? "sm:flex" : ""}`}>
            {(["info", "warn", "error"] as const).map((level) => (
              <span
                key={level}
                className={`rounded-[4px] px-1.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.06em] ${levelStyles[level]}`}
              >
                {level}
              </span>
            ))}
          </div>
          <span className={`flex h-7 items-center gap-1.5 rounded-md border border-border bg-card px-2 text-[0.72rem] text-muted-foreground shadow-xs ml-auto ${view === "logs" ? "sm:ml-0" : ""}`}>
            <Search className="size-3" aria-hidden />
            <span className="hidden lg:inline">trace:req_84f2</span>
            <kbd className="rounded-[3px] bg-muted px-1 font-mono text-[0.62rem]">⌘K</kbd>
          </span>
        </header>

        <div className="flex gap-1 overflow-x-auto border-b border-border px-2 py-1.5 [scrollbar-width:none] md:hidden" role="tablist" aria-label="Studio sections">
          {nav.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={id === view}
              onClick={() => setView(id)}
              className={`relative flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-[0.72rem] ${id === view ? "text-primary-soft-foreground" : "text-muted-foreground"}`}
            >
              {id === view ? <motion.span layoutId="studio-tab" className="absolute inset-0 rounded-md bg-primary-soft" /> : null}
              <Icon className="relative size-3.5" aria-hidden />
              <span className="relative">{label}</span>
            </button>
          ))}
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={view}
              className="absolute inset-0 overflow-y-auto [scrollbar-width:thin]"
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              {view === "traces" ? <TracesView selected={traceId} onSelect={setTraceId} /> : null}
              {view === "errors" ? <ErrorsView liveErrors={errorCount} onOpenTrace={openTrace} /> : null}
              {view === "connectors" ? <ConnectorsView /> : null}
              {view === "database" ? <DatabaseView rows={visible} /> : null}
              {view === "ai" ? <AskAiView onNavigate={setView} /> : null}
              {view === "logs" ? <LogStream visible={visible} /> : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Right rail */}
      <aside className="hidden w-[17.5rem] shrink-0 flex-col border-l border-border bg-sidebar/60 lg:flex">
        <div className="border-b border-border px-4 py-3">
          <p className="flex items-center gap-1.5 text-[0.72rem] font-medium text-muted-foreground">
            <Activity className="size-3" aria-hidden />
            Request <span className="font-mono text-foreground">req_84f2</span>
          </p>
          <ul className="mt-3 flex flex-col gap-2.5">
            {spans.map((span) => {
              const status = at(span.timeline, step);
              return (
                <li key={span.label} className="flex items-center justify-between gap-2">
                  <StatusMark
                    status={status}
                    label={span.label}
                    size={15}
                    fontSize={12.5}
                    strike={false}
                    color="var(--graphite)"
                    doneColor="var(--level-ok)"
                    errorColor="var(--signal)"
                    className="gap-2 text-foreground"
                  />
                  <span
                    className={`font-mono text-[0.66rem] tabular-nums text-muted-foreground transition-opacity duration-300 ${
                      status === "done" ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {span.ms}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-4 py-3">
          <p className="text-[0.72rem] font-medium text-muted-foreground">Connector deliveries</p>
          <ul className="mt-3 flex flex-col gap-2">
            {connectors.map((c) => (
              <li key={c.name} className="min-w-0">
                <CallChip
                  icon="terminal"
                  name={c.name}
                  argument={c.argument}
                  status={at(c.timeline, step)}
                  expectedMs={STEP_MS}
                  size={28}
                  radius={7}
                  surfaceColor="var(--card)"
                  color="var(--foreground)"
                  progressColor="var(--signal)"
                  progressOpacity={0.14}
                  doneColor="var(--level-ok)"
                  errorColor="var(--signal)"
                  className="max-w-full border border-border shadow-xs"
                />
              </li>
            ))}
          </ul>
          <p className="mt-auto pt-3 text-[0.68rem] leading-snug text-muted-foreground">
            Sample data · nothing leaves your browser
          </p>
        </div>
      </aside>
    </div>
  );
}

function LogStream({ visible }: { visible: typeof script }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-background to-transparent" />
      <ol className="absolute inset-x-0 bottom-0 flex flex-col gap-1 px-3 pb-3 font-mono text-[0.72rem] sm:text-[0.75rem]">
        {visible.map((line, i) => (
          <li key={`${line.at}-${i}`} className="blyp-line-in">
            <div
              className={`group/line flex items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors duration-150 hover:bg-muted ${
                line.level === "error" ? "bg-primary/[0.06]" : ""
              }`}
            >
              <span className="hidden shrink-0 tabular-nums text-muted-foreground/70 sm:inline">{line.at}</span>
              <span
                className={`w-12 shrink-0 rounded-[4px] py-0.5 text-center text-[0.62rem] uppercase tracking-[0.06em] ${levelStyles[line.level]}`}
              >
                {line.level}
              </span>
              <span className="w-16 shrink-0 truncate text-muted-foreground">{line.source}</span>
              <span className="truncate whitespace-pre text-foreground">{line.text}</span>
            </div>
            {line.level === "event" ? <StructuredEvent /> : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

function StructuredEvent() {
  const fields: [string, string][] = [
    ["user.id", "usr_29a1"],
    ["cart.items", "3"],
    ["payment", "stripe · succeeded"],
    ["payment.retries", "1"],
    ["db.queries", "4 · 38ms"],
    ["duration", "312ms"],
  ];
  return (
    <div className="blyp-line-in ml-2 mt-1 mb-1 rounded-md border border-primary/25 border-l-2 border-l-primary bg-card px-3 py-2 shadow-xs [animation-delay:120ms]">
      <div className="flex items-center justify-between font-sans text-[0.7rem] text-muted-foreground">
        <span>
          createStructuredLog(<span className="font-mono text-foreground">&quot;checkout&quot;</span>).emit()
        </span>
        <span className="font-mono">6 fields</span>
      </div>
      <dl className="mt-1.5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5">
        {fields.map(([k, v], i) => (
          <div key={k} className="contents">
            <dt className="blyp-line-in text-muted-foreground" style={{ animationDelay: `${200 + i * 60}ms` }}>
              {k}
            </dt>
            <dd className="blyp-line-in truncate text-foreground" style={{ animationDelay: `${200 + i * 60}ms` }}>
              {v}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
