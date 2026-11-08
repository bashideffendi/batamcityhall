// Arsip layer "Data Terbuka" Geoportal BP Batam dari ArcGIS Server (web-gis.bpbatam.go.id), sebagai GeoJSON WGS84.
//   node scripts/dataset/bpbatam-geoportal.mjs
// Server tidak memiliki robots.txt (riset 9 Nov 2026). Jeda 10,5 detik tetap dipakai, mengikuti Crawl-Delay portal datanya.
// TIDAK diambil: Kepemilikan Tanah (hak lahan per persil), folder data_terbatas/data_tertutup/DATACAKRA, POI dan
// Penduduk_Perkelurahan (butuh token). Kolom foto (tautan cloudbox) dibuang karena hak ciptanya tidak jelas.
import { ada, ambil, hariIni, simpan } from "./sopan.mjs";

const BASIS = "https://web-gis.bpbatam.go.id/arcgis/rest/services";
const DIR = "bpbatam-geoportal";
const JEDA = 10500;
const KOLOM_BUANG = /^(gambar|foto|image|photo)/i;

// [layanan, layer, judul, filter where]
const LAYER = [
  ["Utilitas/JALAN_LN_50K", 0, "Jalan 1:50.000"],
  ["Utilitas/AIRLIMBAH_LN_50K", 0, "Jaringan Air Limbah 1:50.000"],
  ["Utilitas/KABELLISTRIK_LN_50K", 0, "Jaringan Kabel Listrik 1:50.000"],
  ["Fasilitas/PEMANFAATAN_AR_50K", 0, "Sebaran Agribisnis/Pemanfaatan Lahan"],
  ["Fasilitas/ARENAOLAHRAGA_PT_50K", 0, "Sebaran Arena Olahraga"],
  ["Fasilitas/NIAGA_PT_50K", 0, "Sebaran Bangunan/Niaga"],
  ["Fasilitas/DESTINASIPARIWISATA_PT_50K", 0, "Sebaran Destinasi Pariwisata"],
  ["Fasilitas/LABORATORIUMKESEHATAN_PT_50K", 0, "Sebaran Laboratorium Uji Limbah"],
  ["Fasilitas/OLAHAIRMINUM_PT_50K", 0, "Sebaran WTP/Olah Air Minum"],
  ["Fasilitas/KELOLALIMBAH_PT_50K", 0, "Sebaran Pengelolaan Limbah"],
  ["Fasilitas/REKLAME_PT_50K", 0, "Sebaran Reklame"],
  ["Fasilitas/PERUMAHAN_PT_50K", 0, "Sebaran Rusun/Perumahan"],
  ["Fasilitas/MENARATELEPON_PT_50K", 0, "Sebaran Tower/Menara Telepon"],
  ["Fasilitas/WADUK_AR_50K", 0, "Sebaran Waduk"],
  ["Kawasan_Ekonomi_Khusus/INDUSTRI_AR_50K", 0, "Kawasan Industri"],
  ["Kawasan_Ekonomi_Khusus/KEK_AR_50K", 0, "Kawasan Ekonomi Khusus"],
  ["Pembangunan/JALAN_AR_50K", 0, "Aset BMN berupa Jalan"],
  ["Perencanaan/KONTUR_LN_50K", 0, "Kontur 1:50.000"],
  ["Perencanaan/RENCANAJALAN_LN_50K", 0, "Rencana Jalan 1:50.000"],
  ["Pertanahan/SUBWILAYAHPENGEMBANGAN_AR_50K", 0, "Sub Wilayah Pengembangan 1:50.000"],
  ["PETA_WILAYAH_KERJA_BP_BATAM", 0, "Wilayah Kerja BP Batam"],
  ["PETA_POLA_RUANG_PERPRES_87_TAHUN_2011", 0, "Pola Ruang Perpres 87/2011"],
  [
    "PROYGISPUSREN21_EKSTERNAL/PETA_ADMINISTRASI_BATAM",
    2,
    "Administrasi Kecamatan (Kota Batam)",
    "wadmkk='KOTA BATAM'",
  ],
];

const json = async (url, body) => {
  const init = body
    ? {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(body).toString(),
      }
    : {};
  const r = await ambil(url, { jedaMs: JEDA, init, batasMs: 180000 });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const j = await r.json();
  if (j.error) throw new Error(`ArcGIS ${j.error.code}: ${j.error.message}`);
  return j;
};

const manifest = [];
for (const [layanan, idLayer, judul, where = "1=1"] of LAYER) {
  const nama = `${layanan.replace(/\//g, "__")}__${idLayer}.geojson`;
  const berkas = `${DIR}/${nama}`;
  const url = `${BASIS}/${layanan}/MapServer/${idLayer}`;
  if (ada(berkas)) {
    manifest.push({ judul, layanan: url, status: "sudah_ada", berkas });
    continue;
  }
  try {
    const info = await json(`${url}?f=json`);
    const batch = Math.min(info.maxRecordCount ?? 1000, 1000);
    const { objectIds = [] } = await json(`${url}/query`, { where, returnIdsOnly: "true", f: "json" });
    const fitur = [];
    for (let i = 0; i < objectIds.length; i += batch) {
      const g = await json(`${url}/query`, {
        objectIds: objectIds.slice(i, i + batch).join(","),
        outFields: "*",
        outSR: "4326",
        geometryPrecision: "6",
        f: "geojson",
      });
      for (const f of g.features ?? []) {
        for (const k of Object.keys(f.properties ?? {})) if (KOLOM_BUANG.test(k)) delete f.properties[k];
        fitur.push(f);
      }
    }
    const isi = JSON.stringify({ type: "FeatureCollection", name: judul, features: fitur });
    manifest.push({
      judul,
      layanan: url,
      filter: where === "1=1" ? null : where,
      geometri: info.geometryType ?? null,
      jumlah_fitur: fitur.length,
      hak_cipta: info.copyrightText || null,
      status: fitur.length === objectIds.length ? "diunduh" : "tidak_lengkap",
      diakses: hariIni(),
      ...simpan(berkas, isi),
    });
    console.log(`${judul}: ${fitur.length} fitur`);
  } catch (e) {
    manifest.push({ judul, layanan: url, status: `galat ${e.message}` });
    console.log(`${judul}: galat ${e.message}`);
  }
}
simpan(`${DIR}/_manifest.json`, JSON.stringify(manifest, null, 1));
console.log("selesai", manifest.filter((m) => m.status === "diunduh").length, "dari", LAYER.length);
