import manifest from "./site-images.manifest.json";
import bindings from "./trust-image-bindings.json";

export type ImageEntry = {
  src: string;
  alt: string;
  section: string;
  block: string;
  source: string;
};

export type TrustImageBinding = {
  image_id: string;
  src: string;
  page_route: string;
  used_component: string;
  section: string;
  block: string;
};

export type TrustImageReportEntry = TrustImageBinding & {
  render_status: "bound" | "unbound" | "orphan";
  alt: string;
};

export type TrustImageBindingReport = {
  generated_at: string;
  version: "V5.5";
  total_manifest_images: number;
  bound_count: number;
  unbound_count: number;
  orphan_count: number;
  entries: TrustImageReportEntry[];
};

const TRUST_SECTIONS = ["home", "about", "factory", "products", "export"] as const;

export const TRUST_IMAGE_BINDINGS = bindings as TrustImageBinding[];

function collectManifestTrustImages(): ImageEntry[] {
  const images: ImageEntry[] = [];

  images.push(...manifest.home.hero);
  if (manifest.home.factoryPreview) {
    images.push(manifest.home.factoryPreview);
  }
  images.push(...manifest.home.production);
  images.push(...manifest.about);
  images.push(...manifest.factory);
  images.push(...manifest.products);
  images.push(...manifest.export.packaging);
  images.push(...manifest.export.shipping);

  return images;
}

export function getAllTrustManifestImages(): ImageEntry[] {
  return collectManifestTrustImages();
}

export function getTrustImageBindingBySrc(src: string): TrustImageBinding | undefined {
  return TRUST_IMAGE_BINDINGS.find((binding) => binding.src === src);
}

export function getUnboundTrustImages(): TrustImageReportEntry[] {
  const manifestImages = collectManifestTrustImages();
  const bindingBySrc = new Map(TRUST_IMAGE_BINDINGS.map((b) => [b.src, b]));
  const manifestSrcs = new Set(manifestImages.map((img) => img.src));

  const unbound: TrustImageReportEntry[] = [];

  for (const img of manifestImages) {
    const binding = bindingBySrc.get(img.src);
    if (!binding) {
      unbound.push({
        image_id: img.src.split("/").pop()?.replace(".webp", "") ?? img.src,
        src: img.src,
        page_route: "unknown",
        used_component: "none",
        section: img.section,
        block: img.block,
        alt: img.alt,
        render_status: "unbound",
      });
    }
  }

  for (const binding of TRUST_IMAGE_BINDINGS) {
    if (!manifestSrcs.has(binding.src)) {
      unbound.push({
        ...binding,
        alt: "",
        render_status: "orphan",
      });
    }
  }

  return unbound;
}

export function generateTrustImageBindingReport(): TrustImageBindingReport {
  const manifestImages = collectManifestTrustImages();
  const bindingBySrc = new Map(TRUST_IMAGE_BINDINGS.map((b) => [b.src, b]));
  const manifestBySrc = new Map(manifestImages.map((img) => [img.src, img]));

  const entries: TrustImageReportEntry[] = TRUST_IMAGE_BINDINGS.map((binding) => {
    const manifestEntry = manifestBySrc.get(binding.src);
    return {
      ...binding,
      alt: manifestEntry?.alt ?? "",
      render_status: manifestEntry ? "bound" : "orphan",
    };
  });

  for (const img of manifestImages) {
    if (!bindingBySrc.has(img.src)) {
      entries.push({
        image_id: img.src.split("/").pop()?.replace(".webp", "") ?? img.src,
        src: img.src,
        page_route: "unknown",
        used_component: "none",
        section: img.section,
        block: img.block,
        alt: img.alt,
        render_status: "unbound",
      });
    }
  }

  const boundCount = entries.filter((e) => e.render_status === "bound").length;
  const unboundCount = entries.filter((e) => e.render_status === "unbound").length;
  const orphanCount = entries.filter((e) => e.render_status === "orphan").length;

  return {
    generated_at: new Date().toISOString(),
    version: "V5.5",
    total_manifest_images: manifestImages.length,
    bound_count: boundCount,
    unbound_count: unboundCount,
    orphan_count: orphanCount,
    entries,
  };
}

export function assertAllTrustImagesRendered(): void {
  const unbound = getUnboundTrustImages();
  if (unbound.length === 0) return;

  const details = unbound
    .map((entry) => `${entry.src} (${entry.render_status})`)
    .join(", ");

  throw new Error(
    `[TrustImageBinding V5.5] ${unbound.length} trust image(s) are not fully bound: ${details}`
  );
}

export function validateTrustImageRegistry(): {
  manifestCount: number;
  bindingCount: number;
  sections: readonly string[];
} {
  const manifestImages = collectManifestTrustImages();

  if (manifestImages.length !== TRUST_IMAGE_BINDINGS.length) {
    throw new Error(
      `[TrustImageBinding V5.5] Expected ${TRUST_IMAGE_BINDINGS.length} manifest trust images, found ${manifestImages.length}`
    );
  }

  assertAllTrustImagesRendered();

  return {
    manifestCount: manifestImages.length,
    bindingCount: TRUST_IMAGE_BINDINGS.length,
    sections: TRUST_SECTIONS,
  };
}

if (
  typeof process !== "undefined" &&
  process.env.NODE_ENV === "development" &&
  typeof window === "undefined"
) {
  validateTrustImageRegistry();
}
