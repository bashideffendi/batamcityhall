"use client";

import { LngLat, Map as MapLibre, type ErrorEvent } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { batasiKamera } from "@/features/peta/cakupan-ubin";
import { pasangGlobalPeta, webglAda } from "@/features/peta/global";
import { baseStyle, SOURCE_ID, type MapTheme } from "@/features/peta/style";
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
  "Map.Title": "Peta cuaca dan laut Batam. Geser dengan tombol panah, perbesar dengan tombol plus dan minus.",
  "AttributionControl.ToggleAttribution": "Buka atau tutup atribusi",
  "CooperativeGesturesHandler.WindowsHelpText": "Tekan Ctrl sambil menggulir untuk memperbesar peta",
  "CooperativeGesturesHandler.MacHelpText": "Tekan ⌘ sambil menggulir untuk memperbesar peta",
  "CooperativeGesturesHandler.MobileHelpText": "Geser dengan dua jari untuk menggerakkan peta",
};

const temaPeta = (t: ThemeMode): MapTheme => (t === "dark" ? "dark" : "light");

// Pemilik satu peta MapLibre untuk tiga mode. Lapisan mode (radar, ombak, kecamatan, kamera) adalah
// komponen anak yang baru dirender setelah gaya peta dasar selesai dimuat.
export type OpsiPeta = {
  bounds?: [[number, number], [number, number]];
  maxBounds?: [[number, number], [number, number]];
  /** Peta di atas halaman yang bisa digulir: satu jari tetap menggulir halaman. */
  koperatif?: boolean;
  /** Pulau di luar Batam memakai warna lain (PEDOMAN 5.2). */
  selubung?: boolean;
  /** Atribusi sudah ditulis di bawah peta. */
  tanpaAtribusi?: boolean;
  /**
   * Tanpa maxBounds: kamera dibatasi cakupan ubin peta dasar (features/peta/cakupan-ubin.ts), supaya daratan
   * tidak pernah tampak terpotong di tepi berkas peta.
   */
  ikutiUbin?: boolean;
};

export default function PetaLangit({ theme, children, opsi }: { theme: ThemeMode; children: ReactNode; opsi?: OpsiPeta }) {
  const wadah = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapLibre | null>(null);
  const [gagal, setGagal] = useState(() => !webglAda());
  const temaAwal = useRef(theme);
  const opsiAwal = useRef(opsi);
  const selubung = !!opsi?.selubung;

  useEffect(() => {
    const el = wadah.current;
    if (!el || !webglAda()) return;
    pasangGlobalPeta();
    const m = new MapLibre({
      container: el,
      style: baseStyle(temaPeta(temaAwal.current), window.location.origin, { chart: !!opsiAwal.current?.selubung }),
      ...(opsiAwal.current?.bounds ? { bounds: opsiAwal.current.bounds, fitBoundsOptions: { padding: 24 } } : { center: [104.0, 0.9] as [number, number], zoom: 8 }),
      ...(opsiAwal.current?.maxBounds ? { maxBounds: opsiAwal.current.maxBounds } : {}),
      ...(opsiAwal.current?.ikutiUbin
        ? {
            transformConstrain: (ll: LngLat, zoom: number) => {
              if (!el.clientWidth || !el.clientHeight) return { center: ll, zoom };
              const k = batasiKamera(ll.lng, ll.lat, zoom, el.clientWidth, el.clientHeight);
              return { center: new LngLat(k.lng, k.lat), zoom: k.zoom };
            },
          }
        : {}),
      cooperativeGestures: opsiAwal.current?.koperatif ?? false,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      maxPitch: 0,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
      renderWorldCopies: false,
      attributionControl: opsiAwal.current?.tanpaAtribusi ? false : { compact: false },
      locale: TEKS_PETA,
    });
    m.touchZoomRotate.disableRotation();
    m.keyboard.disableRotation();
    // Hanya sumber peta dasar, dan hanya sebelum peta siap: tile yang sesekali gagal tidak berarti seluruh peta gagal.
    let siap = false;
    m.on("error", (e: ErrorEvent & { sourceId?: string }) => {
      if (!siap && e.sourceId === SOURCE_ID) setGagal(true);
    });
    m.once("load", () => {
      siap = true;
      setMap(m);
    });
    return () => {
      m.remove();
    };
  }, []);

  useEffect(() => {
    map?.setStyle(baseStyle(temaPeta(theme), window.location.origin, { chart: selubung }), { transformStyle: gabungGaya });
  }, [map, theme, selubung]);

  return (
    <>
      <div ref={wadah} className="ll-peta" />
      {gagal && <p className="ll-peta-gagal">Peta tidak dapat dimuat. Coba muat ulang sebentar lagi.</p>}
      {map && <KonteksPeta.Provider value={map}>{children}</KonteksPeta.Provider>}
    </>
  );
}
