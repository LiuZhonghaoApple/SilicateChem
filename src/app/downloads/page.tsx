import Link from "next/link";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import { Section, SectionHeader } from "@/components/ui/Section";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Sodium Metasilicate Certificates & MSDS",
  description:
    "Download certificates, MSDS, product documents, and company credentials for supplier review and sodium metasilicate procurement.",
  path: "/downloads",
});

type DownloadDocument = {
  title: string;
  description: string;
  label: string;
  href: string;
};

type DownloadCategory = {
  title: string;
  description: string;
  documents: DownloadDocument[];
};

const downloadCategories: DownloadCategory[] = [
  {
    title: "Certificates",
    description:
      "ISO certifications and REACH registration for supplier qualification and compliance review.",
    documents: [
      {
        title: "ISO 9001:2015 Certificate",
        description: "Chinese & English · Supplier qualification",
        label: "ISO",
        href: "/downloads/documents/iso-9001-certificate.pdf",
      },
      {
        title: "ISO 14001 Certificate - Chinese",
        description: "Environmental management system · Chinese",
        label: "ISO",
        href: "/downloads/documents/iso-14001-certificate-cn.pdf",
      },
      {
        title: "ISO 14001 Certificate - English",
        description: "Environmental management system · English",
        label: "ISO",
        href: "/downloads/documents/iso-14001-certificate-en.pdf",
      },
      {
        title: "REACH Registration",
        description: "Disodium metasilicate · EC 229-912-9 · CAS 6834-92-0",
        label: "REACH",
        href: "/downloads/documents/reach-certificate.pdf",
      },
    ],
  },
  {
    title: "Technical Documents",
    description:
      "MSDS and product documents for product evaluation, internal review, and safe handling.",
    documents: [
      {
        title: "MSDS - Sodium Metasilicate Anhydrous - English",
        description: "Material Safety Data Sheet",
        label: "MSDS",
        href: "/downloads/documents/msds-anhydrous-sodium-metasilicate-en.pdf",
      },
      {
        title: "MSDS - Sodium Metasilicate Anhydrous - Chinese",
        description: "Safety Data Sheet",
        label: "MSDS",
        href: "/downloads/documents/msds-anhydrous-sodium-metasilicate-cn.pdf",
      },
      {
        title: "MSDS - Sodium Metasilicate Pentahydrate - English",
        description: "Material Safety Data Sheet",
        label: "MSDS",
        href: "/downloads/documents/msds-sodium-metasilicate-pentahydrate-en.pdf",
      },
      {
        title: "MSDS - Sodium Metasilicate Pentahydrate - Chinese",
        description: "Safety Data Sheet",
        label: "MSDS",
        href: "/downloads/documents/msds-sodium-metasilicate-pentahydrate-cn.pdf",
      },
      {
        title: "Product Brochure",
        description: "Product catalog with specifications and applications",
        label: "DOC",
        href: "/downloads/documents/zhongzhi-product-brochure-v2.pdf",
      },
    ],
  },
  {
    title: "Company Documents",
    description:
      "Company credentials for buyer onboarding, supplier review, and export documentation.",
    documents: [
      {
        title: "Business License",
        description: "Shandong Zhongzhi Chemical Technology Co., Ltd.",
        label: "LEGAL",
        href: "/downloads/documents/business-license.jpg",
      },
      {
        title: "Customs Registration Certificate",
        description: "Import & export customs registration",
        label: "CUSTOMS",
        href: "/downloads/documents/customs-registration.pdf",
      },
    ],
  },
];

function FileIcon() {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EAF4FA] text-[#0B2D5B]">
      <svg
        aria-hidden="true"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
        viewBox="0 0 24 24"
      >
        <path d="M7 3h6l4 4v14H7V3Z" />
        <path d="M13 3v5h4M9.5 13h5M9.5 17h5" />
      </svg>
    </span>
  );
}

function DocumentRow({ document }: { document: DownloadDocument }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#D7E6EF] bg-white px-4 py-4 transition-all duration-300 hover:border-[#2A86A5] hover:shadow-sm sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 gap-4">
        <FileIcon />
        <div className="min-w-0">
          <h3 className="text-sm font-bold leading-snug text-[#0B2D5B]">{document.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-[#5A6570]">{document.description}</p>
          <span className="mt-3 inline-flex rounded-full bg-[#EAF4FA] px-3 py-1 text-xs font-bold text-[#1D6680]">
            {document.label}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
        <a
          href={document.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-[#D7E6EF] px-4 py-2 text-sm font-bold text-[#0B2D5B] transition-colors hover:border-[#2A86A5] hover:bg-[#EAF4FA]"
        >
          View
        </a>
        <a
          href={document.href}
          download
          className="inline-flex items-center justify-center rounded-full bg-[#0B2D5B] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#164675]"
        >
          Download
        </a>
      </div>
    </div>
  );
}

export default function DownloadsPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE.url },
          { name: "Downloads", url: `${SITE.url}/downloads` },
        ]}
      />

      <Section background="grey" className="pt-12 md:pt-16">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#2A86A5]">
            Buyer Resources
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#0B2D5B] md:text-4xl">
            Buyer Documents
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#5A6570] md:text-lg">
            Download certificates, MSDS, product documents, and company credentials for supplier
            review and sodium metasilicate procurement.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-[#D7E6EF] bg-[#F8FCFE] p-5">
          <h2 className="text-base font-bold text-[#0B2D5B]">Company Name Note</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#5A6570]">
            Some documents were issued under the former company name Shandong Longgang Silicon
            Technology Co., Ltd. Zhongzhi continues as the same operating entity with unchanged
            manufacturing facilities, production team, and product portfolio.
          </p>
        </div>
      </Section>

      <Section>
        <div className="space-y-12">
          {downloadCategories.map((category) => (
            <section key={category.title}>
              <SectionHeader title={category.title} subtitle={category.description} />
              <div className="grid gap-4">
                {category.documents.map((document) => (
                  <DocumentRow key={document.href} document={document} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </Section>

      <Section background="blue">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-white">
              Need batch-specific COA or order documents?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-blue-100 md:text-base">
              Tell us your product grade, packing, quantity, and destination. Our team can prepare
              order-related documents according to your procurement needs.
            </p>
          </div>
          <Link
            href="/contact?type=quote&product=Sodium%20Metasilicate"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-[#0B2D5B] transition-colors hover:bg-blue-50"
          >
            Request Documents
          </Link>
        </div>
      </Section>
    </>
  );
}
