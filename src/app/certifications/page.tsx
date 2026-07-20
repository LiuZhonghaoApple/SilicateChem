import Image from "next/image";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/Section";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import {
  ASSOCIATION_MEMBERSHIP,
  INDUSTRY_HONORS,
  RD_RECOGNITION,
} from "@/content/trust/certifications";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Certifications, Compliance Documents & Industry Honors",
  description:
    "Download available Zhongzhi compliance documents including business license, ISO certificates, REACH certificate, customs registration, MSDS files, and product brochure.",
  path: "/certifications",
});

const complianceDocuments = [
  {
    title: "Business License",
    href: "/downloads/documents/business-license.jpg",
    type: "JPG",
    note: "Company registration document",
  },
  {
    title: "ISO 9001 Certificate",
    href: "/downloads/documents/iso-9001-certificate.pdf",
    type: "PDF",
    note: "Quality management system certificate",
  },
  {
    title: "ISO 14001 Certificate — English",
    href: "/downloads/documents/iso-14001-certificate-en.pdf",
    type: "PDF",
    note: "Environmental management certificate",
  },
  {
    title: "ISO 14001 Certificate — Chinese",
    href: "/downloads/documents/iso-14001-certificate-cn.pdf",
    type: "PDF",
    note: "Chinese certificate file",
  },
  {
    title: "REACH Certificate",
    href: "/downloads/documents/reach-certificate.pdf",
    type: "PDF",
    note: "Chemical compliance document",
  },
  {
    title: "Customs Registration",
    href: "/downloads/documents/customs-registration.pdf",
    type: "PDF",
    note: "Export customs registration document",
  },
] as const;

const productDocuments = [
  {
    title: "MSDS — Anhydrous Sodium Metasilicate EN",
    href: "/downloads/documents/msds-anhydrous-sodium-metasilicate-en.pdf",
  },
  {
    title: "MSDS — Anhydrous Sodium Metasilicate CN",
    href: "/downloads/documents/msds-anhydrous-sodium-metasilicate-cn.pdf",
  },
  {
    title: "MSDS — Sodium Metasilicate Pentahydrate EN",
    href: "/downloads/documents/msds-sodium-metasilicate-pentahydrate-en.pdf",
  },
  {
    title: "MSDS — Sodium Metasilicate Pentahydrate CN",
    href: "/downloads/documents/msds-sodium-metasilicate-pentahydrate-cn.pdf",
  },
  {
    title: "Zhongzhi Product Brochure",
    href: "/downloads/documents/zhongzhi-product-brochure-v2.pdf",
  },
] as const;

function DocumentCard({
  title,
  href,
  type,
  note,
}: {
  title: string;
  href: string;
  type?: string;
  note?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex min-h-full flex-col rounded-2xl border border-[#D7E6EF] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#2E7D9A] hover:shadow-lg"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="rounded-full bg-[#EAF4FA] px-3 py-1 text-xs font-bold text-[#0B2D5B]">
          {type ?? "PDF"}
        </span>
        <span className="text-sm font-bold text-[#2E7D9A]">Open →</span>
      </div>
      <h3 className="mt-4 text-base font-bold leading-snug text-[#0B2D5B]">
        {title}
      </h3>
      {note && <p className="mt-2 text-sm leading-relaxed text-[#5A6570]">{note}</p>}
    </Link>
  );
}

export default function CertificationsPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE.url },
          { name: "Certifications", url: `${SITE.url}/certifications` },
        ]}
      />

      <div className="border-b border-[#D7E6EF] bg-[#0B2D5B] text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#8ED3E8]">
            Compliance Documents
          </p>
          <h1 className="mt-3 max-w-4xl text-3xl font-bold tracking-tight md:text-4xl">
            Certifications, Documents & Industry Honors
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-blue-100 md:text-lg">
            Review available Zhongzhi company documents, ISO certificates, REACH
            certificate, customs registration, MSDS files, product brochure, and
            documented industry honors.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/downloads"
              className="inline-flex items-center justify-center rounded bg-white px-6 py-3 text-sm font-bold text-[#0B2D5B] hover:bg-blue-50"
            >
              Open Download Center
            </Link>
            <Link
              href="/contact?type=quote&product=Sodium%20Metasilicate"
              className="inline-flex items-center justify-center rounded border border-white px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
            >
              Request COA / TDS / SDS
            </Link>
          </div>
        </div>
      </div>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="overflow-hidden rounded-2xl border border-[#D7E6EF] bg-white shadow-sm">
            <Image
              src="/downloads/documents/business-license.jpg"
              alt="Zhongzhi business license document"
              width={1696}
              height={1204}
              className="h-auto w-full"
              priority
            />
          </div>
          <div>
            <SectionHeader
              title="Available Compliance Files"
              subtitle="The files below are already available in the website download center. Batch-specific COA, TDS and shipment documents should still be requested according to order requirements."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {complianceDocuments.map((document) => (
                <DocumentCard key={document.href} {...document} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section background="grey">
        <SectionHeader
          title="Product Safety & Brochure Documents"
          subtitle="Use these files for initial buyer review. For order-specific COA and TDS, submit a document request with product grade and quantity."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {productDocuments.map((document) => (
            <DocumentCard key={document.href} {...document} />
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          title="Industry Honors & Association Membership"
          subtitle="Recognition records from historical corporate materials are retained as business background, not as substitutes for current shipment documents."
        />
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-2xl border border-[#D7E6EF] bg-[#F4F8FB] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2E7D9A]">
              Association Membership
            </p>
            <h3 className="mt-3 text-xl font-bold text-[#0B2D5B]">
              {ASSOCIATION_MEMBERSHIP.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#5A6570]">
              {ASSOCIATION_MEMBERSHIP.role}
            </p>
            <p className="mt-4 text-xs text-[#5A6570]">
              Source: {ASSOCIATION_MEMBERSHIP.source}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {INDUSTRY_HONORS.map((honor) => (
              <div
                key={honor.title}
                className="rounded-2xl border border-[#D7E6EF] bg-white p-5 shadow-sm"
              >
                <h3 className="text-sm font-bold leading-snug text-[#0B2D5B]">
                  {honor.title}
                </h3>
                {honor.subtitle && (
                  <p className="mt-2 text-xs leading-relaxed text-[#5A6570]">
                    {honor.subtitle}
                  </p>
                )}
                {honor.year && (
                  <p className="mt-3 text-xs font-bold text-[#2E7D9A]">
                    {honor.year}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section background="grey">
        <SectionHeader
          title="R&D Recognition"
          subtitle="Historical science and technology recognition records are listed for buyer background review."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RD_RECOGNITION.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[#D7E6EF] bg-white p-5 shadow-sm"
            >
              <h3 className="text-sm font-bold leading-snug text-[#0B2D5B]">
                {item.title}
              </h3>
              <p className="mt-3 text-xs text-[#5A6570]">Source: {item.source}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section background="blue">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">
            Need order-specific compliance documents?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-blue-100">
            Send product grade, quantity, destination and required document type.
            We can confirm available MSDS, COA, TDS and export document support.
          </p>
          <Link
            href="/contact?type=tds&product=Sodium%20Metasilicate"
            className="mt-6 inline-flex items-center justify-center rounded bg-white px-6 py-3 text-sm font-bold text-[#0B2D5B] hover:bg-blue-50"
          >
            Request Documents
          </Link>
        </div>
      </Section>
    </>
  );
}
