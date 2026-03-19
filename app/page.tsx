import type { Metadata } from "next";
import { BlypLandingPage } from "@/app/components/home/blyp-landing-page";

export const metadata: Metadata = {
  title: "Blyp",
  description:
    "Runtime-adaptive logging for Bun, Node.js, and modern TypeScript frameworks, with local Studio workflows, agent skills, and structured logs.",
};

export default function Home() {
  return <BlypLandingPage />;
}
