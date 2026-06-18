# AI Tasks

Tasks from ChatGPT (or other planning tools) for Cursor to execute. Cursor reads this file **before starting each major task**.

---

## Workflow Rules

1. **Before each major task** — Read this file (`AI_TASKS.md`) and work on the next uncompleted task marked `pending` or `in_progress`.
2. **After each major task** — Update `AI_REVIEW.md` with implementation summary, changed files, issues, and questions.
3. **After every file change** — Add an entry to `CHANGELOG_AI.md`.
4. **Do not continue** to the next major task until `AI_REVIEW.md` has been reviewed and approved (status updated to `approved`).

---

## Task Status Legend

| Status | Meaning |
|--------|---------|
| `pending` | Not started |
| `in_progress` | Currently being worked on |
| `completed` | Done; awaiting or passed review |
| `approved` | Reviewed and accepted; safe to proceed |
| `blocked` | Cannot proceed; see notes |

---

## Active Tasks

_No pending tasks._

---

## Completed Tasks (Reference)

### TASK-012: Deployment Preparation

- **Status:** completed
- **Priority:** critical
- **Source:** user
- **Created:** 2026-06-18
- **Depends on:** TASK-011

#### Objective

Prepare silicatechem.com for production deployment to Vercel + GitHub: verify build, env config, SEO, API routes, and deployment documentation.

#### Requirements

- [x] `npm install && npm run build` passes locally
- [x] Fix TypeScript / ESLint / routing errors
- [x] `.env.example` with SITE_URL, email, GA4, GTM placeholders
- [x] Sitemap / robots / canonical SEO verification
- [x] Vercel-compatible App Router + Node inquiry API
- [x] OG image static asset
- [x] `seo/deployment-guide.md`
- [x] AI_REVIEW.md (REVIEW-012), CHANGELOG_AI.md, AI_TASKS.md updated

#### Acceptance Criteria

- [x] Production build passes
- [x] **READY FOR PRODUCTION DEPLOYMENT** documented in REVIEW-012

---

### TASK-011: Launch Readiness Phase

- **Status:** completed
- **Priority:** critical
- **Source:** user
- **Created:** 2026-06-18
- **Depends on:** TASK-007–009

#### Objective

Prepare for real-world SEO traffic, RFQ conversion tracking, and deployment launch.

#### Requirements

- [x] GA4/GTM analytics + event wiring (form, CTAs, page views)
- [x] Structured lead capture API + lead-schema.md
- [x] Sitemap indexable pages only
- [x] Trust image placeholders + OG image
- [x] seo/launch-checklist.md
- [x] REVIEW-011 — READY FOR DEPLOYMENT status

---

### TASK-009: External Backlink Strategy System

- **Status:** completed
- **Priority:** medium
- **Source:** user
- **Created:** 2026-06-18
- **Depends on:** TASK-006 (completed)

#### Objective

Create low-cost external backlink documentation for silicatechem.com: B2B platform targets, image/PDF SEO strategy, anchor text guidance, and markdown templates for TDS/MSDS/product specification — documentation only, no site route changes.

#### Requirements

- [x] `/seo/backlinks/backlink-strategy.md` with platform list, image/PDF SEO, anchors
- [x] `/seo/pdfs/` templates: TDS, MSDS (draft), product specification
- [x] MD → PDF conversion and platform upload instructions
- [x] AI_REVIEW.md + CHANGELOG_AI.md + AI_TASKS.md updated

---

### TASK-008: Google Indexing Optimization

- **Status:** completed
- **Priority:** high
- **Source:** user
- **Created:** 2026-06-18
- **Depends on:** TASK-006, TASK-007

#### Objective

Optimize Google indexing: complete sitemap, robots.txt, metadata signals, homepage internal links, and indexing documentation.

#### Requirements

- [x] Sitemap includes all pages (homepage, products, guides, applications, static, blog)
- [x] Sensible sitemap priorities by funnel layer
- [x] robots.txt allows important pages, references sitemap URL
- [x] Canonical + OpenGraph on all pages via createMetadata
- [x] Homepage internal links to all guides, applications, and product pages
- [x] `seo/indexing-guide.md` internal dev doc
- [x] AI_REVIEW.md + CHANGELOG_AI.md updated

---

### TASK-007: Trust Layer Optimization

- **Status:** completed
- **Priority:** high
- **Source:** user
- **Created:** 2026-06-18
- **Depends on:** TASK-006 (in progress / awaiting review)

#### Objective

Increase Google trust and buyer conversion via reusable trust components — not new SEO pages.

#### Requirements

- [x] FactoryTrustSection (6 pillars)
- [x] FactoryProofGallery (4 SEO images + alt)
- [x] BuyerConfidenceBlock
- [x] Money page: Factory & Trust Verification section
- [x] Homepage + applications + guides integration
- [x] All trust components link to money page
- [x] AI_REVIEW.md + CHANGELOG_AI.md updated
- [x] No new SEO pages or blog articles

---

### TASK-006: Low-Cost SEO Lead Generation System

- **Status:** completed
- **Priority:** critical
- **Source:** user
- **Created:** 2026-06-18
- **Depends on:** TASK-004 (approved)
- **Supersedes:** TASK-005

#### Objective

Transform site into Google SEO RFQ acquisition engine with 4-layer funnel, authority sink at `/products/sodium-metasilicate`, global contextual RFQ system, and minimal blog.

#### Requirements

- [x] 4-layer SEO architecture (money / applications / guides / blog)
- [x] Authority flow: Guides → Applications → money page
- [x] 5 commercial guides with new slugs
- [x] Applications noindex (mid-funnel only)
- [x] Blog reduced to 3 articles
- [x] Money page rebuilt for conversion
- [x] Global sticky + floating RFQ with page context
- [x] AI_REVIEW.md + CHANGELOG_AI.md updated

---

### TASK-005: Search Intent Expansion & Industry Pages

- **Status:** superseded by TASK-006

---

### TASK-004: Keyword Architecture Correction

- **Status:** completed
- **Priority:** critical
- **Source:** user
- **Created:** 2026-06-18
- **Depends on:** TASK-003 (approved)

#### Objective

Create `/products/sodium-metasilicate` as strongest product page; grade pages target spec keywords only; fix internal linking and breadcrumbs.

#### Requirements

- [x] New parent page `/products/sodium-metasilicate`
- [x] Homepage → category page linking
- [x] Category → grade pages linking
- [x] Footer hierarchy
- [x] Breadcrumb structure
- [x] Canonical keyword mapping
- [x] No new blog articles

---

### TASK-003: SEO Conversion System Upgrade

- **Status:** completed
- **Priority:** critical
- **Source:** user
- **Created:** 2026-06-18
- **Depends on:** TASK-002 (approved)

#### Objective

High-conversion B2B lead generation: keyword architecture, product conversion pages, 10 blog articles, internal linking, persistent CTAs.

#### Requirements

- [x] Keyword-to-page mapping (anti-cannibalization)
- [x] Conversion sections on all product pages
- [x] Internal linking (granules strongest)
- [x] 10 new SEO blog articles
- [x] Sticky/floating/global CTAs
- [x] AI_REVIEW.md + CHANGELOG_AI.md updated

---

### TASK-002: Build Verification + Conversion SEO Upgrade

- **Status:** completed
- **Priority:** high
- **Source:** user
- **Created:** 2026-06-18
- **Depends on:** TASK-001 (approved)

#### Objective

Verify production build passes and upgrade homepage + granules product page for conversion and SEO.

#### Requirements

- [x] Run `npm install` and `npm run build` (attempted; npm unavailable in agent env)
- [x] Strengthen homepage conversion copy and CTAs
- [x] Expand `/products/sodium-metasilicate-granules` with full conversion sections
- [x] Add labeled image placeholders for product and factory assets
- [x] Update AI_REVIEW.md and CHANGELOG_AI.md

---

### TASK-001: Build SilicateChem B2B website

- **Status:** approved
- **Priority:** high
- **Source:** ChatGPT / user
- **Created:** 2026-06-18
- **Depends on:** none

#### Objective

Create a factory-direct B2B marketing website for Shandong Zhongzhi Chemical Technology Co., Ltd. (SilicateChem / silicatechem.com), focused on sodium metasilicate products and lead generation.

#### Requirements

- [x] Next.js 15 App Router with TypeScript and Tailwind CSS v4
- [x] Pages: Home, About, Factory, Products (hub + detail), Blog, FAQ, Contact
- [x] Primary product page: `/products/sodium-metasilicate-granules`
- [x] Content-driven architecture (TypeScript content files for products, blog, FAQ, company)
- [x] SEO: per-page metadata, JSON-LD, sitemap.xml, robots.txt
- [x] Contact/inquiry form with Zod validation and API route
- [x] Responsive layout with Header, Footer, reusable UI components
- [x] README with setup, deploy, and image placeholder instructions

#### Acceptance Criteria

- [x] All routes render with correct metadata and navigation
- [x] Inquiry form validates input and submits to `/api/inquiry`
- [x] Product, FAQ, and blog content is editable via `src/content/`
- [x] Site constants (company name, contact, colors) centralized in `src/lib/constants.ts`
- [x] `.env.example` documents required environment variables

#### Notes / Context

- Company: Shandong Zhongzhi Chemical Technology Co., Ltd. (formerly Shandong Longgang Silicon Industry Technology Co., Ltd.)
- Products: granules (primary), anhydrous, pentahydrate, sodium silicate
- Placeholder images in `public/images/` — replace with real factory/product photos before launch
- Production email via Resend (`RESEND_API_KEY`); dev mode logs to console
- Recommended deploy target: Vercel with `NEXT_PUBLIC_SITE_URL=https://silicatechem.com`
