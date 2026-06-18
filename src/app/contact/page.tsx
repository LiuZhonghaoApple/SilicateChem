import { PageHeader, PageCTAs } from "@/components/layout/PageHeader";
import { Section, SectionHeader } from "@/components/ui/Section";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import { InquiryFormWrapper } from "@/components/forms/InquiryFormWrapper";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Contact — Request a Quote",
  description:
    "Contact Shandong Zhongzhi Chemical for sodium metasilicate quotes, TDS/MSDS requests, and factory inquiries. Email: info@silicatechem.com",
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
        description="Submit an inquiry for factory-direct pricing, TDS/MSDS documents, or production questions. Our sales team responds within 1–2 business days."
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
              <ul className="mt-4 space-y-3 text-sm text-[#5A6570]">
                <li>
                  <span className="block text-xs font-semibold uppercase text-[#0B2D5B]">Email</span>
                  <a href={`mailto:${SITE.email}`} className="hover:text-[#2E7D9A]">
                    {SITE.email}
                  </a>
                </li>
                <li>
                  <span className="block text-xs font-semibold uppercase text-[#0B2D5B]">WhatsApp</span>
                  <a
                    href={`https://wa.me/${SITE.whatsapp.replace(/[^0-9]/g, "")}`}
                    className="hover:text-[#2E7D9A]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {SITE.whatsapp}
                  </a>
                </li>
                <li>
                  <span className="block text-xs font-semibold uppercase text-[#0B2D5B]">Location</span>
                  {SITE.location}
                </li>
                <li>
                  <span className="block text-xs font-semibold uppercase text-[#0B2D5B]">Company</span>
                  {SITE.company}
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-[#E2E6EA] bg-[#F4F6F8] p-6">
              <h3 className="font-bold text-[#0B2D5B] text-sm">What to Include</h3>
              <ul className="mt-3 space-y-2 text-sm text-[#5A6570]">
                <li>• Product grade (granules, anhydrous, pentahydrate)</li>
                <li>• Required quantity and packaging</li>
                <li>• Destination country / port</li>
                <li>• Specification requirements if any</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
