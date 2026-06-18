# External Backlink Strategy — SilicateChem

Low-cost SEO backlink system for **Shandong Zhongzhi Chemical Technology Co., Ltd.** ([silicatechem.com](https://silicatechem.com)).

**Scope:** Documentation and off-site assets only. No Next.js route changes required.

**Primary money page (authority sink):** [https://silicatechem.com/products/sodium-metasilicate](https://silicatechem.com/products/sodium-metasilicate)

---

## Goals

1. Build **referring domains** from B2B marketplaces and chemical directories at near-zero cost.
2. Distribute **keyword-rich images and PDFs** (TDS, MSDS, product specification) that link back to the money page.
3. Reinforce **factory-direct manufacturer** positioning with varied, natural anchor text.
4. Support—not replace—on-site SEO (TASK-006 funnel architecture).

---

## Platform List

### Tier 1 — Major B2B Marketplaces (high priority)

| Platform | URL | Account type | Backlink value |
|----------|-----|--------------|----------------|
| **Alibaba** | [alibaba.com](https://www.alibaba.com) | Company page + product listings | High — strong domain authority, image/PDF hosting |
| **Made-in-China** | [made-in-china.com](https://www.made-in-china.com) | Supplier profile + product pages | High — China manufacturing signal |
| **GlobalSources** | [globalsources.com](https://www.globalsources.com) | Supplier profile | Medium–high — export buyer audience |

**Profile fields to complete on every marketplace:**

- Company name: Shandong Zhongzhi Chemical Technology Co., Ltd.
- Brand: SilicateChem
- Website: `https://silicatechem.com`
- Primary product: Sodium metasilicate (granules, anhydrous, pentahydrate)
- Location: Shandong, China
- Capacity: 100,000+ tons annual
- Contact: sales@silicatechem.com

### Tier 2 — Chemical & Industrial Directories

| Platform | URL | Notes |
|----------|-----|-------|
| **ChemNet** | [chemnet.com](https://www.chemnet.com) | China chemical B2B; product + company listing |
| **LookChem** | [lookchem.com](https://www.lookchem.com) | CAS-based product listings (6834-92-0) |
| **ChemicalBook** | [chemicalbook.com](https://www.chemicalbook.com) | Supplier directory; link in company profile |
| **Guidechem** | [guidechem.com](https://www.guidechem.com) | Chemical supplier database |
| **EC21** | [ec21.com](https://www.ec21.com) | Global B2B marketplace |
| **TradeKey** | [tradekey.com](https://www.tradekey.com) | B2B product listings |
| **Thomasnet** (if applicable) | [thomasnet.com](https://www.thomasnet.com) | US industrial buyers; supplier profile |
| **Kompass** | [kompass.com](https://www.kompass.com) | International company directory |
| **Europages** | [europages.com](https://www.europages.com) | European B2B directory |

### Tier 3 — Industry & Regional Directories

| Platform | URL | Notes |
|----------|-----|-------|
| **China Chemical Reporter / CCPIT chemical listings** | Various | Regional chemical association directories |
| **Shandong industrial enterprise directories** | Provincial B2B portals | Local manufacturing credibility |
| **Detergent raw material supplier lists** | Industry association sites | Niche relevance for detergent buyers |
| **Water treatment chemical directories** | Niche portals | Application-specific backlinks |

### Tier 4 — Document & Media Hosting (supporting backlinks)

| Platform | Use case |
|----------|----------|
| **Scribd** | Host TDS/MSDS PDFs with link in description |
| **SlideShare** | Product specification decks |
| **Issuu** | Branded product catalogs |
| **Google Business Profile** | Website link + product photos (if eligible) |

---

## Image SEO Strategy

Upload product and factory images to **every Tier 1 and Tier 2 platform** that accepts media. Images should also live on silicatechem.com (`public/images/`); external copies are for **off-site discovery and image search**.

### Filename conventions (keyword-rich, lowercase, hyphens)

| Asset | Filename example |
|-------|------------------|
| Production line | `sodium-metasilicate-production-line.jpg` |
| Granules product | `sodium-metasilicate-granules.jpg` |
| Anhydrous grade | `sodium-metasilicate-anhydrous-powder.jpg` |
| Pentahydrate grade | `sodium-metasilicate-pentahydrate-crystals.jpg` |
| Factory exterior | `sodium-metasilicate-factory-shandong-china.jpg` |
| Packaging / FIBC | `sodium-metasilicate-bulk-packaging-25kg.jpg` |
| QC laboratory | `sodium-metasilicate-quality-control-laboratory.jpg` |
| Detergent application | `sodium-metasilicate-detergent-builder-grade.jpg` |

### Alt text guidance (align with site SEO keywords)

Use descriptive alt text on every external upload. Vary phrasing; do not copy-paste identical alt text across all platforms.

**Primary terms to weave in:**

- sodium metasilicate manufacturer
- sodium metasilicate supplier china
- sodium metasilicate factory direct
- sodium metasilicate granules
- Na₂SiO₃ industrial grade

**Alt text examples:**

- `Sodium metasilicate granules from Shandong Zhongzhi Chemical — factory direct manufacturer China`
- `Sodium metasilicate production line at SilicateChem manufacturing facility Shandong`
- `White sodium metasilicate granules export grade CAS 6834-92-0 for detergent formulations`
- `Bulk sodium metasilicate packaging 25 kg bags factory direct supplier`

**Caption / description field:** Include one sentence with a link to the money page:

> Factory-direct sodium metasilicate from Shandong Zhongzhi Chemical. Specifications and quotation: https://silicatechem.com/products/sodium-metasilicate

---

## PDF SEO Strategy

Create PDF versions from templates in `/seo/pdfs/` and upload to external platforms.

| Document | Source template | Suggested PDF filename |
|----------|-----------------|------------------------|
| Technical Data Sheet | `sodium-metasilicate-tds.md` | `sodium-metasilicate-tds-shandong-zhongzhi-chemical.pdf` |
| MSDS (draft) | `sodium-metasilicate-msds.md` | `sodium-metasilicate-msds-cas-6834-92-0.pdf` |
| Product specification | `product-specification.md` | `sodium-metasilicate-product-specification-export-grade.pdf` |

### PDF title metadata (set in PDF properties before upload)

- `Sodium Metasilicate Technical Data Sheet — Shandong Zhongzhi Chemical`
- `Sodium Metasilicate MSDS CAS 6834-92-0 — SilicateChem`
- `Sodium Metasilicate Product Specification — Factory Direct China Supplier`

### Required backlink in every PDF

Include in the **header or footer** of each PDF:

```
Shandong Zhongzhi Chemical Technology Co., Ltd. | SilicateChem
https://silicatechem.com/products/sodium-metasilicate
sales@silicatechem.com
```

### Upload targets for PDFs

1. Alibaba — product attachments, company profile documents
2. Made-in-China — product detail "Download" section
3. GlobalSources — supplier catalog uploads
4. ChemNet / LookChem — product documentation field
5. Scribd / Issuu — public document with description link

> **MSDS warning:** Templates in `/seo/pdfs/` are structural drafts only. Replace with a **certified MSDS** from a qualified safety professional before customer distribution or regulatory submission.

---

## Backlink Anchor Text Guidance

**Primary target URL:** `https://silicatechem.com/products/sodium-metasilicate`

Vary anchors naturally. Avoid using the exact same anchor on every platform (over-optimization risk).

### Primary anchors (money page — ~60% of links)

| Anchor text | Use on |
|-------------|--------|
| sodium metasilicate manufacturer | Alibaba, ChemNet company profile |
| sodium metasilicate supplier china | Made-in-China, EC21 |
| sodium metasilicate factory direct | GlobalSources, factory description fields |
| sodium metasilicate manufacturer china | Directory listings, Scribd descriptions |
| Shandong Zhongzhi Chemical sodium metasilicate | Branded + product anchors |

### Secondary anchors (money page — ~25%)

| Anchor text | Use on |
|-------------|--------|
| sodium metasilicate | Product listing title links |
| Na₂SiO₃ manufacturer | Chemical directory CAS listings |
| buy sodium metasilicate from factory | Marketplace product descriptions |
| sodium metasilicate export grade | PDF descriptions, image captions |
| factory direct sodium metasilicate quotation | CTA text in profiles |

### Supporting anchors (homepage or grade pages — ~15%)

| Anchor text | Target |
|-------------|--------|
| SilicateChem | `https://silicatechem.com` |
| sodium metasilicate granules specifications | `/products/sodium-metasilicate-granules` |
| sodium metasilicate anhydrous | `/products/sodium-metasilicate-anhydrous` |
| sodium metasilicate pentahydrate | `/products/sodium-metasilicate-pentahydrate` |

### Anchor text rules

1. **Never** use exact-match commercial anchors on more than 30% of total backlinks.
2. Include **naked URL** (`https://silicatechem.com/products/sodium-metasilicate`) on at least 10% of placements.
3. Use **brand name** alone ("SilicateChem", "Shandong Zhongzhi Chemical") for 10–15% of links.
4. Rotate **long-tail** phrases: "sodium metasilicate manufacturer in Shandong China factory direct supply".

---

## Execution Checklist

### Phase 1 — Foundation (Week 1)

- [ ] Convert MD templates in `/seo/pdfs/` to PDF (see [Publish Workflow](#publish-workflow) below)
- [ ] Prepare 6–8 product/factory images with keyword filenames
- [ ] Create Alibaba company page with website link
- [ ] Create Made-in-China supplier profile

### Phase 2 — Content distribution (Week 2–3)

- [ ] Upload product listings on Tier 1 platforms (granules as lead SKU)
- [ ] Attach TDS + product specification PDFs to each listing
- [ ] Upload images with alt text to all active profiles
- [ ] Submit company to ChemNet, LookChem (CAS 6834-92-0), Guidechem

### Phase 3 — Expansion (Week 4+)

- [ ] Tier 3 industry directories
- [ ] Scribd/Issuu document hosting with money page link in description
- [ ] Quarterly refresh: new images, updated PDF revision dates
- [ ] Track referring domains in Google Search Console

---

## Publish Workflow

### Converting Markdown → PDF

Templates live in `/seo/pdfs/`. Choose one method:

#### Option A — Pandoc (recommended for batch conversion)

Install [Pandoc](https://pandoc.org/) and a PDF engine (e.g. `wkhtmltopdf` or LaTeX):

```bash
cd /Users/ai/Desktop/SilicateChem/seo/pdfs

# HTML intermediate (works without LaTeX)
pandoc sodium-metasilicate-tds.md -o sodium-metasilicate-tds.html --standalone

# Direct PDF (requires wkhtmltopdf)
pandoc sodium-metasilicate-tds.md -o sodium-metasilicate-tds-shandong-zhongzhi-chemical.pdf \
  --pdf-engine=wkhtmltopdf \
  -V margin-top=20mm -V margin-bottom=20mm

pandoc sodium-metasilicate-msds.md -o sodium-metasilicate-msds-cas-6834-92-0.pdf \
  --pdf-engine=wkhtmltopdf

pandoc product-specification.md -o sodium-metasilicate-product-specification-export-grade.pdf \
  --pdf-engine=wkhtmltopdf
```

#### Option B — VS Code

1. Install extension **Markdown PDF** (yzane.markdown-pdf).
2. Open template `.md` file → right-click → **Markdown PDF: Export (pdf)**.
3. Rename output to keyword-rich filename before upload.

#### Option C — Online tools (no install)

1. Paste markdown into [Dillinger](https://dillinger.io/) or [StackEdit](https://stackedit.io/).
2. Export as PDF, or export HTML → print to PDF from browser.
3. Set PDF title in document properties (File → Properties in Preview/Acrobat).

#### Post-conversion checklist

- [ ] PDF title and author metadata set (company name)
- [ ] Footer contains money page URL and email
- [ ] Filename matches keyword convention
- [ ] File size under platform limits (typically 5–10 MB)

---

### Uploading to External Platforms

#### Category A — B2B Marketplaces (Alibaba, Made-in-China, GlobalSources)

1. **Register** supplier account with business license verification.
2. **Company profile:** Set website to `https://silicatechem.com`; write 200–400 word description using primary keywords once each.
3. **Add product:** Title = `Sodium Metasilicate Granules — Factory Direct Manufacturer China`.
4. **Images:** Upload 4–6 keyword-named images; fill alt/description with anchor-linked money page URL.
5. **Documents:** Attach TDS and product specification PDFs in product detail or company showcase.
6. **Product description:** Include HTML or plain link: `[sodium metasilicate manufacturer](https://silicatechem.com/products/sodium-metasilicate)`.
7. **Publish** and note listing URL for backlink tracking spreadsheet.

#### Category B — Chemical Directories (ChemNet, LookChem, Guidechem)

1. Search platform for existing CAS **6834-92-0** listing; claim or create supplier entry.
2. Complete company profile with Shandong address, capacity, and website URL.
3. Upload product spec PDF as attachment where supported.
4. Use varied anchor in "Company introduction" field (not identical to marketplace copy).

#### Category C — General B2B Directories (EC21, TradeKey, Kompass)

1. Create free basic listing (paid tiers optional later).
2. Select category: Chemicals → Inorganic Chemicals → Silicates.
3. Add 1–3 products with images and PDF downloads.
4. Link website with brand or partial-match anchor.

#### Category D — Document hosts (Scribd, Issuu)

1. Upload PDF with keyword filename.
2. **Title:** `Sodium Metasilicate TDS — Shandong Zhongzhi Chemical Factory Direct`
3. **Description:** 2–3 sentences + money page link with varied anchor.
4. **Tags:** sodium metasilicate, Na2SiO3, detergent builder, china manufacturer

---

## Tracking

Maintain a simple spreadsheet:

| Date | Platform | Listing URL | Anchor used | Target URL | Status |
|------|----------|-------------|-------------|------------|--------|
| | Alibaba | | sodium metasilicate manufacturer | /products/sodium-metasilicate | live |

Monitor in **Google Search Console → Links** monthly for new referring domains.

---

## Related Files

| File | Purpose |
|------|---------|
| `/seo/pdfs/sodium-metasilicate-tds.md` | TDS template |
| `/seo/pdfs/sodium-metasilicate-msds.md` | MSDS draft template |
| `/seo/pdfs/product-specification.md` | Multi-grade product specification |
| `src/lib/constants.ts` | SITE company name, URL, contact |
| `src/lib/seo-keywords.ts` | On-site keyword mapping (do not conflict) |

---

## Review Notes

- **Documentation only** — no Next.js app route changes.
- MSDS templates are **not certified** for regulatory use.
- Backlink work is **off-site**; complements TASK-006 on-site funnel.
