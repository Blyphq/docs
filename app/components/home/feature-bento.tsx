"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, FileArchive, FileText, Globe, Server, Smartphone } from "lucide-react";
import StatusMark, { type StatusMarkStatus } from "@/app/components/react-bits/micro/status-mark";
import { CopyCommand } from "@/app/components/home/copy-toast";
import { AiTraceDemo } from "@/app/components/home/ai-trace-demo";
import { McpIllustration, SkillScanner } from "@/app/components/home/bento-illustrations";

function Tile({
  eyebrow,
  title,
  body,
  href,
  className = "",
  children,
  index,
}: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  className?: string;
  children: ReactNode;
  index: number;
}) {
  const reduceMotion = useReducedMotion() ?? false;
  return (
    <motion.div
      className={`blyp-tile group/tile relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xs ${className}`}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 220, damping: 26, delay: (index % 3) * 0.08 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      <div className="relative z-10 flex items-start justify-between gap-4 p-6 pb-0 sm:p-7 sm:pb-0">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-primary">{eyebrow}</p>
          <h3 className="mt-3 font-heading text-[1.4rem] font-semibold leading-tight tracking-[-0.035em]">{title}</h3>
          <p className="mt-2 max-w-[30rem] text-[0.92rem] leading-7 text-muted-foreground">{body}</p>
        </div>
        <Link
          href={href}
          aria-label={`Read about ${title}`}
          className="grid size-8 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-[color,border-color,transform,background-color] duration-300 ease-out-expo hover:border-primary hover:bg-primary hover:text-primary-foreground group-hover/tile:-rotate-12 active:scale-90"
        >
          <ArrowUpRight className="size-3.5" aria-hidden />
        </Link>
      </div>
      <div className="relative z-10 mt-6 flex flex-1 flex-col justify-end p-3 pt-0 sm:p-4 sm:pt-0">{children}</div>
    </motion.div>
  );
}

/* ── Errors ─────────────────────────────────────────────── */

function ErrorCard() {
  return (
    <div className="blyp-error-card flex flex-1 flex-col justify-center rounded-lg border border-border bg-background p-4 font-mono text-[0.72rem]">
      <p className="text-muted-foreground">
        <span className="text-primary">throw</span> createError({"{"} status: <span className="text-level-warn">402</span>, message:{" "}
        <span className="text-level-ok">&quot;Payment failed&quot;</span> {"}"})
      </p>
      <div className="mt-3 flex items-end gap-3 border-t border-dashed border-border pt-3">
        <span className="blyp-shake font-heading text-[3.4rem] font-bold leading-none tracking-[-0.06em] text-primary">402</span>
        <span className="pb-1.5 leading-5 text-muted-foreground">
          BlypError
          <br />
          <span className="text-foreground">Payment failed</span>
        </span>
      </div>
      <div className="mt-4 border-t border-dashed border-border pt-3 text-muted-foreground">
        <p className="text-muted-foreground/60">{"// on the client"}</p>
        <p className="mt-1">
          <span className="text-primary">throw await</span> <span className="text-level-info">parseError</span>(response)
        </p>
        <p className="mt-2 flex items-center gap-2">
          <span className="rounded-[3px] bg-primary-soft px-1.5 py-0.5 text-primary-soft-foreground">402</span>
          <span className="text-foreground">same status, same message</span>
        </p>
      </div>
    </div>
  );
}

/* ── File logging ───────────────────────────────────────── */

function FileRotation() {
  const [fill, setFill] = useState(18);
  const [archives, setArchives] = useState(2);
  const reduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setFill((f) => {
        if (f >= 100) {
          setArchives((a) => (a >= 5 ? 1 : a + 1));
          return 6;
        }
        return Math.min(100, f + 13);
      });
    }, 520);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  return (
    <div className="rounded-lg border border-border bg-background p-4 font-mono text-[0.72rem]">
      <p className="text-muted-foreground">logs/</p>
      <div className="mt-2 flex flex-col gap-1.5 pl-3">
        <div className="flex items-center gap-2">
          <FileText className="size-3.5 text-foreground" aria-hidden />
          <span className="flex-1">log.ndjson</span>
          <span className="tabular-nums text-muted-foreground">{((fill / 100) * 10).toFixed(1)} / 10 MB</span>
        </div>
        <div className="ml-5 h-1 overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-[width] duration-500 ease-out-expo ${fill >= 100 ? "bg-primary" : "bg-foreground/70"}`}
            style={{ width: `${fill}%` }}
          />
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <FileText className="size-3.5" aria-hidden />
          <span className="flex-1">log.error.ndjson</span>
          <span className="tabular-nums">0.3 MB</span>
        </div>
        <p className="mt-1 text-muted-foreground">archive/</p>
        <div className="flex flex-wrap gap-1.5 pl-3">
          {Array.from({ length: archives }, (_, i) => (
            <span
              key={i}
              className="blyp-pop inline-flex items-center gap-1 rounded-[4px] border border-border bg-card px-1.5 py-0.5 text-[0.64rem] text-muted-foreground"
            >
              <FileArchive className="size-3" aria-hidden />
              .gz
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Databases ──────────────────────────────────────────── */

const dbSteps = ["blyp db:init", "blyp db:migrate", "blyp db:generate"];

function DatabaseFlow() {
  const [tick, setTick] = useState(0);
  const reduceMotion = useReducedMotion() ?? false;
  useEffect(() => {
    if (reduceMotion) {
      setTick(6);
      return;
    }
    const id = window.setInterval(() => setTick((t) => (t + 1) % 9), 800);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const statusFor = (i: number): StatusMarkStatus => {
    const at = tick - i * 2;
    if (at < 0) return "pending";
    if (at === 0) return "running";
    return "done";
  };

  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <div className="flex items-center gap-2">
        {[
          { src: "/logos/prisma.svg", name: "Prisma", className: "invert dark:invert-0" },
          { src: "/logos/drizzle.svg", name: "Drizzle", className: "brightness-75 dark:brightness-100" },
          { src: "/logos/mongodb.svg", name: "MongoDB", className: "" },
        ].map((db) => (
          <span key={db.name} className="flex items-center gap-1.5 rounded-full border border-border bg-card px-2 py-1 text-[0.7rem]">
            <Image src={db.src} alt="" width={14} height={14} className={`size-3.5 object-contain ${db.className}`} />
            {db.name}
          </span>
        ))}
      </div>
      <ul className="mt-4 flex flex-col gap-2">
        {dbSteps.map((label, i) => (
          <li key={label}>
            <StatusMark
              status={statusFor(i)}
              label={<code className="font-mono text-[0.72rem]">{label}</code>}
              size={15}
              fontSize={12}
              strike={false}
              color="var(--graphite)"
              doneColor="var(--level-ok)"
              className="gap-2 text-foreground"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Browser & Expo ingestion ───────────────────────────── */

function IngestFlow() {
  const nodes = [
    { icon: Globe, label: "Browser", sub: "@blyp/core/client" },
    { icon: Smartphone, label: "Expo", sub: "@blyp/core/expo" },
  ];
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-3">
        <div className="flex min-w-0 flex-col gap-2">
          {nodes.map(({ icon: Icon, label, sub }) => (
            <span key={label} className="flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-2">
              <Icon className="size-3.5 text-muted-foreground" aria-hidden />
              <span className="min-w-0">
                <span className="block text-[0.75rem] font-medium">{label}</span>
                <span className="block truncate font-mono text-[0.6rem] text-muted-foreground">{sub}</span>
              </span>
            </span>
          ))}
        </div>
        <div className="relative h-16 w-10 sm:w-24" aria-hidden>
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[repeating-linear-gradient(90deg,var(--rule-strong)_0_4px,transparent_4px_8px)]" />
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="blyp-packet absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-primary"
              style={{ animationDelay: `${i * 0.6}s` }}
            />
          ))}
        </div>
        <span className="flex min-w-0 items-center gap-2 rounded-md border border-primary/30 bg-primary-soft px-2.5 py-2 text-primary-soft-foreground">
          <Server className="size-3.5" aria-hidden />
          <span className="min-w-0">
            <span className="block text-[0.75rem] font-medium">Your server</span>
            <span className="block truncate text-[0.62rem] opacity-75">forwards to connectors</span>
          </span>
        </span>
      </div>
    </div>
  );
}

export function FeatureBento() {
  return (
    <section id="features" className="mx-auto w-full max-w-[90rem] px-5 py-24 sm:px-8 sm:py-32 lg:px-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[44rem]">
          <p className="blyp-eyebrow">What ships in the box</p>
          <h2 className="mt-5 text-balance font-heading text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-[3.4rem]">
            The boring parts of logging, done properly.
          </h2>
        </div>
        <p className="max-w-[26rem] text-pretty text-[1.02rem] leading-8 text-muted-foreground">
          Errors, AI calls, files, databases, and the browser all land in the same stream, with the same shape.
        </p>
      </div>

      <div className="mt-14 grid gap-3 md:grid-cols-6">
        <Tile
          index={0}
          className="md:col-span-4"
          eyebrow="AI tracing"
          title="See every model call inside the request."
          body="Wrap a Vercel AI SDK, OpenAI, Anthropic, or Better Agent client and get ai_trace records with usage, finish reason, and timing."
          href="/docs/ai/tracing"
        >
          <AiTraceDemo />
        </Tile>
        <Tile
          index={1}
          className="md:col-span-2"
          eyebrow="Errors"
          title="Errors with a status code."
          body="createError builds a BlypError you can log, return, and parse back on the client."
          href="/docs/errors"
        >
          <ErrorCard />
        </Tile>
        <Tile
          index={2}
          className="md:col-span-2"
          eyebrow="File logging"
          title="NDJSON that rotates itself."
          body="Active streams plus gzip archives, five kept per stream by default."
          href="/docs/file-logging"
        >
          <FileRotation />
        </Tile>
        <Tile
          index={3}
          className="md:col-span-2"
          eyebrow="Databases"
          title="Logs as rows."
          body="Prisma, Drizzle, or MongoDB adapters. For SQL, the CLI scaffolds the schema and migration."
          href="/docs/database"
        >
          <DatabaseFlow />
        </Tile>
        <Tile
          index={4}
          className="md:col-span-2"
          eyebrow="Browser & Expo"
          title="Client logs, routed through your server."
          body="Browser and Expo loggers post to Blyp ingestion first. Your server decides what gets forwarded."
          href="/docs/integrations/client"
        >
          <IngestFlow />
        </Tile>
        <Tile
          index={5}
          className="md:col-span-3"
          eyebrow="Agent skills"
          title="Your agent reads the docs first."
          body="Fifteen bundled skills install into .agents/skills so coding agents follow the documented setup. Click a logo to copy its install command."
          href="/docs/skills"
        >
          <SkillScanner />
        </Tile>
        <Tile
          index={6}
          className="md:col-span-3"
          eyebrow="MCP"
          title="These docs speak MCP."
          body="Point Cursor, Claude Code, Codex, or any MCP client at the docs server and let it list, search, and read Blyp pages."
          href="/docs/mcp"
        >
          <McpIllustration />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <CopyCommand command="https://www.blyp.dev/mcp" prompt="mcp" />
            <a
              href="/llms.txt"
              className="font-mono text-[0.75rem] text-muted-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:text-foreground hover:decoration-primary"
            >
              /llms.txt
            </a>
          </div>
        </Tile>
      </div>
    </section>
  );
}
