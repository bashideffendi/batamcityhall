// Satu sumber nama bulan dan hari, dan fungsi kecil perapian teks data (PEDOMAN 2.6): jam bertitik, bulan ditulis
// lengkap, tanggal "5 November 2026". Sampai 16 Nov 2026 tabel bulan ditulis ulang di sepuluh berkas dan aturannya
// mulai berbeda antarbagian. Berkas ini tidak mengimpor data apa pun, jadi aman dipakai server maupun browser.
//
// Yang ada di sini hanya kepingan yang dipakai bersama. Aturan khas tiap bagian (catatan penyusun Direktori, istilah
// jadwal feri, tanda kutip Sejarah) tetap di bagiannya dan menyusun kepingan ini.

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

export const BULAN_SINGKAT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"] as const;

/** Urutan sama dengan Date.getUTCDay(): 0 = Minggu. */
export const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"] as const;
export const HARI_SINGKAT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"] as const;

/** Singkatan bulan di data menjadi nama lengkap. "Agt" adalah ejaan lain Agustus yang muncul di data mentah. */
const BULAN_DARI_SINGKATAN: Record<string, string> = {
  ...Object.fromEntries(BULAN_SINGKAT.map((s, i) => [s, BULAN[i]])),
  Agt: "Agustus",
};
const HARI_DARI_SINGKATAN: Record<string, string> = Object.fromEntries(HARI_SINGKAT.map((s, i) => [s, HARI[i]]));

/** Alternasi untuk dirangkai ke dalam regex pemakai. */
export const POLA_BULAN_SINGKAT = Object.keys(BULAN_DARI_SINGKATAN).join("|");
export const POLA_HARI_SINGKAT = "Sen|Sel|Rab|Kam|Jum|Sab|Min";
export const POLA_HARI = "Senin|Selasa|Rabu|Kamis|Jumat|Sabtu|Minggu";

/** "Sep" menjadi "September". Yang bukan singkatan bulan dikembalikan apa adanya. */
export const bulanLengkap = (singkat: string): string => BULAN_DARI_SINGKATAN[singkat] ?? singkat;

/** "Sen", "sen", atau "SEN" menjadi "Senin". Yang bukan singkatan hari dikembalikan apa adanya. */
export const hariLengkap = (singkat: string): string =>
  HARI_DARI_SINGKATAN[singkat.slice(0, 1).toUpperCase() + singkat.slice(1).toLowerCase()] ?? singkat;

/** Jam bertitik (PEDOMAN 2.6): "08:00" menjadi "08.00". */
export const jamBertitik = (teks: string): string => teks.replace(/\b(\d{1,2}):(\d{2})\b/g, "$1.$2");

// Singkatan bulan hanya dibaca sebagai bulan bila menempel pada angka atau rentang ("12 Sep", "Sep 2026", "Jan—Mar"),
// supaya nama orang seperti Jan atau Mar tidak ikut berubah.
const BULAN_DEKAT_ANGKA = new RegExp(
  `(?<=\\d\\s|[–—])(${POLA_BULAN_SINGKAT})\\b|\\b(${POLA_BULAN_SINGKAT})\\b(?=\\s+\\d|[–—])`,
  "g",
);

/** Singkatan bulan yang menempel pada angka atau rentang ditulis lengkap: "30 Apr 2017" menjadi "30 April 2017". */
export const bulanDekatAngka = (teks: string): string =>
  teks.replace(BULAN_DEKAT_ANGKA, (_, a?: string, b?: string) => bulanLengkap(a ?? b ?? ""));

/**
 * Tanggal dari angkanya (PEDOMAN 2.6: tanpa nol di depan, bulan lengkap): (2026, 11, 5) menjadi "5 November 2026",
 * tanpa hari menjadi "November 2026". Bulan di luar 1 sampai 12 ditulis kosong.
 */
export function tulisTanggal(tahun: number | string, bulan: number, hari?: number): string {
  return [hari || "", BULAN[bulan - 1] ?? "", tahun].filter((v) => v !== "").join(" ");
}

/** "2026-11-04" menjadi "4 November 2026". Selain bentuk itu dikembalikan apa adanya. */
export function tanggalIndonesia(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? tulisTanggal(m[1], +m[2], +m[3]) : iso;
}
