import Link from "next/link";
import { EXPORT_DATA_DISCLAIMER } from "@/content/trust/export-countries";
import { FACTORY_VERIFICATION_BADGE } from "@/content/trust/factory-proof";
import { SPEC_DISCLAIMER } from "@/content/trust/product-trust";

const TRUST_LAYERS = [
  {
    id: "factory",
    title: "Factory Verified",
    status: "verified" as const,
    description: `${FACTORY_VERIFICATION_BADGE.description} 100,000 MT stated capacity · 438 equipment sets · 83 employees (QCC 2025).`,
    href: "/factory",
  },
  {
    id: "export",
    title: "Export Verified",
    status: "partial" as const,
    description: `Partial customs data: 8 destination countries documented (Jul 2023–Jun 2026). ${EXPORT_DATA_DISCLAIMER}`,
    href: "/export",
  },
  {
    id: "product",
    title: "Product Verified",
    status: "partial" as const,
    description: `Product taxonomy and CAS references verified in trade data. ${SPEC_DISCLAIMER}`,
    href: "/products",
  },
  {
    id: "compliance",
    title: "Compliance Available",
    status: "on_request" as const,
    description:
      "COA, TDS, and SDS available on request. Industry honors documented; ISO certificate files not in verified sources.",
    href: "/certifications",
  },
] as const;

type Props = {
  compact?: boolean;
  className?: string;
};

const statusStyles = {
  verified: "bg-[#2E7D9A]/10 text-[#2E7D9A] border-[#2E7D9A]/30",
  partial: "bg-amber-50 text-amber-800 border-amber-200",
  on_request: "bg-[#F4F6F8] text-[#5A6570] border-[#E2E6EA]",
};

const statusLabels = {
  verified: "Verified",
  partial: "Partial Data",
  on_request: "On Request",
};

export function TrustStack({ compact = false, className = "" }: Props) {
  return (
    <div className={className}>
      <div className={`grid gap-3 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
        {TRUST_LAYERS.map((layer) => (
          <Link
            key={layer.id}
            href={layer.href}
            className="group rounded-lg border border-[#E2E6EA] bg-white p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-bold text-[#0B2D5B] text-sm group-hover:text-[#2E7D9A]">
                {layer.title}
              </h3>
              <span
                className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase border ${statusStyles[layer.status]}`}
              >
                {statusLabels[layer.status]}
              </span>
            </div>
            {!compact && (
              <p className="text-xs text-[#5A6570] leading-relaxed">{layer.description}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
