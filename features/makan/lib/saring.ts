// Logika filter dan urutan Makan, tanpa React supaya bisa dites langsung.
import { haversineKm } from "./data";
import { isOpenNow } from "./format";
import type { HalalStatus, PriceTier, RecLabel, PlaceWithGeo } from "./types";

export type SortKey = "featured" | "ferry" | "az" | "nearby";
export interface LatLng {
  lat: number;
  lng: number;
}

export interface FilterState {
  query: string;
  cats: string[];
  areas: string[];
  halal: HalalStatus[];
  tiers: PriceTier[];
  labels: RecLabel[];
  ferry: string | null;
  openNow: boolean;
  sort: SortKey;
  userLoc: LatLng | null;
}

export const EMPTY: FilterState = {
  query: "",
  cats: [],
  areas: [],
  halal: [],
  tiers: [],
  labels: [],
  ferry: null,
  openNow: false,
  sort: "featured",
  userLoc: null,
};

/** Radius "dekat terminal". Jarak dihitung dari koordinat perkiraan, jadi ini juga perkiraan. */
export const RADIUS_FERI_KM = 6;

/** `sekarang` null berarti waktu belum diketahui (render server): filter buka sekarang dilewati. */
export function cocok(p: PlaceWithGeo, s: FilterState, sekarang: number | null): boolean {
  if (s.cats.length && !s.cats.includes(p.category)) return false;
  if (s.areas.length && !s.areas.includes(p.area)) return false;
  if (s.halal.length && !s.halal.includes(p.halal)) return false;
  if (s.tiers.length && !s.tiers.includes(p.price_tier)) return false;
  if (s.labels.length && !s.labels.some((l) => p.labels.includes(l))) return false;
  if (s.ferry && (p.nearestFerryId !== s.ferry || p.nearestFerryKm > RADIUS_FERI_KM)) return false;
  // Jam tidak diketahui tidak dihitung buka.
  if (s.openNow && sekarang !== null && isOpenNow(p.hours, new Date(sekarang)) !== true) return false;
  if (s.query.trim()) {
    const q = s.query.trim().toLowerCase();
    const hay = [
      p.name,
      p.signature,
      p.desc_id,
      p.desc_en,
      p.desc_zh ?? "",
      p.address,
      ...p.subcategory,
      ...p.tags,
      p.category,
      p.area,
    ]
      .join(" ")
      .toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

export function urutkan(list: PlaceWithGeo[], sort: SortKey, userLoc: LatLng | null): PlaceWithGeo[] {
  const arr = [...list];
  switch (sort) {
    case "ferry":
      return arr.sort((a, b) => a.nearestFerryKm - b.nearestFerryKm);
    case "nearby":
      if (!userLoc) return arr;
      return arr.sort(
        (a, b) =>
          haversineKm(userLoc.lat, userLoc.lng, a.lat, a.lng) - haversineKm(userLoc.lat, userLoc.lng, b.lat, b.lng),
      );
    case "az":
      return arr.sort((a, b) => a.name.localeCompare(b.name));
    case "featured":
    default:
      // Pilihan kurator dulu, sisanya menurut urutan data. Rating Google tidak ikut menentukan.
      return arr.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}

export function saring(semua: PlaceWithGeo[], s: FilterState, sekarang: number | null): PlaceWithGeo[] {
  return urutkan(
    semua.filter((p) => cocok(p, s, sekarang)),
    s.sort,
    s.userLoc,
  );
}

export function jumlahAktif(s: FilterState): number {
  return (
    (s.query.trim() ? 1 : 0) +
    s.cats.length +
    s.areas.length +
    s.halal.length +
    s.tiers.length +
    s.labels.length +
    (s.ferry ? 1 : 0) +
    (s.openNow ? 1 : 0)
  );
}
