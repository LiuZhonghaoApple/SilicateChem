import type { Product } from "@/types";

/** CAS numbers verified in customs trade descriptions (EMA / KB). */
const VERIFIED_CAS = new Set(["6834-92-0", "10213-79-3"]);

/** ISO / QMS certificates — not verified in KB (company_knowledge_base_v1.md). */
export const ISO_FACILITY_VERIFIED_IN_KB = false;

export function isProductSpecVerified(_product: Product): boolean {
  return false;
}

export function isProductCasVerified(cas: string | undefined): boolean {
  if (!cas) return false;
  return VERIFIED_CAS.has(cas);
}

/** Export packaging verified in partial customs records (EMA / KB). */
export const VERIFIED_EXPORT_PACKAGING = [
  "25 kg bag",
  "Bulk (80–100 MT container loads documented in customs records)",
] as const;

/** Physical form derived from INV product taxonomy / appearance fields — not assay data. */
export const PRODUCT_PHYSICAL_FORM: Record<string, string> = {
  "sodium-metasilicate-granules": "Solid (granules)",
  "sodium-metasilicate-anhydrous": "Solid (powder or fine granules)",
  "sodium-metasilicate-pentahydrate": "Solid (crystalline granules or powder)",
  "sodium-silicate": "Liquid and solid (lump/granule)",
};

export const GRADE_SPEC_DISCLAIMER =
  "Specifications may vary by application and grade";

export const SPEC_DISCLAIMER =
  "Typical industry specification (for reference only). Official batch specifications provided via COA on request.";

export const FACTORY_BADGE_ISO =
  "Manufactured in ISO-aligned facility";

export const FACTORY_BADGE_DEFAULT =
  "Factory Verified Production System";

export function getFactoryVerificationBadgeLabel(): string {
  return ISO_FACILITY_VERIFIED_IN_KB ? FACTORY_BADGE_ISO : FACTORY_BADGE_DEFAULT;
}

export function getKbProductCas(product: Product): string | null {
  if (!product.cas || !isProductCasVerified(product.cas)) return null;
  return product.cas;
}

export function getKbPhysicalForm(product: Product): string | null {
  return PRODUCT_PHYSICAL_FORM[product.slug] ?? null;
}

/**
 * KB application fields mapped from INV company sectors + product application taxonomy.
 * Only returns construction, detergent, or chemical industry when keywords match.
 */
export type KbApplicationField = {
  id: "construction" | "detergent" | "chemical";
  label: string;
};

const APPLICATION_FIELD_RULES: {
  id: KbApplicationField["id"];
  label: string;
  pattern: RegExp;
}[] = [
  {
    id: "construction",
    label: "Construction",
    pattern:
      /construction|cement|ceramic|refractory|foundry|building material/i,
  },
  {
    id: "detergent",
    label: "Detergent & Cleaning",
    pattern: /detergent|cleaning|laundry|dishwashing|soap|household|degreasing/i,
  },
  {
    id: "chemical",
    label: "Chemical Industry",
    pattern:
      /industrial|water treatment|formulation|chemical|textile|paper|metal|oil drilling|soil stabilization|bleaching|scouring/i,
  },
];

export function getKbApplicationFields(product: Product): KbApplicationField[] {
  const text = product.applications.join(" ");
  const matched: KbApplicationField[] = [];

  for (const rule of APPLICATION_FIELD_RULES) {
    if (rule.pattern.test(text)) {
      matched.push({ id: rule.id, label: rule.label });
    }
  }

  return matched;
}

export function getSpecificationSheetHref(product: Product): string {
  return `/contact?type=spec&product=${encodeURIComponent(product.name)}`;
}
