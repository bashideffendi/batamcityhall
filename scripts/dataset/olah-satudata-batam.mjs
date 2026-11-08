// Ubah peta Satu Data Batam di arsip menjadi GeoJSON:
//   peta/kecamatan.js     → peta/kecamatan.geojson   (12 poligon, variabel kecXxx = array cincin {lat,lng})
//   peta/geospasial.json  → peta/titik-fasilitas.geojson (lapisan "Peta Koordinat", dengan tanda periksa)
// Lapisan "Peta Area" sengaja tidak diolah: terbukti berisi angka salah (riset 9 Nov 2026).
// Titik TIDAK boleh tampil di situs sebelum diperiksa satu per satu (aturan proyek: jangan menebak koordinat).
import vm from "node:vm";
import { baca, simpan } from "./sopan.mjs";

const DIR = "satudata-batam/peta";
// Kotak kasar Kota Batam termasuk pulau-pulau Galang dan Belakang Padang.
const DI_BATAM = (lat, lng) => lat > 0.4 && lat < 1.3 && lng > 103.6 && lng < 104.45;

// --- kecamatan ---
const kode = baca(`${DIR}/kecamatan.js`);
const ruang = {};
vm.runInNewContext(`${kode.replace(/\blet\s+(kec\w+)\s*=/g, "globalThis.$1 =")}`, ruang, { timeout: 5000 });
const NAMA = {
  kecBatamKota: "Batam Kota",
  kecBatuAji: "Batu Aji",
  kecBatuAmpar: "Batu Ampar",
  kecBelakangPadang: "Belakang Padang",
  kecBengkong: "Bengkong",
  kecBulang: "Bulang",
  kecGalang: "Galang",
  kecLubukBaja: "Lubuk Baja",
  kecNongsa: "Nongsa",
  kecSagulung: "Sagulung",
  kecSeiBeduk: "Sei Beduk",
  kecSungaiBeduk: "Sei Beduk",
  kecSekupang: "Sekupang",
};
const fitur = [];
for (const [variabel, nilai] of Object.entries(ruang)) {
  if (!Array.isArray(nilai)) continue;
  const cincin = (Array.isArray(nilai[0]) ? nilai : [nilai]).map((r) => {
    const c = r.map((p) => [Number(p.lng), Number(p.lat)]);
    const [a, b] = [c[0], c[c.length - 1]];
    if (a[0] !== b[0] || a[1] !== b[1]) c.push(a);
    return c;
  });
  fitur.push({
    type: "Feature",
    properties: { variabel, kecamatan: NAMA[variabel] ?? variabel, jumlah_cincin: cincin.length },
    // Tiap cincin diperlakukan sebagai pulau terpisah: berkas sumber tidak membedakan lubang dan pulau.
    geometry: { type: "MultiPolygon", coordinates: cincin.map((c) => [c]) },
  });
}
simpan(
  `${DIR}/kecamatan.geojson`,
  JSON.stringify({ type: "FeatureCollection", name: "Kecamatan Kota Batam (Satu Data Batam)", features: fitur }),
);
console.log(`kecamatan: ${fitur.length} fitur (${fitur.map((f) => f.properties.kecamatan).join(", ")})`);

// --- titik fasilitas ---
const geo = JSON.parse(baca(`${DIR}/geospasial.json`));
const titik = [];
const kunci = new Map();
for (const grup of geo.results) {
  for (const lapisan of grup.children ?? []) {
    if (lapisan.type !== "titik") continue;
    const nama = JSON.parse(lapisan.lokasi ?? "[]");
    const pt = JSON.parse(lapisan.point ?? "[]");
    nama.forEach((n, i) => {
      const lat = Number(pt[i]?.lat);
      const lng = Number(pt[i]?.lng);
      const ok = Number.isFinite(lat) && Number.isFinite(lng) && lat !== 0;
      const periksa = !ok ? "koordinat_kosong" : !DI_BATAM(lat, lng) ? "di_luar_batam" : null;
      const k = ok ? `${lat.toFixed(6)},${lng.toFixed(6)}` : null;
      if (k) kunci.set(k, (kunci.get(k) ?? 0) + 1);
      titik.push({
        type: "Feature",
        properties: { lapisan: lapisan.text, nama: String(n).trim(), periksa, kunci: k },
        geometry: ok ? { type: "Point", coordinates: [lng, lat] } : null,
      });
    });
  }
}
for (const t of titik) {
  if (t.properties.kunci && kunci.get(t.properties.kunci) > 1 && !t.properties.periksa)
    t.properties.periksa = "koordinat_ganda";
  delete t.properties.kunci;
}
simpan(
  `${DIR}/titik-fasilitas.geojson`,
  JSON.stringify({
    type: "FeatureCollection",
    name: "Titik fasilitas (Satu Data Batam, belum diverifikasi)",
    features: titik,
  }),
);
const tanda = titik.reduce(
  (a, t) => ((a[t.properties.periksa ?? "ok"] = (a[t.properties.periksa ?? "ok"] ?? 0) + 1), a),
  {},
);
console.log(`titik: ${titik.length}`, tanda);
