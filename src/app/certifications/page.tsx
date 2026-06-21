import Link from "next/link";
import { PageCTAs } from "@/components/layout/PageHeader";
import { Section, SectionHeader } from "@/components/ui/Section";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import { CertificatePlaceholder } from "@/components/trust/CertificatePlaceholder";
import { CertificateSection } from "@/components/trust/CertificateSection";
import { TrustStack } from "@/components/trust/TrustStack";
import {
  ASSOCIATION_MEMBERSHIP,
  INDUSTRY_HONORS,
  RD_RECOGNITION,
  TECHNICAL_CERTIFICATIONS_PLACEHOLDER,
  CERTIFICATE_IMAGE_NOTE,
} from "@/content/trust/certifications";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Certifications & Industry Honors",
  description:
    "Industry honors, association membership, and R&D recognition for Shandong Zhongzhi Chemical Technology. ISO certificates not in verified sources — contact for compliance docs.",
  path: "/certifications",
});

export default function CertificationsPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE.url },
          { name: "Certifications", url: `${SITE.url}/certifications` },
        ]}
      />

      <div className="border-b border-[#E2E6EA] bg-[#0B2D5B] text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#2E7D9A]">
            {SITE.company}
          </p>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight max-w-4xl">
            Certifications & Industry Honors
          </h1>
          <p className="mt-4 text-base md:text-lg text-blue-100 max-w-3xl leading-relaxed">
            Documented honors and association membership from corporate records. Certificate
            scans pending in website asset pack — no ISO certificate files in verified sources.
          </p>
        </div>
      </div>

      <Section>
        <SectionHeader
          title="Trust Stack"
          subtitle="How factory, export, product, and compliance signals connect."
        />
        <TrustStack />
      </Section>

      <Section id="certificate-gallery">
        <CertificateSection />
      </Section>

      <Section background="grey" id="industry-honors">
        <SectionHeader
          title="Industry Honors"
          subtitle="Verified honor titles from lgwjg corporate materials (INV about.asp, tec.asp)."
        />
        <p className="text-sm text-[#5A6570] mb-6">{CERTIFICATE_IMAGE_NOTE}</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRY_HONORS.map((honor) => (
            <div key={honor.title}>
              <CertificatePlaceholder title={honor.title} subtitle={honor.subtitle} />
              {honor.year && (
                <p className="mt-2 text-xs text-[#5A6570] text-center">{honor.year}</p>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section id="association">
        <SectionHeader
          title="Association Membership"
          subtitle="Verified industry association membership from corporate about page."
        />
        <div className="grid gap-6 lg:grid-cols-2 items-start">
          <CertificatePlaceholder
            title={ASSOCIATION_MEMBERSHIP.title}
            subtitle={ASSOCIATION_MEMBERSHIP.role}
          />
          <div className="rounded-lg border border-[#E2E6EA] bg-[#F4F6F8] p-6">
            <h3 className="font-bold text-[#0B2D5B]">{ASSOCIATION_MEMBERSHIP.title}</h3>
            <p className="mt-2 text-sm text-[#5A6570]">{ASSOCIATION_MEMBERSHIP.role}</p>
            <p className="mt-4 text-xs text-[#5A6570]">Source: {ASSOCIATION_MEMBERSHIP.source}</p>
          </div>
        </div>
      </Section>

      <Section background="grey" id="technical-certifications">
        <SectionHeader
          title="Technical Certifications"
          subtitle="ISO and QMS certificate status from verified source audit."
        />
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 max-w-3xl">
          <h3 className="font-bold text-amber-900 text-sm">
            {TECHNICAL_CERTIFICATIONS_PLACEHOLDER.title}
          </h3>
          <p className="mt-2 text-sm text-amber-900/80 leading-relaxed">
            {TECHNICAL_CERTIFICATIONS_PLACEHOLDER.note}
          </p>
        </div>
        <CertificatePlaceholder
          title={TECHNICAL_CERTIFICATIONS_PLACEHOLDER.title}
          subtitle="Not available in verified sources"
          className="mt-6 max-w-md"
        />
      </Section>

      <Section id="rd-recognition">
        <SectionHeader
          title="R&D Recognition"
          subtitle="Science and technology progress awards documented on historical corporate site."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {RD_RECOGNITION.map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-[#E2E6EA] bg-white p-5"
            >
              <h3 className="font-bold text-[#0B2D5B] text-sm">{item.title}</h3>
              <p className="mt-2 text-xs text-[#5A6570]">Source: {item.source}</p>
            </div>
          ))}
        </div>
        <PageCTAs className="mt-10" />
      </Section>

      <Section background="blue">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Request Compliance Documentation</h2>
          <p className="mt-3 text-blue-100 max-w-2xl mx-auto">
            COA, TDS, and SDS available on request. Contact us for current compliance package details.
          </p>
          <Link
            href="/contact?type=tds"
            className="mt-6 inline-flex items-center justify-center rounded bg-white px-6 py-3 text-sm font-bold text-[#0B2D5B] hover:bg-blue-50"
          >
            Request Documents
          </Link>
        </div>
      </Section>
    </>
  );
}
