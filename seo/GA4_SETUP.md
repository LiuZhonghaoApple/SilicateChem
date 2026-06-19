# GA4 Setup — SilicateChem

Google Analytics 4 for [silicatechem.com](https://silicatechem.com). Implemented in REVIEW-011.

## Measurement ID

| Setting | Value |
|---------|-------|
| **Production measurement ID** | `G-R7W0MMX4SW` |
| **Env variable** | `NEXT_PUBLIC_GA4_ID=G-R7W0MMX4SW` |
| **Code fallback** | `GA4_MEASUREMENT_ID` in `src/lib/analytics.ts` defaults to `G-R7W0MMX4SW` when env is unset |

## How It Loads

1. **`AnalyticsScripts`** (`src/components/analytics/AnalyticsScripts.tsx`) — loads `gtag.js` via `next/script` with `strategy="afterInteractive"` (post-hydration).
2. **Initial config** — `send_page_view: false` so automatic page views do not double-count SPA navigations.
3. **`PageViewTracker`** (`src/components/analytics/PageViewTracker.tsx`) — fires `page_view` on every App Router pathname change (all routes).

## Custom Events

All helpers live in `src/lib/analytics.ts`. In development, events log to the browser console as `[analytics] {event}`.

| Event | Helper | When | Parameters |
|-------|--------|------|------------|
| `page_view` | `trackPageView(page)` | Route change | `page_path`, `page_location` |
| `generate_lead` | `trackLead({ page, product, inquiry_type })` | Inquiry form **successful** submit only | `page`, `product`, `inquiry_type` |
| `cta_click` | `trackCtaClick({ page, cta_name })` | Tracked CTA link/button click | `page`, `cta_name` |
| `whatsapp_click` | `trackWhatsappClick({ page })` | WhatsApp link click | `page` |
| `email_click` | `trackEmailClick({ page })` | `mailto:` link click | `page` |

### CTA name values (`cta_name`)

Base names from `ctaNameForType()`:

| CTA type | `cta_name` |
|----------|------------|
| Quote | `request_quote` |
| Sample | `request_sample` |
| TDS/MSDS | `get_tds` |
| Contact | `contact_factory` |

When a placement `location` is passed (e.g. `header`, `sticky_bar`), the name is prefixed: `request_quote:header`.

### Inquiry types (`inquiry_type` on `generate_lead`)

| Form `requestType` | `inquiry_type` |
|--------------------|----------------|
| `quote` | `quote` |
| `sample` | `sample` |
| `tds` | `tds` |
| `contact` | `contact` |

### No double-counting

- **CTA clicks** fire `cta_click` only — not `generate_lead`.
- **`generate_lead`** fires only when the inquiry form API returns success.

## Mark Conversions in GA4 Admin

After deploy, in GA4 → **Admin** → **Events**:

1. Mark **`generate_lead`** as a conversion (primary RFQ conversion).
2. Optionally mark **`cta_click`**, **`whatsapp_click`**, **`email_click`** as secondary conversions for funnel analysis.

## Realtime Verification

1. Set `NEXT_PUBLIC_GA4_ID=G-R7W0MMX4SW` in Vercel **Production** (and Preview if testing).
2. Redeploy the site.
3. Open [GA4 Realtime](https://analytics.google.com/) for property `G-R7W0MMX4SW`.
4. Visit the live site in a normal browser window (disable ad blockers for the test).
5. Confirm:
   - **Realtime → Pages** shows your current path within ~30 seconds.
   - Navigate to another route (e.g. `/products/sodium-metasilicate`) — a new page view should appear.
6. Test events:
   - Click **Request Quote** in the header → `cta_click` with `cta_name` containing `request_quote`.
   - Click email or WhatsApp in the footer → `email_click` or `whatsapp_click`.
   - Submit the contact form successfully → `generate_lead` with `inquiry_type`.
7. In development (`npm run dev`), open DevTools console — events appear as `[analytics] …` without needing GA4 Realtime.

## Related Files

| File | Role |
|------|------|
| `src/lib/analytics.ts` | Event helpers + measurement ID |
| `src/components/analytics/AnalyticsScripts.tsx` | gtag.js loader |
| `src/components/analytics/PageViewTracker.tsx` | SPA page views |
| `src/components/analytics/TrackedLinks.tsx` | Tracked mailto, WhatsApp, CTA links |
| `src/components/forms/InquiryForm.tsx` | `generate_lead` on success |
| `src/components/layout/PersistentCTA.tsx` | Sticky bar + floating widget CTAs |
| `src/components/layout/Header.tsx` | Header Request Quote CTA |
| `.env.example` | `NEXT_PUBLIC_GA4_ID` |
| `seo/leads/lead-tracking.md` | Lead + analytics event reference |

See also: `seo/GA4_PRODUCTION_SETUP.md` for Vercel env scopes and deploy checklist.
