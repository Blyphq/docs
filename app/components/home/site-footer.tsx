"use client";

import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import TechText from "@/app/components/react-bits/tech-text";
import { usePalette } from "@/app/components/home/use-palette";
import { WaveField } from "@/app/components/home/wave-field";
import { CopyCommand } from "@/app/components/home/copy-toast";
import { TechType } from "@/app/components/home/tech-type";

const faqs = [
  {
    q: "Does Blyp run on Node.js or only Bun?",
    a: "Both. Blyp is Bun-first and Node-compatible. Framework adapters cover Next.js, Hono, Express, Fastify, NestJS, Elysia, SvelteKit, Nuxt, Astro, and more, plus Workers, Convex, the browser, and Expo.",
  },
  {
    q: "Where does Studio send my logs?",
    a: "Nowhere. Studio is a local UI started by the CLI with bunx @blyp/cli studio. It runs at localhost:3003 against the project on your machine.",
  },
  {
    q: "Can I migrate from pino or winston?",
    a: "Yes. The migration guides map pino and winston setups to Blyp loggers, levels, and transports step by step.",
  },
  {
    q: "Do I need a database?",
    a: "No. The default destination is NDJSON files with rotation. Prisma, Drizzle, and MongoDB adapters are there when you want logs as rows.",
  },
  {
    q: "What are agent skills?",
    a: "Portable instruction folders that teach coding agents the documented Blyp setup for a framework or connector. Install them with bunx @blyp/cli skills install; they land in .agents/skills.",
  },
];

const columns = [
  {
    title: "Start",
    links: [
      { href: "/docs", label: "Overview" },
      { href: "/docs/installation", label: "Installation" },
      { href: "/docs/basic-usage", label: "Basic usage" },
      { href: "/docs/configuration", label: "Configuration" },
      { href: "/docs/cli", label: "CLI & Studio" },
    ],
  },
  {
    title: "Integrations",
    links: [
      { href: "/docs/integrations/nextjs", label: "Next.js" },
      { href: "/docs/integrations/hono", label: "Hono" },
      { href: "/docs/integrations/elysia", label: "Elysia" },
      { href: "/docs/integrations/expo", label: "Expo" },
      { href: "/docs/integrations", label: "All integrations" },
    ],
  },
  {
    title: "Ship",
    links: [
      { href: "/docs/connectors", label: "Connectors" },
      { href: "/docs/database", label: "Databases" },
      { href: "/docs/ai/tracing", label: "AI tracing" },
      { href: "/docs/migrations", label: "Migrations" },
      { href: "/docs/troubleshooting", label: "Troubleshooting" },
    ],
  },
  {
    title: "For agents",
    links: [
      { href: "/docs/skills", label: "Agent skills" },
      { href: "/docs/mcp", label: "MCP server" },
      { href: "/llms.txt", label: "llms.txt" },
      { href: "/docs/changelog", label: "Changelog" },
      { href: "https://github.com/Blyphq/blyp", label: "GitHub" },
    ],
  },
];

export function Faq() {
  return (
    <section id="faq" className="mx-auto grid w-full max-w-[90rem] gap-12 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:px-10">
      <div>
        <p className="blyp-eyebrow">Questions</p>
        <h2 className="mt-5 text-balance font-heading text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl">
          Before you swap your logger.
        </h2>
        <p className="mt-5 max-w-[24rem] text-[1.02rem] leading-8 text-muted-foreground">
          Something else on your mind? The docs are searchable, and so is the MCP server.
        </p>
      </div>
      <div className="border-b border-border">
        {faqs.map((f) => (
          <details key={f.q} className="blyp-faq group/faq border-t border-border">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-heading text-[1.2rem] font-medium tracking-[-0.025em] transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {f.q}
              <span className="blyp-faq-icon grid size-8 shrink-0 place-items-center rounded-full border border-border transition-[transform,background-color,border-color] duration-500 ease-out-expo group-hover/faq:border-primary/40">
                <Plus className="size-4" aria-hidden />
              </span>
            </summary>
            <p className="max-w-[40rem] pb-7 text-[0.98rem] leading-8 text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function ClosingCta() {
  const reduceMotion = useReducedMotion() ?? false;
  return (
    <section className="relative isolate overflow-hidden border-y border-border bg-stage">
      <WaveField preset="terminal" tone="graphite" fade="none" opacity={1} contrast={1.8} cursorSize={90} cursorStrength={0.9} className="-z-10" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(34%_42%_at_50%_50%,var(--stage)_40%,transparent_100%)]" aria-hidden />
      <motion.div
        className="pointer-events-none mx-auto flex w-full max-w-[56rem] flex-col items-center px-5 py-32 text-center sm:py-44"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="blyp-eyebrow justify-center">One logger, every runtime</p>
        <h2 className="pointer-events-auto mt-6 text-balance font-heading text-5xl font-semibold leading-[0.96] tracking-[-0.055em] sm:text-7xl">
          <TechType text="Less grepping." unit="word" />{" "}
          <span className="text-primary">
            <TechType text="More prompting." unit="word" />
          </span>
        </h2>
        <p className="mt-6 max-w-[32rem] text-pretty text-[1.05rem] leading-8 text-muted-foreground">
          Install the package, open Studio, and give your agent the skill. You will be reading structured logs before your coffee cools.
        </p>
        <div className="pointer-events-auto mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/docs/installation"
            className="group/cta inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow-md transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-lg active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Start with the docs
            <ArrowRight className="size-4 transition-transform duration-300 ease-out-expo group-hover/cta:translate-x-0.5" aria-hidden />
          </Link>
          <CopyCommand command="bunx @blyp/cli studio" />
        </div>
      </motion.div>
    </section>
  );
}

export function SiteFooter() {
  const palette = usePalette();
  return (
    <footer className="relative overflow-hidden pt-20 sm:pt-24">
      <div className="mx-auto grid w-full max-w-[90rem] gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:px-10">
        <div className="max-w-[20rem]">
          <p className="font-heading text-[1.35rem] font-semibold tracking-[-0.04em]">blyp</p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Runtime-adaptive logging for Bun, Node.js, and modern TypeScript frameworks.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-[0.72rem] font-medium text-muted-foreground">
            <span className="blyp-live-dot size-1.5 rounded-full bg-level-ok" aria-hidden />
            Core API · stable
          </span>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground/80">{col.title}</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="group/f inline-flex items-center gap-1 text-sm text-foreground/80 transition-colors hover:text-foreground"
                    >
                      <span className="w-0 overflow-hidden text-primary transition-[width] duration-300 ease-out-expo group-hover/f:w-3">→</span>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="relative mt-16 h-[13rem] w-full sm:h-[20rem] lg:h-[26rem]">
        {palette ? (
          <TechText
            text="blyp"
            fontSize={420}
            fontWeight={700}
            letterSpacing={-0.06}
            color={palette.rule}
            accentColor={palette.signal}
            reach={220}
            specks={18}
            className="font-heading blyp-fade-in"
          />
        ) : null}
        <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted-foreground/60">
          Hover &amp; drag the letters
        </p>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-2 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <span>© {new Date().getFullYear()} Blyp. MIT licensed.</span>
          <span>Grep less. Understand more.</span>
        </div>
      </div>
    </footer>
  );
}
