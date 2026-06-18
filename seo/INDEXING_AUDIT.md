# SEO Indexing Audit — silicatechem.com

**Audit date:** 2026-06-18  
**Scope:** Google indexing readiness (codebase + configuration review)  
**Method:** Static analysis of Next.js App Router SEO files — no live URL fetch (pre-deploy)

---

## Executive Summary

| Overall readiness | **Needs attention** |
|-------------------|---------------------|
| Code & structure | Strong — sitemap, robots, canonicals, indexable page set, and internal linking to the money page are implemented correctly |
| Deployment blockers | Site must be live with `NEXT_PUBLIC_SITE_URL=https://silicatechem.com` before Google can crawl |
| Rich-result gaps | Product `Offer` schema lacks price; OG image is SVG; `sameAs` empty |

The site is **architecturally ready for indexing** once deployed. Primary remaining work is operational: deploy, verify GSC HTML file, submit sitemap, and request indexing for `/products/sodium-metasilicate` first.

---

## Check Summary

| # | Check | Status | Notes |
|---|--------|--------|-------|
| 1 | Sitemap (`/sitemap.xml`) | **PASS** | `src/app/sitemap.ts` generates 21 indexable URLs with correct priorities |
| 2 | Robots (`/robots.txt`) | **PASS** | Allow `/`, disallow `/api/`, sitemap reference present |
| 3 | Canonical URLs | **PASS** | `createMetadata()` sets `alternates.canonical` on every page |
| 4 | `noindex` tags | **PASS** | Blog + factory noindex; applications indexable |
| 5 | Internal linking → money page | **WARNING** | Strong sitewide; `/factory` lacks direct money-page link (noindex page) |
| 6 | Schema markup | **WARNING** | Valid structure; Offer without price, empty `sameAs`, SVG OG |
| 7 | Homepage indexing readiness | **PASS** | Metadata, H1, hub links, `SiteExploreSection` |
| 8 | Product page indexing readiness | **PASS** | Money page: Product + FAQ + Breadcrumb schema, full metadata |
| 9 | Guide page indexing readiness | **PASS** | Indexable, Article + FAQ + Breadcrumb, funnel links |
| 10 | Factory page indexing readiness | **PASS** | Intentionally `noindex`; crawlable for link equity only |

### Deployment / operational (not code defects)

| Item | Status | Notes |
|------|--------|-------|
| Live `sitemap.xml` reachable | **BLOCKER** | Requires production deploy |
| Live `robots.txt` reachable | **BLOCKER** | Requires production deploy |
| GSC domain verification | **BLOCKER** | `public/google13b7fb62b77b250e.html` exists locally; must be live at apex URL |
| Sitemap submitted in GSC | **BLOCKER** | Manual step after deploy |

---

## 1. Sitemap Accessibility

**Source:** `src/app/sitemap.ts`  
**Generated route:** `https://silicatechem.com/sitemap.xml` (via Next.js `MetadataRoute.Sitemap`)

### Status: **PASS**

| Requirement | Result |
|-------------|--------|
| Homepage included | Yes (`path: ""`) |
| All product pages | Yes — category hub + 4 grade/supporting slugs |
| All guide pages | Yes — 5 slugs + `/guides` index |
| All application pages | Yes — 4 slugs + `/applications` index |
| Static pages | `/about`, `/contact`, `/faq` included |
| Exclusions | `/blog`, `/blog/*`, `/factory` correctly excluded |
| Duplicate URLs | Deduplicated via `Set` |

### Priority tiers (verified in code)

| Path pattern | Priority |
|--------------|----------|
| `/products/sodium-metasilicate` | **1.0** |
| `/` (homepage) | 0.95 |
| Other `MONEY_PAGES` product routes | 0.9 |
| `/products` | 0.85 |
| `/guides/*` | 0.8 |
| `/guides` | 0.75 |
| `/about`, `/contact`, `/faq` | 0.7 |
| `/applications` | 0.65 |
| `/applications/*` | 0.6 |

### URL count

**21 unique indexable URLs** (not ~30 — prior docs overestimated).

`lastModified` is set to `new Date()` on every build (dynamic). Acceptable; Google may treat as always-fresh.

---

## 2. Robots.txt Accessibility

**Source:** `src/app/robots.ts`  
**Generated route:** `https://silicatechem.com/robots.txt`

### Status: **PASS**

```
User-agent: *
Allow: /
Disallow: /api/
Sitemap: https://silicatechem.com/sitemap.xml
```

| Requirement | Result |
|-------------|--------|
| Allow SEO pages | `allow: "/"` permits all non-disallowed paths |
| Block API | `disallow: ["/api/"]` |
| Sitemap reference | `${SITE.url}/sitemap.xml` |
| Blog/factory blocking | Not disallowed in robots — correctly controlled via `noindex` meta only |

---

## 3. Canonical URLs

**Source:** `src/lib/metadata.ts` → `createMetadata()`

### Status: **PASS**

Every page using `createMetadata()` receives:

```ts
alternates: { canonical: `${SITE.url}${path}` }
```

| Factor | Result |
|--------|--------|
| Base URL | `SITE.url` = `process.env.NEXT_PUBLIC_SITE_URL ?? "https://silicatechem.com"` |
| `metadataBase` | Set in `src/app/layout.tsx` to `new URL(SITE.url)` |
| Trailing slash | Paths omit trailing slash — consistent |
| www vs apex | Depends on production env + DNS redirect config |

### Warning

If `NEXT_PUBLIC_SITE_URL` is unset or wrong on a preview deployment, canonicals will point to the wrong domain. Set explicitly in Vercel Production env.

---

## 4. Noindex Tags

**Source:** `createMetadata({ noIndex })` → `robots: { index: !noIndex, follow: true }`

### Status: **PASS**

| Route | `robots` meta | In sitemap |
|-------|---------------|------------|
| `/` | index | Yes |
| `/products/*` | index | Yes |
| `/guides/*` | index | Yes |
| `/applications/*` | index | Yes |
| `/about`, `/contact`, `/faq` | index | Yes |
| `/blog`, `/blog/*` | **noindex** | No |
| `/factory` | **noindex** | No |

Root layout default: `robots: { index: true, follow: true }` — overridden per-page where `noIndex: true`.

Applications pages no longer use `noIndex` (correct per current indexing strategy).

---

## 5. Internal Linking to `/products/sodium-metasilicate`

**Authority sink:** `METASILICATE_CATEGORY_PATH` = `/products/sodium-metasilicate`

### Status: **WARNING** (strong overall; one minor gap)

| Location | Links to money page | Mechanism |
|----------|---------------------|-----------|
| Homepage | **Yes** | `ProductLinkGrid`, hero CTAs, `SiteExploreSection`, grade cards |
| Footer | **Yes** | `metasilicateCategoryLink` ★ in Products column |
| `/about` | **Yes** | `ProductFunnelBanner` |
| `/contact` | **Yes** | `ProductFunnelBanner` |
| `/faq` | **Yes** | `ProductFunnelBanner` + `InternalProductLinks` |
| `/guides` index | **Yes** | `ProductFunnelBanner` |
| `/guides/[slug]` | **Yes** | `ProductFunnelBanner` + `FunnelLinksSidebar` |
| `/applications` index | **Yes** | Direct link + `ProductFunnelBanner` |
| `/applications/[slug]` | **Yes** | Product recommendation link + `FunnelLinksSidebar` |
| `/products` index | **Yes** | Category hub links |
| `/products/[slug]` | **Yes** | Parent category links |
| Global sticky CTA | **Yes** | `PersistentCTA` → `/contact?type=quote` (RFQ, not direct URL) |
| `/factory` | **No direct link** | `PageCTAs` only → `/contact`; no `ProductFunnelBanner` |

**Warning rationale:** `/factory` is noindex and excluded from sitemap, so the missing money-page link does not affect indexing priority. It still receives crawl paths via header nav and `SiteExploreSection` on the homepage.

**Funnel architecture:** Homepage → Products → Guides → Applications → RFQ is implemented via `SiteExploreSection`, `FunnelLinksSidebar`, and `ProductFunnelBanner`.

---

## 6. Schema Markup Validation

**Source:** `src/components/seo/JsonLd.tsx`

### Status: **WARNING**

| Schema | Pages | Status | Issues |
|--------|-------|--------|--------|
| `Organization` | All (layout) | Valid structure | `sameAs: []` empty — no social/profile URLs |
| `Product` | Product pages + money page | Valid structure | `Offer` has no `price` — may limit product rich results |
| `FAQPage` | FAQ, guides, applications, money page | Valid | — |
| `BreadcrumbList` | Most inner pages | Valid | — |
| `Article` | Guides, blog | Valid | Blog articles are noindex |

### Organization schema highlights (PASS)

- `name`, `url`, `logo`, `email`
- `address` — Shandong, CN
- `additionalProperty` — production capacity, manufacturing type

### Warnings

1. **Product Offer without price** — B2B quotation model is intentional; Google may not show product rich snippets.
2. **`sameAs` empty** — Add LinkedIn, Alibaba, or directory URLs when available.
3. **OG/Twitter image** — `public/images/og-image.svg` — some platforms prefer 1200×630 JPG/PNG for previews (does not block indexing).

---

## 7. Homepage Indexing Readiness

### Status: **PASS**

| Signal | Implementation |
|--------|----------------|
| Title / description | `createMetadata()` with primary keyword `sodium metasilicate manufacturer china` |
| Canonical | `https://silicatechem.com/` |
| H1 | "Sodium Metasilicate Manufacturer in China" |
| Indexable | Yes (`noIndex` not set) |
| Internal links | `ProductLinkGrid` → money page ★; applications; guides; `SiteExploreSection` full hub |
| Schema | `OrganizationSchema` sitewide |
| Sitemap priority | 0.95 |

---

## 8. Product Page Indexing Readiness

### Status: **PASS**

**Primary URL:** `/products/sodium-metasilicate`

| Signal | Implementation |
|--------|----------------|
| Dedicated route | `src/app/products/sodium-metasilicate/page.tsx` |
| Metadata | Primary keyword `sodium metasilicate` + supporting keywords |
| Canonical | Full URL via `SEO_KEYWORDS.sodiumMetasilicate.path` |
| Schema | `ProductSchema` + `FAQSchema` + `BreadcrumbSchema` |
| Content depth | Buyer decision, grades, trust system, comparison table, RFQ form |
| Internal links | Grade pages link back; footer + global nav |
| Sitemap priority | **1.0** (highest) |

**Grade pages** (`/products/sodium-metasilicate-granules`, etc.): indexable, `ProductSchema`, breadcrumbs, links to category hub. Priority 0.9.

---

## 9. Guide Page Indexing Readiness

### Status: **PASS**

| Signal | Implementation |
|--------|----------------|
| Indexable | Yes — no `noIndex` on `/guides` or `/guides/[slug]` |
| Count | 5 guides in sitemap |
| Metadata | Per-guide `metaTitle`, `metaDescription`, `primaryKeyword` |
| Schema | `ArticleSchema` + `FAQSchema` + `BreadcrumbSchema` |
| Money-page links | `ProductFunnelBanner` + `FunnelLinksSidebar` on every guide |
| Sitemap priority | 0.8 (detail), 0.75 (index) |

**Guide slugs in sitemap:**

- `/guides/supplier-selection`
- `/guides/price-factors`
- `/guides/uses-detergent`
- `/guides/sodium-metasilicate-vs-soda-ash`
- `/guides/how-to-choose-china-factory`

---

## 10. Factory Page Indexing Readiness

### Status: **PASS** (intentionally excluded from index)

| Signal | Value |
|--------|-------|
| `noIndex` | `true` in `createMetadata()` |
| In sitemap | No |
| Crawlable | Yes — linked from header nav + `SiteExploreSection` |
| `robots` meta | `index: false, follow: true` |
| Schema | `BreadcrumbSchema` only (no conflict) |
| Rationale | Trust/proof page; authority consolidated on money page |

Factory content supports conversion trust but is correctly excluded from SERP targeting.

---

## Indexable URL Inventory (21 URLs)

| URL | Priority | Change freq |
|-----|----------|-------------|
| `https://silicatechem.com/` | 0.95 | weekly |
| `https://silicatechem.com/products/sodium-metasilicate` | **1.0** | weekly |
| `https://silicatechem.com/products/sodium-metasilicate-granules` | 0.9 | weekly |
| `https://silicatechem.com/products/sodium-metasilicate-anhydrous` | 0.9 | weekly |
| `https://silicatechem.com/products/sodium-metasilicate-pentahydrate` | 0.9 | weekly |
| `https://silicatechem.com/products/sodium-silicate` | 0.9 | weekly |
| `https://silicatechem.com/products` | 0.85 | weekly |
| `https://silicatechem.com/guides/supplier-selection` | 0.8 | monthly |
| `https://silicatechem.com/guides/price-factors` | 0.8 | monthly |
| `https://silicatechem.com/guides/uses-detergent` | 0.8 | monthly |
| `https://silicatechem.com/guides/sodium-metasilicate-vs-soda-ash` | 0.8 | monthly |
| `https://silicatechem.com/guides/how-to-choose-china-factory` | 0.8 | monthly |
| `https://silicatechem.com/guides` | 0.75 | monthly |
| `https://silicatechem.com/about` | 0.7 | monthly |
| `https://silicatechem.com/contact` | 0.7 | monthly |
| `https://silicatechem.com/faq` | 0.7 | monthly |
| `https://silicatechem.com/applications` | 0.65 | monthly |
| `https://silicatechem.com/applications/detergent-industry` | 0.6 | monthly |
| `https://silicatechem.com/applications/water-treatment` | 0.6 | monthly |
| `https://silicatechem.com/applications/textile-industry` | 0.6 | monthly |
| `https://silicatechem.com/applications/paper-industry` | 0.6 | monthly |

---

## Non-Indexable Pages

| URL | `noindex` | In sitemap | Rationale |
|-----|-----------|------------|-----------|
| `/blog` | Yes | No | Supporting content; links to money page |
| `/blog/detergent-industry-metasilicate` | Yes | No | Layer 4 — not ranking target |
| `/blog/water-treatment-metasilicate` | Yes | No | Layer 4 |
| `/blog/china-metasilicate-procurement` | Yes | No | Layer 4 |
| `/factory` | Yes | No | Trust page; authority on money page |

All non-indexable pages use `follow: true` so internal links to `/products/sodium-metasilicate` pass crawl equity.

---

## Pre-Launch Checklist

- [ ] Deploy to production with `NEXT_PUBLIC_SITE_URL=https://silicatechem.com`
- [ ] Verify GSC HTML file live: `https://silicatechem.com/google13b7fb62b77b250e.html`
- [ ] Complete Google Search Console domain verification
- [ ] Submit `sitemap.xml` in Search Console
- [ ] URL Inspection → Request indexing for priority URLs (order below)
- [ ] Confirm apex + www redirect strategy (single canonical host)

### Manual indexing priority (request in this order)

1. `https://silicatechem.com/products/sodium-metasilicate`
2. `https://silicatechem.com/`
3. `https://silicatechem.com/products/sodium-metasilicate-granules`
4. `https://silicatechem.com/guides/supplier-selection`
5. `https://silicatechem.com/guides/how-to-choose-china-factory`
6. `https://silicatechem.com/contact`

---

## Post-Deploy Verification

Run after production deploy:

```bash
# Sitemap — expect 200 and ~21 <loc> entries
curl -sI https://silicatechem.com/sitemap.xml | head -5
curl -s https://silicatechem.com/sitemap.xml | grep -c '<loc>'

# Robots — expect Allow /, Disallow /api/, Sitemap line
curl -s https://silicatechem.com/robots.txt

# GSC verification file
curl -s https://silicatechem.com/google13b7fb62b77b250e.html

# Canonical on money page (check link rel=canonical in HTML)
curl -s https://silicatechem.com/products/sodium-metasilicate | grep -i canonical

# Noindex on factory (should show noindex)
curl -s https://silicatechem.com/factory | grep -i robots
```

### Search Console checks

1. **Sitemaps** → Status Success, ~21 URLs discovered
2. **Pages** → Indexable routes appear as "Indexed" over 1–14 days
3. **Pages** → `/factory`, `/blog/*` show "Excluded by noindex tag" (expected)
4. **URL Inspection** → Live test passes for money page

---

## Related Files

| File | Role |
|------|------|
| `src/app/sitemap.ts` | Dynamic sitemap generation |
| `src/app/robots.ts` | Crawler rules |
| `src/lib/metadata.ts` | Canonical, OG, robots meta |
| `src/lib/constants.ts` | `SITE.url` |
| `src/components/seo/JsonLd.tsx` | Structured data |
| `src/components/seo/SiteExploreSection.tsx` | Homepage crawl hub |
| `src/components/seo/FunnelSections.tsx` | `ProductFunnelBanner` |
| `src/components/seo/FunnelLinks.tsx` | Sidebar authority sink |
| `public/google13b7fb62b77b250e.html` | GSC HTML verification |
| `seo/google-indexing-guide.md` | Operational indexing guide |

---

## Audit Conclusion

**Indexing architecture: PASS.** The codebase correctly separates indexable commercial pages from noindex supporting pages, generates a complete sitemap with money-page priority 1.0, and funnels internal links to `/products/sodium-metasilicate`.

**Go-live blockers are operational, not structural:** deploy, GSC verification, and sitemap submission. Address schema warnings (`sameAs`, Offer price, raster OG image) post-launch for enhanced rich results — none block basic indexing.
