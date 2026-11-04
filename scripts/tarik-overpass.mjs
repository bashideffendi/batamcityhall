// Menarik query di data/osm/overpass/ dari Overpass publik, satu per satu dengan jeda, identitas jujur.
// Hasil disimpan bertanggal di data/osm/<tanggal>/. Pemakaian: node scripts/tarik-overpass.mjs [awalan nama berkas]
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const AKAR = process.cwd();
const DIR = join(AKAR, "data/osm/overpass");
const TANGGAL = process.env.TANGGAL_TARIK ?? new Date().toISOString().slice(0, 10);
const KELUAR = join(AKAR, "data/osm", TANGGAL);
const ENDPOINT = "https://overpass-api.de/api/interpreter";
const UA = "BatamCityHall/0.1 (situs warga non-komersial; cek kelengkapan direktori)";
const JEDA_MS = 30_000;

const tidur = (ms) => new Promise((r) => setTimeout(r, ms));
const saring = process.argv[2] ?? "";
const berkas = readdirSync(DIR)
  .filter((f) => f.endsWith(".overpassql") && f.startsWith(saring))
  .sort();

mkdirSync(KELUAR, { recursive: true });
const jalurRingkas = join(KELUAR, "ringkasan.json");
// Tarikan ulang satu query tidak menghapus hasil query lain.
const ringkas = existsSync(jalurRingkas) ? JSON.parse(readFileSync(jalurRingkas, "utf8")).hasil : {};
for (const [i, f] of berkas.entries()) {
  if (i > 0) await tidur(JEDA_MS);
  const query = readFileSync(join(DIR, f), "utf8");
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "User-Agent": UA, "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ data: query }),
      signal: AbortSignal.timeout(180_000),
    });
    const teks = await res.text();
    if (!res.ok) {
      ringkas[f] = { status: res.status };
      console.log(f, "gagal", res.status);
      continue;
    }
    const json = JSON.parse(teks);
    writeFileSync(join(KELUAR, f.replace(".overpassql", ".json")), JSON.stringify(json));
    const hitung = json.elements.filter((e) => e.type === "count").map((e) => e.tags);
    ringkas[f] = { elemen: json.elements.length, ...(hitung.length ? { hitung } : {}) };
    console.log(f, json.elements.length);
  } catch (e) {
    ringkas[f] = { galat: String(e) };
    console.log(f, "galat", String(e));
  }
}
writeFileSync(
  jalurRingkas,
  JSON.stringify(
    { tanggal: TANGGAL, sumber: ENDPOINT, lisensi: "ODbL, © OpenStreetMap contributors", hasil: ringkas },
    null,
    1,
  ) + "\n",
);
