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
export const BULAN_TIDAK_TETAP = "Bulan tidak tetap";

export const STATUS_ACARA = ["rutin", "pernah", "perlu dicek", "tidak pasti", "dibatalkan"] as const;
export type StatusAcara = (typeof STATUS_ACARA)[number];

export const LABEL_STATUS: Record<StatusAcara, { teks: string; nada: "ok" | "info" | "caution" | "danger" }> = {
  rutin: { teks: "Rutin", nada: "ok" },
  pernah: { teks: "Pernah digelar", nada: "info" },
  "perlu dicek": { teks: "Perlu dicek", nada: "caution" },
  "tidak pasti": { teks: "Tidak pasti", nada: "caution" },
  dibatalkan: { teks: "Dibatalkan", nada: "danger" },
};

export const KELOMPOK_ACARA = [
  { slug: "keagamaan", nama: "Keagamaan" },
  { slug: "melayu", nama: "Tradisi dan seni Melayu" },
  { slug: "komunitas", nama: "Budaya komunitas" },
  { slug: "kota", nama: "Agenda kota" },
  { slug: "olahraga", nama: "Olahraga dan laut" },
  { slug: "seni", nama: "Musik, kreatif, hiburan" },
  { slug: "pameran", nama: "Pameran dagang" },
] as const;
export type KelompokAcara = (typeof KELOMPOK_ACARA)[number]["slug"];

export const namaKelompokAcara = (slug: KelompokAcara) => KELOMPOK_ACARA.find((k) => k.slug === slug)?.nama ?? slug;

export type Tautan = { href: string; label: string };

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
  sumber: (Tautan & { sekunder: boolean }) | null;
  tempat: { id: string; nama: string }[];
};

export const KELOMPOK_KATA = [
  { slug: "kota", nama: "Istilah kota dan administrasi" },
  { slug: "laut", nama: "Laut dan pesisir" },
  { slug: "dialek", nama: "Dialek Melayu" },
  { slug: "serapan", nama: "Serapan Singapura, Malaysia, Hokkien" },
  { slug: "kerja", nama: "Dunia kerja industri" },
  { slug: "budaya", nama: "Budaya dan acara" },
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
  bersumber: boolean;
  labelSumber: string;
  konteks: string | null;
  sumber: Tautan | null;
};

/** Bulan sekarang (1-12) di zona WIB, apa pun zona waktu pembacanya. */
export function bulanWib(waktu: Date): number {
  return Number(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jakarta", month: "numeric" }).format(waktu));
}
