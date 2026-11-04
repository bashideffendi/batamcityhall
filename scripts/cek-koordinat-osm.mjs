// Mencocokkan tempat berkoordinat dengan hasil tarikan OSM (scripts/tarik-overpass.mjs), berdasarkan nama.
// Hanya menulis laporan: data kurasi tidak diubah. Pemakaian: node scripts/cek-koordinat-osm.mjs <folder data/osm/tanggal>
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const folder = process.argv[2];
if (!folder) throw new Error("Sebutkan folder hasil tarikan, mis. data/osm/2026-11-05");

const tempat = JSON.parse(readFileSync("data/places.json", "utf8")).filter((p) => p.lat != null);

const titik = [];
for (const f of readdirSync(folder)) {
  if (!f.endsWith(".json") || f === "ringkasan.json" || f === "laporan-koordinat.json") continue;
  const { elements } = JSON.parse(readFileSync(join(folder, f), "utf8"));
  for (const e of elements) {
    const nama = e.tags?.name;
    const lat = e.lat ?? e.center?.lat;
    const lon = e.lon ?? e.center?.lon;
    if (nama && lat != null && lon != null)
      titik.push({ nama, lat, lon, osm: `${e.type}/${e.id}`, tag: f.replace(".json", "") });
  }
}

const norma = (s) =>
  s
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\b(pelabuhan|terminal|ferry|feri|kota|batam|masjid|gereja|the)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const jarakM = (a, b, c, d) => {
  const r = Math.PI / 180;
  const x = Math.sin(((c - a) * r) / 2) ** 2 + Math.cos(a * r) * Math.cos(c * r) * Math.sin(((d - b) * r) / 2) ** 2;
  return 6371000 * 2 * Math.asin(Math.sqrt(x));
};

const hasil = [];
for (const p of tempat) {
  const n = norma(p.nama);
  if (n.length < 5) continue;
  const cocok = titik
    .filter((t) => {
      const m = norma(t.nama);
      return m.length >= 5 && (m === n || m.includes(n) || n.includes(m));
    })
    .map((t) => ({ ...t, jarak: Math.round(jarakM(p.lat, p.lng, t.lat, t.lon)) }))
    .sort((a, b) => a.jarak - b.jarak);
  if (cocok[0] && cocok[0].jarak < 5000) {
    hasil.push({
      id: p.id,
      nama: p.nama,
      status: p.status_koordinat,
      osm_nama: cocok[0].nama,
      osm: cocok[0].osm,
      jarak_m: cocok[0].jarak,
    });
  }
}
hasil.sort((a, b) => a.jarak_m - b.jarak_m);
writeFileSync(join(folder, "laporan-koordinat.json"), JSON.stringify(hasil, null, 1) + "\n");
console.log(`tempat berkoordinat ${tempat.length}, titik OSM bernama ${titik.length}, cocok nama ${hasil.length}`);
for (const h of hasil) console.log(String(h.jarak_m).padStart(5), h.status.padEnd(16), h.id, "|", h.osm_nama);
