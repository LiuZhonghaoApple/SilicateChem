/** Verified destination countries from partial customs records (Jul 2023–Jun 2026). */
export const EXPORT_COUNTRIES = [
  { code: "US", name: "USA", region: "North America", records: 106, map: { x: 72, y: 58 } },
  { code: "CA", name: "Canada", region: "North America", records: 1, map: { x: 68, y: 42 } },
  { code: "MX", name: "Mexico", region: "North America", records: 6, map: { x: 62, y: 72 } },
  { code: "EC", name: "Ecuador", region: "South America", records: 34, map: { x: 88, y: 98 } },
  { code: "BD", name: "Bangladesh", region: "South Asia", records: 53, map: { x: 228, y: 78 } },
  { code: "VN", name: "Vietnam", region: "Southeast Asia", records: 24, map: { x: 248, y: 88 } },
  { code: "PK", name: "Pakistan", region: "South Asia", records: 26, map: { x: 210, y: 68 } },
  { code: "UZ", name: "Uzbekistan", region: "Central Asia", records: 4, map: { x: 218, y: 52 } },
] as const;

export const EXPORT_MAP_TITLE =
  "Global Export Coverage (Based on Verified Customs Records)";

export const EXPORT_DATA_DISCLAIMER =
  "Based on partial customs shipment data (not full export records)";

export const EXPORT_SHIPMENT_STATS = {
  totalRecords: 254,
  documentedWeightMt: 8903,
  recordsOver20Mt: 227,
  uniqueBlNumbers: 99,
  qingdaoDepartures: 95,
} as const;

/** Rows rendered in Export Shipment Stats Panel — values from EXPORT_SHIPMENT_STATS only. */
export const EXPORT_SHIPMENT_STATS_PANEL = [
  { key: "totalRecords" as const, label: "Total customs shipment records" },
  { key: "documentedWeightMt" as const, label: "Documented weight (MT)" },
  { key: "recordsOver20Mt" as const, label: "Records ≥ 20 MT" },
  { key: "qingdaoDepartures" as const, label: "Qingdao port departures" },
] as const;

export const EXPORT_SHIPMENT_STATS_PANEL_TITLE = "Export Shipment Stats";

export const LOGISTICS_SIGNALS_TITLE = "Logistics Signals";

export const VERIFIED_PACKAGING = [
  "25 kg woven/PP bags (documented in customs goods descriptions)",
  "Bulk container loads — 80 MT and 100 MT declared totals in selected US anhydrous records",
] as const;

export const LOGISTICS_SIGNALS = [
  "Qingdao port departures in 95 available customs records",
  "Bill of lading references in 168 records (99 unique BL numbers)",
  "HS classification 283911 series in 147 records",
  "Containerized shipments (CY/CY) referenced in 20 records",
  "UN 3253 Class 8 dangerous-goods notation in 67 records",
] as const;

export const EXPORT_PREVIEW_COUNTRY_COUNT = 4;

export function formatExportStatValue(
  key: (typeof EXPORT_SHIPMENT_STATS_PANEL)[number]["key"]
): string {
  const value = EXPORT_SHIPMENT_STATS[key];
  if (key === "documentedWeightMt") {
    return `~${value.toLocaleString()}`;
  }
  return String(value);
}
