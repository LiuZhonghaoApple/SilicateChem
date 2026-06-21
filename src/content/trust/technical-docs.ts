export type TechnicalDocStatus = "available_on_request";

export type TechnicalDocEntry = {
  status: TechnicalDocStatus;
  description: string;
  applicableProducts: readonly string[];
  /** COA only — typical assay fields provided on request (not published values). */
  fields?: readonly string[];
};

export const technicalDocs = {
  COA: {
    status: "available_on_request",
    description:
      "Batch-specific certificate of analysis for sodium metasilicate and sodium silicate grades.",
    applicableProducts: ["sodium metasilicate", "sodium silicate"],
    fields: ["purity", "Na2O", "SiO2", "Fe", "moisture"],
  },
  TDS: {
    status: "available_on_request",
    description:
      "Technical data sheet with grade parameters, packaging, and handling guidance.",
    applicableProducts: ["sodium metasilicate", "sodium silicate"],
  },
  SDS: {
    status: "available_on_request",
    description:
      "Safety data sheet aligned with shipment classification and destination requirements.",
    applicableProducts: ["sodium metasilicate", "sodium silicate"],
  },
} as const satisfies Record<string, TechnicalDocEntry>;

export type TechnicalDocType = keyof typeof technicalDocs;

export const technicalDocLabels: Record<TechnicalDocType, string> = {
  COA: "Certificate of Analysis (COA)",
  TDS: "Technical Data Sheet (TDS)",
  SDS: "Safety Data Sheet (SDS)",
};

export const technicalDocStatusLabel: Record<TechnicalDocStatus, string> = {
  available_on_request: "Available on Request",
};
