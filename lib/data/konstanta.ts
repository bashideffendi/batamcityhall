// Daftar tetap untuk data/. Terpisah dari schema.ts supaya komponen di peramban bisa memakainya tanpa ikut
// memuat zod.
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
] as const;

export const KATEGORI = [
  "pemerintahan",
  "layanan_publik",
  "keamanan_darurat",
  "kesehatan",
  "pendidikan",
  "perpustakaan",
  "ibadah",
  "pemakaman",
  "transportasi",
  "belanja",
  "ruang_publik",
  "wisata",
  "olahraga",
  "akomodasi",
  "jasa",
  "pertanahan_hukum",
  "landmark",
  "kampung_tua",
  "budaya",
  "khas_batam",
  "kuliner",
  "lainnya",
] as const;

export const STATUS_KOORDINAT = ["terverifikasi", "perlu_cek_ulang", "perlu_diisi_user"] as const;
export const STATUS_DATA = ["terverifikasi", "perlu_cek_ulang", "sumber_tunggal", "cerita_rakyat", "usang", "rencana"] as const;
