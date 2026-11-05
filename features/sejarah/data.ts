// Tampilan publik data/sejarah/*. Data mentah memuat catatan penyusun, jadi yang dikirim ke halaman hanya
// bentuk yang sudah disaring di sini. Keputusan tampilan yang mengubah status dicatat di docs/DATA_DECISIONS.md.
import garisWaktu from "@/data/sejarah/garis_waktu.json";
import dataPenduduk from "@/data/sejarah/data_penduduk.json";
import dataWisman from "@/data/sejarah/data_wisman.json";
import { rapiTeks } from "./rapi";

export type KunciStatus = "terverifikasi" | "perbedaan_versi" | "belum_terverifikasi" | "cerita_rakyat";
export type Sumber = { url: string; nama: string };

export const namaSumber = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};
export const keSumber = (urls: readonly string[] | null | undefined): Sumber[] =>
  (urls ?? []).map((url) => ({ url, nama: namaSumber(url) }));

export const LABEL_KATEGORI: Record<string, string> = {
  prasejarah: "Prasejarah",
  kartografi: "Peta lama",
  kesultanan: "Kesultanan",
  kolonial: "Kolonial",
  pendudukan_jepang: "Masa Jepang",
  kemerdekaan: "Awal kemerdekaan",
  otorita: "Otorita",
  kota: "Kehidupan kota",
  kemanusiaan: "Kemanusiaan",
  pemerintahan: "Pemerintahan",
  infrastruktur: "Infrastruktur",
  ekonomi: "Ekonomi",
  pariwisata: "Pariwisata",
};

// Entri hanya-tabel (gw-t01..t18) tidak punya kategori di data. Pengelompokan ini hanya untuk filter.
const KATEGORI_TABEL: Record<string, string> = {
  "gw-t01": "kesultanan",
  "gw-t02": "kesultanan",
  "gw-t03": "kesultanan",
  "gw-t04": "kesultanan",
  "gw-t05": "kolonial",
  "gw-t06": "pendudukan_jepang",
  "gw-t07": "kemerdekaan",
  "gw-t08": "kota",
  "gw-t09": "otorita",
  "gw-t10": "otorita",
  "gw-t11": "ekonomi",
  "gw-t12": "otorita",
  "gw-t13": "ekonomi",
  "gw-t14": "pemerintahan",
  "gw-t15": "ekonomi",
  "gw-t16": "ekonomi",
  "gw-t17": "kota",
  "gw-t18": "ekonomi",
};

export const DIPERBARUI_REMPANG = "5 November 2026";

// Prompt bagian 6: bertanggal, beratribusi, tanpa luas dan tanpa batas lahan. Sumber: research/03 dan 04.
export const TEKS_REMPANG =
  "Rempang Eco City ditetapkan sebagai proyek strategis nasional lewat Permenko Perekonomian 7/2023 pada 28 Agustus 2023. " +
  "Tempo mencatat Perpres 12/2025 (10 Februari 2025) tidak mencantumkannya di daftar 77 proyek strategis. " +
  "BP Batam (Maret 2025) menyatakan proyek itu masih ada di lampiran arah pembangunan kewilayahan. " +
  `Terakhir diperbarui ${DIPERBARUI_REMPANG}.`;

// Tokoh yang punya halaman di Siapa di Balik Nama Jalan. Yang lain tampil sebagai teks.
export const HALAMAN_TOKOH: Record<string, string> = {
  "Raja Isa (Nong Isa)": "nong_isa",
  "Temenggung Abdul Jamal": "temenggung_abdul_jamal",
  "Raja Ali Kelana": "raja_ali_kelana",
  "Ibnu Sutowo": "ibnu_sutowo",
  "B.J. Habibie": "bj_habibie",
};

type Ubahan = {
  tahun?: string;
  tanggal?: string;
  status?: KunciStatus;
  teks?: string;
};

const UBAHAN: Record<string, Ubahan> = {
  // Laporan 04 dan 16: tahun wafat diperdebatkan. Prompt/04 menang atas status di laporan 15.
  "gw-008": {
    tahun: "1831 (diperdebatkan)",
    status: "perbedaan_versi",
    teks:
      "Tahun wafat masih diperdebatkan. Dinas Kebudayaan Kepri menulis 1831, sedangkan catatan Belanda 1833 yang dikutip " +
      'Aswandi Syahri menyebut ia "berusia sekitar 50 tahun" pada 1833. Administrasi Nongsa berkembang mencakup seluruh ' +
      '"Batam Archipel". Letak makam Nong Isa sendiri tidak diketahui; yang ada adalah Kompleks Makam Zuriat.',
  },
  // Laporan 15 (Perigi Batu Pulau Buluh, sekitar 1898) dan 16 (Batu Aji, sekitar 1896): tampil keduanya.
  "gw-011": {
    status: "perbedaan_versi",
    teks:
      'Pabrik bata pertama di Batam oleh Raja Ali Kelana dan pengusaha Singapura Ong Sam Leong; bata bertuliskan "Batam Brick ' +
      'works" masih ada di Perigi Batu Pulau Buluh (cagar budaya). Disbudpar Kota Batam (2021) menyebut pabriknya di Batu Aji, ' +
      '"sekitar tahun 1896"; sumber lain menyebut 1901.',
  },
  // Status di data kosong: konteks umumnya tercatat, detail lokalnya belum. Satu label, jadi yang lebih hati-hati.
  "gw-t06": { status: "belum_terverifikasi" },
  "gw-t07": {
    teks: "Kepulauan Riau menjadi garis depan konfrontasi. Peran spesifik Pulau Batam belum tercatat.",
  },
  "gw-t16": {
    tahun: "28 Agustus 2023",
    tanggal: "2023-08-28",
    teks: TEKS_REMPANG,
  },
};

// Kalimat untuk penyusun yang ikut tersalin ke kolom penjelasan.
const saringPenyusun = (t: string) =>
  t
    .replace(/\s*Jangan tampilkan[^.]*\./g, "")
    .replace(/\s*Disebut singkat[^.]*\./g, "")
    .replace(/\s*\(dikutip sekunder\)/g, "")
    .replace(/ yang bisa dicek/g, "")
    .replaceAll(" — ", ", ")
    .trim();

/** Tahun untuk mengurutkan, dari teks seperti "Abad ke-15–16", "1970-an", atau "Semester I 2026". */
export function tahunUrut(tahun: string): number {
  const abad = tahun.match(/abad ke-(\d+)/i);
  if (abad) return (Number(abad[1]) - 1) * 100;
  const angka = tahun.match(/\d{3,4}/);
  return angka ? Number(angka[0]) : 0;
}

export type EntriGaris = {
  id: string;
  tahun: string;
  tanggal: string | null;
  judul: string;
  teks: string;
  tokoh: { nama: string; id: string | null }[];
  kategori: string;
  status: KunciStatus;
};

type Mentah = (typeof garisWaktu)[number];

function keEntri(e: Mentah): EntriGaris {
  const u = UBAHAN[e.id] ?? {};
  return {
    id: e.id,
    tahun: rapiTeks(u.tahun ?? e.tahun_tabel),
    tanggal: u.tanggal ?? e.tanggal,
    judul: rapiTeks(e.judul),
    teks: rapiTeks(u.teks ?? saringPenyusun(e.penjelasan)),
    tokoh: (e.tokoh ?? []).map((nama) => ({ nama, id: HALAMAN_TOKOH[nama] ?? null })),
    kategori: e.kategori ?? KATEGORI_TABEL[e.id] ?? "kota",
    status: u.status ?? (e.status_verifikasi as KunciStatus | null) ?? "belum_terverifikasi",
  };
}

// sort() stabil, jadi entri setahun tetap mengikuti urutan laporan.
export const GARIS_WAKTU: EntriGaris[] = garisWaktu
  .map((e, i) => ({ e, urut: tahunUrut(e.tahun), i }))
  .sort((a, b) => a.urut - b.urut || a.i - b.i)
  .map(({ e }) => keEntri(e));

export const JUMLAH_MENTAH = garisWaktu.length;

// ---------- Penduduk ----------

export type MetodePenduduk =
  "catatan_bp_batam" | "perkiraan_populer" | "dikutip_skripsi" | "registrasi_disdukcapil" | "proyeksi_bps";

export const LABEL_METODE: Record<MetodePenduduk, string> = {
  catatan_bp_batam: "Catatan BP Batam",
  perkiraan_populer: "Perkiraan, sumber populer",
  dikutip_skripsi: "Dikutip skripsi",
  registrasi_disdukcapil: "Registrasi Disdukcapil",
  proyeksi_bps: "Proyeksi BPS",
};

/** File data belum memuat metode (brief 15). Dibaca dari kolom catatan, baris yang tidak dikenal menggagalkan tes. */
export function metodePenduduk(catatan: string): MetodePenduduk {
  if (/Disdukcapil/.test(catatan)) return "registrasi_disdukcapil";
  if (/BPS/.test(catatan)) return "proyeksi_bps";
  if (/Sumber populer/.test(catatan)) return "perkiraan_populer";
  if (/BP Batam/.test(catatan)) return "catatan_bp_batam";
  if (/skripsi/.test(catatan)) return "dikutip_skripsi";
  throw new Error(`Metode penduduk tidak dikenal: ${catatan}`);
}

export type TitikPenduduk = {
  kunci: string;
  tahun: number;
  periode: string;
  jumlah: number;
  jumlahTeks: string;
  metode: MetodePenduduk;
  catatan: string | null;
};

// Catatan yang hanya mengulang label metode tidak perlu ditulis dua kali.
const CATATAN_ULANG = ["Sumber populer", "Dikutip skripsi", "Disdukcapil", "Disdukcapil (registrasi)"];

export const PENDUDUK: TitikPenduduk[] = dataPenduduk.map((b) => ({
  kunci: `${b.periode_tabel}-${b.jumlah}`,
  tahun: b.tahun,
  periode: b.periode_tabel,
  jumlah: b.jumlah,
  jumlahTeks: b.jumlah_tabel,
  metode: metodePenduduk(b.catatan),
  catatan: CATATAN_ULANG.includes(b.catatan) ? null : b.catatan,
}));

// ---------- Wisman ----------

export type TitikWisman = {
  tahun: number;
  jumlah: number | null;
  rentang: [number, number] | null;
  teks: string;
};

// Tahun 2023 tidak punya satu angka di file ini, hanya rentang antarsumber.
const RENTANG_WISMAN: Record<number, [number, number]> = { 2023: [1_100_000, 1_190_000] };

export const WISMAN: TitikWisman[] = dataWisman.map((b) => ({
  tahun: b.tahun,
  jumlah: b.jumlah,
  rentang: b.jumlah == null ? (RENTANG_WISMAN[b.tahun] ?? null) : null,
  teks: rapiTeks(b.kunjungan_tabel).replace("beda sumber", "berbeda sumber"),
}));
