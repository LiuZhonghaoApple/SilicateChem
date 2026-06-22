import manifest from "@/content/site-images.manifest.json";
import bindings from "@/content/trust-image-bindings.json";

export type ImageDeploymentBinding = {
  image_id: string;
  src: string;
  page_route: string;
  used_component: string;
  section: string;
  block: string;
};

export type ImageDeploymentEntry = ImageDeploymentBinding & {
  deployPath: string;
  status: "bound" | "orphan";
};

export type ImageDeploymentReport = {
  generatedAt: string;
  totalImages: number;
  boundCount: number;
  orphanCount: number;
  entries: ImageDeploymentEntry[];
};

/** Dev-only visual debug — set true to show mount labels on every deployed image. */
export const ENABLE_IMAGE_VISUAL_DEBUG =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_IMAGE_VISUAL_DEBUG !== "false";

export const IMAGE_DEPLOYMENT_BINDINGS = bindings as ImageDeploymentBinding[];

const bindingBySrc = new Map(
  IMAGE_DEPLOYMENT_BINDINGS.map((b) => [b.src, b] as const)
);

/** Unique manifest image src paths (45 assets). */
export function getManifestImageSrcs(): string[] {
  const srcs = new Set<string>();

  for (const entry of manifest.home.hero) srcs.add(entry.src);
  if (manifest.home.factoryPreview) srcs.add(manifest.home.factoryPreview.src);
  for (const entry of manifest.home.production) srcs.add(entry.src);
  for (const entry of manifest.about) srcs.add(entry.src);
  for (const entry of manifest.factory) srcs.add(entry.src);
  for (const entry of manifest.products) srcs.add(entry.src);
  for (const entry of manifest.export.packaging) srcs.add(entry.src);
  for (const entry of manifest.export.shipping) srcs.add(entry.src);
  for (const entry of manifest.certifications as { src: string }[]) srcs.add(entry.src);

  return [...srcs].sort();
}

export function getBindingForSrc(src: string): ImageDeploymentBinding | undefined {
  return bindingBySrc.get(src);
}

export function generateImageDeploymentReport(): ImageDeploymentReport {
  const manifestSrcs = getManifestImageSrcs();
  const boundSrcs = new Set(IMAGE_DEPLOYMENT_BINDINGS.map((b) => b.src));

  const entries: ImageDeploymentEntry[] = IMAGE_DEPLOYMENT_BINDINGS.map((binding) => ({
    ...binding,
    deployPath: binding.src,
    status: manifestSrcs.includes(binding.src) ? "bound" : "orphan",
  }));

  const manifestOrphans = manifestSrcs.filter((src) => !boundSrcs.has(src));
  for (const src of manifestOrphans) {
    entries.push({
      image_id: src.split("/").pop()?.replace(".webp", "") ?? src,
      src,
      page_route: "unmapped",
      used_component: "none",
      section: "unknown",
      block: "unknown",
      deployPath: src,
      status: "orphan",
    });
  }

  const boundCount = entries.filter((e) => e.status === "bound").length;
  const orphanCount = entries.filter((e) => e.status === "orphan").length;

  return {
    generatedAt: new Date().toISOString(),
    totalImages: manifestSrcs.length,
    boundCount,
    orphanCount,
    entries: entries.sort((a, b) => a.src.localeCompare(b.src)),
  };
}

export type ImageDeploymentValidation = {
  ok: boolean;
  manifestCount: number;
  bindingCount: number;
  orphanCount: number;
  missingBindings: string[];
  extraBindings: string[];
  errors: string[];
};

/** Dev/build guard — every manifest asset must have a UI binding. */
export function validateImageDeployment(): ImageDeploymentValidation {
  const manifestSrcs = getManifestImageSrcs();
  const boundSrcs = IMAGE_DEPLOYMENT_BINDINGS.map((b) => b.src);
  const boundSet = new Set(boundSrcs);

  const missingBindings = manifestSrcs.filter((src) => !boundSet.has(src));
  const manifestSet = new Set(manifestSrcs);
  const extraBindings = boundSrcs.filter((src) => !manifestSet.has(src));

  const errors: string[] = [];
  if (manifestSrcs.length !== 45) {
    errors.push(`Expected 45 manifest images, found ${manifestSrcs.length}`);
  }
  if (IMAGE_DEPLOYMENT_BINDINGS.length !== 45) {
    errors.push(`Expected 45 bindings, found ${IMAGE_DEPLOYMENT_BINDINGS.length}`);
  }
  if (missingBindings.length > 0) {
    errors.push(`Unbound manifest images: ${missingBindings.join(", ")}`);
  }
  if (extraBindings.length > 0) {
    errors.push(`Bindings without manifest entry: ${extraBindings.join(", ")}`);
  }

  for (const binding of IMAGE_DEPLOYMENT_BINDINGS) {
    if (!binding.page_route || !binding.used_component) {
      errors.push(`Incomplete binding for ${binding.src}`);
    }
  }

  const orphanCount = missingBindings.length + extraBindings.length;

  return {
    ok: errors.length === 0,
    manifestCount: manifestSrcs.length,
    bindingCount: IMAGE_DEPLOYMENT_BINDINGS.length,
    orphanCount,
    missingBindings,
    extraBindings,
    errors,
  };
}

export function assertImageDeployment(): void {
  const result = validateImageDeployment();
  if (!result.ok) {
    const message = `[image-deployment] Validation failed:\n${result.errors.join("\n")}`;
    if (process.env.NODE_ENV === "development") {
      console.error(message);
    } else {
      throw new Error(message);
    }
  }
}
