# GA4 Final Verification — silicatechem.com

**Audit date:** 2026-06-18  
**Measurement ID:** `G-R7W0MMX4SW`  
**Production URLs:** `https://silicatechem.com` → 307 redirect → `https://www.silicatechem.com` (canonical live host)  
**Method:** Code audit + `curl` production HTML (no GA4 Realtime dashboard access, no browser automation)

---

## Executive summary

| Question | Answer |
|----------|--------|
| **Production GA4 ready?** | **Partial** |
| **Scripts deployed on live site?** | **Yes** — `gtag/js?id=G-R7W0MMX4SW` present in production HTML |
| **Code implementation complete?** | **Yes** — analytics module, scripts, page views, conversion events wired |
| **Realtime data confirmed?** | **No** — requires manual GA4 Admin check |
| **Scorecard** | **4 PASS · 2 WARNING · 0 BLOCKER** |

Production appears to have GA4 loaded. Remaining gaps are operational verification (Realtime, DebugView, marking `generate_lead` as a conversion) and optional explicit Vercel env configuration.

---

## Checklist

| # | Check | Status | Evidence |
|---|--------|--------|----------|
| 1 | `NEXT_PUBLIC_GA4_ID` read correctly | **PASS** | `analytics.ts` reads `process.env.NEXT_PUBLIC_GA4_ID ?? "G-R7W0MMX4SW"`; `.env.example` documents ID; build-time inlining behavior documented below |
| 2 | `gtag.js` loads on production | **PASS** | `curl` of live homepage includes preload + RSC payload for `googletagmanager.com/gtag/js?id=G-R7W0MMX4SW`; gtag endpoint returns HTTP 200 |
| 3 | `page_view` fires | **PASS** | `send_page_view: false` in init; `PageViewTracker` calls `trackPageView(pathname)` on every route change (runtime delivery not curl-verifiable) |
| 4 | No JS errors | **WARNING** | Static analysis only — no runtime Console check performed; see manual procedure below |
| 5 | `analytics.ts` executes / layout wiring | **PASS** | `layout.tsx` mounts `AnalyticsScripts` + `PageViewTracker` (in `Suspense`) on all routes |
| 6 | Realtime receives events | **WARNING** | Expected events documented; GA4 Realtime not verified in this audit |

---

## Code audit findings

### 1. Environment variable — `NEXT_PUBLIC_GA4_ID`

**Files:** `src/lib/analytics.ts`, `src/components/analytics/AnalyticsScripts.tsx`, `.env.example`

```ts
export const GA4_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA4_ID ?? "G-R7W0MMX4SW";
```

| Behavior | Detail |
|----------|--------|
| **Build-time inlining** | Next.js replaces `process.env.NEXT_PUBLIC_*` at **build time**. Value is baked into client bundles and SSR output. |
| **Runtime** | No server runtime lookup for client components; changing Vercel env without redeploy does not update live JS. |
| **Fallback** | If `NEXT_PUBLIC_GA4_ID` is unset at build, code default `G-R7W0MMX4SW` is used — production HTML confirms this ID is live. |
| **Recommendation** | Still set `NEXT_PUBLIC_GA4_ID=G-R7W0MMX4SW` explicitly in Vercel **Production** so future ID changes do not depend on hardcoded fallback. |

`AnalyticsScripts.tsx` imports `GA4_MEASUREMENT_ID`, returns `null` only if ID is falsy (never with current fallback), and loads:

- `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}` via `next/script` `strategy="afterInteractive"`
- Inline init: `gtag('config','…',{send_page_view:false})`

### 2. Page views — no double-counting

| Component | Role |
|-----------|------|
| `AnalyticsScripts.tsx` | Disables automatic page views (`send_page_view: false`) |
| `PageViewTracker.tsx` | Client component; `useEffect` on `pathname` → `trackPageView(pathname)` |
| `trackPageView()` | `gtag('event','page_view',{ page_path, page_location })` |

`PageViewTracker` is wrapped in `<Suspense>` because `usePathname()` requires it in App Router. Production HTML shows `BAILOUT_TO_CLIENT_SIDE_RENDERING` for that boundary — expected; `page_view` fires after client hydration.

### 3. Conversion events — wiring

| Event | Function | Trigger locations |
|-------|----------|-------------------|
| `page_view` | `trackPageView` | All routes via `PageViewTracker` |
| `generate_lead` | `trackLead` | `InquiryForm.tsx` — **only** after successful `POST /api/inquiry` (HTTP 200) |
| `whatsapp_click` | `trackWhatsappClick` | `TrackedWhatsApp` — footer, contact, sticky bar (mobile), floating widget |
| `email_click` | `trackEmailClick` | `TrackedMailto` — fast contact bar, footer, contact page, floating widget |
| `cta_click` | `trackCtaClick` | `TrackedCtaLink` (header, `PageCTAs`, `StrongCTA`), `PersistentCTA` sticky/floating bars |

**Double-counting policy:** CTA navigation → `cta_click` only. Form success → `generate_lead` only. No duplicate lead event on CTA click.

**Dev behavior:** In `NODE_ENV=development`, events log to console as `[analytics] {event}` when gtag is unavailable or after send.

### 4. Static JS error assessment

No obvious analytics-related runtime hazards found:

- All `gtag` calls guard `typeof window !== "undefined" && window.gtag`
- `GA4_MEASUREMENT_ID` always truthy with fallback
- No GTM/dataLayer dual-load conflict (GA4-direct only)

**Cannot confirm** zero Console errors without browser DevTools — ad blockers, CSP, or third-party extensions may block gtag in some sessions.

### 5. Layout integration

`src/app/layout.tsx` (root, all pages):

```tsx
<AnalyticsScripts />
…
<Suspense fallback={null}>
  <PageViewTracker />
</Suspense>
```

`AnalyticsScripts` is a server component (no `"use client"`). `PageViewTracker` is client-only.

---

## Production fetch results

**Command:** `curl -sL https://silicatechem.com` (follows redirect to www)

| Check | Result |
|-------|--------|
| HTTP | `silicatechem.com` → **307** → `www.silicatechem.com` → **200** |
| GA4 measurement ID in HTML | **Found** — `G-R7W0MMX4SW` |
| gtag preload | `<link rel="preload" href="https://www.googletagmanager.com/gtag/js?id=G-R7W0MMX4SW" as="script"/>` |
| gtag config in RSC payload | `gtag('config','G-R7W0MMX4SW',{send_page_view:false})` |
| `PageViewTracker` in bundle | Referenced in `app/layout-*.js` chunk |
| Build / cache | `x-vercel-cache: HIT`, Next.js prerender active |
| gtag.js endpoint | `curl -sI https://www.googletagmanager.com/gtag/js?id=G-R7W0MMX4SW` → **200** |

**www.silicatechem.com:** Same GA4 markup as apex redirect target (verified separately).

### If production HTML lacked GA4 (not current state)

| Likely cause | Fix |
|--------------|-----|
| GA4 code not deployed | Merge + deploy branch with REVIEW-011 changes |
| `GA4_MEASUREMENT_ID` empty at build | Set `NEXT_PUBLIC_GA4_ID` or ensure fallback in `analytics.ts` |
| Stale Vercel cache | Redeploy with cache bust / new deployment |
| Ad blocker during manual check | Test in clean profile or disable blockers |

---

## Manual browser verification procedure

### A. DevTools — Network

1. Open `https://www.silicatechem.com` in Chrome (incognito, extensions off).
2. DevTools → **Network** → filter `gtag` or `google`.
3. Confirm request: `gtag/js?id=G-R7W0MMX4SW` — status **200**.
4. Navigate to `/contact`, `/products/sodium-metasilicate` — confirm new `collect` or `g/collect` requests (GA4 hits).
5. Click **Request Quote** → confirm `cta_click` payload in network (event name in query/body).
6. Click footer **WhatsApp** → confirm `whatsapp_click`.
7. Click **info@silicatechem.com** → confirm `email_click`.
8. Submit inquiry form (test data) → confirm `generate_lead` on success response.

### B. DevTools — Console

1. Filter for `analytics` in development; production should show **no** analytics errors.
2. Red flags: `gtag is not defined`, CSP violations blocking `googletagmanager.com`, repeated uncaught exceptions from layout chunks.

### C. GA4 Realtime

1. GA4 Admin → **Reports → Realtime**.
2. Open site in another tab; within ~30s see **1 active user**.
3. Trigger events:

| Action | Expected event | Parameters |
|--------|----------------|------------|
| Load any page | `page_view` | `page_path`, `page_location` |
| Click tracked CTA | `cta_click` | `page`, `cta_name` (e.g. `request_quote:sticky_bar`) |
| Click WhatsApp link | `whatsapp_click` | `page` |
| Click email link | `email_click` | `page` |
| Successful RFQ submit | `generate_lead` | `page`, `inquiry_type`, optional `product` |

4. **Admin → Data display → Events** → mark `generate_lead` as **conversion**.

### D. Optional — DebugView

Enable [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) extension or `gtag('config', 'G-R7W0MMX4SW', { debug_mode: true })` in a test build. Use GA4 **Admin → DebugView** for event-level validation.

---

## Expected events reference

| Event | When | Key params |
|-------|------|------------|
| `page_view` | Initial load + every client navigation | `page_path`, `page_location` |
| `cta_click` | Tracked quote/sample/tds/contact CTA clicks | `page`, `cta_name` |
| `whatsapp_click` | `TrackedWhatsApp` click | `page` |
| `email_click` | `TrackedMailto` click | `page` |
| `generate_lead` | Inquiry form API success only | `page`, `inquiry_type` (`quote` \| `sample` \| `tds` \| `contact`), `product` |

---

## Warnings (non-blocking)

1. **Realtime not verified** — Scripts are live; confirm hits in GA4 Realtime manually.
2. **Console not verified** — Run DevTools check per procedure above.
3. **Vercel env optional** — Production works via code fallback; explicit `NEXT_PUBLIC_GA4_ID` in Vercel still recommended for operability.
4. **Conversion not marked** — `generate_lead` must be flagged as conversion in GA4 Admin.
5. **Ad blockers** — ~25–40% of users may block analytics; Realtime tests should use unblocked browser.

---

## Blockers

**None identified** for GA4 script deployment. Production HTML includes the correct measurement ID and gtag bootstrap.

*(Separate from GA4: RFQ email delivery remains blocked without Resend — see `seo/RFQ_EMAIL_SETUP.md`.)*

---

## Related docs

- `seo/GA4_SETUP.md` — implementation reference
- `seo/GA4_PRODUCTION_SETUP.md` — Vercel env + redeploy
- `seo/leads/lead-tracking.md` — event naming and funnel mapping
- `seo/GA4_CONVERSION_AUDIT.md` — pre-launch conversion audit

---

## Sign-off checklist

- [x] Production HTML contains `G-R7W0MMX4SW`
- [x] Code audit — layout, scripts, events
- [ ] GA4 Realtime shows `page_view` on visit
- [ ] GA4 Realtime shows `cta_click` / `whatsapp_click` / `email_click` on interaction
- [ ] GA4 Realtime shows `generate_lead` on test form submit
- [ ] `generate_lead` marked as conversion in GA4 Admin
- [ ] `NEXT_PUBLIC_GA4_ID` set explicitly in Vercel Production (recommended)
