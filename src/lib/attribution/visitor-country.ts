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

/**
 * Common ways buyers write a country that the standard English/Chinese display
 * names do not cover. Keys must already be normalized (lowercase, punctuation
 * and whitespace stripped).
 */
const COUNTRY_ALIASES: Record<string, string> = {
  usa: "US", us: "US", america: "US", unitedstates: "US", unitedstatesofamerica: "US",
  uk: "GB", britain: "GB", greatbritain: "GB", england: "GB", unitedkingdom: "GB",
  uae: "AE", 阿联酋: "AE", 迪拜: "AE",
  korea: "KR", southkorea: "KR", 南韩: "KR", 韩国: "KR",
  northkorea: "KP",
  russia: "RU", 俄罗斯: "RU",
  vietnam: "VN", vietnam2: "VN", 越南: "VN",
  taiwan: "TW", 台湾: "TW",
  hongkong: "HK", 香港: "HK",
  macau: "MO", macao: "MO", 澳门: "MO",
  czechrepublic: "CZ", czechia: "CZ",
  holland: "NL", netherlands: "NL", 荷兰: "NL",
  turkey: "TR", türkiye: "TR", turkiye: "TR", 土耳其: "TR",
  ivorycoast: "CI",
  iran: "IR", 伊朗: "IR",
  syria: "SY", 叙利亚: "SY",
  egypt: "EG", 埃及: "EG",
  china: "CN", 中国: "CN", 中国大陆: "CN", prc: "CN",
};

function normalize(text: string): string {
  return text.toLowerCase().replace(/[\s.,'’\-_()]/g, "");
}

/** All valid ISO alpha-2 codes, discovered via Intl rather than hardcoded. */
let nameIndex: Map<string, string> | null = null;

function getNameIndex(): Map<string, string> {
  if (nameIndex) return nameIndex;
  const index = new Map<string, string>();
  let en: Intl.DisplayNames | null = null;
  let zh: Intl.DisplayNames | null = null;
  try {
    en = new Intl.DisplayNames(["en"], { type: "region" });
    zh = new Intl.DisplayNames(["zh-CN"], { type: "region" });
  } catch {
    // Runtime without ICU region data: alias table only.
  }
  for (let a = 65; a <= 90; a++) {
    for (let b = 65; b <= 90; b++) {
      const code = String.fromCharCode(a, b);
      const enName = en?.of(code);
      if (!enName || enName === code) continue; // not a real region
      index.set(normalize(code), code);
      index.set(normalize(enName), code);
      const zhName = zh?.of(code);
      if (zhName && zhName !== code) index.set(normalize(zhName), code);
    }
  }
  for (const [alias, code] of Object.entries(COUNTRY_ALIASES)) {
    index.set(normalize(alias), code);
  }
  nameIndex = index;
  return index;
}

/**
 * Buyer-typed country text → ISO alpha-2, or null when it cannot be resolved
 * confidently. Deliberately strict: unresolved input must NOT be treated as a
 * mismatch, or legitimate buyers get flagged as intermediaries.
 */
export function countryCodeFromText(text: string | null | undefined): string | null {
  if (!text) return null;
  const key = normalize(text);
  if (!key) return null;
  return getNameIndex().get(key) ?? null;
}

/**
 * True only when the buyer-typed country and the edge-detected country both
 * resolve AND disagree. Any uncertainty (missing detection, unparseable text)
 * returns false so the admin never shows an unfounded "mismatch" badge.
 */
export function isCountryMismatch(
  typedCountry: string | null | undefined,
  detectedCode: string | null | undefined
): boolean {
  if (!detectedCode) return false;
  const typedCode = countryCodeFromText(typedCountry);
  if (!typedCode) return false;
  return typedCode !== detectedCode.toUpperCase();
}
