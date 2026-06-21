import { SITE } from "@/lib/constants";

/** Verified factory metrics from INV/KB and QCC 2025. */
export const FACTORY_METRICS = {
  annualCapacity: "100,000 MT",
  annualCapacityNote: "Stated annual capacity for inorganic silicate products (年产无机硅化物产品10万吨)",
  equipmentSets: 438,
  employees: 83,
  employeesNote: "Insured persons at head office, QCC 2025",
  productTypes: "20+",
} as const;

export const FACTORY_PROOF_AREAS = [
  {
    id: "production-lines",
    title: "Production Lines",
    description:
      "Fusion, granulation, drying, and crystallization equipment for metasilicate and silicate grades.",
    imageKey: "production" as const,
  },
  {
    id: "warehouse",
    title: "Warehouse",
    description:
      "Finished-goods staging and batch segregation before export dispatch from Changyi manufacturing site.",
    imageKey: "warehouse" as const,
  },
  {
    id: "loading",
    title: "Loading Area",
    description:
      "Export bagging, palletizing, and container loading supervised at factory warehouse.",
    imageKey: "shipping" as const,
  },
] as const;

export const FACTORY_VERIFICATION_BADGE = {
  label: "Factory Verified",
  description: `${SITE.company} — registered manufacturing site in Changyi, Shandong.`,
} as const;
