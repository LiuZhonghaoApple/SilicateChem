import { SectionHeader } from "@/components/ui/Section";
import { StrongCTA } from "@/components/conversion/ProductConversionSections";
import {
  factoryTrustSections,
  type FactoryTrustSectionContent,
} from "@/content/factory-trust";
import { SITE } from "@/lib/constants";

type Props = {
  variant?: "full" | "light";
  showHeader?: boolean;
  product?: string;
  className?: string;
};

function TrustSectionBlock({
  section,
  variant,
  product,
}: {
  section: FactoryTrustSectionContent;
  variant: "full" | "light";
  product?: string;
}) {
  const items =
    variant === "light" ? section.items.slice(0, 2) : section.items;

  return (
    <div className="rounded-lg border border-[#E2E6EA] bg-white p-6">
      <h3 className="text-lg font-bold text-[#0B2D5B]">{section.title}</h3>
      <p className="mt-2 text-sm text-[#5A6570] leading-relaxed">{section.subtitle}</p>
      <div
        className={`mt-4 grid gap-3 ${
          variant === "light" ? "sm:grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded border border-[#E2E6EA] bg-[#F4F6F8] p-4"
          >
            <h4 className="font-bold text-[#0B2D5B] text-sm">{item.title}</h4>
            <p className="mt-2 text-sm text-[#5A6570] leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
      <StrongCTA product={product} className="mt-5" />
    </div>
  );
}

export function FactoryTrustSystem({
  variant = "full",
  showHeader = true,
  product,
  className = "",
}: Props) {
  const sections =
    variant === "light"
      ? factoryTrustSections.slice(0, 2)
      : factoryTrustSections;

  return (
    <div className={className}>
      {showHeader && (
        <SectionHeader
          title="Factory Trust — Verified Production Capability"
          subtitle={`${SITE.company} manufactures sodium metasilicate at our Shandong production site with export-ready documentation.`}
        />
      )}
      <div className="space-y-6">
        {sections.map((section) => (
          <TrustSectionBlock
            key={section.id}
            section={section}
            variant={variant}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}
