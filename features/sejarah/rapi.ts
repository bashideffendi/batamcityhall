// Merapikan teks data yang tampil ke pembaca (pedoman 2.5, 2.6, dan 2.7). Hanya tanda baca dan penulisan bulan:
// isi kalimat tidak disentuh. Data mentah tetap apa adanya, jadi berkas ini dipanggil di lapisan tampilan.
import { bulanDekatAngka } from "@/lib/rapi-teks";

export function rapiTeks(teks: string): string {
  // Singkatan bulan hanya dibaca sebagai bulan bila menempel pada angka atau rentang (lib/rapi-teks.ts).
  return bulanDekatAngka(teks.replace(/\s+–\s+/g, "–").replace(/\s+—\s+/g, ", "))
    .replaceAll("–", "—")
    .replace(/\bs\.d\.\s*/g, "sampai ")
    .replace(/≈\s*/g, "sekitar ")
    .replace(/\bdll\./g, "dan lain-lain")
    .replace(/\bbeda versi\b/g, "berbeda versi")
    .replace(/"([^"]+)"/g, "“$1”");
}

export const rapiAtauKosong = (teks: string | null | undefined): string | null => (teks ? rapiTeks(teks) : null);
