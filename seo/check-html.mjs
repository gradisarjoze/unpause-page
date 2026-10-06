import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { publicUrl } from "./publicUrl.mjs";
import { SITE, PAGES } from "./site.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

for (const [file, path] of Object.entries(PAGES)) {
  const html = readFileSync(join(root, file), "utf8");
  const expected = publicUrl(SITE, path);
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
  const ogUrl = html.match(/<meta\s+property="og:url"\s+content="([^"]+)"/i)?.[1];

  if (canonical !== expected) {
    failures.push(`${file} canonical: got ${canonical ?? "(missing)"} want ${expected}`);
  }
  if (ogUrl !== expected) {
    failures.push(`${file} og:url: got ${ogUrl ?? "(missing)"} want ${expected}`);
  }
  if (/\.html["']/i.test(canonical ?? "") || /\.html["']/i.test(ogUrl ?? "")) {
    failures.push(`${file} still declares a .html self-URL`);
  }
}

if (failures.length) {
  console.error("SEO check failed:");
  for (const line of failures) console.error(`  - ${line}`);
  process.exit(1);
}

console.log("SEO check passed (clean canonical + og:url):");
for (const [file, path] of Object.entries(PAGES)) {
  console.log(`  ${file} → ${publicUrl(SITE, path)}`);
}
