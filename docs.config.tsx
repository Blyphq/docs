import { defineDocs } from "@farming-labs/docs";
import { fumadocs } from "@farming-labs/theme/default";
import {
  BookOpen,
  Bot,
  Code,
  Database,
  FileText,
  FolderOpen,
  GlobeIcon,
  Link,
  Rocket,
  Settings,
  Terminal,
} from "lucide-react";
import Image from "next/image";
import { BlypThemeLogo } from "@/app/components/blyp-theme-logo";

const logoIcon = (src: string, alt: string, className = "object-contain dark:invert dark:grayscale") => (

  <Image
    src={src}
    alt={alt}
    width={18}
    height={18}
    className={className}
  />
);

export default defineDocs({
  entry: "docs",
  contentDir: "app/docs",
  theme: fumadocs({
    ui: {
      colors: {
        primary: "oklch(0.7116 0.1812 22.84)",
      },
      layout: {
        contentWidth: 820,
        sidebarWidth: 300,
        tocWidth: 248,
        toc: {
          enabled: true,
          depth: 3,
          style: "directional",
        },
      },
      typography: {
        font: {
          h1: { size: "2.75rem", weight: 800 },
        },
      },
    },
  }),
  nav: {
    title: (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <BlypThemeLogo width={22} height={22} alt="" />
        <span className="font-semibold tracking-tight">Blyp Docs</span>
      </div>
    ),
    url: "/docs",
  },
  // Keep OG before other endpoint-bearing config. Farming Labs 0.2.111's
  // static MDX setup reads the first literal `endpoint` from this file.
  og: {
    enabled: true,
    type: "dynamic",
    endpoint: "/api/og",
  },
  mcp: {
    enabled: true,
    route: "/api/docs/mcp",
    name: "Blyp Docs",
  },
  changelog: {
    enabled: true,
    path: "changelog",
    contentDir: "release-notes",
    title: "Blyp Changelog",
    description:
      "Release history for @blyp/core and @blyp/cli, including new integrations, fixes, and migration notes.",
    search: true,
  },
  llmsTxt: {
    enabled: true,
    baseUrl: "https://www.blyp.dev",
    siteTitle: "Blyp Docs",
    siteDescription:
      "Implementation documentation for Blyp logging, tracing, connectors, databases, frameworks, and AI SDKs.",
    sections: [
      {
        title: "Getting started",
        description: "Install, configure, and use Blyp.",
        match: ["/docs", "/docs/installation", "/docs/basic-usage", "/docs/configuration", "/docs/cli"],
      },
      {
        title: "Integrations",
        description: "Framework, browser, mobile, and runtime adapters.",
        match: "/docs/integrations/**",
      },
      {
        title: "Connectors",
        description: "Forward logs to observability backends.",
        match: "/docs/connectors/**",
      },
      {
        title: "Authentication",
        description: "Attach authenticated identity to Blyp records.",
        match: "/docs/authentication/**",
      },
      {
        title: "Databases",
        description: "Persist, migrate, and troubleshoot Blyp logs.",
        match: "/docs/database/**",
      },
      {
        title: "AI tracing",
        description: "Trace AI SDK and agent workloads.",
        match: "/docs/ai/**",
      },
      {
        title: "Migrations",
        description: "Move existing logging setups to Blyp.",
        match: "/docs/migrations/**",
      },
      {
        title: "Agent skills",
        description: "Reusable Blyp instructions for coding agents.",
        match: "/docs/skills/**",
      },
    ],
  },
  sitemap: {
    enabled: true,
    baseUrl: "https://www.blyp.dev",
  },
  robots: {
    enabled: true,
    baseUrl: "https://www.blyp.dev",
    ai: "allow",
  },
  agent: {
    skills: {
      paths: "public/skills",
    },
    evaluations: {
      enabled: true,
      surface: "mcp-context",
      tokenBudget: 4_000,
      topK: 1,
      tasks: [
        {
          id: "install-blyp",
          query: "How do I install Blyp and choose the right package entrypoint?",
          expect: {
            relevantSources: ["/docs/installation"],
            minRecallAtK: 1,
            maxFirstRelevantRank: 1,
            safety: { rejectConflictingFrameworkVersions: true },
            coverage: { executableExamples: "not-applicable" },
          },
        },
        {
          id: "nextjs-request-logging",
          query: "Configure request-scoped Blyp logging in a Next.js App Router route handler",
          expect: {
            relevantSources: ["/docs/skills/nextjs"],
            minRecallAtK: 1,
            maxFirstRelevantRank: 1,
            safety: { rejectConflictingFrameworkVersions: true },
            coverage: { executableExamples: "not-applicable" },
          },
        },
        {
          id: "better-stack-connector",
          query: "Send Blyp logs to Better Stack and verify connector delivery",
          expect: {
            relevantSources: ["/docs/skills/betterstack"],
            minRecallAtK: 1,
            maxFirstRelevantRank: 1,
            safety: { rejectConflictingFrameworkVersions: true },
            coverage: { executableExamples: "not-applicable" },
          },
        },
        {
          id: "openai-tracing",
          query: "Trace OpenAI responses and chat completions with Blyp",
          expect: {
            relevantSources: ["/docs/ai/openai-sdk"],
            minRecallAtK: 1,
            maxFirstRelevantRank: 1,
            safety: { rejectConflictingFrameworkVersions: true },
            coverage: { executableExamples: "not-applicable" },
          },
        },
        {
          id: "migrate-pino",
          query: "Migrate an existing Pino logger to Blyp safely",
          expect: {
            relevantSources: ["/docs/migrations/pino"],
            minRecallAtK: 1,
            maxFirstRelevantRank: 1,
            safety: { rejectConflictingFrameworkVersions: true },
            coverage: { executableExamples: "not-applicable" },
          },
        },
      ],
    },
  },
  icons: {
    book: <BookOpen size={16} />,
    rocket: <Rocket size={16} />,
    terminal: <Terminal size={16} />,
    file: <FileText size={16} />,
    settings: <Settings size={16} />,
    folder: <FolderOpen size={16} />,
    link: <Link size={13} />,
    betterstack: logoIcon("/logos/better-stack.png", "Better Stack"),
    client: <GlobeIcon size={16} />,
    databuddy: logoIcon("/logos/databuddy.svg", "Databuddy"),
    elysia: logoIcon("/logos/elysia-seeklogo.svg", "Elysia"),
    expo: logoIcon("/logos/expo-icon.svg", "Expo"),
    express: logoIcon("/logos/express.svg", "Express"),
    fastify: logoIcon("/logos/fastify-icon.svg", "Fastify"),
    hono: logoIcon("/logos/hono.svg", "Hono"),
    nestjs: logoIcon("/logos/nestjs.svg", "NestJS"),
    nextjs: logoIcon("/logos/nextjs-icon.svg", "Next.js"),
    farm: logoIcon(
      "/logos/farmjs.png",
      "Farm.js",
      "object-contain brightness-0 dark:invert",
    ),
    posthog: logoIcon("/logos/posthog.svg", "PostHog"),
    react: logoIcon("/logos/reactrouter.svg", "React Router"),
    sentry: logoIcon("/logos/sentry.svg", "Sentry"),
    svelte: logoIcon("/logos/svelte-icon.svg", "SvelteKit"),
    astro: logoIcon("/logos/astro.svg", "Astro"),
    nuxt: logoIcon("/logos/nuxtjs.svg", "Nuxt"),
    workers: logoIcon("/logos/cloudflare-workers-icon.svg", "Cloudflare Workers"),
    convex: logoIcon("/logos/convex.svg", "Convex"),
    tanstack: logoIcon("/logos/tanstack-start.png", "TanStack"),
    solid: logoIcon("/logos/solidjs.svg", "SolidStart", "object-contain"),
    vercel: logoIcon("/logos/vercel.svg", "Vercel", "object-contain invert dark:invert-0 dark:grayscale-0"),
    clerk: logoIcon("/logos/clerk.svg", "Clerk", "object-contain"),
    "better-auth": logoIcon("/logos/better-auth.svg", "Better Auth", "object-contain"),
    workos: logoIcon("/logos/workos.svg", "WorkOS", "object-contain"),
    openai: logoIcon("/logos/openai.svg", "OpenAI", "object-contain invert dark:invert-0 dark:grayscale-0"),
    anthropic: logoIcon("/logos/anthropic.svg", "Anthropic", "object-contain invert dark:invert-0 dark:grayscale-0"),
    prisma: logoIcon("/logos/prisma.svg", "Prisma", "object-contain invert dark:invert-0 dark:grayscale-0"),
    drizzle: logoIcon("/logos/drizzle.svg", "Drizzle", "object-contain invert dark:invert-0 dark:grayscale-0"),
    mongodb: logoIcon("/logos/mongodb.svg", "MongoDB", "object-contain p-0.5"),
    pino: logoIcon("/logos/pino.svg", "Pino"),
    database: <Database size={16} />,
    code: <Code size={16} />,
    skills: <Bot size={16} />,
  },
  sidebar: {
    flat: false,
  },
  breadcrumb: { enabled: true },
  lastUpdated: { position: "below-title" },
  pageActions: {
    position: "below-title",
    alignment: "right",
    copyMarkdown: { enabled: true, includeTitle: true },
    openDocs: {
      enabled: true,
      target: "markdown",
      prompt: "Use this Blyp documentation while working on the current codebase: {url}",
      providers: ["chatgpt", "claude", { id: "cursor", mode: "app" }],
    },
  },
  metadata: {
    titleTemplate: "%s | Blyp Docs",
    description:
      "Documentation for Blyp, a runtime-adaptive logger for Bun, Node.js, and modern TypeScript frameworks.",
  },
  themeToggle: {
    enabled: true,
    default: "system",
    mode: "light-dark-system",
  },
});
