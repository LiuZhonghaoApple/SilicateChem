# Lead Schema — SilicateChem RFQ System

Structured lead object produced by `POST /api/inquiry` via `buildStructuredLead()` in `src/lib/leads.ts`.

## Purpose

- Consistent lead format for logging, email delivery, CRM webhooks, and analytics correlation
- Source page and funnel layer attribution for conversion reporting
- Inquiry type classification for sales routing

## JSON Structure

```json
{
  "id": "lead_1718700000000_abc12de",
  "submittedAt": "2026-06-18T12:00:00.000Z",
  "contact": {
    "name": "Jane Buyer",
    "email": "buyer@example.com",
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
  "message": "Request quotation for granule grade, CIF Hamburg.",
  "meta": {
    "userAgent": "Mozilla/5.0 ...",
    "referer": "https://silicatechem.com/guides/supplier-selection",
    "siteUrl": "https://silicatechem.com"
  }
}
```

## Field Reference

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique lead ID: `lead_{timestamp}_{random}` |
| `submittedAt` | ISO 8601 | Server submission time |
| `contact.name` | string | Required — contact person |
| `contact.email` | string | Required — reply address |
| `contact.company` | string | Required — buyer company |
| `contact.country` | string | Required — destination/import country |
| `interest.product` | string \| null | Product name from form select |
| `interest.quantity` | string \| null | Estimated volume |
| `classification.inquiryType` | enum | `quote` \| `sample` \| `msds_tds` \| `contact` |
| `classification.sourcePage` | string \| null | From hidden `source` field (e.g. `guide-price-factors`, `money-page`) |
| `classification.funnelLayer` | enum | `money` \| `guide` \| `application` \| `blog` \| `homepage` \| `other` |
| `message` | string | Buyer inquiry details |
| `meta.userAgent` | string \| null | HTTP User-Agent |
| `meta.referer` | string \| null | HTTP Referer |
| `meta.siteUrl` | string | `NEXT_PUBLIC_SITE_URL` |

## Inquiry Type Mapping

| Form `requestType` | `classification.inquiryType` | Analytics event |
|--------------------|------------------------------|-----------------|
| `quote` | `quote` | `rfq_submit` |
| `sample` | `sample` | `sample_request` |
| `tds` | `msds_tds` | `tds_download` |
| `contact` | `contact` | `rfq_submit` |

## Source Page Values

Set via URL `?source=` on contact links (`src/lib/page-rfq-context.ts`):

| Source | Funnel layer |
|--------|--------------|
| `homepage` | homepage |
| `money-page` | money |
| `product-page` | money |
| `guide-{slug}` | guide |
| `application-{slug}` | application |
| `blog-{slug}` | blog |

## API Response

```json
{
  "success": true,
  "message": "Inquiry received",
  "leadId": "lead_1718700000000_abc12de"
}
```

## Production Integration (TODO)

1. **Email:** Send `lead` JSON to `INQUIRY_TO_EMAIL` via Resend when `RESEND_API_KEY` is set
2. **CRM:** POST to HubSpot/Zoho webhook with mapped fields
3. **Storage:** Append to database or Google Sheets for sales dashboard
4. **Analytics:** Correlate `leadId` with GA4 `rfq_submit` event via `event_label`

## Log Format

Server logs: `[LEAD]` prefix with full JSON (development). Replace with secure logging in production.
