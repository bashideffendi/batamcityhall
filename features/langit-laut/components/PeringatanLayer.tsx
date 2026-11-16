"use client";

import type { GeoJSONSource } from "maplibre-gl";
import { useEffect, useMemo } from "react";
import type { PeringatanCuaca } from "@/features/langit-laut/lib/api-types";
import { keGeoJson } from "@/features/langit-laut/lib/peringatan-cuaca";
import type { ThemeMode } from "@/features/langit-laut/lib/radar";
import { tambahLayer, usePeta } from "@/features/peta/PetaKerja";

// Peringatan memakai garis netral putus-putus tebal, tanpa isian yang mengubah warna radar.
const SUMBER = "ll-cap";
const FILL_ID = "ll-cap-fill";
const LINE_ID = "ll-cap-line";
const WARNA: Record<ThemeMode, string> = { light: "#20262C", dark: "#F1F3F5" };

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
      id: LINE_ID,
      type: "line",
      source: SUMBER,
      layout: { "line-join": "round" },
      paint: { "line-width": 2.5, "line-dasharray": [4, 2] },
    });
    return () => {
      if (map.getLayer(FILL_ID)) map.removeLayer(FILL_ID);
      if (map.getLayer(LINE_ID)) map.removeLayer(LINE_ID);
      if (map.getSource(SUMBER)) map.removeSource(SUMBER);
    };
  }, [map]);

  useEffect(() => {
    (map.getSource(SUMBER) as GeoJSONSource | undefined)?.setData(data);
  }, [map, data]);

  useEffect(() => {
    if (!map.getLayer(FILL_ID) || !map.getLayer(LINE_ID)) return;
    map.setPaintProperty(FILL_ID, "fill-color", WARNA[theme]);
    map.setPaintProperty(FILL_ID, "fill-opacity", 0);
    map.setPaintProperty(LINE_ID, "line-color", WARNA[theme]);
  }, [map, theme]);

  return null;
}
