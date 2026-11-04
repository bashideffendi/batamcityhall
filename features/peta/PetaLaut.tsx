"use client";

import { addProtocol, Map as MapLibre, setWorkerUrl, type ErrorEvent } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";
import { useEffect, useRef, useState } from "react";
import { useSiteTheme } from "@/components/site/useSiteTheme";
import { readTheme } from "@/lib/theme";
import ItikBerbaris from "./ItikBerbaris";
import { Kartusis, Mawar, SkalaBatang } from "./OrnamenChart";
import { baseStyle, MAP_BOUNDS, SOURCE_ID, TAMPILAN_AWAL } from "./style";
import TepiChart from "./TepiChart";
import { usePandangan } from "./usePandangan";

type Status = "memuat" | "siap" | "gagal";

// Terjemahan teks kontrol bawaan MapLibre. Map.Title menjadi aria-label kanvas.
const TEKS_PETA = {
  "Map.Title": "Peta laut Batam. Geser dengan tombol panah, perbesar dengan tombol plus dan minus.",
  "AttributionControl.ToggleAttribution": "Buka atau tutup atribusi",
  "CooperativeGesturesHandler.WindowsHelpText": "Tekan Ctrl sambil menggulir untuk memperbesar peta",
  "CooperativeGesturesHandler.MacHelpText": "Tekan ⌘ sambil menggulir untuk memperbesar peta",
  "CooperativeGesturesHandler.MobileHelpText": "Geser dengan dua jari untuk menggerakkan peta",
};

// Worker dan protokol bersifat global di MapLibre, jadi cukup dipasang sekali per halaman.
// MapLibre 6 mencari worker di sebelah modulnya sendiri, dan setelah dibundel berkas itu tidak ada di
// sana. Pola new URL(..., import.meta.url) membuat bundler menyalinnya sebagai aset statis.
let globalTerpasang = false;
function pasangGlobal() {
  if (globalTerpasang) return;
  setWorkerUrl(new URL("../../node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs", import.meta.url).href);
  addProtocol("pmtiles", new Protocol().tile);
  globalTerpasang = true;
}

const webglAda = () => {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
};

const gerakTenang = () =>
  document.documentElement.dataset.gerak === "tenang" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function PetaLaut() {
  const wadah = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapLibre | null>(null);
  const [status, setStatus] = useState<Status>(() => (webglAda() ? "memuat" : "gagal"));
  const theme = useSiteTheme();
  const pandangan = usePandangan(map);

  useEffect(() => {
    const el = wadah.current;
    if (!el || !webglAda()) return;
    pasangGlobal();

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
      // Peta ada di atas halaman yang bisa digulir: satu jari harus tetap menggulir halaman.
      cooperativeGestures: true,
      fadeDuration: gerakTenang() ? 0 : 300,
      attributionControl: { compact: false },
      locale: TEKS_PETA,
    });
    m.touchZoomRotate.disableRotation();
    m.keyboard.disableRotation();

    // Hanya sumber peta dasar yang menentukan gagal, dan hanya sebelum tampilan pertama selesai.
    // Tile yang sesekali gagal setelah itu tidak perlu menutup peta.
    let selesai = false;
    m.on("error", (e: ErrorEvent & { sourceId?: string }) => {
      if (selesai || e.sourceId !== SOURCE_ID) return;
      selesai = true;
      setStatus("gagal");
    });
    // Bukan "idle": selama pengguna menggeser atau memuat tile baru, idle terus tertunda.
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
    map?.setStyle(baseStyle(theme, window.location.origin));
  }, [map, theme]);

  return (
    <section className="peta" aria-label="Peta laut Batam" data-status={status} data-tema={theme}>
      <div ref={wadah} className="peta-kanvas" />
      {status === "gagal" && <p className="peta-gagal">Peta gagal dimuat. Laut masih ada, kami saja yang belum.</p>}
      {status === "memuat" && <ItikBerbaris />}
      {status === "siap" && map && pandangan && (
        <>
          <TepiChart map={map} pandangan={pandangan} />
          <Kartusis pandangan={pandangan} />
          <Mawar />
          <SkalaBatang pandangan={pandangan} />
          <div className="peta-zoom">
            <button
              type="button"
              className="peta-zoom-btn"
              aria-label="Perbesar peta"
              onClick={() => map.zoomIn({ animate: !gerakTenang() })}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
            <button
              type="button"
              className="peta-zoom-btn"
              aria-label="Perkecil peta"
              onClick={() => map.zoomOut({ animate: !gerakTenang() })}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
              </svg>
            </button>
          </div>
        </>
      )}
    </section>
  );
}
