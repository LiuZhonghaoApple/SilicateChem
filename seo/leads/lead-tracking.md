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

## GA4 / GTM Events

Implemented in `src/lib/analytics.ts`. Events push to `window.dataLayer` (GTM) and `gtag` (GA4) when env IDs are set. In development, events also log to the browser console as `[analytics] {event}`.

### Conversion Events

| Event | Trigger | Key params |
|-------|---------|------------|
| `rfq_submit` | Quote or contact form submit / CTA | `page_path`, `page_source`, `product_interest`, `inquiry_type` |
| `sample_request` | Sample CTA or form `requestType=sample` | same |
| `tds_download` | TDS/MSDS/COA CTA or form `requestType=tds` | same |
| `cta_click` | Any tracked CTA button click | `inquiry_type`, `event_label` (includes location) |

### Engagement Events

| Event | Trigger | Key params |
|-------|---------|------------|
| `whatsapp_click` | WhatsApp link click | `page_path`, `page_source`, `product_interest`, `event_label` (location) |
| `email_click` | `mailto:` link click | same |
| `page_view_by_source` | Route change (`PageViewTracker`) | `page_path`, `funnel_layer` |

### CTA Locations (`event_label` suffix)

Tracked via `location` param in `trackCtaClick`, `trackWhatsAppClick`, `trackEmailClick`:

- `sticky_bar` — bottom persistent quote bar
- `floating_widget` — mobile/desktop floating contact widget
- `footer` — footer contact links
- `fast_contact_bar` — top fast contact strip
- `page_ctas` — `PageCTAs` component blocks
- `strong_cta` — `StrongCTA` component blocks
- `contact_page` — direct contact sidebar

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_GA4_ID` | Google Analytics 4 measurement ID (e.g. `G-XXXXXXXX`) |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager container ID (e.g. `GTM-XXXXXXX`) |
| `RESEND_API_KEY` | Optional — sends lead email via Resend |
| `INQUIRY_TO_EMAIL` | Lead delivery inbox (defaults to `SITE.email`) |
| `INQUIRY_FROM_EMAIL` | Sender address for inquiry emails |

When GA4/GTM IDs are unset, analytics helpers no-op for external tracking but still log in development.

## API Route

`POST /api/inquiry` (`src/app/api/inquiry/route.ts`):

1. Validates body with `inquirySchema` (`src/lib/validation.ts`)
2. Builds `StructuredLead` via `buildStructuredLead()`
3. Logs `[INQUIRY]` JSON to server console
4. Optionally emails lead when `RESEND_API_KEY` is configured

## Inquiry Type Mapping

| Form `requestType` | Lead `classification.inquiryType` | Analytics event |
|--------------------|-----------------------------------|-----------------|
| `quote` | `quote` | `rfq_submit` |
| `sample` | `sample` | `sample_request` |
| `tds` | `msds_tds` | `tds_download` |
| `contact` | `contact` | `rfq_submit` |

## Components Wired for Tracking

| Component | Events |
|-----------|--------|
| `InquiryForm` | `trackInquiryByType` on success |
| `PersistentCTA` (sticky + floating) | `cta_click`, `whatsapp_click`, `email_click` |
| `Footer` / `FooterContact` | `whatsapp_click`, `email_click` |
| `FastContactBar` | `cta_click`, `email_click` |
| `PageCTAs` | `cta_click` |
| `StrongCTA` | `cta_click` |
| `ContactDirectLinks` | `whatsapp_click`, `email_click` |
