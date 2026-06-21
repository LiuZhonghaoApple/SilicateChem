# Content Audit Report — Company Naming

**Date:** 2026-06-21  
**Branch:** `feature/real-company-images`  
**Canonical company name:** Shandong Zhongzhi Chemical Technology Co., Ltd.

---

## Executive Summary

A full content audit was performed across the website source (`src/`), SEO metadata, JSON-LD structured data, layout components, and content modules. The site already used the correct legal company name in `SITE.company`; the main issues were **legacy Longgang references** in the footer, About metadata, FAQ, JSON-LD `alternateName`, and a shared `formerCompany` constant that propagated the old name into user-facing areas.

All user-facing company references now use **Shandong Zhongzhi Chemical Technology Co., Ltd.** via `SITE.company`. Manufacturing experience and silicate industry background are preserved in About Us and FAQ copy without repeating the former brand outside About.

**Longgang placement:** Verified — **one occurrence only**, in About Us company history (`src/content/company.ts`, first history paragraph). Removed from navigation, headers, footers, contact sections, metadata, page titles, FAQ, and JSON-LD.

---

## Files Scanned

### Source application (`src/`)

| Area | Files |
|------|-------|
| Constants & metadata | `src/lib/constants.ts`, `src/lib/metadata.ts`, `src/lib/seo-keywords.ts` |
| Content modules | `src/content/company.ts`, `src/content/faq.ts`, `src/content/trust.ts`, `src/content/sodium-metasilicate-category.ts`, `src/content/guides/intent-pages.ts`, `src/content/factory-trust.ts`, `src/content/products/index.ts`, `src/content/applications/industries.ts`, `src/content/blog/posts.ts` |
| Pages | `src/app/page.tsx`, `src/app/about/page.tsx`, `src/app/contact/page.tsx`, `src/app/factory/page.tsx`, `src/app/products/sodium-metasilicate/page.tsx`, `src/app/layout.tsx`, all other `src/app/**/page.tsx` |
| Layout & contact | `src/components/layout/Header.tsx`, `Footer.tsx`, `FooterContact.tsx`, `FastContactBar.tsx`, `ContactDirectLinks.tsx` |
| SEO & trust | `src/components/seo/JsonLd.tsx`, `FunnelSections.tsx`, `src/components/trust/*.tsx` |

### Out of scope (documented, not modified)

| Area | Notes |
|------|-------|
| `scripts/export_lgwjg_images.py`, `lgwjg_image_export/` | Internal asset pipeline; lgwjg.com crawl tooling — not user-facing website content |
| `seo/pdfs/*.md`, `seo/backlinks/` | PDF templates already use full legal name; no Longgang in customer PDFs |
| `CHANGELOG_AI.md`, `AI_TASKS.md`, `AI_REVIEW.md`, `README.md` | Internal/dev documentation |
| `seo/images/trust-image-naming.md` | Internal image migration notes referencing lgwjg.com source |

---

## Issues Found & Changes Made

### 1. Shared constant propagated former company name

| | |
|---|---|
| **File** | `src/lib/constants.ts` |
| **Before** | `formerCompany: "Shandong Longgang Silicon Industry Technology Co., Ltd."` |
| **After** | Removed `formerCompany`; single source of truth remains `SITE.company` |

### 2. Footer displayed former company name

| | |
|---|---|
| **File** | `src/components/layout/Footer.tsx` |
| **Before** | `Formerly: {SITE.formerCompany}` in footer copyright bar |
| **After** | Line removed; footer shows only `© {year} {SITE.company}. All rights reserved.` |

### 3. About page metadata referenced Longgang

| | |
|---|---|
| **File** | `src/app/about/page.tsx` |
| **Before** | Meta description: `"...Formerly Longgang Silicon Industry..."` |
| **After** | `` `${SITE.company} — sodium metasilicate manufacturer in Shandong, China. Factory-direct export supply.` `` |

### 4. About history used formerCompany in multiple sentences

| | |
|---|---|
| **File** | `src/content/company.ts` |
| **Before** | History paragraph referenced `${SITE.formerCompany}` inline with rebrand copy |
| **After** | **One** historical sentence naming Shandong Longgang Silicon Industry Technology Co., Ltd.; subsequent paragraphs describe continued production under `${SITE.company}` at the same Shandong facility |

### 5. FAQ exposed Longgang in question and answer

| | |
|---|---|
| **File** | `src/content/faq.ts` |
| **Before** | Q: "What is the relationship to Shandong Longgang Silicon Industry?" with Longgang in answer |
| **After** | Q: "How long has your Shandong facility manufactured sodium metasilicate?" — answer references decades of silicate experience and `${SITE.company}` with no Longgang mention |

### 6. JSON-LD Organization schema used former name as alternateName

| | |
|---|---|
| **File** | `src/components/seo/JsonLd.tsx` |
| **Before** | `alternateName: SITE.formerCompany` (Longgang legal name in structured data on every page) |
| **After** | `alternateName: SITE.name` (`SilicateChem` brand alias only) |

### 7. Shortened company name variants

Replaced hardcoded `"Shandong Zhongzhi Chemical"` (without full legal suffix) with `SITE.company` or template literals:

| File | Change |
|------|--------|
| `src/lib/seo-keywords.ts` | Homepage meta description |
| `src/app/contact/page.tsx` | Contact page meta description |
| `src/app/products/sodium-metasilicate/page.tsx` | Footer cross-link paragraph |
| `src/content/trust.ts` | Factory trust pillar copy |
| `src/components/seo/FunnelSections.tsx` | Product funnel banner |
| `src/content/sodium-metasilicate-category.ts` | Category FAQ answer |
| `src/content/guides/intent-pages.ts` | Two guide body paragraphs |

---

## Longgang Placement Verification

Post-change grep of `src/` for `Longgang|longgang|formerCompany|lgwjg|龙岗`:

```
src/content/company.ts:6 — single match in About Us history (Company Background section)
```

| Location | Longgang present? |
|----------|-------------------|
| Navigation (`Header.tsx`, `NAV_LINKS`) | No |
| Headers / hero labels | No — uses `SITE.company` |
| Footer | No — former line removed |
| Contact page & `ContactDirectLinks` | No — uses `SITE.company` |
| Page titles & meta descriptions | No |
| FAQ (visible + FAQ schema) | No |
| JSON-LD Organization schema | No |
| About Us body (`/about`) | **Yes — once** (historical background sentence) |

---

## Remaining Items (Non–User-Facing)

These do **not** affect live website content but remain in the repository for internal reference:

1. **`scripts/export_lgwjg_images.py`** — crawls lgwjg.com for image export; not rendered on site.
2. **`lgwjg_image_export/`** — exported image assets from legacy site crawl.
3. **`seo/images/trust-image-naming.md`** — documents image provenance from lgwjg.com.
4. **`AI_TASKS.md` line 293** — internal task spec mentioning former company name.
5. **`public/images/factory/.gitkeep`** — comment referencing lgwjg.com legacy assets.

No action required unless you want internal docs/scripts renamed for consistency.

---

## Files Changed (This Audit)

1. `src/lib/constants.ts`
2. `src/content/company.ts`
3. `src/components/layout/Footer.tsx`
4. `src/app/about/page.tsx`
5. `src/content/faq.ts`
6. `src/components/seo/JsonLd.tsx`
7. `src/lib/seo-keywords.ts`
8. `src/app/contact/page.tsx`
9. `src/app/products/sodium-metasilicate/page.tsx`
10. `src/content/trust.ts`
11. `src/components/seo/FunnelSections.tsx`
12. `src/content/sodium-metasilicate-category.ts`
13. `src/content/guides/intent-pages.ts`
14. `content_audit_report.md` (this file)

---

## Confirmation

- **Canonical name everywhere user-facing:** Shandong Zhongzhi Chemical Technology Co., Ltd. (`SITE.company`)
- **Longgang in About Us only:** Yes — exactly one sentence in `company.history[0]`
- **Manufacturing / silicate heritage preserved:** Yes — About history, FAQ manufacturing tenure answer, factory copy unchanged in substance
- **Layout unchanged:** No structural or styling modifications
