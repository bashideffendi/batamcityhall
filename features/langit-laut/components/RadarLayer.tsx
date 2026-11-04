"use client";

import type { ErrorEvent, ImageSource } from "maplibre-gl";
import { useEffect, useRef } from "react";
import { sudutCitra } from "@/features/langit-laut/lib/peta-lapisan";
import { RADAR_BOUNDS, type ThemeMode } from "@/features/langit-laut/lib/radar";
import { tambahLayer, usePeta } from "./PetaLangit";

const SUMBER = "ll-radar";

type Props = {
  /** null = tidak ada citra yang boleh tampil (bolong), bukan "tidak hujan" */
  url: string | null;
  opacity: number;
  theme: ThemeMode;
  onBroken: (url: string) => void;
};

// Citra radar MSS sebagai image source. Bounds dari RADAR_BOUNDS, hasil georeferensi: jangan diubah.
// Ganti frame lewat updateImage, bukan membuat ulang sumber, supaya animasi tidak berkedip.
export default function RadarLayer({ url, opacity, theme, onBroken }: Props) {
  const map = usePeta();
  const urlAktif = useRef(url);
  const onBrokenRef = useRef(onBroken);

  useEffect(() => {
    onBrokenRef.current = onBroken;
    urlAktif.current = url;
  });

  useEffect(() => {
    const onError = (e: ErrorEvent & { sourceId?: string }) => {
      if (e.sourceId === SUMBER && urlAktif.current) onBrokenRef.current(urlAktif.current);
    };
    map.on("error", onError);
    return () => {
      map.off("error", onError);
      if (map.getLayer(SUMBER)) map.removeLayer(SUMBER);
      if (map.getSource(SUMBER)) map.removeSource(SUMBER);
    };
  }, [map]);

  useEffect(() => {
    if (!url) {
      if (map.getLayer(SUMBER)) map.setLayoutProperty(SUMBER, "visibility", "none");
      return;
    }
    const src = map.getSource(SUMBER) as ImageSource | undefined;
    if (src) {
      src.updateImage({ url });
    } else {
      map.addSource(SUMBER, { type: "image", url, coordinates: sudutCitra(RADAR_BOUNDS) });
      (map.getSource(SUMBER) as ImageSource & { attribution?: string }).attribution =
        "Radar: Meteorological Service Singapore";
      tambahLayer(map, { id: SUMBER, type: "raster", source: SUMBER, paint: { "raster-fade-duration": 0 } });
    }
    map.setLayoutProperty(SUMBER, "visibility", "visible");
  }, [map, url]);

  useEffect(() => {
    if (!map.getLayer(SUMBER)) return;
    map.setPaintProperty(SUMBER, "raster-opacity", opacity);
    map.setPaintProperty(SUMBER, "raster-saturation", theme === "dark" ? 0.12 : 0.05);
  }, [map, opacity, theme, url]);

  return null;
}
