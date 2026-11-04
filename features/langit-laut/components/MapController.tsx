"use client";

import { useCallback, useEffect, useRef } from "react";
import { reduceMotion } from "@/features/langit-laut/lib/client";
import { keLngLatBounds, kePaddingMapLibre, type Padding } from "@/features/langit-laut/lib/peta-lapisan";
import {
  CCTV_MAX_ZOOM,
  MAX_ZOOM,
  MIN_ZOOM,
  OMBAK_MIN_ZOOM,
  VIEWS,
  type Mode,
  type ViewKey,
} from "@/features/langit-laut/lib/radar";
import { usePeta } from "./PetaLangit";

export type { Padding };

// Batas zoom per mode + fit peta ke bounding box view, dengan padding dinamis sesuai
// tinggi panel/topbar asli. Fit ulang saat rotasi layar — bukan tiap resize kecil.
export default function MapController({
  view,
  mode,
  getPadding,
  collapsed,
}: {
  view: ViewKey;
  mode: Mode;
  getPadding: () => Padding;
  collapsed: boolean;
}) {
  const map = usePeta();
  const mounted = useRef(false);
  const viewRef = useRef(view);
  const modeRef = useRef(mode);
  useEffect(() => {
    viewRef.current = view;
    modeRef.current = mode;
  });

  const fit = useCallback(
    (v: ViewKey, animate: boolean, duration = 800) => {
      const b = keLngLatBounds(VIEWS[v].bounds);
      const padding = kePaddingMapLibre(getPadding());
      if (!animate || reduceMotion()) map.fitBounds(b, { padding, animate: false });
      else map.fitBounds(b, { padding, duration });
    },
    [map, getPadding],
  );

  // SATU effect untuk [mode, view]: batas zoom diperbarui, lalu fit.
  //  - OMBAK: zoom-out lebih jauh (tak ada radar yang pecah) biar laut jauh kelihatan;
  //  - CCTV: zoom-in lebih dalam biar pin berdempet bisa dipisah & diklik;
  //  - ganti mode TANPA ganti view tetap reframe (tinggi panel beda per mode).
  useEffect(() => {
    map.setMinZoom(mode === "ombak" ? OMBAK_MIN_ZOOM : MIN_ZOOM);
    map.setMaxZoom(mode === "cctv" ? CCTV_MAX_ZOOM : MAX_ZOOM);
    if (!mounted.current) {
      mounted.current = true;
      map.resize();
      fit(view, false);
      return;
    }
    fit(view, true);
  }, [mode, view, map, fit]);

  // panel ditutup/dibuka -> tinggi panel berubah -> re-frame halus pakai ruang baru.
  // KECUALI di CCTV: di sana pengguna menjelajah dengan zoom sendiri, dan membuka panel
  // karena gelembung diketuk tidak boleh menerbangkan peta balik ke kotak kamera.
  const firstCollapse = useRef(true);
  useEffect(() => {
    if (firstCollapse.current) {
      firstCollapse.current = false;
      return;
    }
    if (modeRef.current === "cctv") return;
    fit(viewRef.current, true, 400);
  }, [collapsed, fit]);

  // resize: fit ulang HANYA kalau lebar berubah banyak (rotasi/split-screen) — toolbar browser
  // muncul/hilang atau keluar fullscreen video CCTV jangan sampai membuang pan/zoom pengguna.
  useEffect(() => {
    let lastW = window.innerWidth;
    let t: number | null = null;
    const onResize = () => {
      if (t !== null) window.clearTimeout(t);
      t = window.setTimeout(() => {
        const w = window.innerWidth;
        if (Math.abs(w - lastW) > 80) {
          lastW = w;
          fit(viewRef.current, false);
        }
      }, 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (t !== null) window.clearTimeout(t);
    };
  }, [fit]);

  return null;
}
