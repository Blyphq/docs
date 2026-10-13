"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Copy, RotateCcw } from "lucide-react";
import RubberSegment from "@/app/components/react-bits/micro/rubber-segment";
import StatusMark from "@/app/components/react-bits/micro/status-mark";
import { useCopy } from "@/app/components/home/copy-toast";

const DURATION = 1842;
const SPEED = 0.5;
const HOLD = 3800;
const AI_START = 290;
const AI_END = 1730;
const TOOL_END = 674;
const FIRST_CHUNK = 702;
const INPUT_TOKENS = 812;
const OUTPUT_TOKENS = 264;
const ease = [0.16, 1, 0.3, 1] as const;

type Kind = "http" | "db" | "ai" | "tool" | "stream" | "log";
type Span = { id: Kind; label: string; start: number; end: number; depth: number };
type Provider = {
  id: string;
  label: string;
  file: string;
  binding: string;
  wrapper: string;
  inner: string;
  provider: string;
  model: string;
  operation: string;
  streamed: boolean;
};

const providers: Provider[] = [
  {
    id: "vercel",
    label: "AI SDK",
    file: "@blyp/core/ai/vercel",
    binding: "model",
    wrapper: "blypModel",
    inner: 'anthropic("claude-sonnet-4-5")',
    provider: "anthropic",
    model: "claude-sonnet-4-5",
    operation: "streamText",
    streamed: true,
  },
  {
    id: "openai",
    label: "OpenAI",
    file: "@blyp/core/ai/openai",
    binding: "openai",
    wrapper: "wrapOpenAI",
    inner: "new OpenAI()",
    provider: "openai",
    model: "gpt-4.1",
    operation: "responses.create",
    streamed: true,
  },
  {
    id: "anthropic",
    label: "Anthropic",
    file: "@blyp/core/ai/anthropic",
    binding: "anthropic",
    wrapper: "wrapAnthropic",
    inner: "new Anthropic()",
    provider: "anthropic",
    model: "claude-sonnet-4-5",
    operation: "messages.create",
    streamed: false,
  },
];

const spansFor = (p: Provider): Span[] => [
  { id: "http", label: "POST /api/support", start: 0, end: DURATION, depth: 0 },
  { id: "db", label: "db.query tickets", start: 70, end: 250, depth: 1 },
  { id: "ai", label: p.operation, start: AI_START, end: AI_END, depth: 1 },
  { id: "tool", label: "tool lookupOrder", start: 420, end: TOOL_END, depth: 2 },
  ...(p.streamed ? [{ id: "stream" as const, label: "stream", start: FIRST_CHUNK, end: AI_END, depth: 2 }] : []),
  { id: "log", label: "emit ai_trace", start: 1736, end: 1760, depth: 1 },
];

const barColor: Record<Kind, string> = {
  http: "bg-foreground/70",
  db: "bg-level-info",
  ai: "bg-primary",
  tool: "bg-level-warn",
  stream: "bg-primary/70",
  log: "bg-level-ok",
};

const dotColor: Record<Kind, string> = {
  http: "text-foreground/70",
  db: "text-level-info",
  ai: "text-primary",
  tool: "text-level-warn",
  stream: "text-primary/70",
  log: "text-level-ok",
};

const ms = (value: number) => `${Math.round(value).toLocaleString("en-US")}ms`;
const pct = (value: number) => `${(value / DURATION) * 100}%`;

const Str = ({ children }: { children: ReactNode }) => <span className="text-level-ok">&quot;{children}&quot;</span>;
const Num = ({ children }: { children: ReactNode }) => <span className="tabular-nums text-level-warn">{children}</span>;

type Field = { key: string; link: Kind; value: ReactNode };

function recordAt(t: number, p: Provider) {
  const outputTokens = p.streamed
    ? Math.round(OUTPUT_TOKENS * Math.min(1, Math.max(0, (t - FIRST_CHUNK) / (AI_END - FIRST_CHUNK))))
    : OUTPUT_TOKENS;
  const usageKnown = p.streamed ? t >= FIRST_CHUNK : t >= AI_END;
  const fields: Field[] = [{ key: "type", link: "log", value: <Str>ai_trace</Str> }];
  if (t >= AI_START) {
    fields.push(
      { key: "provider", link: "ai", value: <Str>{p.provider}</Str> },
      { key: "model", link: "ai", value: <Str>{p.model}</Str> },
      { key: "operation", link: "ai", value: <Str>{p.operation}</Str> },
    );
  }
  if (t >= TOOL_END) {
    fields.push({
      key: "toolCalls",
      link: "tool",
      value: (
        <>
          [{"{"} name: <Str>lookupOrder</Str> {"}"}]
        </>
      ),
    });
  }
  if (p.streamed && t >= FIRST_CHUNK) {
    fields.push({
      key: "timing",
      link: "stream",
      value: (
        <>
          {"{"} msToFirstChunk: <Num>{FIRST_CHUNK - AI_START}</Num> {"}"}
        </>
      ),
    });
  }
  if (usageKnown) {
    fields.push({
      key: "usage",
      link: p.streamed ? "stream" : "ai",
      value: (
        <>
          {"{"} inputTokens: <Num>{INPUT_TOKENS}</Num>, outputTokens: <Num>{outputTokens}</Num> {"}"}
        </>
      ),
    });
  }
  if (t >= AI_END) fields.push({ key: "finishReason", link: "ai", value: <Str>stop</Str> });
  return fields;
}

function recordJson(p: Provider) {
  return JSON.stringify(
    {
      type: "ai_trace",
      provider: p.provider,
      model: p.model,
      operation: p.operation,
      toolCalls: [{ name: "lookupOrder" }],
      ...(p.streamed ? { timing: { msToFirstChunk: FIRST_CHUNK - AI_START } } : {}),
      usage: { inputTokens: INPUT_TOKENS, outputTokens: OUTPUT_TOKENS },
      finishReason: "stop",
    },
    null,
    2,
  );
}

export function AiTraceDemo() {
  const reduceMotion = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const axisRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.35 });
  const copy = useCopy();

  const [providerId, setProviderId] = useState(providers[0].id);
  const [t, setT] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);
  const [highlight, setHighlight] = useState<Kind | null>(null);
  const [spin, setSpin] = useState(0);
  const tRef = useRef(0);

  const provider = providers.find((p) => p.id === providerId) ?? providers[0];
  const spans = spansFor(provider);
  const fields = recordAt(t, provider);
  const done = t >= DURATION;

  const seek = (value: number) => {
    tRef.current = value;
    setT(value);
  };

  const restart = () => {
    seek(reduceMotion ? DURATION : 0);
    setSpin((s) => s + 1);
  };

  useEffect(() => {
    if (reduceMotion) {
      seek(DURATION);
      return;
    }
    if (!inView || scrubbing) return;
    let raf = 0;
    let last = performance.now();
    let held = 0;
    const step = (now: number) => {
      const dt = now - last;
      last = now;
      if (tRef.current >= DURATION) {
        held += dt;
        if (held > HOLD) {
          held = 0;
          seek(0);
        }
      } else {
        seek(Math.min(DURATION, tRef.current + dt * SPEED));
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, scrubbing, reduceMotion]);

  const onPointerMove = (e: React.PointerEvent) => {
    const axis = axisRef.current;
    if (!axis || e.pointerType === "touch") return;
    const r = axis.getBoundingClientRect();
    if (e.clientX < r.left - 4 || e.clientX > r.right + 4) {
      if (scrubbing) setScrubbing(false);
      return;
    }
    setScrubbing(true);
    seek(Math.min(DURATION, Math.max(0, ((e.clientX - r.left) / r.width) * DURATION)));
  };

  const playhead = (t / DURATION).toFixed(4);

  return (
    <div ref={rootRef} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <RubberSegment
          aria-label="AI SDK"
          items={providers.map((p) => ({ value: p.id, label: p.label }))}
          value={providerId}
          onChange={(v) => {
            setProviderId(String(v));
            restart();
          }}
          size="sm"
          radius={999}
          trackColor="var(--muted)"
          thumbColor="var(--card)"
          textColor="var(--graphite)"
          activeTextColor="var(--ink)"
          className="shadow-[inset_0_0_0_1px_var(--rule)]"
        />
      </div>

      <div className="flex items-center gap-3 overflow-x-auto rounded-lg border border-border bg-background px-3 py-2.5 font-mono text-[0.72rem] [scrollbar-width:none]">
        <span className="shrink-0 rounded-[3px] bg-muted px-1.5 py-0.5 text-[0.62rem] text-muted-foreground">{provider.file}</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.code
            key={provider.id}
            className="whitespace-nowrap text-muted-foreground"
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ duration: 0.28, ease }}
          >
            <span className="text-primary">const</span> {provider.binding} = <span className="text-level-info">{provider.wrapper}</span>(
            <span className="text-foreground">{provider.inner}</span>)
          </motion.code>
        </AnimatePresence>
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* Waterfall */}
        <div className="rounded-lg border border-border bg-background p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="font-mono text-[0.68rem] text-muted-foreground">trace req_7c1e</span>
            <div className="flex items-center gap-3">
              <StatusMark
                status={done ? "done" : "running"}
                label={<span className="text-[0.72rem]">{done ? "emitted" : scrubbing ? "scrubbing" : "recording"}</span>}
                size={13}
                fontSize={12}
                strike={false}
                color="var(--graphite)"
                doneColor="var(--level-ok)"
                className="gap-1.5 text-muted-foreground"
              />
              <button
                type="button"
                onClick={restart}
                aria-label="Replay trace"
                className="grid size-7 place-items-center rounded-full border border-border text-muted-foreground transition-[color,border-color,background-color,transform] duration-200 hover:border-primary/40 hover:bg-primary-soft hover:text-primary-soft-foreground active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <motion.span key={spin} initial={{ rotate: 0 }} animate={{ rotate: spin ? -360 : 0 }} transition={{ duration: 0.6, ease }}>
                  <RotateCcw className="size-3.5" aria-hidden />
                </motion.span>
              </button>
            </div>
          </div>

          <div
            className="relative touch-pan-y select-none [--dur:3.25rem] [--gap:0.75rem] [--label:6.5rem] sm:[--label:9rem]"
            style={{ "--p": playhead } as CSSProperties}
            onPointerMove={onPointerMove}
            onPointerLeave={() => setScrubbing(false)}
          >
            <div className="grid grid-cols-[var(--label)_minmax(0,1fr)_var(--dur)] gap-[var(--gap)]">
              <span />
              <div ref={axisRef} className="relative h-6 font-mono text-[0.6rem] text-muted-foreground/70">
                <span className="absolute left-0 top-0">0ms</span>
                <span className="absolute right-0 top-0">1.84s</span>
                <AnimatePresence>
                  {provider.streamed && t >= FIRST_CHUNK ? (
                    <motion.span
                      key={`${provider.id}-ttfc`}
                      className="absolute top-0 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-[3px] bg-primary-soft px-1 text-primary-soft-foreground"
                      style={{ left: pct(FIRST_CHUNK) }}
                      initial={{ opacity: 0, y: 6, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 520, damping: 26 }}
                    >
                      <span className="hidden sm:inline">first chunk</span> +{FIRST_CHUNK - AI_START}ms
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </div>
              <span />
            </div>

            <ul className="flex flex-col">
              {spans.map((s) => {
                const shown = Math.max(0, Math.min(t, s.end) - s.start);
                const started = t >= s.start;
                const complete = t >= s.end;
                const live = started && !complete;
                const dimmed = highlight !== null && highlight !== s.id;
                return (
                  <li key={`${provider.id}-${s.id}`}>
                    <button
                      type="button"
                      onPointerEnter={() => setHighlight(s.id)}
                      onPointerLeave={() => setHighlight(null)}
                      onFocus={() => setHighlight(s.id)}
                      onBlur={() => setHighlight(null)}
                      aria-label={`${s.label}, ${ms(s.end - s.start)}`}
                      className={`grid h-7 w-full grid-cols-[var(--label)_minmax(0,1fr)_var(--dur)] items-center gap-[var(--gap)] rounded-[4px] text-left transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${dimmed ? "opacity-35" : "opacity-100"}`}
                    >
                      <span
                        className="flex min-w-0 items-center gap-1.5 font-mono text-[0.66rem] text-muted-foreground"
                        style={{ paddingLeft: `${s.depth * 0.7}rem` }}
                      >
                        <span className={`size-1.5 shrink-0 rounded-full bg-current ${dotColor[s.id]}`} />
                        <span className={`truncate transition-colors ${highlight === s.id ? "text-foreground" : ""}`}>{s.label}</span>
                      </span>
                      <span className="relative h-full">
                        <span className="absolute inset-x-0 top-1/2 h-px bg-border/60" />
                        <span
                          className={`absolute top-1/2 -translate-y-1/2 rounded-[3px] transition-[height] duration-200 ${barColor[s.id]} ${highlight === s.id ? "h-4" : "h-3"} ${s.id === "stream" && live ? "blyp-stream" : ""}`}
                          style={{ left: pct(s.start), width: pct(shown) }}
                        >
                          {complete ? (
                            <motion.span
                              className={`absolute right-0 top-1/2 size-2 -translate-y-1/2 translate-x-1/2 rounded-full bg-current ring-2 ring-background ${dotColor[s.id]}`}
                              initial={reduceMotion ? false : { scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 600, damping: 18 }}
                            />
                          ) : null}
                        </span>
                      </span>
                      <span
                        className={`text-right font-mono text-[0.64rem] tabular-nums transition-colors ${complete ? "text-foreground" : live ? "text-primary" : "text-muted-foreground/50"}`}
                      >
                        {started ? ms(shown) : "—"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div
              className="pointer-events-none absolute bottom-0 top-5 w-px bg-primary"
              style={{ left: "calc(var(--label) + var(--gap) + (100% - var(--label) - var(--dur) - 2 * var(--gap)) * var(--p))" }}
              aria-hidden
            >
              <span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rotate-45 rounded-[1px] bg-primary" />
              <span
                className={`absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[3px] bg-foreground px-1 font-mono text-[0.58rem] tabular-nums text-background transition-opacity duration-200 ${scrubbing ? "opacity-100" : "opacity-0"}`}
              >
                {ms(t)}
              </span>
            </div>
          </div>
          <p className="mt-6 text-[0.72rem] text-muted-foreground [@media(hover:none)]:hidden">Hover the timeline to scrub. Hover a span to find its fields.</p>
        </div>

        {/* Record */}
        <div className="flex flex-col rounded-lg border border-border bg-background">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
            <span className="flex items-center gap-2 font-mono text-[0.68rem] text-muted-foreground">
              <span className={`size-1.5 rounded-full ${done ? "bg-level-ok" : "blyp-live-dot bg-primary"}`} />
              ai_trace
            </span>
            <button
              type="button"
              onClick={() => void copy(recordJson(provider), "Copied ai_trace record")}
              className="inline-flex h-6 items-center gap-1.5 rounded-md border border-border px-2 text-[0.68rem] text-muted-foreground transition-[color,border-color,background-color,transform] duration-200 hover:border-primary/40 hover:bg-primary-soft hover:text-primary-soft-foreground active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Copy className="size-3" aria-hidden />
              Copy record
            </button>
          </div>
          <div className="min-h-[15.5rem] flex-1 px-2 py-3 font-mono text-[0.7rem] leading-6">
            <p className="px-2 text-muted-foreground">{"{"}</p>
            <ul>
              <AnimatePresence initial={false}>
                {fields.map((f) => (
                  <motion.li
                    key={`${provider.id}-${f.key}`}
                    layout="position"
                    initial={reduceMotion ? false : { opacity: 0, x: -8, filter: "blur(4px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, transition: { duration: 0.12 } }}
                    transition={{ duration: 0.35, ease }}
                    onPointerEnter={() => setHighlight(f.link)}
                    onPointerLeave={() => setHighlight(null)}
                    className={`rounded-[4px] pl-8 pr-2 -indent-4 [overflow-wrap:anywhere] transition-colors duration-200 ${highlight === f.link ? "bg-primary-soft text-foreground" : "text-muted-foreground"}`}
                  >
                    <span className="text-foreground">{f.key}</span>: {f.value},
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
            <p className="px-2 text-muted-foreground">{"}"}</p>
          </div>
          <p className="border-t border-border px-4 py-2.5 text-[0.68rem] text-muted-foreground">
            Sample trace. Prompts and outputs stay out unless you opt in.
          </p>
        </div>
      </div>
    </div>
  );
}
