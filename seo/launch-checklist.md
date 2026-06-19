# Launch Checklist — silicatechem.com

Pre-launch and post-deploy steps for SEO traffic + RFQ conversion.

**System status:** READY FOR DEPLOYMENT (pending assets + analytics IDs + live domain)

---

## 1. Domain & Hosting

- [ ] Register/configure `silicatechem.com` DNS
- [ ] Deploy Next.js app (Vercel recommended)
- [ ] Set `NEXT_PUBLIC_SITE_URL=https://silicatechem.com` in production env
- [ ] Verify HTTPS and www/non-www redirect policy
- [ ] Run `npm run build` locally — fix any errors before deploy

## 2. Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://silicatechem.com`
3. Verify ownership (DNS TXT or HTML file)
4. Submit sitemap: `https://silicatechem.com/sitemap.xml`
5. Request indexing for priority URLs (see §4)
6. Monitor Coverage report for errors

See also: `seo/indexing-guide.md`

## 3. Analytics Setup

- [x] Create GA4 property for silicatechem.com (`G-R7W0MMX4SW`)
- [ ] Set `NEXT_PUBLIC_GA4_ID=G-R7W0MMX4SW` in Vercel Production (see `seo/GA4_PRODUCTION_SETUP.md`)
- [ ] (Optional) Create GTM container — set `NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX` (skip if using GA4-direct only)
- [ ] Configure GA4 conversion events:
  - `rfq_submit`
  - `sample_request`
  - `tds_download`
  - `page_view_by_source`
- [ ] Test events in GA4 DebugView after deploy
- [ ] Link GA4 to Search Console

Event implementation: `src/lib/analytics.ts`

## 4. Indexing Priority Pages

Submit these first in Search Console → URL Inspection → Request indexing:

| Priority | URL |
|----------|-----|
| 1 | `https://silicatechem.com/` |
| 2 | `https://silicatechem.com/products/sodium-metasilicate` |
| 3 | `https://silicatechem.com/products/sodium-metasilicate-granules` |
| 4 | `https://silicatechem.com/guides/supplier-selection` |
| 5 | `https://silicatechem.com/guides/how-to-choose-china-factory` |
| 6 | `https://silicatechem.com/contact` |

**In sitemap (indexable):** homepage, `/products/*`, `/guides/*`, `/about`, `/contact`, `/faq`

**Not in sitemap (noindex or low priority):** `/applications/*`, `/blog/*`, `/factory`

## 5. Lead Capture

- [ ] Set `RESEND_API_KEY` in Vercel Production (email already wired in `src/app/api/inquiry/route.ts`)
- [ ] Set `INQUIRY_TO_EMAIL=info@silicatechem.com` and `INQUIRY_FROM_EMAIL=info@silicatechem.com`
- [x] WhatsApp number set in `src/lib/constants.ts` (`+86 18562682380`)
- [ ] Verify `silicatechem.com` in Resend (DKIM + SPF/MX on `send` — add in Vercel DNS)
- [ ] Test RFQ form end-to-end on production
- [ ] Verify `[INQUIRY]` structured logs and email delivery at info@
- [ ] Lead schema reference: `seo/leads/lead-schema.md` (note: live API uses `[INQUIRY]` log prefix)

## 6. Trust & Media Assets

- [ ] Replace placeholder trust images in `public/images/trust/`
- [ ] Replace `public/og-image.jpg` with branded 1200×630 design
- [ ] Add real product photos to `public/images/products/`
- [ ] Naming rules: `seo/images/trust-image-naming.md`

## 7. External SEO / Backlinks

- [ ] Execute `seo/backlinks/backlink-strategy.md`
- [ ] Create Alibaba / Made-in-China company profiles
- [ ] Upload TDS/MSDS PDFs from `seo/pdfs/` templates
- [ ] Submit to chemical directories (ChemNet, etc.)
- [ ] Track referring domains in Search Console

## 8. Post-Launch Monitoring (Week 1–4)

- [ ] Search Console: indexed pages, crawl errors, queries
- [ ] GA4: `rfq_submit` conversion rate by `funnel_layer`
- [ ] Check money page rankings for target keywords
- [ ] Review lead volume and source attribution (`classification.sourcePage`)

---

## Quick Reference

| Resource | Path |
|----------|------|
| Sitemap | `/sitemap.xml` |
| Robots | `/robots.txt` |
| Indexing guide | `seo/indexing-guide.md` |
| Project audit | `seo/PROJECT_STATUS_AUDIT.md` |
| Backlink strategy | `seo/backlinks/backlink-strategy.md` |
| Lead schema | `seo/leads/lead-schema.md` |
