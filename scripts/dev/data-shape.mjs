// Ringkas bentuk semua file JSON di data/ (dipakai saat menulis skema zod).
// Pakai: node scripts/dev/data-shape.mjs data
import fs from "fs";
import path from "path";

const root = process.argv[2] ?? "data";
const walk = (d) =>
  fs
    .readdirSync(d, { withFileTypes: true })
    .flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const SKIP = ["raw", "places", "logs", "snippets", "makan"];

for (const f of walk(root)
  .filter((x) => x.endsWith(".json"))
  .sort()) {
  const rel = path.relative(root, f).split(path.sep).join("/");
  if (SKIP.includes(rel.split("/")[0]) || /places_id_index|koordinat_user|places_konflik/.test(rel)) continue;
  const j = JSON.parse(fs.readFileSync(f, "utf8"));
  const desc = (v) =>
    Array.isArray(v)
      ? `[${v.length}] {${
          v[0] && typeof v[0] === "object"
            ? [...new Set(v.flatMap((x) => (x && typeof x === "object" ? Object.keys(x) : [])))].join(",")
            : typeof v[0]
        }}`
      : v && typeof v === "object"
        ? `{${Object.keys(v).slice(0, 30).join(",")}}`
        : typeof v;
  if (Array.isArray(j)) console.log(rel, desc(j));
  else {
    console.log(rel);
    for (const [k, v] of Object.entries(j).slice(0, 14)) console.log("   ", k, ":", desc(v));
  }
}
