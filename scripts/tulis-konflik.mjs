// Menulis docs/KONFLIK_DATA.md dari data/places_konflik.json: nilai yang dipakai situs, dan hasil cek OSM bila ada.
// Pemakaian: node scripts/tulis-konflik.mjs
import { readFileSync, writeFileSync } from "node:fs";

const konflik = JSON.parse(readFileSync("data/places_konflik.json", "utf8"));
const places = new Map(JSON.parse(readFileSync("data/places.json", "utf8")).map((p) => [p.id, p]));
const osm = new Map(JSON.parse(readFileSync("data/osm/2026-11-04/laporan-koordinat.json", "utf8")).map((o) => [o.id, o]));

const teks = (v) => (typeof v === "string" ? v : JSON.stringify(v)).replace(/\|/g, "/").replace(/\s+/g, " ");
const ATURAN = {
  koordinat_beda: "Situs memakai nilai di `places.json`, tetap berstatus perkiraan kecuali cocok OSM. Pemilik memutuskan lewat CSV koordinat.",
  alamat_beda: "Situs memakai alamat di `places.json`. Tidak ditebak mana yang benar.",
  kecamatan_beda: "Situs memakai kecamatan di `places.json`.",
  telepon_beda: "Situs memakai telepon di `places.json`.",
};

const perJenis = new Map();
for (const k of konflik) perJenis.set(k.jenis, [...(perJenis.get(k.jenis) ?? []), k]);

let isi = `# Konflik data

Dibuat oleh \`scripts/tulis-konflik.mjs\` dari \`data/places_konflik.json\`. ${konflik.length} konflik.

Aturan umumnya: situs memakai nilai yang dipilih saat penggabungan (\`tools/merge_places.py\`), konflik tidak diselesaikan dengan menebak, dan pemilik bisa mengubahnya kapan saja. Baris tanpa bukti luar tetap seperti ini sampai ada yang mengecek ke lapangan.
`;
for (const [jenis, daftar] of [...perJenis.entries()].sort()) {
  isi += `\n## ${jenis} (${daftar.length})\n\n${ATURAN[jenis] ?? "Situs memakai nilai di `places.json`."}\n\n| Tempat | Versi A | Versi B | Dipakai situs | Cek OSM |\n|---|---|---|---|---|\n`;
  for (const k of daftar) {
    const p = places.get(k.id);
    const dipakai = !p
      ? "tempat tidak ditemukan"
      : jenis.startsWith("koordinat")
        ? p.lat == null
          ? "belum ada koordinat"
          : `${p.lat}, ${p.lng} (${p.status_koordinat})`
        : teks(p.alamat ?? p.kecamatan ?? "kosong");
    const o = osm.get(k.id);
    isi += `| ${k.nama} | ${teks(k.a)} | ${teks(k.b)} | ${dipakai} | ${o ? `${o.jarak_m} m dari ${o.osm_nama}` : ""} |\n`;
  }
}
writeFileSync("docs/KONFLIK_DATA.md", isi);
console.log([...perJenis.entries()].map(([j, d]) => `${j}: ${d.length}`).join(", "));
