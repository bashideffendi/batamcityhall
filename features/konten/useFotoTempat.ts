"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { fotoTempat, type Foto } from "@/features/makan/lib/foto";

// Foto dari admin dimuat sekali per kunjungan. Selama basis data belum tersambung tidak ada permintaan sama sekali.
const AKTIF = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) || process.env.NEXT_PUBLIC_MODE_CONTOH === "1";
const KOSONG: Record<string, Foto[]> = {};

let peta = KOSONG;
let sudahMuat = false;
const pendengar = new Set<() => void>();

function muat() {
  if (sudahMuat || !AKTIF) return;
  sudahMuat = true;
  fetch("/api/konten/foto")
    .then((r) => (r.ok ? (r.json() as Promise<Record<string, Foto[]>>) : KOSONG))
    .then((d) => {
      peta = d;
      for (const p of pendengar) p();
    })
    .catch(() => {});
}

const langgan = (p: () => void) => {
  pendengar.add(p);
  return () => {
    pendengar.delete(p);
  };
};

/** Foto di repo lebih dulu, lalu foto dari admin. Saat render server hanya foto di repo. */
export function useFotoTempat(id: string): Foto[] {
  const m = useSyncExternalStore(
    langgan,
    () => peta,
    () => KOSONG,
  );
  useEffect(muat, []);
  return useMemo(() => {
    const tambahan = Object.hasOwn(m, id) ? m[id] : [];
    return tambahan.length ? [...fotoTempat(id), ...tambahan] : fotoTempat(id);
  }, [m, id]);
}
