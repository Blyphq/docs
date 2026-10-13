"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { SiteNav } from "@/app/components/home/site-nav";
import { StudioMock } from "@/app/components/home/studio-mock";
import { WaveField } from "@/app/components/home/wave-field";
import { CopyCommand, CopyToastProvider } from "@/app/components/home/copy-toast";
import { HowItWorks } from "@/app/components/home/how-it-works";
import { FeatureBento } from "@/app/components/home/feature-bento";
import { ClosingCta, Faq, SiteFooter } from "@/app/components/home/site-footer";
import { TechType, TechTypeGroup } from "@/app/components/home/tech-type";

type Logo = { name: string; src: string; tone?: "dark" | "light"; href: string };

const toneClass = { dark: "dark:invert", light: "invert dark:invert-0" };

const frameworks: Logo[] = [
  { name: "Next.js", src: "/logos/nextjs-icon.svg", tone: "dark", href: "/docs/integrations/nextjs" },
  { name: "Hono", src: "/logos/hono.svg", href: "/docs/integrations/hono" },
  { name: "Express", src: "/logos/express.svg", tone: "dark", href: "/docs/integrations/express" },
  { name: "Fastify", src: "/logos/fastify-icon.svg", tone: "dark", href: "/docs/integrations/fastify" },
  { name: "NestJS", src: "/logos/nestjs.svg", href: "/docs/integrations/nestjs" },
  { name: "Elysia", src: "/logos/elysia-seeklogo.svg", tone: "light", href: "/docs/integrations/elysia" },
  { name: "SvelteKit", src: "/logos/svelte-icon.svg", href: "/docs/integrations/sveltekit" },
  { name: "Nuxt", src: "/logos/nuxtjs.svg", href: "/docs/integrations/nuxt" },
  { name: "Astro", src: "/logos/astro.svg", tone: "dark", href: "/docs/integrations/astro" },
  { name: "React Router", src: "/logos/reactrouter.svg", tone: "dark", href: "/docs/integrations/react-router" },
  { name: "SolidStart", src: "/logos/solidjs.svg", href: "/docs/integrations/solid-start" },
  { name: "TanStack Start", src: "/logos/tanstack-start.png", href: "/docs/integrations/tanstack-start" },
];

const platforms: Logo[] = [
  { name: "Cloudflare Workers", src: "/logos/cloudflare-workers-icon.svg", href: "/docs/integrations/workers" },
  { name: "Convex", src: "/logos/convex.svg", tone: "dark", href: "/docs/integrations/convex" },
  { name: "Expo", src: "/logos/expo-icon.svg", tone: "dark", href: "/docs/integrations/expo" },
  { name: "Farm.js", src: "/logos/farmjs.png", href: "/docs/integrations/farmjs" },
  { name: "PostHog", src: "/logos/posthog.svg", href: "/docs/connectors/posthog" },
  { name: "Sentry", src: "/logos/sentry.svg", tone: "dark", href: "/docs/connectors/sentry" },
  { name: "Better Stack", src: "/logos/better-stack.png", href: "/docs/connectors/betterstack" },
  { name: "Databuddy", src: "/logos/databuddy.svg", tone: "light", href: "/docs/connectors/databuddy" },
  { name: "Prisma", src: "/logos/prisma.svg", tone: "light", href: "/docs/database/prisma" },
  { name: "Drizzle", src: "/logos/drizzle.svg", href: "/docs/database/drizzle" },
  { name: "OpenAI", src: "/logos/openai.svg", tone: "light", href: "/docs/ai/openai-sdk" },
  { name: "Anthropic", src: "/logos/anthropic.svg", tone: "light", href: "/docs/ai/anthropic-sdk" },
];

const stats = [
  { value: "17", label: "framework & runtime adapters" },
  { value: "6", label: "observability connectors" },
  { value: "15", label: "bundled agent skills" },
  { value: "1", label: "package to install" },
];

const ease = [0.16, 1, 0.3, 1] as const;

function LogoRow({ logos, reverse = false }: { logos: Logo[]; reverse?: boolean }) {
  return (
    <div className="blyp-marquee-mask overflow-hidden">
      <ul className={`blyp-marquee flex w-max gap-3 ${reverse ? "[animation-direction:reverse]" : ""}`}>
        {[...logos, ...logos].map((logo, i) => (
          <li key={`${logo.name}-${i}`} aria-hidden={i >= logos.length || undefined}>
            <Link
              href={logo.href}
              tabIndex={i >= logos.length ? -1 : undefined}
              className="group/logo flex h-12 items-center gap-2.5 rounded-full border border-border bg-card px-4 text-sm text-muted-foreground shadow-xs transition-[color,border-color,transform,box-shadow] duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-primary/35 hover:text-foreground hover:shadow-md"
            >
              <Image
                src={logo.src}
                alt=""
                width={20}
                height={20}
                className={`size-5 object-contain grayscale transition-[filter,transform] duration-300 group-hover/logo:scale-110 group-hover/logo:grayscale-0 ${logo.tone ? toneClass[logo.tone] : ""}`}
              />
              <span className="whitespace-nowrap">{logo.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BlypLandingPage() {
  const reduceMotion = useReducedMotion() ?? false;
  const rise = (delay: number) => ({
    initial: reduceMotion ? false : ({ opacity: 0, y: 18, filter: "blur(8px)" } as const),
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.9, delay: reduceMotion ? 0 : delay, ease },
  });

  return (
    <CopyToastProvider>
      <div className="blyp-home bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
        >
          Skip to content
        </a>

        <SiteNav />

        <main id="main-content">
          {/* Hero */}
          <section className="relative border-b border-border">
            <div className="mx-auto w-full max-w-[90rem] px-5 pb-16 pt-32 sm:px-8 sm:pt-36 lg:px-10 lg:pb-20 lg:pt-44">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-end lg:gap-14">
                <div>
                  <motion.div {...rise(0)}>
                    <Link
                      href="/docs/connectors/newrelic"
                      className="group/new inline-flex items-center gap-2.5 rounded-md border border-border bg-card py-1 pl-1 pr-3 text-[0.82rem] text-foreground/85 shadow-xs transition-[border-color,box-shadow] duration-300 hover:border-primary/40 hover:shadow-sm"
                    >
                      <span className="rounded-[4px] bg-primary-soft px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-primary-soft-foreground">
                        New
                      </span>
                      New Relic connector
                      <ArrowRight className="size-3.5 transition-transform duration-300 ease-out-expo group-hover/new:translate-x-0.5" aria-hidden />
                    </Link>
                  </motion.div>
                  <h1 className="mt-7 font-heading text-[clamp(3rem,6.1vw,6rem)] font-semibold leading-[0.9] tracking-[-0.055em]">
                    <TechTypeGroup initial="more.">
                      <motion.span className="block" {...rise(0.08)}>
                        <TechType text="Grep less." unit="word" />
                      </motion.span>
                      <motion.span className="block" {...rise(0.18)}>
                        <TechType text="Understand more." unit="word" />
                      </motion.span>
                    </TechTypeGroup>
                  </h1>
                </div>

                <motion.div className="flex flex-col gap-7 lg:pb-3" {...rise(0.3)}>
                  <p className="max-w-[30rem] text-pretty text-[1.15rem] leading-8 text-muted-foreground">
                    One logger for Bun and Node.js TypeScript apps. Plain logs, structured events, browser and Expo
                    ingestion, AI traces, and connectors, with a local Studio to read all of it.
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <Link
                      href="/docs/installation"
                      className="group/cta inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow-md transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-lg active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      Read the docs
                      <ArrowRight className="size-4 transition-transform duration-300 ease-out-expo group-hover/cta:translate-x-0.5" aria-hidden />
                    </Link>
                    <CopyCommand command="bun add @blyp/core" />
                  </div>
                  <p className="text-[0.82rem] text-muted-foreground/80">
                    For Next.js, Hono, Express, Elysia, Nuxt, Workers, Expo, and{" "}
                    <Link href="/docs/integrations" className="underline decoration-border-strong underline-offset-4 transition-colors hover:text-foreground hover:decoration-primary">
                      more
                    </Link>
                    .
                  </p>
                </motion.div>
              </div>

              {/* Stage */}
              <motion.div
                className="relative isolate mt-14 overflow-hidden rounded-xl border border-border bg-stage p-3 shadow-stage sm:p-8 lg:mt-20 lg:p-14"
                initial={reduceMotion ? false : { opacity: 0, y: 40, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.1, delay: reduceMotion ? 0 : 0.42, ease }}
              >
                <WaveField preset="silk" tone="signal" fade="center" fadeSize={0.7} spacing={10} cursorSize={70} className="-z-10" />
                <div className="relative mx-auto max-w-[76rem]">
                  <StudioMock />
                </div>
              </motion.div>
              <p className="mt-4 text-center text-[0.8rem] text-muted-foreground">
                A preview of Studio with sample data. Run{" "}
                <code className="rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[0.75rem] text-foreground">
                  bunx @blyp/cli studio
                </code>{" "}
                to open yours at localhost:3003.
              </p>
            </div>
          </section>

          {/* Stats + logos */}
          <section className="border-b border-border bg-sidebar">
            <div className="mx-auto grid w-full max-w-[90rem] grid-cols-2 border-x border-border lg:grid-cols-4">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  className={`group/stat border-border px-5 py-8 sm:px-8 ${i % 2 === 1 ? "border-l" : ""} ${i >= 2 ? "border-t lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease }}
                >
                  <p className="font-heading text-5xl font-semibold tracking-[-0.06em] transition-colors duration-300 group-hover/stat:text-primary">
                    {s.value}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
                </motion.div>
              ))}
            </div>
            <div className="flex flex-col gap-3 border-t border-border py-8">
              <LogoRow logos={frameworks} />
              <LogoRow logos={platforms} reverse />
            </div>
          </section>

          <FeatureBento />
          <HowItWorks />
          <Faq />
          <ClosingCta />
        </main>

        <SiteFooter />
      </div>
    </CopyToastProvider>
  );
}
