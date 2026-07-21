import { getContentLastModified } from "@/lib/content-freshness";

export type GeoContentRecord = {
  pagePath: string;
  contentVersion: string;
  evidenceSource: string;
};

function evidenceSourceForPath(path: string): string {
  if (path.startsWith("/products/")) {
    return "Product specification registry with TDS, MSDS and COA buyer-document references";
  }
  if (path.startsWith("/applications/")) {
    return "Reviewed product specifications linked to buyer application requirements";
  }
  if (path.startsWith("/guides/") || path.startsWith("/blog/")) {
    return "Reviewed product facts, application pages and buyer-document references";
  }
  if (path === "/downloads" || path === "/certifications") {
    return "Published buyer documents, certificates and compliance records";
  }
  if (path === "/about" || path === "/export") {
    return "Published company, factory and export-service records";
  }
  return "Published SilicateChem site content and controlled content-release registry";
}

export function getGeoContentRegistry(paths: readonly string[]): GeoContentRecord[] {
  return paths.map((path) => ({
    pagePath: path || "/",
    contentVersion: getContentLastModified(path),
    evidenceSource: evidenceSourceForPath(path),
  }));
}
