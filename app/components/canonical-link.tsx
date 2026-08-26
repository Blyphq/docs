"use client";

import { usePathname } from "next/navigation";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blyp.dev"
).replace(/\/$/, "");

export function CanonicalLink() {
  const pathname = usePathname();
  const canonicalPath = pathname === "/" ? "" : pathname.replace(/\/$/, "");

  return <link rel="canonical" href={`${siteUrl}${canonicalPath || "/"}`} />;
}
