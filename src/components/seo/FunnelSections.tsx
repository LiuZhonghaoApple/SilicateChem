import Link from "next/link";
import { StrongCTA } from "@/components/conversion/ProductConversionSections";
import { SITE } from "@/lib/constants";
import { METASILICATE_CATEGORY_PATH } from "@/lib/seo-keywords";
import { sodiumMetasilicateCategory } from "@/content/sodium-metasilicate-category";

export function ProductFunnelBanner({ className = "" }: { className?: string }) {
  const product = sodiumMetasilicateCategory.inquiryProductName;
  return (
    <div className={`rounded-lg border border-[#2E7D9A]/30 bg-[#2E7D9A]/5 p-6 ${className}`}>
      <h3 className="font-bold text-[#0B2D5B]">Source Sodium Metasilicate Factory-Direct</h3>
      <p className="mt-2 text-sm text-[#5A6570] leading-relaxed">
        {SITE.company} manufactures all grades at our China facility.
        View specifications, grades, and request factory-direct quotation.
      </p>
      <div className="mt-4 flex flex-wrap gap-4">
        <Link
          href={METASILICATE_CATEGORY_PATH}
          className="text-sm font-semibold text-[#2E7D9A] hover:underline"
        >
          Sodium metasilicate manufacturer & supplier →
        </Link>
      </div>
      <StrongCTA product={product} className="mt-4" />
    </div>
  );
}

export function FAQBlock({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details key={item.question} className="group rounded-lg border border-[#E2E6EA] bg-white">
          <summary className="cursor-pointer px-5 py-3 font-semibold text-[#0B2D5B] text-sm list-none">
            {item.question}
          </summary>
          <div className="px-5 pb-3 text-sm text-[#5A6570] border-t border-[#E2E6EA] pt-2">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  );
}
