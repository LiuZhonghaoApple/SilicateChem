import { PageHeader, PageCTAs } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { FAQSchema, BreadcrumbSchema } from "@/components/seo/JsonLd";
import { InternalProductLinks } from "@/components/seo/InternalProductLinks";
import { ProductFunnelBanner } from "@/components/seo/FunnelSections";
import { faqItems } from "@/content/faq";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Frequently Asked Questions",
  description:
    "FAQ for B2B buyers sourcing sodium metasilicate. Grade selection, specifications, packaging, MSDS, COA, documents, MOQ, and quotation information.",
  path: "/faq",
});

export default function FAQPage() {
  return (
    <>
      <FAQSchema items={faqItems} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE.url },
          { name: "FAQ", url: `${SITE.url}/faq` },
        ]}
      />
      <PageHeader
        title="Frequently Asked Questions"
        description="Common sodium metasilicate procurement questions covering grades, forms, specifications, documents, packaging, shipment details, and RFQ requirements."
        breadcrumbs={[{ label: "FAQ" }]}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 max-w-3xl space-y-6">
          {faqItems.map((item) => (
            <details
              key={item.question}
              className="group rounded-lg border border-[#E2E6EA] bg-white"
            >
              <summary className="cursor-pointer px-5 py-4 font-semibold text-[#0B2D5B] list-none flex justify-between items-center">
                {item.question}
                <span className="ml-4 text-[#2E7D9A] group-open:rotate-45 transition-transform text-xl leading-none">
                  +
                </span>
              </summary>
              <div className="px-5 pb-4 text-sm text-[#5A6570] leading-relaxed border-t border-[#E2E6EA] pt-3">
                {item.answer}
              </div>
            </details>
          ))}
          </div>
          <InternalProductLinks title="Product Pages" />
        </div>
        <ProductFunnelBanner className="mt-10" />
        <PageCTAs className="mt-6" />
      </Section>
    </>
  );
}
