// Graticule chart laut: garis lintang-bujur, garis 1°N, dan strip koordinat di tepi peta.
// Fungsi murni supaya bisa dites tanpa WebGL. Satuan dalam menit busur agar kelipatan tidak geser
// karena pembulatan desimal.
import type { Feature, FeatureCollection, LineString } from "geojson";

export type Batas = { west: number; south: number; east: number; north: number };

function formatDerajat(deg: number, positif: string, negatif: string): string {
  const total = Math.round(Math.abs(deg) * 60);
  const d = Math.floor(total / 60);
  const m = String(total % 60).padStart(2, "0");
  return `${d}°${m}′ ${deg < 0 ? negatif : positif}`;
}

/** 1 → "1°00′ U". Arah memakai singkatan Indonesia (U/S). */
export const formatLintang = (deg: number) => formatDerajat(deg, "U", "S");
/** 104.05 → "104°03′ T". Arah memakai singkatan Indonesia (T/B). */
export const formatBujur = (deg: number) => formatDerajat(deg, "T", "B");

/** Semua kelipatan `langkah` menit di dalam [min, max], dalam derajat. */
export function kelipatanMenit(min: number, max: number, langkah: number): number[] {
  const eps = 1e-9;
  const awal = Math.ceil((min * 60) / langkah - eps);
  const akhir = Math.floor((max * 60) / langkah + eps);
  const out: number[] = [];
  for (let i = awal; i <= akhir; i++) out.push((i * langkah) / 60);
  return out;
}

const garis = (
  coordinates: LineString["coordinates"],
  sumbu: "lintang" | "bujur",
  nilai: number,
): Feature<LineString> => ({
  type: "Feature",
  properties: { sumbu, nilai },
  geometry: { type: "LineString", coordinates },
});

export function graticule(b: Batas, langkahMenit: number): FeatureCollection<LineString> {
  return {
    type: "FeatureCollection",
    features: [
      ...kelipatanMenit(b.south, b.north, langkahMenit).map((lat) =>
        garis(
          [
            [b.west, lat],
            [b.east, lat],
          ],
          "lintang",
          lat,
        ),
      ),
      ...kelipatanMenit(b.west, b.east, langkahMenit).map((lng) =>
        garis(
          [
            [lng, b.south],
            [lng, b.north],
          ],
          "bujur",
          lng,
        ),
      ),
    ],
  };
}

/** Garis 1°N. Satu garis penuh selebar peta, tempat label "1°00′ U" menempel. */
export function garisSatuUtara(b: Batas): FeatureCollection<LineString> {
  return {
    type: "FeatureCollection",
    features: [
      garis(
        [
          [b.west, 1],
          [b.east, 1],
        ],
        "lintang",
        1,
      ),
    ],
  };
}

const LANGKAH_STRIP = [1, 2, 5, 10, 15, 30, 60];
const LANGKAH_LABEL = [1, 2, 5, 10, 15, 30, 60];

/** Langkah terkecil yang masih memberi jarak minimal `minPx` di layar. */
export function pilihLangkah(pikselPerMenit: number, minPx: number, pilihan: number[]): number {
  return pilihan.find((l) => l * pikselPerMenit >= minPx) ?? pilihan[pilihan.length - 1];
}

export type Strip = { dari: number; ke: number; gelap: boolean };
export type Label = { posisi: number; teks: string };
export type Tepi = { strip: Strip[]; label: Label[] };

/**
 * Isi satu sisi bingkai: strip berselang gelap-terang dan label derajat-menit.
 * `proyeksi` mengubah derajat menjadi piksel di sumbu itu. Paritas dihitung dari kelipatan menit,
 * jadi warna strip tidak berkedip saat peta digeser.
 */
export function tepiSumbu(
  min: number,
  max: number,
  ukuranPx: number,
  proyeksi: (deg: number) => number,
  format: (deg: number) => string,
  minPxStrip = 8,
  minPxLabel = 72,
): Tepi {
  const rentangMenit = (max - min) * 60;
  if (rentangMenit <= 0 || ukuranPx <= 0) return { strip: [], label: [] };
  const pikselPerMenit = ukuranPx / rentangMenit;
  const langkahStrip = pilihLangkah(pikselPerMenit, minPxStrip, LANGKAH_STRIP);
  const langkahLabel = pilihLangkah(pikselPerMenit, minPxLabel, LANGKAH_LABEL);

  // Satu kelipatan tambahan di tiap ujung supaya strip menutup bingkai sampai sudut.
  const batasStrip = kelipatanMenit(min - langkahStrip / 60, max + langkahStrip / 60, langkahStrip);
  const strip: Strip[] = [];
  for (let i = 0; i < batasStrip.length - 1; i++) {
    const a = proyeksi(batasStrip[i]);
    const b = proyeksi(batasStrip[i + 1]);
    const urut = Math.round((batasStrip[i] * 60) / langkahStrip);
    strip.push({ dari: Math.min(a, b), ke: Math.max(a, b), gelap: Math.abs(urut) % 2 === 0 });
  }

  const label = kelipatanMenit(min, max, langkahLabel).map((deg) => ({ posisi: proyeksi(deg), teks: format(deg) }));
  return { strip, label };
}
