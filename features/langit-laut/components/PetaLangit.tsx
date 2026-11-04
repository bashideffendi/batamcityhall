"use client";

import { Map as MapLibre } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { pasangGlobalPeta, webglAda } from "@/features/peta/global";
import { baseStyle, type MapTheme } from "@/features/peta/style";
import { gabungGaya, sisipSebelum } from "@/features/langit-laut/lib/peta-lapisan";
import { MAX_ZOOM, MIN_ZOOM, type ThemeMode } from "@/features/langit-laut/lib/radar";
import type { LayerSpecification } from "maplibre-gl";

const KonteksPeta = createContext<MapLibre | null>(null);

export function usePeta(): MapLibre {
  const m = useContext(KonteksPeta);
  if (!m) throw new Error("usePeta dipakai di luar PetaLangit");
  return m;
}

/** Tambah layer di posisinya menurut urutan Langit & Laut (lib/peta-lapisan.ts). */
export function tambahLayer(map: MapLibre, layer: LayerSpecification) {
  const urutan = map.getLayersOrder().map((id) => ({ id, type: map.getLayer(id)?.type ?? "" }));
  map.addLayer(layer, sisipSebelum(urutan, layer.id));
}

const TEKS_PETA = {
  "Map.Title": "Peta Langit dan Laut Batam. Geser dengan tombol panah, perbesar dengan tombol plus dan minus.",
  "AttributionControl.ToggleAttribution": "Buka atau tutup atribusi",
};

const temaPeta = (t: ThemeMode): MapTheme => (t === "dark" ? "night" : "day");

// Pemilik satu peta MapLibre untuk tiga mode. Lapisan mode (radar, ombak, kecamatan, kamera) adalah
// komponen anak yang baru dirender setelah gaya peta dasar selesai dimuat.
export default function PetaLangit({ theme, children }: { theme: ThemeMode; children: ReactNode }) {
  const wadah = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapLibre | null>(null);
  const [gagal] = useState(() => !webglAda());
  const temaAwal = useRef(theme);

  useEffect(() => {
    const el = wadah.current;
    if (!el || !webglAda()) return;
    pasangGlobalPeta();
    const m = new MapLibre({
      container: el,
      style: baseStyle(temaPeta(temaAwal.current), window.location.origin, { chart: false }),
      center: [104.0, 0.9],
      zoom: 8,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      maxPitch: 0,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
      renderWorldCopies: false,
      attributionControl: { compact: false },
      locale: TEKS_PETA,
    });
    m.touchZoomRotate.disableRotation();
    m.keyboard.disableRotation();
    m.once("load", () => setMap(m));
    // Tekstur kertas tidak boleh menimpa kanvas peta (laporan 05).
    document.body.classList.add("bch-no-grain");
    return () => {
      document.body.classList.remove("bch-no-grain");
      m.remove();
    };
  }, []);

  useEffect(() => {
    map?.setStyle(baseStyle(temaPeta(theme), window.location.origin, { chart: false }), { transformStyle: gabungGaya });
  }, [map, theme]);

  return (
    <>
      <div ref={wadah} className="ll-peta" />
      {gagal && <p className="ll-peta-gagal">Peta gagal dimuat. Laut masih ada, kami saja yang belum.</p>}
      {map && <KonteksPeta.Provider value={map}>{children}</KonteksPeta.Provider>}
    </>
  );
}
