// Style peta laut: lapisan Protomaps dengan warna data/design/layer_peta_warna.json.
// Tema "day" = kertas gading, "night" = chart malam. Tidak ada warna di luar token.
import { layers, type Flavor } from "@protomaps/basemaps";
import type { ExpressionSpecification, LayerSpecification, StyleSpecification } from "maplibre-gl";
import { garisSatuUtara, graticule, type Batas } from "./graticule";

export type MapTheme = "day" | "night";

/** Kunci peta (research/00 bagian 9.2): Batam, Rempang, Galang, pulau sekitar; Singapura & Bintan siluet. */
export const MAP_BOUNDS: [[number, number], [number, number]] = [
  [103.55, 0.45],
  [104.75, 1.5],
];
/** Tampilan awal: Batam sampai Galang, tanpa memaksa seluruh bbox masuk layar. */
export const TAMPILAN_AWAL: [[number, number], [number, number]] = [
  [103.82, 0.72],
  [104.32, 1.24],
];
export const MAP_CENTER: [number, number] = [104.03, 1.05];
export const PMTILES_URL = process.env.NEXT_PUBLIC_PMTILES_URL || "/tiles/batam.pmtiles";
export const SOURCE_ID = "protomaps";

const BATAS: Batas = {
  west: MAP_BOUNDS[0][0],
  south: MAP_BOUNDS[0][1],
  east: MAP_BOUNDS[1][0],
  north: MAP_BOUNDS[1][1],
};

export const FONT = {
  water: "Source Serif 4 Italic",
  island: "Source Serif 4 Semibold",
  place: "Source Serif 4 Regular",
  poi: "Plus Jakarta Sans Medium",
} as const;

export const PALET = {
  day: {
    land: "#F4EFE4",
    water: "#DCE3E1",
    shallow: "#E6EBE7",
    depthLine: "#8FA5B0",
    waterline: "#4E6A7A",
    mangrove: "#7C8C6E",
    forest: "#9AA38A",
    roadMajor: "#B9AE98",
    roadMinor: "#D8CFBD",
    building: "#E7DFCF",
    buildingLine: "#BFB4A0",
    ferry: "#A2482A",
    graticule: "#8B8579",
    line1n: "#A2482A",
    labelWater: "#4E6A7A",
    haloWater: "#DCE3E1",
    labelLand: "#1C1B19",
    haloLand: "#F4EFE4",
    ink: "#1C1B19",
    muted: "#5A564E",
    accent: "#A2482A",
  },
  night: {
    land: "#16263A",
    water: "#0F1B2A",
    shallow: "#132235",
    depthLine: "#EDE4CF",
    waterline: "#EDE4CF",
    mangrove: "#8FA597",
    forest: "#6F8577",
    roadMajor: "#3A4A5C",
    roadMinor: "#26364A",
    building: "#1B2C41",
    buildingLine: "#33465C",
    ferry: "#E08A63",
    graticule: "#A5AAA8",
    line1n: "#E08A63",
    labelWater: "#7FA3B5",
    haloWater: "#0F1B2A",
    labelLand: "#EDE4CF",
    haloLand: "#16263A",
    ink: "#EDE4CF",
    muted: "#A9A493",
    accent: "#E08A63",
  },
} as const;

// Semua warna ditulis sendiri, tidak menyalin flavor bawaan, supaya tidak ada warna nyasar.
// Tanpa `pois` dan `landcover`, Protomaps tidak membuat layer yang butuh sprite dan tutupan lahan.
function flavorFor(theme: MapTheme): Flavor {
  const c = PALET[theme];
  const major = c.roadMajor;
  const minor = c.roadMinor;
  return {
    background: c.water,
    earth: c.land,
    water: c.water,
    // Tutupan lahan dibuat rata: peta laut, bukan peta wisata.
    park_a: c.land,
    park_b: c.land,
    hospital: c.land,
    industrial: c.land,
    school: c.land,
    wood_a: c.land,
    wood_b: c.land,
    pedestrian: c.land,
    scrub_a: c.land,
    scrub_b: c.land,
    glacier: c.land,
    sand: c.land,
    beach: c.land,
    aerodrome: c.land,
    zoo: c.land,
    military: c.land,
    runway: minor,
    pier: minor,
    buildings: c.building,
    tunnel_other_casing: minor,
    tunnel_minor_casing: minor,
    tunnel_link_casing: major,
    tunnel_major_casing: major,
    tunnel_highway_casing: major,
    tunnel_other: minor,
    tunnel_minor: minor,
    tunnel_link: major,
    tunnel_major: major,
    tunnel_highway: major,
    minor_service_casing: minor,
    minor_casing: minor,
    link_casing: major,
    major_casing_late: major,
    highway_casing_late: major,
    other: minor,
    minor_service: minor,
    minor_a: minor,
    minor_b: minor,
    link: major,
    major_casing_early: major,
    major,
    highway_casing_early: major,
    highway: major,
    railway: minor,
    boundaries: c.graticule,
    bridges_other_casing: minor,
    bridges_minor_casing: minor,
    bridges_link_casing: major,
    bridges_major_casing: major,
    bridges_highway_casing: major,
    bridges_other: minor,
    bridges_minor: minor,
    bridges_link: major,
    bridges_major: major,
    bridges_highway: major,
    roads_label_minor: c.muted,
    roads_label_minor_halo: c.haloLand,
    roads_label_major: c.muted,
    roads_label_major_halo: c.haloLand,
    ocean_label: c.labelWater,
    subplace_label: c.muted,
    subplace_label_halo: c.haloLand,
    city_label: c.labelLand,
    city_label_halo: c.haloLand,
    state_label: c.muted,
    state_label_halo: c.haloLand,
    country_label: c.muted,
    address_label: c.muted,
    address_label_halo: c.haloLand,
    regular: FONT.place,
    bold: FONT.island,
    italic: FONT.water,
  };
}

/** Waterlining: garis tipis menyusuri pantai ke arah laut, makin jauh makin pudar (laporan 05). */
function waterlining(theme: MapTheme): LayerSpecification[] {
  const c = PALET[theme];
  const opacities = theme === "day" ? [0.35, 0.2, 0.1] : [0.3, 0.16, 0.08];
  // Cincin luar poligon searah jarum jam di layar, jadi offset negatif mengarah ke laut.
  const offsets = [-2, -5, -8];
  return offsets.map((offset, i) => ({
    id: `waterline-${i}`,
    type: "line",
    source: SOURCE_ID,
    "source-layer": "earth",
    minzoom: 8,
    paint: {
      "line-color": c.waterline,
      "line-width": 0.5,
      "line-opacity": opacities[i],
      "line-offset": offset,
    },
  }));
}

/** Garis koordinat di bawah label: tiap 5′, dan tiap 1′ saat sudah dekat. Garis 1°N selalu tampak. */
function graticuleLayers(theme: MapTheme): LayerSpecification[] {
  const c = PALET[theme];
  return [
    {
      id: "graticule-1",
      type: "line",
      source: "graticule-1",
      minzoom: 12.5,
      paint: { "line-color": c.graticule, "line-width": 0.5, "line-opacity": 0.2 },
    },
    {
      id: "graticule-5",
      type: "line",
      source: "graticule-5",
      minzoom: 9.5,
      paint: { "line-color": c.graticule, "line-width": 0.5, "line-opacity": 0.35 },
    },
    {
      id: "garis-1n",
      type: "line",
      source: "garis-1n",
      paint: { "line-color": c.line1n, "line-width": 0.75, "line-dasharray": [6, 3] },
    },
  ];
}

function labelSatuUtara(theme: MapTheme): LayerSpecification {
  const c = PALET[theme];
  return {
    id: "garis-1n-label",
    type: "symbol",
    source: "garis-1n",
    layout: {
      "symbol-placement": "line",
      "symbol-spacing": 420,
      "text-field": "1°00′ U",
      "text-font": [FONT.island],
      "text-size": 12,
      "text-letter-spacing": 0.12,
      "text-offset": [0, -0.7],
    },
    paint: { "text-color": c.line1n, "text-halo-color": c.haloWater, "text-halo-width": 1.5 },
  };
}

/**
 * Area di luar fokus: Singapura-Johor di utara dan Bintan di timur tampil sebagai siluet (research/00
 * bagian 9.2). Jalan dan bangunan ditutup selubung, label dibuat pucat. Hanya efek gambar, bukan
 * batas wilayah.
 */
export const LUAR_FOKUS = {
  type: "MultiPolygon",
  coordinates: [
    [
      [
        [103.55, 1.205],
        [104.19, 1.205],
        [104.19, 1.5],
        [103.55, 1.5],
        [103.55, 1.205],
      ],
    ],
    [
      [
        [104.19, 1.5],
        [104.19, 1.02],
        [104.33, 0.98],
        [104.33, 0.45],
        [104.75, 0.45],
        [104.75, 1.5],
        [104.19, 1.5],
      ],
    ],
  ],
} as const;

const DI_LUAR_FOKUS = ["within", LUAR_FOKUS] as unknown as ExpressionSpecification;
const OPACITY_LABEL_LUAR = 0.45;

// Protomaps menggabungkan jalan satu tile menjadi satu fitur di zoom rendah, jadi jalan Batam dan
// Bintan tidak bisa dipisah dengan ekspresi `within`. Sebagai gantinya, urutan gambar dibalik: jalan
// lebih dulu, lalu selubung warna darat, lalu air dan yang berdiri di atas air.
const DI_ATAS_SELUBUNG = (id: string) =>
  id === "water" ||
  id === "water_stream" ||
  id === "water_river" ||
  id === "landuse_pier" ||
  id === "roads_pier" ||
  id === "boundaries_country" ||
  id === "boundaries" ||
  id.startsWith("roads_bridges");

// Sprite tidak dipakai, jadi layer yang bergantung padanya dibuang. Layer landuse yang warnanya
// sama dengan darat juga dibuang: tidak terlihat, tetapi tetap membebani GPU HP kelas menengah.
const LAYER_DIBUANG = new Set([
  "roads_shields",
  "roads_oneway",
  "pois",
  "landuse_park",
  "landuse_urban_green",
  "landuse_hospital",
  "landuse_industrial",
  "landuse_school",
  "landuse_beach",
  "landuse_zoo",
  "landuse_aerodrome",
  "landuse_pedestrian",
]);

export function baseStyle(theme: MapTheme, origin: string): StyleSpecification {
  const flavor = flavorFor(theme);
  const c = PALET[theme];
  const base = layers(SOURCE_ID, flavor, { lang: "id" }) as LayerSpecification[];

  // Bangunan bergaris halus, label laut italic berjarak, pulau kapital.
  const tuned = base
    .filter((l) => !LAYER_DIBUANG.has(l.id))
    .map((l): LayerSpecification => {
      if ((l.id === "places_locality" || l.id === "places_subplace") && l.type === "symbol") {
        l = { ...l, paint: { ...l.paint, "text-opacity": ["case", DI_LUAR_FOKUS, OPACITY_LABEL_LUAR, 1] } };
      }
      if (l.id.startsWith("roads_labels") && l.type === "symbol") {
        return { ...l, paint: { ...l.paint, "text-opacity": ["case", DI_LUAR_FOKUS, 0, 1] } };
      }
      if (l.id === "buildings" && l.type === "fill") {
        return {
          ...l,
          paint: { ...l.paint, "fill-color": c.building, "fill-outline-color": c.buildingLine, "fill-opacity": 1 },
        };
      }
      if ((l.id === "water_label_ocean" || l.id === "water_label_lakes") && l.type === "symbol") {
        return {
          ...l,
          layout: { ...l.layout, "text-font": [FONT.water], "text-letter-spacing": 0.2 },
          paint: { ...l.paint, "text-color": c.labelWater, "text-halo-color": c.haloWater, "text-halo-width": 1 },
        };
      }
      if (l.id === "earth_label_islands" && l.type === "symbol") {
        return {
          ...l,
          layout: {
            ...l.layout,
            "text-font": [FONT.island],
            "text-transform": "uppercase",
            "text-letter-spacing": 0.15,
          },
          paint: { ...l.paint, "text-color": c.labelLand, "text-halo-color": c.haloLand, "text-halo-width": 1 },
        };
      }
      if (l.id === "places_locality" && l.type === "symbol" && l.layout) {
        // Titik kota bawaan butuh sprite; hierarki label cukup dari huruf.
        const layout = { ...l.layout };
        delete layout["icon-image"];
        delete layout["icon-size"];
        delete layout["icon-padding"];
        return { ...l, layout };
      }
      return l;
    });

  // Urutan: darat, jalan dan bangunan, selubung, air, waterlining, jembatan, graticule, lalu label.
  const garis = tuned.filter((l) => l.type !== "symbol");
  const merged: LayerSpecification[] = [
    ...garis.filter((l) => !DI_ATAS_SELUBUNG(l.id)),
    { id: "selubung-luar-fokus", type: "fill", source: "luar-fokus", paint: { "fill-color": c.land } },
    ...garis.filter((l) => l.id.startsWith("water")),
    ...waterlining(theme),
    ...garis.filter((l) => DI_ATAS_SELUBUNG(l.id) && !l.id.startsWith("water")),
    ...graticuleLayers(theme),
    ...tuned.filter((l) => l.type === "symbol"),
    labelSatuUtara(theme),
  ];

  // Protokol pmtiles dan glyph dimuat di luar konteks dokumen, jadi URL harus absolut.
  const pmtiles = new URL(PMTILES_URL, origin).href;

  return {
    version: 8,
    glyphs: `${origin}/glyphs/{fontstack}/{range}.pbf`,
    sources: {
      [SOURCE_ID]: {
        type: "vector",
        url: `pmtiles://${pmtiles}`,
        attribution:
          '<a href="https://openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap</a>, <a href="https://protomaps.com" target="_blank" rel="noopener">Protomaps</a>',
      },
      "luar-fokus": {
        type: "geojson",
        data: { type: "Feature", properties: {}, geometry: LUAR_FOKUS as unknown as GeoJSON.MultiPolygon },
      },
      "graticule-1": { type: "geojson", data: graticule(BATAS, 1) },
      "graticule-5": { type: "geojson", data: graticule(BATAS, 5) },
      "garis-1n": { type: "geojson", data: garisSatuUtara(BATAS) },
    },
    layers: merged,
  };
}
