import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import {
  AI_CRAWLER_POLICY,
  AI_CRAWLER_PROTECTED_PATHS,
} from "@/lib/seo/ai-crawler-policy";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...AI_CRAWLER_POLICY.map((crawler) =>
        crawler.access === "allow"
          ? {
              userAgent: crawler.userAgent,
              allow: "/",
              disallow: [...AI_CRAWLER_PROTECTED_PATHS],
            }
          : {
              userAgent: crawler.userAgent,
              disallow: "/",
            }
      ),
      {
        userAgent: "*",
        allow: "/",
        disallow: [...AI_CRAWLER_PROTECTED_PATHS],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
