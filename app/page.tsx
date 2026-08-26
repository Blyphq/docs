import type { Metadata } from "next";
import { BlypLandingPage } from "@/app/components/home/blyp-landing-page";

export const metadata: Metadata = {
  title: "Blyp",
  description:
    "Runtime-adaptive logging for Bun, Node.js, and modern TypeScript frameworks, with local Studio workflows, agent skills, and structured logs.",
  openGraph: {
    type: "website",
    title: "Blyp",
    description:
      "Runtime-adaptive logging for Bun, Node.js, and modern TypeScript frameworks.",
    images: [
      {
        url: "/api/og?title=Blyp&description=Runtime-adaptive%20logging%20for%20Bun%2C%20Node.js%2C%20and%20modern%20TypeScript%20frameworks.",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blyp",
    description:
      "Runtime-adaptive logging for Bun, Node.js, and modern TypeScript frameworks.",
    images: [
      "/api/og?title=Blyp&description=Runtime-adaptive%20logging%20for%20Bun%2C%20Node.js%2C%20and%20modern%20TypeScript%20frameworks.",
    ],
  },
};

export default function Home() {
  return <BlypLandingPage />;
}
