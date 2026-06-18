import type { Product } from "@/types";
import { SEO_KEYWORDS } from "@/lib/seo-keywords";

export const products: Product[] = [
  {
    slug: "sodium-metasilicate-granules",
    name: "Sodium Metasilicate Granules",
    shortName: "Granules",
    cas: "6834-92-0",
    formula: "Na₂SiO₃",
    categoryParent: "sodium-metasilicate",
    primaryKeyword: SEO_KEYWORDS.granules.primary,
    metaTitle: SEO_KEYWORDS.granules.title,
    metaDescription: SEO_KEYWORDS.granules.description,
    keywords: ["sodium metasilicate granules specifications", "granule mesh size"],
    summary:
      "Our primary export grade. Uniform granules with consistent dissolution and stable color for detergent builders and industrial formulations.",
    description: [
      "Sodium metasilicate granules are our main production line and export product. We supply uniform, free-flowing granules suitable for automated dosing in detergent manufacturing and industrial chemical blending.",
      "Production is controlled in-house from raw material intake through granulation, drying, and packaging. Batch records support traceability for export buyers requiring consistent specifications.",
      "Granule form reduces dust handling issues compared to powder grades and supports stable feeding in bulk blending operations.",
    ],
    specs: [
      { label: "CAS No.", value: "6834-92-0" },
      { label: "Chemical Formula", value: "Na₂SiO₃" },
      { label: "Appearance", value: "White to off-white granules" },
      { label: "SiO₂ Content", value: "≥ 46.0%" },
      { label: "Na₂O Content", value: "≥ 50.0%" },
      { label: "Fe Content", value: "≤ 0.02%" },
      { label: "Water Insoluble", value: "≤ 0.2%" },
      { label: "Particle Size", value: "8–40 mesh (customizable)" },
    ],
    applications: [
      "Laundry and dishwashing detergent builders",
      "Industrial cleaning compound formulations",
      "Ceramic and refractory processing aids",
      "Metal surface treatment preparations",
    ],
    packaging: [
      "25 kg woven bags with PE liner",
      "50 kg woven bags with PE liner",
      "1,000 kg jumbo bags (FIBC)",
      "Custom labeling available for export orders",
    ],
    features: [
      "Highest production volume grade",
      "Stable color batch to batch",
      "Low iron content for white powder detergent compatibility",
      "Uniform granule particle size",
      "8–40 mesh standard (customizable)",
    ],
  },
  {
    slug: "sodium-metasilicate-anhydrous",
    name: "Sodium Metasilicate Anhydrous",
    shortName: "Anhydrous",
    cas: "6834-92-0",
    formula: "Na₂SiO₃",
    categoryParent: "sodium-metasilicate",
    primaryKeyword: SEO_KEYWORDS.anhydrous.primary,
    metaTitle: SEO_KEYWORDS.anhydrous.title,
    metaDescription: SEO_KEYWORDS.anhydrous.description,
    keywords: ["anhydrous Na2SiO3 specifications", "low moisture metasilicate"],
    summary:
      "High-activity anhydrous grade for formulations requiring maximum alkalinity per unit weight and low moisture content.",
    description: [
      "Sodium metasilicate anhydrous provides the highest available alkalinity in the metasilicate product range. It is used where moisture introduction must be minimized in dry blend systems.",
      "Our anhydrous line is produced on dedicated drying equipment with moisture control monitoring. Export packaging options support long-distance shipment to distributors and end manufacturers.",
    ],
    specs: [
      { label: "CAS No.", value: "6834-92-0" },
      { label: "Chemical Formula", value: "Na₂SiO₃" },
      { label: "Appearance", value: "White powder or fine granules" },
      { label: "SiO₂ Content", value: "≥ 46.0%" },
      { label: "Na₂O Content", value: "≥ 50.0%" },
      { label: "Fe Content", value: "≤ 0.02%" },
      { label: "Moisture", value: "≤ 1.0%" },
    ],
    applications: [
      "High-alkalinity detergent formulations",
      "Industrial degreasing compounds",
      "Paper and pulp processing chemicals",
      "Oil drilling fluid additives",
    ],
    packaging: [
      "25 kg woven bags with PE liner",
      "50 kg woven bags with PE liner",
      "1,000 kg jumbo bags (FIBC)",
    ],
    features: [
      "Low moisture for dry blend stability",
      "Controlled iron content",
      "Consistent SiO₂/Na₂O ratio",
      "Export-ready documentation support",
    ],
  },
  {
    slug: "sodium-metasilicate-pentahydrate",
    name: "Sodium Metasilicate Pentahydrate",
    shortName: "Pentahydrate",
    cas: "10213-79-3",
    formula: "Na₂SiO₃·5H₂O",
    categoryParent: "sodium-metasilicate",
    primaryKeyword: SEO_KEYWORDS.pentahydrate.primary,
    metaTitle: SEO_KEYWORDS.pentahydrate.title,
    metaDescription: SEO_KEYWORDS.pentahydrate.description,
    keywords: ["pentahydrate Na2SiO3 specifications", "crystalline metasilicate"],
    summary:
      "Crystalline pentahydrate grade with predictable dissolution behavior for cleaning and water treatment applications.",
    description: [
      "Sodium metasilicate pentahydrate is a crystalline hydrate form widely used in cleaning products and water treatment chemical blends where controlled dissolution rate is required.",
      "We produce pentahydrate on a separate crystallization line with batch testing for crystal integrity and dissolution performance.",
    ],
    specs: [
      { label: "CAS No.", value: "10213-79-3" },
      { label: "Chemical Formula", value: "Na₂SiO₃·5H₂O" },
      { label: "Appearance", value: "White crystalline granules or powder" },
      { label: "SiO₂ Content", value: "≥ 28.5%" },
      { label: "Na₂O Content", value: "≥ 29.0%" },
      { label: "Fe Content", value: "≤ 0.02%" },
    ],
    applications: [
      "Household and institutional cleaning products",
      "Water treatment chemical formulations",
      "Textile scouring and bleaching auxiliaries",
      "Metal cleaning preparations",
    ],
    packaging: [
      "25 kg woven bags with PE liner",
      "50 kg woven bags with PE liner",
      "1,000 kg jumbo bags (FIBC)",
    ],
    features: [
      "Predictable dissolution profile",
      "Suitable for liquid and powder blend systems",
      "Stable crystal structure in storage",
      "Available for combined shipment with granule grades",
    ],
  },
  {
    slug: "sodium-silicate",
    name: "Sodium Silicate",
    shortName: "Sodium Silicate",
    cas: "1344-09-8",
    formula: "Na₂O·nSiO₂",
    primaryKeyword: SEO_KEYWORDS.sodiumSilicate.primary,
    metaTitle: SEO_KEYWORDS.sodiumSilicate.title,
    metaDescription: SEO_KEYWORDS.sodiumSilicate.description,
    keywords: ["liquid sodium silicate", "sodium silicate exporter China"],
    summary:
      "Supporting silicate product line available in liquid and solid moduli for industrial buyers requiring combined metasilicate and silicate supply.",
    description: [
      "Sodium silicate is produced as a complementary product for buyers who source multiple silicate chemicals from a single manufacturer. Available in various modulus ratios to match application requirements.",
      "Combined orders of sodium metasilicate granules and sodium silicate simplify procurement, logistics, and quality documentation for distributors serving detergent and industrial markets.",
    ],
    specs: [
      { label: "CAS No.", value: "1344-09-8" },
      { label: "Chemical Formula", value: "Na₂O·nSiO₂" },
      { label: "Forms Available", value: "Liquid and solid (lump/granule)" },
      { label: "Modulus Range", value: "2.0–3.5 (specify on inquiry)" },
      { label: "Appearance (Liquid)", value: "Clear to slightly turbid liquid" },
      { label: "Appearance (Solid)", value: "Colorless to light green lumps/granules" },
    ],
    applications: [
      "Detergent and soap manufacturing",
      "Construction and cement additives",
      "Foundry binders and refractories",
      "Paper and cardboard production",
      "Water treatment and soil stabilization",
    ],
    packaging: [
      "Liquid: 200 L drums, 1,000 L IBC tanks, bulk tanker",
      "Solid: 25 kg / 50 kg bags, jumbo bags",
    ],
    features: [
      "Multiple modulus options",
      "Combined shipment with metasilicate products",
      "Factory-direct supply from same production site",
      "Export documentation available",
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getMetasilicateGrades(): Product[] {
  return products.filter((p) => p.categoryParent === "sodium-metasilicate");
}

/** @deprecated Use sodiumMetasilicateCategory — category hub is the primary product page */
export function getPrimaryProduct(): Product {
  return products.find((p) => p.slug === "sodium-metasilicate-granules") ?? products[0];
}
