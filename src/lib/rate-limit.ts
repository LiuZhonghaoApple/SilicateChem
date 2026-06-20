import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type RateLimitEnv = {
  url: string | undefined;
  token: string | undefined;
};

function getRateLimitEnv(): RateLimitEnv {
  return {
    url:
      process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL,
    token:
      process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN,
  };
}

function isRedisConfigured(): boolean {
  const { url, token } = getRateLimitEnv();
  return Boolean(url && token);
}

function createRedis(): Redis | null {
  const { url, token } = getRateLimitEnv();
  if (!url || !token) {
    return null;
  }

  return new Redis({ url, token });
}

let inquiryRatelimit: Ratelimit | null = null;

function getInquiryRatelimit(): Ratelimit | null {
  const redis = createRedis();
  if (!redis) {
    return null;
  }

  if (!inquiryRatelimit) {
    inquiryRatelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      prefix: "silicatechem:inquiry",
      analytics: true,
    });
  }

  return inquiryRatelimit;
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
}

export type InquiryRateLimitResult =
  | { allowed: true }
  | { allowed: false; status: 429; error: "Too many requests. Please try again later." };

/**
 * Inquiry form rate limit: 5 submissions per IP per hour.
 *
 * - Without Redis env: skips rate limiting (fail open).
 * - When Redis is configured: enforces the limit and returns 429 when exceeded.
 */
export async function checkInquiryRateLimit(
  ip: string
): Promise<InquiryRateLimitResult> {
  if (!isRedisConfigured()) {
    console.warn(
      "[RATE_LIMIT] UPSTASH_REDIS_REST_URL/TOKEN not configured — skipping inquiry rate limit"
    );
    return { allowed: true };
  }

  const ratelimit = getInquiryRatelimit();
  if (!ratelimit) {
    console.warn(
      "[RATE_LIMIT] Redis client unavailable — skipping inquiry rate limit"
    );
    return { allowed: true };
  }

  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return {
      allowed: false,
      status: 429,
      error: "Too many requests. Please try again later.",
    };
  }

  return { allowed: true };
}
