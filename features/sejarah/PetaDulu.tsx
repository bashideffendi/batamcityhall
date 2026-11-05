"use client";

import { Map as MapLibre, type ErrorEvent, type MapLayerMouseEvent } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import { useSiteTheme } from "@/components/site/useSiteTheme";
import { pasangGlobalPeta, webglAda } from "@/features/peta/global";
import { baseStyle, MAP_BOUNDS, SOURCE_ID, TAMPILAN_AWAL } from "@/features/peta/style";
import { readTheme } from "@/lib/theme";
import { gayaDulu, LAYER_KLIK_DULU } from "./dulu-peta";
import type { Keadaan, TitikDulu } from "./dulu-slider";

const gerakTenang = () =>
  document.documentElement.dataset.gerak === "tenang" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const TEKS_PETA = {
  "Map.Title": "Peta titik Batam Dulu. Semua titik juga ada di daftar kartu di bawah peta.",
  "AttributionControl.ToggleAttribution": "Buka atau tutup atribusi",
  "CooperativeGesturesHandler.WindowsHelpText": "Tekan Ctrl sambil menggulir untuk memperbesar peta",
  "CooperativeGesturesHandler.MacHelpText": "Tekan ⌘ sambil menggulir untuk memperbesar peta",
  "CooperativeGesturesHandler.MobileHelpText": "Geser dengan dua jari untuk menggerakkan peta",
};

type Props = {
  titik: TitikDulu[];
  keadaan: Record<string, Keadaan>;
  dipilih: string | null;
  onPilih: (pf: string) => void;
};

export default function PetaDulu({ titik, keadaan, dipilih, onPilih }: Props) {
  const wadah = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapLibre | null>(null);
  const [gagal, setGagal] = useState(() => !webglAda());
  const theme = useSiteTheme();
  const pilih = useRef(onPilih);
  useEffect(() => {
    pilih.current = onPilih;
  }, [onPilih]);

  useEffect(() => {
    const el = wadah.current;
    if (!el || !webglAda()) return;
    pasangGlobalPeta();
    const m = new MapLibre({
      container: el,
      style: baseStyle(readTheme(), window.location.origin),
      bounds: TAMPILAN_AWAL,
      fitBoundsOptions: { padding: 24 },
      maxBounds: MAP_BOUNDS,
      minZoom: 7,
      maxZoom: 16,
      maxPitch: 0,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
      renderWorldCopies: false,
      cooperativeGestures: true,
      fadeDuration: gerakTenang() ? 0 : 300,
      attributionControl: { compact: false },
      locale: TEKS_PETA,
    });
    m.touchZoomRotate.disableRotation();
    m.keyboard.disableRotation();
    // Hanya sumber peta dasar yang menentukan gagal, dan hanya sebelum tampilan pertama selesai.
    let selesai = false;
    m.once("load", () => {
      selesai = true;
      setMap(m);
    });
    m.on("error", (e: ErrorEvent & { sourceId?: string }) => {
      if (!selesai && e.sourceId === SOURCE_ID) setGagal(true);
    });
    const klik = (e: MapLayerMouseEvent) => {
      const pf = e.features?.[0]?.properties?.pf;
      if (typeof pf === "string") pilih.current(pf);
    };
    m.on("click", LAYER_KLIK_DULU, klik);
    const penunjuk = (nilai: string) => () => {
      m.getCanvas().style.cursor = nilai;
    };
    m.on("mouseenter", LAYER_KLIK_DULU, penunjuk("pointer"));
    m.on("mouseleave", LAYER_KLIK_DULU, penunjuk(""));
    // Tekstur kertas tidak boleh menimpa kanvas peta (laporan 05).
    document.body.classList.add("bch-no-grain");
    return () => {
      document.body.classList.remove("bch-no-grain");
      m.remove();
    };
  }, []);

  useEffect(() => {
    if (!map) return;
    map.setStyle(gayaDulu(baseStyle(theme, window.location.origin), theme, titik, keadaan, dipilih));
  }, [map, theme, titik, keadaan, dipilih]);

  useEffect(() => {
    if (!map || !dipilih) return;
    const t = titik.find((x) => x.pf === dipilih);
    if (t) map.easeTo({ center: [t.lng, t.lat], zoom: 11.5, duration: gerakTenang() ? 0 : 600 });
  }, [map, dipilih, titik]);

  if (gagal)
    return (
      <p className="bch-note" data-tone="caution">
        Peta gagal dimuat. Semua lokasi tetap ada di daftar.
      </p>
    );
  return <div ref={wadah} className="sj-peta" data-titik={titik.length} />;
}
