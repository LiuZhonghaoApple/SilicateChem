/**
 * Visitor country resolution.
 *
 * Path (in priority order):
 *   1. `x-vercel-ip-country` — set by Vercel's edge from the visitor's real IP.
 *      Free, zero latency, no third-party lookup, no data leaves the platform.
 *   2. `cf-ipcountry` — fallback if a Cloudflare layer is ever put in front.
 *   3. Otherwise null (unknown).
 *
 * Rules:
 *   - Must be ISO 3166-1 alpha-2 (two letters); anything else is discarded.
 *   - Vercel returns "XX" when it cannot resolve, and "T1" for Tor exit nodes;
 *     both are treated as unknown rather than stored as a bogus country.
 *   - Country is NEVER inferred from Accept-Language or timezone — a zh-CN
 *     browser does not mean the buyer is in China. Unknown stays unknown.
 *   - Only the country is captured; no city or precise location, matching the
 *     existing posture of storing an IP hash rather than the IP itself.
 */

const UNRESOLVED = new Set(["XX", "T1", "ZZ"]);

export function resolveVisitorCountry(request: Request): string | null {
  const candidate =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry");

  if (!candidate) return null;
  const code = candidate.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return null;
  if (UNRESOLVED.has(code)) return null;
  return code;
}

/** "SG" → "🇸🇬". Returns "" for anything that is not a 2-letter code. */
export function countryFlag(code: string | null): string {
  if (!code || !/^[A-Z]{2}$/.test(code)) return "";
  return String.fromCodePoint(
    ...[...code].map((char) => 0x1f1e6 + char.charCodeAt(0) - 65)
  );
}

/** "SG" → "新加坡". Falls back to the raw code if the runtime lacks the data. */
export function countryName(code: string | null): string {
  if (!code) return "未知";
  try {
    return new Intl.DisplayNames(["zh-CN"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

/** "SG" → "🇸🇬 新加坡"; null → "未知". */
export function formatCountry(code: string | null): string {
  if (!code) return "未知";
  const flag = countryFlag(code);
  return flag ? `${flag} ${countryName(code)}` : countryName(code);
}
