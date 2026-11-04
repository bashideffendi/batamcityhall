// Konversi data Makan ke skema tempat Batam City Hall (CLAUDE_CODE_PROMPT 4.0 butir 6).
//
// Sumber data tetap satu: data/makan/places.json. Berkas keluaran dibuat ulang dari sana dan jangan
// disunting tangan. Alur lengkap, dari root repo:
//   node scripts/konversi-makan.mjs          menulis data/places/17-batam-bites.json
//   python tools/merge_places.py             menggabungkan ke data/places.json dan indeks id
//   node scripts/konversi-makan.mjs --feri   menulis data/makan/ferries.json dari data situs
//
// Tidak ada koordinat atau kecamatan yang ditebak: koordinat disalin persis dengan status
// perlu_cek_ulang, dan kecamatan hanya diisi kalau tertulis di alamat atau nama area.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const baca = (p) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));
const tulis = (p, v) => writeFileSync(join(ROOT, p), `${JSON.stringify(v, null, 1)}\n`, "utf8");

export const SUMBER_RISET = "17-batam-bites";
export const CATATAN_KOORDINAT =
  "Titik tengah area ditambah jitter dari batam-bites (coord_approx: true), bukan titik tempat. Perkiraan area. Arah memakai kueri Google Maps di atribut.gmaps.";

export const KECAMATAN = [
  "Batam Kota",
  "Batu Aji",
  "Batu Ampar",
  "Belakang Padang",
  "Bengkong",
  "Bulang",
  "Galang",
  "Lubuk Baja",
  "Nongsa",
  "Sagulung",
  "Sei Beduk",
  "Sekupang",
];

const samakan = (s) => s.replace(/\bSungai Beduk\b/gi, "Sei Beduk").trim();
const namaKecamatan = (s) => KECAMATAN.find((k) => k.toLowerCase() === samakan(s).toLowerCase()) ?? null;

/**
 * Kecamatan dari teks sumber, tanpa menebak. Urutannya: "Kec. X" di alamat, potongan alamat yang persis
 * nama kecamatan (kode pos boleh mengikuti), lalu nama area batam-bites yang memuat nama kecamatan.
 * Area seperti "Penuin" atau "Tiban" tidak dipetakan: tidak ada kecamatan tertulis di sana.
 */
export function cariKecamatan(alamat, namaArea) {
  const kec = (alamat ?? "").match(/Kec(?:amatan)?\.?\s+([A-Za-z ]+?)\s*(?:,|$|\d)/);
  if (kec && namaKecamatan(kec[1])) return namaKecamatan(kec[1]);
  // Alamat bisa berisi beberapa cabang: hanya lokasi pertama yang dibaca, dan daftar "Cabang: a, b, c"
  // tidak dibaca sama sekali karena potongannya bukan alamat satu tempat.
  const utama = (alamat ?? "").split(";")[0].replace(/\(.*?\)/g, " ");
  if (!/^\s*(cabang|outlet)\b/i.test(utama)) {
    for (const bagian of utama.split(",").reverse()) {
      const k = namaKecamatan(bagian.replace(/\b\d{5}\b/g, ""));
      if (k) return k;
    }
  }
  for (const bagian of (namaArea ?? "").split("/")) {
    const k = namaKecamatan(bagian);
    if (k) return k;
  }
  return null;
}

/** Satu tempat batam-bites menjadi satu entri skema tempat (tools/_agent_spec.md). */
export function konversiTempat(p, namaArea) {
  const kecamatan = cariKecamatan(p.address, namaArea);
  return {
    id: p.id,
    nama: p.name,
    nama_alternatif: [],
    kategori: "kuliner",
    subkategori: p.category,
    kecamatan,
    kelurahan: null,
    alamat: p.address || null,
    lat: p.lat,
    lng: p.lng,
    status_koordinat: "perlu_cek_ulang",
    catatan_koordinat: CATATAN_KOORDINAT,
    jam_layanan: p.hours || null,
    kontak: {
      telepon: p.phone || null,
      whatsapp: null,
      email: null,
      website: p.instagram || null,
    },
    atribut: {
      area: p.area,
      coord_approx: p.coord_approx,
      gmaps: p.gmaps,
      halal: p.halal,
      labels: p.labels,
      tags: p.tags,
      subcategory: p.subcategory,
      signature: p.signature,
      desc_id: p.desc_id,
      desc_en: p.desc_en,
      desc_zh: p.desc_zh ?? null,
      price_tier: p.price_tier,
      price_idr: p.price_idr || null,
      payments: p.payments,
      nearest_ferry: p.nearest_ferry,
      ferry_km: p.ferry_km,
      // Angka Google: disimpan, tidak ditampilkan (docs/DATA_DECISIONS.md).
      rating: p.rating,
      reviews: p.reviews,
      featured: p.featured,
      verified: p.verified,
      last_verified: p.last_verified,
    },
    status_data: p.verified ? "terverifikasi" : "perlu_cek_ulang",
    catatan: kecamatan ? null : `Kecamatan tidak tertulis di sumber. Area batam-bites: ${namaArea || p.area}.`,
    tag_osm: null,
    sumber_url: [],
    sumber_riset: SUMBER_RISET,
  };
}

export function konversiSemua(places, areas) {
  const nama = Object.fromEntries(areas.map((a) => [a.id, a.name]));
  return places.map((p) => konversiTempat(p, nama[p.area]));
}

/** Empat terminal Makan: id lama (dipakai filter dan data/makan/places.json) dan nama pendeknya. */
export const TERMINAL_MAKAN = [
  { id: "batam-centre", label: "Batam Centre" },
  { id: "harbour-bay", label: "Harbour Bay" },
  { id: "sekupang", label: "Sekupang" },
  { id: "nongsapura", label: "Nongsapura" },
];

/** Terminal dari data situs lewat places_id_index.json. Gagal keras kalau alias belum ada, jangan menebak. */
export function terminalDariSitus(places, indeks) {
  const perId = new Map(places.map((p) => [p.id, p]));
  return TERMINAL_MAKAN.map(({ id, label }) => {
    const kanonik = indeks[id];
    const t = kanonik && perId.get(kanonik);
    if (!t) throw new Error(`Alias terminal '${id}' tidak ada di data/places_id_index.json`);
    return {
      id,
      id_kanonik: t.id,
      label,
      nama: t.nama,
      lat: t.lat,
      lng: t.lng,
      status_koordinat: t.status_koordinat,
    };
  });
}

function main() {
  if (process.argv.includes("--feri")) {
    tulis("data/makan/ferries.json", terminalDariSitus(baca("data/places.json"), baca("data/places_id_index.json")));
    console.log("data/makan/ferries.json ditulis dari data/places.json");
    return;
  }
  const hasil = konversiSemua(baca("data/makan/places.json"), baca("data/makan/areas.json"));
  tulis(`data/places/${SUMBER_RISET}.json`, hasil);
  const tanpaKec = hasil.filter((h) => !h.kecamatan).length;
  console.log(`data/places/${SUMBER_RISET}.json: ${hasil.length} tempat, ${tanpaKec} tanpa kecamatan`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
