// Panduan: lima jalur dari data/makan/trails.json dan daftar yang dihitung dari data. Tidak ada isi karangan:
// daftar hitungan hanya memilih dari jam, harga, dan label yang sudah ada di data.
import { places } from "./data";
import { bukaLarut, bukaPagi, hargaTertinggi } from "./format";
import { grafisHidangan } from "./hidangan";
import { BATAS_MURAH } from "./saring";
import { trails, trailDuration, trailStops, trailSubtitle, trailTitle } from "./trails";
import type { Lang, PlaceWithGeo } from "./types";

type Tri = Record<Lang, string>;

export interface Panduan {
  id: string;
  judul: (lang: Lang) => string;
  dek: (lang: Lang) => string;
  /** Durasi untuk jalur. Daftar hitungan tidak punya. */
  durasi: (lang: Lang) => string;
  grafis: string;
  /** Jalur punya urutan dan garis di peta. */
  berurut: boolean;
  tempat: PlaceWithGeo[];
}

const hitungan = (
  id: string,
  judul: Tri,
  dek: Tri,
  kategoriGrafis: string,
  saring: (p: PlaceWithGeo) => boolean,
): Panduan => ({
  id,
  judul: (l) => judul[l],
  dek: (l) => dek[l],
  durasi: () => "",
  grafis: grafisHidangan(kategoriGrafis),
  berurut: false,
  tempat: places.filter(saring),
});

export const panduan: Panduan[] = [
  ...trails.map(
    (t): Panduan => ({
      id: t.id,
      judul: (l) => trailTitle(l, t),
      dek: (l) => trailSubtitle(l, t),
      durasi: (l) => trailDuration(l, t),
      grafis: `/grafis/panduan/${t.id}.webp`,
      berurut: true,
      tempat: trailStops(t),
    }),
  ),
  hitungan(
    "sarapan",
    { id: "Sarapan", en: "Breakfast", zh: "早餐" },
    { id: "Buka paling lambat pukul 08.00 WIB.", en: "Open by 8 a.m. WIB.", zh: "早上 8 点（WIB）前开门。" },
    "bubur",
    (p) => bukaPagi(p.hours),
  ),
  hitungan(
    "lewat-pukul-22",
    { id: "Lewat Pukul 22.00", en: "After 10 p.m.", zh: "晚上十点以后" },
    { id: "Masih buka sesudah pukul 22.00 WIB.", en: "Still open after 10 p.m. WIB.", zh: "晚上 10 点（WIB）后仍营业。" },
    "sate-kambing",
    (p) => bukaLarut(p.hours),
  ),
  hitungan(
    "legendaris",
    { id: "Legendaris", en: "Legendary", zh: "老字号" },
    { id: "Sudah buka puluhan tahun dan tetap ramai.", en: "Open for decades and still busy.", zh: "开业数十年，依然热闹。" },
    "kopitiam",
    (p) => p.labels.includes("legendaris"),
  ),
  hitungan(
    "di-bawah-50-ribu",
    { id: "Di Bawah Rp50 Ribu", en: "Under Rp50k", zh: "五万盾以内" },
    { id: "Kisaran harga sampai Rp50.000.", en: "Price range up to Rp50,000.", zh: "价格区间不超过 5 万印尼盾。" },
    "bakso",
    (p) => {
      const maks = hargaTertinggi(p.price_idr);
      return maks !== null && maks <= BATAS_MURAH;
    },
  ),
];

export function getPanduan(id: string): Panduan | undefined {
  return panduan.find((g) => g.id === id);
}

/** Panduan yang memuat tempat ini. */
export const panduanUntuk = (idTempat: string) => panduan.filter((g) => g.tempat.some((p) => p.id === idTempat));

/** Sampul beranda Makan. Diganti di sini. */
export const ID_SAMPUL = "seafood-classics";
