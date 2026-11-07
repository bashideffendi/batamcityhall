// Menerapkan ubahan data makanan dari admin ke daftar tempat. Dipakai saat build, lewat scripts/ubahan-makan.ts.
import type { FoodCourt } from "@/features/makan/lib/foodcourt";
import type { Place } from "@/features/makan/lib/types";

export type BarisUbahan = {
  tempat_id: string;
  baru: boolean;
  data: Partial<Place> & { name: string };
};

const KOLOM = [
  "name",
  "category",
  "kategori_lain",
  "food_court",
  "area",
  "halal",
  "desc_id",
  "signature",
  "price_tier",
  "price_idr",
  "address",
  "hours",
  "phone",
  "instagram",
  "gmaps",
] as const;

function tempatBaru(b: BarisUbahan, tanggal: string): Place {
  const d = b.data;
  return {
    id: b.tempat_id,
    name: d.name,
    category: d.category ?? "",
    kategori_lain: d.kategori_lain ?? [],
    food_court: d.food_court ?? null,
    subcategory: [],
    halal: d.halal ?? "muslim-friendly",
    labels: [],
    desc_id: d.desc_id ?? "",
    desc_en: "",
    signature: d.signature ?? "",
    price_tier: d.price_tier ?? "$",
    price_idr: d.price_idr ?? "",
    address: d.address ?? "",
    area: d.area ?? "",
    lat: d.lat as number,
    lng: d.lng as number,
    coord_approx: false,
    gmaps: d.gmaps || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${d.name} Batam`)}`,
    rating: null,
    reviews: null,
    hours: d.hours ?? "",
    phone: d.phone ?? "",
    instagram: d.instagram ?? "",
    payments: [],
    nearest_ferry: "",
    ferry_km: null,
    tags: [],
    featured: false,
    verified: true,
    last_verified: tanggal,
  };
}

/** Tempat lama hanya berubah di kolom yang diizinkan. Tempat baru butuh koordinat, kalau tidak dilewati. */
export function terapkanUbahan(tempat: Place[], ubahan: BarisUbahan[], tanggal: string) {
  const hasil = tempat.map((p) => ({ ...p }));
  const per = new Map(hasil.map((p) => [p.id, p]));
  const dilewati: string[] = [];
  for (const u of ubahan) {
    const lama = per.get(u.tempat_id);
    if (lama) {
      for (const k of KOLOM) {
        const v = u.data[k];
        if (v !== undefined) (lama as Record<string, unknown>)[k] = v;
      }
      lama.last_verified = tanggal;
    } else if (u.baru && typeof u.data.lat === "number" && typeof u.data.lng === "number" && u.data.category && u.data.area) {
      const baru = tempatBaru(u, tanggal);
      hasil.push(baru);
      per.set(baru.id, baru);
    } else {
      dilewati.push(u.tempat_id);
    }
  }
  return { tempat: hasil, dilewati };
}

export type DataFoodCourt = Pick<FoodCourt, "nama" | "kecamatan" | "alamat" | "jam" | "isi" | "tingkat" | "sumber_url">;
export type BarisUbahanFoodCourt = { foodcourt_id: string; baru: boolean; data: DataFoodCourt };

const KOLOM_FOOD_COURT = ["nama", "kecamatan", "alamat", "jam", "isi", "tingkat", "sumber_url"] as const;

/** Food court lama berubah di kolom teks saja, koordinatnya tetap. Food court baru masuk tanpa koordinat. */
export function terapkanUbahanFoodCourt(daftar: FoodCourt[], ubahan: BarisUbahanFoodCourt[]) {
  const hasil = daftar.map((f) => ({ ...f, sumber_url: [...f.sumber_url] }));
  const per = new Map(hasil.map((f) => [f.id, f]));
  const dilewati: string[] = [];
  for (const u of ubahan) {
    const isi = Object.fromEntries(KOLOM_FOOD_COURT.filter((k) => u.data[k] !== undefined).map((k) => [k, u.data[k]])) as Partial<DataFoodCourt>;
    const lama = per.get(u.foodcourt_id);
    if (lama) Object.assign(lama, isi);
    else if (u.baru) {
      const baru = { id: u.foodcourt_id, ...(isi as DataFoodCourt), lat: null, lng: null };
      hasil.push(baru);
      per.set(baru.id, baru);
    } else dilewati.push(u.foodcourt_id);
  }
  return { daftar: hasil, dilewati };
}
