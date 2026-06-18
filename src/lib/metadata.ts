import type { Metadata } from "next";
import { SITE } from "./constants";

type PageMeta = {
  title: string;
  description: string;
  path: string;
  /** Single primary keyword for this page — avoids cannibalization */
  primaryKeyword?: string;
  keywords?: readonly string[];
  /** Mid-funnel pages: noindex but follow links to authority sink */
  noIndex?: boolean;
};

export function createMetadata({
  title,
  description,
  path,
  primaryKeyword,
  keywords = [],
  noIndex = false,
}: PageMeta): Metadata {
  const url = `${SITE.url}${path}`;
  const fullTitle = `${title} | ${SITE.name}`;
  const pageTitle = path === "/" ? { absolute: fullTitle } : title;
  const ogImage = `${SITE.url}/images/og-image.svg`;

  const keywordList = primaryKeyword
    ? [primaryKeyword, ...keywords.filter((k) => k !== primaryKeyword)]
    : keywords;

  return {
    title: pageTitle,
    description,
    keywords: keywordList.length > 0 ? [...keywordList] : undefined,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE.name,
      locale: "en_US",
      type: "website",
      images: [{ url: ogImage, alt: SITE.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: { index: !noIndex, follow: true },
  };
}
