import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/layout/PageHeader";
import { Section, SectionHeader } from "@/components/ui/Section";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";

const quoteHref = "/contact?type=quote&product=Sodium%20Metasilicate";

const buyingNeeds = [
  {
    title: "Need higher active content?",
    recommendation: "Recommended: Anhydrous Sodium Metasilicate",
    description: "For formulations requiring higher alkalinity and lower moisture content.",
    cta: "View Anhydrous Grade",
    href: "/products/sodium-metasilicate-anhydrous",
  },
  {
    title: "Need common hydrated grade?",
    recommendation: "Recommended: Sodium Metasilicate Pentahydrate",
    description: "Common grade for cleaning, detergent, water treatment and industrial use.",
    cta: "View Pentahydrate Grade",
    href: "/products/sodium-metasilicate-pentahydrate",
  },
  {
    title: "Need easier handling and dosing?",
    recommendation: "Recommended: Sodium Metasilicate Granules",
    description: "Granular form for easier storage, dosing, packaging and industrial handling.",
    cta: "View Granules Grade",
    href: "/products/sodium-metasilicate-granules",
  },
  {
    title: "Need related silicate supply?",
    recommendation: "Recommended: Sodium Silicate",
    description:
      "Supporting product line for buyers sourcing sodium metasilicate and sodium silicate together.",
    cta: "View Sodium Silicate",
    href: "/products/sodium-silicate",
  },
];

const comparisonRows = [
  {
    question: "Higher active content",
    anhydrous: "Best fit",
    pentahydrate: "Medium",
    granules: "Depends on grade",
  },
  {
    question: "Easier handling",
    anhydrous: "Good",
    pentahydrate: "Good",
    granules: "Best fit",
  },
  {
    question: "Common detergent use",
    anhydrous: "Good",
    pentahydrate: "Best fit",
    granules: "Good",
  },
  {
    question: "Lower moisture",
    anhydrous: "Best fit",
    pentahydrate: "No",
    granules: "Depends",
  },
  {
    question: "Quote needed for",
    anhydrous: "High-alkaline formulations",
    pentahydrate: "Common industrial cleaning",
    granules: "Dosing / packing convenience",
  },
];

const productForms = [
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
];

const packingLoadingSections = [
  {
    title: "Packaging Options",
    images: [
      {
        src: "/assets/images/products/packing-loading/packing-red-bag.png",
        alt: "Red sodium metasilicate export packaging bag",
        label: "Red Packaging",
      },
      {
        src: "/assets/images/products/packing-loading/packing-blue-bag.png",
        alt: "Blue sodium metasilicate export packaging bag",
        label: "Blue Packaging",
      },
    ],
    points: [
      {
        title: "25 kg PP woven bag",
        description: "Standard 25 kg export woven bag.",
      },
      {
        title: "Printed / neutral bag",
        description: "Printed bag and neutral bag options available.",
      },
      {
        title: "Custom marking available",
        description:
          "Buyer label, batch number, and handling marks can be confirmed before order.",
      },
    ],
  },
  {
    title: "Loading Reference",
    images: [
      {
        src: "/assets/images/products/packing-loading/loading-small-bag.png",
        alt: "Small bag sodium metasilicate container loading reference",
        label: "Small Bag Loading",
      },
      {
        src: "/assets/images/products/packing-loading/loading-jumbo-bag.png",
        alt: "Jumbo bag sodium metasilicate loading reference",
        label: "Jumbo Bag Loading",
      },
    ],
    points: [
      {
        title: "Small bag container loading",
        description: "For 25 kg bag shipment and manual stacking review.",
      },
      {
        title: "Jumbo bag loading",
        description: "For bulk packing and pallet-supported handling.",
      },
      {
        title: "Palletized / non-palletized",
        description: "Loading method depends on buyer requirement.",
      },
      {
        title: "Final loading plan confirmed",
        description:
          "Container type, loading quantity, and destination port are confirmed before quotation.",
      },
    ],
  },
];

const productLinks = [
  {
    label: "View sodium metasilicate category",
    href: "/products/sodium-metasilicate",
  },
  {
    label: "View anhydrous sodium metasilicate specifications",
    href: "/products/sodium-metasilicate-anhydrous",
  },
  {
    label: "View sodium metasilicate pentahydrate specifications",
    href: "/products/sodium-metasilicate-pentahydrate",
  },
  {
    label: "View sodium metasilicate granules specifications",
    href: "/products/sodium-metasilicate-granules",
  },
  {
    label: "View sodium silicate product line",
    href: "/products/sodium-silicate",
  },
  {
    label: "Download MSDS and certificates",
    href: "/downloads",
  },
  {
    label: "Request sodium metasilicate quotation",
    href: quoteHref,
  },
];

export const metadata = createMetadata({
  title: "Sodium Metasilicate Grade Selection & RFQ",
  description:
    "Choose the right sodium metasilicate grade, product form, packing information, documents and quotation path for industrial procurement.",
  path: "/products",
});

export default function ProductsPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE.url },
          { name: "Products", url: `${SITE.url}/products` },
        ]}
      />

      <Section background="grey" className="pt-10 md:pt-12">
        <Breadcrumbs items={[{ label: "Products" }]} />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#2A86A5]">
              Sodium Metasilicate Procurement
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-[#0B2D5B] md:text-4xl">
              Product Selection & RFQ Center
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[#5A6570]">
              Choose the right sodium metasilicate grade, product form, documents, and packing
              information before requesting a factory quotation.
            </p>
          </div>

          <div className="rounded-2xl border border-[#D7E6EF] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#0B2D5B]">
              To quote faster, please prepare:
            </h2>
            <ul className="mt-4 grid gap-2 text-sm font-semibold text-[#5A6570]">
              {["Grade", "Quantity", "Packing", "Destination port", "Application"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#2A86A5]" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href={quoteHref}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#0B2D5B] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#164675]"
            >
              Request Quote
            </Link>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader
          title="Choose by Buying Need"
          subtitle="Start from your application and sourcing requirement, then enter the right product page for specifications and quotation."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {buyingNeeds.map((item) => (
            <div
              key={item.title}
              className="flex h-full flex-col rounded-2xl border border-[#D7E6EF] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#2A86A5] hover:shadow-md"
            >
              <h3 className="text-lg font-bold leading-snug text-[#0B2D5B]">{item.title}</h3>
              <p className="mt-4 rounded-full bg-[#EAF4FA] px-3 py-1 text-xs font-bold text-[#2A86A5]">
                {item.recommendation}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#5A6570]">{item.description}</p>
              <Link
                href={item.href}
                className="mt-auto pt-6 text-sm font-bold text-[#2A86A5] hover:underline"
              >
                {item.cta} →
              </Link>
            </div>
          ))}
        </div>
      </Section>

      <Section background="grey">
        <SectionHeader
          title="Quick Grade Comparison"
          subtitle="A simple buying guide before checking detailed specifications."
        />
        <div className="overflow-hidden rounded-2xl border border-[#D7E6EF] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full border-collapse text-left text-sm">
              <thead className="bg-[#0B2D5B] text-white">
                <tr>
                  {["Buying Question", "Anhydrous", "Pentahydrate", "Granules"].map((heading) => (
                    <th key={heading} className="px-5 py-4 font-bold">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.question} className="border-t border-[#D7E6EF]">
                    <th className="px-5 py-4 font-bold text-[#0B2D5B]">{row.question}</th>
                    <td className="px-5 py-4 text-[#5A6570]">{row.anhydrous}</td>
                    <td className="px-5 py-4 text-[#5A6570]">{row.pentahydrate}</td>
                    <td className="px-5 py-4 text-[#5A6570]">{row.granules}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader
          title="Product Forms Explained"
          subtitle="Product form affects dissolution, handling, dosing, storage and export packing."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {productForms.map((form) => (
            <Link
              key={form.title}
              href="/products/sodium-metasilicate"
              className="block rounded-2xl border border-[#D7E6EF] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#2A86A5] hover:bg-[#F8FCFE] hover:shadow-md"
            >
              <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-xl bg-[#F4F6F8]">
                <Image
                  src={form.image}
                  alt={form.imageAlt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-[#0B2D5B]">{form.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#5A6570]">{form.description}</p>
              <p className="mt-5 text-sm font-bold text-[#2A86A5]">View form options →</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section background="grey">
        <div className="rounded-2xl border border-[#D7E6EF] bg-white p-6 shadow-sm md:p-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-[#0B2D5B] md:text-3xl">
              Packing & Loading Information Needed for Quotation
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#5A6570]">
              Clear packaging and container-loading details help buyers request faster and more
              accurate quotations.
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {packingLoadingSections.map((section) => (
              <div
                key={section.title}
                className="rounded-2xl border border-[#D7E6EF] bg-[#F8FCFE] p-5"
              >
                <h3 className="text-xl font-bold text-[#0B2D5B]">{section.title}</h3>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {section.images.map((image) => (
                    <div
                      key={image.src}
                      className="overflow-hidden rounded-2xl border border-[#D7E6EF] bg-white shadow-sm"
                    >
                      <div className="relative h-56">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="(min-width: 1024px) 260px, (min-width: 640px) 50vw, 100vw"
                          className="object-contain p-2"
                        />
                      </div>
                      <p className="border-t border-[#D7E6EF] px-4 py-3 text-sm font-bold text-[#0B2D5B]">
                        {image.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid gap-3">
                  {section.points.map((point) => (
                    <div key={point.title} className="rounded-xl bg-white p-4 shadow-sm">
                      <h4 className="text-sm font-bold text-[#0B2D5B]">{point.title}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-[#5A6570]">
                        {point.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-[#BFDDEB] bg-gradient-to-r from-[#F2F8FB] to-white p-5 md:flex md:items-center md:justify-between md:gap-6">
            <p className="text-sm font-semibold leading-relaxed text-[#0B2D5B] md:text-base">
              Please provide your product grade, packing preference, quantity, and destination port.
            </p>
            <Link
              href={quoteHref}
              className="mt-4 inline-flex w-full items-center justify-center whitespace-nowrap rounded-full bg-[#0B2D5B] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#164675] md:mt-0 md:w-auto"
            >
              Request Packing & Loading Quote
            </Link>
          </div>
        </div>
      </Section>

      <Section>
        <div className="rounded-2xl border border-[#BFDDEB] bg-gradient-to-br from-[#F2F8FB] to-white p-6 shadow-sm md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#0B2D5B] md:text-3xl">
                Product Documents & Compliance Support
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#5A6570]">
                Download MSDS, certificates, product brochure and company documents, or request
                batch-specific COA and quotation support.
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
        <SectionHeader title="Continue to Product Pages" />
        <div className="grid gap-3 md:grid-cols-2">
          {productLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between gap-4 rounded-xl border border-[#D7E6EF] bg-white px-5 py-4 text-sm font-bold text-[#0B2D5B] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#2A86A5] hover:text-[#2A86A5] hover:shadow-md"
            >
              <span>{item.label}</span>
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
