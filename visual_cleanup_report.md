# Visual Cleanup Report

**Date:** 2026-06-18  
**Objective:** Remove all legacy visual proof images that do not support buyer trust for sodium metasilicate manufacturing.  
**Routes audited:** `/`, `/about`, `/factory`, `/products`, `/export`, `/applications`, `/products/[slug]`, `/products/sodium-metasilicate`

---

## Enforcement Mechanism

| Layer | File | Behavior |
|-------|------|----------|
| Allowlist registry | `src/content/trust-visual-allowlist.ts` | Only 6 legacy src paths may render in trust UI |
| Runtime gate | `src/components/trust/VisualTrustImage.tsx` | Non-allowlisted src → `VisualProofPlaceholder` |
| Grid filter | `src/components/trust/HomepageRealImages.tsx` → `DeploymentImageGrid` | Filters inputs; empty → placeholder |
| Placeholder | `src/components/trust/VisualProofPlaceholder.tsx` | *"Authentic factory and product images are being updated."* |

**Allowed images (may render when wired):**

- `/images/home/hero-lab-sodium-metasilicate.webp` — laboratory / product QC
- `/images/home/factory-preview.webp` — factory exterior
- `/images/home/production-01.webp` — factory exterior
- `/images/home/production-02.webp` — factory exterior (aerial campus)
- `/images/about/facility-exterior.webp` — factory exterior
- `/images/products/product-11.webp` — aerial factory campus

All other 39 legacy `.webp` assets are blocked at render time.

---

## Removed Images by Component

| Component | Removed Image | Reason |
|-----------|---------------|--------|
| **HomepageHero** | `hero-01.webp`, `hero-02.webp`, `hero-03.webp` | Generic stock photos — not factory or product |
| **HomepageFactoryProofSection** | `production-03`–`production-08` (prior grid) | Festival banners, Women's Day graphic, award plaques |
| **ProductProofPanel** | `product-02.webp` (per grade hero) | Awards ceremony on stage |
| **ProductProofPanel** | `product-03.webp`, `product-05.webp`, `product-07.webp`, `product-09.webp` (galleries) | Tourism excursion, drum-dance event, Teachers' Day meeting, cultural dance |
| **ProductProofPanel** | `product-04.webp`, `product-06.webp`, `product-08.webp` (other grades) | Community visit, ceremony assembly, showroom tour with people |
| **TrustLayer** → `ProductProofPanel` | All product visual proof images | Replaced with placeholder — fixes homepage award + tourism images in Product Visual Proof |
| **FactoryProofStack** | `line-01`–`line-09.webp` | Team rally, group photos, gala, fireworks, meetings, Labor Day awards ceremony |
| **FactoryProofStack** | `warehouse-staging.webp` | Real-estate showroom — not warehouse |
| **FactoryProofStack** | `production-01`–`production-08` (home strip) | Mixed factory + festival + award images |
| **About page** | `facility-exterior.webp` (hero) | Removed pending curated set — placeholder only |
| **About page** | `production-line.webp` | Showroom tour with people — mislabeled production line |
| **About page** | `plant-operations.webp` | Real-estate event entrance — tourism |
| **Factory page** | `PageVisualBanner` / `PageVisualGrid` / `FactoryImageGallery` | All bound factory + production images |
| **Products hub** | `product-10`–`product-14.webp` | Pool construction, real-estate render, certificate, Women's Day graphic |
| **Products [slug]** | Per-slug hero + gallery (`product-01`–`product-09`) | Group tours, awards, festivals, meetings, showroom |
| **MetasilicateCategoryPage** | Category hero + `FactoryImageGallery` | Group lab tour + factory gallery (all forbidden) |
| **Applications hub** | `product-13`, `product-14` | Certificate plaque, Women's Day graphic |
| **ExportProofMap** | All `export/*` images | Showroom tours, patent screenshot, people in warehouse, drum-dance, conference meeting |
| **ExportShipmentEvidence** | `export-loading-01`–`03.webp` | Showroom, patent screenshot, people walkthrough — direct placeholder (no RSC payload) |
| **ExportPackagingProof** | `bagged-product-01/02`, `warehouse-staging` | Community event, conference meeting, showroom — direct placeholder |
| **ExportLogisticsCapability** | `export-loading-*` (shipping set) | Same forbidden export set — direct placeholder |
| **Export page** | `PageVisualBanner` | Export hero mislabeled images |

---

## Page-Level Summary

| Route | Before | After |
|-------|--------|-------|
| `/` | Hero lab ✓; factory strip with festival/award tiles; Product Visual Proof with award + tourism | Hero lab only; factory section = metrics + coming-soon card; Product Visual Proof = placeholder |
| `/about` | Facility hero + showroom/tourism grid | Two placeholder cards |
| `/factory` | Banner + 10-image production gallery + warehouse | Metrics + placeholder cards |
| `/products` | 5-image product grid | Placeholder |
| `/products/[slug]` | Per-product hero + gallery | Placeholder |
| `/products/sodium-metasilicate` | Category hero + factory gallery | Placeholder |
| `/export` | Banner + 6 export proof images across sections | Placeholder + map/stats (no photos) |
| `/applications` | 2-image grid | Placeholder |

---

## Final Image Counts (Production UI)

Counts reflect **images actually rendered** on buyer-facing pages after cleanup.

### Permitted categories (visible)

| Category | Count | Source |
|----------|------:|--------|
| factory | 0 | Allowlisted factory exteriors held for future use — not displayed yet |
| production | 0 | No verified production-line photos in asset library |
| packaging | 0 | — |
| warehouse | 0 | — |
| loading | 0 | — |
| laboratory | 1 | `HomepageHero` → `hero-lab-sodium-metasilicate.webp` |
| product | 0 | No verified product close-up in asset library |

**Total buyer-facing photos:** 1 (laboratory hero only)

### Forbidden categories (visible)

| Category | Count |
|----------|------:|
| award | **0** |
| tourism | **0** |
| group | **0** |
| festival | **0** |
| people | **0** |

**Forbidden images remaining on production UI: 0** ✓

---

## Asset Library (not deleted from disk)

39 of 45 legacy `.webp` files remain in `public/images/` but are **not referenced** by any buyer-facing component. They are classified in `VISUAL_IMAGE_REGISTRY` and blocked by `isAllowedVisualProofSrc()`.

To permanently remove files from the repo, run a separate asset purge after approved replacements are uploaded.

---

## Verification Checklist

- [x] `npm run build` passes
- [x] `ProductProofPanel` Product Visual Proof → placeholder (no `product-02` award / `product-03` tourism)
- [x] `DeploymentImageGrid` returns placeholder when no allowlisted images
- [x] `VisualTrustImage` blocks non-allowlisted src at runtime
- [x] Homepage hero still uses lab sodium metasilicate image
- [ ] Production deploy + live crawl confirm forbidden URLs absent from HTML

---

## Files Changed

- `src/content/trust-visual-allowlist.ts` (new)
- `src/components/trust/VisualProofPlaceholder.tsx` (new)
- `src/components/trust/VisualTrustImage.tsx`
- `src/components/trust/HomepageRealImages.tsx`
- `src/components/trust/ProductProofPanel.tsx`
- `src/components/trust/FactoryProofStack.tsx`
- `src/components/trust/ExportProofMap.tsx`
- `src/app/about/page.tsx`
- `src/app/factory/page.tsx`
- `src/app/products/page.tsx`
- `src/app/products/[slug]/page.tsx`
- `src/app/export/page.tsx`
- `src/app/applications/page.tsx`
- `src/components/products/MetasilicateCategoryPage.tsx`
