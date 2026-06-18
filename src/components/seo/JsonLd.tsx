import { SITE } from "@/lib/constants";

type JsonLdProps = {
  data: Record<string, unknown>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE.company,
        alternateName: SITE.formerCompany,
        url: SITE.url,
        logo: `${SITE.url}/images/logo.svg`,
        email: SITE.email,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Shandong",
          addressRegion: "Shandong",
          addressCountry: "CN",
        },
        description: SITE.description,
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "productionCapacity",
            value: SITE.capacity,
          },
          {
            "@type": "PropertyValue",
            name: "manufacturingType",
            value: "Chemical manufacturer",
          },
        ],
        knowsAbout: [
          "Sodium metasilicate manufacturing",
          "Industrial chemical production",
          "Export packaging and documentation",
        ],
        sameAs: [],
      }}
    />
  );
}

export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}

export function ProductSchema({
  name,
  description,
  url,
  sku,
}: {
  name: string;
  description: string;
  url: string;
  sku: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name,
        description,
        url,
        sku,
        brand: {
          "@type": "Brand",
          name: SITE.company,
        },
        manufacturer: {
          "@type": "Organization",
          name: SITE.company,
        },
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          priceCurrency: "USD",
          seller: {
            "@type": "Organization",
            name: SITE.company,
          },
        },
      }}
    />
  );
}

export function FAQSchema({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }}
    />
  );
}

export function ArticleSchema({
  title,
  description,
  url,
  datePublished,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        url,
        datePublished,
        author: {
          "@type": "Organization",
          name: SITE.company,
        },
        publisher: {
          "@type": "Organization",
          name: SITE.company,
          logo: {
            "@type": "ImageObject",
            url: `${SITE.url}/images/logo.svg`,
          },
        },
      }}
    />
  );
}
