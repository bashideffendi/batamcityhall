"use client";

import { useEffect, useState } from "react";
import type { EntriFeri } from "./feri-terakhir";

// Satu permintaan per kunjungan halaman: widget di Hari Ini dan di Loket memakai hasil yang sama.
let janji: Promise<EntriFeri[]> | null = null;

function muat() {
  janji ??= fetch("/jalan/feri/terakhir.json").then((r) => {
    if (!r.ok) {
      janji = null;
      throw new Error(String(r.status));
    }
    return r.json() as Promise<EntriFeri[]>;
  });
  return janji;
}

export function useEntriFeri() {
  const [data, setData] = useState<EntriFeri[] | null>(null);
  const [gagal, setGagal] = useState(false);
  useEffect(() => {
    let hidup = true;
    muat()
      .then((d) => hidup && setData(d))
      .catch(() => {
        janji = null;
        if (hidup) setGagal(true);
      });
    return () => {
      hidup = false;
    };
  }, []);
  return { data, gagal };
}
