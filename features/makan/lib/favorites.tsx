"use client";

import { useSyncExternalStore } from "react";
import { buatSimpanan } from "./simpanan";

const KOSONG: string[] = [];

const simpanan = buatSimpanan<string[]>(
  "bch-makan-tersimpan",
  KOSONG,
  (m) => {
    const v: unknown = m ? JSON.parse(m) : KOSONG;
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : KOSONG;
  },
  (v) => JSON.stringify(v),
);

const tanpaLangganan = () => () => {};

export function useFavorites() {
  const ids = useSyncExternalStore(simpanan.langgan, simpanan.ambil, simpanan.ambilServer);
  // false di server dan saat hydration, supaya pesan "belum ada" tidak berkedip untuk yang punya daftar.
  const ready = useSyncExternalStore(
    tanpaLangganan,
    () => true,
    () => false,
  );
  return {
    ids,
    ready,
    has: (id: string) => ids.includes(id),
    toggle: (id: string) => simpanan.simpan(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]),
    /** Tambah banyak slug sekaligus (impor). Yang sudah ada tidak digandakan. */
    tambah: (baru: readonly string[]) => simpanan.simpan([...new Set([...ids, ...baru])]),
  };
}
