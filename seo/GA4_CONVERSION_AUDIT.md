# GA4 + Conversion Tracking Audit — silicatechem.com

**Audit date:** 2026-06-18  
**Scope:** Client-side analytics, conversion events, lead attribution, production readiness  
**Method:** Static code review — no live GA4 property verification

---

## Executive Summary

| Overall readiness | **Needs attention** |
|-------------------|---------------------|
| Code implementation | **Strong** — events, attribution, and component wiring are in place |
| Production activation | **Ready in repo** — ID `G-R7W0MMX4SW` documented; **Vercel Production env + redeploy still required** |
| Reporting accuracy | **Warnings** — potential double-counting and incomplete pageview coverage |

Conversion tracking **code is production-ready**, but **no external analytics will fire until env vars are set** and GA4/GTM containers are configured. Post-deploy GA4 admin setup (conversion marking, custom dimensions, DebugView validation) is required.

---

## Results at a Glance

| # | Check | Status |
|---|-------|--------|
| 1 | GA4 / GTM script loading | **WARNING** — conditional on env vars |
| 2 | Conversion events implemented | **PASS** |
| 3 | RFQ form submission tracking | **PASS** |
| 4 | WhatsApp click tracking | **PASS** |
| 5 | Email (mailto) click tracking | **PASS** |
| 6 | CTA button click tracking | **PASS** (with caveats) |
| 7 | Source page attribution | **PASS** |
| 8 | Product interest attribution | **PASS** |
| 9 | Inquiry type attribution | **PASS** |
| 10 | Page view / funnel tracking | **WARNING** — partial coverage |
| 11 | Lead delivery (server-side) | **BLOCKER** — `RESEND_API_KEY` not configured |
| 12 | GA4 admin / conversion config | **BLOCKER** — operational, not done in codebase |

---

## 1. Script Loading & Environment

### Implementation

| File | Role |
|------|------|
| `src/components/analytics/AnalyticsScripts.tsx` | Loads GTM container and/or GA4 `gtag.js` when env IDs set |
| `src/app/layout.tsx` | Renders `<AnalyticsScripts />` + `<PageViewTracker />` site-wide |
| `.env.example` | `NEXT_PUBLIC_GA4_ID=G-R7W0MMX4SW` (silicatechem.com); `NEXT_PUBLIC_GTM_ID` optional |

### GA4 config detail

```js
gtag('config', GA4_ID, { send_page_view: false });
```

Automatic GA4 pageviews are **disabled**. Pageviews rely on custom `page_view_by_source` events (limited scope — see §10) or GTM triggers.

### Status: **WARNING**

| Issue | Detail |
|-------|--------|
| Env vars unset in Vercel | Production ID is `G-R7W0MMX4SW` in `.env.example` and code fallback — set in Vercel Production and redeploy |
| Dual-stack risk | Both GTM and GA4 gtag can load simultaneously. If GTM **also** contains a GA4 Configuration tag, events may **double-fire**. Choose one primary path: **GTM-only** (recommended) or **GA4-direct only |
| No scripts without env | Safe for dev/staging — `trackGa4Event` no-ops when `!window.gtag \|\| !GA4_ID` |

### Required production env (Vercel)

```
NEXT_PUBLIC_GA4_ID=G-R7W0MMX4SW
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX   # optional if using GA4-direct only
```

See `seo/GA4_PRODUCTION_SETUP.md` for Vercel scopes and verification steps.

Redeploy after setting env vars.

---

## 2. Event Catalog

All events defined in `src/lib/analytics.ts`. Each `emit()` call pushes to **both** `window.dataLayer` (GTM) and `gtag` (GA4).

### Conversion events

| Event | Trigger | Key parameters |
|-------|---------|----------------|
| `rfq_submit` | Form submit (`quote` / `contact`) or CTA click (`quote` / `contact`) | `page_path`, `page_source`, `product_interest`, `inquiry_type`, `funnel_layer` |
| `sample_request` | Form `requestType=sample` or sample CTA click | same |
| `tds_download` | Form `requestType=tds` or TDS/COA CTA click | same |
| `cta_click` | Any tracked CTA link click | `inquiry_type`, `event_label` (includes location) |

### Engagement events

| Event | Trigger | Key parameters |
|-------|---------|----------------|
| `whatsapp_click` | Tracked WhatsApp link click | `page_path`, `page_source`, `product_interest`, `event_label` |
| `email_click` | Tracked `mailto:` click | same |
| `page_view_by_source` | `PageViewTracker` on route change | `page_path`, `funnel_layer`, `page_source` |

### Dev fallback

In `NODE_ENV=development`, all events log to browser console as `[analytics] {event} {...}` regardless of GA4/GTM env.

### Status: **PASS** (code) / **BLOCKER** (GA4 admin)

Events must be **marked as conversions** in GA4 Admin → Events after first data arrives:

- `rfq_submit`
- `sample_request`
- `tds_download`

Optional engagement conversions: `whatsapp_click`, `email_click`, `cta_click`.

---

## 3. Component Wiring

### Tracked components

| Component | Events | Location labels |
|-----------|--------|-----------------|
| `InquiryForm` | `trackInquiryByType` on **successful** submit | Uses `source` hidden field |
| `PersistentCTA` — `StickyQuoteBar` | `cta_click` + mirrored conversion | `sticky_bar` |
| `PersistentCTA` — `FloatingContactWidget` | `cta_click`, `email_click` | `floating_widget` |
| `FooterContact` | `whatsapp_click`, `email_click` | `footer` |
| `FastContactBar` | `cta_click`, `email_click` | `fast_contact_bar` |
| `PageCTAs` | `cta_click` | `page_ctas` |
| `StrongCTA` | `cta_click` | `strong_cta` |
| `ContactDirectLinks` | `whatsapp_click`, `email_click` | `contact_page` |
| `TrackedLinks.tsx` | Shared primitives | per `location` prop |

### Untracked touchpoints

| Component | Issue | Status |
|-----------|-------|--------|
| `Header.tsx` — "Request Quote" nav link | Plain `<Link>` — no `trackCtaClick` | **WARNING** |
| Header mobile menu quote link | Same | **WARNING** |

### Status: **PASS** (95% coverage) / **WARNING** (header gap)

---

## 4. Attribution Fields

### Form → API → analytics flow

```
User submits InquiryForm
  → hidden `source` field (URL ?source= or getRfqContext(pathname))
  → POST /api/inquiry → buildStructuredLead()
  → trackInquiryByType() on client success
```

### Source page mapping (`src/lib/page-rfq-context.ts`)

| Path | `source` value | `funnel_layer` |
|------|----------------|----------------|
| `/` | `homepage` | other* |
| `/products/sodium-metasilicate` | `money-page` | money |
| `/products/{grade}` | `product-page` | money |
| `/guides/{slug}` | `guide-{slug}` | guide |
| `/applications/{slug}` | `application-{slug}` | application |
| `/blog/{slug}` | `blog-{slug}` | blog |
| `/contact` (direct) | pathname fallback | other |

\* `inferFunnelLayer("/")` returns `"other"` — homepage is not classified as `homepage` in analytics layer field.

### Lead record fields (server)

| Field | Captured |
|-------|----------|
| date | `submittedAt` ✔ |
| source page | `classification.sourcePage` ✔ |
| product | `interest.product` ✔ |
| country | `contact.country` ✔ |
| inquiry type | `classification.inquiryType` ✔ |
| lead ID | `id` ✔ (server only — **not** sent to GA4) |

### Status: **PASS** / **WARNING**

- **WARNING:** `lead.id` is not correlated with GA4 events — cannot join analytics to CRM without custom work
- **WARNING:** Homepage `funnel_layer` reports as `other`, not `homepage`

---

## 5. Double-Counting Risk

### CTA click → form submit funnel

`trackCtaClick()` fires **two** events on every CTA click:

1. `cta_click`
2. Mirrored conversion (`rfq_submit`, `sample_request`, or `tds_download`)

If the user then completes the contact form, `trackInquiryByType()` fires the **same conversion event again**.

| Scenario | Events fired |
|----------|--------------|
| Click "Request Quote" CTA | `cta_click` + `rfq_submit` |
| Then submit form | `rfq_submit` again |
| Direct form submit (no prior CTA click) | `rfq_submit` once |

### Status: **WARNING**

**Recommendation:** In GA4, treat `rfq_submit` / `sample_request` / `tds_download` as conversions on **form submit only**. Use `cta_click` for CTA-intent analysis. Alternatively, remove mirrored conversion calls from `trackCtaClick()` (code change — not applied in this audit).

---

## 6. Page View Tracking

### `PageViewTracker` scope

Fires `page_view_by_source` only on:

- `/products/sodium-metasilicate` (+ prefix match)
- `/guides` and `/guides/*`
- `/applications` and `/applications/*`

### Not tracked by PageViewTracker

- `/` (homepage)
- `/factory`
- `/contact`, `/about`, `/faq`
- `/products` index
- `/products/{grade}` (other than money page path — note: `/products/sodium-metasilicate-granules` does NOT match tracker prefix which is exact money page path... wait let me check)

```ts
const TRACKED_PREFIXES = [
  "/products/sodium-metasilicate",
  "/guides",
  "/applications",
];
```

`pathname.startsWith("/products/sodium-metasilicate")` would match:
- `/products/sodium-metasilicate` ✔
- `/products/sodium-metasilicate-granules` ✔ (because starts with prefix + more chars)

Actually `/products/sodium-metasilicate-granules`.startsWith(`/products/sodium-metasilicate`)` is TRUE.

But `/products/sodium-metasilicate-anhydrous` also matches. Good.

`/products/sodium-silicate` does NOT match — not tracked.

`/products` index — not tracked.

### Status: **WARNING**

Combined with `send_page_view: false`, most routes (homepage, factory, contact, about, faq, `/products` hub, sodium-silicate) get **no pageview event** unless GTM sends default pageviews.

---

## 7. Server-Side Lead Delivery

### `POST /api/inquiry`

| Step | Status |
|------|--------|
| Zod validation | **PASS** |
| Structured lead JSON logged `[INQUIRY]` | **PASS** |
| Resend email to `info@silicatechem.com` | **BLOCKER** — requires `RESEND_API_KEY` + domain verification |

Analytics tracks client-side success; server email is independent. **A form can succeed in GA4 while no email is delivered** if Resend is not configured.

### Status: **BLOCKER** (operational)

---

## 8. GTM vs GA4 Integration Notes

### dataLayer pushes

Every event pushes a flat object to `window.dataLayer`:

```js
{ event: "rfq_submit", page_path: "/guides/price-factors", ... }
```

### GTM setup required (if using GTM)

Create triggers for custom event names matching `event` field. Map parameters to GA4 Event tags:

| dataLayer key | Suggested GA4 param |
|---------------|---------------------|
| `page_path` | Custom dimension |
| `page_source` | Custom dimension |
| `product_interest` | Custom dimension |
| `inquiry_type` | Custom dimension |
| `funnel_layer` | Custom dimension |
| `event_label` | `event_label` |

### GA4-direct setup (if not using GTM)

`trackGa4Event()` sends custom params. Register as **custom dimensions** in GA4 Admin for reporting.

---

## 9. Post-Deploy Validation Checklist

### BLOCKER — before trusting data

- [ ] Set `NEXT_PUBLIC_GA4_ID=G-R7W0MMX4SW` in Vercel Production env (see `seo/GA4_PRODUCTION_SETUP.md`)
- [ ] Decide GTM-only vs GA4-direct (avoid duplicate GA4 tags)
- [ ] Redeploy
- [ ] Set `RESEND_API_KEY` for lead email delivery

### WARNING — within 24h of launch

- [ ] GA4 Admin → mark `rfq_submit`, `sample_request`, `tds_download` as conversions
- [ ] Register custom dimensions: `page_path`, `page_source`, `product_interest`, `funnel_layer`, `inquiry_type`
- [ ] Link GA4 property to Search Console
- [ ] Test in GA4 **DebugView** (Chrome Tag Assistant or `debug_mode`):
  - Submit test RFQ on `/contact`
  - Click sticky bar "Request Quote"
  - Click footer WhatsApp
  - Click footer email
  - Navigate to `/guides/supplier-selection` (check `page_view_by_source`)

### PASS — verify expected console output (dev)

```bash
npm run dev
# Open browser console → submit form / click CTAs
# Expect: [analytics] rfq_submit { page_path: "...", ... }
```

---

## 10. Recommended GA4 Reports

After 7+ days of data:

| Report | Dimension / metric |
|--------|-------------------|
| Conversions by funnel | `funnel_layer` × `rfq_submit` |
| CTA performance | `event_label` on `cta_click` |
| Money page vs guides | `page_source` on conversions |
| Contact channel mix | `whatsapp_click` vs `email_click` vs `rfq_submit` |
| Product interest | `product_interest` on `rfq_submit` |

---

## 11. Related Documentation

| File | Purpose |
|------|---------|
| `seo/leads/lead-tracking.md` | Event catalog + component wiring reference |
| `seo/leads/lead-schema.md` | Structured lead JSON schema |
| `seo/launch-checklist.md` | Analytics setup checklist (§3) |
| `src/lib/analytics.ts` | Event implementation |
| `.env.example` | Required env vars |

---

## Conclusion

| Layer | Verdict |
|-------|---------|
| **Code** | **PASS** — comprehensive conversion tracking implemented |
| **Coverage** | **WARNING** — header CTAs untracked; partial pageviews; double-count risk |
| **Production** | **Pending Vercel env** — ID documented (`G-R7W0MMX4SW`); set env + redeploy + GA4 admin |
| **Lead delivery** | **BLOCKER** — Resend not configured |

**Next action:** Set `NEXT_PUBLIC_GA4_ID=G-R7W0MMX4SW` in Vercel Production → redeploy → validate Realtime/DebugView → mark conversions → configure Resend for lead email backup.
