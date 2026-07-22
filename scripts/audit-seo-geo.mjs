const baseUrl = new URL(process.argv[2] ?? "https://www.silicatechem.com");
const summaryOnly = process.argv.includes("--summary");
const expectedAiAgents = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  "PerplexityBot",
  "Perplexity-User",
  "Googlebot",
  "Google-Extended",
  "Bingbot",
  "CCBot",
];

function decodeEntities(value = "") {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function attributes(tag) {
  const result = {};
  const pattern = /([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  for (const match of tag.matchAll(pattern)) {
    result[match[1].toLowerCase()] = decodeEntities(
      match[2] ?? match[3] ?? match[4] ?? ""
    );
  }
  return result;
}

function tags(html, tagName) {
  return html.match(new RegExp(`<${tagName}\\b[^>]*>`, "gi")) ?? [];
}

function textContent(value = "") {
  return decodeEntities(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function normalizePath(value) {
  const path = value || "/";
  return path === "/" ? "/" : path.replace(/\/+$/, "");
}

function collectSchemaTypes(value, output = new Set()) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectSchemaTypes(item, output));
    return output;
  }
  if (!value || typeof value !== "object") return output;
  const type = value["@type"];
  if (Array.isArray(type)) type.forEach((item) => output.add(String(item)));
  else if (type) output.add(String(type));
  Object.values(value).forEach((item) => collectSchemaTypes(item, output));
  return output;
}

function expectedSchema(path) {
  if (path.startsWith("/products/")) return ["Product"];
  if (path.startsWith("/blog/")) return ["Article", "BlogPosting"];
  if (path.startsWith("/guides/")) return ["Article", "HowTo"];
  if (path === "/faq") return ["FAQPage"];
  return [];
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "SilicateChem-SEO-GEO-Audit/1.0" },
    redirect: "follow",
  });
  return {
    body: await response.text(),
    finalUrl: response.url,
    status: response.status,
  };
}

async function auditPage(entry, sitemapPaths) {
  const requestedUrl = new URL(entry.loc);
  const requestedPath = normalizePath(requestedUrl.pathname);
  const fetchUrl = new URL(`${requestedUrl.pathname}${requestedUrl.search}`, baseUrl);
  const { body: html, finalUrl, status } = await fetchText(fetchUrl);
  const errors = [];
  const warnings = [];

  const title = textContent(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]);
  const metaTags = tags(html, "meta").map(attributes);
  const linkTags = tags(html, "link").map(attributes);
  const htmlTag = attributes(tags(html, "html")[0] ?? "");
  const description = metaTags.find((tag) => tag.name?.toLowerCase() === "description")?.content ?? "";
  const robots = metaTags.find((tag) => tag.name?.toLowerCase() === "robots")?.content?.toLowerCase() ?? "";
  const canonical = linkTags.find((tag) => tag.rel?.toLowerCase().split(/\s+/).includes("canonical"))?.href ?? "";
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  const schemaTypes = new Set();
  let invalidJsonLd = 0;
  const jsonLdPattern = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const match of html.matchAll(jsonLdPattern)) {
    try {
      collectSchemaTypes(JSON.parse(match[1].trim()), schemaTypes);
    } catch {
      invalidJsonLd += 1;
    }
  }

  const internalLinks = new Set();
  for (const anchor of tags(html, "a").map(attributes)) {
    if (!anchor.href || anchor.href.startsWith("#")) continue;
    try {
      const target = new URL(anchor.href, fetchUrl);
      if (target.origin !== baseUrl.origin) continue;
      const path = normalizePath(target.pathname);
      if (sitemapPaths.has(path)) internalLinks.add(path);
    } catch {
      warnings.push(`Invalid internal href: ${anchor.href.slice(0, 120)}`);
    }
  }

  if (status !== 200) errors.push(`HTTP ${status}`);
  if (new URL(finalUrl).origin !== fetchUrl.origin || normalizePath(new URL(finalUrl).pathname) !== requestedPath) {
    errors.push(`Redirected to ${finalUrl}`);
  }
  if (!title) errors.push("Missing title");
  if (!description) errors.push("Missing meta description");
  if (!canonical) errors.push("Missing canonical");
  else if (canonical !== entry.loc) errors.push(`Canonical mismatch: ${canonical}`);
  if (robots.includes("noindex") || robots.includes("nofollow")) errors.push(`Blocking robots meta: ${robots}`);
  if (h1Count !== 1) errors.push(`Expected 1 H1, found ${h1Count}`);
  if (!htmlTag.lang) errors.push("Missing html lang");
  if (invalidJsonLd > 0) errors.push(`${invalidJsonLd} invalid JSON-LD block(s)`);
  if (schemaTypes.size === 0) errors.push("Missing JSON-LD");
  const expectedTypes = expectedSchema(requestedPath);
  if (expectedTypes.length > 0 && !expectedTypes.some((type) => schemaTypes.has(type))) {
    errors.push(`Missing expected schema: ${expectedTypes.join(" or ")}`);
  }
  if (requestedPath !== "/" && !schemaTypes.has("BreadcrumbList")) {
    warnings.push("Missing BreadcrumbList schema");
  }
  if (title.length > 70) warnings.push(`Long title (${title.length})`);
  if (description && (description.length < 70 || description.length > 180)) {
    warnings.push(`Meta description length ${description.length}`);
  }

  return {
    path: requestedPath,
    url: entry.loc,
    lastmod: entry.lastmod,
    status,
    title,
    titleLength: title.length,
    descriptionLength: description.length,
    canonical,
    h1Count,
    schemaTypes: [...schemaTypes].sort(),
    internalLinks: [...internalLinks].sort(),
    errors,
    warnings,
  };
}

const sitemapUrl = new URL("/sitemap.xml", baseUrl);
const robotsUrl = new URL("/robots.txt", baseUrl);
const [{ body: sitemapXml, status: sitemapStatus }, { body: robotsText, status: robotsStatus }] =
  await Promise.all([fetchText(sitemapUrl), fetchText(robotsUrl)]);

if (sitemapStatus !== 200) throw new Error(`Sitemap returned HTTP ${sitemapStatus}`);
if (robotsStatus !== 200) throw new Error(`robots.txt returned HTTP ${robotsStatus}`);

const entries = [...sitemapXml.matchAll(/<url>\s*<loc>(.*?)<\/loc>[\s\S]*?<lastmod>(.*?)<\/lastmod>[\s\S]*?<\/url>/gi)].map(
  (match) => ({ loc: decodeEntities(match[1].trim()), lastmod: match[2].trim() })
);
const sitemapPaths = new Set(entries.map((entry) => normalizePath(new URL(entry.loc).pathname)));
const results = [];
const batchSize = 6;
for (let index = 0; index < entries.length; index += batchSize) {
  results.push(
    ...(await Promise.all(
      entries.slice(index, index + batchSize).map((entry) => auditPage(entry, sitemapPaths))
    ))
  );
}

const inbound = new Map([...sitemapPaths].map((path) => [path, 0]));
const graph = new Map();
for (const result of results) {
  graph.set(result.path, result.internalLinks);
  for (const link of result.internalLinks) {
    if (link !== result.path) inbound.set(link, (inbound.get(link) ?? 0) + 1);
  }
}
const depths = new Map([["/", 0]]);
const queue = ["/"];
while (queue.length > 0) {
  const current = queue.shift();
  const nextDepth = (depths.get(current) ?? 0) + 1;
  for (const target of graph.get(current) ?? []) {
    if (!depths.has(target)) {
      depths.set(target, nextDepth);
      queue.push(target);
    }
  }
}

for (const result of results) {
  result.inboundLinks = inbound.get(result.path) ?? 0;
  result.depth = depths.get(result.path) ?? null;
  if (result.path !== "/" && result.inboundLinks === 0) result.errors.push("Orphan page");
  if (result.depth == null) result.errors.push("Unreachable from homepage");
  else if (result.depth > 3) result.warnings.push(`Click depth ${result.depth}`);
}

const duplicateUrls = entries.length - new Set(entries.map((entry) => entry.loc)).size;
const missingLastmod = entries.filter((entry) => !/^\d{4}-\d{2}-\d{2}/.test(entry.lastmod)).length;
const missingAiAgents = expectedAiAgents.filter(
  (agent) => !new RegExp(`User-agent:\\s*${agent.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i").test(robotsText)
);
const declaredSitemapUrl = entries[0]
  ? new URL("/sitemap.xml", entries[0].loc).toString()
  : sitemapUrl.toString();
const robotsHasSitemap = robotsText.includes(declaredSitemapUrl);
const errorCount = results.reduce((sum, result) => sum + result.errors.length, 0);
const warningCount = results.reduce((sum, result) => sum + result.warnings.length, 0);

const report = {
  auditedAt: new Date().toISOString(),
  baseUrl: baseUrl.origin,
  sitemapUrl: sitemapUrl.toString(),
  summary: {
        urlCount: results.length,
        http200: results.filter((result) => result.status === 200).length,
        canonicalPass: results.filter((result) => result.canonical === result.url).length,
        singleH1: results.filter((result) => result.h1Count === 1).length,
        jsonLdPass: results.filter((result) => result.schemaTypes.length > 0 && !result.errors.some((error) => error.includes("JSON-LD"))).length,
        orphanPages: results.filter((result) => result.errors.includes("Orphan page")).length,
        maxDepth: Math.max(...results.map((result) => result.depth ?? 99)),
        duplicateUrls,
        missingLastmod,
        aiCrawlerPolicies: expectedAiAgents.length - missingAiAgents.length,
        missingAiAgents,
        robotsHasSitemap,
        errors: errorCount,
    warnings: warningCount,
  },
  pages: results,
};

console.log(
  JSON.stringify(
    summaryOnly
      ? {
          ...report.summary,
          warningPages: report.pages
            .filter((page) => page.warnings.length > 0)
            .map((page) => ({
              path: page.path,
              titleLength: page.titleLength,
              descriptionLength: page.descriptionLength,
              warnings: page.warnings,
            })),
        }
      : report,
    null,
    2
  )
);
