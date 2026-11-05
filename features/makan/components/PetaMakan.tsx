"use client";

import { Map as MapLibre, NavigationControl, type ErrorEvent, type LayerSpecification } from "maplibre-gl";
import { muatGambar } from "@/features/peta/gambar-penanda";
import "maplibre-gl/dist/maplibre-gl.css";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useSiteTheme } from "@/components/site/useSiteTheme";
import { pasangGlobalPeta, webglAda } from "@/features/peta/global";
import { baseStyle, MAP_BOUNDS, MAP_CENTER, SOURCE_ID, type MapTheme } from "@/features/peta/style";
import { readTheme } from "@/lib/theme";
import { useI18n, type KunciTeks } from "../lib/i18n";
import { gabungGayaMakan } from "../lib/peta";

type Status = "memuat" | "siap" | "gagal";

const KonteksPeta = createContext<{ map: MapLibre; tema: MapTheme } | null>(null);

export function usePeta() {
  const k = useContext(KonteksPeta);
  if (!k) throw new Error("usePeta dipakai di luar PetaMakan");
  return k;
}

export const gerakTenang = () =>
  document.documentElement.dataset.gerak === "tenang" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Tambahkan sumber dan layernya sekali, lalu lepas saat komponen keluar. */
export function pasangLapisan(
  map: MapLibre,
  sumber: Record<string, GeoJSONSourceOptions>,
  layers: LayerSpecification[],
) {
  for (const [id, s] of Object.entries(sumber)) if (!map.getSource(id)) map.addSource(id, s);
  for (const l of layers) if (!map.getLayer(l.id)) map.addLayer(l);
  return () => {
    // Peta sudah dilepas lebih dulu kalau halaman pindah: tidak ada yang perlu dibersihkan.
    if (!map.style) return;
    for (const l of layers) if (map.getLayer(l.id)) map.removeLayer(l.id);
    for (const id of Object.keys(sumber)) if (map.getSource(id)) map.removeSource(id);
  };
}

type GeoJSONSourceOptions = Parameters<MapLibre["addSource"]>[1];

type Props = {
  /** Kunci teks untuk aria-label kanvas. */
  judul: KunciTeks;
  center?: [number, number];
  zoom?: number;
  /** false untuk mini-map: tidak bisa digeser, hanya menunjukkan area. */
  interaktif?: boolean;
  /** Menangkap gulir halaman hanya dengan Ctrl atau dua jari. */
  kooperatif?: boolean;
  className?: string;
  children?: ReactNode;
};

// Pemilik satu peta MapLibre di halaman Makan. Peta dasar sama dengan situs (features/peta/style.ts),
// lapisan fitur adalah komponen anak yang baru dirender setelah gaya selesai dimuat.
export default function PetaMakan({
  judul,
  center = MAP_CENTER,
  zoom = 10.5,
  interaktif = true,
  kooperatif = false,
  className = "",
  children,
}: Props) {
  const wadah = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapLibre | null>(null);
  const [status, setStatus] = useState<Status>(() => (webglAda() ? "memuat" : "gagal"));
  const tema = useSiteTheme();
  const { t, lang } = useI18n();
  const awal = useRef({ center, zoom, interaktif, kooperatif, judul: t(judul) });
  const bahasaAwal = useRef(lang);

  useEffect(() => {
    const el = wadah.current;
    if (!el || !webglAda()) return;
    pasangGlobalPeta();
    const a = awal.current;
    const indonesia = bahasaAwal.current === "id";
    const m = new MapLibre({
      container: el,
      style: baseStyle(readTheme(), window.location.origin, { chart: false }),
      center: a.center,
      zoom: a.zoom,
      minZoom: 8,
      maxZoom: 17,
      maxBounds: MAP_BOUNDS,
      maxPitch: 0,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
      renderWorldCopies: false,
      interactive: a.interaktif,
      cooperativeGestures: a.interaktif && a.kooperatif,
      attributionControl: { compact: false },
      locale: {
        "Map.Title": a.judul,
        "AttributionControl.ToggleAttribution": indonesia ? "Buka atau tutup atribusi" : "Toggle attribution",
        "NavigationControl.ZoomIn": indonesia ? "Perbesar peta" : "Zoom in",
        "NavigationControl.ZoomOut": indonesia ? "Perkecil peta" : "Zoom out",
        "CooperativeGesturesHandler.WindowsHelpText": indonesia
          ? "Tekan Ctrl sambil menggulir untuk memperbesar peta"
          : "Hold Ctrl and scroll to zoom the map",
        "CooperativeGesturesHandler.MacHelpText": indonesia
          ? "Tekan ⌘ sambil menggulir untuk memperbesar peta"
          : "Hold ⌘ and scroll to zoom the map",
        "CooperativeGesturesHandler.MobileHelpText": indonesia ? "Geser dengan dua jari" : "Use two fingers to move the map",
      },
    });
    m.on("styleimagemissing", (e) => muatGambar(m, e.id));
    if (a.interaktif) {
      m.touchZoomRotate.disableRotation();
      m.keyboard.disableRotation();
      m.addControl(new NavigationControl({ showCompass: false }), "top-right");
    }

    // Hanya sumber peta dasar yang menentukan gagal, dan hanya sebelum tampilan pertama selesai.
    let selesai = false;
    m.on("error", (e: ErrorEvent & { sourceId?: string }) => {
      if (selesai || e.sourceId !== SOURCE_ID) return;
      selesai = true;
      setStatus("gagal");
    });
    m.once("load", () => {
      setMap(m);
      if (selesai) return;
      selesai = true;
      setStatus("siap");
    });

    // Tekstur kertas tidak boleh menimpa kanvas peta (laporan 05).
    document.body.classList.add("bch-no-grain");
    return () => {
      document.body.classList.remove("bch-no-grain");
      m.remove();
    };
  }, []);

  useEffect(() => {
    map?.setStyle(baseStyle(tema, window.location.origin, { chart: false }), {
      transformStyle: (lama, baru) => gabungGayaMakan(lama, baru, tema),
    });
  }, [map, tema]);

  return (
    <div className={`mk-peta ${className}`} data-status={status} data-tema={tema}>
      <div ref={wadah} className="mk-peta-kanvas" />
      {status === "gagal" && <p className="mk-peta-pesan">{t("map_failed")}</p>}
      {status === "memuat" && (
        <p className="mk-peta-pesan" role="status">
          {t("map_loading")}
        </p>
      )}
      {map && <KonteksPeta.Provider value={{ map, tema }}>{children}</KonteksPeta.Provider>}
    </div>
  );
}
