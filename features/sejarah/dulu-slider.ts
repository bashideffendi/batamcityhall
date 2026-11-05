// Logika slider murni, tanpa data mentah, supaya aman dibawa ke klien dan mudah dites.
import type { KunciStatus } from "./data";

export type KartuDulu = {
  id: string;
  lokasi: string;
  dulu: string;
  sekarang: string;
  tahunKunci: string;
  status: KunciStatus;
  mulai: number;
  selesai: number;
  versi: string | null;
  catatan: string | null;
};

export type TitikDulu = { pf: string; id: string; nama: string; lat: number; lng: number; perkiraan: boolean };

export type Keadaan = "sebelum" | "dalam" | "sesudah";

export const keadaanPada = (k: Pick<KartuDulu, "mulai" | "selesai">, tahun: number): Keadaan =>
  tahun < k.mulai ? "sebelum" : tahun > k.selesai ? "sesudah" : "dalam";

export const LABEL_KEADAAN: Record<Keadaan, string> = {
  sebelum: "Belum sampai rentang ini",
  dalam: "Sedang berlangsung",
  sesudah: "Sudah lewat",
};

/** Perhentian slider: tiap tahun yang benar-benar tercatat, ditambah tahun kini. Skala tahun penuh akan kosong 1847-1945. */
export function perhentian(kartu: Pick<KartuDulu, "mulai" | "selesai">[], kini: number): number[] {
  return [...new Set([...kartu.flatMap((k) => [k.mulai, k.selesai]), kini])].sort((a, b) => a - b);
}
