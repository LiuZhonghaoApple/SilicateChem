# GA4 Production Setup — silicatechem.com

**Measurement ID:** `G-R7W0MMX4SW`  
**Scope:** Vercel environment configuration and post-deploy verification (no code deploy from this doc).

Related references:

- `seo/GA4_CONVERSION_AUDIT.md` — event catalog, conversion marking, and code audit
- `seo/leads/lead-tracking.md` — lead events and attribution fields
- `seo/deployment-guide.md` — full Vercel env var table
- `seo/launch-checklist.md` — go-live analytics checklist

> **Note:** `seo/GA4_SETUP.md` does not exist in this repo. Use this file plus `GA4_CONVERSION_AUDIT.md` for GA4 activation.

---

## 1. Required Vercel environment variable

Set in **Vercel → Project → Settings → Environment Variables**:

| Variable | Value | Scope |
|----------|-------|-------|
| `NEXT_PUBLIC_GA4_ID` | `G-R7W0MMX4SW` | **Production** (required for live site) |

This is the silicatechem.com GA4 property measurement ID. The app loads GA4 via `gtag.js` in `src/components/analytics/AnalyticsScripts.tsx` and sends custom events from `src/lib/analytics.ts`.

**GA4-direct is the primary integration path.** Scripts load only when `NEXT_PUBLIC_GA4_ID` is set (or the code fallback is used — prefer explicit Vercel config in production).

---

## 2. Optional: Google Tag Manager

| Variable | Value | When to use |
|----------|-------|-------------|
| `NEXT_PUBLIC_GTM_ID` | `GTM-XXXXXXX` | Only if you deploy a GTM container and want GTM to manage tags |

**Do not set both GTM and GA4-direct with duplicate GA4 Configuration tags** — events may double-fire. Choose one:

- **Recommended for this project:** GA4-direct only (`NEXT_PUBLIC_GA4_ID` set, `NEXT_PUBLIC_GTM_ID` unset)
- **Alternative:** GTM-only (set `NEXT_PUBLIC_GTM_ID`, leave `NEXT_PUBLIC_GA4_ID` unset in Vercel, configure GA4 inside GTM)

---

## 3. Vercel environment scopes

| Scope | `NEXT_PUBLIC_GA4_ID` | Notes |
|-------|----------------------|-------|
| **Production** | `G-R7W0MMX4SW` | Required — silicatechem.com live traffic |
| **Preview** | Unset or separate test property | Avoid polluting production GA4 with PR preview URLs |
| **Development** | Unset locally | Dev console logs `[analytics]` events; external GA4 optional |

`NEXT_PUBLIC_*` vars are inlined at **build time**. Changing them requires a **redeploy** for Production/Preview builds to pick up new values.

---

## 4. Redeploy after env change

1. Save the environment variable in Vercel.
2. **Deployments → ⋯ → Redeploy** the latest Production deployment (or push a new commit).
3. Confirm the built site includes the measurement ID (view page source or Network tab for `gtag/js?id=G-R7W0MMX4SW`).

---

## 5. Verify in GA4 Realtime

1. Open [Google Analytics](https://analytics.google.com/) → property **silicatechem.com** (`G-R7W0MMX4SW`).
2. Go to **Reports → Realtime**.
3. In another tab, visit `https://silicatechem.com` (or your production URL).
4. Confirm:
   - At least one active user in Realtime
   - Custom events when testing: submit inquiry form (`rfq_submit`), click WhatsApp (`whatsapp_click`), navigate money/guide pages (`page_view_by_source`)

For deeper validation (parameter names, conversion events), use **Admin → DebugView** with [Tag Assistant](https://tagassistant.google.com/) or Chrome GA Debugger extension. See checklist in `seo/GA4_CONVERSION_AUDIT.md` §9.

---

## 6. Post-activation GA4 admin (not in codebase)

After first live events arrive:

- [ ] Mark conversions: `rfq_submit`, `sample_request`, `tds_download`
- [ ] Register custom dimensions: `page_source`, `product_interest`, `inquiry_type`, `funnel_layer` (if reporting on them)
- [ ] Link GA4 property to Google Search Console
- [ ] Confirm `RESEND_API_KEY` is set so leads are emailed in addition to analytics events

---

## 7. Local development

Copy `.env.example` to `.env.local`. Analytics helpers log `[analytics]` events to the browser console in development regardless of GA4 env.

To avoid sending local traffic to the production GA4 property, do not set `NEXT_PUBLIC_GA4_ID` in `.env.local` and run a dev build without the production fallback — or use a separate GA4 test property ID locally.

**Production builds** use `G-R7W0MMX4SW` from `NEXT_PUBLIC_GA4_ID` (Vercel env) or the code fallback in `src/lib/analytics.ts`.
