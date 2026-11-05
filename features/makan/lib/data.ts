import placesRaw from "@/data/makan/places.json";
import categoriesRaw from "@/data/makan/categories.json";
import areasRaw from "@/data/makan/areas.json";
import ferriesRaw from "@/data/makan/ferries.json";
import koordinatUser from "@/data/koordinat_user.json";
import { adalahPonsel } from "./format";
import type { Place, Category, Area, Ferry, PlaceWithGeo, RecLabel } from "./types";

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

/** Urutan label kurasi di pedoman 3.4. Data bisa menyimpan dua label; yang tampil dan disaring hanya satu. */
const URUTAN_LABEL: RecLabel[] = ["legendaris", "wajib-coba", "hits", "hidden-gem"];

export const satuLabel = (labels: readonly RecLabel[]): RecLabel[] =>
  URUTAN_LABEL.filter((l) => labels.includes(l)).slice(0, 1);

type KoordinatUser = Record<string, { lat: number; lng: number }>;

/** Koordinat hasil tools/import_koordinat.py menimpa koordinat lama: tempatnya jadi bukan lagi perkiraan. */
export function terapkanKoordinat<T extends { id: string; lat: number; lng: number; coord_approx: boolean }>(
  p: T,
  koordinat: KoordinatUser,
): T {
  const k = Object.hasOwn(koordinat, p.id) ? koordinat[p.id] : undefined;
  return k ? { ...p, lat: k.lat, lng: k.lng, coord_approx: false } : p;
}

export const places: PlaceWithGeo[] = (placesRaw as unknown as Place[]).map((mentah) => {
  const p = terapkanKoordinat(tanpaRating(mentah), koordinatUser as KoordinatUser);
  const nf = nearestFerry(p.lat, p.lng);
  return {
    ...p,
    labels: satuLabel(p.labels),
    // Nomor ponsel disembunyikan sampai pemilik memastikan itu nomor usaha (pedoman 8.3).
    phone: adalahPonsel(p.phone) ? "" : p.phone,
    nearestFerryId: nf.id,
    nearestFerryKm: Math.round(nf.km * 10) / 10,
  };
});

export const placeMap: Record<string, PlaceWithGeo> = Object.fromEntries(places.map((p) => [p.id, p]));

export function getPlace(slug: string): PlaceWithGeo | undefined {
  return Object.hasOwn(placeMap, slug) ? placeMap[slug] : undefined;
}

/** Tempat terdekat dari satu tempat. Koordinat perkiraan, jadi ini hanya untuk saran. */
export function tempatTerdekat(p: PlaceWithGeo, n: number): PlaceWithGeo[] {
  return places
    .filter((x) => x.id !== p.id)
    .map((x) => ({ x, km: haversineKm(p.lat, p.lng, x.lat, x.lng) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, n)
    .map(({ x }) => x);
}

/** Jumlah tempat per id kawasan. Kawasan tanpa tempat tidak punya halaman. */
export const areaCounts: Record<string, number> = places.reduce(
  (acc, p) => {
    acc[p.area] = (acc[p.area] ?? 0) + 1;
    return acc;
  },
  {} as Record<string, number>,
);
export const kawasanBerisi = areas
  .filter((a) => (areaCounts[a.id] ?? 0) > 0)
  .sort((a, b) => areaCounts[b.id] - areaCounts[a.id]);

/** Jumlah tempat per id kategori. */
export const categoryCounts: Record<string, number> = places.reduce(
  (acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  },
  {} as Record<string, number>,
);
