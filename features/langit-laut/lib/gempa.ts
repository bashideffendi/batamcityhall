// Penguraian data gempa BMKG dan aturan "bila relevan" untuk kotak Hari Ini. Fungsi murni: dipakai
// app/api/gempa/route.ts dan klien, bisa diuji tanpa jaringan.
//
// Sumber (dok: data.bmkg.go.id/gempabumi):
//  - autogempa.json       satu gempa terbaru, dengan Potensi, Dirasakan, dan Shakemap
//  - gempaterkini.json    15 gempa M 5,0 ke atas, dengan Potensi
//  - gempadirasakan.json  15 gempa dirasakan, dengan Dirasakan
// DateTime berformat ISO dalam UTC, Coordinates = "lintang,bujur". Teks BMKG disalin apa adanya.
import type { Gempa, GempaDaftar } from "./api-types";

type Raw = Record<string, unknown>;
const str = (v: unknown) => (v == null ? "" : String(v).trim());

/** Titik acuan jarak: titik label Kec. Batam Kota di kecamatan-geo.json (BIG), bukan angka resmi BMKG. */
export const TITIK_BATAM = { lat: 1.11887, lon: 104.0354 };

// Ambang "bila relevan". Pilihan situs ini, bukan angka BMKG; alasannya di docs/DATA_DECISIONS.md.
export const JAM_RELEVAN = 24;
export const JARAK_DEKAT_KM = 300;
export const JARAK_BESAR_KM = 1000;
export const MAGNITUDO_BESAR = 6;

/** Nama wilayah Kepri yang dicari di kolom Dirasakan. */
const DIRASAKAN_KEPRI =
  /\b(batam|tanjung ?pinang|tg\.? ?pinang|bintan|karimun|lingga|natuna|anambas|kepri|kepulauan riau|kep\.? riau)\b/i;

const ARAH = ["utara", "timur laut", "timur", "tenggara", "selatan", "barat daya", "barat", "barat laut"];

const angka = (s: string): number | null => {
  const m = /-?\d+(?:[.,]\d+)?/.exec(s);
  if (!m) return null;
  const n = Number(m[0].replace(",", "."));
  return Number.isFinite(n) ? n : null;
};

/** "1.14 LS" atau "120.15 BT" menjadi angka bertanda. */
function dariArah(s: string): number | null {
  const n = angka(s);
  if (n === null) return null;
  return /\b(LS|BB)\b/i.test(s) ? -Math.abs(n) : Math.abs(n);
}

function koordinat(d: Raw): { lat: number | null; lon: number | null } {
  const m = /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/.exec(str(d.Coordinates));
  const lat = m ? Number(m[1]) : dariArah(str(d.Lintang));
  const lon = m ? Number(m[2]) : dariArah(str(d.Bujur));
  const sah = lat !== null && lon !== null && Math.abs(lat) <= 90 && Math.abs(lon) <= 180;
  return sah ? { lat, lon } : { lat: null, lon: null };
}

/** Jarak lingkaran besar (km). */
export function jarakKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Arah mata angin dari titik a ke titik b. */
export function arahDari(a: { lat: number; lon: number }, b: { lat: number; lon: number }): string {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLon = rad(b.lon - a.lon);
  const y = Math.sin(dLon) * Math.cos(rad(b.lat));
  const x = Math.cos(rad(a.lat)) * Math.sin(rad(b.lat)) - Math.sin(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.cos(dLon);
  const derajat = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  return ARAH[Math.round(derajat / 45) % 8];
}

/**
 * Satu berkas BMKG menjadi daftar gempa. null = skema tidak dikenali, supaya pemanggil tahu berkasnya
 * bermasalah dan tidak mengira memang tidak ada gempa. Entri tanpa waktu yang sah dibuang.
 */
export function uraiGempa(raw: unknown, daftar: GempaDaftar): Gempa[] | null {
  const g = ((raw as Raw | null)?.Infogempa as Raw | undefined)?.gempa;
  if (g == null || typeof g !== "object") return null;
  const baris = (Array.isArray(g) ? g : [g]) as Raw[];
  const hasil: Gempa[] = [];
  for (const d of baris) {
    const ms = Date.parse(str(d.DateTime));
    if (Number.isNaN(ms)) continue;
    const { lat, lon } = koordinat(d);
    const dekat = lat !== null && lon !== null ? { lat, lon } : null;
    hasil.push({
      waktu: new Date(ms).toISOString(),
      tanggal: str(d.Tanggal),
      jam: str(d.Jam),
      lat,
      lon,
      magnitudo: angka(str(d.Magnitude)),
      kedalamanKm: angka(str(d.Kedalaman)),
      wilayah: str(d.Wilayah),
      potensi: str(d.Potensi),
      dirasakan: str(d.Dirasakan),
      shakemap: /^[\w.-]+\.jpg$/i.test(str(d.Shakemap)) ? str(d.Shakemap) : "",
      daftar: [daftar],
      jarakKm: dekat ? Math.round(jarakKm(TITIK_BATAM, dekat)) : null,
      arah: dekat ? arahDari(TITIK_BATAM, dekat) : "",
    });
  }
  return hasil;
}

/** Selisih waktu dan jarak yang masih dianggap gempa yang sama di dua berkas BMKG. */
const SAMA_MS = 60 * 1000;
const SAMA_KM = 50;

function sama(a: Gempa, b: Gempa): boolean {
  if (Math.abs(Date.parse(a.waktu) - Date.parse(b.waktu)) > SAMA_MS) return false;
  if (a.lat === null || a.lon === null || b.lat === null || b.lon === null) return a.waktu === b.waktu;
  return jarakKm({ lat: a.lat, lon: a.lon }, { lat: b.lat, lon: b.lon }) <= SAMA_KM;
}

/**
 * Gabungkan beberapa daftar, urut terbaru dulu. Gempa yang sama di dua berkas jadi satu; kolom kosong
 * diisi dari berkas lain. Daftar pertama paling diutamakan untuk kolom yang isinya berbeda.
 */
export function gabungGempa(daftar: Gempa[][]): Gempa[] {
  const hasil: Gempa[] = [];
  for (const g of daftar.flat()) {
    const ada = hasil.find((x) => sama(x, g));
    if (!ada) {
      hasil.push({ ...g, daftar: [...g.daftar] });
      continue;
    }
    ada.potensi ||= g.potensi;
    ada.dirasakan ||= g.dirasakan;
    ada.shakemap ||= g.shakemap;
    ada.wilayah ||= g.wilayah;
    ada.tanggal ||= g.tanggal;
    ada.jam ||= g.jam;
    ada.magnitudo ??= g.magnitudo;
    ada.kedalamanKm ??= g.kedalamanKm;
    ada.daftar = [...new Set([...ada.daftar, ...g.daftar])];
  }
  return hasil.sort((a, b) => Date.parse(b.waktu) - Date.parse(a.waktu));
}

/** BMKG menyebut potensi tsunami. Kalimat bernada menyangkal ("Tidak berpotensi tsunami") bukan. */
export function sebutTsunami(potensi: string): boolean {
  return /tsunami/i.test(potensi) && !/\b(tidak|tanpa|bukan)\b/i.test(potensi);
}

export type AlasanRelevan = "tsunami" | "dirasakan" | "dekat" | "besar";

/**
 * Kenapa gempa ini layak disebut di kotak Hari Ini. Kosong = tidak disebut. Hanya gempa dalam
 * JAM_RELEVAN terakhir. Ini soal apa yang disebut di beranda, bukan penilaian bahaya.
 */
export function alasanRelevan(g: Gempa, now: number): AlasanRelevan[] {
  const umur = now - Date.parse(g.waktu);
  if (Number.isNaN(umur) || umur > JAM_RELEVAN * 3600e3) return [];
  const a: AlasanRelevan[] = [];
  if (sebutTsunami(g.potensi)) a.push("tsunami");
  if (DIRASAKAN_KEPRI.test(g.dirasakan)) a.push("dirasakan");
  if (g.jarakKm !== null && g.jarakKm <= JARAK_DEKAT_KM) a.push("dekat");
  if (g.jarakKm !== null && g.magnitudo !== null && g.jarakKm <= JARAK_BESAR_KM && g.magnitudo >= MAGNITUDO_BESAR)
    a.push("besar");
  return a;
}

/** Gempa untuk kotak Hari Ini: yang menyebut tsunami lebih dulu, lalu yang terbaru. null = tidak ada. */
export function gempaRelevan(daftar: Gempa[] | undefined, now: number): Gempa | null {
  const kena = (daftar ?? [])
    .map((g) => ({ g, a: alasanRelevan(g, now) }))
    .filter((x) => x.a.length > 0)
    .sort(
      (x, y) =>
        Number(y.a.includes("tsunami")) - Number(x.a.includes("tsunami")) ||
        Date.parse(y.g.waktu) - Date.parse(x.g.waktu),
    );
  return kena[0]?.g ?? null;
}

export const teksMagnitudo = (m: number | null) =>
  m === null ? "Magnitudo belum tercatat" : `M ${m.toFixed(1).replace(".", ",")}`;

/** "±640 km barat laut Batam". Dibulatkan ke 10 km: pusat gempa sendiri perkiraan. */
export function teksLetak(g: Pick<Gempa, "jarakKm" | "arah">): string {
  if (g.jarakKm === null) return "";
  const km = Math.max(10, Math.round(g.jarakKm / 10) * 10).toLocaleString("id-ID");
  return `±${km} km ${g.arah} Batam`;
}

export function teksLalu(iso: string, now: number): string {
  const menit = Math.floor((now - Date.parse(iso)) / 60000);
  if (Number.isNaN(menit)) return "";
  if (menit < 1) return "baru saja";
  if (menit < 60) return `${menit} menit lalu`;
  const jam = Math.floor(menit / 60);
  if (jam < 24) return `${jam} jam lalu`;
  return `${Math.floor(jam / 24)} hari lalu`;
}

/** Isi baris Gempa di kotak Hari Ini. */
export function ringkasGempa(g: Gempa, now: number): { judul: string; rincian: string } {
  const letak = teksLetak(g);
  return {
    judul: [teksMagnitudo(g.magnitudo), letak].filter(Boolean).join(", "),
    rincian: [
      teksLalu(g.waktu, now),
      sebutTsunami(g.potensi) ? g.potensi : "",
      g.dirasakan ? `Dirasakan: ${g.dirasakan}` : "",
    ]
      .filter(Boolean)
      .join(". "),
  };
}
