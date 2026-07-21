# SEO / GEO reporting operations

## Google connections

- GA4 property: `SilicateChem Website` (`542189602`)
- Search Console property: `https://www.silicatechem.com/`
- Google Cloud APIs: Google Analytics Data API and Search Console API
- Authentication: dedicated service account with read-only OAuth scopes
- Vercel secrets: keep the complete JSON key in `GOOGLE_SERVICE_ACCOUNT_JSON`; never commit it

The service account must be added to the GA4 property and the Search Console
property. The application requests only `analytics.readonly` and
`webmasters.readonly` scopes.

## Scheduled synchronization

- `03:00 UTC`: IndexNow submission
- `03:15 UTC`: GA4, Search Console, sitemap and release snapshot synchronization
- GA4 imports the latest complete 30-day window through yesterday
- Search Console imports the latest complete 30-day window through two days ago
- Search Console URL Inspection records the latest index verdict, coverage state,
  canonical and last crawl time for every public sitemap URL
- GA4 records AI referral source together with the first landing page so AI
  traffic can be joined to persisted inquiry attribution
- Every run is idempotent: rows are upserted by date and dimension
- Sync results and failures are recorded in `reporting_sync_runs`

Manual synchronization is available to authenticated administrators on
`/admin/analytics`. The same endpoint is protected by `CRON_SECRET` for Vercel
Cron.

## Page release dates

Every public sitemap URL must have an explicit release timestamp in
`src/lib/content-freshness.ts`. The build fails when the sitemap and release
registry differ. Only change a page timestamp when that public page receives a
material content update; do not refresh dates mechanically.

## AI crawler policy

The canonical crawler matrix lives in `src/lib/seo/ai-crawler-policy.ts` and is
used by both `robots.txt` and the administrator reporting page. Search and
user-request crawlers are allowed, training-only crawlers are blocked, and
private/admin/API paths remain disallowed.

## GEO monitoring workflow

The authenticated `/admin/analytics` dashboard is the operating record for:

- ChatGPT, Copilot, Perplexity, Claude, Gemini and other AI referral landing pages
- AI-originated inquiry counts and landing-page conversion
- Manual citation checks, including the tested question, provider, cited page and result
- Google URL Inspection freshness and canonical state
- Latest IndexNow delivery response; this is a discovery signal, not proof of Bing inclusion
- Content version, evidence source, review status and reviewer notes for every sitemap page

Each public page is registered from the controlled content-release registry.
When its version changes, its GEO review state automatically returns to
`source_linked` until an administrator completes the next human review.
