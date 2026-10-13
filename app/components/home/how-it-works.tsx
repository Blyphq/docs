"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight, RotateCcw } from "lucide-react";
import RubberSegment from "@/app/components/react-bits/micro/rubber-segment";
import ThoughtLine from "@/app/components/react-bits/micro/thought-line";
import CallChip, { type CallChipStatus } from "@/app/components/react-bits/micro/call-chip";
import StatusMark from "@/app/components/react-bits/micro/status-mark";
import { CodeBlock } from "@/app/components/home/code-block";
import { CopyCommand } from "@/app/components/home/copy-toast";

type StepId = "install" | "log" | "structure" | "ship";

const steps: {
  id: StepId;
  label: string;
  title: string;
  body: string;
  href: string;
  cta: string;
}[] = [
  {
    id: "install",
    label: "Install",
    title: "One package. Every runtime.",
    body: "Add @blyp/core and import the entrypoint that matches where your code runs: the root logger, a framework adapter, the browser client, or Expo.",
    href: "/docs/installation",
    cta: "Installation guide",
  },
  {
    id: "log",
    label: "Log",
    title: "Write logs the way you already do.",
    body: "The root logger feels like console, with levels that stay obvious at a glance. Framework adapters add request logging without extra wiring.",
    href: "/docs/basic-usage",
    cta: "Basic usage",
  },
  {
    id: "structure",
    label: "Structure",
    title: "Collect context, emit once.",
    body: "Build a structured log across a request with .set() and send one grouped record with .emit(). No scattered lines to stitch back together.",
    href: "/docs/structured-logs",
    cta: "Structured logs",
  },
  {
    id: "ship",
    label: "Ship",
    title: "Forward to the tools you already pay for.",
    body: "Turn on a connector in blyp.config.ts. Auto mode forwards server logs; durable delivery buffers retryable failures without Redis.",
    href: "/docs/connectors",
    cta: "Connectors",
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

const ADVANCE_MS = 3000;

export function HowItWorks() {
  const [active, setActive] = useState<StepId>("install");
  const [settled, setSettled] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.35 });
  const index = steps.findIndex((s) => s.id === active);
  const step = steps[index];
  const counting = settled && !paused && inView && !reduceMotion;

  useEffect(() => {
    setSettled(false);
  }, [active]);

  useEffect(() => {
    if (!counting) return;
    const id = window.setTimeout(() => setActive(steps[(index + 1) % steps.length].id), ADVANCE_MS);
    return () => window.clearTimeout(id);
  }, [counting, index]);

  return (
    <section ref={sectionRef} id="how-it-works" className="relative border-y border-border bg-sidebar py-24 sm:py-32">
      <div className="mx-auto w-full max-w-[90rem] px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[44rem] text-center">
          <p className="blyp-eyebrow justify-center">How it works</p>
          <h2 className="mt-5 text-balance font-heading text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-[3.4rem]">
            From first import to your dashboards in four moves.
          </h2>
          <p className="mx-auto mt-5 max-w-[34rem] text-pretty text-[1.05rem] leading-8 text-muted-foreground">
            Follow one checkout request from install to a delivered event. Each step is real Blyp API.
          </p>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ol className="flex flex-col">
              {steps.map((s, i) => {
                const isActive = s.id === active;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => setActive(s.id)}
                      aria-current={isActive ? "step" : undefined}
                      className="group/step relative flex w-full gap-5 border-t border-border py-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span
                        className={`absolute -top-px left-0 h-px bg-primary transition-[width] duration-700 ease-out-expo ${isActive ? "w-full" : "w-0"}`}
                        aria-hidden
                      />
                      {isActive && counting ? (
                        <span
                          className="blyp-countdown absolute -bottom-px left-0 h-0.5 w-full origin-left rounded-full bg-primary/60"
                          style={{ animationDuration: `${ADVANCE_MS}ms` }}
                          aria-hidden
                        />
                      ) : null}
                      <span
                        className={`text-[0.75rem] font-semibold tabular-nums transition-colors duration-300 ${isActive ? "text-primary" : "text-muted-foreground/60"}`}
                      >
                        0{i + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block font-heading text-[1.35rem] font-semibold tracking-[-0.035em] transition-colors duration-300 ${isActive ? "text-foreground" : "text-muted-foreground group-hover/step:text-foreground"}`}
                        >
                          {s.title}
                        </span>
                        <span
                          className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out-expo ${isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                        >
                          <span className="overflow-hidden">
                            <span className="block pt-3 text-[0.95rem] leading-7 text-muted-foreground">{s.body}</span>
                            <Link
                              href={s.href}
                              tabIndex={isActive ? 0 : -1}
                              className="group/link mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground"
                            >
                              <span className="bg-[linear-gradient(var(--signal),var(--signal))] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 ease-out-expo group-hover/link:bg-[length:100%_1px]">
                                {s.cta}
                              </span>
                              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5" aria-hidden />
                            </Link>
                          </span>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="min-w-0">
            <div className="flex justify-center lg:justify-start">
              <RubberSegment
                aria-label="Workflow step"
                items={steps.map((s, i) => ({
                  value: s.id,
                  label: (
                    <span className="flex items-center gap-1.5">
                      <span className="text-[0.68rem] tabular-nums opacity-50">0{i + 1}</span>
                      {s.label}
                    </span>
                  ),
                }))}
                value={active}
                onChange={(v) => setActive(v as StepId)}
                size="md"
                equalSlots
                radius={999}
                trackColor="var(--muted)"
                thumbColor="var(--card)"
                textColor="var(--graphite)"
                activeTextColor="var(--ink)"
                className="shadow-[inset_0_0_0_1px_var(--rule)]"
              />
            </div>

            <div
              className="relative mt-6 min-h-[30rem] overflow-hidden rounded-xl border border-border bg-background p-3 shadow-stage sm:p-4"
              onPointerEnter={() => setPaused(true)}
              onPointerLeave={() => setPaused(false)}
            >
              {counting ? (
                <span
                  key={active}
                  className="blyp-countdown pointer-events-none absolute inset-x-0 top-0 z-10 h-0.5 origin-left bg-primary"
                  style={{ animationDuration: `${ADVANCE_MS}ms` }}
                  aria-hidden
                />
              ) : null}
              <div className="blyp-dot-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,#000,transparent_70%)]" aria-hidden />
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step.id}
                  className="relative"
                  initial={reduceMotion ? false : { opacity: 0, y: 14, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -10, filter: "blur(6px)" }}
                  transition={{ duration: 0.45, ease }}
                >
                  {step.id === "install" ? <InstallPanel onSettle={setSettled} /> : null}
                  {step.id === "log" ? <LogPanel onSettle={setSettled} /> : null}
                  {step.id === "structure" ? <StructurePanel onSettle={setSettled} /> : null}
                  {step.id === "ship" ? <ShipPanel onSettle={setSettled} /> : null}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PanelBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-[4px] border border-border px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
      {children}
    </span>
  );
}

type PanelProps = { onSettle: (settled: boolean) => void };

function InstallPanel({ onSettle }: PanelProps) {
  const [run, setRun] = useState(0);
  const [working, setWorking] = useState(true);

  useEffect(() => {
    setWorking(true);
    const id = window.setTimeout(() => setWorking(false), 2600);
    return () => window.clearTimeout(id);
  }, [run]);

  useEffect(() => {
    onSettle(!working);
  }, [working, onSettle]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <CopyCommand command="bun add @blyp/core" />
        <CopyCommand command="bunx @blyp/cli skills install" />
      </div>
      <div className="blyp-terminal-surface overflow-hidden rounded-lg border border-black/40 font-mono text-[0.78rem] leading-7 shadow-md">
        <div className="flex h-9 items-center justify-between border-b border-white/10 px-3.5 text-[0.7rem] text-white/50">
          <span>~/acme-api · zsh</span>
          <button
            type="button"
            onClick={() => setRun((r) => r + 1)}
            className="flex items-center gap-1 rounded px-1.5 py-0.5 transition-colors hover:bg-white/10 hover:text-white active:scale-95"
          >
            <RotateCcw className="size-3" aria-hidden />
            Replay
          </button>
        </div>
        <div className="px-4 py-3" key={run}>
          <p className="blyp-line-in">
            <span className="text-white/40">$</span> bun add @blyp/core
          </p>
          <p className="blyp-line-in text-white/55 [animation-delay:120ms]">installed @blyp/core · 1 package in 412ms</p>
          <p className="blyp-line-in mt-2 [animation-delay:260ms]">
            <span className="text-white/40">$</span> claude &quot;add blyp logging to the hono app&quot;
          </p>
          <div className="blyp-line-in mt-2 [animation-delay:380ms]">
            <ThoughtLine
              label="Reading .agents/skills/blyp-hono…"
              doneLabel="Followed blyp-hono in"
              working={working}
              steps={[
                "Detected Bun runtime and Hono in src/server.ts",
                "Imported createLogger from @blyp/core/hono",
                "Registered app.use(\"*\", createLogger())",
                "Wrote blyp.config.ts with file logging",
              ]}
              collapseOnSettle={false}
              fontSize={13}
              color="oklch(93% 0.006 80)"
              glyphColor="oklch(70.5% 0.175 31)"
            />
          </div>
          <p className={`mt-2 transition-opacity duration-500 ${working ? "opacity-0" : "opacity-100"}`}>
            <span className="text-[oklch(74%_0.14_155)]">✓</span> ready · logs → ./logs/app.ndjson
            <span className="blyp-caret ml-1 inline-block h-3.5 w-1.5 translate-y-0.5 bg-white/70" aria-hidden />
          </p>
        </div>
      </div>
    </div>
  );
}

const logCode = `import { logger } from "@blyp/core";

logger.info("server started on port 3000");
logger.success("database connection established");
logger.warning("rate limit approaching for user 42");
logger.error("failed to reach payment provider");`;

const output: { level: string; cls: string; text: string }[] = [
  { level: "INFO", cls: "text-[oklch(72%_0.12_240)]", text: "server started on port 3000" },
  { level: "SUCCESS", cls: "text-[oklch(74%_0.14_155)]", text: "database connection established" },
  { level: "WARNING", cls: "text-[oklch(80%_0.13_75)]", text: "rate limit approaching for user 42" },
  { level: "ERROR", cls: "text-[oklch(70.5%_0.175_31)]", text: "failed to reach payment provider" },
];

function LogPanel({ onSettle }: PanelProps) {
  useEffect(() => {
    const id = window.setTimeout(() => onSettle(true), 200 + output.length * 140 + 600);
    return () => window.clearTimeout(id);
  }, [onSettle]);

  return (
    <div className="grid gap-3">
      <CodeBlock code={logCode} file="src/index.ts" badge={<PanelBadge>@blyp/core</PanelBadge>} highlightLines={[3, 4, 5, 6]} />
      <div className="blyp-terminal-surface rounded-lg border border-black/40 px-4 py-3 font-mono text-[0.78rem] leading-7 shadow-md">
        {output.map((line, i) => (
          <p key={line.level} className="blyp-line-in flex gap-3" style={{ animationDelay: `${200 + i * 140}ms` }}>
            <span className={`w-[5.5rem] shrink-0 ${line.cls}`}>[{line.level}]</span>
            <span className="truncate text-white/85">{line.text}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

const structureCode = `import { createStructuredLog } from "@blyp/core";

const log = createStructuredLog("checkout", { service: "web-api" });

log.set({ user: { id: 1, plan: "pro" } });
log.set({ cart: { items: 3, total: 9999 } });
log.set({ payment: { method: "card", status: "success" } });

log.emit({ status: 200, message: "checkout" });`;

const fields: [string, string][] = [
  ["service", "\"web-api\""],
  ["user", "{ id: 1, plan: \"pro\" }"],
  ["cart", "{ items: 3, total: 9999 }"],
  ["payment", "{ method: \"card\", status: \"success\" }"],
  ["status", "200"],
];

function StructurePanel({ onSettle }: PanelProps) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setCount((c) => Math.min(c + 1, fields.length)), 700);
    return () => window.clearInterval(id);
  }, []);
  const emitted = count >= fields.length;

  useEffect(() => {
    onSettle(emitted);
  }, [emitted, onSettle]);

  return (
    <div className="grid gap-3 2xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <CodeBlock
        code={structureCode}
        file="src/routes/checkout.ts"
        badge={<PanelBadge>structured</PanelBadge>}
        highlightLines={emitted ? [9] : count > 0 ? [Math.min(4 + count, 7)] : [3]}
      />
      <div className="flex flex-col rounded-lg border border-border bg-card p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <StatusMark
            status={emitted ? "done" : "running"}
            label={emitted ? "Emitted 1 record" : `Collecting · ${count} field${count === 1 ? "" : "s"}`}
            size={15}
            fontSize={12.5}
            strike={false}
            color="var(--graphite)"
            doneColor="var(--level-ok)"
            className="gap-2 text-foreground"
          />
          <span className="font-mono text-[0.65rem] text-muted-foreground">checkout</span>
        </div>
        <dl className="mt-4 flex flex-col gap-1.5 font-mono text-[0.72rem]">
          {fields.map(([k, v], i) => (
            <div
              key={k}
              className={`flex gap-3 rounded-md border px-2.5 py-1.5 transition-all duration-500 ease-out-expo ${
                i < Math.max(count, 1)
                  ? "translate-y-0 border-border bg-background opacity-100"
                  : "translate-y-1 border-transparent opacity-0"
              } ${emitted ? "border-primary/30" : ""}`}
            >
              <dt className="w-16 shrink-0 text-muted-foreground">{k}</dt>
              <dd className="min-w-0 truncate text-foreground">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-auto pt-4 text-[0.72rem] leading-5 text-muted-foreground">
          Nothing is written until <code className="font-mono text-foreground">.emit()</code>. One request, one record.
        </p>
      </div>
    </div>
  );
}

const shipCode = `export default {
  connectors: {
    posthog: { enabled: true, mode: "auto" },
    sentry: { enabled: true, mode: "auto" },
    otlp: [{ name: "grafana", enabled: true, mode: "auto" }],
  },
};`;

type Delivery = { name: string; argument: string; plan: CallChipStatus[] };

const deliveries: Delivery[] = [
  { name: "posthog", argument: "capture(checkout)", plan: ["running", "done", "done", "done"] },
  { name: "sentry", argument: "captureException(BlypError)", plan: ["running", "running", "done", "done"] },
  { name: "otlp:grafana", argument: "POST /v1/logs", plan: ["running", "error", "running", "done"] },
  { name: "betterstack", argument: "ingest · 6 records", plan: ["idle", "running", "done", "done"] },
];

function ShipPanel({ onSettle }: PanelProps) {
  const [tick, setTick] = useState(-1);
  const [run, setRun] = useState(0);

  useEffect(() => {
    setTick(-1);
    const ids = [0, 1, 2, 3].map((t) => window.setTimeout(() => setTick(t), 500 + t * 1100));
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [run]);

  useEffect(() => {
    onSettle(tick >= 3);
  }, [tick, onSettle]);

  return (
    <div className="grid gap-3 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <CodeBlock code={shipCode} file="blyp.config.ts" badge={<PanelBadge>config</PanelBadge>} highlightLines={[3, 4, 5]} />
      <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 shadow-xs">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[0.75rem] font-medium text-muted-foreground">Connector deliveries</span>
          <button
            type="button"
            onClick={() => setRun((r) => r + 1)}
            className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.7rem] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
          >
            <RotateCcw className="size-3" aria-hidden />
            Resend
          </button>
        </div>
        {deliveries.map((d) => (
          <CallChip
            key={`${d.name}-${run}`}
            icon="terminal"
            name={d.name}
            argument={d.argument}
            status={tick < 0 ? "idle" : d.plan[tick]}
            expectedMs={1100}
            size={30}
            radius={8}
            surfaceColor="var(--background)"
            color="var(--foreground)"
            progressColor="var(--signal)"
            progressOpacity={0.14}
            doneColor="var(--level-ok)"
            errorColor="var(--signal)"
            className="max-w-full border border-border"
          />
        ))}
        <p className="mt-auto pt-3 text-[0.72rem] leading-5 text-muted-foreground">
          Sample data. With connectors.delivery on, retryable failures are buffered and resent.
        </p>
      </div>
    </div>
  );
}
