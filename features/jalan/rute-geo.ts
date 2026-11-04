// Pemuat data/trans_batam/routes.geojson. Isinya dari relasi OSM (scripts/buat-lapisan-osm.mjs), baru Koridor 1;
// koridor lain menyusul setelah ada di OSM atau halte disurvei dan di-map-matching per arah (brief 10). Yang
// digambar hanya LineString sah di area Batam, supaya garis lurus antar landmark tidak bisa masuk diam-diam.
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { MAP_BOUNDS } from "@/features/peta/style";

export type PropertiRute = {
  koridor: string;
  arah: string;
  warna: string;
  /** Posisi di ruas berimpit, dalam piksel untuk `line-offset`. */
  offset: number;
  /** Harus "map-matching" atau "osm". Geometri "perkiraan" ditolak. */
  sumber_geometri: string;
};

export type KoleksiRute = GeoJSON.FeatureCollection<GeoJSON.LineString, PropertiRute>;

export const RUTE_KOSONG: KoleksiRute = { type: "FeatureCollection", features: [] };

const SUMBER_SAH = new Set(["map-matching", "osm"]);

function dalamArea([lng, lat]: GeoJSON.Position) {
  const [[w, s], [e, n]] = MAP_BOUNDS;
  return lng >= w && lng <= e && lat >= s && lat <= n;
}

/** Fitur yang tidak memenuhi syarat dibuang, bukan digambar seadanya. */
export function bacaRuteGeo(teks: string): KoleksiRute {
  let data: unknown;
  try {
    data = JSON.parse(teks);
  } catch {
    return RUTE_KOSONG;
  }
  const fitur = (data as { features?: unknown })?.features;
  if (!Array.isArray(fitur)) return RUTE_KOSONG;
  const sah = fitur.filter((f): f is GeoJSON.Feature<GeoJSON.LineString, PropertiRute> => {
    const k = f as GeoJSON.Feature<GeoJSON.LineString, PropertiRute>;
    return (
      k?.geometry?.type === "LineString" &&
      Array.isArray(k.geometry.coordinates) &&
      k.geometry.coordinates.length >= 2 &&
      k.geometry.coordinates.every(dalamArea) &&
      typeof k.properties?.koridor === "string" &&
      typeof k.properties?.warna === "string" &&
      SUMBER_SAH.has(k.properties?.sumber_geometri)
    );
  });
  return { type: "FeatureCollection", features: sah };
}

export async function muatRuteGeo(): Promise<KoleksiRute> {
  try {
    return bacaRuteGeo(await readFile(join(process.cwd(), "data/trans_batam/routes.geojson"), "utf8"));
  } catch {
    return RUTE_KOSONG;
  }
}
