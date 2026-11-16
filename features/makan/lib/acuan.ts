// Data acuan Makanan yang kecil: kategori, kawasan, dan terminal feri. Tanpa daftar tempat, jadi aman diimpor
// komponen klien di halaman yang tidak menampilkan daftar (Cara Kami Memilih, indeks Hidangan). Daftar tempat dan
// hitungannya ada di ./data.
import categoriesRaw from "@/data/makan/categories.json";
import areasRaw from "@/data/makan/areas.json";
import ferriesRaw from "@/data/makan/ferries.json";
import type { Area, Category, Ferry } from "./types";

export const categories = categoriesRaw as Category[];
// Nama area tampil tanpa garis miring (pedoman 2.7). Berkasnya tetap, karena konversi membaca kecamatan dari sana.
export const areas = (areasRaw as Area[]).map((a) => ({ ...a, name: a.name.replace(/\s*\/\s*/g, ", ") }));
export const ferries = ferriesRaw as Ferry[];

export const categoryMap: Record<string, Category> = Object.fromEntries(categories.map((c) => [c.id, c]));
export const areaMap: Record<string, Area> = Object.fromEntries(areas.map((a) => [a.id, a]));
export const ferryMap: Record<string, Ferry> = Object.fromEntries(ferries.map((f) => [f.id, f]));

/** Jarak lingkaran besar dalam km. */
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
