import Link from "next/link";
import {
  StrongCTA,
  SupplyComparisonTable,
} from "@/components/conversion/ProductConversionSections";
import { Section, SectionHeader } from "@/components/ui/Section";
import { LazyImage } from "@/components/ui/LazyImage";
import { getCategoryPageProductImage } from "@/content/site-images";
import { FAQSchema } from "@/components/seo/JsonLd";
import { InquiryFormWrapper } from "@/components/forms/InquiryFormWrapper";
import { FactoryTrustSystem } from "@/components/trust/FactoryTrustSystem";
import { FactoryImageGallery } from "@/components/trust/FactoryImageGallery";
import { IndustryApplicationsSummary } from "@/components/trust/IndustryApplicationsSummary";
import { sodiumMetasilicateCategory } from "@/content/sodium-metasilicate-category";
import { SITE } from "@/lib/constants";

export function MetasilicateCategoryPage() {
  const cat = sodiumMetasilicateCategory;
  const categoryImage = getCategoryPageProductImage();

  return (
    <>
      <FAQSchema items={cat.faq} />

      <div className="bg-[#0B2D5B] text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#2E7D9A]">
              Primary money page — factory-direct manufacturer & supplier
            </p>
            <p className="mt-1 text-sm text-blue-100">
              {SITE.capacity} annual capacity | Fe ≤ 0.02% | Export-ready documentation
            </p>
          </div>
          <StrongCTA product={cat.inquiryProductName} light />
        </div>
      </div>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 items-start">
          <div>
            <SectionHeader title="Sodium Metasilicate — Factory Direct Supply" />
            {cat.description.map((p, i) => (
              <p key={i} className="mb-3 text-[#5A6570] leading-relaxed">
                {p}
              </p>
            ))}
            <StrongCTA product={cat.inquiryProductName} className="mt-4" />
          </div>
          <LazyImage
            src={categoryImage.src}
            alt={categoryImage.alt}
            aspect="video"
            className="rounded-lg border border-[#E2E6EA]"
          />
        </div>
      </Section>

      <Section background="grey">
        <SectionHeader
          title="Buyer Decision — Why Source from a China Factory"
          subtitle="Price structure, MOQ, and shipping — what procurement teams evaluate before RFQ."
        />
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="font-bold text-[#0B2D5B] text-sm">Why buyers choose our factory</h3>
            <ul className="mt-3 space-y-2">
              {cat.buyerDecision.whyChina.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#5A6570]">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#2E7D9A] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-[#0B2D5B] text-sm">Price structure (no fixed price — request quotation)</h3>
            <ul className="mt-3 space-y-2">
              {cat.buyerDecision.priceStructure.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#5A6570]">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#2E7D9A] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              ["moq", "MOQ"],
              ["packaging", "Packaging"],
              ["shipping", "Shipping"],
              ["leadTime", "Lead Time"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="rounded-lg border border-[#E2E6EA] bg-white p-4">
              <dt className="text-xs font-bold uppercase text-[#2E7D9A]">{label}</dt>
              <dd className="mt-1 text-sm text-[#5A6570]">{cat.buyerDecision.moqShipping[key]}</dd>
            </div>
          ))}
        </dl>
        <StrongCTA product={cat.inquiryProductName} className="mt-8" />
      </Section>

      <Section>
        <SectionHeader
          title="Available Grades"
          subtitle="All manufactured at our Shandong facility. Select a grade for specifications."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {cat.grades.map((grade, i) => (
            <Link
              key={grade.slug}
              href={`/products/${grade.slug}`}
              className={`block rounded-lg border p-5 transition-shadow hover:shadow-md ${
                i === 0
                  ? "border-[#2E7D9A] bg-white ring-1 ring-[#2E7D9A]/30"
                  : "border-[#E2E6EA] bg-white"
              }`}
            >
              <h3 className="font-bold text-[#0B2D5B] text-sm">{grade.name}</h3>
              <p className="mt-2 text-xs text-[#5A6570]">{grade.note}</p>
              <p className="mt-3 text-xs font-semibold text-[#2E7D9A]">View specifications →</p>
            </Link>
          ))}
        </div>
        <StrongCTA product={cat.inquiryProductName} className="mt-8" />
      </Section>

      <Section background="grey">
        <SectionHeader
          title="Factory & Trust Verification"
          subtitle="Production capability, on-site proof, and export documentation before RFQ."
        />
        <div className="space-y-12">
          <FactoryTrustSystem
            showHeader={false}
            product={cat.inquiryProductName}
          />
          <FactoryImageGallery product={cat.inquiryProductName} />
          <IndustryApplicationsSummary />
        </div>
        <StrongCTA product={cat.inquiryProductName} className="mt-10" />
      </Section>

      <Section>
        <SectionHeader
          title="Supply Comparison"
          subtitle="China factory-direct vs trading companies vs overseas suppliers"
        />
        <SupplyComparisonTable rows={cat.comparisonRows} />
        <StrongCTA product={cat.inquiryProductName} className="mt-8" />
      </Section>

      <Section background="grey">
        <SectionHeader title="Frequently Asked Questions" />
        <div className="max-w-3xl space-y-4">
          {cat.faq.map((item) => (
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
        <div className="grid gap-10 lg:grid-cols-2 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Request Quotation — Sodium Metasilicate
            </h2>
            <p className="mt-3 text-blue-100 leading-relaxed">
              Include grade, quantity, packaging, and destination port. Factory-direct response within 1–2 business days.
            </p>
            <StrongCTA product={cat.inquiryProductName} className="mt-6" light />
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
