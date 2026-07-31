// Generates src/lib/content-freshness.data.json: a map of
// repo-relative source file -> the ISO timestamp of the most recent git commit
// that touched it. content-freshness.ts turns this into per-page "last updated"
// dates for the sitemap and the /admin/analytics freshness card, so nobody has
// to hand-maintain those dates anymore.
//
// Runs at build time (see the "build" script in package.json). Git history is
// available during the build but not at runtime, which is why we snapshot it
// here and commit/ship the resulting JSON.

import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT = join(repoRoot, "src/lib/content-freshness.data.json");

// Only the directories that hold buyer-visible page source and content data.
const TRACKED_DIRS = ["src/app", "src/content"];

const ISO_LINE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

function buildMap() {
  const map = {};
  let raw;
  try {
    // Newest commit first; each commit prints its author-ISO date, then the
    // files it touched. The first date we see for a file is its latest change.
    raw = execFileSync(
      "git",
      ["log", "--format=%cI", "--name-only", "--", ...TRACKED_DIRS],
      { cwd: repoRoot, encoding: "utf8", maxBuffer: 256 * 1024 * 1024 }
    );
  } catch (error) {
    console.warn(
      `[content-freshness] git history unavailable, writing empty map; ` +
        `content-freshness.ts will fall back to the baseline date. (${error.message})`
    );
    return map;
  }

  let currentDate = null;
  for (const line of raw.split("\n")) {
    if (!line) continue;
    if (ISO_LINE.test(line)) {
      currentDate = line.trim();
    } else if (currentDate && !(line in map)) {
      map[line] = currentDate;
    }
  }
  return map;
}

const map = buildMap();
writeFileSync(OUTPUT, JSON.stringify(map, null, 0) + "\n");
console.log(
  `[content-freshness] wrote ${Object.keys(map).length} file dates to ` +
    `src/lib/content-freshness.data.json`
);
