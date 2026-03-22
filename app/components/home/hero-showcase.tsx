"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type ShowcasePanelId = "logs" | "cli" | "ai";

type ShowcasePanel = {
  id: ShowcasePanelId;
  label: string;
  eyebrow: string;
  title: string;
  blurb: string;
};

type LogEntry = {
  kind: "plain" | "http" | "structured" | "error";
  label: string;
  text: string;
  delay: number;
};

type CliStep = {
  kind: "command" | "output" | "prompt" | "success";
  text: string;
  delay: number;
};

type EvidenceCard = {
  label: string;
  value: string;
  delay: number;
};

const landingEase = [0.22, 1, 0.36, 1] as const;
const autoplayDelayMs = 7600;

const showcasePanels: ShowcasePanel[] = [
  {
    id: "logs",
    label: "Logs",
    eyebrow: "Mixed signals, one timeline",
    title: "Plain logs, API traffic, and structured emits in one stream.",
    blurb:
      "Blyp keeps the noisy lines visible, then lands the final grouped event with the context that matters.",
  },
  {
    id: "cli",
    label: "CLI + Studio",
    eyebrow: "Docs-backed setup",
    title: "Install the package, scaffold database logging, then open Studio.",
    blurb:
      "The flow mirrors the docs: install `@blyp/core`, run `db:init`, migrate, generate, and launch Studio locally.",
  },
  {
    id: "ai",
    label: "Ask AI",
    eyebrow: "Interrogate the trace",
    title: "Ask about the grouped event and get an answer that cites the payload.",
    blurb:
      "The conversation stays grounded in Blyp's structured log fields instead of hand-wavy summaries.",
  },
];

const docsSourceMap: Record<ShowcasePanelId, string[]> = {
  logs: ["Structured Logs", "Basic Usage"],
  cli: ["Installation", "CLI", "Database Logging"],
  ai: ["Structured Logs", "Database Logging", "CLI"],
};

const logLegend = [
  { id: "plain", label: "plain" },
  { id: "http", label: "http" },
  { id: "structured", label: "structured" },
  { id: "error", label: "error" },
] as const;

const logEntries: LogEntry[] = [
  {
    kind: "plain",
    label: "plain",
    text: "[INFO] server booted",
    delay: 0.12,
  },
  {
    kind: "http",
    label: "http",
    text: 'GET /api/checkout 200 84ms trace="req_84f2"',
    delay: 0.26,
  },
  {
    kind: "structured",
    label: "structured",
    text: "structuredLog.set user.id=1842 cart.total=9999",
    delay: 0.4,
  },
  {
    kind: "structured",
    label: "structured",
    text: "structuredLog.info payment authorized",
    delay: 0.54,
  },
  {
    kind: "error",
    label: "error",
    text: 'payment.status=declined why="Card declined by issuer"',
    delay: 0.68,
  },
];

const emittedStructuredLines = [
  "checkout",
  "user.id=1842 user.plan=pro",
  "cart.items=3 cart.total=9999",
  "status=402",
];

const cliSteps: CliStep[] = [
  { kind: "command", text: "bun add @blyp/core", delay: 120 },
  { kind: "output", text: "installed @blyp/core for bun v1.2+", delay: 940 },
  { kind: "command", text: "bunx @blyp/cli db:init", delay: 1320 },
  { kind: "prompt", text: "? adapter prisma", delay: 2280 },
  { kind: "prompt", text: "? dialect postgres", delay: 2580 },
  { kind: "prompt", text: "? schema blyp_logs", delay: 2860 },
  { kind: "success", text: "wrote blyp.config.ts and prepared migration files", delay: 3160 },
  { kind: "command", text: "bunx @blyp/cli db:migrate", delay: 3640 },
  { kind: "success", text: "migration complete", delay: 4480 },
  { kind: "command", text: "bunx @blyp/cli db:generate", delay: 4760 },
  { kind: "success", text: "Prisma client generated", delay: 5560 },
  { kind: "command", text: "bunx @blyp/cli studio", delay: 5880 },
  { kind: "success", text: "Studio ready at http://localhost:3003", delay: 6700 },
  { kind: "output", text: "workspace=/workspace/app targetPath=.", delay: 7120 },
];

const aiEvidenceCards: EvidenceCard[] = [
  {
    label: "Grouped event",
    value: "checkout emit",
    delay: 1.05,
  },
  {
    label: "Critical fields",
    value: "payment.status=declined user.plan=pro",
    delay: 1.18,
  },
  {
    label: "Next step",
    value: "Inspect Studio or enable database logging",
    delay: 1.31,
  },
];

const aiResponse =
  "I found one grouped checkout event. The emit shows payment.status=declined, user.plan=pro, and status=402, so the failure happened during card authorization. If you want the full trail, open Studio or persist the same structured payload with database logging after db:init.";

function nextPanelId(current: ShowcasePanelId): ShowcasePanelId {
  const currentIndex = showcasePanels.findIndex((panel) => panel.id === current);
  const nextIndex = (currentIndex + 1) % showcasePanels.length;

  return showcasePanels[nextIndex].id;
}

function panelTone(kind: LogEntry["kind"]) {
  switch (kind) {
    case "plain":
      return "border-border/70 text-muted-foreground";
    case "http":
      return "border-chart-3/50 text-chart-3";
    case "structured":
      return "border-primary/45 text-foreground";
    case "error":
      return "border-destructive/40 text-destructive";
  }
}

function TypewriterText({
  text,
  delayMs = 0,
  speedMs = 18,
  className = "",
  as = "span",
  persistentCursor = false,
}: {
  text: string;
  delayMs?: number;
  speedMs?: number;
  className?: string;
  as?: "span" | "p" | "div";
  persistentCursor?: boolean;
}) {
  const reduceMotion = useReducedMotion() ?? false;
  const [visibleCount, setVisibleCount] = useState(reduceMotion ? text.length : 0);

  useEffect(() => {
    if (reduceMotion) {
      setVisibleCount(text.length);
      return;
    }

    setVisibleCount(0);

    let intervalId: number | null = null;
    const timeoutId = window.setTimeout(() => {
      let nextCount = 0;
      intervalId = window.setInterval(() => {
        nextCount += 1;
        setVisibleCount(Math.min(nextCount, text.length));

        if (nextCount >= text.length && intervalId !== null) {
          window.clearInterval(intervalId);
          intervalId = null;
        }
      }, speedMs);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId !== null) {
        window.clearInterval(intervalId);
      }
    };
  }, [delayMs, reduceMotion, speedMs, text]);

  const Comp = as;
  const content = text.slice(0, visibleCount);
  const showCursor = !reduceMotion && (persistentCursor || visibleCount < text.length);

  return (
    <Comp className={className}>
      {content}
      {showCursor ? <TerminalCursor /> : null}
    </Comp>
  );
}

function TerminalCursor() {
  return (
    <motion.span
      aria-hidden="true"
      className="ml-0.5 inline-block h-[1em] w-2 translate-y-[0.12em] bg-primary/80 align-baseline"
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: 0.95, ease: "linear", repeat: Infinity }}
    />
  );
}

function LogsPanel({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[10rem_minmax(0,1fr)]">
      <div className="space-y-3 border-b border-border/70 pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-4">
        <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground/70">
          Stream types
        </p>
        <div className="flex flex-wrap gap-2 lg:flex-col">
          {logLegend.map((item, index) => (
            <motion.span
              key={item.id}
              className={`inline-flex items-center gap-2 border px-3 py-2 text-[0.72rem] uppercase tracking-[0.2em] ${panelTone(item.id)}`}
              initial={reduceMotion ? false : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.28,
                delay: reduceMotion ? 0 : 0.08 + index * 0.06,
                ease: landingEase,
              }}
            >
              <span aria-hidden="true" className="size-1.5 bg-current" />
              {item.label}
            </motion.span>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {logEntries.map((entry) => (
          <motion.div
            key={entry.text}
            className="flex items-start gap-3 border border-border/70 bg-background/55 px-3 py-3 text-sm leading-7 text-muted-foreground"
            initial={reduceMotion ? false : { opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: reduceMotion ? 0 : 0.34,
              delay: reduceMotion ? 0 : entry.delay,
              ease: landingEase,
            }}
          >
            <span
              className={`mt-1 inline-flex min-w-[4.75rem] justify-center border px-2 py-1 text-[0.62rem] uppercase tracking-[0.2em] ${panelTone(entry.kind)}`}
            >
              {entry.label}
            </span>
            <span
              className={
                entry.kind === "http"
                  ? "text-chart-3"
                  : entry.kind === "error"
                    ? "text-destructive"
                    : entry.kind === "structured"
                      ? "text-foreground"
                      : "text-muted-foreground"
              }
            >
              {entry.text}
            </span>
          </motion.div>
        ))}

        <motion.div
          className="border border-primary/35 bg-primary/8 p-4 shadow-[0_18px_35px_-24px_color-mix(in_srgb,var(--color-primary)_70%,transparent)]"
          initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: reduceMotion ? 0 : 0.4,
            delay: reduceMotion ? 0 : 0.92,
            ease: landingEase,
          }}
        >
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-primary">
            Final emit
          </p>
          <div className="mt-3 space-y-2 border border-border/70 bg-background/80 p-4 font-mono text-sm text-foreground">
            {emittedStructuredLines.map((line, index) => (
              <motion.p
                key={line}
                className={index === 0 ? "text-primary" : ""}
                initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.24,
                  delay: reduceMotion ? 0 : 1.04 + index * 0.08,
                  ease: landingEase,
                }}
              >
                {line}
              </motion.p>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="border border-border/70 bg-background/60 p-4 font-mono text-xs leading-6 text-muted-foreground"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: reduceMotion ? 0 : 0.35,
            delay: reduceMotion ? 0 : 1.38,
            ease: landingEase,
          }}
        >
          {`{"level":"info","msg":"checkout","user":{"id":1842,"plan":"pro"},"status":402}`}
        </motion.div>
      </div>
    </div>
  );
}

function CliPanel({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_12rem]">
      <div className="border border-border/70 bg-background/60 p-4 font-mono text-sm leading-7 text-muted-foreground">
        {cliSteps.map((step, index) => {
          if (step.kind === "command") {
            return (
              <TypewriterText
                key={step.text}
                as="p"
                text={`$ ${step.text}`}
                delayMs={reduceMotion ? 0 : step.delay}
                speedMs={14}
                className="text-foreground"
                persistentCursor={index === cliSteps.length - 1}
              />
            );
          }

          return (
            <motion.p
              key={step.text}
              className={
                step.kind === "success"
                  ? "text-primary"
                  : step.kind === "prompt"
                    ? "text-foreground"
                    : "text-muted-foreground"
              }
              initial={reduceMotion ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.22,
                delay: reduceMotion ? 0 : step.delay / 1000,
                ease: landingEase,
              }}
            >
              {step.text}
            </motion.p>
          );
        })}
      </div>

      <motion.div
        className="flex h-fit flex-col gap-3 border border-border/70 bg-background/65 p-4"
        initial={reduceMotion ? false : { opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.34,
          delay: reduceMotion ? 0 : 0.32,
          ease: landingEase,
        }}
      >
        <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground/70">
          Setup notes
        </p>
        <div className="space-y-3 text-sm leading-6">
          <div className="border border-primary/35 bg-primary/8 p-3">
            <p className="text-[0.62rem] uppercase tracking-[0.2em] text-primary">
              Adapter
            </p>
            <p className="mt-2 text-foreground">Prisma + Postgres</p>
          </div>
          <div className="border border-border/70 p-3">
            <p className="text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground/70">
              Config
            </p>
            <p className="mt-2 font-mono text-foreground">blyp.config.ts</p>
          </div>
          <div className="border border-border/70 p-3">
            <p className="text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground/70">
              Studio
            </p>
            <p className="mt-2 font-mono text-foreground">localhost:3003</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function AiPanel({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="space-y-4">
      <motion.div
        className="ml-auto max-w-[22rem] border border-border/70 bg-background/70 px-4 py-4"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.28, ease: landingEase }}
      >
        <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground/70">
          User
        </p>
        <p className="mt-2 text-sm leading-7 text-foreground">
          Show me the structured log for the failed payment.
        </p>
      </motion.div>

      {!reduceMotion ? (
        <motion.div
          className="flex w-fit items-center gap-2 border border-border/70 bg-background/55 px-4 py-3 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.1, delay: 0.22, ease: "easeInOut" }}
        >
          <span className="size-2 rounded-full bg-primary/70" />
          <span className="size-2 rounded-full bg-primary/55" />
          <span className="size-2 rounded-full bg-primary/40" />
        </motion.div>
      ) : null}

      <motion.div
        className="max-w-[34rem] border border-primary/30 bg-primary/8 px-4 py-4"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.34,
          delay: reduceMotion ? 0 : 0.48,
          ease: landingEase,
        }}
      >
        <p className="text-[0.68rem] uppercase tracking-[0.24em] text-primary">
          Agent
        </p>
        <TypewriterText
          as="p"
          text={aiResponse}
          delayMs={reduceMotion ? 0 : 760}
          speedMs={12}
          className="mt-2 text-sm leading-7 text-foreground"
        />
      </motion.div>

      <div className="grid gap-3 md:grid-cols-3">
        {aiEvidenceCards.map((card) => (
          <motion.div
            key={card.label}
            className="border border-border/70 bg-background/65 p-4"
            initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: reduceMotion ? 0 : 0.28,
              delay: reduceMotion ? 0 : card.delay,
              ease: landingEase,
            }}
          >
            <p className="text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground/70">
              {card.label}
            </p>
            <p className="mt-2 text-sm leading-6 text-foreground">{card.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function HeroShowcase() {
  const reduceMotion = useReducedMotion() ?? false;
  const [activePanel, setActivePanel] = useState<ShowcasePanelId>("logs");
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const [autoplayNonce, setAutoplayNonce] = useState(0);

  useEffect(() => {
    if (reduceMotion || isAutoplayPaused) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setActivePanel((current) => nextPanelId(current));
    }, autoplayDelayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activePanel, autoplayNonce, isAutoplayPaused, reduceMotion]);

  const activeConfig =
    showcasePanels.find((panel) => panel.id === activePanel) ?? showcasePanels[0];

  return (
    <motion.aside
      className="relative isolate overflow-hidden border border-border bg-card/95 shadow-[0_20px_60px_-36px_rgba(0,0,0,0.9)] backdrop-blur-sm"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.2, ease: landingEase }}
      onMouseEnter={() => setIsAutoplayPaused(true)}
      onMouseLeave={() => setIsAutoplayPaused(false)}
      onFocusCapture={() => setIsAutoplayPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsAutoplayPaused(false);
        }
      }}
      aria-label="Animated Blyp hero showcase"
    >
      <div className="blyp-terminal-grid pointer-events-none absolute inset-0 opacity-45" aria-hidden="true" />
      <div className="blyp-noise pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      {!reduceMotion ? (
        <motion.span
          aria-hidden="true"
          className="blyp-scanline pointer-events-none absolute left-0 right-0 top-0 z-10 h-24"
          initial={{ y: "-32%" }}
          animate={{ y: ["-32%", "510%"] }}
          transition={{ duration: 3.9, ease: "linear", repeat: Infinity, repeatDelay: 0.8 }}
        />
      ) : null}

      <div className="relative z-10">
        <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="size-2.5 rounded-full bg-destructive" />
            <span aria-hidden="true" className="size-2.5 rounded-full bg-chart-3" />
            <span aria-hidden="true" className="size-2.5 rounded-full bg-chart-2" />
          </div>
          <div className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground/70">
            {activeConfig.label}
          </div>
        </div>

        <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
          <div className="space-y-3">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-primary">
              {activeConfig.eyebrow}
            </p>
            <h2 className="max-w-[34rem] text-balance text-2xl font-semibold tracking-[-0.05em] text-foreground sm:text-[2rem]">
              {activeConfig.title}
            </h2>
            <p className="max-w-[34rem] text-sm leading-7 text-muted-foreground sm:text-base">
              {activeConfig.blurb}
            </p>
          </div>

          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Blyp hero showcase views"
          >
            {showcasePanels.map((panel) => {
              const isActive = panel.id === activePanel;

              return (
                <button
                  key={panel.id}
                  id={`${panel.id}-tab`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`${panel.id}-panel`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => {
                    setActivePanel(panel.id);
                    setAutoplayNonce((current) => current + 1);
                  }}
                  className={`inline-flex items-center gap-2 border px-3 py-2 text-[0.72rem] uppercase tracking-[0.2em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card ${
                    isActive
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`size-1.5 ${isActive ? "bg-primary" : "bg-current"}`}
                  />
                  {panel.label}
                </button>
              );
            })}
          </div>

          <div className="min-h-[28rem] border border-border/70 bg-background/35 p-4 sm:p-5 lg:min-h-[34rem]">
            <AnimatePresence mode="wait">
              <motion.section
                key={activePanel}
                id={`${activePanel}-panel`}
                role="tabpanel"
                aria-labelledby={`${activePanel}-tab`}
                initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.985, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={reduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.985, filter: "blur(6px)" }}
                transition={{ duration: reduceMotion ? 0 : 0.4, ease: landingEase }}
                className="h-full"
              >
                {activePanel === "logs" ? <LogsPanel reduceMotion={reduceMotion} /> : null}
                {activePanel === "cli" ? <CliPanel reduceMotion={reduceMotion} /> : null}
                {activePanel === "ai" ? <AiPanel reduceMotion={reduceMotion} /> : null}
              </motion.section>
            </AnimatePresence>
          </div>
        </div>

        <div className="border-t border-border px-5 py-4 sm:px-6">
          <p className="text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground/70">
            Docs sources
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {docsSourceMap[activePanel].map((source) => (
              <span
                key={source}
                className="inline-flex items-center gap-2 border border-border bg-background/60 px-3 py-2 text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground"
              >
                <span aria-hidden="true" className="size-1.5 bg-primary" />
                {source}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
