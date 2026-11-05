"use client";

import { useSyncExternalStore } from "react";
import { buatSimpanan } from "./simpanan";
import { convertPrice, CURRENCIES, type Currency } from "./format";
import type { Lang } from "./types";

const simpanan = buatSimpanan<Currency>(
  "bch-makan-mata-uang",
  "IDR",
  (m) => (m && (CURRENCIES as string[]).includes(m) ? (m as Currency) : "IDR"),
  (v) => v,
);

export function useCurrency() {
  const currency = useSyncExternalStore(simpanan.langgan, simpanan.ambil, simpanan.ambilServer);
  return {
    currency,
    setCurrency: simpanan.simpan,
    /** Format teks harga rupiah ke mata uang aktif. */
    fmt: (priceIdr: string, lang: Lang) => convertPrice(priceIdr, currency, lang),
  };
}
