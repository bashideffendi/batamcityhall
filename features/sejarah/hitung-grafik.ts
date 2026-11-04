// Hitungan grafik murni. Dua metode penduduk tidak pernah disambung jadi satu garis (brief 15).
import type { MetodePenduduk, TitikPenduduk } from "./data";

export const skalaLinear = (d0: number, d1: number, r0: number, r1: number) => (v: number) =>
  r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);

/** Metode yang boleh punya garis. Titik lepas (BP Batam 1965, skripsi 2012) berdiri sendiri. */
export const METODE_BERGARIS: MetodePenduduk[] = ["perkiraan_populer", "registrasi_disdukcapil", "proyeksi_bps"];

export function seriPenduduk(titik: TitikPenduduk[]) {
  return METODE_BERGARIS.map((metode) => ({
    metode,
    titik: titik.filter((t) => t.metode === metode).sort((a, b) => a.tahun - b.tahun),
  }));
}

export const titikLepas = (titik: TitikPenduduk[]) => titik.filter((t) => !METODE_BERGARIS.includes(t.metode));

/** Batang dengan ujung data membulat 4 px dan pangkal persegi. */
export function jalurBatang(x: number, y: number, w: number, h: number, r = 4) {
  if (w <= r) return `M${x} ${y}h${w}v${h}h${-w}z`;
  return `M${x} ${y}h${w - r}a${r} ${r} 0 0 1 ${r} ${r}v${h - r * 2}a${r} ${r} 0 0 1 ${-r} ${r}h${-(w - r)}z`;
}
