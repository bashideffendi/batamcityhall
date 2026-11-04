// Validasi semua data domain saat prebuild. Keluar dengan kode 1 kalau ada yang tidak valid,
// sehingga `next build` tidak jalan dengan data rusak.
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { ZodType } from "zod";
import * as s from "../lib/data/schema";

const ROOT = join(import.meta.dirname, "..");
const read = (p: string): unknown => JSON.parse(readFileSync(join(ROOT, p), "utf8"));

const CHECKS: [string, ZodType][] = [
  ["data/places.json", s.placeSchema.array()],
  ["data/places_stats.json", s.statsSchema],
  ["data/kampung_tua/kampung_tua.json", s.kampungTuaSchema],
  ["data/sejarah/garis_waktu.json", s.garisWaktuSchema],
  ["data/tokoh/tokoh.json", s.tokohSchema],
  ["data/tokoh/penamaan.json", s.penamaanSchema],
  ["data/tokoh/relasi.json", s.relasiSchema],
  ["data/budaya/acara.json", s.acaraSchema],
  ["data/budaya/kamus.json", s.kamusSchema],
  ["data/budaya/komunitas.json", s.komunitasSchema],
  ["data/budaya/tradisi_melayu.json", s.tradisiSchema],
  ["data/budaya/fakta_infografis.json", s.faktaSchema],
  ["data/trans_batam/koridor.json", s.koridorSchema],
  ["data/trans_batam/halte.json", s.halteSchema],
  ["data/feri/terminal.json", s.terminalSchema],
  ["data/feri/rute.json", s.ruteSchema],
  ["data/feri/jadwal.json", s.jadwalSchema],
  ["data/mural/segmen.json", s.segmenSchema],
  ["data/mural/landmarks.json", s.landmarkSchema],
  ["data/taksonomi/taksonomi.json", s.taksonomiSchema],
  ["data/makan/places.json", s.makanPlaceSchema.array()],
  ["data/makan/ferries.json", s.makanFerrySchema],
];

let failed = 0;
for (const [path, schema] of CHECKS) {
  if (!existsSync(join(ROOT, path))) {
    console.error(`HILANG  ${path}`);
    failed++;
    continue;
  }
  const r = schema.safeParse(read(path));
  if (r.success) continue;
  failed++;
  console.error(`INVALID ${path}`);
  for (const issue of r.error.issues.slice(0, 15)) {
    console.error(`  ${issue.path.join(".")}: ${issue.message}`);
  }
}

// Silang: jumlah per kategori di UI harus cocok dengan statistik (kriteria selesai 4.2).
const places = read("data/places.json") as s.Place[];
const stats = read("data/places_stats.json") as { total_tempat: number; per_kategori: Record<string, number> };
if (places.length !== stats.total_tempat) {
  failed++;
  console.error(`SILANG  places.json ${places.length} tempat, places_stats.json ${stats.total_tempat}`);
}

// Id unik.
const ids = new Set<string>();
for (const p of places) {
  if (ids.has(p.id)) {
    failed++;
    console.error(`GANDA   id ${p.id}`);
  }
  ids.add(p.id);
}

// Silang: sumber Makan satu, jadi tiap tempat harus ikut masuk places.json sebagai kuliner, dengan koordinat
// yang sama. Kalau gagal, jalankan scripts/konversi-makan.mjs lalu tools/merge_places.py.
const makan = read("data/makan/places.json") as { id: string; lat: number; lng: number; coord_approx: boolean }[];
const perId = new Map(places.map((p) => [p.id, p]));
for (const m of makan) {
  const p = perId.get(m.id);
  if (p?.kategori !== "kuliner" || (p.status_koordinat !== "terverifikasi" && (p.lat !== m.lat || p.lng !== m.lng))) {
    failed++;
    console.error(`SILANG  data/makan/places.json ${m.id} tidak cocok dengan places.json`);
  }
}

// Larangan: data pajak tidak boleh ada di file hotel.
const hotel = readFileSync(join(ROOT, "data/akomodasi/hotel.csv"), "utf8").split("\n")[0].toLowerCase();
if (/npwpd|\bnop\b|sspd|sptpd|pajak/.test(hotel)) {
  failed++;
  console.error("LARANGAN data/akomodasi/hotel.csv memuat kolom pajak");
}

if (failed) {
  console.error(`\nValidasi data gagal: ${failed} masalah.`);
  process.exit(1);
}
console.log(`Data valid: ${CHECKS.length} berkas, ${places.length} tempat.`);
