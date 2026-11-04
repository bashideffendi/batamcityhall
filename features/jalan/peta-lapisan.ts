// Lapisan peta Loket 04. Fungsi murni supaya bisa dites tanpa WebGL.
// Berongga = lokasi perkiraan, penuh = terverifikasi (prompt 4.2). Tidak ada garis rute kecuali dari loader.
import type { LayerSpecification, StyleSpecification } from "maplibre-gl";
import { FONT, PALET, type MapTheme } from "@/features/peta/style";
import type { KoleksiRute } from "./rute-geo";
import type { TitikJalan } from "./trans-data";

export const SUMBER_TITIK = "jl-titik";
export const SUMBER_RUTE = "jl-rute";
export const LAYER_KLIK = "jl-titik-klik";

export function titikKeGeoJson(titik: TitikJalan[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: titik.map((t) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [t.lng, t.lat] },
      properties: { id: t.id, nama: t.nama, jenis: t.jenis, perkiraan: t.perkiraan },
    })),
  };
}

/** Lapisan dari OSM, terpisah dari data kurasi (prompt bagian 5 butir 4). */
export type LapisanOsm = { feri: GeoJSON.FeatureCollection; halte: GeoJSON.FeatureCollection };
const ATRIBUSI_OSM = "© OpenStreetMap contributors, ODbL";

export function gayaJalan(
  base: StyleSpecification,
  {
    theme,
    titik,
    rute,
    osm,
  }: {
    theme: MapTheme;
    titik: TitikJalan[];
    rute: KoleksiRute;
    osm?: { feri?: LapisanOsm["feri"]; halte?: LapisanOsm["halte"] };
  },
): StyleSpecification {
  const c = PALET[theme];
  const sources: StyleSpecification["sources"] = {
    ...base.sources,
    [SUMBER_TITIK]: { type: "geojson", data: titikKeGeoJson(titik) },
  };
  const garis: LayerSpecification[] = [];
  if (rute.features.length) {
    sources[SUMBER_RUTE] = { type: "geojson", data: rute };
    garis.push({
      id: "jl-rute-garis",
      type: "line",
      source: SUMBER_RUTE,
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-color": ["get", "warna"],
        "line-width": 3,
        // Ruas berimpit digambar sejajar, tidak ditumpuk (brief 10).
        "line-offset": ["coalesce", ["get", "offset"], 0],
      },
    });
  }
  if (osm?.feri) {
    sources["jl-osm-feri"] = { type: "geojson", data: osm.feri, attribution: ATRIBUSI_OSM };
    garis.unshift({
      id: "jl-osm-feri",
      type: "line",
      source: "jl-osm-feri",
      paint: { "line-color": c.ferry, "line-width": 1.25, "line-dasharray": [4, 3] },
    });
  }
  if (osm?.halte) {
    sources["jl-osm-halte"] = { type: "geojson", data: osm.halte, attribution: ATRIBUSI_OSM };
    garis.push({
      id: "jl-osm-halte",
      type: "circle",
      source: "jl-osm-halte",
      minzoom: 11,
      paint: {
        "circle-radius": 3,
        "circle-color": c.land,
        "circle-stroke-color": c.ink,
        "circle-stroke-width": 1,
      },
    });
    garis.push({
      id: "jl-osm-halte-nama",
      type: "symbol",
      source: "jl-osm-halte",
      minzoom: 14,
      layout: {
        "text-field": ["get", "nama"],
        "text-font": [FONT.poi],
        "text-size": 11,
        "text-offset": [0, 0.9],
        "text-anchor": "top",
        "text-optional": true,
      },
      paint: { "text-color": c.muted, "text-halo-color": c.land, "text-halo-width": 1.25 },
    });
  }
  const titikLayers: LayerSpecification[] = [
    {
      id: "jl-hub-kira",
      type: "circle",
      source: SUMBER_TITIK,
      filter: ["all", ["==", ["get", "jenis"], "hub"], ["==", ["get", "perkiraan"], true]],
      paint: {
        "circle-radius": 10,
        "circle-color": "rgba(0,0,0,0)",
        "circle-stroke-color": c.ink,
        "circle-stroke-width": 2,
      },
    },
    {
      id: "jl-terminal-kira",
      type: "circle",
      source: SUMBER_TITIK,
      filter: ["all", ["!=", ["get", "jenis"], "hub"], ["==", ["get", "perkiraan"], true]],
      paint: {
        "circle-radius": 5.5,
        "circle-color": c.land,
        "circle-stroke-color": c.accent,
        "circle-stroke-width": 2,
      },
    },
    {
      id: "jl-titik-pasti",
      type: "circle",
      source: SUMBER_TITIK,
      filter: ["==", ["get", "perkiraan"], false],
      paint: {
        "circle-radius": 6,
        "circle-color": c.accent,
        "circle-stroke-color": c.land,
        "circle-stroke-width": 1.5,
      },
    },
    {
      id: "jl-titik-nama",
      type: "symbol",
      source: SUMBER_TITIK,
      minzoom: 9.5,
      layout: {
        "text-field": ["get", "nama"],
        "text-font": [FONT.poi],
        "text-size": 12,
        "text-offset": [0, 1.3],
        "text-anchor": "top",
      },
      paint: { "text-color": c.ink, "text-halo-color": c.land, "text-halo-width": 1.5 },
    },
    // Area sentuh tak terlihat: titik kecil terlalu sulit untuk jari.
    {
      id: LAYER_KLIK,
      type: "circle",
      source: SUMBER_TITIK,
      paint: { "circle-radius": 18, "circle-opacity": 0 },
    },
  ];
  return { ...base, sources, layers: [...base.layers, ...garis, ...titikLayers] };
}
