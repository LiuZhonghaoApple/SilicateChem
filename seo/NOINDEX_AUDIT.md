# Noindex Audit — 2026-06-18

Full audit of robots/noindex configuration after Google Search Console reported `/factory` as **Excluded by 'noindex' tag**.

## Sources checked

| Source | Role | Finding |
|--------|------|---------|
| `src/lib/metadata.ts` | `createMetadata()` sets `robots: { index: !noIndex, follow: true }` | **PASS** — default `noIndex = false` |
| `src/app/layout.tsx` | Root layout metadata | **PASS** — `robots: { index: true, follow: true }` |
| `src/app/robots.ts` | `robots.txt` | **PASS** — allows `/`, disallows only `/api/` |
| `src/app/sitemap.ts` | Sitemap generation | **FIXED** — `/factory` added (was missing) |
| Per-page `createMetadata({ noIndex })` | Page-level override | **FIXED** — removed from `/factory` only |

No other noindex injection points found (no `<meta name="robots">` in components, no X-Robots-Tag headers, no middleware).

---

## Route audit

### Indexable routes (PASS)

| Route | noIndex source | Sitemap | Expected robots meta |
|-------|----------------|---------|----------------------|
| `/` | none (default) | yes (0.95) | `index, follow` |
| `/products/sodium-metasilicate` | none | yes (1.0) | `index, follow` |
| `/products` | none | yes (0.85) | `index, follow` |
| `/products/sodium-metasilicate-granules` | none | yes (0.9) | `index, follow` |
| `/products/sodium-metasilicate-anhydrous` | none | yes (0.9) | `index, follow` |
| `/products/sodium-metasilicate-pentahydrate` | none | yes (0.9) | `index, follow` |
| `/products/sodium-silicate` | none | yes (0.9) | `index, follow` |
| `/guides` | none | yes (0.75) | `index, follow` |
| `/guides/supplier-selection` | none | yes (0.8) | `index, follow` |
| `/guides/price-factors` | none | yes (0.8) | `index, follow` |
| `/guides/uses-detergent` | none | yes (0.8) | `index, follow` |
| `/guides/sodium-metasilicate-vs-soda-ash` | none | yes (0.8) | `index, follow` |
| `/guides/how-to-choose-china-factory` | none | yes (0.8) | `index, follow` |
| `/applications` | none | yes (0.65) | `index, follow` |
| `/applications/detergent-industry` | none | yes (0.6) | `index, follow` |
| `/applications/water-treatment` | none | yes (0.6) | `index, follow` |
| `/applications/textile-industry` | none | yes (0.6) | `index, follow` |
| `/applications/paper-industry` | none | yes (0.6) | `index, follow` |
| `/factory` | **was** `noIndex: true` in page metadata | **FIXED** — yes (0.7) | **FIXED** → `index, follow` |
| `/contact` | none | yes (0.7) | `index, follow` |
| `/about` | none | yes (0.7) | `index, follow` |
| `/faq` | none | yes (0.7) | `index, follow` |

### Intentionally noindex (PASS)

| Route | noIndex source | Sitemap | Expected robots meta |
|-------|----------------|---------|----------------------|
| `/blog` | `noIndex: true` in `src/app/blog/page.tsx` | excluded | `noindex, follow` |
| `/blog/detergent-industry-metasilicate` | `noIndex: true` in `src/app/blog/[slug]/page.tsx` | excluded | `noindex, follow` |
| `/blog/water-treatment-metasilicate` | same | excluded | `noindex, follow` |
| `/blog/china-metasilicate-procurement` | same | excluded | `noindex, follow` |

---

## Issues found and fixed

### CRITICAL — `/factory` (fixed)

- **Symptom:** Google Search Console — "Excluded by 'noindex' tag"
- **Cause:** `noIndex: true` passed to `createMetadata()` in `src/app/factory/page.tsx` (added during SEO indexing optimization on 2026-06-18)
- **Scope:** Affected **only** `/factory` — no other money pages inherited this flag
- **Fix:** Removed `noIndex: true` from factory page metadata
- **Sitemap:** Added `/factory` to `INDEXABLE_STATIC` with priority **0.7**

### WARNING — stale SEO docs (not code)

These docs still describe factory as noindex; update when convenient:

- `seo/google-indexing-guide.md` — lists `/factory` as excluded
- `seo/launch-checklist.md` — lists `/factory` as not in sitemap
- `seo/PROJECT_STATUS_AUDIT.md` — mixed historical noindex notes for applications

---

## Expected metadata after fix

Next.js emits `<meta name="robots" content="…">` from the `robots` field in page metadata.

| Page type | `robots` object | HTML meta content |
|-----------|-----------------|-------------------|
| Money pages, guides, applications, factory, static | `{ index: true, follow: true }` | `index, follow` |
| Blog index + posts | `{ index: false, follow: true }` | `noindex, follow` |

Child page metadata overrides root layout; blog and factory pages use `createMetadata()` which sets explicit `robots`.

---

## Verification checklist

- [ ] Deploy and request re-index of `/factory` in Google Search Console
- [ ] Confirm Coverage report shows `/factory` as "Indexed" (may take days)
- [ ] Confirm `/blog` and `/blog/*` remain "Excluded by noindex tag"
- [ ] Resubmit `sitemap.xml` after deploy so `/factory` URL is discovered
