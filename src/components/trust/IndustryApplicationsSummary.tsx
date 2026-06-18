import Link from "next/link";
import { SectionHeader } from "@/components/ui/Section";
import { sodiumMetasilicateCategory } from "@/content/sodium-metasilicate-category";
import { METASILICATE_CATEGORY_PATH } from "@/lib/seo-keywords";

export function IndustryApplicationsSummary({ className = "" }: { className?: string }) {
  const industries = sodiumMetasilicateCategory.industryProof;

  return (
    <div className={className}>
      <SectionHeader
        title="Industry Applications"
        subtitle="Factory-direct sodium metasilicate supply by sector."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {industries.map((item) => (
          <div
            key={item.path}
            className="flex items-start justify-between gap-3 rounded-lg border border-[#E2E6EA] bg-white px-4 py-3"
          >
            <div>
              <p className="font-semibold text-[#0B2D5B] text-sm">{item.industry}</p>
              <p className="mt-1 text-xs text-[#5A6570]">{item.proof}</p>
            </div>
            <Link
              href={item.path}
              className="text-xs font-semibold text-[#2E7D9A] hover:underline shrink-0"
            >
              Use case →
            </Link>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm">
        <Link
          href={METASILICATE_CATEGORY_PATH}
          className="font-semibold text-[#0B2D5B] hover:text-[#2E7D9A] hover:underline"
        >
          All grades & factory RFQ on manufacturer page →
        </Link>
      </p>
    </div>
  );
}
