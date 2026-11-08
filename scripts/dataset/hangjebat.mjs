// Arsip layer HANG JEBAT Geoportal (Disperkimtan Kota Batam) yang TIDAK memuat data pribadi.
//   node scripts/dataset/hangjebat.mjs
// robots.txt mengizinkan semua. Datanya berkas GeoJSON statis di /assets/geojson/. Jeda 3,5 detik.
// SENGAJA tidak diambil (memuat NIK, KK, nama, alamat, atau kontak warga; riset 9 Nov 2026):
//   bnba-bkkbn/*, bnba-bkkbn-asn/*, Digitasi_Ruli, Ruli, Identifikasi_Bencana1, SHP_Rumah_Sewa_2-0,
//   Bencana2025 (memuat alamat), Delineasi_Kawasan_Ruli (sensitif sosial).
// Kolom yang menyerupai data pribadi atau foto tetap dibuang saat disimpan, sebagai pengaman kedua.
import { ada, ambil, hariIni, simpan } from "./sopan.mjs";

const BASIS = "https://www.hangjebat-geoportal.com/assets/geojson/";
const DIR = "hangjebat";
const KOLOM_BUANG =
  /^(foto|gambar|nik|no_?kk|kk|ktp|nama_?kk|kepala_?kel|istri|usia_istri|pemilik|no_?kontak|kontak|telp|hp|email|alamat)$/i;

const BERKAS = [
  ["Perumahan_Sekota_Batam.geojson", "Perumahan Sekota Batam"],
  ["Perumahan_Subsidi.json", "Perumahan Subsidi"],
  ["Rumah_Diatas_Air.geojson", "Rumah di Atas Air (per kampung)"],
  ["PSU_ST10.geojson", "Serah Terima PSU (Fasos, Lapangan, RTH)"],
  ["PSUSTX_28.geojson", "Permohonan PSU"],
  ["PSU_UTILITASS.geojson", "Jalan Lingkungan PSU"],
  ["PJU-0.json", "Penerangan Jalan Umum"],
  ["data-pju-2026-v2.geojson", "Penerangan Jalan Umum 2026"],
  ["Pemb_Jalan_polyline_v2.geojson", "Pembangunan Jalan Lingkungan"],
  ["Pemb_Drainase_polyline.geojson", "Pembangunan Drainase"],
  ["Pemb_Batumiring_polyline.geojson", "Pembangunan Batu Miring"],
  ["Pemb_GedungdanPemeliharaan_point.geojson", "Pembangunan Gedung Serbaguna"],
  ["lokasi_rusun.json", "Lokasi Rusunawa"],
  ["aset-perkimtan/BIDANG PERMUKIMAN-0.json", "Aset Disperkimtan Bidang Permukiman"],
  ["aset-perkimtan/BIDANG TAMAN-0.json", "Aset Disperkimtan Bidang Taman"],
  ["kebun-raya/ZONA_TANAMAN.geojson", "Kebun Raya Batam: Zona Tanaman"],
  ["kebun-raya/ZONA_CAMPURAN.geojson", "Kebun Raya Batam: Zona Campuran"],
  ["kebun-raya/SIRKULASI_JALAN.geojson", "Kebun Raya Batam: Sirkulasi Jalan"],
];

const manifest = [];
for (const [jalur, judul] of BERKAS) {
  const berkas = `${DIR}/${jalur.replace(/\//g, "__").replace(/\s+/g, "_")}`;
  const url = BASIS + jalur.split("/").map(encodeURIComponent).join("/");
  if (ada(berkas)) {
    manifest.push({ judul, url, status: "sudah_ada", berkas });
    continue;
  }
  const r = await ambil(url, { jedaMs: 3500, batasMs: 120000 }).catch(() => null);
  if (!r?.ok) {
    manifest.push({ judul, url, status: `http_${r?.status ?? "galat"}` });
    continue;
  }
  const d = await r.json().catch(() => null);
  if (!d?.features) {
    manifest.push({ judul, url, status: "bukan_geojson" });
    continue;
  }
  const dibuang = new Set();
  for (const f of d.features) {
    for (const k of Object.keys(f.properties ?? {})) {
      if (KOLOM_BUANG.test(k)) {
        delete f.properties[k];
        dibuang.add(k);
      }
    }
  }
  manifest.push({
    judul,
    url,
    jumlah_fitur: d.features.length,
    kolom_dibuang: [...dibuang],
    terakhir_diubah_sumber: r.headers.get("last-modified"),
    status: "diunduh",
    diakses: hariIni(),
    ...simpan(berkas, JSON.stringify(d)),
  });
  console.log(`${judul}: ${d.features.length} fitur${dibuang.size ? `, buang ${[...dibuang].join(", ")}` : ""}`);
}
simpan(`${DIR}/_manifest.json`, JSON.stringify(manifest, null, 1));
console.log("selesai", manifest.filter((m) => m.status === "diunduh").length, "dari", BERKAS.length);
