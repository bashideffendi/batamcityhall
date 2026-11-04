"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const PERISTIWA = "bch:param-url";

function langgan(f: () => void) {
  window.addEventListener("popstate", f);
  window.addEventListener(PERISTIWA, f);
  return () => {
    window.removeEventListener("popstate", f);
    window.removeEventListener(PERISTIWA, f);
  };
}
const ambil = () => window.location.search;
const ambilServer = () => null;

/**
 * Filter disimpan di URL. `siap` false saat render server dan tanpa JS: halaman tetap mencetak daftar penuh,
 * sedangkan kontrol yang butuh JS disembunyikan. useSearchParams tidak dipakai karena memaksa daftar dirender di klien.
 */
export function useParamUrl() {
  const cari = useSyncExternalStore(langgan, ambil, ambilServer);
  const param = useMemo(() => new URLSearchParams(cari ?? ""), [cari]);
  const tulis = useCallback((ubah: Record<string, string | null>) => {
    const p = new URLSearchParams(window.location.search);
    for (const [k, v] of Object.entries(ubah)) {
      if (v) p.set(k, v);
      else p.delete(k);
    }
    const q = p.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${q ? `?${q}` : ""}${window.location.hash}`);
    window.dispatchEvent(new Event(PERISTIWA));
  }, []);
  return { siap: cari !== null, param, tulis };
}
