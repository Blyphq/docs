"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ArrowRight, Github, Monitor, Moon, Sun } from "lucide-react";
import { BlypThemeLogo } from "@/app/components/blyp-theme-logo";
import RubberSegment from "@/app/components/react-bits/micro/rubber-segment";
import WarmTooltip, { WarmTooltipGroup } from "@/app/components/react-bits/micro/warm-tooltip";

const links = [
  { href: "/docs", label: "Docs", hint: "Guides, API, and recipes" },
  { href: "/docs/integrations", label: "Integrations", hint: "17 frameworks & runtimes" },
  { href: "/docs/connectors", label: "Connectors", hint: "PostHog, Sentry, OTLP…" },
  { href: "/docs/skills", label: "Skills", hint: "Instructions for coding agents" },
  { href: "/docs/changelog", label: "Changelog", hint: "What shipped lately" },
];

const themes = [
  { value: "light", label: <Sun className="size-3.5" aria-label="Light" />, },
  { value: "system", label: <Monitor className="size-3.5" aria-label="System" /> },
  { value: "dark", label: <Moon className="size-3.5" aria-label="Dark" /> },
];

function ThemeSegment() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <span className="h-7 w-[6.5rem]" aria-hidden />;
  return (
    <RubberSegment
      aria-label="Color theme"
      items={themes}
      value={theme ?? "system"}
      onChange={(value) => setTheme(value)}
      size="sm"
      equalSlots
      radius={999}
      trackColor="var(--muted)"
      thumbColor="var(--card)"
      textColor="var(--graphite)"
      activeTextColor="var(--ink)"
      className="shadow-[inset_0_0_0_1px_var(--rule)]"
    />
  );
}

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3">
      <div
        data-scrolled={scrolled}
        className="blyp-nav pointer-events-auto mx-auto flex h-14 items-center gap-6 px-4 sm:px-5"
      >
        <Link
          href="/"
          aria-label="Blyp home"
          className="group/logo flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="transition-transform duration-500 ease-out-expo group-hover/logo:-rotate-12 group-hover/logo:scale-110">
            <BlypThemeLogo width={26} height={26} alt="" />
          </span>
          <span className="font-heading text-[1.15rem] font-semibold tracking-[-0.04em]">blyp</span>
        </Link>

        <WarmTooltipGroup>
          <nav aria-label="Primary" className="hidden items-center gap-0.5 md:flex">
            {links.map((link) => (
              <WarmTooltip
                key={link.href}
                content={link.hint}
                side="bottom"
                size="sm"
                surfaceColor="var(--ink)"
                inkColor="var(--paper)"
              >
                <Link
                  href={link.href}
                  className="rounded-full px-3 py-1.5 text-[0.85rem] text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {link.label}
                </Link>
              </WarmTooltip>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:block">
              <ThemeSegment />
            </div>
            <WarmTooltip
              content="Star Blyphq/blyp"
              side="bottom"
              size="sm"
              surfaceColor="var(--ink)"
              inkColor="var(--paper)"
            >
              <a
                href="https://github.com/Blyphq/blyp"
                target="_blank"
                rel="noreferrer"
                aria-label="Blyp on GitHub"
                className="grid size-9 place-items-center rounded-full text-muted-foreground transition-[color,background-color,transform] duration-200 hover:bg-muted hover:text-foreground active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Github className="size-4" aria-hidden />
              </a>
            </WarmTooltip>
            <Link
              href="/docs/installation"
              className="group/cta inline-flex h-9 items-center gap-1.5 rounded-full bg-primary pl-4 pr-3 text-[0.85rem] font-medium text-primary-foreground shadow-sm transition-[background-color,transform,box-shadow] duration-200 hover:bg-primary-hover hover:shadow-md active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Get started
              <ArrowRight
                className="size-3.5 transition-transform duration-300 ease-out-expo group-hover/cta:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </div>
        </WarmTooltipGroup>
      </div>
    </header>
  );
}
