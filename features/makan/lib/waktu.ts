"use client";

import { useSyncExternalStore } from "react";

const MENIT = 60_000;

function langgan(f: () => void) {
  const t = setInterval(f, MENIT);
  return () => clearInterval(t);
}
const ambil = () => Math.floor(Date.now() / MENIT) * MENIT;
const ambilServer = () => null;

/**
 * Waktu sekarang, dibulatkan ke menit. null di server: halaman ini statis, jadi status "buka sekarang"
 * tidak boleh ikut dicetak saat build. Status itu baru muncul di browser.
 */
export function useSekarang(): number | null {
  return useSyncExternalStore(langgan, ambil, ambilServer);
}
