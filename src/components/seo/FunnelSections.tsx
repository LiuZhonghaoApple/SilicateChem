import Link from "next/link";
import { METASILICATE_CATEGORY_PATH } from "@/lib/seo-keywords";

export function ProductFunnelBanner({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-2xl border border-[#D7E6EF] bg-[#F4F8FB] p-6 ${className}`}>
      <h3 className="text-lg font-bold text-[#0B2D5B]">
        Continue to Sodium Metasilicate Specifications
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[#5A6570]">
        Review grades, forms, key buying specs, available documents, and RFQ
        information before requesting quotation.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Link
          href={METASILICATE_CATEGORY_PATH}
          className="inline-flex items-center justify-center rounded bg-[#0B2D5B] px-5 py-3 text-sm font-bold text-white hover:bg-[#071F3F]"
        >
          View Product Specifications
        </Link>
        <Link
          href="/contact?type=quote&product=Sodium%20Metasilicate"
          className="inline-flex items-center justify-center rounded border border-[#0B2D5B] px-5 py-3 text-sm font-bold text-[#0B2D5B] hover:bg-white"
        >
          Request Quote
        </Link>
      </div>
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
