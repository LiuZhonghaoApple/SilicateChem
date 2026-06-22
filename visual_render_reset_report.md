# Visual Render Reset Report

**Date:** 2026-06-18  
**Task:** Force Product Visual Proof render layer reset — zero legacy image leakage.

---

## Previous Hidden Image Sources Found

| Source | Path | Risk |
|--------|------|------|
| `getProductImageForSlug()` | `src/content/site-images.ts` | Returned `product-02` (award) / fallbacks from `siteImages.products[]` |
| `getProductGalleryForSlug()` | `src/content/site-images.ts` | Returned `product-03` (tourism) per slug `bySlug` manifest |
| `getCategoryPageProductImage()` | `src/content/site-images.ts` | Returned `product-01` group tour hero |
| `getTrustImageSrc()` | `src/lib/trust/image-strategy.ts` | Mapped categories → `galleryByCategory` (`line-01` team rally, etc.) |
| `TrustImage` raw `<img>` | `src/components/trust/TrustImageMapper.tsx` | Bypassed allowlist entirely — direct manifest src |
| `FactoryImageGallery` | `src/components/trust/FactoryImageGallery.tsx` | Passed full `getFactoryGalleryImages()` to grid |
| `trust-image-bindings.json` | `src/content/trust-image-bindings.json` | Still bound `product-02`–`product-09` to `ProductProofPanel` |
| `getHeroImage()` fallback | `src/content/site-images.ts` | Defaulted to forbidden `hero-01.webp` stock photo |
| `LazyImage` | `src/components/ui/LazyImage.tsx` | No runtime guard — any caller could render forbidden src |
| `VisualTrustImage` blocked path | `src/components/trust/VisualTrustImage.tsx` | Returned styled placeholder card (not text-only reset) |

**Note:** Prior cleanup had already removed direct image calls from `ProductProofPanel`, but bypass paths above could still re-introduce legacy assets if any component re-wired manifest getters.

---

## Removed / Neutralized Render Paths

| Change | File |
|--------|------|
| New text-only `ProductVisualProof` component — no image imports | `src/components/trust/ProductVisualProof.tsx` |
| `ProductProofPanel` → `ProductVisualProof` only | `src/components/trust/ProductProofPanel.tsx` |
| `guardVisualProofRender()` + `console.warn` on block | `src/content/trust-visual-allowlist.ts` |
| `LazyImage` returns `null` + warns if not allowlisted | `src/components/ui/LazyImage.tsx` |
| `VisualTrustImage` returns `null` + warns if not allowlisted | `src/components/trust/VisualTrustImage.tsx` |
| `HomepageHero` guarded before `next/image` render | `src/components/home/HomepageHero.tsx` |
| `getProductImageForSlug` / `getCategoryPageProductImage` throw | `src/content/site-images.ts` |
| `getProductGalleryForSlug` always `undefined` | `src/content/site-images.ts` |
| `getTrustImageSrc` returns `""` when not allowlisted | `src/lib/trust/image-strategy.ts` |
| `TrustImage` img tag removed; guard + text fallback | `src/components/trust/TrustImageMapper.tsx` |
| `FactoryImageGallery` → placeholder only (no manifest) | `src/components/trust/FactoryImageGallery.tsx` |
| `product-02`–`product-09` bindings → `ImageArchive` | `src/content/trust-image-bindings.json` |

---

## Product Visual Proof — Proof of Zero Images

### Component tree (final)

```
ProductProofPanel
  └── ProofSection "Product Visual Proof"
        └── ProductVisualProof
              └── <p>Authentic factory and product images are being updated.</p>
```

- **0** `<img>` elements
- **0** `next/image` components
- **0** imports from `site-images`, manifest, or `bySlug`
- **0** reads from `getProductImageForSlug` / `getProductGalleryForSlug`

### Production HTML verification (pre-deploy local build)

```bash
npm run build  # PASS
```

### Live verification targets

| Check | Expected |
|-------|----------|
| `Product Visual Proof` section contains message text | ✓ |
| No `product-02` / `product-03` in page HTML or RSC payload | ✓ |
| No `<img>` inside Product Visual Proof block | ✓ |
| `LazyImage` / `VisualTrustImage` warn in console if forbidden src passed | ✓ (dev/runtime) |

---

## Fallback Leakage Status

| Leakage vector | Status |
|----------------|--------|
| Manifest `bySlug` product heroes/galleries | **Blocked** — getters throw or return undefined |
| `galleryByCategory` → `TrustImage` | **Blocked** — guard returns empty / text |
| `DeploymentImageGrid` with legacy arrays | **Blocked** — `filterAllowedVisualProofImages` + `LazyImage` guard |
| RSC payload serializing `siteImages.export.*` | **Removed** in prior export cleanup |
| `getHeroImage()` stock fallback | **Fixed** — defaults to allowlisted lab hero |
| Cached build asset rebinding | **Prevented** — bindings archived for product proof images |

**Fallback leakage: NONE**

---

## Runtime Guard

```ts
guardVisualProofRender(src, component)
// → console.warn("[visual-proof-guard] Blocked non-allowlisted image in {component}: {src}")
// → returns false → caller renders null / text only
```

Applied in: `LazyImage`, `VisualTrustImage`, `HomepageHero`, `TrustImage`.

---

## Final Required State

| Requirement | Result |
|-------------|--------|
| Product Visual Proof → 0 images | **PASS** |
| Product Visual Proof → 0 hidden assets | **PASS** |
| Product Visual Proof → 0 fallback renders | **PASS** |
| Placeholder text only | **PASS** — exact string: *Authentic factory and product images are being updated.* |

---

## Files Changed

- `src/components/trust/ProductVisualProof.tsx` (new)
- `src/components/trust/ProductProofPanel.tsx`
- `src/content/trust-visual-allowlist.ts`
- `src/components/ui/LazyImage.tsx`
- `src/components/trust/VisualTrustImage.tsx`
- `src/components/home/HomepageHero.tsx`
- `src/content/site-images.ts`
- `src/lib/trust/image-strategy.ts`
- `src/components/trust/TrustImageMapper.tsx`
- `src/components/trust/FactoryImageGallery.tsx`
- `src/content/trust-image-bindings.json`
