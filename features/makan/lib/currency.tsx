"use client";

import { convertPrice } from "./format";
import type { Lang } from "./types";

// Rupiah selalu tampil, ditambah perkiraan S$ karena banyak pembaca Makanan datang dari Singapura.
export function useCurrency() {
  return { fmt: (priceIdr: string, lang: Lang) => convertPrice(priceIdr, "SGD", lang) };
}
