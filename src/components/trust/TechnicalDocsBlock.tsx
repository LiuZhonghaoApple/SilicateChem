import Link from "next/link";
import { SectionHeader } from "@/components/ui/Section";
import {
  technicalDocs,
  technicalDocLabels,
  technicalDocStatusLabel,
  type TechnicalDocType,
} from "@/content/trust/technical-docs";

type Props = {
  product?: string;
  compact?: boolean;
  showHeader?: boolean;
  className?: string;
};

const DOC_TYPES: TechnicalDocType[] = ["COA", "TDS", "SDS"];

function requestHref(type: TechnicalDocType, product?: string): string {
  const params = new URLSearchParams({ type: type.toLowerCase() });
  if (product) params.set("product", product);
  return `/contact?${params.toString()}`;
}

export function TechnicalDocsBlock({
  product,
  compact = false,
  showHeader = true,
  className = "",
}: Props) {
  return (
    <div className={className}>
      {showHeader && (
        <SectionHeader
          title="Technical Documents"
          subtitle="COA, TDS, and SDS provided on request — not published as downloadable files."
        />
      )}
      <div className="grid gap-4 sm:grid-cols-3">
        {DOC_TYPES.map((type) => {
          const doc = technicalDocs[type];
          return (
            <div
              key={type}
              className="flex flex-col rounded-lg border border-[#E2E6EA] bg-white p-5"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-[#0B2D5B] text-sm">
                  {technicalDocLabels[type]}
                </h3>
                <span className="shrink-0 rounded bg-[#2E7D9A]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#2E7D9A]">
                  {technicalDocStatusLabel[doc.status]}
                </span>
              </div>
              {!compact && (
                <>
                  <p className="mt-2 text-sm text-[#5A6570] leading-relaxed">
                    {doc.description}
                  </p>
                  <p className="mt-2 text-xs text-[#5A6570]">
                    Applies to: {doc.applicableProducts.join(", ")}.
                  </p>
                </>
              )}
              <Link
                href={requestHref(type, product)}
                className="mt-4 inline-flex items-center justify-center rounded border border-[#0B2D5B] px-4 py-2 text-sm font-bold text-[#0B2D5B] hover:bg-[#0B2D5B] hover:text-white transition-colors"
              >
                Request Document
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
