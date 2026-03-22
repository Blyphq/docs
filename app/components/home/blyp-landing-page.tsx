"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Copy } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { HeroShowcase } from "@/app/components/home/hero-showcase";
import { ThemeToggle } from "@/app/components/home/theme-toggle";
import PixelBlast from "../react-bits/pixel-blast";

const features = [
  {
    id: "01",
    eyebrow: "Local inspector",
    title: "Studio",
    description:
      "A local UI that opens instantly for your current project. Inspect live log streams, structured events, and request traces without leaving your machine.",
    detail: "bunx @blyp/cli studio · localhost:3003",
    href: "/docs/studio",
  },
  {
    id: "02",
    eyebrow: "Log your way",
    title: "Plain Logs",
    description:
      "Drop-in console-style logging with no ceremony. Blyp captures plain messages, HTTP traffic, and errors in the same stream as structured events — write logs however you want.",
    detail: "blyp.info() · blyp.error() · blyp.http()",
    href: "/docs/basic-usage",
  },
  {
    id: "03",
    eyebrow: "Rich context, one emit",
    title: "Structured Logs",
    description:
      "Accumulate fields silently throughout a request lifecycle and emit one rich grouped event at the end. No scattered lines, no lost context between calls.",
    detail: "createStructuredLog() → .set() → .emit()",
    href: "/docs/structured-logs",
  },
];

const connectors = [
  {
    name: "Better Stack",
    description: "Structured JSON log delivery with error tracking and exception capture.",
    href: "/docs/connectors/betterstack",
  },
  {
    name: "PostHog",
    description: "Automatic log forwarding and server-side event capture.",
    href: "/docs/connectors/posthog",
  },
  {
    name: "Sentry",
    description: "Error forwarding across server, browser, and Expo runtimes.",
    href: "/docs/connectors/sentry",
  },
  {
    name: "OTLP",
    description: "Any OTLP-compatible target — Datadog, Grafana Cloud, Honeycomb.",
    href: "/docs/connectors/otlp",
  },
];

const workflow = [
  {
    step: "01",
    eyebrow: "Package",
    title: "Install the core package",
    body: "One import covers plain logs, HTTP middleware, structured events, and browser ingestion across server and edge runtimes.",
    command: "bun add @blyp/core",
    href: "/docs/installation",
  },
  {
    step: "02",
    eyebrow: "Studio",
    title: "Launch Studio locally",
    body: "Open a local UI for your current project directory. Inspect live log streams, request traces, and structured events in real time.",
    command: "bunx @blyp/cli studio",
    href: "/docs/studio",
  },
  {
    step: "03",
    eyebrow: "Agent skills",
    title: "Add repo-local skills",
    body: "Install portable skill presets so AI coding agents follow Blyp’s documented setup paths and config conventions for your project.",
    command: "bunx @blyp/cli skills install",
    href: "/docs/cli",
  },
];

const integrations = [
  { name: "Next.js", src: "/logos/nextjs-icon.svg" },
  { name: "Hono", src: "/logos/hono.svg" },
  { name: "Express", src: "/logos/express.svg" },
  { name: "Fastify", src: "/logos/fastify-icon.svg" },
  { name: "NestJS", src: "/logos/nestjs.svg" },
  { name: "SvelteKit", src: "/logos/svelte-icon.svg" },
  { name: "Elysia", src: "/logos/elysia-seeklogo.svg" },
  { name: "Workers", src: "/logos/cloudflare-workers-icon.svg" },
  { name: "Expo", src: "/logos/expo-icon.svg" },
  { name: "TanStack Start", src: "/logos/tanstack-start.png" },
];

const landingEase = [0.22, 1, 0.36, 1] as const;

export function BlypLandingPage() {
  const reduceMotion = useReducedMotion() ?? false;

  const fadeUpInitial = reduceMotion ? false : { opacity: 0, y: 16 };
  const fadeUpAnimate = { opacity: 1, y: 0 };
  const fadeUpTransition = (delay: number) => ({
    duration: reduceMotion ? 0 : 0.6,
    delay: reduceMotion ? 0 : delay,
    ease: landingEase,
  });

  return (
    <div className="blyp-home bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:inline-block focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Skip to content
      </a>

      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-[90rem] items-center justify-between gap-8 px-5 py-5 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="inline-flex min-w-0 items-center gap-3 text-sm font-medium text-foreground transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span
              aria-hidden="true"
              className="inline-flex size-8 items-center justify-center border border-input bg-card text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-primary"
            >
              B
            </span>
            <span className="truncate tracking-[-0.02em]">Blyp</span>
          </Link>

          <nav
            aria-label="Primary"
            className="flex items-center gap-5 sm:gap-7"
          >
            <Link
              href="/docs"
              className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Docs
            </Link>
            <Link
              href="/docs/cli"
              className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              CLI
            </Link>
            <a
              href="https://github.com/Blyphq/blyp"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              GitHub
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main id="main-content" className="relative">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[min(100svh,56rem)] overflow-hidden"
          aria-hidden
        >
          <PixelBlast
            className="absolute inset-0 size-full opacity-40"
            variant="square"
            pixelSize={4}
            color="#ff6b6b"
            patternScale={2}
            patternDensity={1}
            pixelSizeJitter={0}
            enableRipples
            rippleSpeed={0.4}
            rippleThickness={0.12}
            rippleIntensityScale={1.5}
            liquid={false}
            liquidStrength={0.12}
            liquidRadius={1.2}
            liquidWobbleSpeed={5}
            speed={0.5}
            edgeFade={0.25}
            transparent
          />
        </div>
        <section className="relative z-10 mx-auto grid w-full max-w-[90rem] gap-14 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(24rem,0.85fr)] lg:items-start lg:gap-12 lg:px-10 lg:pb-24 lg:pt-14">
          <div className="flex max-w-[42rem] flex-col gap-8">
            <motion.div
              className="inline-flex items-center gap-3 border-t border-border pt-3 text-xs font-medium uppercase tracking-[0.24em] text-primary"
              initial={fadeUpInitial}
              animate={fadeUpAnimate}
              transition={fadeUpTransition(0.05)}
            >
              <span aria-hidden="true" className="size-2 bg-primary" />
              Runtime-adaptive logging
            </motion.div>

            <motion.h1
              className="text-balance text-4xl font-semibold tracking-[-0.08em] text-foreground sm:text-5xl lg:text-7xl lg:leading-[0.94]"
              initial={fadeUpInitial}
              animate={fadeUpAnimate}
              transition={fadeUpTransition(0.2)}
            >
              Grep Less, <span className="text-primary">Understand More.</span>
            </motion.h1>

            <motion.p
              className="max-w-[40rem] text-pretty text-xl leading-9 text-muted-foreground"
              initial={fadeUpInitial}
              animate={fadeUpAnimate}
              transition={fadeUpTransition(0.28)}
            >
              Blyp gives Bun-first and Node-compatible TypeScript projects one
              logger for local apps, framework handlers, browser ingestion,
              structured errors, and project-aware agent workflows.
            </motion.p>

            <motion.div
              className="flex flex-col gap-4"
              initial={fadeUpInitial}
              animate={fadeUpAnimate}
              transition={fadeUpTransition(0.36)}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <div className="inline-flex w-fit items-center gap-3 border border-primary/35 bg-primary/10 px-4 py-3 text-sm text-foreground backdrop-blur-sm">
                  <code className="font-mono">bun add @blyp/core</code>
                  <Copy size={16} aria-hidden="true" className="cursor-pointer active:scale-75 transition-all duration-200 w-4 h-4" />
                </div>
                <Link
                  href="/docs/cli"
                  className="inline-flex items-center justify-center gap-2 border border-primary bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-transparent hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Explore CLI
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </motion.div>
          </div>

          <HeroShowcase />
        </section>

        <section className="border-t border-border">
          <div className="mx-auto w-full max-w-[90rem] px-5 py-24 sm:px-8 lg:px-10">
            <motion.div
              className="max-w-[42rem]"
              initial={fadeUpInitial}
              whileInView={fadeUpAnimate}
              viewport={{ once: true, margin: "-60px" }}
              transition={fadeUpTransition(0)}
            >
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.24em] text-primary">
                What Blyp Gives You
              </p>
              <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">
                Log freely. Structure when it matters. Ship anywhere.
              </h2>
            </motion.div>

            {/* 3-col feature cards */}
            <div className="mt-14 grid border-l border-t border-border lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.article
                  key={feature.id}
                  className="group border-b border-r border-border p-7 lg:p-8"
                  initial={fadeUpInitial}
                  whileInView={fadeUpAnimate}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={fadeUpTransition(index * 0.08)}
                  whileHover={reduceMotion ? {} : { y: -2 }}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground/45">
                      {feature.eyebrow}
                    </p>
                    <span className="font-mono text-[0.58rem] text-muted-foreground/28">
                      {feature.id}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-foreground transition-colors duration-200 group-hover:text-primary">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {feature.description}
                  </p>
                  <p className="mt-6 font-mono text-[0.65rem] text-muted-foreground/40">
                    {feature.detail}
                  </p>
                </motion.article>
              ))}
            </div>

            {/* Connectors — full-width card */}
            <motion.div
              className="border-b border-l border-r border-border"
              initial={fadeUpInitial}
              whileInView={fadeUpAnimate}
              viewport={{ once: true, margin: "-40px" }}
              transition={fadeUpTransition(0.2)}
            >
              <div className="p-7 lg:p-8">
                <div className="flex flex-col gap-1 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
                  <div className="max-w-[38rem]">
                    <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground/45">
                      Ship to your stack
                    </p>
                    <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-foreground">
                      Connectors
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      Forward logs and structured events to the observability tools you already use. Configure once — each connector supports auto mode, manual APIs, and per-runtime targeting across server, browser, and Expo.
                    </p>
                  </div>
                  <Link
                    href="/docs/connectors/betterstack"
                    className="mt-1 hidden shrink-0 items-center gap-1.5 text-sm text-muted-foreground/45 transition-colors duration-200 hover:text-foreground lg:flex"
                  >
                    View all connectors
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>

                <div className="mt-7 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                  {connectors.map((connector, index) => (
                    <motion.div
                      key={connector.name}
                      initial={fadeUpInitial}
                      whileInView={fadeUpAnimate}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={fadeUpTransition(0.26 + index * 0.06)}
                    >
                      <Link
                        href={connector.href}
                        className="group/c block border border-border/55 bg-muted/10 px-4 py-4 transition-all duration-200 hover:border-primary/30 hover:bg-primary/5"
                      >
                        <p className="text-sm font-medium text-foreground transition-colors duration-200 group-hover/c:text-primary">
                          {connector.name}
                        </p>
                        <p className="mt-1.5 text-xs leading-5 text-muted-foreground/55">
                          {connector.description}
                        </p>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <Link
                  href="/docs/connectors/betterstack"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground/45 transition-colors duration-200 hover:text-foreground lg:hidden"
                >
                  View all connectors
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto grid w-full max-w-[90rem] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[minmax(0,0.99fr)_minmax(0,1.0fr)] lg:gap-20 lg:px-10">
            <motion.div
              className="max-w-2xl"
              initial={fadeUpInitial}
              whileInView={fadeUpAnimate}
              viewport={{ once: true, margin: "-60px" }}
              transition={fadeUpTransition(0)}
            >
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary">
                Workflow
              </p>
              <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">
                Install, monitor, and prompt. Three commands to get there.
              </h2>
              <p className="mt-6 text-base leading-8 text-muted-foreground">
                No config file required to start. Install the package, launch
                Studio, and add agent skills. Each step is a single command.
              </p>
              <Link
                href="/docs/installation"
                className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground/55 transition-colors duration-200 hover:text-foreground"
              >
                Read the installation guide
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </motion.div>

            <div>
              {workflow.map((item, index) => (
                <motion.article
                  key={item.step}
                  className="group relative border-t border-border py-10 transition-colors duration-200 hover:border-primary lg:py-14"
                  initial={fadeUpInitial}
                  whileInView={fadeUpAnimate}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={fadeUpTransition(index * 0.1)}
                  whileHover={reduceMotion ? {} : { x: 3 }}
                >
                  <div className="flex items-start gap-5 sm:gap-7">
                    <span className="shrink-0 pt-[0.2rem] font-mono text-[0.6rem] text-muted-foreground/30">
                      {item.step}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground/40">
                        {item.eyebrow}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-foreground transition-colors duration-200 group-hover:text-primary">
                        {item.title}
                      </h3>
                      <p className="mt-2 max-w-[34rem] text-sm leading-7 text-muted-foreground">
                        {item.body}
                      </p>
                      <div className="mt-5 flex items-center gap-3 border border-border/55 bg-muted/15 px-4 py-3 font-mono text-sm transition-all duration-200 group-hover:border-primary/28 group-hover:bg-primary/5 w-fit">
                        <span className="select-none text-[0.7rem] text-muted-foreground/30">$</span>
                        <span className="text-foreground transition-colors duration-200 group-hover:text-primary">
                          {item.command}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto w-full max-w-[90rem] px-5 py-24 sm:px-8 lg:px-10">
            <div className="max-w-[54rem]">
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.24em] text-primary">
                Integrations
              </p>
              <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">
                One package, multiple runtimes, and framework-aware adapters
                where you need them.
              </h2>
              <p className="mt-6 max-w-[40rem] text-lg leading-8 text-muted-foreground">
                Blyp docs currently cover adapters for server frameworks,
                browser logging, Expo, Workers, and connector forwarding.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-2 border-l border-t border-border sm:grid-cols-3 lg:grid-cols-5">
              {integrations.map((integration) => (
                <div
                  key={integration.name}
                  className="group flex min-h-28 items-center gap-4 border-b border-r border-border px-5 py-5 transition-colors duration-200 hover:bg-muted/40"
                >
                  <Image
                    src={integration.src}
                    alt={`${integration.name} logo`}
                    width={22}
                    height={22}
                    className="h-[22px] w-[22px] object-contain opacity-80 transition-opacity duration-200 group-hover:opacity-100"
                  />
                  <span className="min-w-0 text-sm font-medium text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
                    {integration.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="border-y border-border">
          <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-10 px-5 py-20 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-10">
            <div className="max-w-[40rem]">
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.24em] text-primary">
                Start Here
              </p>
              <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">
                Install the core package, launch Studio, and let the docs carry
                the rest.
              </h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
              <Link
                href="/docs/installation"
                className="inline-flex items-center justify-center gap-2 border border-primary bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-transparent hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Read Installation
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center justify-center border border-border px-6 py-4 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:border-foreground/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Browse Docs
              </Link>
              <a
                href="https://github.com/Blyphq/blyp"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-border px-6 py-4 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:border-foreground/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Open GitHub
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
