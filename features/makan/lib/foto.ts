import fotoRaw from "@/data/makan/foto.json";

/** Satu foto tempat. Disusun scripts/foto-makan.mjs dari public/foto/makan/<id>/. */
export interface Foto {
  src: string;
  w: number;
  h: number;
  alt?: string;
  kredit?: string;
}

const FOTO = fotoRaw as Record<string, Foto[]>;

export function fotoTempat(id: string): Foto[] {
  return Object.hasOwn(FOTO, id) ? FOTO[id] : [];
}

/** Paling banyak lima foto di mosaik. Sisanya dibuka lewat lightbox. */
export const MOSAIK_MAKS = 5;

/** Jumlah bingkai kosong saat belum ada foto: satu ilustrasi hidangan dan empat bingkai. */
export const BINGKAI_KOSONG = 4;

/** Pola mosaik mengikuti jumlah foto, supaya tidak pernah ada lubang di kisi. */
export function polaMosaik(jumlah: number): number {
  return Math.min(Math.max(jumlah, 0), MOSAIK_MAKS);
}
