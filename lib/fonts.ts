import { DM_Sans, Geist_Mono, Manrope } from "next/font/google";

export const displayFont = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const sansFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const monoFont = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const fontVariables = [
  displayFont.variable,
  sansFont.variable,
  monoFont.variable,
].join(" ");
