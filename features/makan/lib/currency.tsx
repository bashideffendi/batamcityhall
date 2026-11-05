"use client";

import { useSyncExternalStore } from "react";
import { buatSimpanan } from "./simpanan";
import { convertPrice, CURRENCIES, type Currency } from "./format";
import type { Lang } from "./types";

// Rupiah selalu tampil. Pilihan ini hanya menentukan perkiraan di sampingnya. Bawaan S$, karena banyak
// pembaca Makan datang dari Singapura.
const simpanan = buatSimpanan<Currency>(
  "bch-makan-mata-uang",
  "SGD",
  (m) => (m && (CURRENCIES as string[]).includes(m) ? (m as Currency) : "SGD"),
  (v) => v,
);

export function useCurrency() {
  const currency = useSyncExternalStore(simpanan.langgan, simpanan.ambil, simpanan.ambilServer);
  return {
    currency,
    setCurrency: simpanan.simpan,
    /** Perkiraan harga dalam mata uang pilihan. Kosong kalau pilihannya rupiah saja. */
    fmt: (priceIdr: string, lang: Lang) => convertPrice(priceIdr, currency, lang),
  };
}
