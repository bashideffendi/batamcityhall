// Lapisan beranda di atas peta dasar: radar hujan dan pin tempat. Fungsi murni supaya bisa dites tanpa WebGL.
// Gaya utuh dibangun ulang tiap kali tema, pin, atau radar berubah; setStyle dengan diff hanya mengubah bedanya.
import type { ExpressionSpecification, LayerSpecification, StyleSpecification } from "maplibre-gl";
import { sudutCitra } from "@/features/langit-laut/lib/peta-lapisan";
import { RADAR_BOUNDS, radarCitra } from "@/features/langit-laut/lib/radar";
import { FONT, PALET, type MapTheme } from "./style";

/** Bentuk pin dari route /info/direktori/pin.json (features/direktori/data.ts). */
export type PinPeta = {
  id: string;
  nama: string;
  k: string;
  sl: string;
  lat: number;
  lng: number;
  perkiraan: boolean;
  lokasi: string;
  alamat: string | null;
  jam: string | null;
  lencana: { teks: string; nada?: "ok" | "caution" | "danger" | "info" }[];
  lain: { id: string; nama: string }[];
};

// Tombol legenda chart (research/00 bagian 9.2). Default hujan + landmark.
export const GRUP_PIN = [
  { id: "landmark", label: "Landmark", kategori: ["landmark", "khas_batam"] },
  { id: "kesehatan", label: "Kesehatan", kategori: ["kesehatan"] },
  {
    id: "layanan",
    label: "Pemerintahan & layanan",
    kategori: ["pemerintahan", "layanan_publik", "keamanan_darurat", "pertanahan_hukum", "pendidikan", "perpustakaan"],
  },
  { id: "transportasi", label: "Transportasi", kategori: ["transportasi"] },
  { id: "ibadah", label: "Ibadah & makam", kategori: ["ibadah", "pemakaman"] },
  {
    id: "wisata",
    label: "Ruang publik & wisata",
    kategori: ["ruang_publik", "wisata", "budaya", "kampung_tua", "olahraga", "lainnya"],
  },
  { id: "belanja", label: "Belanja & jasa", kategori: ["belanja", "jasa", "akomodasi"] },
  { id: "kuliner", label: "Kuliner", kategori: ["kuliner"] },
] as const;

export const GRUP_AWAL = ["landmark"];

export const grupDari = (kategori: string) =>
  GRUP_PIN.find((g) => (g.kategori as readonly string[]).includes(kategori))?.id ?? "wisata";

export const LAYER_KLIK_PIN = "lp-pin-klik";
export const LAYER_KLASTER = "lp-klaster";
export const SUMBER_PIN = "lp-pin";

/** Pin dipakai berulang: id dibawa ke properties untuk dicari saat diklik. */
export function pinKeGeoJson(pins: PinPeta[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: pins.map((p) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [p.lng, p.lat] },
      properties: { id: p.id, perkiraan: p.perkiraan },
    })),
  };
}

type Lapisan = { theme: MapTheme; pins: PinPeta[]; radarTs: string | null };

export function gayaBeranda(base: StyleSpecification, { theme, pins, radarTs }: Lapisan): StyleSpecification {
  const c = PALET[theme];
  const sources = { ...base.sources };
  const iLabel = base.layers.findIndex((l) => l.type === "symbol");
  const batas = iLabel === -1 ? base.layers.length : iLabel;
  const bawahLabel: LayerSpecification[] = [];

  if (radarTs) {
    sources["lp-radar"] = { type: "image", url: radarCitra(radarTs), coordinates: sudutCitra(RADAR_BOUNDS) };
    bawahLabel.push({
      id: "lp-radar",
      type: "raster",
      source: "lp-radar",
      paint: { "raster-opacity": 0.72, "raster-fade-duration": 0 },
    });
  }

  sources[SUMBER_PIN] = {
    type: "geojson",
    data: pinKeGeoJson(pins),
    cluster: true,
    clusterRadius: 36,
    clusterMaxZoom: 13,
  };
  const titik: ExpressionSpecification = ["!", ["has", "point_count"]];
  const atasLabel: LayerSpecification[] = [
    {
      id: LAYER_KLASTER,
      type: "circle",
      source: SUMBER_PIN,
      filter: ["has", "point_count"],
      paint: {
        "circle-color": c.land,
        "circle-stroke-color": c.ink,
        "circle-stroke-width": 1,
        "circle-radius": ["step", ["get", "point_count"], 12, 10, 15, 40, 19],
      },
    },
    {
      id: "lp-klaster-n",
      type: "symbol",
      source: SUMBER_PIN,
      filter: ["has", "point_count"],
      layout: {
        "text-field": ["get", "point_count_abbreviated"],
        "text-font": [FONT.poi],
        "text-size": 12,
        "text-allow-overlap": true,
      },
      paint: { "text-color": c.ink },
    },
    // Terverifikasi = bulat penuh, perkiraan = bulat kosong (research/05, prompt 4.2).
    {
      id: "lp-pin-pasti",
      type: "circle",
      source: SUMBER_PIN,
      filter: ["all", titik, ["==", ["get", "perkiraan"], false]],
      paint: {
        "circle-radius": 6,
        "circle-color": c.accent,
        "circle-stroke-color": c.land,
        "circle-stroke-width": 1.5,
      },
    },
    {
      id: "lp-pin-kira",
      type: "circle",
      source: SUMBER_PIN,
      filter: ["all", titik, ["==", ["get", "perkiraan"], true]],
      paint: {
        "circle-radius": 5.5,
        "circle-color": c.land,
        "circle-stroke-color": c.accent,
        "circle-stroke-width": 2,
      },
    },
    // Area sentuh tak terlihat: titik 12 px terlalu kecil untuk jari.
    {
      id: LAYER_KLIK_PIN,
      type: "circle",
      source: SUMBER_PIN,
      filter: titik,
      paint: { "circle-radius": 16, "circle-opacity": 0 },
    },
  ];

  return {
    ...base,
    sources,
    layers: [...base.layers.slice(0, batas), ...bawahLabel, ...base.layers.slice(batas), ...atasLabel],
  };
}
