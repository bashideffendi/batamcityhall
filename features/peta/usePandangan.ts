"use client";

import type { Map as MapLibre } from "maplibre-gl";
import { useEffect, useState } from "react";
import type { Batas } from "./graticule";

export type Pandangan = { zoom: number; lintang: number; batas: Batas; lebar: number; tinggi: number };

/** Keadaan tampilan peta untuk ornamen React, diperbarui paling sering sekali per frame. */
export function usePandangan(map: MapLibre | null): Pandangan | null {
  const [pandangan, setPandangan] = useState<Pandangan | null>(null);

  useEffect(() => {
    if (!map) return;
    let frame = 0;
    const baca = () => {
      frame = 0;
      const b = map.getBounds();
      const el = map.getContainer();
      setPandangan({
        zoom: map.getZoom(),
        lintang: map.getCenter().lat,
        batas: { west: b.getWest(), south: b.getSouth(), east: b.getEast(), north: b.getNorth() },
        lebar: el.clientWidth,
        tinggi: el.clientHeight,
      });
    };
    const jadwalkan = () => {
      if (!frame) frame = requestAnimationFrame(baca);
    };
    jadwalkan();
    map.on("move", jadwalkan);
    map.on("resize", jadwalkan);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      map.off("move", jadwalkan);
      map.off("resize", jadwalkan);
    };
  }, [map]);

  return pandangan;
}
