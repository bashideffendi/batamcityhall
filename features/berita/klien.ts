"use client";

import { useEffect, useState } from "react";
import type { BeritaResponse } from "./sumber";

const WIB = "Asia/Jakarta";
const formatJam = new Intl.DateTimeFormat("id-ID", { timeZone: WIB, hour: "2-digit", minute: "2-digit" });
const formatTanggal = new Intl.DateTimeFormat("id-ID", {
  timeZone: WIB,
  day: "numeric",
  month: "long",
  year: "numeric",
});

export const jamWib = (iso: string) => formatJam.format(new Date(iso));
export const tanggalWib = (iso: string) => formatTanggal.format(new Date(iso));

/** Baris di halaman berita: "5 November 2026, pukul 08.00 WIB". */
export const waktuLengkap = (iso: string) => `${tanggalWib(iso)}, pukul ${jamWib(iso)} WIB`;

/** Baris di cuplikan beranda: jam untuk berita hari ini, tanggal untuk berita lebih lama (pedoman 3.2). */
export const waktuCuplikan = (iso: string, sekarang: Date = new Date()) =>
  tanggalWib(iso) === formatTanggal.format(sekarang) ? `pukul ${jamWib(iso)} WIB` : tanggalWib(iso);

export type KeadaanBerita = { fase: "memuat" } | { fase: "gagal" } | { fase: "siap"; data: BeritaResponse };

const bentukBenar = (x: unknown): x is BeritaResponse => {
  const b = x as BeritaResponse | null;
  return !!b && Array.isArray(b.item) && Array.isArray(b.sumber);
};

/** 503 tetap dibaca isinya: bentuknya sama, hanya daftarnya kosong. */
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
