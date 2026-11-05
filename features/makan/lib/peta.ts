// Lapisan Makan di atas peta dasar bersama. Fungsi murni supaya bisa dites tanpa WebGL.
//
// Semua sumber dan layer milik fitur ini berawalan "mk-". Saat tema berganti, peta dasar diganti lewat
// setStyle dengan diff, dan gabungGayaMakan menjaga lapisan "mk-" sekaligus mewarnainya ulang.
// Warna hanya dari PALET peta (token), tidak ada warna sendiri.
import type { ExpressionSpecification, LayerSpecification, StyleSpecification } from "maplibre-gl";
import { namaGambar, WARNA } from "@/features/peta/gambar-penanda";
import { jenisDari } from "@/features/peta/jenis-tempat";
import { FONT, PALET, type MapTheme } from "@/features/peta/style";
import type { Ferry, PlaceWithGeo } from "./types";

export const AWALAN = "mk-";

export const SUMBER = {
  pin: "mk-pin",
  pilih: "mk-pilih",
  feri: "mk-feri",
  saya: "mk-saya",
  jalur: "mk-jalur",
  jalurTitik: "mk-jalur-titik",
  mini: "mk-mini",
} as const;

export const LAYER_KLIK_PIN = "mk-pin-hit";

/** Di bawah zoom ini tempat tampil sebagai titik kecil, supaya sebarannya terlihat. */
export const ZOOM_IKON = 13;

/** Penanda gaya A: gambar dipilih lewat properti "ikon" (PEDOMAN 5.4). */
const ikonPin = {
  "icon-image": ["get", "ikon"] as ExpressionSpecification,
  "icon-allow-overlap": true,
  "icon-ignore-placement": true,
};

export function lapisanPin(tema: MapTheme): LayerSpecification[] {
  const c = PALET[tema];
  return [
    {
      id: "mk-pin-bulat",
      type: "circle",
      source: SUMBER.pin,
      maxzoom: ZOOM_IKON,
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 9, 3, 11, 4, ZOOM_IKON, 5.5],
        "circle-color": WARNA.makan,
        "circle-stroke-color": WARNA.putih,
        "circle-stroke-width": 0.75,
      },
    },
    {
      id: "mk-pin-titik",
      type: "symbol",
      source: SUMBER.pin,
      minzoom: ZOOM_IKON,
      layout: {
        ...ikonPin,
        "icon-size": ["interpolate", ["linear"], ["zoom"], ZOOM_IKON, 0.7, 15, 1],
      },
    },
    // Target sentuh tak terlihat: titik kecil terlalu sempit untuk jari.
    {
      id: LAYER_KLIK_PIN,
      type: "circle",
      source: SUMBER.pin,
      paint: { "circle-radius": 14, "circle-opacity": 0, "circle-stroke-width": 0 },
    },
    {
      id: "mk-pilih-titik",
      type: "circle",
      source: SUMBER.pilih,
      paint: { "circle-color": "rgba(0,0,0,0)", "circle-radius": 19, "circle-stroke-color": c.ink, "circle-stroke-width": 2.5 },
    },
    {
      id: "mk-pilih-ikon",
      type: "symbol",
      source: SUMBER.pilih,
      layout: ikonPin,
    },
  ];
}

export function lapisanFeri(): LayerSpecification[] {
  return [
    {
      id: "mk-feri-titik",
      type: "symbol",
      source: SUMBER.feri,
      layout: ikonPin,
    },
    {
      id: "mk-feri-label",
      type: "symbol",
      source: SUMBER.feri,
      layout: {
        "text-field": ["get", "label"],
        "text-font": [FONT.island],
        "text-size": 12.5,
        "text-anchor": "left",
        "text-offset": [1.5, 0],
        "text-optional": true,
      },
      paint: { "text-color": WARNA.tinta, "text-halo-color": WARNA.putih, "text-halo-width": 1.5 },
    },
  ];
}

export function lapisanSaya(tema: MapTheme): LayerSpecification[] {
  const c = PALET[tema];
  return [
    {
      id: "mk-saya-titik",
      type: "circle",
      source: SUMBER.saya,
      paint: {
        "circle-radius": 6,
        "circle-color": c.labelWater,
        "circle-stroke-color": c.land,
        "circle-stroke-width": 2,
      },
    },
  ];
}

export function lapisanJalur(tema: MapTheme): LayerSpecification[] {
  const c = PALET[tema];
  return [
    {
      id: "mk-jalur-garis",
      type: "line",
      source: SUMBER.jalur,
      layout: { "line-cap": "round" },
      paint: { "line-color": c.accent, "line-width": 1.5, "line-dasharray": [1, 3] },
    },
    {
      id: "mk-jalur-bulat",
      type: "circle",
      source: SUMBER.jalurTitik,
      paint: {
        "circle-radius": 11,
        "circle-color": c.land,
        "circle-stroke-color": c.accent,
        "circle-stroke-width": 1.75,
      },
    },
    {
      id: "mk-jalur-no",
      type: "symbol",
      source: SUMBER.jalurTitik,
      layout: {
        "text-field": ["get", "no"],
        "text-font": [FONT.poi],
        "text-size": 12,
        "text-allow-overlap": true,
      },
      paint: { "text-color": c.ink },
    },
  ];
}

/** Peta kecil: penanda kategori dan terminal feri terdekat bila masuk bingkai (PEDOMAN 5.2). */
export function lapisanMini(): LayerSpecification[] {
  return [
    {
      id: "mk-mini-titik",
      type: "symbol",
      source: SUMBER.mini,
      layout: ikonPin,
    },
    {
      id: "mk-mini-label",
      type: "symbol",
      source: SUMBER.mini,
      layout: {
        "text-field": ["get", "label"],
        "text-font": [FONT.island],
        "text-size": 12.5,
        "text-anchor": "left",
        "text-offset": [1.5, 0],
        "text-optional": true,
      },
      paint: { "text-color": WARNA.tinta, "text-halo-color": WARNA.putih, "text-halo-width": 1.5 },
    },
  ];
}

const semuaLapisan = (tema: MapTheme) => [
  ...lapisanPin(tema),
  ...lapisanFeri(),
  ...lapisanSaya(tema),
  ...lapisanJalur(tema),
  ...lapisanMini(),
];

/** transformStyle untuk setStyle: bawa sumber dan layer "mk-" ke gaya baru dengan warna tema baru. */
export function gabungGayaMakan(
  lama: StyleSpecification | undefined,
  baru: StyleSpecification,
  tema: MapTheme,
): StyleSpecification {
  if (!lama) return baru;
  const sources = { ...baru.sources };
  for (const [id, s] of Object.entries(lama.sources)) if (id.startsWith(AWALAN)) sources[id] = s;
  const spesifikasi = new Map(semuaLapisan(tema).map((l) => [l.id, l]));
  const milik = lama.layers.filter((l) => l.id.startsWith(AWALAN)).map((l) => spesifikasi.get(l.id) ?? l);
  return { ...baru, sources, layers: [...baru.layers, ...milik] };
}

type Fitur = GeoJSON.Feature<GeoJSON.Point, Record<string, string | number | boolean>>;
export type KoleksiTitik = GeoJSON.FeatureCollection<GeoJSON.Point, Record<string, string | number | boolean>>;

const titik = (lng: number, lat: number, properties: Fitur["properties"]): Fitur => ({
  type: "Feature",
  geometry: { type: "Point", coordinates: [lng, lat] },
  properties,
});

export const koleksi = (features: Fitur[]): KoleksiTitik => ({ type: "FeatureCollection", features });

/** Pin tempat. Properti `perkiraan` dari coord_approx: inilah yang membuat pinnya berongga. */
export const fiturTempat = (
  p: Pick<PlaceWithGeo, "id" | "lat" | "lng" | "coord_approx"> & { category?: string; name?: string },
) =>
  titik(p.lng, p.lat, {
    id: p.id,
    perkiraan: p.coord_approx,
    label: p.name ?? "",
    ikon: namaGambar(jenisDari("kuliner", p.category) ?? "nasi", WARNA.makan, p.coord_approx),
  });

/** Terminal berongga kalau koordinatnya belum terverifikasi di data situs. */
export const fiturFeri = (f: Ferry) =>
  titik(f.lng, f.lat, {
    id: f.id,
    label: f.label,
    ikon: namaGambar("feri", WARNA.transportasi, f.status_koordinat !== "terverifikasi"),
    perkiraan: f.status_koordinat !== "terverifikasi",
  });

export const fiturPerhentian = (p: Pick<PlaceWithGeo, "id" | "lat" | "lng">, i: number) =>
  titik(p.lng, p.lat, { id: p.id, no: String(i + 1) });

export const garisJalur = (stops: Pick<PlaceWithGeo, "lat" | "lng">[]): GeoJSON.Feature<GeoJSON.LineString> => ({
  type: "Feature",
  geometry: { type: "LineString", coordinates: stops.map((s) => [s.lng, s.lat]) },
  properties: {},
});

/** Kotak yang memuat semua titik, [[barat, selatan], [timur, utara]]. null kalau kosong. */
export function kotakTitik(ts: { lat: number; lng: number }[]): [[number, number], [number, number]] | null {
  if (ts.length === 0) return null;
  const lats = ts.map((t) => t.lat);
  const lngs = ts.map((t) => t.lng);
  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ];
}
