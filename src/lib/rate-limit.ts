import { createHmac } from "node:crypto";
import { getDatabase, isDatabaseConfigured } from "@/lib/db";

type PersistentRateLimitOptions = {
  namespace: string;
  identifier: string;
  limit: number;
  windowSeconds: number;
};

export type PersistentRateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  persistent: boolean;
};

type MemoryBucket = {
  count: number;
  bucketStart: number;
};

const globalForRateLimit = globalThis as typeof globalThis & {
  silicateChemRateLimitFallback?: Map<string, MemoryBucket>;
};

const fallbackBuckets =
  globalForRateLimit.silicateChemRateLimitFallback ??
  new Map<string, MemoryBucket>();

globalForRateLimit.silicateChemRateLimitFallback = fallbackBuckets;

function rateLimitSecret(): string {
  return (
    process.env.RATE_LIMIT_HASH_SECRET ??
    process.env.ATTRIBUTION_HASH_SECRET ??
    process.env.ADMIN_SESSION_SECRET ??
    "silicatechem-rate-limit-v1"
  );
}

function hashIdentifier(namespace: string, identifier: string): string {
  return createHmac("sha256", rateLimitSecret())
    .update(`${namespace}:${identifier}`)
    .digest("hex");
}

function getBucketStart(now: number, windowSeconds: number): number {
  const windowMs = windowSeconds * 1_000;
  return Math.floor(now / windowMs) * windowMs;
}

function consumeMemoryRateLimit({
  namespace,
  identifier,
  limit,
  windowSeconds,
}: PersistentRateLimitOptions): PersistentRateLimitResult {
  const now = Date.now();
  const bucketStart = getBucketStart(now, windowSeconds);
  const key = `${namespace}:${hashIdentifier(namespace, identifier)}`;
  const current = fallbackBuckets.get(key);
  const count = current?.bucketStart === bucketStart ? current.count + 1 : 1;

  fallbackBuckets.set(key, { count, bucketStart });

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    resetAt: bucketStart + windowSeconds * 1_000,
    persistent: false,
  };
}

export async function consumePersistentRateLimit(
  options: PersistentRateLimitOptions
): Promise<PersistentRateLimitResult> {
  const { namespace, identifier, limit, windowSeconds } = options;
  const now = Date.now();
  const bucketStart = getBucketStart(now, windowSeconds);
  const bucketEnd = bucketStart + windowSeconds * 1_000;
  const identifierHash = hashIdentifier(namespace, identifier);

  if (!isDatabaseConfigured()) {
    console.error(
      `[RATE_LIMIT] DATABASE_URL missing for ${namespace}; using instance-local fallback`
    );
    return consumeMemoryRateLimit(options);
  }

  try {
    const sql = getDatabase();
    const rows = await sql`
      WITH purged AS (
        DELETE FROM security_rate_limits
        WHERE bucket_end < NOW() - INTERVAL '1 day'
      )
      INSERT INTO security_rate_limits (
        namespace,
        identifier_hash,
        bucket_start,
        bucket_end,
        request_count,
        updated_at
      ) VALUES (
        ${namespace},
        ${identifierHash},
        ${new Date(bucketStart).toISOString()},
        ${new Date(bucketEnd).toISOString()},
        1,
        NOW()
      )
      ON CONFLICT (namespace, identifier_hash, bucket_start)
      DO UPDATE SET
        request_count = security_rate_limits.request_count + 1,
        bucket_end = EXCLUDED.bucket_end,
        updated_at = NOW()
      RETURNING request_count
    `;
    const result = rows as unknown as Array<{
      request_count: number | string;
    }>;
    const count = Number(result[0]?.request_count ?? limit + 1);

    return {
      allowed: count <= limit,
      remaining: Math.max(0, limit - count),
      resetAt: bucketEnd,
      persistent: true,
    };
  } catch (error) {
    console.error(
      `[RATE_LIMIT] Persistent limiter failed for ${namespace}; using instance-local fallback`,
      error
    );
    return consumeMemoryRateLimit(options);
  }
}

export async function resetPersistentRateLimit({
  namespace,
  identifier,
}: Pick<PersistentRateLimitOptions, "namespace" | "identifier">): Promise<void> {
  const identifierHash = hashIdentifier(namespace, identifier);
  fallbackBuckets.delete(`${namespace}:${identifierHash}`);

  if (!isDatabaseConfigured()) return;

  try {
    const sql = getDatabase();
    await sql`
      DELETE FROM security_rate_limits
      WHERE namespace = ${namespace}
        AND identifier_hash = ${identifierHash}
    `;
  } catch (error) {
    console.error(`[RATE_LIMIT] Failed to reset ${namespace}`, error);
  }
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
  | {
      allowed: false;
      status: 429;
      error: "Too many requests. Please try again later.";
    };

export async function checkInquiryRateLimit(
  ip: string
): Promise<InquiryRateLimitResult> {
  const result = await consumePersistentRateLimit({
    namespace: "inquiry-ip",
    identifier: ip,
    limit: 5,
    windowSeconds: 60 * 60,
  });

  if (!result.allowed) {
    return {
      allowed: false,
      status: 429,
      error: "Too many requests. Please try again later.",
    };
  }

  return { allowed: true };
}
