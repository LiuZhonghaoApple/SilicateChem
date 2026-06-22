import Link from "next/link";
import { SectionHeader } from "@/components/ui/Section";
import { VisualProofPlaceholder } from "@/components/trust/VisualProofPlaceholder";
import {
  EXPORT_COUNTRIES,
  EXPORT_DATA_DISCLAIMER,
  EXPORT_MAP_TITLE,
  EXPORT_PREVIEW_COUNTRY_COUNT,
  EXPORT_SHIPMENT_STATS_PANEL,
  EXPORT_SHIPMENT_STATS_PANEL_TITLE,
  formatExportStatValue,
  LOGISTICS_SIGNALS,
  LOGISTICS_SIGNALS_TITLE,
} from "@/content/trust/export-countries";

type Props = {
  variant?: "full" | "preview";
  showHeader?: boolean;
  className?: string;
};

function WorldMapSvg() {
  return (
    <svg
      viewBox="0 0 360 180"
      className="w-full h-auto"
      aria-label="Simplified world map highlighting verified export destination countries"
      role="img"
    >
      <rect width="360" height="180" fill="#E8EDF2" rx="4" />
      <ellipse cx="78" cy="62" rx="42" ry="28" fill="#D0D8E0" />
      <ellipse cx="88" cy="108" rx="22" ry="32" fill="#D0D8E0" />
      <ellipse cx="168" cy="52" rx="28" ry="22" fill="#D0D8E0" />
      <ellipse cx="228" cy="72" rx="48" ry="32" fill="#D0D8E0" />
      <ellipse cx="268" cy="118" rx="18" ry="14" fill="#D0D8E0" />
      {EXPORT_COUNTRIES.map((country) => (
        <g key={country.code}>
          <circle
            cx={country.map.x}
            cy={country.map.y}
            r="10"
            fill="#2E7D9A"
            opacity="0.25"
          />
          <circle cx={country.map.x} cy={country.map.y} r="5" fill="#0B2D5B" />
        </g>
      ))}
    </svg>
  );
}

function ExportShipmentStatsPanel({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`rounded-lg border border-[#E2E6EA] bg-[#F4F6F8] ${
        compact ? "p-4" : "p-5 md:p-6"
      }`}
    >
      <h3 className="text-sm font-bold text-[#0B2D5B]">
        {EXPORT_SHIPMENT_STATS_PANEL_TITLE}
      </h3>
      <dl className="mt-3 space-y-2">
        {EXPORT_SHIPMENT_STATS_PANEL.map((row) => (
          <div
            key={row.key}
            className="flex items-baseline justify-between gap-4 text-sm"
          >
            <dt className="text-[#5A6570]">{row.label}</dt>
            <dd className="font-semibold text-[#0B2D5B] shrink-0">
              {formatExportStatValue(row.key)}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs text-[#5A6570] italic">{EXPORT_DATA_DISCLAIMER}</p>
    </div>
  );
}

function LogisticsSignalsBlock({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`rounded-lg border border-[#E2E6EA] bg-white ${
        compact ? "p-4" : "p-5 md:p-6"
      }`}
    >
      <h3 className="text-sm font-bold text-[#0B2D5B]">{LOGISTICS_SIGNALS_TITLE}</h3>
      <ul className="mt-3 space-y-2">
        {LOGISTICS_SIGNALS.map((signal) => (
          <li key={signal} className="flex items-start gap-2 text-sm text-[#5A6570]">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#2E7D9A] shrink-0" />
            {signal}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ExportProofMap({
  variant = "full",
  showHeader = true,
  className = "",
}: Props) {
  const listCountries =
    variant === "preview"
      ? EXPORT_COUNTRIES.slice(0, EXPORT_PREVIEW_COUNTRY_COUNT)
      : EXPORT_COUNTRIES;

  return (
    <div className={className}>
      {showHeader && (
        <SectionHeader title={EXPORT_MAP_TITLE} subtitle={EXPORT_DATA_DISCLAIMER} />
      )}

      <div className="grid gap-8 lg:grid-cols-2 items-start">
        <div className="space-y-4">
          <div className="rounded-lg border border-[#E2E6EA] bg-white p-4">
            <WorldMapSvg />
            <p className="mt-3 text-xs text-[#5A6570]">{EXPORT_DATA_DISCLAIMER}</p>
          </div>
          <ExportShipmentStatsPanel compact={variant === "preview"} />
          <LogisticsSignalsBlock compact={variant === "preview"} />
        </div>

        <div>
          <p className="text-sm font-semibold text-[#0B2D5B] mb-3">
            {EXPORT_COUNTRIES.length} verified destination countries
          </p>
          <ul className="space-y-2">
            {listCountries.map((country) => (
              <li
                key={country.code}
                className="flex items-center justify-between rounded border border-[#E2E6EA] bg-white px-4 py-2.5 text-sm"
              >
                <span className="font-medium text-[#0B2D5B]">{country.name}</span>
                <span className="text-xs text-[#5A6570]">
                  {country.region}
                  {variant === "full" && ` · ${country.records} records`}
                </span>
              </li>
            ))}
          </ul>
          {variant === "preview" && (
            <>
              <p className="mt-3 text-xs text-[#5A6570]">
                + {EXPORT_COUNTRIES.length - EXPORT_PREVIEW_COUNTRY_COUNT} more countries
                in full export proof
              </p>
              <Link
                href="/export"
                className="mt-3 inline-block text-sm font-bold text-[#2E7D9A] hover:underline"
              >
                View full export coverage →
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="mt-8">
        <p className="text-sm font-semibold text-[#0B2D5B] mb-3">
          Export shipment visual proof
        </p>
        <VisualProofPlaceholder compact />
      </div>
    </div>
  );
}
