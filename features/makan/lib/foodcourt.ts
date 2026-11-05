import raw from "@/data/makan/foodcourt.json";

export type FoodCourt = {
  id: string;
  nama: string;
  kecamatan: string;
  alamat: string;
  jam: string;
  isi: string;
  /** dibaca: sumbernya terbaca. daftar: hanya tercatat di daftar pihak ketiga, alamatnya perlu dicek. */
  tingkat: "dibaca" | "daftar";
  sumber_url: string[];
  lat: number | null;
  lng: number | null;
};

export const FOOD_COURT = raw.tempat as FoodCourt[];

export const foodCourtDari = (id: string | null | undefined) => (id ? FOOD_COURT.find((f) => f.id === id) : undefined);

/** Dikelompokkan per kecamatan: yang paling banyak lebih dulu. Urutan di dalam kelompok mengikuti berkas data. */
export function kelompokFoodCourt(daftar: FoodCourt[] = FOOD_COURT): { kecamatan: string; isi: FoodCourt[] }[] {
  const peta = new Map<string, FoodCourt[]>();
  for (const f of daftar) peta.set(f.kecamatan, [...(peta.get(f.kecamatan) ?? []), f]);
  return [...peta.entries()]
    .map(([kecamatan, isi]) => ({ kecamatan, isi }))
    .sort((a, b) => b.isi.length - a.isi.length || a.kecamatan.localeCompare(b.kecamatan, "id"));
}

/** Pencarian Google Maps menurut nama dan alamat. Selama koordinat kosong, inilah satu-satunya petunjuk arah. */
export function tautanFoodCourt(f: FoodCourt): string {
  if (f.lat !== null && f.lng !== null) return `https://www.google.com/maps/dir/?api=1&destination=${f.lat},${f.lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${f.nama} ${f.alamat} Batam`)}`;
}
