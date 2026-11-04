import placesRaw from "@/data/makan/places.json";
import categoriesRaw from "@/data/makan/categories.json";
import areasRaw from "@/data/makan/areas.json";
import ferriesRaw from "@/data/makan/ferries.json";
import type { Place, Category, Area, Ferry, PlaceWithGeo } from "./types";

export const categories = categoriesRaw as Category[];
export const areas = areasRaw as Area[];
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

function nearestFerry(lat: number, lng: number): { id: string; km: number } {
  let best = { id: ferries[0].id, km: Infinity };
  for (const f of ferries) {
    const km = haversineKm(lat, lng, f.lat, f.lng);
    if (km < best.km) best = { id: f.id, km };
  }
  return best;
}

/** Salin tanpa rating dan reviews: data tetap tersimpan di JSON, tetapi tidak sampai ke UI. */
function tanpaRating(p: Place): Omit<Place, "rating" | "reviews"> {
  const salinan: Partial<Place> = { ...p };
  delete salinan.rating;
  delete salinan.reviews;
  return salinan as Omit<Place, "rating" | "reviews">;
}

export const places: PlaceWithGeo[] = (placesRaw as unknown as Place[]).map((mentah) => {
  const p = tanpaRating(mentah);
  const nf = nearestFerry(p.lat, p.lng);
  return { ...p, nearestFerryId: nf.id, nearestFerryKm: Math.round(nf.km * 10) / 10 };
});

export const placeMap: Record<string, PlaceWithGeo> = Object.fromEntries(places.map((p) => [p.id, p]));

export function getPlace(slug: string): PlaceWithGeo | undefined {
  return Object.hasOwn(placeMap, slug) ? placeMap[slug] : undefined;
}

/** Jumlah tempat per id kategori. */
export const categoryCounts: Record<string, number> = places.reduce(
  (acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  },
  {} as Record<string, number>,
);
