"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Copy } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { InstallCommandCard } from "@/app/components/home/install-command-card";
import { ThemeToggle } from "@/app/components/home/theme-toggle";
import PixelBlast from "../react-bits/pixel-blast";

const commandItems = [
  {
    label: "Install Blyp Core",
    command: "bun add @blyp/core",
    helper: "The published npm package is @blyp/core.",
  },
  {
    label: "Launch Blyp Studio",
    command: "bunx @blyp/cli studio",
    helper: "Studio runs locally and connects to your project path.",
  },
];

const facts = [
  {
    label: "Runtime",
    value: "Bun-first and Node-compatible",
  },
  {
    label: "Studio",
    value: "Runs locally at localhost:3003",
  },
  {
    label: "Skills",
    value: "Project-local installs into .agents/skills",
  },
];

const features = [
  {
    id: "01",
    title: "Studio",
    description:
      "Open a local UI for the current project and inspect Blyp workflows without leaving the machine.",
    detail: "The CLI launches Studio at http://localhost:3003.",
  },
  {
    id: "02",
    title: "Agent Skills",
    description:
      "Install portable project-local skills so coding agents follow Blyp’s supported setup paths.",
    detail: "Bundled skills are copied into .agents/skills/<skill-name>.",
  },
  {
    id: "03",
    title: "Structured Logs",
    description:
      "Accumulate context silently and emit one rich event instead of scattering unrelated lines.",
    detail:
      "createStructuredLog() holds fields until emit() finalizes the payload.",
  },
];

const workflow = [
  {
    step: "01",
    title: "Install the Logger",
    body: "Start with the core package and keep the root import for app code.",
    command: "bun add @blyp/core",
  },
  {
    step: "02",
    title: "Launch Studio Locally",
    body: "Open Blyp Studio for the current directory or point it at a specific app path.",
    command: "blyp studio",
  },
  {
    step: "03",
    title: "Add Repo-Local Skills",
    body: "Install the matching presets so agent tooling follows Blyp’s documented setup paths.",
    command: "blyp skills install",
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

const terminalNotes = [
  {
    label: "Studio",
    body: "Connect the local UI to the repo that is actually open on disk.",
  },
  {
    label: "Skill Path",
    body: "Install supported presets into .agents/skills for project-aware coding agents.",
  },
  {
    label: "Final Emit",
    body: "Keep one rich structured event instead of a pile of disconnected lines.",
  },
];

const terminalLines = [
  "$ bun add @blyp/core",
  "$ bunx @blyp/cli studio",
  "$ blyp skills install",
  "",
  "INFO  studio ready at http://localhost:3003",
  "INFO  targetPath=/workspace/app runtime=bun",
  "",
  "checkout",
  "  user.id=1842 user.plan=pro",
  "  cart.items=3 cart.total=9999",
  '  why="Card declined by issuer"',
  '  fix="Try a different payment method"',
];

const landingEase = [0.22, 1, 0.36, 1] as const;

export function BlypLandingPage() {
  const reduceMotion = useReducedMotion();

  const fadeUpInitial = reduceMotion ? false : { opacity: 0, y: 16 };
  const fadeUpAnimate = { opacity: 1, y: 0 };
  const fadeUpTransition = (delay: number) => ({
    duration: reduceMotion ? 0 : 0.6,
    delay: reduceMotion ? 0 : delay,
    ease: landingEase,
  });

  const asideInitial = reduceMotion ? false : { opacity: 0 };
  const asideAnimate = { opacity: 1 };
  const asideTransition = {
    duration: reduceMotion ? 0 : 0.8,
    delay: reduceMotion ? 0 : 0.2,
    ease: landingEase,
  };
  const terminalPaneTransition = {
    duration: reduceMotion ? 0 : 0.55,
    ease: landingEase,
  };

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
        <section className="relative z-10 mx-auto flex w-full max-w-[90rem] flex-col gap-20 px-5 sm:px-8 lg:px-10">
          <div className="w-full flex flex-col gap-6">
            <motion.div
              className="inline-flex items-center gap-3 border-t border-border pt-3 text-xs font-medium uppercase tracking-[0.24em] text-primary"
              initial={fadeUpInitial}
              animate={fadeUpAnimate}
              transition={fadeUpTransition(0.05)}
            >
              <span
                aria-hidden="true"
                className="size-2 bg-primary"
              />
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
            <motion.div className="flex items-center gap-4 bg-primary/10 p-4 rounded-lg w-fit border border-primary/40 backdrop-blur-sm">
              <p>bun add @blyp/core</p> <Copy className="w-4 h-4" />
            </motion.div>
          </div>

          <motion.aside
            className="relative overflow-hidden border border-border bg-card/95 shadow-[0_20px_60px_-36px_rgba(0,0,0,0.9)] backdrop-blur-sm"
            initial={asideInitial}
            animate={asideAnimate}
            transition={asideTransition}
          >
            {!reduceMotion && (
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute left-0 right-0 top-0 z-20 h-20 bg-gradient-to-b from-primary/10 to-transparent"
                initial={{ y: "-30%" }}
                animate={{ y: ["-35%", "520%"] }}
                transition={{
                  duration: 3.8,
                  ease: "linear",
                  repeat: Infinity,
                  repeatDelay: 0.6,
                }}
              />
            )}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-2">
                <motion.span
                  aria-hidden="true"
                  className="size-2.5 rounded-full bg-destructive"
                  animate={reduceMotion ? undefined : { opacity: [0.7, 1, 0.7] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.span
                  aria-hidden="true"
                  className="size-2.5 rounded-full bg-chart-3"
                  animate={reduceMotion ? undefined : { opacity: [0.6, 1, 0.6] }}
                  transition={{
                    duration: 1.8,
                    delay: 0.25,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.span
                  aria-hidden="true"
                  className="size-2.5 rounded-full bg-chart-2"
                  animate={reduceMotion ? undefined : { opacity: [0.65, 1, 0.65] }}
                  transition={{
                    duration: 1.8,
                    delay: 0.45,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
              <div className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground/70">
                Local Workflow
              </div>
            </div>

            <div className="grid lg:grid-cols-[15rem_minmax(0,1fr)]">
              <div className="border-b border-border lg:border-b-0 lg:border-r lg:border-border">
                {terminalNotes.map((note, index) => (
                  <motion.div
                    key={note.label}
                    className={`px-6 py-6 ${index < terminalNotes.length - 1 ? "border-b border-border" : ""}`}
                    initial={reduceMotion ? false : { opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      ...terminalPaneTransition,
                      delay: reduceMotion ? 0 : 0.16 + index * 0.08,
                    }}
                  >
                    <p className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-muted-foreground/70">
                      {note.label}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {note.body}
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.pre
                className="relative overflow-x-auto px-6 py-6 text-sm leading-8 text-muted-foreground"
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...terminalPaneTransition, delay: reduceMotion ? 0 : 0.28 }}
              >
                <code className="font-mono">
                  {terminalLines.map((line, index) => (
                    <motion.span
                      key={`${line}-${index}`}
                      className={
                        line.startsWith("INFO")
                          ? "block text-primary"
                          : line.includes("why=") || line.includes("fix=")
                            ? "block text-foreground"
                            : "block"
                      }
                      initial={reduceMotion ? false : { opacity: 0, x: -10, filter: "blur(2px)" }}
                      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      transition={{
                        duration: reduceMotion ? 0 : 0.32,
                        ease: landingEase,
                        delay: reduceMotion ? 0 : 0.36 + index * 0.075,
                      }}
                    >
                      {line || " "}
                    </motion.span>
                  ))}
                  <motion.span
                    aria-hidden="true"
                    className="inline-block h-[1.05em] w-2.5 translate-y-1 bg-primary/80"
                    animate={reduceMotion ? undefined : { opacity: [0, 1, 0] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </code>
              </motion.pre>
            </div>
          </motion.aside>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto w-full max-w-[90rem] px-5 py-24 sm:px-8 lg:px-10">
            <div className="max-w-[42rem]">
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.24em] text-primary">
                What Blyp Gives You
              </p>
              <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">
                Fewer containers, more signal.
              </h2>
            </div>

            <div className="mt-14 grid gap-12 lg:grid-cols-3 lg:gap-10">
              {features.map((feature) => (
                <article
                  key={feature.id}
                  className="border-t border-border pt-6 transition-colors duration-200 hover:border-primary"
                >
                  <p className="text-sm font-medium text-primary">
                    {feature.id}
                  </p>
                  <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-base leading-8 text-muted-foreground">
                    {feature.description}
                  </p>
                  <p className="mt-5 text-sm leading-7 text-muted-foreground/80">
                    {feature.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto grid w-full max-w-[90rem] gap-16 px-5 py-24 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:px-10">
            <div className="max-w-[32rem]">
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.24em] text-primary">
                Workflow
              </p>
              <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">
                A direct path from install to agent-aware logging.
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                The docs already describe the steps. The homepage should let
                those steps breathe.
              </p>
            </div>

            <div className="border-t border-border">
              {workflow.map((item, index) => (
                <article
                  key={item.step}
                  className={`grid gap-5 py-8 lg:grid-cols-[5rem_minmax(0,1fr)_auto] lg:items-start ${index < workflow.length - 1 ? "border-b border-border" : ""}`}
                >
                  <p className="text-sm font-medium text-primary">
                    {item.step}
                  </p>
                  <div className="max-w-[36rem]">
                    <h3 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                  <code className="inline-flex border border-border bg-muted/50 px-4 py-2 font-mono text-[0.78rem] text-primary transition-colors duration-200 hover:border-foreground/25 hover:bg-muted">
                    {item.command}
                  </code>
                </article>
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
