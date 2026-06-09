#!/usr/bin/env node
/**
 * Pre-build script: download and unpack the besu-plugin-api Javadoc JAR so
 * that Docusaurus serves it as static content under /plugin-api/.
 *
 * The Besu version is read from customFields.besuVersion in docusaurus.config.js.
 * The unpacked Javadoc lands in static/plugins/reference/plugin-api/ (gitignored, ephemeral).
 *
 * Artifact URL pattern:
 *   https://hyperledger.jfrog.io/artifactory/besu-maven/
 *   org/hyperledger/besu/besu-plugin-api/{VERSION}/
 *   besu-plugin-api-{VERSION}-javadoc.jar
 *
 * Run:  node scripts/fetch-plugin-api-docs.mjs
 *       node scripts/fetch-plugin-api-docs.mjs --force   (re-download even if present)
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { pipeline } from "stream/promises";
import { createRequire } from "module";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { get } from "https";
import { Extract } from "unzipper";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const STATIC_DIR = join(ROOT, "static", "plugins", "reference", "plugin-api");
const FORCE = process.argv.includes("--force");

// Read besuVersion from docusaurus.config.js customFields
const requireConfig = createRequire(import.meta.url);
const { customFields } = requireConfig(join(ROOT, "docusaurus.config.js"));
const VERSION = customFields?.besuVersion;
if (!VERSION) {
  console.error(
    "fetch-plugin-api-docs: customFields.besuVersion not set in docusaurus.config.js"
  );
  process.exit(1);
}

const MAVEN_BASE =
  "https://hyperledger.jfrog.io/artifactory/besu-maven/org/hyperledger/besu/besu-plugin-api";
const JAR_URL = `${MAVEN_BASE}/${VERSION}/besu-plugin-api-${VERSION}-javadoc.jar`;

// Skip download if already unpacked (unless --force)
const sentinelFile = join(STATIC_DIR, "index.html");
if (!FORCE && existsSync(sentinelFile)) {
  console.log(
    `fetch-plugin-api-docs: Plugin API docs for v${VERSION} already present in static/plugins/reference/plugin-api/, skipping download. Use --force to re-download.`
  );
  process.exit(0);
}

if (existsSync(STATIC_DIR)) {
  rmSync(STATIC_DIR, { recursive: true });
}
mkdirSync(STATIC_DIR, { recursive: true });

console.log(`fetch-plugin-api-docs: Downloading Javadoc for besu-plugin-api v${VERSION}...`);
console.log(`fetch-plugin-api-docs: ${JAR_URL}`);

/**
 * Follow HTTP redirects and resolve to the final response.
 */
function fetchFollowRedirects(url, redirectsLeft = 5) {
  return new Promise((resolve, reject) => {
    if (redirectsLeft === 0) {
      reject(new Error("Too many redirects"));
      return;
    }
    get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        resolve(fetchFollowRedirects(res.headers.location, redirectsLeft - 1));
      } else {
        resolve(res);
      }
    }).on("error", reject);
  });
}

try {
  const res = await fetchFollowRedirects(JAR_URL);
  if (res.statusCode !== 200) {
    throw new Error(
      `HTTP ${res.statusCode} fetching ${JAR_URL}. ` +
        `Check that besuVersion "${VERSION}" exists in the Maven repo.`
    );
  }

  // A Javadoc JAR is a ZIP file — pipe it directly through unzipper.
  await pipeline(res, Extract({ path: STATIC_DIR }));

  console.log(
    `fetch-plugin-api-docs: Unpacked Plugin API Javadoc v${VERSION} to static/plugins/reference/plugin-api/`
  );

  // Patch root-level HTML files with <base href="/plugin-api/">.
  //
  // Javadoc uses relative paths for CSS and inter-page links (e.g.
  // "resource-files/stylesheet.css", "org/hyperledger/…/package-summary.html").
  // When Docusaurus serves index.html at the URL /plugin-api (no trailing slash),
  // the browser treats it as a file at path /plugin-api and resolves relative URLs
  // from the parent /, breaking all links and styles.
  //
  // The <base> tag overrides that resolution: all relative URLs are resolved from
  // /plugin-api/ regardless of the URL the page was loaded from.
  //
  // Only root-level files need this patch. Deep package pages (e.g.
  // org/hyperledger/…/package-summary.html) use ../../../../ relative paths that
  // already resolve correctly when accessed at their full URL.
  const rootHtml = readdirSync(STATIC_DIR).filter((f) => f.endsWith(".html"));
  let patched = 0;
  for (const file of rootHtml) {
    const filePath = join(STATIC_DIR, file);
    const original = readFileSync(filePath, "utf8");
    if (original.includes('<base ')) continue;
    const updated = original.replace("<head>", '<head>\n<base href="/plugins/reference/plugin-api/">');
    writeFileSync(filePath, updated, "utf8");
    patched++;
  }
  console.log(
    `fetch-plugin-api-docs: Patched ${patched} root HTML files with <base href="/plugins/reference/plugin-api/">`
  );
} catch (err) {
  // Clean up partial output so a retry starts fresh.
  rmSync(STATIC_DIR, { recursive: true, force: true });
  console.error(`fetch-plugin-api-docs: Failed — ${err.message}`);
  process.exit(1);
}
