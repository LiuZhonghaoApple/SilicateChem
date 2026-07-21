import { createSign } from "node:crypto";
import type { GoogleServiceAccount } from "@/lib/reporting/config";

const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const REPORTING_SCOPES = [
  "https://www.googleapis.com/auth/analytics.readonly",
  "https://www.googleapis.com/auth/webmasters.readonly",
];

let cachedToken: { accessToken: string; expiresAt: number } | null = null;

function base64UrlJson(value: unknown): string {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

export async function getGoogleAccessToken(
  credentials: GoogleServiceAccount
): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.accessToken;
  }

  const now = Math.floor(Date.now() / 1_000);
  const header = base64UrlJson({ alg: "RS256", typ: "JWT" });
  const claim = base64UrlJson({
    iss: credentials.clientEmail,
    scope: REPORTING_SCOPES.join(" "),
    aud: TOKEN_ENDPOINT,
    iat: now,
    exp: now + 3_600,
  });
  const unsigned = `${header}.${claim}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(credentials.privateKey).toString("base64url");

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${signature}`,
    }),
    cache: "no-store",
  });

  const data = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
    error_description?: string;
    error?: string;
  };
  if (!response.ok || !data.access_token) {
    throw new Error(
      `Google OAuth failed (${response.status}): ${data.error_description ?? data.error ?? "unknown error"}`
    );
  }

  cachedToken = {
    accessToken: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3_600) * 1_000,
  };
  return cachedToken.accessToken;
}

