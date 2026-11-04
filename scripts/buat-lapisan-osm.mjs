// Membuat lapisan peta dari hasil tarikan OSM. Tetap terpisah dari data kurasi (prompt bagian 5 butir 4):
// halte OSM tidak mengubah data/trans_batam/halte.json, cocokannya hanya jadi usulan untuk ditinjau pemilik.
// Pemakaian: node scripts/buat-lapisan-osm.mjs data/osm/2026-11-04
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const folder = process.argv[2];
if (!folder) throw new Error("Sebutkan folder hasil tarikan, mis. data/osm/2026-11-04");
const baca = (f) => JSON.parse(readFileSync(join(folder, f), "utf8")).elements;

const BATAS = { w: 103.55, s: 0.45, e: 104.75, n: 1.5 };
const dalam = ([lng, lat]) => lng >= BATAS.w && lng <= BATAS.e && lat >= BATAS.s && lat <= BATAS.n;
const bulat = (x) => Math.round(x * 1e6) / 1e6;

// --- Koridor dari relasi OSM ---
const elemen = baca("10-relasi-rute-bus-ptv2.json");
const node = new Map(elemen.filter((e) => e.type === "node").map((e) => [e.id, [bulat(e.lon), bulat(e.lat)]]));
const way = new Map(elemen.filter((e) => e.type === "way").map((e) => [e.id, e.nodes.map((n) => node.get(n))]));
const koridor = JSON.parse(readFileSync("data/trans_batam/koridor.json", "utf8")).koridor;

/** Rangkai anggota relasi menurut urutannya. Ruas yang tidak bersambung jadi garis terpisah, tidak disambung lurus. */
export function rangkai(ruas) {
  const garis = [];
  let kini = [];
  const sama = (a, b) => a && b && a[0] === b[0] && a[1] === b[1];
  for (const r of ruas) {
    const akhir = kini.at(-1);
    if (!kini.length) kini = [...r];
    else if (sama(akhir, r[0])) kini.push(...r.slice(1));
    else if (sama(akhir, r.at(-1))) kini.push(...[...r].reverse().slice(1));
    else if (kini.length && sama(kini[0], r[0]) && garis.length === 0) kini = [...[...r].reverse(), ...kini.slice(1)];
    else if (kini.length && sama(kini[0], r.at(-1)) && garis.length === 0) kini = [...r, ...kini.slice(1)];
    else {
      garis.push(kini);
      kini = [...r];
    }
  }
  if (kini.length) garis.push(kini);
  return garis.filter((g) => g.length >= 2);
}

const fiturRute = [];
for (const [urut, rel] of elemen.filter((e) => e.type === "relation").entries()) {
  const m = /Koridor (\d+)/i.exec(rel.tags?.name ?? "");
  const k = m && koridor.find((x) => x.id === `K${m[1]}`);
  if (!k) continue;
  const warna = k.warna_palet?.hex ?? k.warna;
  const ruas = rel.members
    .filter((x) => x.type === "way")
    .map((x) => way.get(x.ref))
    .filter(Boolean);
  const garis = rangkai(ruas);
  console.log(rel.tags.name, "anggota", ruas.length, "garis", garis.length, "titik", garis.flat().length);
  for (const g of garis.filter((x) => x.every(dalam))) {
    fiturRute.push({
      type: "Feature",
      geometry: { type: "LineString", coordinates: g },
      properties: {
        koridor: k.id,
        arah: rel.tags.name,
        warna,
        offset: urut % 2 === 0 ? 1.5 : -1.5,
        sumber_geometri: "osm",
        osm: `relation/${rel.id}`,
      },
    });
  }
}
writeFileSync(
  "data/trans_batam/routes.geojson",
  JSON.stringify({ type: "FeatureCollection", features: fiturRute }) + "\n",
);

// --- Jalur feri yang menyentuh Batam ---
const KATA_BATAM = /harbou?r bay|sekupang|batam|nongsa|punggur|waterfront|gold coast|sagulung|sembulang|batu ampar/i;
const fiturFeri = baca("14-jalur-feri.json")
  .filter((e) => e.type === "way" && KATA_BATAM.test(e.tags?.name ?? ""))
  .map((e) => ({ e, g: (e.geometry ?? []).map((p) => [bulat(p.lon), bulat(p.lat)]) }))
  .filter(({ g }) => g.length >= 2 && g.every(dalam))
  .map(({ e, g }) => ({
    type: "Feature",
    geometry: { type: "LineString", coordinates: g },
    properties: { nama: e.tags.name, osm: `way/${e.id}` },
  }));

// --- Halte menurut OSM ---
const halteOsm = baca("10-halte-bus.json").filter((e) => e.lat != null && dalam([e.lon, e.lat]));
const fiturHalte = halteOsm.map((e) => ({
  type: "Feature",
  geometry: { type: "Point", coordinates: [bulat(e.lon), bulat(e.lat)] },
  properties: { nama: e.tags?.name ?? "Halte tanpa nama", osm: `node/${e.id}` },
}));

mkdirSync("data/osm/lapisan", { recursive: true });
const pembungkus = (features) => ({
  type: "FeatureCollection",
  atribusi: "© OpenStreetMap contributors, ODbL",
  ditarik: folder.split(/[\\/]/).at(-1),
  features,
});
writeFileSync("data/osm/lapisan/feri.geojson.json", JSON.stringify(pembungkus(fiturFeri)) + "\n");
writeFileSync("data/osm/lapisan/halte.geojson.json", JSON.stringify(pembungkus(fiturHalte)) + "\n");

// --- Usulan koordinat halte: nama persis sama, untuk ditinjau. Tidak diimpor otomatis. ---
const norma = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const perNama = new Map();
for (const e of halteOsm) {
  if (!e.tags?.name) continue;
  const n = norma(e.tags.name);
  perNama.set(n, perNama.has(n) ? null : e);
}
const halte = JSON.parse(readFileSync("data/trans_batam/halte.json", "utf8")).halte;
const baris = ["id,nama,lat,lng,status_koordinat,catatan_koordinat"];
for (const h of halte) {
  const e = perNama.get(norma(h.nama));
  if (e)
    baris.push(
      `${h.id},"${h.nama}",${e.lat},${e.lon},perlu_cek_ulang,"Nama cocok dengan OSM node/${e.id}. Tinjau dulu."`,
    );
}
writeFileSync("data/trans_batam/halte_usulan_osm.csv", baris.join("\n") + "\n");
console.log("rute", fiturRute.length, "feri", fiturFeri.length, "halte", fiturHalte.length, "usulan", baris.length - 1);
