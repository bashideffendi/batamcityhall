// Ombak di overlay mengikuti tinggi gelombang prakiraan resmi BMKG (/api/perairan).
import type { PerairanResponse } from "@/features/langit-laut/lib/api-types";
import { currentSlot } from "@/features/langit-laut/lib/perairan";

export type ParameterOmbak = { amplitudo: number; kecepatan: number; busa: boolean };
export type KeadaanOmbak =
  | { status: "tidak-tersedia"; alasan: string }
  | { status: "tersedia"; tinggiM: number; kategori: string; akanDatang: boolean; parameter: ParameterOmbak };

/** Hs < 0,5 m tenang (gerak 1 px, lambat); > 1,5 m ada busa (research/02). */
export function parameterOmbak(tinggiM: number): ParameterOmbak {
  if (tinggiM < 0.5) return { amplitudo: 1, kecepatan: 0.25, busa: false };
  const f = Math.min(1, (tinggiM - 0.5) / 1.5);
  return { amplitudo: 2 + f * 5, kecepatan: 0.5 + f * 1.1, busa: tinggiM > 1.5 };
}

const TAK_ADA = "Data gelombang sedang tidak tersedia. Ombak tidak digerakkan, bukan berarti laut tenang.";

export function keadaanOmbak(p: PerairanResponse | null, gagal: boolean, sekarang: number): KeadaanOmbak {
  if (gagal || !p) return { status: "tidak-tersedia", alasan: TAK_ADA };
  const { entry, upcoming } = currentSlot(p, sekarang);
  if (!entry || typeof entry.waveM !== "number") return { status: "tidak-tersedia", alasan: TAK_ADA };
  return {
    status: "tersedia",
    tinggiM: entry.waveM,
    kategori: entry.waveCat,
    akanDatang: upcoming,
    parameter: parameterOmbak(entry.waveM),
  };
}

const ANGKA = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 });

export function teksOmbak(k: KeadaanOmbak): string {
  if (k.status === "tidak-tersedia") return k.alasan;
  const kapan = k.akanDatang ? "jam berikutnya" : "jam ini";
  const kategori = k.kategori ? ` (${k.kategori})` : "";
  return `Prakiraan BMKG Perairan Kep. Batam ${kapan}: ${ANGKA.format(k.tinggiM)} m${kategori}. Bukan pengukuran langsung.`;
}
