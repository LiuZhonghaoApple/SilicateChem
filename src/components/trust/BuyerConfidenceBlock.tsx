import Link from "next/link";
import { SectionHeader } from "@/components/ui/Section";
import { buyerConfidencePoints, TRUST_PRIMARY_MESSAGE } from "@/content/trust";
import { METASILICATE_CATEGORY_PATH } from "@/lib/seo-keywords";

type Props = {
  showHeader?: boolean;
  showMoneyPageLink?: boolean;
  className?: string;
};

export function BuyerConfidenceBlock({
  showHeader = true,
  showMoneyPageLink = true,
  className = "",
}: Props) {
  return (
    <div className={className}>
      {showHeader && (
        <SectionHeader
          title="Buyer Confidence"
          subtitle="Industrial procurement factors — capacity, quality stability, and export support."
        />
      )}
      <p className="text-sm font-medium text-[#0B2D5B] max-w-3xl">{TRUST_PRIMARY_MESSAGE}</p>
      <div className="mt-6 space-y-4">
        {buyerConfidencePoints.map((item) => (
          <div
            key={item.title}
            className="rounded-lg border border-[#E2E6EA] bg-white p-5"
          >
            <h3 className="font-bold text-[#0B2D5B] text-sm">{item.title}</h3>
            <p className="mt-2 text-sm text-[#5A6570] leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
      {showMoneyPageLink && (
        <div className="mt-6 rounded-lg border border-[#2E7D9A]/30 bg-[#2E7D9A]/5 p-5">
          <p className="text-sm text-[#5A6570]">
            Ready to verify specifications? Submit RFQ with grade, quantity, and destination port.
          </p>
          <Link
            href={METASILICATE_CATEGORY_PATH}
            className="mt-3 inline-block text-sm font-bold text-[#2E7D9A] hover:underline"
          >
            Sodium metasilicate — factory-direct quotation →
          </Link>
        </div>
      )}
    </div>
  );
}
