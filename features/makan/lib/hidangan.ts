// Sumbu utama Makanan: 32 kategori pemilik dalam enam rumpun. Rumpun hanya alat bantu baca di indeks.
// Kode kategori sama dengan alamatnya.
import categoriesRaw from "@/data/makan/categories.json";
import type { Lang } from "./types";

type Tri = Record<Lang, string>;
type BarisKategori = { id: string; ket_id?: string; ket_en?: string };

const KATEGORI = categoriesRaw as BarisKategori[];
const ADA = new Set(KATEGORI.map((c) => c.id));

export const slugHidangan = (kategori: string) => kategori;
export const kategoriDariSlug = (slug: string): string | undefined => (ADA.has(slug) ? slug : undefined);
export const semuaSlugHidangan = KATEGORI.map((c) => c.id);

export const grafisHidangan = (kategori: string) => `/grafis/hidangan/${kategori}.webp`;

export interface Rumpun {
  id: string;
  nama: Tri;
  kategori: string[];
}

// Urutan mengikuti daftar pemilik.
export const RUMPUN: Rumpun[] = [
  {
    id: "laut",
    nama: { id: "Laut dan Pesisir", en: "Sea and Coast", zh: "海味" },
    kategori: ["seafood", "sop-ikan", "mie-tarempa"],
  },
  {
    id: "nusantara",
    nama: { id: "Nusantara", en: "Indonesian Plates", zh: "印尼家常" },
    kategori: ["makanan-padang", "makanan-jawa", "makanan-sunda", "makanan-sulawesi", "lapo-batak", "pempek", "penyetan", "soto", "sate", "bakso-mie-ayam", "nasi-mie-goreng", "gado-pecel"],
  },
  {
    id: "tionghoa",
    nama: { id: "Tionghoa dan Kopitiam", en: "Chinese and Kopitiam", zh: "中餐与咖啡店" },
    kategori: ["chinese-food", "dimsum", "nasi-ayam-hainan", "bubur", "kopitiam"],
  },
  {
    id: "mancanegara",
    nama: { id: "Mancanegara", en: "International", zh: "各国料理" },
    kategori: ["makanan-jepang", "makanan-korea", "makanan-india", "martabak-prata", "western-steak"],
  },
  {
    id: "kudapan",
    nama: { id: "Kopi dan Kudapan", en: "Coffee and Sweets", zh: "咖啡与点心" },
    kategori: ["coffee-shop", "bakery", "kue-jajanan", "ice-cream"],
  },
  {
    id: "khusus",
    nama: { id: "Pilihan Khusus", en: "Special Picks", zh: "特别选择" },
    kategori: ["sarapan-pagi", "ayce", "vegetarian"],
  },
];

// Satu kalimat. Isinya dari daftar pemilik, menu andalan di data, atau pengertian umum hidangannya.
export const DEK_HIDANGAN: Record<string, Tri> = Object.fromEntries(
  KATEGORI.filter((c) => c.ket_id).map((c) => [c.id, { id: c.ket_id as string, en: c.ket_en ?? (c.ket_id as string), zh: c.ket_en ?? (c.ket_id as string) }]),
);
