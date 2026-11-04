// Rakit docs/COVERAGE.md dari docs/COVERAGE_TEMPLATE.md + docs/coverage-parts/NN.md.
// Bagian laporan NN di templat diganti pecahan rincinya. Judul templat yang hilang dari
// pecahan dilaporkan, supaya tidak ada bagian riset yang terlewat diam-diam.
// Pakai: node scripts/dev/build-coverage.mjs
// PERHATIAN: hanya untuk perakitan awal. Sesudah COVERAGE.md mulai dicentang, jangan dijalankan lagi.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DOCS = join(import.meta.dirname, "..", "..", "docs");
const OUT = join(DOCS, "COVERAGE.md");
if (existsSync(OUT) && !process.argv.includes("--force")) {
  console.error("docs/COVERAGE.md sudah ada. Pakai --force hanya kalau yakin centangnya boleh hilang.");
  process.exit(1);
}

const template = readFileSync(join(DOCS, "COVERAGE_TEMPLATE.md"), "utf8");
const sections = template.split(/^(?=## )/m);
const missing = [];
const out = sections.map((sec) => {
  const m = /^## (\d\d)-[^\n]*\.md\s*\n/.exec(sec);
  if (!m) return sec;
  const nn = m[1];
  const partPath = join(DOCS, "coverage-parts", `${nn}.md`);
  if (!existsSync(partPath)) return sec; // laporan 00 tidak punya pecahan
  const part = readFileSync(partPath, "utf8");
  const heads = [...sec.matchAll(/^\s*- \[ \] (\d\d › .+)$/gm)].map((h) => h[1].trim());
  // Sub-judul bersarang di pecahan boleh ditulis tanpa awalan "NN › ".
  for (const h of heads) if (!part.includes(h) && !part.includes(h.replace(/^\d\d › /, ""))) missing.push(h);
  return `${sec.slice(0, m[0].length)}\n${part.replace(/^#[^\n]*\n/gm, "").trim()}\n\n`;
});

const body = out.join("").replace(/^# COVERAGE \(templat\)[\s\S]*?(?=^Aturan:)/m, "# COVERAGE\n\n");
writeFileSync(OUT, body);

const open = (body.match(/^\s*- \[ \]/gm) ?? []).length;
const done = (body.match(/^\s*- \[x\]/gm) ?? []).length;
const skip = (body.match(/^\s*- \[-\]/gm) ?? []).length;
console.log(`COVERAGE.md: ${open} belum, ${done} selesai, ${skip} ditunda/konteks, ${body.split("\n").length} baris`);
console.log(`judul templat yang tidak ada di pecahan: ${missing.length}`);
for (const h of missing.slice(0, 30)) console.log("  -", h);
