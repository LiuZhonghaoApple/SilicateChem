export const AI_CRAWLER_PROTECTED_PATHS = [
  "/api/",
  "/admin/",
  "/v5-debug",
  "/v6-debug",
] as const;

export type AiCrawlerPolicyEntry = {
  userAgent: string;
  access: "allow" | "block";
  category: "search" | "user_fetch" | "training" | "search_and_training" | "open_corpus";
  provider: string;
  purpose: string;
  note?: string;
};

/**
 * GEO policy: maximize discoverability and user-requested citations while
 * blocking training-only and open-corpus collection where vendors expose a
 * separate control. Google-Extended cannot separate Gemini grounding from
 * training, so it remains allowed for GEO visibility.
 */
export const AI_CRAWLER_POLICY: readonly AiCrawlerPolicyEntry[] = [
  {
    userAgent: "OAI-SearchBot",
    access: "allow",
    category: "search",
    provider: "OpenAI",
    purpose: "ChatGPT search discovery and citation",
  },
  {
    userAgent: "ChatGPT-User",
    access: "allow",
    category: "user_fetch",
    provider: "OpenAI",
    purpose: "User-requested ChatGPT page retrieval",
  },
  {
    userAgent: "GPTBot",
    access: "block",
    category: "training",
    provider: "OpenAI",
    purpose: "Potential model training collection",
  },
  {
    userAgent: "Claude-SearchBot",
    access: "allow",
    category: "search",
    provider: "Anthropic",
    purpose: "Claude search discovery and citation",
  },
  {
    userAgent: "Claude-User",
    access: "allow",
    category: "user_fetch",
    provider: "Anthropic",
    purpose: "User-requested Claude page retrieval",
  },
  {
    userAgent: "ClaudeBot",
    access: "block",
    category: "training",
    provider: "Anthropic",
    purpose: "Potential model training collection",
  },
  {
    userAgent: "PerplexityBot",
    access: "allow",
    category: "search",
    provider: "Perplexity",
    purpose: "Perplexity search discovery and citation",
  },
  {
    userAgent: "Perplexity-User",
    access: "allow",
    category: "user_fetch",
    provider: "Perplexity",
    purpose: "User-requested Perplexity page retrieval",
  },
  {
    userAgent: "Googlebot",
    access: "allow",
    category: "search",
    provider: "Google",
    purpose: "Google Search indexing",
  },
  {
    userAgent: "Google-Extended",
    access: "allow",
    category: "search_and_training",
    provider: "Google",
    purpose: "Gemini grounding and model improvement",
    note: "Google currently combines grounding and training control under this token.",
  },
  {
    userAgent: "Bingbot",
    access: "allow",
    category: "search",
    provider: "Microsoft",
    purpose: "Bing and Copilot search indexing",
  },
  {
    userAgent: "CCBot",
    access: "block",
    category: "open_corpus",
    provider: "Common Crawl",
    purpose: "Open web corpus collection",
  },
] as const;

