// Lapisan titik Batam Dulu di atas peta dasar. Fungsi murni supaya bisa dites tanpa WebGL.
import type { LayerSpecification, StyleSpecification } from "maplibre-gl";
import { FONT, PALET, type MapTheme } from "@/features/peta/style";
import type { Keadaan, TitikDulu } from "./dulu-slider";

export const SUMBER_DULU = "dulu-titik";
export const LAYER_KLIK_DULU = "dulu-klik";

export function titikKeGeoJson(titik: TitikDulu[], keadaan: Record<string, Keadaan>): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: titik.map((t) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [t.lng, t.lat] },
      properties: { pf: t.pf, nama: t.nama, perkiraan: t.perkiraan, aktif: keadaan[t.pf] === "dalam" },
    })),
  };
}

export function gayaDulu(
  base: StyleSpecification,
  theme: MapTheme,
  titik: TitikDulu[],
  keadaan: Record<string, Keadaan>,
  dipilih: string | null,
): StyleSpecification {
  const c = PALET[theme];
  const warna = ["case", ["get", "aktif"], c.accent, c.muted] as const;
  const tebal = ["case", ["==", ["get", "pf"], dipilih ?? ""], 3, 2] as const;
  const lapisan: LayerSpecification[] = [
    // Terverifikasi = bulat penuh, perkiraan = bulat kosong, sama seperti peta beranda.
    {
      id: "dulu-pasti",
      type: "circle",
      source: SUMBER_DULU,
      filter: ["==", ["get", "perkiraan"], false],
      paint: {
        "circle-radius": 7,
        "circle-color": warna as never,
        "circle-stroke-color": c.land,
        "circle-stroke-width": tebal as never,
      },
    },
    {
      id: "dulu-kira",
      type: "circle",
      source: SUMBER_DULU,
      filter: ["==", ["get", "perkiraan"], true],
      paint: {
        "circle-radius": 6.5,
        "circle-color": c.land,
        "circle-stroke-color": warna as never,
        "circle-stroke-width": tebal as never,
      },
    },
    {
      id: "dulu-label",
      type: "symbol",
      source: SUMBER_DULU,
      layout: {
        "text-field": ["get", "nama"],
        "text-font": [FONT.poi],
        "text-size": 12,
        "text-offset": [0, 1.1],
        "text-anchor": "top",
        "text-max-width": 10,
      },
      paint: { "text-color": c.ink, "text-halo-color": c.land, "text-halo-width": 1.5 },
    },
    // Area sentuh tak terlihat: titik kecil terlalu sulit untuk jari.
    {
      id: LAYER_KLIK_DULU,
      type: "circle",
      source: SUMBER_DULU,
      paint: { "circle-radius": 18, "circle-opacity": 0 },
    },
  ];
  return {
    ...base,
    sources: { ...base.sources, [SUMBER_DULU]: { type: "geojson", data: titikKeGeoJson(titik, keadaan) } },
    layers: [...base.layers, ...lapisan],
  };
}
