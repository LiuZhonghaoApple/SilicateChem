import { SectionHeader } from "@/components/ui/Section";
import { DeploymentImageGrid } from "@/components/trust/HomepageRealImages";
import {
  EXPORT_SHIPMENT_STATS,
  EXPORT_DATA_DISCLAIMER,
} from "@/content/trust/export-countries";
import { siteImages } from "@/content/site-images";

export function ExportShipmentEvidence({ className = "" }: { className?: string }) {
  const stats = [
    {
      label: "Documented Records",
      value: EXPORT_SHIPMENT_STATS.totalRecords.toLocaleString(),
    },
    {
      label: "Documented Weight",
      value: `~${EXPORT_SHIPMENT_STATS.documentedWeightMt.toLocaleString()} MT`,
    },
    {
      label: "Consignments ≥ 20 MT",
      value: EXPORT_SHIPMENT_STATS.recordsOver20Mt.toLocaleString(),
    },
    {
      label: "Unique BL Numbers",
      value: EXPORT_SHIPMENT_STATS.uniqueBlNumbers.toLocaleString(),
    },
  ];

  return (
    <div className={className}>
      <SectionHeader
        title="Shipment Evidence"
        subtitle="Customs-based export activity signals from available trade records."
      />
      <p className="text-sm text-[#5A6570] mb-6">{EXPORT_DATA_DISCLAIMER}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-[#E2E6EA] bg-white p-5 text-center"
          >
            <p className="text-2xl font-bold text-[#0B2D5B]">{stat.value}</p>
            <p className="mt-1 text-xs font-bold uppercase text-[#2E7D9A]">{stat.label}</p>
          </div>
        ))}
      </div>
      <ul className="mt-8 space-y-2 max-w-3xl">
        <li className="flex items-start gap-2 text-sm text-[#5A6570]">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#2E7D9A] shrink-0" />
          Export records indicate supply to industrial buyers, chemical distributors, and regional trading companies.
        </li>
        <li className="flex items-start gap-2 text-sm text-[#5A6570]">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#2E7D9A] shrink-0" />
          Documented shipments in each year from 2023 through 2025, plus partial 2026 data in file.
        </li>
        <li className="flex items-start gap-2 text-sm text-[#5A6570]">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#2E7D9A] shrink-0" />
          HS code 283911 series and CAS-identified product descriptions in customs goods fields.
        </li>
      </ul>
      <div className="mt-8">
        <p className="text-sm font-semibold text-[#0B2D5B] mb-3">
          Documented export loading
        </p>
        <DeploymentImageGrid
          images={siteImages.export.shipping}
          columns="sm:grid-cols-3"
          component="ExportShipmentEvidence"
        />
      </div>
    </div>
  );
}
