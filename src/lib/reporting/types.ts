export type ReportingProvider = "site" | "ga4" | "gsc";
export type ReportingSyncStatus = "success" | "failed" | "not_configured";

export type Ga4DailyRow = {
  date: string;
  sessions: number;
  totalUsers: number;
  newUsers: number;
  engagedSessions: number;
  screenPageViews: number;
  engagementRate: number;
  keyEvents: number;
};

export type Ga4SourceRow = {
  date: string;
  source: string;
  medium: string;
  channelGroup: string;
  sessions: number;
  totalUsers: number;
  keyEvents: number;
};

export type Ga4PageRow = {
  date: string;
  pagePath: string;
  sessions: number;
  totalUsers: number;
  screenPageViews: number;
  keyEvents: number;
};

export type Ga4LandingSourceRow = {
  date: string;
  source: string;
  medium: string;
  channelGroup: string;
  landingPage: string;
  sessions: number;
  totalUsers: number;
  keyEvents: number;
};

export type GscDailyRow = {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type GscQueryRow = GscDailyRow & { query: string };
export type GscPageRow = GscDailyRow & { page: string };

export type GscSitemapSnapshot = {
  submitted: number;
  indexed: number;
  errors: number;
  warnings: number;
};

export type GscUrlInspectionRow = {
  inspectedUrl: string;
  verdict: string;
  coverageState: string;
  robotsTxtState: string;
  indexingState: string;
  lastCrawlTime: string | null;
  pageFetchState: string;
  googleCanonical: string | null;
  userCanonical: string | null;
  crawledAs: string;
};

export type ProviderSyncResult = {
  provider: ReportingProvider;
  status: ReportingSyncStatus;
  rowCount: number;
  startDate: string;
  endDate: string;
  error?: string;
};
