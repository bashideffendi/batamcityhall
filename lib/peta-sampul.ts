// Peta isometrik Barelang di sampul beranda dan Jelajahi Peta (proyek barelang-iso), tayang atas keputusan pemilik
// 11 Nov 2026 ("ditayangkan, gausah ngelarang ngelarang"). Ubin disimpan di Cloudflare Pages proyek barelang-peta
// (gratis, tanpa kartu), disiapkan tools/peta/ubin_publik.py. Peta masih sementara: versi baru tinggal ganti VERSI
// setelah folder versinya diunggah. Semua nilai bisa ditimpa env NEXT_PUBLIC_SAMPUL_* untuk uji lokal.
const ASAL = "https://barelang-peta.pages.dev";
const VERSI = "barelang-v2-20261110";

export const PETA_SAMPUL = {
  dzi: `${ASAL}/${VERSI}/barelang.dzi`,
  /** Tempat dari direktori Google Maps pemilik; piksel mengikuti kamera versi ini. */
  poi: `${ASAL}/${VERSI}/poi_wisata.json`,
  /** Data kota: kecamatan, perumahan, rusunawa, taman, Kebun Raya, waduk, puncak bukit, kawasan industri, mode malam. */
  kota: `${ASAL}/${VERSI}/lapisan_kota.json`,
  judul: "Barelang",
  /**
   * Area sampul dan tampilan awal Jelajahi: Batam, Rempang, dan Galang utuh (pemilik 11 Nov 2026: "jangan cuma batam
   * tapi juga rempang dan galang"), dalam piksel peta penuh x0,y0,x1,y1. Ditampilkan seperti object-fit: contain.
   */
  bingkai: "0,4096,253952,174080",
  /** Warna laut ubin, untuk latar di luar tepi gambar saat diperkecil penuh. */
  latar: "#668793",
};
