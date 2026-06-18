# Trust Image SEO Naming Rules — SilicateChem

Factory proof images for the 3-layer trust system (`src/lib/trust/image-strategy.ts`).

## On-Site Location

```
public/images/factory/
├── sodium-metasilicate-factory-production.jpg   (real — layer 1)
├── sodium-metasilicate-factory-lab.jpg
├── sodium-metasilicate-factory-warehouse.jpg
├── sodium-metasilicate-factory-packaging.jpg
├── sodium-metasilicate-factory-shipping.jpg
├── sodium-metasilicate-ai-production.jpg        (AI fallback — layer 2)
├── sodium-metasilicate-ai-lab.jpg
├── sodium-metasilicate-ai-warehouse.jpg
├── sodium-metasilicate-ai-packaging.jpg
├── sodium-metasilicate-ai-shipping.jpg
└── sodium-metasilicate-factory-aerial.jpg       (future — layer 3)
```

Resolved by `TrustImageMapper` → `/images/factory/{filename}` with `data-image-source` tracking.

## Naming Convention

| Rule | Example |
|------|---------|
| Real assets | `sodium-metasilicate-factory-{category}.jpg` |
| AI placeholders | `sodium-metasilicate-ai-{category}.jpg` |
| Future real slots | `sodium-metasilicate-factory-aerial.jpg` |
| Categories | `production`, `lab`, `warehouse`, `packaging`, `shipping` |

## Required Alt Text

Alt text is defined in `src/lib/trust/image-strategy.ts`:

| Category | Real asset alt (keywords) |
|----------|---------------------------|
| production | Sodium metasilicate production line at Shandong China manufacturing facility |
| lab | Laboratory QC testing for sodium metasilicate batch specifications at China factory |
| warehouse | Sodium metasilicate warehouse storage at Shandong China factory |
| packaging | Sodium metasilicate packaging line at China chemical manufacturing facility |
| shipping | Sodium metasilicate export container loading at Shandong port logistics |

AI placeholder alt text uses **"Illustrative"** prefix — never misrepresented as real photography.

## Image Resolution Priority

1. **REAL_ASSETS** (priority 1) — lgwjg.com legacy photos, renamed
2. **AI_PLACEHOLDERS** (priority 2) — fallback if real file fails to load
3. **FUTURE_REAL** (priority 3) — reserved slots for upcoming on-site photography

## External Platform Uploads

When uploading to Alibaba, Made-in-China, or directories, use keyword-rich filenames:

- `sodium-metasilicate-production-line.jpg`
- `sodium-metasilicate-lab-testing.jpg`
- `sodium-metasilicate-packaging-warehouse.jpg`
- `sodium-metasilicate-export-container-loading.jpg`

Link captions back to: `https://silicatechem.com/products/sodium-metasilicate`

## Image Specs

| Use | Dimensions | Max size |
|-----|------------|----------|
| Trust gallery (on-site) | 1200×675 (16:9) | < 300 KB (real), AI may be larger |
| OG / social | 1200×630 | < 500 KB |
| Marketplace listings | 800×800 min | Platform-specific |

## Replacement Checklist

1. Shoot or obtain real factory photos per category
2. Rename per `sodium-metasilicate-factory-{category}.jpg` convention
3. Replace files in `public/images/factory/`
4. Verify gallery renders with `data-image-source="real"`
5. Upload keyword-named copies to B2B platforms per `seo/backlinks/backlink-strategy.md`

## Current Status

Layer 1 real assets migrated from lgwjg.com (renamed). Layer 2 AI placeholders available as fallback. Layer 3 aerial slot reserved.
