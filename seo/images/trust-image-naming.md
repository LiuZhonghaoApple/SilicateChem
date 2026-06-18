# Trust Image SEO Naming Rules — SilicateChem

Factory proof images for trust layer and external backlink uploads.

## On-Site Location

```
public/images/trust/
├── production-line.jpg
├── lab-qc.jpg
├── packaging.jpg
└── export-loading.jpg
```

Used by `FactoryProofGallery` → `/images/trust/{filename}`.

## Naming Convention

| Rule | Example |
|------|---------|
| Lowercase, hyphen-separated | `production-line.jpg` |
| Descriptive of scene, not generic | `lab-qc.jpg` not `image1.jpg` |
| `.jpg` for photos (WebP optional later) | `packaging.jpg` |
| Keyword prefix for external uploads | `sodium-metasilicate-production-line.jpg` |

## Required Alt Text (on-site)

| File | Alt text |
|------|----------|
| `production-line.jpg` | Sodium metasilicate production line at Shandong manufacturing facility |
| `lab-qc.jpg` | Laboratory QC testing for sodium metasilicate batch specifications |
| `packaging.jpg` | Sodium metasilicate packaging and warehouse storage at China factory |
| `export-loading.jpg` | Sodium metasilicate export container loading at Shandong port logistics |

Alt text is defined in `src/content/trust.ts` — update there when replacing photos.

## External Platform Uploads

When uploading to Alibaba, Made-in-China, or directories, use **keyword-rich filenames**:

- `sodium-metasilicate-production-line.jpg`
- `sodium-metasilicate-lab-testing.jpg`
- `sodium-metasilicate-packaging-warehouse.jpg`
- `sodium-metasilicate-export-container-loading.jpg`

Link captions back to: `https://silicatechem.com/products/sodium-metasilicate`

## Image Specs

| Use | Dimensions | Max size |
|-----|------------|----------|
| Trust gallery (on-site) | 1200×675 (16:9) | < 300 KB |
| OG / social | 1200×630 | < 500 KB |
| Marketplace listings | 800×800 min | Platform-specific |

## Replacement Checklist

1. Shoot or obtain real factory photos (production, QC lab, warehouse, container loading)
2. Rename per rules above
3. Replace files in `public/images/trust/`
4. Verify gallery renders (no placeholder fallback)
5. Upload keyword-named copies to B2B platforms per `seo/backlinks/backlink-strategy.md`

## Current Status

Placeholder JPEGs generated for launch readiness. **Replace with real photography before marketing launch.**
