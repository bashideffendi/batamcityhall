import MiniSearch from "minisearch";
import type { KataPublik } from "./label";

/** Mesin pencari kamus. Mengembalikan fungsi: kueri ke himpunan id entri yang cocok. */
export function buatPencariKata(entri: KataPublik[]) {
  const mesin = new MiniSearch<KataPublik>({
    fields: ["kata", "arti", "contoh", "asal"],
    storeFields: [],
    searchOptions: { prefix: true, fuzzy: 0.15, combineWith: "AND", boost: { kata: 3 } },
    extractField: (doc, field) => String(doc[field as keyof KataPublik] ?? ""),
  });
  mesin.addAll(entri);
  return (kueri: string) => new Set(mesin.search(kueri).map((h) => String(h.id)));
}

/** Huruf pertama sebagai judul kelompok. */
export const hurufDari = (kata: string) => kata.charAt(0).toUpperCase();
