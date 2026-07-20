import { PageHeader, PageCTAs } from "@/components/layout/PageHeader";
import { Section, SectionHeader } from "@/components/ui/Section";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import { ProductFunnelBanner } from "@/components/seo/FunnelSections";
import { InquiryFormWrapper } from "@/components/forms/InquiryFormWrapper";
import { ContactDirectLinks } from "@/components/contact/ContactDirectLinks";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Contact — Request a Quote",
  description:
    `Contact ${SITE.company} for sodium metasilicate quotations, MSDS, COA, TDS, packing details, and shipment document requests. Email: ${SITE.email}`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE.url },
          { name: "Contact", url: `${SITE.url}/contact` },
        ]}
      />
      <PageHeader
        title="Contact Us"
        description="Send product grade, quantity, packing preference, destination port, application, and required documents. Our team responds within 1–2 business days."
        breadcrumbs={[{ label: "Contact" }]}
      />

      <Section>
        <PageCTAs className="mb-10" />

        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <SectionHeader title="Send an Inquiry" />
            <InquiryFormWrapper />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-lg border border-[#E2E6EA] p-6">
              <h3 className="font-bold text-[#0B2D5B]">Direct Contact</h3>
              <ContactDirectLinks />
            </div>

            <div className="rounded-lg border border-[#E2E6EA] bg-[#F4F6F8] p-6">
              <h3 className="font-bold text-[#0B2D5B] text-sm">What to Include</h3>
              <ul className="mt-3 space-y-2 text-sm text-[#5A6570]">
                <li>• Product grade and form</li>
                <li>• Required quantity and packing preference</li>
                <li>• Destination country / port</li>
                <li>• Application and specification requirements</li>
                <li>• Required documents such as MSDS, TDS, COA, or certificates</li>
              </ul>
            </div>
          </div>
        </div>
        <ProductFunnelBanner className="mt-10" />
      </Section>
    </>
  );
}
