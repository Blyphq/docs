"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/**
 * Hex mirrors of the OKLCH tokens in global.css, for canvas/WebGL components
 * (PatternWaves, TechText) that can't resolve CSS variables.
 */
const palettes = {
  light: {
    paper: "#f9f6f2",
    stage: "#f0ede7",
    ink: "#181410",
    graphite: "#625d56",
    rule: "#ccc8c2",
    signal: "#ed5041",
  },
  dark: {
    paper: "#100e0c",
    stage: "#0a0806",
    ink: "#f1efeb",
    graphite: "#a6a09b",
    rule: "#3c3733",
    signal: "#fa6e58",
  },
} as const;

export type Palette = (typeof palettes)[keyof typeof palettes];

/** Returns `null` until mounted so canvas components never render with the wrong theme. */
export function usePalette(): (Palette & { isDark: boolean }) | null {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const isDark = resolvedTheme === "dark";
  return { ...(isDark ? palettes.dark : palettes.light), isDark };
}
