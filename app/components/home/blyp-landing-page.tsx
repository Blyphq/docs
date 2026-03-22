"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Copy } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { BlypThemeLogo } from "@/app/components/blyp-theme-logo";
import { HeroShowcase } from "@/app/components/home/hero-showcase";
import { ThemeToggle } from "@/app/components/home/theme-toggle";
import PixelBlast from "../react-bits/pixel-blast";
import Grainient from "../react-bits/grainient";
import { useTheme } from "next-themes";

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
    description:
      "Structured JSON log delivery with error tracking and exception capture.",
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
    description:
      "Any OTLP-compatible target — Datadog, Grafana Cloud, Honeycomb.",
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
  {
    name: "Next.js",
    src: "/logos/nextjs-icon.svg",
    darkInvert: true,
    href: "/docs/integrations/nextjs",
  },
  {
    name: "Hono",
    src: "/logos/hono.svg",
    darkInvert: false,
    href: "/docs/integrations/hono",
  },
  {
    name: "Express",
    src: "/logos/express.svg",
    darkInvert: true,
    href: "/docs/integrations/express",
  },
  {
    name: "Fastify",
    src: "/logos/fastify-icon.svg",
    darkInvert: true,
    href: "/docs/integrations/fastify",
  },
  {
    name: "NestJS",
    src: "/logos/nestjs.svg",
    darkInvert: false,
    href: "/docs/integrations/nestjs",
  },
  {
    name: "SvelteKit",
    src: "/logos/svelte-icon.svg",
    darkInvert: false,
    href: "/docs/integrations/sveltekit",
  },
  {
    name: "Elysia",
    src: "/logos/elysia-seeklogo.svg",
    darkInvert: true,
    href: "/docs/integrations/elysia",
  },
  {
    name: "Workers",
    src: "/logos/cloudflare-workers-icon.svg",
    darkInvert: false,
    href: "/docs/integrations/workers",
  },
  {
    name: "Expo",
    src: "/logos/expo-icon.svg",
    darkInvert: true,
    href: "/docs/integrations/expo",
  },
  {
    name: "TanStack Start",
    src: "/logos/tanstack-start.png",
    darkInvert: false,
    href: "/docs/integrations/tanstack-start",
  },
];

const landingEase = [0.22, 1, 0.36, 1] as const;

export function BlypLandingPage() {
  const reduceMotion = useReducedMotion() ?? false;
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

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
            aria-label="Blyp home"
            className="inline-flex min-w-0 items-center gap-3 text-sm font-medium text-foreground transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <BlypThemeLogo width={32} height={32} alt="" />
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
              className="inline-flex items-center gap-3 -border pt-3 text-xs font-medium uppercase tracking-[0.24em] text-primary"
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
                  <Copy
                    size={16}
                    aria-hidden="true"
                    className="cursor-pointer active:scale-75 transition-all duration-200 w-4 h-4"
                  />
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

        <section className="-border">
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

            {/* 3-col feature cards — individual floating cards */}
            <div className="mt-14 grid gap-3.5 lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.article
                  key={feature.id}
                  className="group relative overflow-hidden border border-border/60 p-7 transition-all duration-300  hover:-translate-y-3 hover:border-primary/35 hover:shadow-[0_16px_48px_-12px_color-mix(in_srgb,var(--color-primary)_20%,transparent)] lg:p-8"
                  initial={reduceMotion ? false : { opacity: 0, y: 40, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={reduceMotion ? { duration: 0 } : {
                    type: "spring",
                    stiffness: 240,
                    damping: 22,
                    delay: index * 0.14,
                  }}
                >
                  {/* Top accent bar — sweeps in on hover */}
                  <div
                    className="absolute left-0 right-0 top-0 h-px origin-left scale-x-0 bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100"
                    aria-hidden="true"
                  />
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground/40">
                      {feature.eyebrow}
                    </p>
                    <span className="font-mono text-[0.55rem] text-muted-foreground/22">
                      {feature.id}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-foreground transition-colors duration-200 group-hover:text-primary">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {feature.description}
                  </p>
                  <div className="mt-6 border-t border-border/40 pt-4">
                    <p className="font-mono text-[0.62rem] text-muted-foreground/40 transition-colors duration-200 group-hover:text-primary/50">
                      {feature.detail}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Connectors — full-width card */}
            <motion.div
              className="mt-3.5 border border-border/60"
              initial={reduceMotion ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={reduceMotion ? { duration: 0 } : {
                type: "spring",
                stiffness: 240,
                damping: 24,
                delay: 0.36,
              }}
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
                      Forward logs and structured events to the observability
                      tools you already use. Configure once. Each connector
                      supports auto mode, manual APIs, and per-runtime targeting
                      across server, browser, and Expo.
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
                      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={reduceMotion ? { duration: 0 } : {
                        type: "spring",
                        stiffness: 280,
                        damping: 24,
                        delay: 0.42 + index * 0.07,
                      }}
                    >
                      <Link
                        href={connector.href}
                        className="group/c block cursor-pointer border border-border/55 bg-muted/10 px-4 py-4 transition-[transform,border-color,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-foreground transition-colors duration-200 group-hover/c:text-primary">
                            {connector.name}
                          </p>
                          <ArrowUpRight
                            size={12}
                            aria-hidden="true"
                            className="mt-0.5 shrink-0 text-primary opacity-0 transition-opacity duration-200 group-hover/c:opacity-100"
                          />
                        </div>
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

        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 z-0 dark:opacity-50"
            aria-hidden="true"
          >
            <Grainient
              color1="#ff6b6b"
              color2={isDark ? "#000000" : "#FAFAFA"}
              color3="#B19EEF"
              timeSpeed={0.25}
              colorBalance={0}
              warpStrength={1}
              warpFrequency={5}
              warpSpeed={2}
              warpAmplitude={50}
              blendAngle={0}
              blendSoftness={0.05}
              rotationAmount={500}
              noiseScale={2}
              grainAmount={0.1}
              grainScale={2}
              grainAnimated={false}
              contrast={1.5}
              gamma={1}
              saturation={1}
              centerX={0}
              centerY={0}
              zoom={0.9}
            />
          </div>

          <div className="relative z-10 mx-auto grid w-full max-w-[90rem] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[minmax(0,0.99fr)_minmax(0,1.0fr)] lg:gap-20 lg:px-10">
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
                className="mt-8 inline-flex items-center gap-2 text-sm text-foreground transition-colors duration-200 hover:text-foreground"
              >
                Read the installation guide
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </motion.div>

            <div>
              {workflow.map((item, index) => (
                <motion.article
                  key={item.step}
                  className="group relative -border py-10 transition-colors duration-200 hover:border-primary lg:py-14"
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
                        <span className="select-none text-[0.7rem] text-muted-foreground/30">
                          $
                        </span>
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

        <section>
          <div className="mx-auto w-full max-w-[90rem] px-5 py-24 sm:px-8 lg:px-10">
            <motion.div
              className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
              initial={fadeUpInitial}
              whileInView={fadeUpAnimate}
              viewport={{ once: true, margin: "-60px" }}
              transition={fadeUpTransition(0)}
            >
              <div className="max-w-[42rem]">
                <p className="text-[0.72rem] font-medium uppercase tracking-[0.24em] text-primary">
                  Integrations
                </p>
                <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">
                  Works with the frameworks and runtimes you already use.
                </h2>
                <p className="mt-5 max-w-[38rem] text-base leading-8 text-muted-foreground">
                  Drop Blyp into your existing stack. Server frameworks, edge
                  runtimes, mobile, and browser environments — all covered out
                  of the box.
                </p>
              </div>
            </motion.div>

            <div className="mt-12 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
              {integrations.map((integration, index) => (
                <motion.div
                  key={integration.name}
                  initial={fadeUpInitial}
                  whileInView={fadeUpAnimate}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={fadeUpTransition(index * 0.04)}
                  whileHover={reduceMotion ? {} : { y: -3 }}
                >
                  <Link
                    href={integration.href}
                    className="group flex flex-col items-center gap-4 border border-border/50 bg-muted/8 px-4 py-8 transition-all duration-200 hover:border-primary/25 hover:bg-primary/5 cursor-pointer"
                  >
                    <Image
                      src={integration.src}
                      alt={`${integration.name} logo`}
                      width={28}
                      height={28}
                      className={`h-7 w-7 object-contain transition-all duration-200 ${
                        integration.darkInvert
                          ? "opacity-55 dark:invert dark:opacity-75 group-hover:opacity-80 dark:group-hover:opacity-95"
                          : "opacity-70 group-hover:opacity-100"
                      }`}
                    />
                    <span className="text-center text-xs font-medium text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
                      {integration.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <footer className="relative overflow-hidden">
          {/* PixelBlast animated background */}
          <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
            <PixelBlast
              className="absolute inset-0 size-full"
              variant="circle"
              pixelSize={5}
              color="#ff6b6b"
              patternScale={2.2}
              patternDensity={0.85}
              pixelSizeJitter={0.35}
              enableRipples
              rippleSpeed={0.3}
              rippleThickness={0.1}
              rippleIntensityScale={1.3}
              liquid={true}
              liquidStrength={0.09}
              liquidRadius={1.6}
              liquidWobbleSpeed={3.5}
              speed={0.35}
              edgeFade={0.28}
              transparent
            />
          </div>
          {/* Readability overlay */}
          <div className="pointer-events-none absolute inset-0 z-0 dark:bg-background/72" aria-hidden="true" />

          <div className="relative z-10 mx-auto flex w-full max-w-[90rem] flex-col items-center justify-center px-5 py-36 text-center sm:px-8 lg:px-10 lg:py-44">
            <motion.h2
              className="text-balance text-5xl font-semibold tracking-[-0.07em] text-foreground sm:text-6xl lg:text-[5rem] lg:leading-[0.94]"
              initial={fadeUpInitial}
              whileInView={fadeUpAnimate}
              viewport={{ once: true }}
              transition={fadeUpTransition(0)}
            >
              Less Grepping, More Prompting.
            </motion.h2>
            <motion.div
              className="mt-10"
              initial={fadeUpInitial}
              whileInView={fadeUpAnimate}
              viewport={{ once: true }}
              transition={fadeUpTransition(0.12)}
            >
              <Link
                href="/docs"
                className="inline-flex items-center gap-2.5 border border-primary bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:bg-transparent hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Browse Docs
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </motion.div>
          </div>
        </footer>
      </main>
    </div>
  );
}
