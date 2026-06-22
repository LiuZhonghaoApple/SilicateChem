# Image System Shutdown Report

**Date:** 2026-06-18  
**Mode:** `IMAGE_SYSTEM_MODE = "PENDING"`  
**Objective:** Safe shutdown of all buyer-facing image rendering without breaking layout, metrics, CTAs, or text content.

---

## Global Control

| Item | Location | Behavior |
|------|----------|----------|
| `IMAGE_SYSTEM_MODE` | `src/lib/image-system.ts` | `"PENDING"` — blocks all image renders |
| `isImageSystemPending()` | `src/lib/image-system.ts` | `true` while pending |
| `isImageRenderingEnabled()` | `src/lib/image-system.ts` | `false` while pending |
| Unified placeholder | `src/components/trust/VisualAssetPendingNotice.tsx` | Single message for all image zones |

**Placeholder text:**  
*"Visual assets are being updated. Factory and product images will be restored soon."*

To re-enable images later: set `IMAGE_SYSTEM_MODE = "ACTIVE"` in `src/lib/image-system.ts`.

---

## Modules Disabled (Image Rendering Off)

| Module | File | Layout preserved |
|--------|------|------------------|
| Homepage hero visual column | `HomepageHero.tsx` | ✓ headline, CTAs, grid |
| Homepage factory proof | `HomepageFactoryProofSection.tsx` | ✓ metrics, badge, link |
| Product Visual Proof | `ProductVisualProof.tsx` | ✓ inside ProductProofPanel |
| Factory proof stack | `FactoryProofStack.tsx` | ✓ metrics, badge, area cards |
| Export proof map | `ExportProofMap.tsx` | ✓ world map, stats, country list |
| Export shipment / packaging / logistics | `ExportShipmentEvidence.tsx`, etc. | ✓ stats, bullet lists |
| Hero carousel / image strip / grids | `HomepageRealImages.tsx` | ✓ returns notice only |
| Factory image gallery | `FactoryImageGallery.tsx` | ✓ section header shell |
| Trust image mapper | `TrustImageMapper.tsx` | ✓ caption shell when active |
| Lazy image primitive | `LazyImage.tsx` | returns `null` |
| Visual trust image | `VisualTrustImage.tsx` | returns `VisualAssetPendingNotice` |
| Allowlist gate | `trust-visual-allowlist.ts` | all src blocked when pending |

**Pages using placeholder (via `VisualAssetPendingNotice` or `VisualProofPlaceholder` alias):**  
`/`, `/about`, `/factory`, `/products`, `/products/[slug]`, `/products/sodium-metasilicate`, `/export`, `/applications`

---

## Data Layer Neutralized (No Runtime Image Arrays)

| Path | Change |
|------|--------|
| `site-images.ts` getters | Return `[]` / `""` when pending |
| `getProductImageForSlug` / `getCategoryPageProductImage` | Throw — slug mapping disabled |
| `getProductGalleryForSlug` | Always `undefined` |
| `getHeroImage()` | Returns `""` when pending |
| `filterAllowedVisualProofImages` | Returns `[]` when pending |
| `isAllowedVisualProofSrc` | Returns `false` when pending |
| `assertImageDeployment()` | Skipped when pending |
| `validateTrustImageRegistry()` | Skipped when pending |

Manifest JSON files remain on disk for future activation but are **not read into render paths** while pending.

---

## Verification

| Check | Result |
|-------|--------|
| `npm run build` | **PASS** (37 static routes) |
| Active `<img>` / `next/image` in UI components | **0** (`HomepageHero` no longer imports `next/image`) |
| Broken `/images/*.webp` URLs in rendered HTML | **0** (no image elements emitted) |
| Section layouts (metrics, CTAs, TrustLayer blocks) | **Intact** |
| Placeholder system active site-wide | **YES** — `data-image-system="pending"` on notice component |

### Routes audited

- `/` — hero notice + factory metrics + TrustLayer text blocks  
- `/about`, `/factory`, `/products`, `/export` — notice zones only  
- `/products/sodium-metasilicate-granules` — Product Visual Proof notice only  

---

## What Was NOT Removed

- Section headers, grids, and card layouts  
- Factory metrics (capacity, equipment, employees)  
- Export map SVG, shipment stats, country lists  
- RFQ / quote CTAs and inquiry forms  
- TrustLayer segmentation (no image dependency)  
- `public/images/` files on disk (archived, not deleted)  
- SEO metadata references (`og-image.svg`, `logo.svg` in JSON-LD only — not rendered as page images)

---

## Files Changed

- `src/lib/image-system.ts` (new)
- `src/components/trust/VisualAssetPendingNotice.tsx` (new)
- `src/components/trust/VisualProofPlaceholder.tsx` (alias)
- `src/components/trust/ProductVisualProof.tsx`
- `src/components/home/HomepageHero.tsx`
- `src/components/home/HomepageFactoryProofSection.tsx`
- `src/components/trust/HomepageRealImages.tsx`
- `src/components/trust/VisualTrustImage.tsx`
- `src/components/ui/LazyImage.tsx`
- `src/content/trust-visual-allowlist.ts`
- `src/content/site-images.ts`
- `src/content/trust-image-validation.ts`
- `src/components/trust/FactoryProofStack.tsx`
- `src/components/trust/FactoryImageGallery.tsx`
- `src/components/trust/ExportProofMap.tsx`
- `src/components/trust/ExportShipmentEvidence.tsx`
- `src/components/trust/ExportPackagingProof.tsx`
- `src/components/trust/ExportLogisticsCapability.tsx`
- `src/components/trust/TrustImageMapper.tsx`

---

## Final State

| Requirement | Status |
|-------------|--------|
| Zero active image renders | **PASS** |
| Zero broken image URLs in UI | **PASS** |
| UI layout intact | **PASS** |
| Placeholder system active | **PASS** |
| Website fully functional (navigation, RFQ, content) | **PASS** |
