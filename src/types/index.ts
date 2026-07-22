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
  metaTitle?: string;
  excerpt: string;
  date: string;
  readTime: string;
  primaryKeyword: string;
  keywords: string[];
  heroImage?: BlogImage;
  keyTakeaways?: string[];
  productLinks: { slug: string; label: string }[];
  faq: FAQItem[];
  sections: BlogSection[];
};

export type BlogImage = {
  src: string;
  alt: string;
  caption: string;
  fit?: "cover" | "contain";
};

export type BlogSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  image?: BlogImage;
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
  /** Supporting commercial variants; primaryKeyword remains the page owner. */
  keywords?: string[];
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
