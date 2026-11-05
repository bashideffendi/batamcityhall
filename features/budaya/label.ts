// Label dan tipe yang dipakai bersama server dan browser. Berkas ini tidak mengimpor data apa pun,
// jadi aman diimpor komponen klien tanpa membawa file JSON mentah ke browser.

export const BULAN = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
] as const;

/** Judul kelompok untuk acara yang kolom `bulan`-nya kosong di data. */
export const BULAN_TIDAK_TETAP = "Bulan Tidak Tetap";

// Label kalender (pedoman 3.7). "perlu dicek" dan "tidak pasti" di data sama-sama tampil sebagai Belum pasti.
export const STATUS_ACARA = ["rutin", "pernah", "belum pasti", "dibatalkan"] as const;
export type StatusAcara = (typeof STATUS_ACARA)[number];

export const LABEL_STATUS: Record<StatusAcara, { teks: string; nada: "ok" | "info" | "caution" | "danger" }> = {
  rutin: { teks: "Rutin", nada: "ok" },
  pernah: { teks: "Pernah Diadakan", nada: "info" },
  "belum pasti": { teks: "Belum Pasti", nada: "caution" },
  dibatalkan: { teks: "Dibatalkan", nada: "danger" },
};

export const KELOMPOK_ACARA = [
  { slug: "keagamaan", nama: "Keagamaan" },
  { slug: "melayu", nama: "Tradisi dan Seni Melayu" },
  { slug: "komunitas", nama: "Budaya Komunitas" },
  { slug: "kota", nama: "Agenda Kota" },
  { slug: "olahraga", nama: "Olahraga dan Laut" },
  { slug: "seni", nama: "Musik, Kreatif, dan Hiburan" },
  { slug: "pameran", nama: "Pameran Dagang" },
] as const;
export type KelompokAcara = (typeof KELOMPOK_ACARA)[number]["slug"];

export const namaKelompokAcara = (slug: KelompokAcara) => KELOMPOK_ACARA.find((k) => k.slug === slug)?.nama ?? slug;

export type AcaraPublik = {
  id: string;
  nama: string;
  bulan: number | null;
  lokasi: string;
  penyelenggara: string;
  deskripsi: string | null;
  kelompok: KelompokAcara;
  status: StatusAcara;
  statusRinci: string | null;
  /** Aturan penanggalan: kalender Hijriah, Saka, Imlek. Bukan tanggal. */
  pola: string | null;
  tanggalTidakPasti: boolean;
  /** Tanggal per edisi, disalin apa adanya dari data. */
  edisi: { judul: string | null; tanggal: string; lokasi: string | null }[];
  catatan: string[];
  tempat: { id: string; nama: string }[];
};

export const KELOMPOK_KATA = [
  { slug: "kota", nama: "Istilah Kota dan Administrasi" },
  { slug: "laut", nama: "Laut dan Pesisir" },
  { slug: "dialek", nama: "Dialek Melayu" },
  { slug: "serapan", nama: "Serapan Singapura, Malaysia, dan Hokkien" },
  { slug: "kerja", nama: "Dunia Kerja Industri" },
  { slug: "budaya", nama: "Budaya dan Acara" },
] as const;
export type KelompokKata = (typeof KELOMPOK_KATA)[number]["slug"];

export const RAGAM_KATA = ["Melayu", "Bahasa Batam"] as const;
export type RagamKata = (typeof RAGAM_KATA)[number];

export type KataPublik = {
  id: string;
  kata: string;
  arti: string;
  contoh: string | null;
  asal: string;
  ragam: RagamKata;
  /** Label ragam di kartu: "Melayu Kepri" hanya bila data memang menulis begitu. */
  labelRagam: string;
  kelompok: KelompokKata;
  /** Entri yang belum diperiksa penutur, diberi tanda bintang (pedoman 3.7). */
  belumDiperiksa: boolean;
  konteks: string | null;
};

/** Bulan sekarang (1-12) di zona WIB, apa pun zona waktu pembacanya. */
export function bulanWib(waktu: Date): number {
  return Number(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jakarta", month: "numeric" }).format(waktu));
}
