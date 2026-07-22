"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { trackPageViewBySource } from "@/lib/analytics";

/**
 * Fires a standard GA4 page_view plus the source-aware data-layer event on
 * every public route. RouteShell excludes /admin, so admin traffic cannot
 * contaminate the production funnel.
 */
export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const source = searchParams.get("source") ?? undefined;

  useEffect(() => {
    trackPageViewBySource(pathname, source ?? pathname);
  }, [pathname, source]);

  return null;
}
