"use client";

import { useReducedMotion } from "motion/react";
import PatternWaves, { type PatternWavesProps } from "@/app/components/react-bits/pattern-waves";
import { usePalette, type Palette } from "@/app/components/home/use-palette";

type Tone = keyof Pick<Palette, "signal" | "ink" | "graphite" | "rule">;

/** Theme-aware PatternWaves; renders nothing until the palette resolves on the client. */
export function WaveField({
  tone = "signal",
  surface = "stage",
  className = "",
  ...props
}: Omit<PatternWavesProps, "color" | "backgroundColor"> & {
  tone?: Tone;
  surface?: "stage" | "paper";
}) {
  const palette = usePalette();
  const reduceMotion = useReducedMotion() ?? false;
  if (!palette) return null;
  return (
    <div className={`blyp-fade-in pointer-events-auto absolute inset-0 ${className}`} aria-hidden>
      <PatternWaves
        color={palette[tone]}
        backgroundColor={palette[surface]}
        paused={reduceMotion}
        {...props}
      />
    </div>
  );
}
