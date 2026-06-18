import { METASILICATE_CATEGORY_PATH } from "@/lib/seo-keywords";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function productBreadcrumbs(
  productName: string,
  options?: { categoryParent?: boolean }
): BreadcrumbItem[] {
  if (options?.categoryParent) {
    return [
      { label: "Products", href: "/products" },
      { label: "Sodium Metasilicate", href: METASILICATE_CATEGORY_PATH },
      { label: productName },
    ];
  }
  return [
    { label: "Products", href: "/products" },
    { label: productName },
  ];
}

export function productBreadcrumbSchemaItems(
  productName: string,
  productPath: string,
  siteUrl: string,
  options?: { categoryParent?: boolean }
) {
  const items = [
    { name: "Home", url: siteUrl },
    { name: "Products", url: `${siteUrl}/products` },
  ];
  if (options?.categoryParent) {
    items.push({
      name: "Sodium Metasilicate",
      url: `${siteUrl}${METASILICATE_CATEGORY_PATH}`,
    });
  }
  items.push({ name: productName, url: `${siteUrl}${productPath}` });
  return items;
}

export function metasilicateCategoryBreadcrumbs(): BreadcrumbItem[] {
  return [
    { label: "Products", href: "/products" },
    { label: "Sodium Metasilicate" },
  ];
}
