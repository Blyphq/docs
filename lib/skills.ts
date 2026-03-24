import { readFile } from "node:fs/promises";
import path from "node:path";

export type SkillPreset = {
  slug:
    | "core"
    | "nextjs"
    | "react-router"
    | "nuxt"
    | "express"
    | "hono"
    | "elysia"
    | "workers"
    | "client-expo"
    | "betterstack"
    | "databuddy"
    | "posthog"
    | "sentry"
    | "otlp";
  skillId: string;
  title: string;
  category: "core" | "integration" | "connector";
  coverage: string;
  whenToInstall: string;
  relatedHref: string;
  relatedLabel: string;
  docsPath: string;
  rawPath: string;
};

export type SkillInstallTarget = {
  agent: "Codex" | "OpenCode" | "Claude Code";
  projectPath: string;
  globalPath: string;
};

export const skillPresets: SkillPreset[] = [
  {
    slug: "core",
    skillId: "blyp-core",
    title: "Core",
    category: "core",
    coverage: "Base Blyp install, config, ingestion, and runtime rules",
    whenToInstall:
      "Install first in any repo where an agent might add or modify Blyp logging.",
    relatedHref: "/docs/configuration",
    relatedLabel: "Configuration",
    docsPath: "/docs/skills/core",
    rawPath: "/skills/blyp-core/SKILL.md",
  },
  {
    slug: "nextjs",
    skillId: "blyp-nextjs",
    title: "Next.js",
    category: "integration",
    coverage: "Next.js App Router routes with withLogger() and clientLogHandler",
    whenToInstall:
      "Install when the codebase uses Next.js App Router and imports from @blyp/core/nextjs.",
    relatedHref: "/docs/integrations/nextjs",
    relatedLabel: "Next.js App Router",
    docsPath: "/docs/skills/nextjs",
    rawPath: "/skills/blyp-nextjs/SKILL.md",
  },
  {
    slug: "react-router",
    skillId: "blyp-react-router",
    title: "React Router",
    category: "integration",
    coverage: "React Router middleware, context-scoped logging, and clientLogHandler(request)",
    whenToInstall:
      "Install when the codebase uses React Router middleware and imports from @blyp/core/react-router.",
    relatedHref: "/docs/integrations/react-router",
    relatedLabel: "React Router",
    docsPath: "/docs/skills/react-router",
    rawPath: "/skills/blyp-react-router/SKILL.md",
  },
  {
    slug: "nuxt",
    skillId: "blyp-nuxt",
    title: "Nuxt",
    category: "integration",
    coverage: "Nuxt serverPlugin, getLogger(event), and clientLogHandler event routes",
    whenToInstall:
      "Install when the codebase runs on Nuxt and imports from @blyp/core/nuxt.",
    relatedHref: "/docs/integrations/nuxt",
    relatedLabel: "Nuxt",
    docsPath: "/docs/skills/nuxt",
    rawPath: "/skills/blyp-nuxt/SKILL.md",
  },
  {
    slug: "express",
    skillId: "blyp-express",
    title: "Express",
    category: "integration",
    coverage: "Express middleware, req.blypLog, and error logging flow",
    whenToInstall:
      "Install when the codebase mounts Blyp in Express and needs correct middleware ordering.",
    relatedHref: "/docs/integrations/express",
    relatedLabel: "Express",
    docsPath: "/docs/skills/express",
    rawPath: "/skills/blyp-express/SKILL.md",
  },
  {
    slug: "hono",
    skillId: "blyp-hono",
    title: "Hono",
    category: "integration",
    coverage: "Hono middleware, context.get(\"blypLog\"), and ingestion interception",
    whenToInstall:
      "Install when the app uses Hono middleware and request logging via @blyp/core/hono.",
    relatedHref: "/docs/integrations/hono",
    relatedLabel: "Hono",
    docsPath: "/docs/skills/hono",
    rawPath: "/skills/blyp-hono/SKILL.md",
  },
  {
    slug: "elysia",
    skillId: "blyp-elysia",
    title: "Elysia",
    category: "integration",
    coverage: "Elysia plugin setup and ctx.log request logging",
    whenToInstall:
      "Install when the server uses Elysia and integrates Blyp as a plugin.",
    relatedHref: "/docs/integrations/elysia",
    relatedLabel: "Elysia",
    docsPath: "/docs/skills/elysia",
    rawPath: "/skills/blyp-elysia/SKILL.md",
  },
  {
    slug: "workers",
    skillId: "blyp-workers",
    title: "Cloudflare Workers",
    category: "integration",
    coverage: "Workers-only initWorkersLogger(), createWorkersLogger(), and manual emit()",
    whenToInstall:
      "Install when the target runtime is Cloudflare Workers instead of Node.js or Bun.",
    relatedHref: "/docs/integrations/workers",
    relatedLabel: "Cloudflare Workers",
    docsPath: "/docs/skills/workers",
    rawPath: "/skills/blyp-workers/SKILL.md",
  },
  {
    slug: "client-expo",
    skillId: "blyp-client-expo",
    title: "Client + Expo",
    category: "integration",
    coverage: "Browser createClientLogger() and Expo createExpoLogger() delivery rules",
    whenToInstall:
      "Install when Blyp needs to emit from browsers or Expo apps into a Blyp-enabled backend.",
    relatedHref: "/docs/integrations/client",
    relatedLabel: "Client and Expo",
    docsPath: "/docs/skills/client-expo",
    rawPath: "/skills/blyp-client-expo/SKILL.md",
  },
  {
    slug: "betterstack",
    skillId: "blyp-betterstack",
    title: "Better Stack",
    category: "connector",
    coverage:
      "connectors.betterstack, auto/manual log forwarding, and Better Stack error tracking",
    whenToInstall:
      "Install when the codebase forwards Blyp logs or handled errors into Better Stack.",
    relatedHref: "/docs/connectors/betterstack",
    relatedLabel: "Better Stack",
    docsPath: "/docs/skills/betterstack",
    rawPath: "/skills/blyp-betterstack/SKILL.md",
  },
  {
    slug: "databuddy",
    skillId: "blyp-databuddy",
    title: "Databuddy",
    category: "connector",
    coverage: "connectors.databuddy, auto/manual forwarding, and Databuddy manual helper APIs",
    whenToInstall:
      "Install when the codebase forwards Blyp logs or handled errors into Databuddy.",
    relatedHref: "/docs/connectors/databuddy",
    relatedLabel: "Databuddy",
    docsPath: "/docs/skills/databuddy",
    rawPath: "/skills/blyp-databuddy/SKILL.md",
  },
  {
    slug: "posthog",
    skillId: "blyp-posthog",
    title: "PostHog",
    category: "connector",
    coverage: "connectors.posthog, auto/manual delivery, and error tracking",
    whenToInstall:
      "Install when the codebase forwards Blyp logs or errors into PostHog.",
    relatedHref: "/docs/connectors/posthog",
    relatedLabel: "PostHog",
    docsPath: "/docs/skills/posthog",
    rawPath: "/skills/blyp-posthog/SKILL.md",
  },
  {
    slug: "sentry",
    skillId: "blyp-sentry",
    title: "Sentry",
    category: "connector",
    coverage: "connectors.sentry, auto/manual delivery, and existing client reuse",
    whenToInstall:
      "Install when Blyp logs or structured events need to flow into Sentry.",
    relatedHref: "/docs/connectors/sentry",
    relatedLabel: "Sentry",
    docsPath: "/docs/skills/sentry",
    rawPath: "/skills/blyp-sentry/SKILL.md",
  },
  {
    slug: "otlp",
    skillId: "blyp-otlp",
    title: "OTLP",
    category: "connector",
    coverage: "Named OTLP targets, auto/manual delivery, and client forwarding requests",
    whenToInstall:
      "Install when Blyp forwards to Grafana, Datadog, Honeycomb, or another OTLP target.",
    relatedHref: "/docs/connectors/otlp",
    relatedLabel: "OTLP",
    docsPath: "/docs/skills/otlp",
    rawPath: "/skills/blyp-otlp/SKILL.md",
  },
];

export function getSkillBySlug(slug: SkillPreset["slug"]): SkillPreset {
  const skill = skillPresets.find((entry) => entry.slug === slug);

  if (!skill) {
    throw new Error(`Unknown Blyp skill preset: ${slug}`);
  }

  return skill;
}

export function getSkillInstallTargets(skillId: string): SkillInstallTarget[] {
  return [
    {
      agent: "Codex",
      projectPath: `.agents/skills/${skillId}/SKILL.md`,
      globalPath: `~/.agents/skills/${skillId}/SKILL.md`,
    },
    {
      agent: "OpenCode",
      projectPath: `.opencode/skills/${skillId}/SKILL.md`,
      globalPath: `~/.config/opencode/skills/${skillId}/SKILL.md`,
    },
    {
      agent: "Claude Code",
      projectPath: `.claude/skills/${skillId}/SKILL.md`,
      globalPath: `~/.claude/skills/${skillId}/SKILL.md`,
    },
  ];
}

export async function readSkillSource(slug: SkillPreset["slug"]): Promise<string> {
  const skill = getSkillBySlug(slug);
  const filePath = path.join(process.cwd(), "public", skill.rawPath.replace(/^\//, ""));

  return readFile(filePath, "utf8");
}
