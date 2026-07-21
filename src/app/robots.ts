import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  const protectedPaths = ["/api/", "/admin/", "/v5-debug", "/v6-debug"];

  return {
    rules: [
      {
        // Search/citation access for ChatGPT is allowed.
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: protectedPaths,
      },
      {
        // Search visibility is separate from model-training access.
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: protectedPaths,
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
