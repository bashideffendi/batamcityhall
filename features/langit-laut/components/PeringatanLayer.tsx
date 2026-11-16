"use client";

import type { GeoJSONSource } from "maplibre-gl";
import { useEffect, useMemo } from "react";
import type { PeringatanCuaca } from "@/features/langit-laut/lib/api-types";
import { keGeoJson } from "@/features/langit-laut/lib/peringatan-cuaca";
import type { ThemeMode } from "@/features/langit-laut/lib/radar";
import { tambahLayer, usePeta } from "@/features/peta/PetaKerja";

// Wilayah peringatan dini BMKG: garis merah UTUH dengan alas terang, tanpa isian yang mengubah warna radar. Sempat
// digambar garis putus-putus tebal berwarna netral; pemilik (16 Nov 2026): "garis putus-putus sebagai peringatan,
// yakin orang paham?" Batas kecamatan juga putus-putus, jadi keduanya tertukar. Arti garis ini ditulis di kotak
// keterangan di atas peta (RadarMap, .cu-cap-kunci) dan di legenda.
const SUMBER = "ll-cap";
const FILL_ID = "ll-cap-fill";
const ALAS_ID = "ll-cap-line-alas";
const LINE_ID = "ll-cap-line";
/** Merah peringatan (sama dengan --bch-status-danger). Dipakai juga oleh kotak keterangan dan legenda. */
export const WARNA_PERINGATAN: Record<ThemeMode, string> = { light: "#B42318", dark: "#F28B82" };
const WARNA_ALAS: Record<ThemeMode, string> = { light: "#FFFFFF", dark: "#0E1418" };

export default function PeringatanLayer({ peringatan, theme }: { peringatan: PeringatanCuaca[]; theme: ThemeMode }) {
  const map = usePeta();
  const data = useMemo(() => keGeoJson(peringatan), [peringatan]);

  useEffect(() => {
    if (!map.getSource(SUMBER)) {
      map.addSource(SUMBER, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
    }
    tambahLayer(map, { id: FILL_ID, type: "fill", source: SUMBER });
    tambahLayer(map, {
      id: ALAS_ID,
      type: "line",
      source: SUMBER,
      layout: { "line-join": "round" },
      paint: { "line-width": 6, "line-opacity": 0.85 },
    });
    tambahLayer(map, {
      id: LINE_ID,
      type: "line",
      source: SUMBER,
      layout: { "line-join": "round" },
      paint: { "line-width": 3 },
    });
    return () => {
      if (map.getLayer(FILL_ID)) map.removeLayer(FILL_ID);
      if (map.getLayer(LINE_ID)) map.removeLayer(LINE_ID);
      if (map.getLayer(ALAS_ID)) map.removeLayer(ALAS_ID);
      if (map.getSource(SUMBER)) map.removeSource(SUMBER);
    };
  }, [map]);

  useEffect(() => {
    (map.getSource(SUMBER) as GeoJSONSource | undefined)?.setData(data);
  }, [map, data]);

  useEffect(() => {
    if (!map.getLayer(FILL_ID) || !map.getLayer(LINE_ID)) return;
    const tema = theme === "dark" ? "dark" : "light";
    map.setPaintProperty(FILL_ID, "fill-color", WARNA_PERINGATAN[tema]);
    map.setPaintProperty(FILL_ID, "fill-opacity", 0);
    map.setPaintProperty(LINE_ID, "line-color", WARNA_PERINGATAN[tema]);
    if (map.getLayer(ALAS_ID)) map.setPaintProperty(ALAS_ID, "line-color", WARNA_ALAS[tema]);
  }, [map, theme]);

  return null;
}
