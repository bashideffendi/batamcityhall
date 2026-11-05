"use client";

import { useEffect, useRef } from "react";
import { useSiteTheme } from "@/components/site/useSiteTheme";
import { timeBasedTheme, type ThemeMode } from "@/features/langit-laut/lib/radar";
import { applyTheme, storedTheme } from "@/lib/theme";

const keSitus = (t: ThemeMode) => (t === "dark" ? "dark" : "light");

/**
 * Tema Langit & Laut: otomatis ikut jam WIB (06–18 terang) sampai pengguna memilih lewat tombol di
 * strip navigasi situs. Flip otomatis DITUNDA saat `isBusy()` (animasi jalan / kamera terbuka).
 */
export function useThemeMode(isBusy: () => boolean): ThemeMode {
  const site = useSiteTheme();
  const busy = useRef(isBusy);
  useEffect(() => {
    busy.current = isBusy;
  });

  useEffect(() => {
    const sesuaikan = () => {
      if (storedTheme() || busy.current()) return;
      applyTheme(keSitus(timeBasedTheme()));
    };
    // Datang lewat navigasi klien: skrip di layout hanya jalan saat halaman dimuat penuh.
    sesuaikan();
    const t = setInterval(sesuaikan, 60 * 1000);
    return () => clearInterval(t);
  }, []);

  return site === "dark" ? "dark" : "light";
}
