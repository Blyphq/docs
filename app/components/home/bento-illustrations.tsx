"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Check, MousePointer2, Radio } from "lucide-react";
import WarmTooltip, { WarmTooltipGroup } from "@/app/components/react-bits/micro/warm-tooltip";
import { BlypThemeLogo } from "@/app/components/blyp-theme-logo";
import { useCopy } from "@/app/components/home/copy-toast";

const ease = [0.16, 1, 0.3, 1] as const;
const tooltip = { surfaceColor: "var(--ink)", inkColor: "var(--paper)", size: "sm" as const };
const toneClass = { dark: "dark:invert", light: "invert dark:invert-0" };

/* ── Agent skills ───────────────────────────────────────── */

type SkillLogo = { id: string; src?: string; tone?: "dark" | "light"; kind?: "blyp" | "otlp" };

const skillLogos: SkillLogo[] = [
  { id: "core", kind: "blyp" },
  { id: "nextjs", src: "/logos/nextjs-icon.svg", tone: "dark" },
  { id: "hono", src: "/logos/hono.svg" },
  { id: "express", src: "/logos/express.svg", tone: "dark" },
  { id: "elysia", src: "/logos/elysia-seeklogo.svg", tone: "light" },
  { id: "nuxt", src: "/logos/nuxtjs.svg" },
  { id: "react-router", src: "/logos/reactrouter.svg", tone: "dark" },
  { id: "workers", src: "/logos/cloudflare-workers-icon.svg" },
  { id: "convex", src: "/logos/convex.svg", tone: "dark" },
  { id: "client-expo", src: "/logos/expo-icon.svg", tone: "dark" },
  { id: "posthog", src: "/logos/posthog.svg" },
  { id: "sentry", src: "/logos/sentry.svg", tone: "dark" },
  { id: "betterstack", src: "/logos/better-stack.png" },
  { id: "databuddy", src: "/logos/databuddy.svg", tone: "light" },
  { id: "otlp", kind: "otlp" },
];

function SkillMark({ skill }: { skill: SkillLogo }) {
  if (skill.kind === "blyp") return <BlypThemeLogo width={22} height={22} alt="" />;
  if (skill.kind === "otlp") return <Radio className="size-[22px] text-level-info" aria-hidden />;
  return (
    <Image
      src={skill.src!}
      alt=""
      width={22}
      height={22}
      className={`size-[22px] object-contain ${skill.tone ? toneClass[skill.tone] : ""}`}
    />
  );
}

export function SkillScanner() {
  const copy = useCopy();
  const reduceMotion = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.4 });
  const total = skillLogos.length;
  const [step, setStep] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    if (reduceMotion) {
      setStep(total);
      return;
    }
    if (!inView || hovered !== null) return;
    const id = window.setInterval(() => setStep((s) => (s > total ? 0 : s + 1)), 1050);
    return () => window.clearInterval(id);
  }, [inView, hovered, reduceMotion, total]);

  const active = Math.min(step, total - 1);
  const done = Math.min(step, total);
  const current = skillLogos[hovered ?? active];

  return (
    <div ref={rootRef} className="flex flex-1 flex-col rounded-lg border border-border bg-background p-3 sm:p-4">
      <div className="flex h-6 items-center gap-2 overflow-hidden font-mono text-[0.68rem] text-muted-foreground">
        <span className="blyp-live-dot size-1.5 shrink-0 rounded-full bg-primary" />
        <span className="shrink-0">agent</span>
        <span className="relative min-w-0 flex-1">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={current.id}
              className="block truncate"
              initial={{ opacity: 0, y: 8, filter: "blur(3px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(3px)" }}
              transition={{ duration: 0.3, ease }}
            >
              reading <span className="text-foreground">.agents/skills/blyp-{current.id}/SKILL.md</span>
            </motion.span>
          </AnimatePresence>
        </span>
      </div>

      <WarmTooltipGroup>
        <ul className="mt-3 grid flex-1 auto-rows-fr grid-cols-5 gap-1.5" onPointerLeave={() => setHovered(null)}>
          {skillLogos.map((skill, i) => {
            const isActive = (hovered ?? active) === i;
            const isInstalled = i < done;
            return (
              <li key={skill.id} className="flex">
                <WarmTooltip content={`blyp-${skill.id}`} shortcut="copy" side="top" className="!flex size-full" {...tooltip}>
                  <motion.button
                    type="button"
                    aria-label={`Copy install command for blyp-${skill.id}`}
                    onPointerEnter={() => setHovered(i)}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered(null)}
                    onClick={() => void copy(`bunx @blyp/cli skills install blyp-${skill.id}`, `Copied blyp-${skill.id} install`)}
                    whileHover={reduceMotion ? undefined : { y: -3, rotate: i % 2 ? 3 : -3 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                    className="relative grid h-full min-h-14 w-full place-items-center rounded-lg border border-border bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-h-16"
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="skill-scanner"
                        className="absolute -inset-px rounded-lg border border-primary bg-primary-soft shadow-[0_0_0_4px_color-mix(in_oklch,var(--signal)_14%,transparent)]"
                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      />
                    ) : null}
                    <span
                      className={`relative transition-[filter,opacity,transform] duration-500 ${
                        isActive ? "scale-110 opacity-100 grayscale-0" : isInstalled ? "opacity-100 grayscale-0" : "opacity-45 grayscale"
                      }`}
                    >
                      <SkillMark skill={skill} />
                    </span>
                    <AnimatePresence>
                      {isInstalled ? (
                        <motion.span
                          key="check"
                          className="absolute -right-1 -top-1 grid size-3.5 place-items-center rounded-full bg-level-ok text-background ring-2 ring-background"
                          initial={reduceMotion ? false : { scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 600, damping: 20 }}
                        >
                          <Check className="size-2.5" strokeWidth={3.5} aria-hidden />
                        </motion.span>
                      ) : null}
                    </AnimatePresence>
                  </motion.button>
                </WarmTooltip>
              </li>
            );
          })}
        </ul>
      </WarmTooltipGroup>

      <div className="mt-4 flex items-center gap-3">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${(done / total) * 100}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
          />
        </div>
        <span className="font-mono text-[0.66rem] tabular-nums text-muted-foreground">
          {done}/{total} skills
        </span>
      </div>
    </div>
  );
}

/* ── MCP ────────────────────────────────────────────────── */

type Client = { name: string; config: string; y: number; logo?: string };

const clients: Client[] = [
  { name: "Cursor", config: ".cursor/mcp.json", y: 18 },
  { name: "Claude Code", config: "claude mcp add", y: 50, logo: "/logos/anthropic.svg" },
  { name: "Codex", config: "codex mcp add", y: 82, logo: "/logos/openai.svg" },
];

const calls = [
  { tool: "list_docs", args: "", result: "navigation graph · every page" },
  { tool: "search_docs", args: '"request-scoped logging"', result: "structured-logs, basic-usage, …" },
  { tool: "read_page", args: '"/docs/installation"', result: "# Installation · markdown" },
];

const STEP = 2600;
const WIRE_FROM = 36;
const WIRE_TO = 60;

const bezier = (t: number, y0: number) => {
  const x0 = WIRE_FROM;
  const x1 = WIRE_TO;
  const y1 = 50;
  const c1x = x0 + (x1 - x0) * 0.55;
  const c2x = x1 - (x1 - x0) * 0.55;
  const u = 1 - t;
  return {
    x: u * u * u * x0 + 3 * u * u * t * c1x + 3 * u * t * t * c2x + t * t * t * x1,
    y: u * u * u * y0 + 3 * u * u * t * y0 + 3 * u * t * t * y1 + t * t * t * y1,
  };
};

const smooth = (t: number) => t * t * (3 - 2 * t);

export function McpIllustration() {
  const reduceMotion = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.4 });
  const clock = useRef(STEP * 0.7);
  const [time, setTime] = useState(STEP * 0.7);

  useEffect(() => {
    if (reduceMotion || !inView) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      clock.current += Math.min(now - last, 100);
      last = now;
      setTime(clock.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduceMotion]);

  const stepIndex = Math.floor(time / STEP) % calls.length;
  const phase = (time % STEP) / STEP;
  const call = calls[stepIndex];
  const client = clients[stepIndex];
  const requestT = phase < 0.38 ? smooth(phase / 0.38) : null;
  const responseT = phase > 0.52 && phase < 0.9 ? smooth((phase - 0.52) / 0.38) : null;
  const serverBusy = phase >= 0.36 && phase <= 0.56;
  const answered = phase >= 0.88;
  const packet = requestT !== null ? bezier(requestT, client.y) : responseT !== null ? bezier(1 - responseT, client.y) : null;

  return (
    <div ref={rootRef} className="rounded-lg border border-border bg-background p-3 sm:p-4">
      <div className="relative h-[12.5rem] sm:h-[13.5rem]">
        <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          {clients.map((c, i) => {
            const d = `M ${WIRE_FROM} ${c.y} C ${WIRE_FROM + (WIRE_TO - WIRE_FROM) * 0.55} ${c.y}, ${WIRE_TO - (WIRE_TO - WIRE_FROM) * 0.55} 50, ${WIRE_TO} 50`;
            const live = i === stepIndex;
            return (
              <g key={c.name}>
                <path d={d} fill="none" stroke="var(--rule)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
                <path
                  d={d}
                  fill="none"
                  stroke="var(--signal)"
                  strokeWidth={1.25}
                  strokeDasharray="3 5"
                  vectorEffect="non-scaling-stroke"
                  className={`blyp-wire transition-opacity duration-500 ${live ? "opacity-90" : "opacity-0"}`}
                />
              </g>
            );
          })}
        </svg>

        {packet ? (
          <span
            className={`pointer-events-none absolute z-10 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full ${
              responseT !== null ? "bg-primary shadow-[0_0_0_4px_color-mix(in_oklch,var(--signal)_22%,transparent)]" : "bg-foreground"
            }`}
            style={{ left: `${packet.x}%`, top: `${packet.y}%` }}
            aria-hidden
          />
        ) : null}

        {clients.map((c, i) => {
          const live = i === stepIndex;
          return (
            <motion.div
              key={c.name}
              className={`absolute left-0 flex w-[35%] -translate-y-1/2 items-center gap-2 rounded-lg border bg-card px-2 py-1.5 transition-[border-color,box-shadow] duration-300 sm:px-2.5 sm:py-2 ${
                live ? "border-primary/50 shadow-sm" : "border-border"
              }`}
              style={{ top: `${c.y}%` }}
              animate={{ x: live && !reduceMotion ? 4 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-md bg-muted">
                {c.logo ? (
                  <Image src={c.logo} alt="" width={14} height={14} className={`size-3.5 object-contain ${toneClass.light}`} />
                ) : (
                  <MousePointer2 className="size-3.5 text-foreground" aria-hidden />
                )}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[0.72rem] font-medium">{c.name}</span>
                <span className="block truncate font-mono text-[0.58rem] text-muted-foreground">{c.config}</span>
              </span>
              <AnimatePresence>
                {live && answered ? (
                  <motion.span
                    className="ml-auto hidden size-4 shrink-0 place-items-center rounded-full bg-level-ok text-background sm:grid"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 600, damping: 20 }}
                  >
                    <Check className="size-2.5" strokeWidth={3.5} aria-hidden />
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </motion.div>
          );
        })}

        <div className="absolute right-0 top-1/2 w-[40%] -translate-y-1/2 rounded-xl border border-border bg-card p-2.5 shadow-sm sm:p-3">
          <div className="flex items-center gap-2">
            <span className="relative grid size-7 shrink-0 place-items-center rounded-md bg-muted">
              <BlypThemeLogo width={16} height={16} alt="" />
              <span
                className={`absolute inset-0 rounded-md ring-2 ring-primary transition-[opacity,transform] duration-300 ${
                  serverBusy ? "scale-110 opacity-100" : "scale-100 opacity-0"
                }`}
              />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[0.74rem] font-semibold">blyp-docs</span>
              <span className="block truncate font-mono text-[0.58rem] text-muted-foreground">blyp.dev/mcp</span>
            </span>
            <span className="ml-auto hidden rounded-full border border-border px-1.5 py-0.5 text-[0.56rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground sm:inline">
              read-only
            </span>
          </div>
          <ul className="mt-2.5 flex flex-col gap-1">
            {calls.map((c, i) => {
              const on = i === stepIndex && phase >= 0.34 && phase <= 0.62;
              return (
                <li
                  key={c.tool}
                  className={`flex items-center gap-1.5 rounded-[5px] px-1.5 py-1 font-mono text-[0.62rem] transition-colors duration-300 ${
                    on ? "bg-primary-soft text-primary-soft-foreground" : i === stepIndex ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <span className={`size-1 shrink-0 rounded-full ${on ? "bg-primary" : "bg-current opacity-40"}`} />
                  <span className="truncate">{c.tool}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="mt-3 h-[3.25rem] overflow-hidden rounded-md border border-border bg-card px-3 py-2 font-mono text-[0.66rem] leading-[1.15rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease }}
          >
            <p className="truncate text-muted-foreground">
              <span className="text-foreground">{client.name.toLowerCase()}</span> <span className="text-primary">→</span>{" "}
              <span className="text-level-info">{call.tool}</span>(<span className="text-level-ok">{call.args}</span>)
            </p>
            <p className={`truncate text-muted-foreground transition-opacity duration-300 ${answered || phase > 0.6 ? "opacity-100" : "opacity-0"}`}>
              <span className="text-primary">←</span> {call.result}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
