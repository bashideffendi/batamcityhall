export type HalalStatus = "halal" | "non-halal" | "muslim-friendly";
export type PriceTier = "$" | "$$" | "$$$";
export type RecLabel = "legendaris" | "hits" | "wajib-coba" | "hidden-gem";
export type Lang = "id" | "en" | "zh";

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

export interface Category {
  id: string;
  name_id: string;
  name_en: string;
  name_zh: string;
  emoji: string;
  color: string;
}

export interface Area {
  id: string;
  name: string;
}

export interface Ferry {
  id: string;
  name: string;
  lat: number;
  lng: number;
  blurb_id: string;
  blurb_en: string;
}

/** A place enriched with a computed nearest-ferry distance. */
export interface PlaceWithGeo extends Place {
  nearestFerryId: string;
  nearestFerryKm: number;
}

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
  emoji: string;
  color: string;
  area: string;
  stops: string[];
}
