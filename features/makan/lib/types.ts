export type HalalStatus = "halal" | "non-halal" | "muslim-friendly";
export type PriceTier = "$" | "$$" | "$$$";
export type RecLabel = "legendaris" | "hits" | "wajib-coba" | "hidden-gem";
export type Lang = "id" | "en" | "zh";

/** Baris data/makan/places.json apa adanya. */
export interface Place {
  id: string;
  name: string;
  category: string;
  subcategory: string[];
  halal: HalalStatus;
  labels: RecLabel[];
  desc_id: string;
  desc_en: string;
  desc_zh?: string;
  signature: string;
  price_tier: PriceTier;
  price_idr: string;
  address: string;
  area: string;
  lat: number;
  lng: number;
  coord_approx: boolean;
  gmaps: string;
  rating: number | null;
  reviews: number | null;
  hours: string;
  phone: string;
  instagram: string;
  payments: string[];
  nearest_ferry: string;
  ferry_km: number | null;
  tags: string[];
  featured: boolean;
  verified: boolean;
  last_verified: string;
}

/** Emoji dan warna lama tetap ada di JSON, tetapi tidak dipakai UI. */
export interface Category {
  id: string;
  name_id: string;
  name_en: string;
  name_zh: string;
}

export interface Area {
  id: string;
  name: string;
}

/** Terminal dari data feri situs (scripts/konversi-makan.mjs --feri), bukan data batam-bites. */
export interface Ferry {
  id: string;
  id_kanonik: string;
  label: string;
  nama: string;
  lat: number;
  lng: number;
  status_koordinat: "terverifikasi" | "perlu_cek_ulang" | "perlu_diisi_user";
}

/**
 * Tempat seperti yang dilihat UI. Rating dan jumlah ulasan sengaja dibuang di lib/data.ts, jadi tidak
 * ada komponen yang bisa menampilkan atau mengurutkan berdasarkan angka itu (docs/DATA_DECISIONS.md).
 */
export interface PlaceWithGeo extends Omit<Place, "rating" | "reviews"> {
  nearestFerryId: string;
  nearestFerryKm: number;
}

/** Emoji dan warna lama tetap ada di JSON, tetapi tidak dipakai UI. */
export interface Trail {
  id: string;
  title_id: string;
  title_en: string;
  title_zh: string;
  subtitle_id: string;
  subtitle_en: string;
  subtitle_zh: string;
  duration_id: string;
  duration_en: string;
  duration_zh: string;
  area: string;
  stops: string[];
}
