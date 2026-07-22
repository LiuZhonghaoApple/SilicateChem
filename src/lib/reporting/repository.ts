import { getDatabase } from "@/lib/db";
import type {
  Ga4DailyRow,
  Ga4LandingSourceRow,
  Ga4PageRow,
  Ga4SourceRow,
  GscDailyRow,
  GscPageRow,
  GscQueryRow,
  GscSitemapSnapshot,
  GscUrlInspectionRow,
  ReportingProvider,
  ReportingSyncStatus,
} from "@/lib/reporting/types";

export async function recordReportingSyncRun(params: {
  provider: ReportingProvider;
  status: ReportingSyncStatus;
  trigger: string;
  startDate: string;
  endDate: string;
  rowCount: number;
  error?: string;
}): Promise<void> {
  const sql = getDatabase();
  await sql`INSERT INTO reporting_sync_runs (
    provider, status, trigger, window_start, window_end, row_count, error
  ) VALUES (
    ${params.provider}, ${params.status}, ${params.trigger}, ${params.startDate},
    ${params.endDate}, ${params.rowCount}, ${params.error?.slice(0, 2_000) ?? null}
  )`;
}

export async function upsertGa4Data(params: {
  daily: Ga4DailyRow[];
  sources: Ga4SourceRow[];
  pages: Ga4PageRow[];
  landingSources: Ga4LandingSourceRow[];
}): Promise<number> {
  const sql = getDatabase();
  const queries = [
    ...params.daily.map((row) => sql`INSERT INTO ga4_daily_metrics (
      metric_date, sessions, total_users, new_users, engaged_sessions,
      screen_page_views, engagement_rate, key_events, synced_at
    ) VALUES (
      ${row.date}, ${row.sessions}, ${row.totalUsers}, ${row.newUsers},
      ${row.engagedSessions}, ${row.screenPageViews}, ${row.engagementRate},
      ${row.keyEvents}, NOW()
    ) ON CONFLICT (metric_date) DO UPDATE SET
      sessions = EXCLUDED.sessions,
      total_users = EXCLUDED.total_users,
      new_users = EXCLUDED.new_users,
      engaged_sessions = EXCLUDED.engaged_sessions,
      screen_page_views = EXCLUDED.screen_page_views,
      engagement_rate = EXCLUDED.engagement_rate,
      key_events = EXCLUDED.key_events,
      synced_at = NOW()`),
    ...params.sources.map((row) => sql`INSERT INTO ga4_source_daily (
      metric_date, source, medium, channel_group, sessions, total_users,
      key_events, synced_at
    ) VALUES (
      ${row.date}, ${row.source}, ${row.medium}, ${row.channelGroup},
      ${row.sessions}, ${row.totalUsers}, ${row.keyEvents}, NOW()
    ) ON CONFLICT (metric_date, source, medium, channel_group) DO UPDATE SET
      sessions = EXCLUDED.sessions,
      total_users = EXCLUDED.total_users,
      key_events = EXCLUDED.key_events,
      synced_at = NOW()`),
    ...params.pages.map((row) => sql`INSERT INTO ga4_page_daily (
      metric_date, page_path, sessions, total_users, screen_page_views,
      key_events, synced_at
    ) VALUES (
      ${row.date}, ${row.pagePath}, ${row.sessions}, ${row.totalUsers},
      ${row.screenPageViews}, ${row.keyEvents}, NOW()
    ) ON CONFLICT (metric_date, page_path) DO UPDATE SET
      sessions = EXCLUDED.sessions,
      total_users = EXCLUDED.total_users,
      screen_page_views = EXCLUDED.screen_page_views,
      key_events = EXCLUDED.key_events,
      synced_at = NOW()`),
    ...params.landingSources.map((row) => sql`INSERT INTO ga4_landing_source_daily (
      metric_date, source, medium, channel_group, landing_page, sessions,
      total_users, key_events, synced_at
    ) VALUES (
      ${row.date}, ${row.source}, ${row.medium}, ${row.channelGroup},
      ${row.landingPage}, ${row.sessions}, ${row.totalUsers}, ${row.keyEvents}, NOW()
    ) ON CONFLICT (metric_date, source, medium, channel_group, landing_page) DO UPDATE SET
      sessions = EXCLUDED.sessions,
      total_users = EXCLUDED.total_users,
      key_events = EXCLUDED.key_events,
      synced_at = NOW()`),
  ];

  if (queries.length > 0) await sql.transaction(queries);
  return queries.length;
}

export async function upsertGscData(params: {
  daily: GscDailyRow[];
  queries: GscQueryRow[];
  pages: GscPageRow[];
  sitemap: GscSitemapSnapshot;
  inspections: GscUrlInspectionRow[];
  snapshotDate: string;
}): Promise<number> {
  const sql = getDatabase();
  const queries = [
    ...params.daily.map((row) => sql`INSERT INTO gsc_daily_metrics (
      metric_date, clicks, impressions, ctr, position, synced_at
    ) VALUES (
      ${row.date}, ${row.clicks}, ${row.impressions}, ${row.ctr},
      ${row.position}, NOW()
    ) ON CONFLICT (metric_date) DO UPDATE SET
      clicks = EXCLUDED.clicks,
      impressions = EXCLUDED.impressions,
      ctr = EXCLUDED.ctr,
      position = EXCLUDED.position,
      synced_at = NOW()`),
    ...params.queries.map((row) => sql`INSERT INTO gsc_query_daily (
      metric_date, query, clicks, impressions, ctr, position, synced_at
    ) VALUES (
      ${row.date}, ${row.query}, ${row.clicks}, ${row.impressions},
      ${row.ctr}, ${row.position}, NOW()
    ) ON CONFLICT (metric_date, query) DO UPDATE SET
      clicks = EXCLUDED.clicks,
      impressions = EXCLUDED.impressions,
      ctr = EXCLUDED.ctr,
      position = EXCLUDED.position,
      synced_at = NOW()`),
    ...params.pages.map((row) => sql`INSERT INTO gsc_page_daily (
      metric_date, page, clicks, impressions, ctr, position, synced_at
    ) VALUES (
      ${row.date}, ${row.page}, ${row.clicks}, ${row.impressions},
      ${row.ctr}, ${row.position}, NOW()
    ) ON CONFLICT (metric_date, page) DO UPDATE SET
      clicks = EXCLUDED.clicks,
      impressions = EXCLUDED.impressions,
      ctr = EXCLUDED.ctr,
      position = EXCLUDED.position,
      synced_at = NOW()`),
    sql`INSERT INTO gsc_site_snapshots (
      snapshot_date, sitemap_submitted, sitemap_indexed,
      sitemap_errors, sitemap_warnings, checked_at
    ) VALUES (
      ${params.snapshotDate}, ${params.sitemap.submitted}, ${params.sitemap.indexed},
      ${params.sitemap.errors}, ${params.sitemap.warnings}, NOW()
    ) ON CONFLICT (snapshot_date) DO UPDATE SET
      sitemap_submitted = EXCLUDED.sitemap_submitted,
      sitemap_indexed = EXCLUDED.sitemap_indexed,
      sitemap_errors = EXCLUDED.sitemap_errors,
      sitemap_warnings = EXCLUDED.sitemap_warnings,
      checked_at = NOW()`,
    ...params.inspections.map((row) => sql`INSERT INTO gsc_url_inspection_snapshots (
      snapshot_date, inspected_url, verdict, coverage_state, robots_txt_state,
      indexing_state, last_crawl_time, page_fetch_state, google_canonical,
      user_canonical, crawled_as, checked_at
    ) VALUES (
      ${params.snapshotDate}, ${row.inspectedUrl}, ${row.verdict}, ${row.coverageState},
      ${row.robotsTxtState}, ${row.indexingState}, ${row.lastCrawlTime},
      ${row.pageFetchState}, ${row.googleCanonical}, ${row.userCanonical},
      ${row.crawledAs}, NOW()
    ) ON CONFLICT (snapshot_date, inspected_url) DO UPDATE SET
      verdict = EXCLUDED.verdict,
      coverage_state = EXCLUDED.coverage_state,
      robots_txt_state = EXCLUDED.robots_txt_state,
      indexing_state = EXCLUDED.indexing_state,
      last_crawl_time = EXCLUDED.last_crawl_time,
      page_fetch_state = EXCLUDED.page_fetch_state,
      google_canonical = EXCLUDED.google_canonical,
      user_canonical = EXCLUDED.user_canonical,
      crawled_as = EXCLUDED.crawled_as,
      checked_at = NOW()`),
  ];

  if (queries.length > 0) await sql.transaction(queries);
  return queries.length;
}

export async function upsertSiteSnapshot(params: {
  snapshotDate: string;
  publicPageCount: number;
  updatedPageCount: number;
}): Promise<void> {
  const sql = getDatabase();
  await sql`INSERT INTO site_daily_snapshots (
    snapshot_date, public_page_count, updated_page_count, checked_at
  ) VALUES (
    ${params.snapshotDate}, ${params.publicPageCount}, ${params.updatedPageCount}, NOW()
  ) ON CONFLICT (snapshot_date) DO UPDATE SET
    public_page_count = EXCLUDED.public_page_count,
    updated_page_count = EXCLUDED.updated_page_count,
    checked_at = NOW()`;
}

export async function upsertGeoContentRegistry(
  records: Array<{ pagePath: string; contentVersion: string; evidenceSource: string }>
): Promise<number> {
  const sql = getDatabase();
  const queries = records.map((record) => sql`INSERT INTO geo_content_reviews (
    page_path, content_version, evidence_source, review_status, updated_at
  ) VALUES (
    ${record.pagePath}, ${record.contentVersion}, ${record.evidenceSource}, 'source_linked', NOW()
  ) ON CONFLICT (page_path) DO UPDATE SET
    content_version = EXCLUDED.content_version,
    evidence_source = EXCLUDED.evidence_source,
    review_status = CASE
      WHEN geo_content_reviews.content_version <> EXCLUDED.content_version THEN 'source_linked'
      ELSE geo_content_reviews.review_status
    END,
    reviewed_by = CASE
      WHEN geo_content_reviews.content_version <> EXCLUDED.content_version THEN NULL
      ELSE geo_content_reviews.reviewed_by
    END,
    reviewed_at = CASE
      WHEN geo_content_reviews.content_version <> EXCLUDED.content_version THEN NULL
      ELSE geo_content_reviews.reviewed_at
    END,
    updated_at = NOW()`);
  if (queries.length > 0) await sql.transaction(queries);
  return queries.length;
}

export type ReportingOverview = {
  sessions: number;
  users: number;
  newUsers: number;
  pageViews: number;
  engagementRate: number;
  keyEvents: number;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export async function getReportingOverview(days = 30): Promise<ReportingOverview> {
  const sql = getDatabase();
  const rows = await sql.query(
    `WITH ga4 AS (
      SELECT
        COALESCE(SUM(sessions), 0)::int AS sessions,
        COALESCE(SUM(total_users), 0)::int AS users,
        COALESCE(SUM(new_users), 0)::int AS "newUsers",
        COALESCE(SUM(screen_page_views), 0)::int AS "pageViews",
        COALESCE(SUM(engagement_rate * sessions) / NULLIF(SUM(sessions), 0), 0)::float8 AS "engagementRate",
        COALESCE(SUM(key_events), 0)::float8 AS "keyEvents"
      FROM ga4_daily_metrics
      WHERE metric_date >= CURRENT_DATE - ($1::int - 1)
    ), gsc AS (
      SELECT
        COALESCE(SUM(clicks), 0)::float8 AS clicks,
        COALESCE(SUM(impressions), 0)::float8 AS impressions,
        COALESCE(SUM(clicks) / NULLIF(SUM(impressions), 0), 0)::float8 AS ctr,
        COALESCE(SUM(position * impressions) / NULLIF(SUM(impressions), 0), 0)::float8 AS position
      FROM gsc_daily_metrics
      WHERE metric_date >= CURRENT_DATE - ($1::int - 1)
    ) SELECT * FROM ga4 CROSS JOIN gsc`,
    [days]
  );
  const result = rows as unknown as ReportingOverview[];
  return result[0] ?? {
    sessions: 0,
    users: 0,
    newUsers: 0,
    pageViews: 0,
    engagementRate: 0,
    keyEvents: 0,
    clicks: 0,
    impressions: 0,
    ctr: 0,
    position: 0,
  };
}

export type ReportingTrendRow = {
  date: string;
  sessions: number;
  users: number;
  pageViews: number;
  clicks: number;
  impressions: number;
};

export async function getReportingTrend(days = 14): Promise<ReportingTrendRow[]> {
  const sql = getDatabase();
  const rows = await sql.query(
    `SELECT
      COALESCE(ga4.metric_date, gsc.metric_date)::text AS date,
      COALESCE(ga4.sessions, 0)::int AS sessions,
      COALESCE(ga4.total_users, 0)::int AS users,
      COALESCE(ga4.screen_page_views, 0)::int AS "pageViews",
      COALESCE(gsc.clicks, 0)::float8 AS clicks,
      COALESCE(gsc.impressions, 0)::float8 AS impressions
    FROM ga4_daily_metrics ga4
    FULL OUTER JOIN gsc_daily_metrics gsc ON gsc.metric_date = ga4.metric_date
    WHERE COALESCE(ga4.metric_date, gsc.metric_date) >= CURRENT_DATE - ($1::int - 1)
    ORDER BY date DESC`,
    [days]
  );
  return rows as unknown as ReportingTrendRow[];
}

export type TrafficSourceRow = {
  source: string;
  medium: string;
  channelGroup: string;
  sessions: number;
  users: number;
  keyEvents: number;
};

export async function getTrafficSources(days = 30, limit = 15): Promise<TrafficSourceRow[]> {
  const sql = getDatabase();
  const rows = await sql.query(
    `SELECT source, medium, channel_group AS "channelGroup",
      SUM(sessions)::int AS sessions,
      SUM(total_users)::int AS users,
      SUM(key_events)::float8 AS "keyEvents"
    FROM ga4_source_daily
    WHERE metric_date >= CURRENT_DATE - ($1::int - 1)
    GROUP BY source, medium, channel_group
    ORDER BY sessions DESC, users DESC
    LIMIT $2`,
    [days, limit]
  );
  return rows as unknown as TrafficSourceRow[];
}

export async function getGeoTrafficSources(days = 30): Promise<TrafficSourceRow[]> {
  const sql = getDatabase();
  const rows = await sql.query(
    `SELECT source, medium, channel_group AS "channelGroup",
      SUM(sessions)::int AS sessions,
      SUM(total_users)::int AS users,
      SUM(key_events)::float8 AS "keyEvents"
    FROM ga4_source_daily
    WHERE metric_date >= CURRENT_DATE - ($1::int - 1)
      AND LOWER(source || ' ' || medium || ' ' || channel_group) ~
        '(chatgpt|openai|perplexity|claude|anthropic|gemini|copilot|grok|ai.assistant)'
    GROUP BY source, medium, channel_group
    ORDER BY sessions DESC`,
    [days]
  );
  return rows as unknown as TrafficSourceRow[];
}

export type PagePerformanceRow = {
  pagePath: string;
  sessions: number;
  users: number;
  pageViews: number;
  keyEvents: number;
  inquiries: number;
};

export async function getPagePerformance(days = 30, limit = 20): Promise<PagePerformanceRow[]> {
  const sql = getDatabase();
  const rows = await sql.query(
    `WITH traffic AS (
      SELECT page_path,
        SUM(sessions)::int AS sessions,
        SUM(total_users)::int AS users,
        SUM(screen_page_views)::int AS "pageViews",
        SUM(key_events)::float8 AS "keyEvents"
      FROM ga4_page_daily
      WHERE metric_date >= CURRENT_DATE - ($1::int - 1)
      GROUP BY page_path
    ), inquiries AS (
      SELECT COALESCE(
          NULLIF(source_path, ''),
          NULLIF(split_part(landing_page, '?', 1), ''),
          NULLIF(source_page, ''),
          'unknown'
        ) AS page_path,
        COUNT(*) FILTER (WHERE status <> 'spam')::int AS inquiries
      FROM crm_leads
      WHERE submitted_at >= NOW() - ($1::int * INTERVAL '1 day')
      GROUP BY 1
    ) SELECT
      COALESCE(traffic.page_path, inquiries.page_path) AS "pagePath",
      COALESCE(traffic.sessions, 0)::int AS sessions,
      COALESCE(traffic.users, 0)::int AS users,
      COALESCE(traffic."pageViews", 0)::int AS "pageViews",
      COALESCE(traffic."keyEvents", 0)::float8 AS "keyEvents",
      COALESCE(inquiries.inquiries, 0)::int AS inquiries
    FROM traffic
    FULL OUTER JOIN inquiries ON inquiries.page_path = traffic.page_path
    ORDER BY "pageViews" DESC, inquiries DESC
    LIMIT $2`,
    [days, limit]
  );
  return rows as unknown as PagePerformanceRow[];
}

export type SearchPerformanceRow = {
  label: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export async function getTopGscQueries(days = 30, limit = 20): Promise<SearchPerformanceRow[]> {
  const sql = getDatabase();
  const rows = await sql.query(
    `SELECT query AS label,
      SUM(clicks)::float8 AS clicks,
      SUM(impressions)::float8 AS impressions,
      (SUM(clicks) / NULLIF(SUM(impressions), 0))::float8 AS ctr,
      (SUM(position * impressions) / NULLIF(SUM(impressions), 0))::float8 AS position
    FROM gsc_query_daily
    WHERE metric_date >= CURRENT_DATE - ($1::int - 1)
    GROUP BY query
    ORDER BY impressions DESC, clicks DESC
    LIMIT $2`,
    [days, limit]
  );
  return rows as unknown as SearchPerformanceRow[];
}

export async function getTopGscPages(days = 30, limit = 20): Promise<SearchPerformanceRow[]> {
  const sql = getDatabase();
  const rows = await sql.query(
    `SELECT page AS label,
      SUM(clicks)::float8 AS clicks,
      SUM(impressions)::float8 AS impressions,
      (SUM(clicks) / NULLIF(SUM(impressions), 0))::float8 AS ctr,
      (SUM(position * impressions) / NULLIF(SUM(impressions), 0))::float8 AS position
    FROM gsc_page_daily
    WHERE metric_date >= CURRENT_DATE - ($1::int - 1)
    GROUP BY page
    ORDER BY impressions DESC, clicks DESC
    LIMIT $2`,
    [days, limit]
  );
  return rows as unknown as SearchPerformanceRow[];
}

export type InquiryFunnel = {
  sessions: number;
  productSessions: number;
  inquiries: number;
  qualified: number;
  quoted: number;
  won: number;
};

export async function getInquiryFunnel(days = 30): Promise<InquiryFunnel> {
  const sql = getDatabase();
  const rows = await sql.query(
    `WITH traffic AS (
      SELECT
        COALESCE((SELECT SUM(sessions) FROM ga4_daily_metrics
          WHERE metric_date >= CURRENT_DATE - ($1::int - 1)), 0)::int AS sessions,
        COALESCE((SELECT SUM(sessions) FROM ga4_page_daily
          WHERE metric_date >= CURRENT_DATE - ($1::int - 1)
            AND page_path LIKE '/products/%'), 0)::int AS "productSessions"
    ), leads AS (
      SELECT
        COUNT(*) FILTER (WHERE status <> 'spam')::int AS inquiries,
        COUNT(*) FILTER (WHERE status IN ('qualified','quoted','sample','negotiating','won'))::int AS qualified,
        COUNT(*) FILTER (WHERE status IN ('quoted','negotiating','won'))::int AS quoted,
        COUNT(*) FILTER (WHERE status = 'won')::int AS won
      FROM crm_leads
      WHERE submitted_at >= NOW() - ($1::int * INTERVAL '1 day')
    ) SELECT * FROM traffic CROSS JOIN leads`,
    [days]
  );
  const result = rows as unknown as InquiryFunnel[];
  return result[0] ?? {
    sessions: 0,
    productSessions: 0,
    inquiries: 0,
    qualified: 0,
    quoted: 0,
    won: 0,
  };
}

export type SyncStatusRow = {
  provider: ReportingProvider;
  status: ReportingSyncStatus;
  trigger: string;
  startDate: string;
  endDate: string;
  rowCount: number;
  error: string | null;
  completedAt: string;
};

export async function getLatestSyncStatuses(): Promise<SyncStatusRow[]> {
  const sql = getDatabase();
  const rows = await sql`SELECT DISTINCT ON (provider)
    provider,
    status,
    trigger,
    window_start::text AS "startDate",
    window_end::text AS "endDate",
    row_count AS "rowCount",
    error,
    completed_at AS "completedAt"
  FROM reporting_sync_runs
  ORDER BY provider, completed_at DESC`;
  return rows as unknown as SyncStatusRow[];
}

export type ReportingDataHealth = {
  ga4FirstDate: string | null;
  ga4LatestDate: string | null;
  ga4ActiveDays: number;
  ga4Sessions: number;
  gscFirstDate: string | null;
  gscLatestDate: string | null;
  gscActiveDays: number;
  gscImpressions: number;
  latestInspectionDate: string | null;
  inspectedUrls: number;
  inquiries: number;
  emailsSent: number;
  emailsPending: number;
  emailsFailed: number;
};

export async function getReportingDataHealth(
  days = 30
): Promise<ReportingDataHealth> {
  const sql = getDatabase();
  const rows = await sql.query(
    `WITH ga4 AS (
      SELECT
        MIN(metric_date)::text AS "ga4FirstDate",
        MAX(metric_date)::text AS "ga4LatestDate",
        COUNT(*)::int AS "ga4ActiveDays",
        COALESCE(SUM(sessions), 0)::int AS "ga4Sessions"
      FROM ga4_daily_metrics
      WHERE metric_date >= CURRENT_DATE - ($1::int - 1)
    ), gsc AS (
      SELECT
        MIN(metric_date)::text AS "gscFirstDate",
        MAX(metric_date)::text AS "gscLatestDate",
        COUNT(*)::int AS "gscActiveDays",
        COALESCE(SUM(impressions), 0)::float8 AS "gscImpressions"
      FROM gsc_daily_metrics
      WHERE metric_date >= CURRENT_DATE - ($1::int - 1)
    ), inspections AS (
      SELECT
        MAX(snapshot_date)::text AS "latestInspectionDate",
        COUNT(*) FILTER (
          WHERE snapshot_date = (SELECT MAX(snapshot_date) FROM gsc_url_inspection_snapshots)
        )::int AS "inspectedUrls"
      FROM gsc_url_inspection_snapshots
    ), inquiries AS (
      SELECT
        COUNT(*) FILTER (WHERE status <> 'spam')::int AS inquiries,
        COUNT(*) FILTER (WHERE status <> 'spam' AND email_delivery_status = 'sent')::int AS "emailsSent",
        COUNT(*) FILTER (WHERE status <> 'spam' AND email_delivery_status = 'pending')::int AS "emailsPending",
        COUNT(*) FILTER (WHERE status <> 'spam' AND email_delivery_status = 'failed')::int AS "emailsFailed"
      FROM crm_leads
      WHERE submitted_at >= NOW() - ($1::int * INTERVAL '1 day')
    )
    SELECT * FROM ga4 CROSS JOIN gsc CROSS JOIN inspections CROSS JOIN inquiries`,
    [days]
  );
  return (rows as unknown as ReportingDataHealth[])[0] ?? {
    ga4FirstDate: null,
    ga4LatestDate: null,
    ga4ActiveDays: 0,
    ga4Sessions: 0,
    gscFirstDate: null,
    gscLatestDate: null,
    gscActiveDays: 0,
    gscImpressions: 0,
    latestInspectionDate: null,
    inspectedUrls: 0,
    inquiries: 0,
    emailsSent: 0,
    emailsPending: 0,
    emailsFailed: 0,
  };
}

export type SiteSnapshotRow = {
  snapshotDate: string;
  publicPageCount: number;
  updatedPageCount: number;
  sitemapSubmitted: number | null;
  sitemapIndexed: number | null;
  sitemapErrors: number | null;
  sitemapWarnings: number | null;
};

export async function getLatestSiteSnapshot(): Promise<SiteSnapshotRow | null> {
  const sql = getDatabase();
  const rows = await sql`SELECT
    site.snapshot_date::text AS "snapshotDate",
    site.public_page_count AS "publicPageCount",
    site.updated_page_count AS "updatedPageCount",
    gsc.sitemap_submitted AS "sitemapSubmitted",
    gsc.sitemap_indexed AS "sitemapIndexed",
    gsc.sitemap_errors AS "sitemapErrors",
    gsc.sitemap_warnings AS "sitemapWarnings"
  FROM site_daily_snapshots site
  LEFT JOIN gsc_site_snapshots gsc ON gsc.snapshot_date = site.snapshot_date
  ORDER BY site.snapshot_date DESC
  LIMIT 1`;
  const result = rows as unknown as SiteSnapshotRow[];
  return result[0] ?? null;
}

export type GeoLandingPerformanceRow = {
  provider: string;
  landingPage: string;
  sessions: number;
  users: number;
  keyEvents: number;
  inquiries: number;
};

export async function getGeoLandingPerformance(days = 30): Promise<GeoLandingPerformanceRow[]> {
  const sql = getDatabase();
  const rows = await sql.query(
    `WITH traffic AS (
      SELECT
        CASE
          WHEN LOWER(source) ~ '(chatgpt|openai)' THEN 'chatgpt'
          WHEN LOWER(source) ~ 'perplexity' THEN 'perplexity'
          WHEN LOWER(source) ~ '(claude|anthropic)' THEN 'claude'
          WHEN LOWER(source) ~ 'copilot' THEN 'copilot'
          WHEN LOWER(source) ~ 'gemini' THEN 'gemini'
          WHEN LOWER(source) ~ 'grok' THEN 'grok'
          ELSE 'other-ai'
        END AS provider,
        COALESCE(NULLIF(split_part(landing_page, '?', 1), ''), '/') AS landing_page,
        SUM(sessions)::int AS sessions,
        SUM(total_users)::int AS users,
        SUM(key_events)::float8 AS "keyEvents"
      FROM ga4_landing_source_daily
      WHERE metric_date >= CURRENT_DATE - ($1::int - 1)
        AND LOWER(source || ' ' || medium || ' ' || channel_group) ~
          '(chatgpt|openai|perplexity|claude|anthropic|gemini|copilot|grok|ai.assistant)'
      GROUP BY 1, 2
    ), inquiries AS (
      SELECT
        CASE
          WHEN LOWER(geo_source) ~ '(chatgpt|openai)' THEN 'chatgpt'
          WHEN LOWER(geo_source) ~ 'perplexity' THEN 'perplexity'
          WHEN LOWER(geo_source) ~ '(claude|anthropic)' THEN 'claude'
          WHEN LOWER(geo_source) ~ 'copilot' THEN 'copilot'
          WHEN LOWER(geo_source) ~ 'gemini' THEN 'gemini'
          WHEN LOWER(geo_source) ~ 'grok' THEN 'grok'
          ELSE 'other-ai'
        END AS provider,
        COALESCE(NULLIF(split_part(geo_landing_path, '?', 1), ''), '/') AS landing_page,
        COUNT(*) FILTER (WHERE status <> 'spam')::int AS inquiries
      FROM crm_leads
      WHERE submitted_at >= NOW() - ($1::int * INTERVAL '1 day')
        AND geo_source IS NOT NULL
      GROUP BY 1, 2
    ) SELECT
      COALESCE(traffic.provider, inquiries.provider) AS provider,
      COALESCE(traffic.landing_page, inquiries.landing_page) AS "landingPage",
      COALESCE(traffic.sessions, 0)::int AS sessions,
      COALESCE(traffic.users, 0)::int AS users,
      COALESCE(traffic."keyEvents", 0)::float8 AS "keyEvents",
      COALESCE(inquiries.inquiries, 0)::int AS inquiries
    FROM traffic
    FULL OUTER JOIN inquiries
      ON inquiries.provider = traffic.provider AND inquiries.landing_page = traffic.landing_page
    ORDER BY sessions DESC, inquiries DESC, "landingPage"`,
    [days]
  );
  return rows as unknown as GeoLandingPerformanceRow[];
}

export type GscInspectionStatusRow = {
  snapshotDate: string;
  inspectedUrl: string;
  verdict: string;
  coverageState: string;
  robotsTxtState: string;
  indexingState: string;
  lastCrawlTime: string | null;
  pageFetchState: string;
  googleCanonical: string | null;
  userCanonical: string | null;
};

export async function getLatestGscInspectionStatus(): Promise<GscInspectionStatusRow[]> {
  const sql = getDatabase();
  const rows = await sql`SELECT
    snapshot_date::text AS "snapshotDate",
    inspected_url AS "inspectedUrl",
    verdict,
    coverage_state AS "coverageState",
    robots_txt_state AS "robotsTxtState",
    indexing_state AS "indexingState",
    last_crawl_time AS "lastCrawlTime",
    page_fetch_state AS "pageFetchState",
    google_canonical AS "googleCanonical",
    user_canonical AS "userCanonical"
  FROM gsc_url_inspection_snapshots
  WHERE snapshot_date = (SELECT MAX(snapshot_date) FROM gsc_url_inspection_snapshots)
  ORDER BY
    CASE verdict WHEN 'PASS' THEN 1 WHEN 'NEUTRAL' THEN 2 ELSE 3 END,
    inspected_url`;
  return rows as unknown as GscInspectionStatusRow[];
}

export type IndexNowStatusRow = {
  submittedAt: string;
  trigger: string;
  urlCount: number;
  responseStatus: number;
  success: boolean;
};

export async function getLatestIndexNowStatus(): Promise<IndexNowStatusRow | null> {
  const sql = getDatabase();
  const rows = await sql`SELECT
    submitted_at AS "submittedAt",
    trigger,
    url_count AS "urlCount",
    response_status AS "responseStatus",
    success
  FROM geo_indexnow_submissions
  ORDER BY submitted_at DESC
  LIMIT 1`;
  return (rows as unknown as IndexNowStatusRow[])[0] ?? null;
}

export type GeoCitationObservation = {
  id: number;
  observedAt: string;
  provider: string;
  question: string;
  citedUrl: string | null;
  citedPagePath: string | null;
  resultStatus: string;
  answerNote: string | null;
  createdBy: string;
};

export async function createGeoCitationObservation(params: {
  provider: string;
  question: string;
  citedUrl?: string;
  citedPagePath?: string;
  resultStatus: string;
  answerNote?: string;
  createdBy: string;
}): Promise<void> {
  const sql = getDatabase();
  await sql.transaction([
    sql`INSERT INTO geo_citation_observations (
      provider, question, cited_url, cited_page_path, result_status, answer_note, created_by
    ) VALUES (
      ${params.provider}, ${params.question}, ${params.citedUrl || null},
      ${params.citedPagePath || null}, ${params.resultStatus},
      ${params.answerNote || null}, ${params.createdBy}
    )`,
    sql`INSERT INTO admin_audit_logs (
      action, entity_type, actor, metadata
    ) VALUES (
      'geo_citation_observation_created', 'geo_citation', ${params.createdBy},
      ${JSON.stringify({ provider: params.provider, resultStatus: params.resultStatus })}::jsonb
    )`,
  ]);
}

export async function getGeoCitationObservations(limit = 20): Promise<GeoCitationObservation[]> {
  const sql = getDatabase();
  const rows = await sql.query(
    `SELECT
      id,
      observed_at AS "observedAt",
      provider,
      question,
      cited_url AS "citedUrl",
      cited_page_path AS "citedPagePath",
      result_status AS "resultStatus",
      answer_note AS "answerNote",
      created_by AS "createdBy"
    FROM geo_citation_observations
    ORDER BY observed_at DESC
    LIMIT $1`,
    [limit]
  );
  return rows as unknown as GeoCitationObservation[];
}

export type GeoCitationSummary = {
  total: number;
  cited: number;
  notCited: number;
  incorrect: number;
};

export async function getGeoCitationSummary(days = 30): Promise<GeoCitationSummary> {
  const sql = getDatabase();
  const rows = await sql.query(
    `SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE result_status = 'cited')::int AS cited,
      COUNT(*) FILTER (WHERE result_status = 'not_cited')::int AS "notCited",
      COUNT(*) FILTER (WHERE result_status = 'incorrect')::int AS incorrect
    FROM geo_citation_observations
    WHERE observed_at >= NOW() - ($1::int * INTERVAL '1 day')`,
    [days]
  );
  return (rows as unknown as GeoCitationSummary[])[0] ?? {
    total: 0,
    cited: 0,
    notCited: 0,
    incorrect: 0,
  };
}

export type GeoContentReview = {
  pagePath: string;
  contentVersion: string;
  evidenceSource: string;
  reviewStatus: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  notes: string | null;
};

export async function getGeoContentReviews(): Promise<GeoContentReview[]> {
  const sql = getDatabase();
  const rows = await sql`SELECT
    page_path AS "pagePath",
    content_version AS "contentVersion",
    evidence_source AS "evidenceSource",
    review_status AS "reviewStatus",
    reviewed_by AS "reviewedBy",
    reviewed_at AS "reviewedAt",
    notes
  FROM geo_content_reviews
  ORDER BY
    CASE review_status WHEN 'needs_update' THEN 1 WHEN 'source_linked' THEN 2 ELSE 3 END,
    page_path`;
  return rows as unknown as GeoContentReview[];
}

export async function updateGeoContentReview(params: {
  pagePath: string;
  reviewStatus: string;
  notes?: string;
  reviewedBy: string;
}): Promise<void> {
  const sql = getDatabase();
  await sql.transaction([
    sql`UPDATE geo_content_reviews SET
      review_status = ${params.reviewStatus},
      notes = ${params.notes || null},
      reviewed_by = ${params.reviewedBy},
      reviewed_at = NOW(),
      updated_at = NOW()
    WHERE page_path = ${params.pagePath}`,
    sql`INSERT INTO admin_audit_logs (
      action, entity_type, entity_id, actor, metadata
    ) VALUES (
      'geo_content_review_updated', 'geo_content', ${params.pagePath},
      ${params.reviewedBy}, ${JSON.stringify({ reviewStatus: params.reviewStatus })}::jsonb
    )`,
  ]);
}
