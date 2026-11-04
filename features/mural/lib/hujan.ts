// Hujan per kecamatan untuk overlay. Sumbernya /api/frames (radar MSS, dihitung per poligon di server).
import type { FramesResponse } from "@/features/langit-laut/lib/api-types";
import { kecLevel, type RainLevel } from "@/features/langit-laut/lib/kecamatan";
import { ageMinutesOf } from "@/features/langit-laut/lib/radar";
import { LIVE_MAX_AGE_MIN } from "@/features/langit-laut/lib/status";

export type KeadaanHujan =
  | { status: "tidak-tersedia"; alasan: string }
  | { status: "tersedia"; umurMenit: number; perKecamatan: Record<string, RainLevel> };

const TAK_ADA = "Data radar sedang tidak tersedia. Hujan tidak digambar, bukan berarti cerah.";

/** Jujur: data kosong, basi, atau gagal diurai tidak pernah dibaca sebagai "tidak hujan". */
export function keadaanHujan(frames: FramesResponse | null, gagal: boolean, sekarang: number): KeadaanHujan {
  if (gagal || !frames?.frames?.length) return { status: "tidak-tersedia", alasan: TAK_ADA };
  const umur = ageMinutesOf(frames.frames[frames.frames.length - 1].ts, sekarang);
  if (umur === null || umur > LIVE_MAX_AGE_MIN) {
    return { status: "tidak-tersedia", alasan: "Citra radar terakhir sudah lama. Hujan tidak digambar." };
  }
  if (!frames.echo || !Array.isArray(frames.echo.kec)) return { status: "tidak-tersedia", alasan: TAK_ADA };
  const perKecamatan: Record<string, RainLevel> = {};
  for (const k of frames.echo.kec) {
    const level = kecLevel(k);
    if (level) perKecamatan[k.name] = level;
  }
  return { status: "tersedia", umurMenit: umur, perKecamatan };
}

const LABEL: Record<RainLevel, string> = { ringan: "hujan ringan", sedang: "hujan sedang", lebat: "hujan lebat" };

export function teksHujan(k: KeadaanHujan, namaDiMural: string[]): string {
  if (k.status === "tidak-tersedia") return k.alasan;
  const kena = namaDiMural.filter((n) => k.perKecamatan[n]);
  const sumber = `Perkiraan radar MSS, ${k.umurMenit} menit lalu.`;
  if (!kena.length) return `Radar tidak melihat hujan di kecamatan bagian ini. ${sumber}`;
  return `${kena.map((n) => `${n}: ${LABEL[k.perKecamatan[n]]}`).join(". ")}. ${sumber}`;
}

const KEPADATAN: Record<RainLevel, number> = { ringan: 0.0004, sedang: 0.0008, lebat: 0.0014 };
export const BATAS_PARTIKEL_HP = 600;
export const BATAS_PARTIKEL_LEBAR = 1400;

/** Jumlah garis hujan: luas poligon di layar x intensitas, dengan batas keras. */
export function jumlahPartikel(luasLayarPx: number, level: RainLevel, batas: number): number {
  return Math.min(batas, Math.round(luasLayarPx * KEPADATAN[level]));
}
