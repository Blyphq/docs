import { defineDocs } from "@farming-labs/docs";
import { fumadocs } from "@farming-labs/theme";
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

const logoIcon = (src: string, alt: string) => (

    <Image
      src={src}
      alt={alt}
      width={18}
      height={18}
      className="object-contain dark:invert dark:grayscale"
    />
);

export default defineDocs({
  entry: "docs",
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
    posthog: logoIcon("/logos/posthog.svg", "PostHog"),
    react: logoIcon("/logos/reactrouter.svg", "React Router"),
    sentry: logoIcon("/logos/sentry.svg", "Sentry"),
    svelte: logoIcon("/logos/svelte-icon.svg", "SvelteKit"),
    astro: logoIcon("/logos/astro.svg", "Astro"),
    nuxt: logoIcon("/logos/nuxtjs.svg", "Nuxt"),
    workers: logoIcon("/logos/cloudflare-workers-icon.svg", "Cloudflare Workers"),
    tanstack: logoIcon("/logos/tanstack-start.png", "TanStack"),
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
    alignment: "right",
    copyMarkdown: { enabled: true },
    openDocs: { enabled: false },
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
  og: {
    enabled: true,
    type: "dynamic",
    endpoint: "/api/og",
    defaultImage: "/og/default.png",
  },
});
