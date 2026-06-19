"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { trackPageViewBySource } from "@/lib/analytics";

const TRACKED_PREFIXES = [
  "/products/sodium-metasilicate",
  "/guides",
  "/applications",
];

/** Fires page_view_by_source on money page, guides, and applications. */
export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const source = searchParams.get("source") ?? undefined;

  useEffect(() => {
    const shouldTrack = TRACKED_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );
    if (!shouldTrack) return;
    trackPageViewBySource(pathname, source ?? pathname);
  }, [pathname, source]);

  return null;
}
