"use client";

import { useEffect, useState } from "react";
import type { BeritaResponse } from "./sumber";

const WIB = "Asia/Jakarta";
const formatWaktu = new Intl.DateTimeFormat("id-ID", {
  timeZone: WIB,
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
const formatJam = new Intl.DateTimeFormat("id-ID", { timeZone: WIB, hour: "2-digit", minute: "2-digit" });
const formatHari = new Intl.DateTimeFormat("id-ID", {
  timeZone: WIB,
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export const waktuWib = (iso: string) => `${formatWaktu.format(new Date(iso))} WIB`;
export const jamWib = (iso: string) => `${formatJam.format(new Date(iso))} WIB`;
export const hariWib = (iso: string) => formatHari.format(new Date(iso));

export type KeadaanBerita = { fase: "memuat" } | { fase: "gagal" } | { fase: "siap"; data: BeritaResponse };

const bentukBenar = (x: unknown): x is BeritaResponse => {
  const b = x as BeritaResponse | null;
  return !!b && Array.isArray(b.item) && Array.isArray(b.sumber);
};

/** 503 tetap dibaca isinya: di situ ada status tiap feed, dan itu yang perlu ditulis ke warga. */
export function useBerita(): KeadaanBerita {
  const [keadaan, setKeadaan] = useState<KeadaanBerita>({ fase: "memuat" });
  useEffect(() => {
    const henti = new AbortController();
    fetch("/api/berita", { signal: henti.signal })
      .then((r) => r.json())
      .then((j: unknown) => {
        setKeadaan(bentukBenar(j) ? { fase: "siap", data: j } : { fase: "gagal" });
      })
      .catch(() => {
        if (!henti.signal.aborted) setKeadaan({ fase: "gagal" });
      });
    return () => henti.abort();
  }, []);
  return keadaan;
}
