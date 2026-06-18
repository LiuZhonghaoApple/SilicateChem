# SilicateChem — Production Deployment Guide

**Domain:** https://silicatechem.com  
**Stack:** Next.js 15 (App Router) on Vercel  
**Repository:** GitHub → Vercel import

---

## Pre-deploy checklist

- [ ] `npm install && npm run build` passes locally
- [ ] `.env.local` tested with production values (optional smoke test)
- [ ] Real factory/product photos added to `public/images/` (optional for first deploy)
- [ ] Resend domain verified for `INQUIRY_FROM_EMAIL`
- [ ] GA4 / GTM IDs ready (optional at launch)

---

## 1. Push to GitHub

```bash
cd /path/to/SilicateChem
git init                    # skip if repo already exists
git add .
git commit -m "Prepare silicatechem.com for production deployment"
git branch -M main
git remote add origin https://github.com/YOUR_ORG/silicatechem.git
git push -u origin main
```

**Notes:**

- Do **not** commit `.env.local` — it is gitignored.
- Commit `.env.example` as the reference for required variables.
- Ensure `node_modules/` and `.next/` are not tracked.

---

## 2. Import project on Vercel

1. Sign in at [vercel.com](https://vercel.com) with your GitHub account.
2. Click **Add New → Project**.
3. Import the `silicatechem` repository.
4. Framework preset: **Next.js** (auto-detected).
5. Root directory: `./` (default).
6. Build command: `npm run build` (default).
7. Output directory: `.next` (default — App Router).
8. Click **Deploy** (first deploy can use placeholder env vars; add production env before going live).

---

## 3. Environment variables

In Vercel: **Project → Settings → Environment Variables**

Add for **Production** (and Preview if desired):

| Variable | Required | Example / Notes |
|----------|----------|-----------------|
| `NEXT_PUBLIC_SITE_URL` | **Yes** | `https://silicatechem.com` |
| `RESEND_API_KEY` | Recommended | `re_...` from [resend.com](https://resend.com) |
| `INQUIRY_TO_EMAIL` | Recommended | `sales@silicatechem.com` |
| `INQUIRY_FROM_EMAIL` | Recommended | Verified sender, e.g. `inquiries@silicatechem.com` |
| `NEXT_PUBLIC_GA4_ID` | Optional | `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_GTM_ID` | Optional | `GTM-XXXXXXX` |
| `SMTP_HOST` | Optional | Only if not using Resend |
| `SMTP_PORT` | Optional | e.g. `587` |
| `SMTP_USER` | Optional | SMTP username |
| `SMTP_PASS` | Optional | SMTP password |

Copy from `.env.example` as a starting point.

**After changing env vars:** redeploy (Deployments → ⋯ → Redeploy) so server routes pick up new values.

---

## 4. Custom domain — silicatechem.com

1. Vercel → **Project → Settings → Domains**.
2. Add `silicatechem.com` and `www.silicatechem.com`.
3. At your domain registrar, add DNS records Vercel shows:
   - **A record** `@` → `76.76.21.21` (Vercel anycast IP), **or**
   - **CNAME** `www` → `cname.vercel-dns.com`
4. Wait for DNS propagation (minutes to 48 hours).
5. Set **primary domain** to `https://silicatechem.com` (redirect `www` → apex if preferred).
6. Confirm `NEXT_PUBLIC_SITE_URL=https://silicatechem.com` in Production env.

**Verify after DNS:**

- https://silicatechem.com loads with valid SSL
- https://silicatechem.com/sitemap.xml lists `https://silicatechem.com/...` URLs
- https://silicatechem.com/robots.txt references sitemap and allows `/`

---

## 5. Post-deploy verification

| Check | URL / action |
|-------|----------------|
| Homepage | `/` — H1, CTAs, trust section |
| Money page | `/products/sodium-metasilicate` — RFQ form |
| Inquiry API | Submit test RFQ on `/contact` — check Vercel function logs |
| Email delivery | With Resend configured, confirm email arrives at `INQUIRY_TO_EMAIL` |
| Sitemap | `/sitemap.xml` — all indexable routes present |
| Robots | `/robots.txt` — `Allow: /`, `Disallow: /api/` |
| OG image | Share link — preview uses `/images/og-image.svg` |
| Analytics | GA4 Realtime or GTM Preview (if IDs set) |

---

## 6. Google Search Console

1. Add property: `https://silicatechem.com`
2. Verify via DNS TXT or HTML tag
3. Submit sitemap: `https://silicatechem.com/sitemap.xml`
4. Request indexing for priority URLs:
   - `/`
   - `/products/sodium-metasilicate`
   - `/guides/supplier-selection`

See also: `seo/indexing-guide.md`

---

## 7. Vercel / Next.js specifics

- **App Router:** all pages under `src/app/` — no Pages Router migration needed.
- **`/api/inquiry`:** Node.js runtime (`export const runtime = "nodejs"`). Uses `fetch` to Resend — no native-only modules.
- **Static generation:** product, guide, application, and blog slugs use `generateStaticParams` — 33 routes at build time.
- **No edge-only APIs** — safe on Vercel default serverless functions.

---

## Troubleshooting

### Build fails on Vercel

- Run `npm run build` locally and fix TypeScript/ESLint errors first.
- Check Node version in Vercel (Project → Settings → General) — use **20.x** or **22.x**.
- Clear build cache: Deployments → Redeploy → uncheck "Use existing Build Cache".

### `NEXT_PUBLIC_*` vars not applied

- Must be set **before** build for client bundles.
- Redeploy after adding/changing public env vars.

### Inquiry form succeeds but no email

- Confirm `RESEND_API_KEY`, `INQUIRY_TO_EMAIL`, `INQUIRY_FROM_EMAIL` in Production env.
- Check Vercel **Functions** logs for `[INQUIRY]` or Resend errors.
- Verify sender domain in Resend dashboard.
- Without Resend, inquiries are still logged to function logs only.

### Wrong canonical URLs / sitemap domain

- Ensure `NEXT_PUBLIC_SITE_URL=https://silicatechem.com` (no trailing slash).
- Redeploy after change.

### OG image not showing in social previews

- Replace `public/images/og-image.svg` with a **1200×630 JPG or PNG** for best compatibility (Facebook/LinkedIn prefer raster).
- Update `src/lib/metadata.ts` if filename changes.

### Factory/trust images show placeholders

- Add real photos to `public/images/factory/` per filenames in `src/content/trust.ts`.
- Product photos: `public/images/products/`

### 404 on old guide URLs

- TASK-006 replaced guide slugs. Add redirects in `next.config.ts` if old URLs were indexed.

---

## Launch readiness summary

| Item | Status |
|------|--------|
| Production build | Verify locally |
| SEO (sitemap, robots, canonical) | Configured via `SITE.url` |
| RFQ API | `/api/inquiry` — Node runtime |
| Email | Resend via env (optional until configured) |
| Analytics | GA4/GTM via env (optional) |
| OG image | `public/images/og-image.svg` |
| Trust/factory photos | Placeholders until real assets added |

**READY FOR PRODUCTION DEPLOYMENT** once GitHub + Vercel + domain DNS + env vars are configured.
