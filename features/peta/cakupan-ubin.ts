// ---------------------------------------------------------------------------
// Kamera peta cuaca tidak boleh melihat tempat yang ubin peta dasarnya tidak ada. batam.pmtiles hanya memuat
// ubin yang menyentuh tiga kotak bertingkat (wilayah-ubin.json), jadi di luar kotak itu daratan berhenti
// sebagai garis lurus. Contoh: diperkecil jauh dari tampilan Luas, Kalimantan terpotong di 112,5 BT.
//
// MapLibre memakai ubin zoom floor(zoom) untuk sumber vektor 512 px. Batas di sini mengikuti cakupan ubin
// zoom itu:
//  - layar lebih besar dari cakupan → perbesar sampai muat;
//  - di atas zoom wilayah Luas (ubin hanya ada di Kepri atau Fokus) dan layar keluar cakupan → kecilkan
//    satu tingkat, jadi memperbesar Natuna berhenti di zoom tertinggi yang ubinnya ada;
//  - selain itu pusat peta digeser masuk, seperti maxBounds.
// ---------------------------------------------------------------------------
import data from "./wilayah-ubin.json";

type Wilayah = { nama: string; w: number; s: number; e: number; n: number; maxzoom: number };
type Kotak = { x0: number; x1: number; y0: number; y1: number };

const WILAYAH: Wilayah[] = data.wilayah;
const UBIN_PX = 512;
/** Di atas zoom ini ubin diperbesar dari zoom ini (overzoom), cakupannya sama. */
const ZOOM_UBIN_MAKS = Math.max(...WILAYAH.map((w) => w.maxzoom));
/** Zoom tertinggi wilayah paling luas: di atasnya peta dikecilkan, bukan digeser. */
const ZOOM_WILAYAH_LUAS = Math.min(...WILAYAH.map((w) => w.maxzoom));

/** Bujur → x Mercator 0..1. */
export const keX = (lng: number) => (lng + 180) / 360;
/** Lintang → y Mercator 0..1 (0 di utara). */
export const keY = (lat: number) => {
  const r = (lat * Math.PI) / 180;
  return (1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2;
};
const keLng = (x: number) => x * 360 - 180;
const keLat = (y: number) => (Math.atan(Math.sinh(Math.PI * (1 - 2 * y))) * 180) / Math.PI;

/**
 * Kotak ubin (0..1) yang tersedia di zoom ubin `tz`: gabungan ubin wilayah yang maxzoom-nya mencapai `tz`.
 * Wilayahnya bersarang (fokus di dalam kepri di dalam luas), jadi gabungannya cukup kotak terluar.
 */
export function cakupanUbin(tz: number): Kotak | null {
  const n = 2 ** tz;
  let hasil: Kotak | null = null;
  for (const w of WILAYAH) {
    if (w.maxzoom < tz) continue;
    const k = {
      x0: Math.floor(keX(w.w) * n) / n,
      x1: (Math.floor(keX(w.e) * n) + 1) / n,
      y0: Math.floor(keY(w.n) * n) / n,
      y1: (Math.floor(keY(w.s) * n) + 1) / n,
    };
    if (!hasil || (k.x1 - k.x0) * (k.y1 - k.y0) > (hasil.x1 - hasil.x0) * (hasil.y1 - hasil.y0)) hasil = k;
  }
  return hasil;
}

const jepit = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);

/** Kamera (pusat, zoom) untuk layar `lebar` × `tinggi` px yang hanya melihat ubin yang ada. */
export function batasiKamera(lng: number, lat: number, zoom: number, lebar: number, tinggi: number) {
  let z = zoom;
  let x = keX(lng);
  let y = keY(lat);
  for (let i = 0; i < 40; i++) {
    const tz = jepit(Math.floor(z), 0, ZOOM_UBIN_MAKS);
    const k = cakupanUbin(tz);
    if (!k) {
      z = tz - 1e-6;
      continue;
    }
    const dunia = UBIN_PX * 2 ** z;
    const hw = lebar / 2 / dunia;
    const hh = tinggi / 2 / dunia;
    if (2 * hw > k.x1 - k.x0 || 2 * hh > k.y1 - k.y0) {
      // Layar lebih besar dari cakupan: perbesar sampai muat, lalu periksa lagi di zoom ubin barunya.
      const zMuat = Math.log2(Math.max(lebar / (k.x1 - k.x0), tinggi / (k.y1 - k.y0)) / UBIN_PX) + 1e-9;
      if (zMuat <= z) break; // tidak mungkin terjadi, pengaman putaran
      z = zMuat;
      continue;
    }
    const masuk = x - hw >= k.x0 && x + hw <= k.x1 && y - hh >= k.y0 && y + hh <= k.y1;
    if (masuk) break;
    if (tz > ZOOM_WILAYAH_LUAS) {
      z = tz - 1e-6; // ubin zoom ini tidak ada di sini: kembali ke zoom ubin di bawahnya
      continue;
    }
    x = jepit(x, k.x0 + hw, k.x1 - hw);
    y = jepit(y, k.y0 + hh, k.y1 - hh);
    break;
  }
  return { lng: keLng(x), lat: keLat(y), zoom: z };
}
