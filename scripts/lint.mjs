import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "src");

const CHECK_EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs"]);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else if (CHECK_EXTS.has(path.extname(entry.name))) {
      files.push(full);
    }
  }
  return files;
}

const errors = [];
const warnings = [];

const srcFiles = walk(SRC_DIR);

for (const file of srcFiles) {
  const rel = path.relative(ROOT, file);
  const content = fs.readFileSync(file, "utf8");
  const lines = content.split(/\r?\n/);

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;

    // 1. No leftover Git merge conflict markers (exact 7-char Git conflict syntax)
    if (/^(<{7}\s|={7}$|>{7}\s)/.test(line)) {
      errors.push(`${rel}:${lineNum} — Leftover Git merge conflict marker`);
    }

    // 2. No hardcoded Groq API keys
    if (/gsk_[A-Za-z0-9]{20,}/.test(line)) {
      errors.push(`${rel}:${lineNum} — Possible hardcoded Groq API key detected`);
    }

    // 3. No stray console.log statements in production source
    if (/\bconsole\.log\s*\(/.test(line)) {
      warnings.push(`${rel}:${lineNum} — Stray console.log() statement`);
    }

    // 4. Enforce Light-Theme Design System (allow semi-transparent modal backdrops like bg-slate-900/40)
    if (/\bbg-(slate-900|gray-900|zinc-900|neutral-900|black)(?!\/)\b/.test(line)) {
      errors.push(`${rel}:${lineNum} — Solid dark background class violates light-theme design system`);
    }
  });
}

if (warnings.length > 0) {
  console.warn(`Lint warnings (${warnings.length}):`);
  for (const w of warnings) console.warn(`  WARN  ${w}`);
}

if (errors.length > 0) {
  console.error(`Lint failed with ${errors.length} error(s):`);
  for (const e of errors) console.error(`  ERROR ${e}`);
  process.exit(1);
}

console.log(`Static lint passed (${srcFiles.length} source files checked, 0 errors, ${warnings.length} warnings).`);
