// Merapikan teks data yang tampil ke pembaca (pedoman 2.5, 2.6, dan 2.7). Hanya tanda baca dan penulisan bulan:
// isi kalimat tidak disentuh. Data mentah tetap apa adanya, jadi berkas ini dipanggil di lapisan tampilan.
const BULAN: Record<string, string> = {
  Jan: "Januari",
  Feb: "Februari",
  Mar: "Maret",
  Apr: "April",
  Jun: "Juni",
  Jul: "Juli",
  Agu: "Agustus",
  Sep: "September",
  Okt: "Oktober",
  Nov: "November",
  Des: "Desember",
};

// Singkatan bulan hanya dibaca sebagai bulan bila menempel pada angka atau rentang, supaya nama orang tidak ikut.
const NAMA = Object.keys(BULAN).join("|");
const SINGKATAN = new RegExp(`(?<=\\d\\s|[–—])(${NAMA})\\b|\\b(${NAMA})\\b(?=\\s+\\d|[–—])`, "g");

export function rapiTeks(teks: string): string {
  return teks
    .replace(/\s+–\s+/g, "–")
    .replace(/\s+—\s+/g, ", ")
    .replace(SINGKATAN, (_, a?: string, b?: string) => BULAN[a ?? b ?? ""])
    .replaceAll("–", "—")
    .replace(/\bs\.d\.\s*/g, "sampai ")
    .replace(/≈\s*/g, "sekitar ")
    .replace(/\bdll\./g, "dan lain-lain")
    .replace(/\bbeda versi\b/g, "berbeda versi")
    .replace(/"([^"]+)"/g, "“$1”");
}

export const rapiAtauKosong = (teks: string | null | undefined): string | null => (teks ? rapiTeks(teks) : null);
