import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Plus_Jakarta_Sans,
  Space_Mono,
} from "next/font/google";
import { RootProvider } from "@farming-labs/theme";
import docsConfig from "@/docs.config";
import "./global.css";
import { Databuddy } from "@databuddy/sdk/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistSansDocs = Geist({
  variable: "--fd-font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const geistMonoDocs = Geist_Mono({
  variable: "--fd-font-mono",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Blyp Docs",
    template: docsConfig.metadata?.titleTemplate ?? "%s",
  },
  description: docsConfig.metadata?.description,
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistSansDocs.variable} ${geistMono.variable} ${geistMonoDocs.variable} ${plusJakarta.variable} ${spaceMono.variable}`}
      >
        <RootProvider>
          <Databuddy
            clientId={process.env.NEXT_PUBLIC_DATABUDDY_CLIENT_ID}
            trackHashChanges={true}
            trackAttributes={true}
            trackOutgoingLinks={true}
            trackInteractions={true}
          />
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
