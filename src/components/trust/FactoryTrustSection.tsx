import Link from "next/link";
import { SectionHeader } from "@/components/ui/Section";
import { factoryTrustPillars, TRUST_PRIMARY_MESSAGE } from "@/content/trust";
import { METASILICATE_CATEGORY_PATH } from "@/lib/seo-keywords";
import { SITE } from "@/lib/constants";

type Props = {
  variant?: "full" | "compact";
  showHeader?: boolean;
  showMoneyPageLink?: boolean;
  className?: string;
};

export function FactoryTrustSection({
  variant = "full",
  showHeader = true,
  showMoneyPageLink = true,
  className = "",
}: Props) {
  const pillars =
    variant === "compact" ? factoryTrustPillars.slice(0, 4) : factoryTrustPillars;

  return (
    <div className={className}>
      {showHeader && (
        <SectionHeader
          title="Factory Trust — Verified Production Capability"
          subtitle={TRUST_PRIMARY_MESSAGE}
        />
      )}
      <p className="text-sm text-[#5A6570] leading-relaxed max-w-3xl">
        {SITE.company} manufactures sodium metasilicate at our Shandong production site.
        The points below are verifiable during factory inspection or sample evaluation.
      </p>
      <div
        className={`mt-6 grid gap-4 ${
          variant === "compact" ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {pillars.map((item) => (
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
        <p className="mt-6 text-sm">
          <Link
            href={METASILICATE_CATEGORY_PATH}
            className="font-semibold text-[#2E7D9A] hover:underline"
          >
            View sodium metasilicate manufacturer page — factory verification & RFQ →
          </Link>
        </p>
      )}
    </div>
  );
}
