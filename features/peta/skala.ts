// Hitungan skala peta: skala batang (km dan mil laut) dan rasio untuk kartusis.
// MapLibre memakai tile 512 px, jadi resolusi di zoom z adalah keliling bumi / (512 × 2^z).
const KELILING_BUMI_M = 40075016.686;
const CSS_PX_M = 0.0254 / 96;

export const METER_PER_KM = 1000;
export const METER_PER_MIL_LAUT = 1852;

export function meterPerPiksel(lintang: number, zoom: number): number {
  return (KELILING_BUMI_M * Math.cos((lintang * Math.PI) / 180)) / (512 * 2 ** zoom);
}

/** Angka bulat 1, 2, atau 5 × 10^n terbesar yang tidak melebihi `maks`. */
export function angkaBulat(maks: number): number {
  if (maks <= 0) return 0;
  const pangkat = 10 ** Math.floor(Math.log10(maks) + 1e-9);
  const sisa = maks / pangkat;
  const dasar = sisa >= 5 ? 5 : sisa >= 2 ? 2 : 1;
  return dasar * pangkat;
}

export type Batang = { nilai: number; px: number; segmen: number };

/** Batang terpanjang berangka bulat yang muat dalam `maksPx`. */
export function batang(mPerPx: number, maksPx: number, meterPerSatuan: number): Batang {
  const nilai = angkaBulat((maksPx * mPerPx) / meterPerSatuan);
  const dasar = Math.round(nilai / 10 ** Math.floor(Math.log10(nilai) + 1e-9));
  return { nilai, px: (nilai * meterPerSatuan) / mPerPx, segmen: dasar === 5 ? 5 : 2 };
}

/** Penyebut skala di layar (96 dpi), dibulatkan ke dua angka penting. Perkiraan, bukan skala cetak. */
export function penyebutSkala(mPerPx: number): number {
  const n = mPerPx / CSS_PX_M;
  const pangkat = 10 ** (Math.floor(Math.log10(n)) - 1);
  return Math.round(n / pangkat) * pangkat;
}

export const formatAngka = (n: number) => n.toLocaleString("id-ID", { maximumFractionDigits: 3 });
