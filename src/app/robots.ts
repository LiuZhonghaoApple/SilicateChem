import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/v5-debug", "/v6-debug"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
