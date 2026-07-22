import Image from "next/image";
import Link from "next/link";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import { Section, SectionHeader } from "@/components/ui/Section";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "About Zhongzhi | Sodium Metasilicate Manufacturer",
  description:
    "About Shandong Zhongzhi Chemical Technology, a sodium metasilicate manufacturer in Changyi, Shandong. Review company history, quality controls and industrial supply capabilities.",
  path: "/about",
});

const companyFacts = [
  {
    title: "Since 2011",
    description: "Inorganic Silicate Manufacturing",
  },
  {
    title: "Changyi, Shandong",
    description: "Manufacturing Base",
  },
  {
    title: "Sodium Metasilicate Focus",
    description: "Industrial Supply",
  },
];

const evolutionSteps = [
  {
    period: "2011-2016",
    title: "Foundation Stage",
    description:
      "Built the foundation for sodium metasilicate and inorganic silicate production.",
  },
  {
    period: "2017-2021",
    title: "Technology Upgrade",
    description:
      "Expanded innovation platforms, patents, industry-standard participation, and production infrastructure.",
  },
  {
    period: "2022-2025",
    title: "Brand Growth",
    description: "Expanded silicate-based product lines and strengthened market channels.",
  },
  {
    period: "2026-Present",
    title: "Zhongzhi Chemical Technology",
    description:
      "Completed the company name update and continued development as a specialized silicate-based chemical manufacturer.",
  },
];

const qualityPoints = [
  {
    title: "Raw Material Check",
    description:
      "Incoming materials are checked before production to support batch stability.",
  },
  {
    title: "Process Monitoring",
    description:
      "Production parameters are monitored to reduce quality fluctuation.",
  },
  {
    title: "Laboratory Testing",
    description:
      "Laboratory equipment supports product testing and specification review.",
  },
  {
    title: "Batch Consistency",
    description:
      "Quality control is designed to support stable supply for industrial buyers.",
  },
];

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE.url },
          { name: "About Us", url: `${SITE.url}/about` },
        ]}
      />

      <Section background="grey" className="pt-12 md:pt-16">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#2A86A5]">
              About Us
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-[#0B2D5B] md:text-4xl">
              About Zhongzhi Chemical Technology
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#5A6570]">
              A specialized inorganic silicate manufacturer focused on sodium metasilicate and
              stable industrial supply.
            </p>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-[#5A6570]">
              Shandong Zhongzhi Chemical Technology Co., Ltd. is located in Changyi, Shandong,
              China. Since 2011, the company has developed from an inorganic silicate producer into
              a specialized manufacturer serving sodium metasilicate and related silicate-based
              material markets.
            </p>
          </div>
          <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-[#D7E6EF] bg-white shadow-sm">
            <Image
              src="/assets/images/about/about-product-sample-lab.webp"
              alt="Sodium metasilicate product sample in laboratory"
              fill
              className="object-cover object-center"
              sizes="(min-width: 1024px) 540px, 100vw"
            />
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {companyFacts.map((fact) => (
            <div
              key={fact.title}
              className="rounded-2xl border border-[#D7E6EF] bg-white p-5 shadow-sm"
            >
              <h2 className="text-lg font-bold text-[#0B2D5B]">{fact.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#5A6570]">{fact.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          title="Company Evolution"
          subtitle="A focused development path from basic inorganic silicate production to specialized chemical manufacturing."
        />
        <div className="rounded-2xl border border-[#D7E6EF] bg-white p-5 shadow-sm md:p-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.95fr)] lg:items-stretch">
            <div className="grid gap-4 md:grid-cols-2">
              {evolutionSteps.map((step) => (
                <div
                  key={step.period}
                  className="flex h-full flex-col rounded-xl border border-[#D7E6EF] bg-[#F8FCFE] p-5"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF4FA] text-[#2A86A5]">
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
                        <path d="M12 6v6l4 2" />
                        <circle cx="12" cy="12" r="8" />
                      </svg>
                    </span>
                    <p className="rounded-full bg-white px-3 py-1 text-sm font-bold text-[#2A86A5] shadow-sm">
                      {step.period}
                    </p>
                  </div>
                  <h3 className="text-lg font-bold leading-snug text-[#0B2D5B]">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#5A6570]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex h-full flex-col lg:border-l lg:border-[#D7E6EF] lg:pl-6">
              <div className="relative min-h-[320px] flex-1 overflow-hidden rounded-2xl border border-[#D7E6EF] bg-white shadow-sm">
                <Image
                  src="/assets/images/about/about-production-workshop.png"
                  alt="Zhongzhi production workshop and equipment"
                  fill
                  className="object-cover object-center"
                  sizes="(min-width: 1024px) 360px, 100vw"
                />
              </div>
              <p className="mt-4 rounded-2xl border border-[#D7E6EF] bg-[#F8FCFE] p-4 text-sm leading-relaxed text-[#5A6570]">
                Some historical images may show the former company name. Zhongzhi continues as the
                same operating entity.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section background="grey">
        <SectionHeader
          title="Quality Control Capability"
          subtitle="Testing standards, process control, and laboratory checks support stable sodium metasilicate quality."
        />
        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div className="overflow-hidden rounded-2xl border border-[#D7E6EF] bg-white shadow-sm">
            <Image
              src="/assets/images/about/quality-lab.png"
              alt="Zhongzhi quality control laboratory for sodium metasilicate testing"
              width={1672}
              height={941}
              className="h-auto w-full"
              sizes="(min-width: 1024px) 560px, 100vw"
            />
          </div>
          <div className="grid gap-4">
            {qualityPoints.map((point) => (
              <div
                key={point.title}
                className="rounded-2xl border border-[#D7E6EF] bg-white p-5 shadow-sm"
              >
                <h3 className="text-base font-bold text-[#0B2D5B]">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5A6570]">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="rounded-2xl border border-[#D7E6EF] bg-white p-6 shadow-sm md:flex md:items-center md:justify-between md:gap-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-[#0B2D5B]">
              Need to verify product grade or documents?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#5A6570] md:text-base">
              Contact Zhongzhi for product specifications, MSDS, COA, TDS, packing details, and
              quotation support.
            </p>
          </div>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#0B2D5B] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#164675] md:mt-0"
          >
            Contact Factory
          </Link>
        </div>
      </Section>
    </>
  );
}
