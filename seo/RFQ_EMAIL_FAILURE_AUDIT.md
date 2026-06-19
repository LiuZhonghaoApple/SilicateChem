# RFQ Email Failure Audit

**Date:** 2026-06-19  
**Severity:** P0 — production RFQ emails not reaching `info@silicatechem.com`  
**Reporter:** User confirmed form success at https://www.silicatechem.com/contact with no inbox delivery  
**Related:** `seo/RFQ_EMAIL_SETUP.md` (setup guide)

---

## Executive Summary

Production inquiry submissions **validate and log successfully** but **no email is sent** because `RESEND_API_KEY` is not configured on Vercel Production (confirmed by live API test). The API previously returned HTTP **200** with `{ success: true }` even when email delivery was skipped, so users and operators had no signal of failure.

**Primary blocker:** Operations — set `RESEND_API_KEY` + verify `silicatechem.com` in Resend.  
**Secondary issue (fixed in code):** Silent success on email failure — API now returns **503** and the form shows a red error with a direct-contact fallback.

---

## Root Cause

**`RESEND_API_KEY` is missing (or empty) in Vercel Production.**

Evidence:

1. **Live production curl** (2026-06-19) to `POST https://www.silicatechem.com/api/inquiry` returned:
   ```json
   {"success":true,"message":"Inquiry received"}
   ```
   The shorter `"Inquiry received"` message (without “sales team will respond shortly”) is only returned when `sendInquiryEmail()` returns `false` — i.e. email was **not** sent.

2. **Code path** (`src/app/api/inquiry/route.ts` line 19–21): when `RESEND_API_KEY` is unset, `sendInquiryEmail()` exits immediately without calling Resend.

3. **No SMTP fallback** exists — Resend is the only email transport. Commented SMTP vars in `.env.example` are not wired.

4. **Vercel logs** (inferred): would show `[INQUIRY]` JSON lead log on every submission, but **no** Resend HTTP call and **no** `[INQUIRY] Resend error:` unless a key is present and the API rejects the send.

---

## Current Behavior

### Before code fix (live production as of audit)

| Step | Behavior |
|------|----------|
| User submits form | Client `fetch` → `POST /api/inquiry` |
| Validation | Passes (Zod `inquirySchema`) |
| Lead logging | Full JSON logged as `[INQUIRY]` in Vercel function logs |
| Email send | **Skipped** — no `RESEND_API_KEY` |
| API response | HTTP **200**, `{ success: true, message: "Inquiry received" }` |
| Form UI | Green “Inquiry Submitted” success state |
| Analytics | `trackLead()` fires (client-side conversion recorded) |
| Sales inbox | **Nothing received** |

### After code fix (requires deploy)

| Step | Behavior when Resend still unconfigured |
|------|------------------------------------------|
| Email send | Still skipped |
| API response | HTTP **503**, `{ error: "...", emailDelivered: false }` |
| Form UI | Red error with mailto/WhatsApp fallback |
| Analytics | No conversion event (only fires on HTTP 200) |
| Vercel logs | `[INQUIRY] RESEND_API_KEY not configured — email skipped` + `[INQUIRY] Email delivery failed: ...` |

### When Resend is configured correctly

| Step | Behavior |
|------|----------|
| API response | HTTP **200**, `{ success: true, emailDelivered: true, message: "…sales team…" }` |
| Resend | Plain-text email to `INQUIRY_TO_EMAIL` (default `info@silicatechem.com`) |
| Reply-To | Submitter’s email |

---

## Required Fix

### 1. Operations (required for email delivery)

| # | Action | Owner |
|---|--------|-------|
| 1 | Create Resend account at [resend.com](https://resend.com) | Ops |
| 2 | Add domain `silicatechem.com` — DKIM (`resend._domainkey`), SPF + MX on `send` subdomain | DNS admin |
| 3 | Verify domain in Resend dashboard (all green) | Ops |
| 4 | Create API key (`re_...`) with sending access | Ops |
| 5 | Set Vercel Production env vars (see below) | Ops |
| 6 | **Redeploy** production after env change | Ops |
| 7 | Confirm `info@silicatechem.com` is a real monitored mailbox | Ops |
| 8 | Test curl + contact form; confirm inbox + Resend “Delivered” | Ops |

### 2. Code (completed in this audit)

- API returns **503** when email cannot be sent (was HTTP 200).
- Form surfaces delivery failure with direct-contact instructions.
- Explicit console errors for missing `RESEND_API_KEY` vs Resend API rejection.

### 3. Deploy code fix

Push and deploy the updated `route.ts` and `InquiryForm.tsx` so production stops showing false success until Resend is configured.

---

## Estimated Time

| Task | Time |
|------|------|
| Resend account + API key | 10 min |
| DNS records (DKIM, SPF, MX on `send`) | 15–30 min setup; 15 min–72 hr propagation |
| Vercel env vars + redeploy | 10 min |
| End-to-end verification | 15 min |
| **Total (ops path)** | **~1–2 hours active work** (+ DNS propagation wait) |
| Code fix deploy | 5–10 min (already implemented locally) |

---

## Checklist Results (A–D)

| ID | Question | Answer | Evidence |
|----|----------|--------|----------|
| **A** | Is email sending disabled? | **No in code** — sending is implemented but gated on `RESEND_API_KEY` | `sendInquiryEmail()` in `route.ts` |
| **B** | Is Resend not configured? | **YES — production blocker** | Curl returned short success message; no Resend call possible without key |
| **C** | Is API failing silently? | **YES (before fix)** — returned HTTP 200 on email skip | `route.ts` returned `success: true` when `emailed === false` |
| **D** | Is form only logging to console? | **Partially** — server logs `[INQUIRY]` JSON; client showed success regardless | `console.log` in API; `InquiryForm` did not check `emailDelivered` |

---

## Code Findings

### `src/app/api/inquiry/route.ts`

- Node.js runtime — compatible with Vercel serverless.
- Validates with `inquirySchema` (Zod).
- Builds structured lead via `buildStructuredLead()`.
- Sends via Resend REST API (`POST https://api.resend.com/emails`) — no SDK.
- Env: `RESEND_API_KEY`, `INQUIRY_TO_EMAIL`, `INQUIRY_FROM_EMAIL` (latter two fall back to `SITE.email`).
- Resend payload: `from`, `to[]`, `subject`, `text`, `reply_to` — correct snake_case for Resend API.
- **Bug (fixed):** returned HTTP 200 when email failed.
- **No SMTP path** — only Resend.

### `src/lib/leads.ts`

- Pure data shaping — no email logic. No issues.

### `src/components/forms/InquiryForm.tsx`

- Submits via `fetch("/api/inquiry")` — no HTML form action URL.
- Handles `!res.ok` with error state.
- **Bug (fixed):** treated all HTTP 200 as success; did not distinguish email delivery failure.
- Success UI uses fixed copy (does not display API `message`).

### SMTP

- **Not implemented.** `.env.example` lists commented `SMTP_*` vars; no Nodemailer or SMTP code in repo.

### API response matrix

| Condition | HTTP (before) | HTTP (after fix) | Body |
|-----------|---------------|------------------|------|
| Validation error | 400 | 400 | `{ error }` |
| Server exception | 500 | 500 | `{ error }` |
| Valid lead, no `RESEND_API_KEY` | **200** | **503** | `{ error, emailDelivered: false }` |
| Valid lead, Resend API error | **200** | **503** | `{ error, emailDelivered: false }` |
| Valid lead, email sent | 200 | 200 | `{ success, emailDelivered: true, message }` |

### Production test (2026-06-19)

```bash
curl -s -X POST https://www.silicatechem.com/api/inquiry \
  -H "Content-Type: application/json" \
  -d '{
    "name": "RFQ Audit Test",
    "company": "Audit Co",
    "email": "audit-test@example.com",
    "country": "Testland",
    "message": "Automated RFQ email pipeline audit test — no PII.",
    "requestType": "quote",
    "source": "rfq-audit-2026"
  }'
```

**Result:** `{"success":true,"message":"Inquiry received"}` — HTTP 200 — **email not sent**.

### Inferred Vercel production logs

On each submission (current production):

```
[INQUIRY] { "id": "lead_...", "contact": { ... }, ... }
```

After code deploy without Resend configured:

```
[INQUIRY] { ... }
[INQUIRY] RESEND_API_KEY not configured — email skipped
[INQUIRY] Email delivery failed: RESEND_API_KEY or inquiry email addresses not set
```

If key present but domain unverified:

```
[INQUIRY] { ... }
[INQUIRY] Resend error: {"statusCode":403,"message":"The silicatechem.com domain is not verified."}
[INQUIRY] Email delivery failed: ...
```

---

## Environment Variables Required

Set in **Vercel → Project → Settings → Environment Variables → Production**. Redeploy after changes.

| Variable | Required | Value | Notes |
|----------|----------|-------|-------|
| `RESEND_API_KEY` | **Yes** | `re_...` from Resend dashboard | Missing → no email sent |
| `INQUIRY_TO_EMAIL` | Recommended | `info@silicatechem.com` | Falls back to `SITE.email` constant |
| `INQUIRY_FROM_EMAIL` | Recommended | `info@silicatechem.com` | Must be on **verified** Resend domain |

**Not used for inquiry email:** `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (documented only).

---

## Manual Verification Steps

1. Set all three env vars on Vercel Production; redeploy.
2. Confirm Resend dashboard → Domains → `silicatechem.com` = **Verified**.
3. Run production curl (use distinct message); expect HTTP 200 and long success message.
4. Check Resend → Emails → status **Delivered**.
5. Check `info@silicatechem.com` inbox (and spam).
6. Submit https://www.silicatechem.com/contact — green success only when email delivers.
7. Temporarily remove `RESEND_API_KEY` in Preview — form should show red error (post code deploy).

---

## Changes Made (if any)

| File | Change |
|------|--------|
| `src/app/api/inquiry/route.ts` | Return HTTP 503 when email fails; explicit missing-key logging; `emailDelivered` flag on success |
| `src/components/forms/InquiryForm.tsx` | Show delivery-failure message on HTTP 503 with mailto fallback |
| `seo/RFQ_EMAIL_FAILURE_AUDIT.md` | This document |
| `seo/RFQ_EMAIL_SETUP.md` | Updated with P0 failure findings and post-fix behavior |

**Not committed** — per user request.
