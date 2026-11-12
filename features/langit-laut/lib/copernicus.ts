// ---------------------------------------------------------------------------
// Peta gelombang Copernicus Marine: pilihan kedua di samping OFS BMKG (keputusan pemilik 12 Nov 2026).
//
// Ubin WMTS diminta dalam skala abu-abu 0 sampai 7 m (CMEMS_GAYA). Protokol "cmems://" membaca warna tiap
// piksel, membaliknya menjadi meter memakai tabel warna dari GetLegend, lalu mewarnainya dengan pita warna
// resmi BMKG (OFS_SWH_COLORS). Jadi legenda dan kategori di panel berlaku sama untuk kedua sumber.
// ---------------------------------------------------------------------------
import type { OfsResponse } from "./api-types";
import { OFS_MAX_M, OFS_SWH_COLORS } from "./radar";

export type SumberGelombang = "bmkg" | "copernicus";
export const SUMBER_GELOMBANG: { kunci: SumberGelombang; label: string }[] = [
  { kunci: "bmkg", label: "BMKG" },
  { kunci: "copernicus", label: "Copernicus" },
];

const LANGKAH_MS = 3 * 3600 * 1000;
/** Mulai 12 jam ke belakang supaya penggeser punya sedikit riwayat, seperti run BMKG. */
const MUNDUR_MS = 12 * 3600 * 1000;
const RENTANG_MS = 72 * 3600 * 1000;

function fmt(ms: number): string {
  const d = new Date(ms);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}${p(d.getUTCHours())}${p(d.getUTCMinutes())}`;
}

/** "202611120300" (UTC) → "2026-11-12T03:00:00Z". */
export function keIso(valid: string): string {
  return `${valid.slice(0, 4)}-${valid.slice(4, 6)}-${valid.slice(6, 8)}T${valid.slice(8, 10)}:${valid.slice(10, 12)}:00Z`;
}

/**
 * Daftar waktu Copernicus: prakiraan per 3 jam (00, 03, ... UTC) tersedia sampai sekitar 9 hari ke depan,
 * jadi cukup dihitung dari jam sekarang, tanpa bertanya ke server. Bentuknya sama dengan jawaban /api/ofs-frame.
 */
export function framesCopernicus(now = Date.now()): OfsResponse {
  const awal = Math.floor(now / LANGKAH_MS) * LANGKAH_MS - MUNDUR_MS;
  const frames: string[] = [];
  let nowIndex = 0;
  let terdekat = Infinity;
  for (let t = awal, i = 0; t <= awal + RENTANG_MS; t += LANGKAH_MS, i++) {
    frames.push(fmt(t));
    if (Math.abs(t - now) < terdekat) {
      terdekat = Math.abs(t - now);
      nowIndex = i;
    }
  }
  return { baserun: frames[0], frames, nowIndex, fallback: false, source: "copernicus", ageH: 0, expired: false };
}

export const urlUbinCopernicus = (valid: string) => `cmems://{z}/{x}/{y}/${valid}`;

/** Warna pita BMKG untuk tinggi `m` meter: pita terakhir yang batas bawahnya tidak melebihi `m`. */
export function warnaPita(m: number): [number, number, number] {
  let c = OFS_SWH_COLORS[0].c;
  for (const s of OFS_SWH_COLORS) if (m >= s.m) c = s.c;
  return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
}

/**
 * Tabel nilai merah (0 sampai 255) → tinggi gelombang (m), dari tabel warna legenda Copernicus. Nilai merah di
 * skala abu-abu cmocean naik terus, jadi tiap nilai merah menunjuk ke rata-rata indeks yang memakainya;
 * nilai merah yang tidak muncul memakai nilai tetangga terdekat di bawahnya.
 */
export function tabelNilai(colorMap: number[][], maks = OFS_MAX_M): Float32Array {
  const n = colorMap.length;
  const jumlah = new Float64Array(256);
  const banyak = new Uint16Array(256);
  colorMap.forEach((rgb, i) => {
    const r = rgb[0] | 0;
    if (r < 0 || r > 255) return;
    jumlah[r] += i;
    banyak[r]++;
  });
  const nilai = new Float32Array(256);
  let indeks = 0;
  for (let r = 0; r < 256; r++) {
    if (banyak[r]) indeks = jumlah[r] / banyak[r];
    nilai[r] = (indeks / (n - 1)) * maks;
  }
  return nilai;
}

/** Warna pita BMKG per 1 cm, 0 sampai `maks` meter: indeks = round(m × 100). */
export function tabelPita(maks = OFS_MAX_M): Uint8Array {
  const n = Math.round(maks * 100) + 1;
  const lut = new Uint8Array(n * 3);
  for (let i = 0; i < n; i++) lut.set(warnaPita(i / 100), i * 3);
  return lut;
}

/** Lebar satu sel kisi model (1/12 derajat) dalam piksel ubin 256 px di zoom `z`. */
export const lebarSelPx = (z: number) => (256 * 2 ** z) / (360 * 12);

/**
 * Menghaluskan nilai sel kisi yang digambar kotak-kotak oleh WMTS: dua kali rata-rata kotak selebar satu sel
 * (setara interpolasi bilinear antar pusat sel), hanya dari piksel yang punya data. Piksel tanpa data yang
 * berjarak kurang dari satu sel dari laut ikut terisi, sehingga laut sempit di antara pulau tidak bolong.
 * `nilai` dan `bobot` (1 = ada data) diubah langsung.
 */
export function haluskan(nilai: Float32Array, bobot: Float32Array, lebar: number, tinggi: number, jari: number) {
  if (jari < 1) return;
  const tmpN = new Float32Array(nilai.length);
  const tmpB = new Float32Array(bobot.length);
  const kotak = (dariN: Float32Array, dariB: Float32Array, keN: Float32Array, keB: Float32Array, horizontal: boolean) => {
    const panjang = horizontal ? lebar : tinggi;
    const garis = horizontal ? tinggi : lebar;
    for (let g = 0; g < garis; g++) {
      const idx = (t: number) => (horizontal ? g * lebar + t : t * lebar + g);
      let sN = 0;
      let sB = 0;
      for (let t = -jari; t <= jari; t++) {
        if (t < 0 || t >= panjang) continue;
        sN += dariN[idx(t)];
        sB += dariB[idx(t)];
      }
      for (let t = 0; t < panjang; t++) {
        keN[idx(t)] = sN;
        keB[idx(t)] = sB;
        const keluar = t - jari;
        const masuk = t + jari + 1;
        if (keluar >= 0) {
          sN -= dariN[idx(keluar)];
          sB -= dariB[idx(keluar)];
        }
        if (masuk < panjang) {
          sN += dariN[idx(masuk)];
          sB += dariB[idx(masuk)];
        }
      }
    }
  };
  // nilai disimpan sebagai nilai × bobot supaya rata-ratanya hanya dari piksel berdata
  for (let i = 0; i < nilai.length; i++) nilai[i] *= bobot[i];
  for (let ulang = 0; ulang < 2; ulang++) {
    kotak(nilai, bobot, tmpN, tmpB, true);
    kotak(tmpN, tmpB, nilai, bobot, false);
  }
  const luas = (2 * jari + 1) ** 4;
  for (let i = 0; i < nilai.length; i++) {
    const b = bobot[i];
    nilai[i] = b > 0 ? nilai[i] / b : 0;
    bobot[i] = b / luas;
  }
}
