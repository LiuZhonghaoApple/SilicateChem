export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductAdvantage = {
  title: string;
  description: string;
};

export type Product = {
  slug: string;
  name: string;
  shortName: string;
  cas?: string;
  formula?: string;
  categoryParent?: "sodium-metasilicate";
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  summary: string;
  description: string[];
  specs: ProductSpec[];
  applications: string[];
  packaging: string[];
  features: string[];
  factoryAdvantages?: string[];
  whyChoose?: ProductAdvantage[];
  primaryKeyword?: string;
  faq?: FAQItem[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  primaryKeyword: string;
  keywords: string[];
  productLinks: { slug: string; label: string }[];
  faq: FAQItem[];
  sections: { heading: string; paragraphs: string[] }[];
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type ContentSection = {
  heading: string;
  paragraphs: string[];
};

export type IntentGuide = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  intro: string;
  sections: ContentSection[];
  faq: FAQItem[];
};

export type IndustryApplication = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  intro: string;
  howUsed: string[];
  benefits: string[];
  productRecommendation: string;
  recommendedGradeSlug?: string;
  faq: FAQItem[];
};
