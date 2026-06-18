import { products } from "@/content/products";
import { industryApplications } from "@/content/applications/industries";
import { intentGuides } from "@/content/guides/intent-pages";
import {
  METASILICATE_CATEGORY_PATH,
  METASILICATE_GRADE_SLUGS,
} from "@/lib/seo-keywords";

export const metasilicateCategoryLink = {
  href: METASILICATE_CATEGORY_PATH,
  label: "Sodium Metasilicate",
  isCategoryHub: true as const,
};

export const applicationLinks = industryApplications.map((a) => ({
  href: `/applications/${a.slug}`,
  label: a.title,
}));

export const guideLinks = intentGuides.map((g) => ({
  href: `/guides/${g.slug}`,
  label: g.title,
}));

export const funnelHubLink = metasilicateCategoryLink;

export const metasilicateGradeLinks = METASILICATE_GRADE_SLUGS.map((slug) => {
  const p = products.find((x) => x.slug === slug)!;
  return {
    href: `/products/${p.slug}`,
    label: p.name,
    isGrade: true as const,
  };
});

const sodiumSilicate = products.find((p) => p.slug === "sodium-silicate")!;

export const sodiumSilicateLink = {
  href: `/products/${sodiumSilicate.slug}`,
  label: sodiumSilicate.name,
  isGrade: false as const,
};

/** Category hub first — strongest product internal link */
export const productNavLinks = [
  metasilicateCategoryLink,
  ...metasilicateGradeLinks,
  sodiumSilicateLink,
];

export function getRelatedProductLinks(currentHref: string) {
  return productNavLinks.filter((l) => l.href !== currentHref);
}

export function isMetasilicateGrade(slug: string) {
  return (METASILICATE_GRADE_SLUGS as readonly string[]).includes(slug);
}
