"use client";

import type { GeoJSONSource } from "maplibre-gl";
import { useEffect, useMemo, useState } from "react";
import { KOTA_UTAMA, levelRank } from "@/features/langit-laut/lib/kecamatan";
import { pikselDunia } from "@/features/langit-laut/lib/peta-lapisan";
import { PLACES, type ThemeMode } from "@/features/langit-laut/lib/radar";
import type { EchoLevel } from "@/features/langit-laut/lib/status";
import { tambahLayer, usePeta } from "./PetaLangit";
import PetaMarker from "./PetaMarker";

// Batas 52 kecamatan (PEDOMAN 5.2): garis putus-putus tipis, nama kapital. Kecamatan yang hujan ditandai dengan
// label bertulisan kelasnya, supaya makna tidak hanya lewat warna. Geometri (±390 KB) dimuat terpisah.

type KecFeature = {
  type: "Feature";
  properties: { code: string; name: string; kab: string; label: [number, number] | null; areaKm2: number };
  geometry: { type: "MultiPolygon"; coordinates: number[][][][] };
};
type KecGeo = { type: "FeatureCollection"; features: KecFeature[] };

let geoPromise: Promise<KecGeo> | null = null;
const loadGeo = () =>
  (geoPromise ??= import("@/features/langit-laut/lib/kecamatan-geo.json")
    .then((m) => m.default as unknown as KecGeo)
    .catch((e) => {
      geoPromise = null;
      throw e;
    }));

// Angka zoom MapLibre (tile 512 px) = zoom Leaflet (tile 256 px) dikurangi 1.
/** arsiran & label kecamatan hujan: view "Kepri" di HP kecil jatuh ke zoom 6, jadi tetap tampil */
const RAIN_MIN_ZOOM = 6;
/** garis batas semua kecamatan: di zoom 6 ("Luas") cuma jadi coretan */
const LINES_MIN_ZOOM = 7;
const LABELS_ALL_ZOOM = 10;
/** di zoom kecil label hujan cukup nama (kelasnya ada di panel) supaya tak saling tumpuk */
const FULL_PILL_ZOOM = 10;

const LINE: Record<ThemeMode, string> = { light: "#D8C9AC", dark: "#4A4335" };
const LEVEL_WORD: Record<EchoLevel, string> = { ringan: "hujan ringan", sedang: "hujan sedang", lebat: "hujan lebat" };

// Ukuran label di layar untuk cek tabrakan (padanan CSS .kec-pill / .kec-label).
let measureCtx: CanvasRenderingContext2D | null | undefined;
function textWidth(s: string, font: string): number {
  if (measureCtx === undefined) measureCtx = document.createElement("canvas").getContext("2d");
  if (!measureCtx) return s.length * 7;
  measureCtx.font = font;
  return measureCtx.measureText(s).width;
}
function labelSize(name: string, level: EchoLevel | undefined, full: boolean, family: string): [number, number] {
  if (!level) return [textWidth(name, `600 10.5px ${family}`) + name.length * 0.21, 14];
  // padding 8+10, titik 7, jarak 6, bingkai 2
  const w =
    33 + textWidth(name, `700 12px ${family}`) + (full ? 6 + textWidth(LEVEL_WORD[level], `500 12px ${family}`) : 0);
  return [w, 28];
}
const LABEL_GAP = 4;

const LINE_ID = "ll-kec-line";

type Props = {
  /** kode kecamatan yang sedang hujan → kelasnya */
  rainy: ReadonlyMap<string, EchoLevel>;
  /** tandai kecamatan hujan (hanya saat peta menampilkan citra terbaru) */
  showRain: boolean;
  theme: ThemeMode;
};

export default function KecamatanLayer({ rainy, showRain, theme }: Props) {
  const map = usePeta();
  const [geo, setGeo] = useState<KecGeo | null>(null);
  const [zoom, setZoom] = useState(() => map.getZoom());

  useEffect(() => {
    const onZoom = () => setZoom(map.getZoom());
    map.on("zoomend", onZoom);
    return () => {
      map.off("zoomend", onZoom);
    };
  }, [map]);

  useEffect(() => {
    let alive = true;
    loadGeo()
      .then((g) => alive && setGeo(g))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  // kunci stabil: Map baru tiap render induk tak boleh menyentuh layer
  // (urutan dari rainyMap = terderas & terluas dulu → dipakai sebagai prioritas label)
  const rainKey = showRain ? [...rainy.entries()].map(([k, v]) => `${k}:${v}`).join("|") : "";
  const rainLevels = useMemo(
    () => new Map(rainKey ? rainKey.split("|").map((e) => e.split(":") as [string, EchoLevel]) : []),
    [rainKey],
  );

  useEffect(() => {
    if (!geo) return;
    const SUMBER = "ll-kec";
    if (!map.getSource(SUMBER)) {
      map.addSource(SUMBER, {
        type: "geojson",
        data: geo as unknown as GeoJSON.FeatureCollection,
      });
    } else {
      (map.getSource(SUMBER) as GeoJSONSource).setData(geo as unknown as GeoJSON.FeatureCollection);
    }
    tambahLayer(map, {
      id: LINE_ID,
      type: "line",
      source: SUMBER,
      minzoom: LINES_MIN_ZOOM,
      layout: { "line-join": "round" },
      paint: { "line-dasharray": [2, 3] },
    });
    return () => {
      if (map.getLayer(LINE_ID)) map.removeLayer(LINE_ID);
      if (map.getSource(SUMBER)) map.removeSource(SUMBER);
    };
  }, [map, geo]);

  useEffect(() => {
    if (!map.getLayer(LINE_ID)) return;
    map.setPaintProperty(LINE_ID, "line-color", LINE[theme]);
    map.setPaintProperty(LINE_ID, "line-width", 0.9);
  }, [map, theme, geo]);

  const full = zoom >= FULL_PILL_ZOOM;
  // Tata letak label: yang terderas (lalu Kota Batam, lalu yang terluas hujannya) dapat tempat
  // lebih dulu; label yang menabrak label terpasang tidak digambar. Kecamatan hujan yang
  // labelnya tersisih tetap ditandai titik kelas + arsiran, dan namanya ada di panel. Posisi
  // relatif di layar hanya bergantung zoom, jadi cukup dihitung ulang saat zoom berubah.
  const layout = useMemo(() => {
    const pills: KecFeature[] = [];
    const dots: KecFeature[] = [];
    if (!geo || zoom < RAIN_MIN_ZOOM) return { pills, dots };
    const order = [...rainLevels.keys()];
    const cands = geo.features
      .filter((f) => f.properties.label && (zoom >= LABELS_ALL_ZOOM || rainLevels.has(f.properties.code)))
      .map((f) => ({ f, level: rainLevels.get(f.properties.code) }))
      .sort(
        (a, b) =>
          levelRank(b.level ?? null) - levelRank(a.level ?? null) ||
          Number(b.f.properties.kab === KOTA_UTAMA) - Number(a.f.properties.kab === KOTA_UTAMA) ||
          (a.level ? order.indexOf(a.f.properties.code) - order.indexOf(b.f.properties.code) : 0) ||
          b.f.properties.areaKm2 - a.f.properties.areaKm2,
      );
    const family = getComputedStyle(map.getContainer()).fontFamily;
    // label kota (TempatLayer: titik + teks kanan, .place-label 10.5px/600) sudah terpasang
    // lebih dulu → ruangnya dipesan
    const boxes: [number, number, number, number][] = PLACES.map((pl) => {
      const p = pikselDunia(pl.lat, pl.lng, zoom);
      const w = textWidth(pl.name, `600 10.5px ${family}`) + pl.name.length * 0.42;
      return [p.x - 4, p.y - 9, p.x + 14 + w, p.y + 9];
    });
    for (const { f, level } of cands) {
      const [lat, lng] = f.properties.label as [number, number];
      const p = pikselDunia(lat, lng, zoom);
      const [w, h] = labelSize(f.properties.name, level, full, family);
      const box: [number, number, number, number] = [
        p.x - w / 2 - LABEL_GAP,
        p.y - h / 2 - LABEL_GAP,
        p.x + w / 2 + LABEL_GAP,
        p.y + h / 2 + LABEL_GAP,
      ];
      const hits = (q: number[]) => boxes.some((b) => q[0] < b[2] && q[2] > b[0] && q[1] < b[3] && q[3] > b[1]);
      if (!hits(box)) {
        boxes.push(box);
        pills.push(f);
      } else if (level) {
        // titik kelas hanya kalau tak jatuh di atas label terpasang (kalau jatuh, arsirannya
        // tetap menandai); ruangnya dipesan supaya label berikutnya tak menutupinya
        const dot: [number, number, number, number] = [p.x - 7, p.y - 7, p.x + 7, p.y + 7];
        if (!hits(dot)) {
          boxes.push(dot);
          dots.push(f);
        }
      }
    }
    return { pills, dots };
  }, [geo, zoom, rainLevels, full, map]);

  if (!geo || zoom < RAIN_MIN_ZOOM) return null;

  return (
    <>
      {layout.dots.map((f) => {
        const level = rainLevels.get(f.properties.code) as EchoLevel;
        return (
          <PetaMarker
            key={`dot-${f.properties.code}`}
            posisi={f.properties.label as [number, number]}
            className="kec-label-icon"
          >
            <i className="kec-dot kec-dot-solo" data-level={level} />
          </PetaMarker>
        );
      })}
      {layout.pills.map((f) => {
        const level = rainLevels.get(f.properties.code);
        return (
          <PetaMarker
            key={f.properties.code}
            posisi={f.properties.label as [number, number]}
            className="kec-label-icon"
          >
            {level ? (
              <span className="kec-pill" data-level={level}>
                <i className="kec-dot" data-level={level} />
                <b>{f.properties.name}</b>
                {full && <span>{LEVEL_WORD[level]}</span>}
              </span>
            ) : (
              <span className="kec-label">{f.properties.name}</span>
            )}
          </PetaMarker>
        );
      })}
    </>
  );
}

/** Penanda kota untuk orientasi di mode Hujan: titik + nama di kanan. */
export function TempatLayer() {
  return (
    <>
      {PLACES.map((p) => (
        <PetaMarker key={p.name} posisi={[p.lat, p.lng]} className="kec-label-icon">
          <i className="place-dot" />
          <span className="place-label">{p.name}</span>
        </PetaMarker>
      ))}
    </>
  );
}
