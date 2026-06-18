import { products } from "@/content/products";
import { sodiumMetasilicateCategory } from "@/content/sodium-metasilicate-category";

export type RfqContext = {
  product: string;
  source?: string;
};

const defaultProduct = sodiumMetasilicateCategory.inquiryProductName;

const productBySlug = Object.fromEntries(products.map((p) => [p.slug, p.name]));

/** Map URL path to pre-filled inquiry context for global RFQ CTAs */
export function getRfqContext(pathname: string): RfqContext {
  if (pathname === "/products/sodium-metasilicate") {
    return { product: defaultProduct, source: "money-page" };
  }

  const gradeMatch = pathname.match(/^\/products\/(.+)$/);
  if (gradeMatch && productBySlug[gradeMatch[1]]) {
    return { product: productBySlug[gradeMatch[1]], source: "product-page" };
  }

  const appMatch = pathname.match(/^\/applications\/(.+)$/);
  if (appMatch) {
    return { product: defaultProduct, source: `application-${appMatch[1]}` };
  }

  const guideMatch = pathname.match(/^\/guides\/(.+)$/);
  if (guideMatch) {
    return { product: defaultProduct, source: `guide-${guideMatch[1]}` };
  }

  const blogMatch = pathname.match(/^\/blog\/(.+)$/);
  if (blogMatch) {
    return { product: defaultProduct, source: `blog-${blogMatch[1]}` };
  }

  if (pathname === "/") {
    return { product: defaultProduct, source: "homepage" };
  }

  return { product: defaultProduct };
}

export function rfqContactHref(
  type: "quote" | "sample" | "tds",
  ctx: RfqContext
): string {
  const params = new URLSearchParams({ type });
  params.set("product", ctx.product);
  if (ctx.source) params.set("source", ctx.source);
  return `/contact?${params.toString()}`;
}
