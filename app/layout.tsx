import type { Metadata } from "next";
import { RootProvider } from "@farming-labs/theme";
import docsConfig from "@/docs.config";
import { CanonicalLink } from "@/app/components/canonical-link";
import { fontVariables } from "@/lib/fonts";
import "./global.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blyp.dev",
  ),
  title: {
    default: "Blyp Docs",
    template: docsConfig.metadata?.titleTemplate ?? "%s",
  },
  description: docsConfig.metadata?.description,
  openGraph: {
    type: "website",
    title: "Blyp Docs",
    description: docsConfig.metadata?.description,
    images: [
      {
        url: "/api/og?title=Blyp%20Docs&description=Runtime-adaptive%20logging%20for%20modern%20TypeScript%20applications.",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blyp Docs",
    description: docsConfig.metadata?.description,
    images: [
      "/api/og?title=Blyp%20Docs&description=Runtime-adaptive%20logging%20for%20modern%20TypeScript%20applications.",
    ],
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <CanonicalLink />
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID ?? "16b8c36a-2ec0-4767-ba88-e12375f3a1dd"}
        ></script>
      </head>
      <body>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
