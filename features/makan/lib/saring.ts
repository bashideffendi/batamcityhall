// Logika saringan dan urutan Makan, tanpa React supaya bisa dites langsung.
import { categoryMap, haversineKm } from "./data";
import { bukaLarut, bukaPagi, hargaTertinggi, isOpenNow, menitTutup } from "./format";
import { kategoriDariSlug, slugHidangan } from "./hidangan";
import type { HalalStatus, PriceTier, RecLabel, PlaceWithGeo } from "./types";

export type SortKey = "featured" | "ferry" | "az" | "nearby" | "larut" | "harga";
export type Waktu = "sarapan" | "larut";
export type Bayar = "qris" | "card";

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
  waktu: Waktu[];
  bayar: Bayar[];
  murah: boolean;
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
  waktu: [],
  bayar: [],
  murah: false,
  ferry: null,
  openNow: false,
  sort: "featured",
  userLoc: null,
};

/** Radius "dekat terminal". Jarak dihitung dari koordinat perkiraan, jadi ini juga perkiraan. */
export const RADIUS_FERI_KM = 6;

/** Batas saringan "di bawah Rp50 ribu". */
export const BATAS_MURAH = 50_000;

/** Ejaan lama yang masih lazim diketik. Data memakai bentuk baku (pedoman 2.8), pencarian menerima keduanya. */
const EJAAN_LAMA: [RegExp, string][] = [
  [/\bmie\b/g, "mi"],
  [/\bsop\b/g, "sup"],
  [/\bseafood\b/g, "makanan laut"],
  [/\bcafe\b/g, "kafe"],
  [/\bferry\b/g, "feri"],
];
const bentukBaku = (q: string) => EJAAN_LAMA.reduce((s, [lama, baku]) => s.replace(lama, baku), q);

/** `sekarang` null berarti waktu belum diketahui (render server): saringan buka sekarang dilewati. */
export function cocok(p: PlaceWithGeo, s: FilterState, sekarang: number | null): boolean {
  if (s.cats.length && !s.cats.includes(p.category)) return false;
  if (s.areas.length && !s.areas.includes(p.area)) return false;
  if (s.halal.length && !s.halal.includes(p.halal)) return false;
  if (s.tiers.length && !s.tiers.includes(p.price_tier)) return false;
  if (s.labels.length && !s.labels.some((l) => p.labels.includes(l))) return false;
  if (s.bayar.length && !s.bayar.every((b) => p.payments.includes(b))) return false;
  if (s.waktu.includes("sarapan") && !bukaPagi(p.hours)) return false;
  if (s.waktu.includes("larut") && !bukaLarut(p.hours)) return false;
  if (s.murah) {
    const maks = hargaTertinggi(p.price_idr);
    if (maks === null || maks > BATAS_MURAH) return false;
  }
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
      categoryMap[p.category]?.name_id ?? "",
      categoryMap[p.category]?.name_en ?? "",
      categoryMap[p.category]?.name_zh ?? "",
      p.area,
    ]
      .join(" ")
      .toLowerCase();
    if (!hay.includes(q) && !hay.includes(bentukBaku(q))) return false;
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
    // Yang tidak punya data jam atau harga selalu di belakang.
    case "larut":
      return arr.sort((a, b) => (menitTutup(b.hours) ?? -1) - (menitTutup(a.hours) ?? -1));
    case "harga":
      return arr.sort(
        (a, b) => (hargaTertinggi(a.price_idr) ?? Infinity) - (hargaTertinggi(b.price_idr) ?? Infinity),
      );
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
    s.waktu.length +
    s.bayar.length +
    (s.murah ? 1 : 0) +
    (s.ferry ? 1 : 0) +
    (s.openNow ? 1 : 0)
  );
}

// ---- Alamat ----
// Saringan disimpan di alamat, jadi hasilnya bisa dibagikan dan bertahan saat muat ulang.

const KE_ALAMAT = {
  harga: { $: "rendah", $$: "menengah", $$$: "tinggi" } as Record<PriceTier, string>,
  label: { legendaris: "legendaris", "wajib-coba": "pilihan", hits: "populer", "hidden-gem": "jarang" } as Record<RecLabel, string>,
  halal: { halal: "halal", "muslim-friendly": "ramah-muslim", "non-halal": "nonhalal" } as Record<HalalStatus, string>,
  bayar: { qris: "qris", card: "kartu" } as Record<Bayar, string>,
};

function balik<K extends string>(peta: Record<K, string>, nilai: string): K | undefined {
  return (Object.keys(peta) as K[]).find((k) => peta[k] === nilai);
}

const URUT_SAH: SortKey[] = ["featured", "ferry", "az", "larut", "harga"];
const pecah = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);
const ada = <T>(v: T | undefined): v is T => v !== undefined;

/** Isi alamat menjadi saringan. Nilai yang tidak dikenal diabaikan. */
export function bacaAlamat(search: string): FilterState {
  const q = new URLSearchParams(search);
  const urut = q.get("urut") as SortKey | null;
  return {
    ...EMPTY,
    query: q.get("q") ?? "",
    cats: pecah(q.get("hidangan")).map(kategoriDariSlug).filter(ada),
    areas: pecah(q.get("kawasan")),
    halal: pecah(q.get("halal"))
      .map((v) => balik(KE_ALAMAT.halal, v))
      .filter(ada),
    tiers: pecah(q.get("harga"))
      .map((v) => balik(KE_ALAMAT.harga, v))
      .filter(ada),
    labels: pecah(q.get("label"))
      .map((v) => balik(KE_ALAMAT.label, v))
      .filter(ada),
    waktu: pecah(q.get("waktu")).filter((v): v is Waktu => v === "sarapan" || v === "larut"),
    bayar: pecah(q.get("bayar"))
      .map((v) => balik(KE_ALAMAT.bayar, v))
      .filter(ada),
    murah: q.get("murah") === "1",
    ferry: q.get("terminal"),
    openNow: q.get("buka") === "1",
    sort: urut && URUT_SAH.includes(urut) ? urut : "featured",
  };
}

/** Saringan menjadi isi alamat. Lokasi pengguna tidak pernah ikut. */
export function tulisAlamat(s: Partial<FilterState>): string {
  const q = new URLSearchParams();
  const pasang = (k: string, v: string[] | undefined) => {
    if (v?.length) q.set(k, v.join(","));
  };
  if (s.query?.trim()) q.set("q", s.query.trim());
  pasang("hidangan", s.cats?.map(slugHidangan));
  pasang("kawasan", s.areas);
  pasang("halal", s.halal?.map((v) => KE_ALAMAT.halal[v]));
  pasang("harga", s.tiers?.map((v) => KE_ALAMAT.harga[v]));
  pasang("label", s.labels?.map((v) => KE_ALAMAT.label[v]));
  pasang("waktu", s.waktu);
  pasang("bayar", s.bayar?.map((v) => KE_ALAMAT.bayar[v]));
  if (s.murah) q.set("murah", "1");
  if (s.ferry) q.set("terminal", s.ferry);
  if (s.openNow) q.set("buka", "1");
  if (s.sort && s.sort !== "featured" && s.sort !== "nearby") q.set("urut", s.sort);
  // Koma tetap terbaca di alamat.
  const teks = q.toString().replace(/%2C/g, ",");
  return teks ? `?${teks}` : "";
}

/** Tautan ke halaman Peta dengan saringan tertentu. */
export const tautanPeta = (s: Partial<FilterState>) => `/makan/peta${tulisAlamat(s)}`;
