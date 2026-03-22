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

const logTimestamps = ["+0ms", "+84ms", "+142ms", "+189ms", "+243ms"];

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
    delay: 3.8,
  },
  {
    label: "Critical fields",
    value: "payment.status=declined user.plan=pro",
    delay: 3.95,
  },
  {
    label: "Next step",
    value: "Inspect Studio or enable database logging",
    delay: 4.1,
  },
];

const aiResponse =
  "I found one grouped checkout event. The emit shows payment.status=declined, user.plan=pro, and status=402, so the failure happened during card authorization. If you want the full trail, open Studio or persist the same structured payload with database logging after db:init.";

type ToolCall = {
  id: string;
  name: string;
  params: Array<{ key: string; value: string }>;
  result: string[];
  callDelay: number;
  resultDelay: number;
};

const aiToolCalls: ToolCall[] = [
  {
    id: "tool-1",
    name: "query_logs",
    params: [
      { key: "trace_id", value: '"req_84f2"' },
      { key: "filter", value: '"payment"' },
    ],
    result: [
      'payment.status=declined  why="Card declined by issuer"',
      "→ 1 match in trace_84f2",
    ],
    callDelay: 0.32,
    resultDelay: 0.75,
  },
  {
    id: "tool-2",
    name: "get_structured_emit",
    params: [
      { key: "event", value: '"checkout"' },
      { key: "trace_id", value: '"req_84f2"' },
    ],
    result: [
      'msg="checkout"  status=402',
      'user.id=1842  user.plan="pro"',
      'payment.status="declined"',
    ],
    callDelay: 1.0,
    resultDelay: 1.42,
  },
];

function nextPanelId(current: ShowcasePanelId): ShowcasePanelId {
  const currentIndex = showcasePanels.findIndex((panel) => panel.id === current);
  const nextIndex = (currentIndex + 1) % showcasePanels.length;
  return showcasePanels[nextIndex].id;
}

function entryTextColor(kind: LogEntry["kind"]) {
  switch (kind) {
    case "plain":
      return "text-muted-foreground/55";
    case "http":
      return "text-chart-3";
    case "structured":
      return "text-foreground/85";
    case "error":
      return "text-destructive";
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
    <div>
      {/* Stream entries — timeline style */}
      <div className="space-y-0.5">
        {logEntries.map((entry, index) => (
          <motion.div
            key={entry.text}
            className="grid items-baseline gap-x-3 px-1 py-2 transition-colors hover:bg-muted/20"
            style={{ gridTemplateColumns: "3rem 4.75rem 1fr" }}
            initial={reduceMotion ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.3,
              delay: reduceMotion ? 0 : entry.delay,
              ease: landingEase,
            }}
          >
            <span className="font-mono text-[0.6rem] tabular-nums text-right text-muted-foreground/30">
              {logTimestamps[index]}
            </span>
            <span className={`font-mono text-[0.6rem] uppercase tracking-[0.1em] ${entryTextColor(entry.kind)}`}>
              {entry.label}
            </span>
            <span className={`font-mono text-xs leading-5 ${entryTextColor(entry.kind)}`}>
              {entry.text}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Emit separator */}
      <motion.div
        className="my-5 flex items-center gap-3"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: reduceMotion ? 0 : 0.35,
          delay: reduceMotion ? 0 : 0.85,
          ease: landingEase,
        }}
      >
        <div className="h-px flex-1 bg-primary/18" />
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-primary/55">emit</span>
        <div className="h-px flex-1 bg-primary/18" />
      </motion.div>

      {/* Emit result — left-accent card */}
      <motion.div
        className="border-l-2 border-primary/40 bg-primary/5 py-3 pl-4 pr-3"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.38,
          delay: reduceMotion ? 0 : 0.92,
          ease: landingEase,
        }}
      >
        <div className="space-y-1 font-mono text-xs">
          {emittedStructuredLines.map((line, index) => (
            <motion.p
              key={line}
              className={index === 0 ? "font-medium text-primary" : "text-muted-foreground"}
              initial={reduceMotion ? false : { opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.2,
                delay: reduceMotion ? 0 : 1.0 + index * 0.07,
                ease: landingEase,
              }}
            >
              {line}
            </motion.p>
          ))}
        </div>
      </motion.div>

      {/* Raw JSON */}
      <motion.p
        className="mt-3 px-1 font-mono text-[0.62rem] leading-5 text-muted-foreground/30"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: reduceMotion ? 0 : 0.3,
          delay: reduceMotion ? 0 : 1.38,
          ease: landingEase,
        }}
      >
        {`{"level":"info","msg":"checkout","user":{"id":1842,"plan":"pro"},"status":402}`}
      </motion.p>
    </div>
  );
}

function CliPanel({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="blyp-terminal-surface overflow-hidden">
      {/* Terminal title bar */}
      <div className="flex items-center justify-between border-b border-white/[0.05] px-4 py-2.5">
        <span className="font-mono text-[0.65rem] text-white/22">zsh — blyp setup</span>
        <span className="font-mono text-[0.62rem] text-white/16">~/workspace/app</span>
      </div>
      {/* Terminal body */}
      <div className="p-5 font-mono text-sm leading-7">
        {cliSteps.map((step, index) => {
          if (step.kind === "command") {
            return (
              <div key={step.text} className="flex items-start gap-2.5">
                <span className="mt-[0.1em] select-none text-emerald-400/55">$</span>
                <TypewriterText
                  as="span"
                  text={step.text}
                  delayMs={reduceMotion ? 0 : step.delay}
                  speedMs={14}
                  className="text-white/82"
                  persistentCursor={index === cliSteps.length - 1}
                />
              </div>
            );
          }
          return (
            <motion.p
              key={step.text}
              className={`pl-[1.375rem] ${
                step.kind === "success"
                  ? "text-emerald-400/70"
                  : step.kind === "prompt"
                    ? "text-amber-300/65"
                    : "text-white/28"
              }`}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: reduceMotion ? 0 : 0.18,
                delay: reduceMotion ? 0 : step.delay / 1000,
                ease: landingEase,
              }}
            >
              {step.text}
            </motion.p>
          );
        })}
      </div>
    </div>
  );
}

function ToolCallBlock({
  tool,
  reduceMotion,
}: {
  tool: ToolCall;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      className="overflow-hidden border border-border/40 bg-muted/12"
      initial={reduceMotion ? false : { opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0 : 0.24,
        delay: reduceMotion ? 0 : tool.callDelay,
        ease: landingEase,
      }}
    >
      {/* Header — tool name + status */}
      <div className="flex items-center justify-between border-b border-border/30 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[0.7rem] text-muted-foreground/40" aria-hidden="true">ƒ</span>
          <span className="font-mono text-xs text-foreground/75">{tool.name}</span>
        </div>
        {/* Running indicator — visible until result arrives */}
        <motion.div
          className="flex items-center gap-1.5"
          initial={reduceMotion ? false : { opacity: 1 }}
          animate={reduceMotion ? {} : { opacity: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.15,
            delay: reduceMotion ? 0 : tool.resultDelay - 0.05,
          }}
          aria-hidden="true"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="size-1 rounded-full bg-muted-foreground/35"
              animate={reduceMotion ? {} : { opacity: [0.2, 0.9, 0.2] }}
              transition={{ duration: 0.65, delay: i * 0.12, repeat: Infinity }}
            />
          ))}
        </motion.div>
        {/* Done badge — fades in when result arrives */}
        <motion.div
          className="absolute flex items-center gap-1.5 font-mono text-[0.58rem] uppercase tracking-[0.1em] text-emerald-500/65"
          style={{ position: "relative" }}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: reduceMotion ? 0 : 0.22,
            delay: reduceMotion ? 0 : tool.resultDelay,
          }}
        >
          <span className="size-1.5 rounded-full bg-emerald-500/55" />
          done
        </motion.div>
      </div>

      {/* Params */}
      <div className="space-y-1 px-3 py-2.5">
        {tool.params.map((param) => (
          <div key={param.key} className="flex items-baseline gap-3">
            <span className="min-w-[4.5rem] font-mono text-[0.62rem] text-muted-foreground/38">
              {param.key}
            </span>
            <span className="font-mono text-[0.62rem] text-foreground/60">{param.value}</span>
          </div>
        ))}
      </div>

      {/* Result — slides in when the tool resolves */}
      <motion.div
        className="space-y-0.5 border-t border-border/28 bg-background/25 px-3 py-2.5"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: reduceMotion ? 0 : 0.3,
          delay: reduceMotion ? 0 : tool.resultDelay,
          ease: landingEase,
        }}
      >
        {tool.result.map((line) => (
          <p key={line} className="font-mono text-[0.62rem] leading-5 text-muted-foreground/55">
            {line}
          </p>
        ))}
      </motion.div>
    </motion.div>
  );
}

function AiPanel({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      {/* User message — right-aligned bubble */}
      <motion.div
        className="flex justify-end"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.28, ease: landingEase }}
      >
        <div className="max-w-xs">
          <div className="border border-primary/22 bg-primary/8 px-4 py-3">
            <p className="text-sm leading-6 text-foreground">
              Show me the structured log for the failed payment.
            </p>
          </div>
          <p className="mr-1 mt-1 text-right font-mono text-[0.58rem] text-muted-foreground/30">you</p>
        </div>
      </motion.div>

      {/* Tool calls */}
      <div className="flex flex-col gap-2">
        {aiToolCalls.map((tool) => (
          <ToolCallBlock key={tool.id} tool={tool} reduceMotion={reduceMotion} />
        ))}
      </div>

      {/* Agent response */}
      <motion.div
        className="flex items-start gap-3"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.34,
          delay: reduceMotion ? 0 : 1.72,
          ease: landingEase,
        }}
      >
        {/* Blyp avatar */}
        <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center border border-primary/32 bg-primary/10">
          <span className="font-mono text-[0.58rem] font-semibold text-primary">B</span>
        </div>
        <div className="flex-1 border border-border/55 bg-background/50 px-4 py-3">
          <TypewriterText
            as="p"
            text={aiResponse}
            delayMs={reduceMotion ? 0 : 1920}
            speedMs={8}
            className="text-sm leading-7 text-foreground"
          />
        </div>
      </motion.div>

      {/* Evidence — left-border annotations */}
      <div className="grid gap-3 pl-8 sm:grid-cols-3">
        {aiEvidenceCards.map((card) => (
          <motion.div
            key={card.label}
            className="border-l-2 border-primary/28 py-0.5 pl-3"
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.26,
              delay: reduceMotion ? 0 : card.delay,
              ease: landingEase,
            }}
          >
            <p className="font-mono text-[0.58rem] uppercase tracking-[0.12em] text-muted-foreground/45">
              {card.label}
            </p>
            <p className="mt-0.5 text-xs leading-5 text-foreground/85">{card.value}</p>
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
      className="relative isolate overflow-hidden border border-border/60 bg-card/95 shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-primary)_7%,transparent),0_24px_56px_-18px_rgba(0,0,0,0.28)] backdrop-blur-sm"
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
      {/* Background texture — reduced opacity for less visual noise */}
      <div className="blyp-terminal-grid pointer-events-none absolute inset-0 opacity-22" aria-hidden="true" />
      <div className="blyp-noise pointer-events-none absolute inset-0 opacity-45" aria-hidden="true" />

      <div className="relative z-10">
        {/* Top bar — path breadcrumb + live indicator */}
        <div className="flex items-center justify-between border-b border-border/45 px-5 py-3 sm:px-6">
          <div className="flex items-center gap-1.5 font-mono text-[0.68rem] text-muted-foreground/45">
            <span>workspace</span>
            <span className="text-border/60">›</span>
            <span>checkout</span>
            <span className="text-border/60">›</span>
            <span className="text-foreground/65">trace_84f2</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground/35">
            <span className="blyp-live-dot size-1.5 rounded-full bg-emerald-500/55" aria-hidden="true" />
            live
          </div>
        </div>

        {/* Tab strip — sliding underline indicator */}
        <div
          className="flex items-end border-b border-border/45"
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
                className={`relative px-5 py-3 text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground/50 hover:text-muted-foreground/80"
                }`}
              >
                {panel.label}
                {isActive ? (
                  <motion.div
                    layoutId="showcase-tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-px bg-primary"
                    transition={{ duration: 0.22, ease: landingEase }}
                  />
                ) : null}
              </button>
            );
          })}

          {/* Eyebrow hint — fades with active tab */}
          <div className="ml-auto flex items-end pb-3 pr-5 sm:pr-6">
            <AnimatePresence mode="wait">
              <motion.span
                key={activePanel}
                className="font-mono text-[0.62rem] text-muted-foreground/38"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {activeConfig.eyebrow}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Panel content */}
        <div className="min-h-[24rem] px-5 py-6 sm:px-6 lg:min-h-[30rem]">
          <AnimatePresence mode="wait">
            <motion.section
              key={activePanel}
              id={`${activePanel}-panel`}
              role="tabpanel"
              aria-labelledby={`${activePanel}-tab`}
              initial={reduceMotion ? false : { opacity: 0, y: 6, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 6, filter: "blur(5px)" }}
              transition={{ duration: reduceMotion ? 0 : 0.32, ease: landingEase }}
              className="h-full"
            >
              {activePanel === "logs" ? <LogsPanel reduceMotion={reduceMotion} /> : null}
              {activePanel === "cli" ? <CliPanel reduceMotion={reduceMotion} /> : null}
              {activePanel === "ai" ? <AiPanel reduceMotion={reduceMotion} /> : null}
            </motion.section>
          </AnimatePresence>
        </div>

        {/* Status bar — trace metadata */}
        <div className="flex items-center justify-between border-t border-border/45 px-5 py-3 sm:px-6">
          <div className="flex items-center gap-2.5 font-mono text-[0.6rem] text-muted-foreground/30">
            <span>trace_84f2</span>
            <span className="text-border/50">·</span>
            <span>243ms</span>
            <span className="text-border/50">·</span>
            <span>5 events</span>
            <span className="text-border/50">·</span>
            <span className="text-destructive/45">1 error</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[0.6rem] text-muted-foreground/28 transition-colors hover:text-muted-foreground/50">
            <span>View in Studio</span>
            <span aria-hidden="true">→</span>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
