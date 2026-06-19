# Lead Tracking — SilicateChem Conversion System

Documentation for RFQ lead capture, analytics events, and attribution fields used across the SilicateChem site.

## Lead Record Schema

Each form submission via `POST /api/inquiry` produces a structured lead (`buildStructuredLead()` in `src/lib/leads.ts`).

| Field | Source | Description |
|-------|--------|-------------|
| **date** | `submittedAt` | ISO 8601 server timestamp |
| **source page** | `classification.sourcePage` | Hidden form `source` field or pathname-derived context |
| **product** | `interest.product` | Product select value (e.g. Sodium Metasilicate Granules) |
| **country** | `contact.country` | Buyer country (required form field) |
| **inquiry type** | `classification.inquiryType` | `quote` \| `sample` \| `msds_tds` \| `contact` |

### Example Lead JSON

```json
{
  "id": "lead_1718700000000_abc12de",
  "submittedAt": "2026-06-18T12:00:00.000Z",
  "contact": {
    "name": "Jane Buyer",
    "email": "buyer@importer-co.com",
    "company": "Example Detergent Co.",
    "country": "Germany"
  },
  "interest": {
    "product": "Sodium Metasilicate Granules",
    "quantity": "20 MT / 1 FCL"
  },
  "classification": {
    "inquiryType": "quote",
    "sourcePage": "guide-supplier-selection",
    "funnelLayer": "guide"
  },
  "message": "Request quotation for granule grade, CIF Hamburg."
}
```

See also: [`lead-schema.md`](./lead-schema.md) for full field reference and funnel layer mapping.

## Form Fields (`InquiryForm`)

| Field | Name | Required |
|-------|------|----------|
| Contact name | `name` | Yes |
| Company | `company` | Yes |
| Email | `email` | Yes |
| Country | `country` | Yes |
| Product interest | `product` | No (pre-filled from URL/props) |
| Quantity | `quantity` | No |
| Inquiry type | `requestType` | No (default `quote`) |
| Message | `message` | Yes |
| Source page | `source` | Hidden — from `?source=` URL param or `getRfqContext(pathname)` |

Pre-fill via URL: `/contact?type=sample&product=Sodium+Metasilicate+Granules&source=guide-price-factors`

## Source Page Attribution

Set by `src/lib/page-rfq-context.ts` on global CTAs and passed as hidden `source` on the contact form:

| Path pattern | `source` value | Funnel layer |
|--------------|----------------|--------------|
| `/` | `homepage` | homepage |
| `/products/sodium-metasilicate` | `money-page` | money |
| `/products/{grade}` | `product-page` | money |
| `/guides/{slug}` | `guide-{slug}` | guide |
| `/applications/{slug}` | `application-{slug}` | application |
| `/blog/{slug}` | `blog-{slug}` | blog |
| Other (e.g. `/contact`) | pathname fallback | other |

## GA4 Events

Implemented in `src/lib/analytics.ts`. Events send via `gtag` when `GA4_MEASUREMENT_ID` is set (`NEXT_PUBLIC_GA4_ID` or default `G-R7W0MMX4SW`). In development, events also log to the browser console as `[analytics] {event}`.

SPA page views use `PageViewTracker` with `send_page_view: false` in the initial gtag config to avoid double-counting.

### Conversion Events

| Event | Trigger | Key params |
|-------|---------|------------|
| `generate_lead` | Inquiry form **successful** submit only | `page`, `product`, `inquiry_type` |
| `cta_click` | Tracked CTA button/link click | `page`, `cta_name` |

**Note:** CTA clicks do **not** fire `generate_lead`. Only a completed form submission does.

### Engagement Events

| Event | Trigger | Key params |
|-------|---------|------------|
| `whatsapp_click` | WhatsApp link click | `page` |
| `email_click` | `mailto:` link click | `page` |
| `page_view` | Route change (`PageViewTracker`, all routes) | `page_path`, `page_location` |

### CTA names (`cta_name`)

Built by `ctaNameForType(type, location?)`:

| CTA type | Base `cta_name` |
|----------|-----------------|
| Quote | `request_quote` |
| Sample | `request_sample` |
| TDS/MSDS | `get_tds` |
| Contact | `contact_factory` |

With location prefix: e.g. `request_quote:sticky_bar`, `request_quote:header`, `get_tds:page_ctas`.

Common locations: `sticky_bar`, `floating_widget`, `footer`, `fast_contact_bar`, `page_ctas`, `strong_cta`, `header`, `header_mobile`, `contact_page`.

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_GA4_ID` | Google Analytics 4 measurement ID — production: `G-R7W0MMX4SW` (silicatechem.com) |
| `RESEND_API_KEY` | Optional — sends lead email via Resend |
| `INQUIRY_TO_EMAIL` | Lead delivery inbox (defaults to `SITE.email`) |
| `INQUIRY_FROM_EMAIL` | Sender address for inquiry emails |

When GA4 ID is unset at build time, code still defaults to `G-R7W0MMX4SW`. GTM is no longer required for analytics (GA4-direct only).

## API Route

`POST /api/inquiry` (`src/app/api/inquiry/route.ts`):

1. Validates body with `inquirySchema` (`src/lib/validation.ts`)
2. Builds `StructuredLead` via `buildStructuredLead()`
3. Logs `[INQUIRY]` JSON to server console
4. Optionally emails lead when `RESEND_API_KEY` is configured

## Inquiry Type Mapping

| Form `requestType` | Lead `classification.inquiryType` | GA4 `inquiry_type` on `generate_lead` |
|--------------------|-----------------------------------|---------------------------------------|
| `quote` | `quote` | `quote` |
| `sample` | `sample` | `sample` |
| `tds` | `msds_tds` | `tds` |
| `contact` | `contact` | `contact` |

## Components Wired for Tracking

| Component | Events |
|-----------|--------|
| `InquiryForm` | `generate_lead` on success |
| `PersistentCTA` (sticky + floating) | `cta_click`, `whatsapp_click`, `email_click` |
| `Header` | `cta_click` (Request Quote desktop + mobile) |
| `Footer` / `FooterContact` | `whatsapp_click`, `email_click` |
| `FastContactBar` | `cta_click`, `email_click` |
| `PageCTAs` | `cta_click` |
| `StrongCTA` | `cta_click` |
| `ContactDirectLinks` | `whatsapp_click`, `email_click` |

See [`../GA4_SETUP.md`](../GA4_SETUP.md) for Realtime verification steps.
