import Image from "next/image";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/Section";
import { ProductMainImage } from "@/components/products/ProductMainImage";
import { FAQSchema } from "@/components/seo/JsonLd";
import { InquiryFormWrapper } from "@/components/forms/InquiryFormWrapper";
import { sodiumMetasilicateCategory } from "@/content/sodium-metasilicate-category";

const quoteHref = "/contact?type=quote&product=Sodium%20Metasilicate";

const productIdentity = [
  ["Product name", "Sodium Metasilicate"],
  ["Chinese name", "偏硅酸钠"],
  ["CAS No.", "6834-92-0 (anhydrous) / 10213-79-3 (pentahydrate)"],
  ["Formula", "Na₂SiO₃"],
  ["Molecular weight", "122.06 g/mol (anhydrous) / 212.14 g/mol (pentahydrate)"],
  ["EC No.", "229-912-9 (anhydrous sodium metasilicate)"],
  ["Appearance", "White powder, granules, or crystalline form"],
  ["Available grades", "Anhydrous, pentahydrate, nonahydrate by inquiry"],
  ["Available forms", "Powder, granules, crystal"],
  ["Documents", "MSDS, COA, TDS, certificates and product brochure"],
] as const;

const availableForms = [
  {
    title: "Powder",
    description: "Better for fast dissolution and formulation blending.",
    image: "/assets/images/product-cards/instant-powder.png",
    imageAlt: "Sodium metasilicate powder form",
  },
  {
    title: "Granules",
    description: "Better for handling, dosing, storage, packaging and industrial use.",
    image: "/assets/images/product-cards/anhydrous-Granular.png",
    imageAlt: "Sodium metasilicate granules form",
  },
  {
    title: "Crystal",
    description: "Used for selected hydrated sodium metasilicate grades.",
    image: "/assets/images/product-cards/product-form-crystal.png",
    imageAlt: "Sodium metasilicate crystal form",
  },
] as const;

const buyingSpecs = [
  ["Na₂O", "Confirmed by grade specification"],
  ["SiO₂", "Confirmed by grade specification"],
  ["Fe", "Available on request / subject to grade specification"],
  ["Bulk density", "Available on request"],
  ["Particle size", "Subject to grade and buyer requirement"],
  ["Whiteness", "Available on request for relevant applications"],
  ["Water insoluble matter", "Confirmed by grade specification"],
  ["pH", "Strongly alkaline; confirm by TDS"],
  ["Storage", "Keep sealed and dry; avoid moisture absorption"],
  ["Appearance", "White powder, granules, or crystalline form"],
] as const;

const applications = [
  "Detergent and cleaning formulations",
  "Metal cleaning and degreasing",
  "Textile processing",
  "Ceramic processing",
  "Water treatment formulations",
] as const;

const rfqItems = [
  "Grade",
  "Quantity",
  "Packing",
  "Destination port",
  "Application",
  "Required documents",
] as const;

const productFaq = [
  {
    question: "What grades of sodium metasilicate are available?",
    answer:
      "Anhydrous, pentahydrate, and granule grades are available. Nonahydrate can be discussed by inquiry depending on specification and order requirement.",
  },
  {
    question: "Which form should I choose: powder, granules or crystal?",
    answer:
      "Powder is suitable for fast dissolution and blending, granules are preferred for handling and dosing, and crystal form is used for selected hydrated grades.",
  },
  {
    question: "Can you provide MSDS, TDS and COA?",
    answer:
      "MSDS, certificates, product brochure and company documents can be downloaded from the documents center. Batch-specific COA, TDS and SDS can be requested with your order details.",
  },
  {
    question: "What information is needed for quotation?",
    answer:
      "Please provide grade, quantity, packing preference, destination port, application, and any required documents such as COA, TDS or SDS.",
  },
];

export function MetasilicateCategoryPage() {
  const cat = sodiumMetasilicateCategory;

  return (
    <>
      <FAQSchema items={productFaq} />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeader title="Sodium Metasilicate — Industrial Grade Product" />
            <p className="text-[#5A6570] leading-relaxed">
              Industrial grade sodium metasilicate for detergent, cleaning, textile, ceramic, and
              water treatment applications. Available in selected grades and forms for industrial
              procurement.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={quoteHref}
                className="inline-flex items-center justify-center rounded bg-[#0B2D5B] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#071F3F]"
              >
                Request Quotation
              </Link>
              <Link
                href="/downloads"
                className="inline-flex items-center justify-center rounded border border-[#0B2D5B] px-5 py-2.5 text-sm font-bold text-[#0B2D5B] transition-colors hover:bg-[#F4F6F8]"
              >
                Download Documents
              </Link>
            </div>
          </div>
          <ProductMainImage productSlug="sodium-metasilicate" />
        </div>
      </Section>

      <Section background="grey">
        <SectionHeader
          title="Product Identity"
          subtitle="Core sodium metasilicate information for grade selection and procurement review."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {productIdentity.map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-[#D7E6EF] bg-white p-5 shadow-sm">
              <dt className="text-xs font-bold uppercase tracking-wide text-[#2E7D9A]">
                {label}
              </dt>
              <dd className="mt-2 text-sm font-semibold leading-relaxed text-[#0B2D5B]">{value}</dd>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          title="Available Grades"
          subtitle="Select a sodium metasilicate grade for detailed specifications and quotation."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {cat.grades.map((grade) => (
            <Link
              key={grade.slug}
              href={`/products/${grade.slug}`}
              className="block rounded-2xl border border-[#D7E6EF] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#2A86A5] hover:shadow-md"
            >
              <h3 className="font-bold text-[#0B2D5B] text-sm">{grade.name}</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#5A6570]">{grade.note}</p>
              <p className="mt-4 text-xs font-bold text-[#2E7D9A]">View specifications →</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section background="grey">
        <SectionHeader
          title="Available Forms"
          subtitle="Powder, granules and crystal forms are available for selected sodium metasilicate grades."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {availableForms.map((form) => (
            <article
              key={form.title}
              className="overflow-hidden rounded-2xl border border-[#D7E6EF] bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3] bg-[#F4F6F8]">
                <Image
                  src={form.image}
                  alt={form.imageAlt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-[#0B2D5B]">{form.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5A6570]">{form.description}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          title="Key Buying Specs"
          subtitle="Detailed values depend on the selected grade. Confirm target specifications before quotation."
        />
        <div className="overflow-hidden rounded-2xl border border-[#D7E6EF] bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <tbody>
              {buyingSpecs.map(([label, value], index) => (
                <tr key={label} className={index % 2 === 0 ? "bg-white" : "bg-[#F8FCFE]"}>
                  <th className="w-1/3 px-5 py-4 font-bold text-[#0B2D5B]">{label}</th>
                  <td className="px-5 py-4 text-[#5A6570]">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section background="grey">
        <SectionHeader
          title="Applications"
          subtitle="Common industrial uses directly related to sodium metasilicate grades and forms."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {applications.map((application) => (
            <div
              key={application}
              className="rounded-2xl border border-[#D7E6EF] bg-white p-5 text-sm font-semibold leading-relaxed text-[#0B2D5B] shadow-sm"
            >
              {application}
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="rounded-2xl border border-[#BFDDEB] bg-gradient-to-br from-[#F2F8FB] to-white p-6 shadow-sm md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#0B2D5B] md:text-3xl">
                Documents & RFQ
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#5A6570]">
                Download MSDS, certificates, product brochure and company documents, or request
                batch-specific COA / TDS / SDS for your order.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/downloads"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-[#0B2D5B] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#164675]"
              >
                Download Documents
              </Link>
              <Link
                href={quoteHref}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-[#0B2D5B] px-6 py-3 text-sm font-bold text-[#0B2D5B] transition-colors hover:bg-[#0B2D5B] hover:text-white"
              >
                Request COA / TDS / SDS
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <Section background="grey">
        <SectionHeader title="Frequently Asked Questions" />
        <div className="max-w-3xl space-y-4">
          {productFaq.map((item) => (
            <details key={item.question} className="group rounded-lg border border-[#E2E6EA] bg-white">
              <summary className="cursor-pointer px-5 py-4 font-semibold text-[#0B2D5B] list-none flex justify-between items-center">
                {item.question}
                <span className="ml-4 text-[#2E7D9A] group-open:rotate-45 transition-transform text-xl leading-none">+</span>
              </summary>
              <div className="px-5 pb-4 text-sm text-[#5A6570] leading-relaxed border-t border-[#E2E6EA] pt-3">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </Section>

      <Section background="blue">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Request Quotation — Sodium Metasilicate
            </h2>
            <p className="mt-3 text-blue-100 leading-relaxed">
              Include grade, quantity, packing, destination port, application, and required
              documents. The sales team will prepare quotation support based on your procurement
              details.
            </p>
            <ul className="mt-5 grid gap-2 text-sm text-blue-100 sm:grid-cols-2">
              {rfqItems.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2E7D9A]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg bg-white p-6">
            <h3 className="font-bold text-[#0B2D5B] mb-4">RFQ Form</h3>
            <InquiryFormWrapper
              defaultProduct={cat.inquiryProductName}
              defaultRequestType="quote"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
