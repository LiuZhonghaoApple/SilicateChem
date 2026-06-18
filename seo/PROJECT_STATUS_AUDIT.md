# SilicateChem — Project Status Audit

**Date:** 2026-06-18  
**Scope:** SEO RFQ acquisition system — codebase scan (read-only audit)  
**Domain:** https://silicatechem.com  
**Authority sink:** `/products/sodium-metasilicate`

---

## Executive Summary

The **SEO RFQ system architecture is implemented** across four funnel layers (money pages → applications → guides → blog). Conversion components (RFQ form, sticky bar, floating widget, contextual pre-fill) are in place. Trust layer components are integrated on key pages. **Launch blockers remain:** real images, production email delivery, analytics/CRM lead tracking, certified MSDS, and local production build verification.

| Area | Status |
|------|--------|
| SEO page structure | ✔ Complete |
| 4-layer funnel architecture | ✔ Complete |
| Conversion / RFQ UI | ✔ Complete |
| Lead delivery & tracking | ⚠ Partial |
| SEO infrastructure | ✔ Complete |
| Trust layer (code) | ✔ Complete |
| Trust layer (assets) | ⚠ Partial |
| Internal linking funnel | ⚠ Partial |
| Off-site backlink docs | ✔ Complete |
| Human review approvals | ❌ Missing (REVIEW-006–009 pending) |

---

## A. SEO System Status

### A.1 Pages Inventory

#### `/products/*`

| Route | Status | Notes |
|-------|--------|-------|
| `/products` | ✔ Implemented | Hub with metadata, breadcrumbs, CTAs |
| `/products/sodium-metasilicate` | ✔ Implemented | **Primary money page** — full conversion + trust verification |
| `/products/sodium-metasilicate-granules` | ✔ Implemented | Specs, conversion sections, inquiry form |
| `/products/sodium-metasilicate-anhydrous` | ✔ Implemented | Specs, conversion sections, inquiry form |
| `/products/sodium-metasilicate-pentahydrate` | ✔ Implemented | Specs, conversion sections, inquiry form |
| `/products/sodium-silicate` | ✔ Implemented | Specs, conversion sections, inquiry form |

**Placeholder elements:** Product/factory images use `ImagePlaceholder` (dashed border UI). Content is real TypeScript copy — not lorem ipsum.

#### `/applications/*`

| Route | Status | Notes |
|-------|--------|-------|
| `/applications` | ✔ Implemented | Index — **noindex** |
| `/applications/detergent-industry` | ✔ Implemented | Mid-funnel — **noindex** |
| `/applications/water-treatment` | ✔ Implemented | Mid-funnel — **noindex** |
| `/applications/textile-industry` | ✔ Implemented | Mid-funnel — **noindex** |
| `/applications/paper-industry` | ✔ Implemented | Mid-funnel — **noindex** |

#### `/guides/*`

| Route | Status | Notes |
|-------|--------|-------|
| `/guides` | ✔ Implemented | Index — indexed |
| `/guides/supplier-selection` | ✔ Implemented | Commercial intent |
| `/guides/price-factors` | ✔ Implemented | Commercial intent |
| `/guides/uses-detergent` | ✔ Implemented | Commercial intent |
| `/guides/sodium-metasilicate-vs-soda-ash` | ✔ Implemented | Commercial intent |
| `/guides/how-to-choose-china-factory` | ✔ Implemented | Commercial intent |

#### `/blog/*`

| Route | Status | Notes |
|-------|--------|-------|
| `/blog` | ✔ Implemented | Supporting layer — indexed, low priority |
| `/blog/detergent-industry-metasilicate` | ✔ Implemented | Short support article |
| `/blog/water-treatment-metasilicate` | ✔ Implemented | Short support article |
| `/blog/china-metasilicate-procurement` | ✔ Implemented | Short support article |

#### Other static routes

| Route | Status |
|-------|--------|
| `/` (homepage) | ✔ Implemented |
| `/about` | ✔ Implemented |
| `/factory` | ✔ Implemented |
| `/faq` | ✔ Implemented |
| `/contact` | ✔ Implemented |

**Total app routes:** 14 `page.tsx` files → ~26 unique URLs in sitemap.

### A.2 SEO Architecture (`src/lib/seo-funnel.ts`)

| Item | Status |
|------|--------|
| 4-layer funnel constants | ✔ Complete |
| Authority sink definition | ✔ `/products/sodium-metasilicate` |
| Keyword mapping (`seo-keywords.ts`) | ✔ Complete — anti-cannibalization rules |
| Old REVIEW-005 guide slugs | ✔ Removed (replaced by TASK-006 slugs) |

### A.3 Placeholder vs Production-Ready Content

| Element | Status |
|---------|--------|
| Page copy (products, guides, applications) | ✔ Real B2B content |
| Product/factory photos | ❌ Placeholder only (`public/images/` has logo + `.gitkeep`) |
| Factory proof gallery images | ⚠ UI + alt text ready; files missing |
| Contact email | ⚠ `info@silicatechem.com` — verify live |
| WhatsApp | ✔ `+86 18562682380` — `https://wa.me/8618562682380` |
| MSDS (site + `seo/pdfs/`) | ⚠ Draft template — not certified |
| Off-site marketplace profiles | ❌ Not created (documented in `seo/backlinks/`) |

---

## B. Conversion System Status

### B.1 RFQ / Inquiry Form

| Feature | Status | Location |
|---------|--------|----------|
| Inquiry form component | ✔ Complete | `src/components/forms/InquiryForm.tsx` |
| Zod validation | ✔ Complete | `src/lib/validation.ts` |
| API endpoint `POST /api/inquiry` | ✔ Complete | `src/app/api/inquiry/route.ts` |
| Form on contact page | ✔ Complete | `/contact` |
| Form on money page | ✔ Complete | `/products/sodium-metasilicate` |
| Form on guide pages | ✔ Complete | `/guides/[slug]` |
| Form on application pages | ✔ Complete | `/applications/[slug]` |
| Form on grade product pages | ✔ Complete | `/products/[slug]` |
| Request types (quote/sample/tds) | ✔ Complete | |
| Product pre-fill from URL | ✔ Complete | `?product=` + `?type=` |
| Source attribution field | ✔ Complete | `?source=` → hidden form field |
| Email delivery (Resend/SMTP) | ❌ Missing | Logs to console only |
| Lead database / CRM | ❌ Missing | No persistence beyond server log |

### B.2 Sticky CTA System

| Feature | Status | Location |
|---------|--------|----------|
| Sticky quote bar (mobile + desktop) | ✔ Complete | `PersistentCTA.tsx` → `StickyQuoteBar` |
| Request Quote / Sample / COA buttons | ✔ Complete | Desktop shows 3 CTAs; mobile shows Quote + WhatsApp |
| Context-aware hrefs | ✔ Complete | `getRfqContext()` + `rfqContactHref()` |
| Fast contact bar (header area) | ✔ Complete | `FastContactBar.tsx` on all pages via layout |

### B.3 Floating Inquiry Widget

| Feature | Status |
|---------|--------|
| Floating contact button | ✔ Complete |
| Expandable RFQ menu | ✔ Complete |
| Context-aware links | ✔ Complete |
| Email link | ✔ Complete |

### B.4 Page-Level CTAs

| CTA type | Coverage |
|----------|----------|
| `PageCTAs` (quote / contact / tds) | ✔ Homepage, about, factory, faq, contact, blog index, products hub |
| `StrongCTA` | ✔ Money page, guides, applications, blog posts, product pages |
| `ProductFunnelBanner` | ✔ Guides index, applications index, guide/application/blog detail |

### B.5 Lead Tracking System

| Feature | Status |
|---------|--------|
| URL `source` parameter capture | ✔ Complete |
| Server-side `submittedAt` timestamp | ✔ Complete |
| Console logging in dev | ✔ Complete |
| Google Analytics / GTM | ❌ Missing |
| Search Console conversion tracking | ❌ Not configured (docs only) |
| CRM webhook (HubSpot, etc.) | ❌ Missing |
| Email notification to sales | ❌ Missing (stub in API route) |
| Lead export / dashboard | ❌ Missing |

---

## C. SEO Infrastructure Status

### C.1 Sitemap (`src/app/sitemap.ts`)

| Item | Status |
|------|--------|
| Homepage | ✔ Included (priority 1.0) |
| All 4 product grade pages | ✔ Included |
| Category hub `/products/sodium-metasilicate` | ✔ Included (priority 0.95) |
| All 5 guide pages | ✔ Included |
| All 4 application pages | ✔ Included |
| All 3 blog posts | ✔ Included |
| Static pages (about, factory, faq, contact, etc.) | ✔ Included |
| Priority tiers | ✔ Configured |
| **Estimated URL count** | ~26 routes |

### C.2 Robots (`src/app/robots.ts`)

| Item | Status |
|------|--------|
| Allow `/` | ✔ Complete |
| Disallow `/api/` | ✔ Complete |
| Sitemap reference | ✔ `{SITE.url}/sitemap.xml` |

### C.3 Metadata (`src/lib/metadata.ts`)

| Item | Status |
|------|--------|
| Per-page titles | ✔ All routes use `createMetadata` or product fields |
| Meta descriptions | ✔ Complete |
| Canonical URLs | ✔ `alternates.canonical` on every `createMetadata` call |
| OpenGraph tags | ✔ title, description, url, siteName, locale, images |
| Twitter cards | ✔ summary_large_image |
| Keywords array | ✔ Where primary keyword defined |
| `noindex` for applications | ✔ Applications index + detail pages |

**⚠ Partial:** OG image uses `/images/logo.svg` — not ideal for social sharing (should be 1200×630 branded image).

### C.4 Schema Markup (`src/components/seo/JsonLd.tsx`)

| Schema type | Pages |
|-------------|-------|
| Organization | ✔ Global (`layout.tsx`) |
| Product | ✔ Category hub + grade pages |
| FAQPage | ✔ FAQ page, guides, applications, blog (where FAQ exists), money page |
| BreadcrumbList | ✔ All main routes |
| Article | ✔ Blog posts, guide pages |

**❌ Missing:** No `LocalBusiness` / `Manufacturer` rich schema; no `WebSite` + `SearchAction`.

### C.5 Indexing Documentation

| File | Status |
|------|--------|
| `seo/indexing-guide.md` | ✔ Complete |
| `seo/backlinks/backlink-strategy.md` | ✔ Complete |
| `seo/pdfs/*.md` templates | ✔ Complete (3 templates) |

---

## D. Trust Layer Status

### D.1 Components

| Component | File | Status |
|-----------|------|--------|
| FactoryTrustSection | `src/components/trust/FactoryTrustSection.tsx` | ✔ Implemented |
| FactoryProofGallery | `src/components/trust/FactoryProofGallery.tsx` | ✔ Implemented |
| BuyerConfidenceBlock | `src/components/trust/BuyerConfidenceBlock.tsx` | ✔ Implemented |
| TrustReinforcementBlock | `src/components/trust/TrustReinforcementBlock.tsx` | ✔ Implemented |
| IndustryApplicationsSummary | `src/components/trust/IndustryApplicationsSummary.tsx` | ✔ Implemented |
| Shared copy | `src/content/trust.ts` | ✔ Implemented |

### D.2 Integration Matrix

| Page | FactoryTrust | ProofGallery | BuyerConfidence | TrustReinforcement |
|------|:------------:|:------------:|:---------------:|:------------------:|
| Homepage | ✔ full | — | — | — |
| Money page | ✔ (in verification section) | ✔ | ✔ | — |
| Application detail | ✔ compact | — | — | — |
| Guide detail | — | — | — | ✔ |
| Grade product pages | — | — | — | — |
| About / Factory | — | — | — | — |

### D.3 Trust Assets

| Asset | Status |
|-------|--------|
| `sodium-metasilicate-production-line.jpg` | ❌ Missing |
| `sodium-metasilicate-lab-testing.jpg` | ❌ Missing |
| `sodium-metasilicate-packaging.jpg` | ❌ Missing |
| `sodium-metasilicate-export-loading.jpg` | ❌ Missing |
| Gallery fallback UI | ✔ Shows placeholder when image 404 |

---

## E. Internal Linking Status

### E.1 Funnel Target

**Designed flow:** `Guides → Applications → /products/sodium-metasilicate → RFQ`

### E.2 Link Paths Verified

| From | To money page | To applications | To guides | To RFQ |
|------|:-------------:|:---------------:|:---------:|:------:|
| Homepage | ✔ | ✔ | ✔ | ✔ |
| SiteExploreSection | ✔ | ✔ | ✔ | — |
| Guide detail | ✔ (trust + funnel banner + CTA) | ✔ (sidebar) | ✔ (sidebar) | ✔ |
| Application detail | ✔ (recommendation + trust) | — | ✔ (sidebar) | ✔ |
| Blog detail | ✔ (funnel banner) | ✔ (sidebar) | ✔ (sidebar) | ✔ |
| Footer | ✔ | ✔ | ✔ | — |
| Trust components | ✔ (default) | — | — | — |

### E.3 Gaps

| Gap | Severity |
|-----|----------|
| Guide **body content** does not inline-link to application pages (sidebar only) | ⚠ Low |
| Application pages do not inline-link to related guides | ⚠ Low |
| Grade product pages lack trust components | ⚠ Medium |
| Guides/applications **index** pages lack `TrustReinforcementBlock` | ⚠ Low |
| No redirects from old REVIEW-005 guide URLs | ❌ Medium (if URLs were ever published) |

**Overall funnel:** ⚠ **Partial** — authority sink linking is strong; cross-layer body links rely heavily on sidebar + homepage hub.

---

## F. Build & Deployment Readiness

| Item | Status |
|------|--------|
| `package.json` / Next.js 15 app | ✔ Present |
| `npm run build` verified in CI/agent | ❌ Not confirmed |
| `.env.example` | ✔ Present |
| `NEXT_PUBLIC_SITE_URL` | ⚠ Must be set in production |
| `RESEND_API_KEY` / SMTP | ❌ Not wired |
| Real product/factory photography | ❌ Missing |
| Search Console sitemap submission | ❌ Manual step (documented) |
| Off-site backlink execution | ❌ Manual step (documented) |

---

## G. Review & Workflow Status

| Review | Task | Status |
|--------|------|--------|
| REVIEW-006 | SEO lead-gen funnel | ⚠ awaiting_review |
| REVIEW-007 | Trust layer | ⚠ awaiting_review |
| REVIEW-008 | Google indexing | ⚠ awaiting_review |
| REVIEW-009 | Backlink strategy (docs) | ⚠ awaiting_review |
| REVIEW-004 and earlier | — | ✔ approved |

---

## H. Priority Gap List (Launch Checklist)

### ❌ Must fix before launch

1. Run and pass `npm run build` locally
2. Wire inquiry email delivery (Resend or SMTP)
3. Add real factory/product images to `public/images/`
4. Replace OG image with 1200×630 branded asset
5. Commission certified MSDS before external distribution

### ⚠ Should fix soon after launch

1. Add analytics (GA4 or Plausible) + conversion events on RFQ submit
2. Persist leads (CRM, database, or email inbox automation)
3. Submit sitemap in Google Search Console
4. Execute off-site backlink plan (`seo/backlinks/backlink-strategy.md`)
5. Add 301 redirects if old guide URLs were indexed
6. Add trust preview to grade product pages (optional conversion uplift)

### ✔ Already complete (no action needed)

- 4-layer SEO architecture and content
- Money page conversion stack
- Global RFQ CTAs with context pre-fill
- Sitemap, robots, canonical, OG metadata
- Trust component library and core integrations
- Internal link hub on homepage
- Off-site SEO documentation

---

## I. File Reference Map

```
src/app/                    → 14 routes (pages above)
src/content/
  products/index.ts         → 4 products
  guides/intent-pages.ts    → 5 guides
  applications/industries.ts → 4 applications
  blog/posts.ts             → 3 blog posts
  trust.ts                  → trust copy
src/components/trust/       → 5 trust components
src/components/conversion/  → StrongCTA, comparison table
src/lib/seo-funnel.ts       → funnel architecture
src/lib/page-rfq-context.ts → contextual RFQ
seo/
  indexing-guide.md
  backlinks/backlink-strategy.md
  pdfs/                     → TDS, MSDS, product spec templates
  PROJECT_STATUS_AUDIT.md   → this file
```

---

*Audit performed by codebase scan. No application code was modified during this audit.*
