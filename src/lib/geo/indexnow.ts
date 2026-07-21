import { createHash } from "node:crypto";
import sitemap from "@/app/sitemap";
import { SITE } from "@/lib/constants";
import { getDatabase } from "@/lib/db";

export const INDEXNOW_KEY = "9ec7ecbcd858b5a64ce747eebd95fb36";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

type IndexNowResult = {
  skipped: boolean;
  urlCount: number;
  status: number;
  fingerprint: string;
};

function timestamp(value: Date | string | undefined): number {
  if (!value) return 0;
  return new Date(value).getTime();
}

type ChangedUrl = { url: string; lastModified: string };

function getLatestChangedUrls(): ChangedUrl[] {
  const entries = sitemap();
  const latestTimestamp = Math.max(...entries.map((entry) => timestamp(entry.lastModified)));

  return entries
    .filter((entry) => timestamp(entry.lastModified) === latestTimestamp)
    .map((entry) => ({
      url: entry.url,
      lastModified: new Date(entry.lastModified ?? 0).toISOString(),
    }))
    .sort((a, b) => a.url.localeCompare(b.url));
}

function fingerprintUrls(entries: ChangedUrl[]): string {
  return createHash("sha256").update(JSON.stringify(entries)).digest("hex");
}

async function recordSubmission(params: {
  trigger: string;
  fingerprint: string;
  urls: string[];
  responseStatus: number;
  responseBody: string;
  success: boolean;
}): Promise<void> {
  const sql = getDatabase();
  await sql`INSERT INTO geo_indexnow_submissions (
    trigger, content_fingerprint, url_count, urls,
    response_status, response_body, success
  ) VALUES (
    ${params.trigger}, ${params.fingerprint}, ${params.urls.length},
    ${JSON.stringify(params.urls)}::jsonb, ${params.responseStatus},
    ${params.responseBody.slice(0, 2_000)}, ${params.success}
  )`;
}

export async function submitLatestUrlsToIndexNow(trigger: string): Promise<IndexNowResult> {
  const changedEntries = getLatestChangedUrls();
  const urls = changedEntries.map((entry) => entry.url);
  const fingerprint = fingerprintUrls(changedEntries);
  const sql = getDatabase();
  const existing = await sql`SELECT id
    FROM geo_indexnow_submissions
    WHERE content_fingerprint = ${fingerprint}
      AND success = TRUE
    LIMIT 1`;
  const existingRows = existing as unknown as Array<{ id: number }>;

  if (existingRows.length > 0) {
    return { skipped: true, urlCount: urls.length, status: 200, fingerprint };
  }

  const host = new URL(SITE.url).hostname;
  let responseStatus = 0;
  let responseBody = "";

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE.url}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
      cache: "no-store",
    });

    responseStatus = response.status;
    responseBody = await response.text();
    const success = response.ok || response.status === 202;

    await recordSubmission({
      trigger,
      fingerprint,
      urls,
      responseStatus,
      responseBody,
      success,
    });

    if (!success) {
      throw new Error(`IndexNow returned HTTP ${response.status}`);
    }

    return {
      skipped: false,
      urlCount: urls.length,
      status: response.status,
      fingerprint,
    };
  } catch (error) {
    if (responseStatus === 0) {
      responseBody = error instanceof Error ? error.message : "IndexNow request failed";
      await recordSubmission({
        trigger,
        fingerprint,
        urls,
        responseStatus,
        responseBody,
        success: false,
      });
    }
    throw error;
  }
}
