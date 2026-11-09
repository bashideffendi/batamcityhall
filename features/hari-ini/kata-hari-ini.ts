// Kata Hari Ini di beranda: satu kata kamus per tanggal WIB, berganti tengah malam WIB. Modul murni, tanpa React.
import type { KataPublik } from "@/features/budaya/label";

const HARI_MS = 86_400_000;
const FORMAT_WIB = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Jakarta",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Tanggal "2026-11-09" menurut jam dinding WIB. */
export const tanggalWib = (now: Date) => FORMAT_WIB.format(now);

/** Indeks kata untuk satu tanggal: hari sejak 1 Januari 1970, berputar di seluruh kamus. */
export function indeksKata(tanggal: string, jumlah: number): number {
  const [y, m, d] = tanggal.split("-").map(Number);
  const hari = Math.floor(Date.UTC(y, m - 1, d) / HARI_MS);
  return ((hari % jumlah) + jumlah) % jumlah;
}

/** Yang dikirim ke peramban: hanya kolom yang tampil. */
export type KataRingkas = Pick<KataPublik, "id" | "kata" | "arti" | "contoh" | "labelRagam" | "belumDiperiksa" | "konteks">;

export const ringkasKata = (k: KataPublik): KataRingkas => ({
  id: k.id,
  kata: k.kata,
  arti: k.arti,
  contoh: k.contoh,
  labelRagam: k.labelRagam,
  belumDiperiksa: k.belumDiperiksa,
  konteks: k.konteks,
});
