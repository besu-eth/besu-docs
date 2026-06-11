#!/usr/bin/env node
/**
 * Post-build script: copy source .md files into the build output so that
 * appending ".md" to any documentation URL returns the raw markdown source.
 *
 * Docusaurus URL mapping (routeBasePath "/", path "./docs"):
 *   docs/<area>/path/to/page.md   → build/<area>/path/to/page.md
 *   docs/<area>/path/to/dir/index.md → build/<area>/path/to/dir.md
 *
 * This lets agents request, e.g.:
 *   https://docs.besu-eth.org/public-networks/get-started/install.md
 */

const fs = require("fs");
const path = require("path");

const DOCS_DIR = path.join(__dirname, "..", "docs");
const BUILD_DIR = path.join(__dirname, "..", "build");

// Docusaurus exclude patterns (from docusaurus.config.js)
const SKIP_PREFIXES = ["_"];

// Directive prepended after frontmatter so agents that fetch .md URLs
// can discover the documentation index and other markdown pages.
const AGENT_DIRECTIVE =
  "> For AI agents: a documentation index is available at " +
  "[/llms.txt](/llms.txt). " +
  "Append `.md` to any documentation URL to get the markdown source.\n\n";

let copied = 0;
let skipped = 0;

function shouldSkip(relPath) {
  return relPath.split(path.sep).some((segment) =>
    SKIP_PREFIXES.some((prefix) => segment.startsWith(prefix))
  );
}

/**
 * Insert the agent directive after the YAML frontmatter block (--- ... ---).
 * If no frontmatter is present, prepend to the start of the file.
 */
function addDirective(content) {
  // Frontmatter starts at position 0 with "---\n" and ends with "\n---\n"
  if (content.startsWith("---\n") || content.startsWith("---\r\n")) {
    const closingIdx = content.indexOf("\n---\n", 3);
    if (closingIdx !== -1) {
      const insertAt = closingIdx + 5; // after "\n---\n"
      return content.slice(0, insertAt) + "\n" + AGENT_DIRECTIVE + content.slice(insertAt);
    }
  }
  return AGENT_DIRECTIVE + content;
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      const rel = path.relative(DOCS_DIR, fullPath);

      if (shouldSkip(rel)) {
        skipped++;
        continue;
      }

      let destRel;
      if (entry.name === "index.md") {
        const parentRel = path.dirname(rel);
        destRel = parentRel === "." ? "index.md" : `${parentRel}.md`;
      } else {
        destRel = rel;
      }

      const destPath = path.join(BUILD_DIR, destRel);
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      const content = fs.readFileSync(fullPath, "utf8");
      fs.writeFileSync(destPath, addDirective(content), "utf8");
      copied++;
    }
  }
}

walk(DOCS_DIR);
console.log(
  `copy-md-to-build: copied ${copied} files, skipped ${skipped} files`
);
