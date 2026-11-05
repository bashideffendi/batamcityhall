"use client";

import type { ErrorEvent } from "maplibre-gl";
import { useEffect } from "react";
import { PALET, SOURCE_ID } from "@/features/peta/style";
import type { ThemeMode } from "@/features/langit-laut/lib/radar";
import { tambahLayer, usePeta } from "./PetaLangit";

// Field OFS opaque di mana-mana, jadi warnanya meluber ke daratan. Solusi sama dengan app OFS BMKG:
// poligon DARATAN digambar di atas field dengan warna darat peta dasar.
//
// Situs lama memakai vector tile CircleGeo. Di MapLibre tile itu terbaca satu tingkat lebih kasar
// (maxzoom 10, tile 512 px), jadi mask memakai layer `earth` peta dasar sendiri: garis pantainya sama
// dengan mode lain dan tidak butuh server luar. Kalau peta dasar gagal → onStatus(false), supaya panel
// bisa jujur "warna di atas pulau bukan data".
const ID = "ll-land";
const warnaDarat = (t: ThemeMode) => PALET[t === "dark" ? "dark" : "light"].land;

export default function LandMask({ theme, onStatus }: { theme: ThemeMode; onStatus?: (ok: boolean) => void }) {
  const map = usePeta();

  useEffect(() => {
    tambahLayer(map, { id: ID, type: "fill", source: SOURCE_ID, "source-layer": "earth" });
    onStatus?.(true);
    const onError = (e: ErrorEvent & { sourceId?: string }) => {
      if (e.sourceId === SOURCE_ID) onStatus?.(false);
    };
    map.on("error", onError);
    return () => {
      map.off("error", onError);
      if (map.getLayer(ID)) map.removeLayer(ID);
    };
  }, [map, onStatus]);

  useEffect(() => {
    if (map.getLayer(ID)) map.setPaintProperty(ID, "fill-color", warnaDarat(theme));
  }, [map, theme, onStatus]);

  return null;
}
