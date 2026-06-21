import { PageHeader, PageCTAs } from "@/components/layout/PageHeader";
import { Section, SectionHeader } from "@/components/ui/Section";
import { LazyImage } from "@/components/ui/LazyImage";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import { ProductFunnelBanner } from "@/components/seo/FunnelSections";
import { DeploymentImageGrid } from "@/components/trust/HomepageRealImages";
import { company } from "@/content/company";
import { getAboutImages } from "@/content/site-images";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "About Us",
  description: `${SITE.company} — sodium metasilicate manufacturer in Shandong, China. Factory-direct export supply.`,
  path: "/about",
});

export default function AboutPage() {
  const aboutImages = getAboutImages();
  const hero = aboutImages[0];
  const sectionImages = aboutImages.slice(1);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE.url },
          { name: "About Us", url: `${SITE.url}/about` },
        ]}
      />
      <PageHeader
        title="About Us"
        description={company.intro}
        breadcrumbs={[{ label: "About Us" }]}
      />

      {hero && (
        <Section>
          <LazyImage
            src={hero.src}
            alt={hero.alt}
            aspect="wide"
            className="rounded-lg border border-[#E2E6EA]"
          />
        </Section>
      )}

      <Section background={hero ? "grey" : undefined}>
        <div className="max-w-3xl">
          <SectionHeader title="Company Background" />
          {company.history.map((p, i) => (
            <p key={i} className="mb-4 text-[#5A6570] leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </Section>

      {sectionImages.length > 0 && (
        <Section id="why-zhongzhi">
          <SectionHeader title="Why Zhongzhi" subtitle="Integrated manufacturing at our Changyi, Shandong facility." />
          <DeploymentImageGrid images={sectionImages} columns="sm:grid-cols-2" />
        </Section>
      )}

      <Section background="grey">
        <SectionHeader title="Our Commitment" subtitle={company.mission} />
        <div className="grid gap-6 sm:grid-cols-2">
          {company.values.map((v) => (
            <div key={v.title} className="rounded-lg border border-[#E2E6EA] bg-white p-6">
              <h3 className="font-bold text-[#0B2D5B]">{v.title}</h3>
              <p className="mt-2 text-sm text-[#5A6570] leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader title="Industries Served" />
        <ul className="grid gap-3 sm:grid-cols-2">
          {company.industries.map((ind) => (
            <li key={ind} className="flex items-start gap-2 text-sm text-[#5A6570]">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#2E7D9A] shrink-0" />
              {ind}
            </li>
          ))}
        </ul>
        <ProductFunnelBanner className="mt-10" />
        <PageCTAs className="mt-6" />
      </Section>
    </>
  );
}
