// Peta kerja (PEDOMAN 5.2): lapisan Protomaps dengan warna token --bch-map-* di data/design/design_tokens.css.
// Tanpa garis koordinat, mawar angin, atau ornamen peta laut.
import { layers, type Flavor } from "@protomaps/basemaps";
import type { ExpressionSpecification, LayerSpecification, StyleSpecification } from "maplibre-gl";

export type MapTheme = "light" | "dark";

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

export const FONT = {
  water: "Newsreader Italic",
  island: "Plus Jakarta Sans Bold",
  place: "Plus Jakarta Sans Medium",
  poi: "Plus Jakarta Sans Medium",
} as const;

export const PALET = {
  light: {
    land: "#FFF5E0",
    landOther: "#FBF7EF",
    water: "#E4EFF7",
    shallow: "#E4EFF7",
    depthLine: "#7E9AAE",
    waterline: "#7E9AAE",
    mangrove: "#7E9AAE",
    forest: "#7E9AAE",
    roadMajor: "#FFE9BF",
    roadMinor: "#FFFFFF",
    roadCasing: "#E5DAC3",
    building: "#F3EBD8",
    buildingLine: "#E5DAC3",
    ferry: "#F15060",
    graticule: "#D8C9AC",
    line1n: "#F15060",
    labelWater: "#0067A5",
    haloWater: "#E4EFF7",
    labelLand: "#7A6A4F",
    haloLand: "#FFF5E0",
    ink: "#161616",
    muted: "#5B5B5B",
    accent: "#0078BF",
  },
  dark: {
    land: "#22201B",
    landOther: "#1B1A17",
    water: "#16222C",
    shallow: "#16222C",
    depthLine: "#4F6676",
    waterline: "#4F6676",
    mangrove: "#4F6676",
    forest: "#4F6676",
    roadMajor: "#4A3F2A",
    roadMinor: "#2E2B25",
    roadCasing: "#3A362E",
    building: "#2A2721",
    buildingLine: "#3A362E",
    ferry: "#F15060",
    graticule: "#4A4335",
    line1n: "#F15060",
    labelWater: "#6CB8EA",
    haloWater: "#16222C",
    labelLand: "#B8A989",
    haloLand: "#22201B",
    ink: "#F2F0EB",
    muted: "#B3B0A8",
    accent: "#6CB8EA",
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
    // Tutupan lahan dibuat rata supaya penanda kategori mudah dibaca.
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
    tunnel_minor_casing: c.roadCasing,
    tunnel_link_casing: c.roadCasing,
    tunnel_major_casing: major,
    tunnel_highway_casing: major,
    tunnel_other: minor,
    tunnel_minor: minor,
    tunnel_link: major,
    tunnel_major: major,
    tunnel_highway: major,
    minor_service_casing: c.roadCasing,
    minor_casing: minor,
    link_casing: major,
    major_casing_late: c.roadCasing,
    highway_casing_late: c.roadCasing,
    other: minor,
    minor_service: minor,
    minor_a: minor,
    minor_b: minor,
    link: major,
    major_casing_early: c.roadCasing,
    major,
    highway_casing_early: c.roadCasing,
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

/** Garis pantai tipis (PEDOMAN 5.2). */
function garisPantai(theme: MapTheme): LayerSpecification {
  return {
    id: "garis-pantai",
    type: "line",
    source: SOURCE_ID,
    "source-layer": "earth",
    paint: { "line-color": PALET[theme].waterline, "line-width": 0.9 },
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

export type OpsiGaya = {
  /** Selubung pulau di luar Batam. Halaman cuaca mematikannya. */
  chart?: boolean;
};

export function baseStyle(theme: MapTheme, origin: string, { chart = true }: OpsiGaya = {}): StyleSpecification {
  const flavor = flavorFor(theme);
  const c = PALET[theme];
  const base = layers(SOURCE_ID, flavor, { lang: "id" }) as LayerSpecification[];

  // Bangunan bergaris halus, label laut italic berjarak, pulau kapital.
  const tuned = base
    .filter((l) => !LAYER_DIBUANG.has(l.id))
    .map((l): LayerSpecification => {
      if (chart && (l.id === "places_locality" || l.id === "places_subplace") && l.type === "symbol") {
        l = { ...l, paint: { ...l.paint, "text-opacity": ["case", DI_LUAR_FOKUS, OPACITY_LABEL_LUAR, 1] } };
      }
      if (chart && l.id.startsWith("roads_labels") && l.type === "symbol") {
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

  // Urutan: darat, jalan dan bangunan, selubung, air, garis pantai, jembatan, lalu label.
  const garis = tuned.filter((l) => l.type !== "symbol");
  const merged: LayerSpecification[] = [
    ...garis.filter((l) => !DI_ATAS_SELUBUNG(l.id)),
    ...(chart
      ? [{ id: "selubung-luar-fokus", type: "fill", source: "luar-fokus", paint: { "fill-color": c.landOther } } as const]
      : []),
    ...garis.filter((l) => l.id.startsWith("water")),
    garisPantai(theme),
    ...garis.filter((l) => DI_ATAS_SELUBUNG(l.id) && !l.id.startsWith("water")),
    ...tuned.filter((l) => l.type === "symbol"),
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
          '<a href="https://openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap</a> · <a href="https://protomaps.com" target="_blank" rel="noopener">Protomaps</a>',
      },
      ...(chart
        ? {
            "luar-fokus": {
              type: "geojson" as const,
              data: {
                type: "Feature" as const,
                properties: {},
                geometry: LUAR_FOKUS as unknown as GeoJSON.MultiPolygon,
              },
            },
          }
        : {}),
    },
    layers: merged,
  };
}
