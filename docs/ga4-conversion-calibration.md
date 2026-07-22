# GA4 Conversion Calibration

## Measurement contract

The website sends a standard `page_view` event on every public route. The
custom `page_view_by_source` data-layer event is retained for source-aware
debugging. `/admin` is excluded by `RouteShell` and does not enter the public
traffic funnel.

The website also records the following conversion events in the first-party
conversion table and mirrors them to GA4/GTM:

| Event | Meaning | GA4 key event |
| --- | --- | --- |
| `rfq_submit` | Inquiry API accepted a buyer form submission | Yes |
| `whatsapp_click` | Buyer clicked a WhatsApp link | Yes |
| `ai_advisor_handoff` | Buyer moved from the AI advisor to WhatsApp or RFQ | Yes |
| `rfq_start` | RFQ CTA click or first inquiry-form interaction | No |
| `ai_advisor_open` | Advisor panel opened | No |
| `ai_advisor_question` | A question was submitted | No |
| `ai_advisor_answer` | Advisor returned an answer | No |

Mark only the three “Yes” events as key events in GA4. `rfq_start` is an
intent signal, not a completed lead, so it must not be counted as a key event.
The first-party dashboard separately compares event counts with non-spam CRM
leads; it is the source of truth for delivered inquiries.

## Attribution and deduplication boundaries

- Events include page path, page source, product interest, inquiry type and
  UTM/referrer attribution where available.
- The conversion endpoint hashes visitor and IP identifiers and enforces a
  persistent per-IP and global rate limit.
- `event_id` is unique; retries are idempotent in the first-party database.
- GA4 collection is consent-gated by Consent Mode v2. The site sends the
  standard page view explicitly because automatic page views are disabled until
  consent initialization completes.

## GSC commercial-keyword action

The primary keyword owner remains unique per page. Supporting commercial
variants (supplier, factory, quotation, price, exporter) are limited to the
matching product or buyer-intent guide and are passed into page metadata. This
supports English commercial queries observed in the existing GSC handoff while
avoiding a broad Chinese-keyword rewrite or cross-page cannibalization.

Review GSC query/page rows after 7–28 days. Promote a supporting term into a
title or heading only when the query has impressions for the mapped page; do
not infer ranking movement from metadata changes alone.

## Read-only GSC baseline (2026-07-22)

Property checked: `https://www.silicatechem.com/` using the authorised
`padelonesource@gmail.com` session. The 3-month web report showed 4 clicks, 688
impressions, 0.6% CTR and an average position of 31.5. Commercial query rows
included:

- `sodium metasilicate pentahydrate market` — 102 impressions;
- `sodium metasilicate supplier` — 55 impressions;
- `sodium metasilicate distributor` — 33 impressions;
- `sodium metasilicate production plant cost` — 18 impressions;
- `sodium metasilicate pentahydrate production plant cost` — 17 impressions.

The page report showed 177 impressions for `/products/sodium-metasilicate`,
160 for `/products/sodium-metasilicate-pentahydrate`, and 94 for
`/guides/supplier-selection`, with zero clicks in the displayed rows. This is a
baseline for the metadata change, not proof of a ranking or click increase.
