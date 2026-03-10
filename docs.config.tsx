import { defineDocs } from "@farming-labs/docs";
import { fumadocs } from "@farming-labs/theme";
import {
  BookOpen,
  Code,
  Database,
  FileText,
  FolderOpen,
  Link,
  Rocket,
  Settings,
  Terminal,
} from "lucide-react";

export default defineDocs({
  entry: "docs",
  theme: fumadocs({
    ui: {
      colors: {
        primary: "oklch(0.74 0.17 183)",
      },
      layout: {
        contentWidth: 820,
        sidebarWidth: 286,
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
        <Rocket size={14} />
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
    database: <Database size={16} />,
    code: <Code size={16} />,
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
