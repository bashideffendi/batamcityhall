// Menarik semua feed dan menggabungkannya. Tidak menyentuh jaringan sendiri: `ambilTeks` diberikan
// dari luar, jadi perilaku feed mati bisa diuji tanpa memanggil situs media.
import { bacaFeed, type ItemFeed } from "./rss";
import { tentangBatam } from "./saring";
import type { BeritaItem, BeritaResponse, StatusFeed, SumberBerita } from "./sumber";

export const MAKS_PER_SUMBER = 10;
export const MAKS_TOTAL = 60;
const INGATAN_MAKS_MS = 24 * 3600 * 1000;
// Feed yang salah menulis zona waktu bisa tampak dari masa depan dan menempel di puncak daftar.
const MASA_DEPAN_TOLERANSI_MS = 3600 * 1000;

export type Ingatan = Map<string, { item: ItemFeed[]; at: number }>;

type Muat = {
  sumber: SumberBerita[];
  ambilTeks: (url: string) => Promise<string>;
  ingatan: Ingatan;
  now: number;
  saatGagal?: (s: SumberBerita, e: unknown) => void;
};

/** Terbaru dulu. Yang waktunya tidak terbaca selalu di belakang. */
function bandingWaktu(a: { waktu: string | null }, b: { waktu: string | null }): number {
  if (a.waktu && b.waktu) return b.waktu.localeCompare(a.waktu);
  return a.waktu ? -1 : b.waktu ? 1 : 0;
}

export function rapikanItem(item: ItemFeed[], now: number): ItemFeed[] {
  return item
    .map((i) => (i.waktu && Date.parse(i.waktu) > now + MASA_DEPAN_TOLERANSI_MS ? { ...i, waktu: null } : i))
    .sort(bandingWaktu)
    .slice(0, MAKS_PER_SUMBER);
}

export function gabungBerita(per: { sumber: SumberBerita; item: ItemFeed[] }[]): BeritaItem[] {
  const terlihat = new Set<string>();
  const hasil: BeritaItem[] = [];
  for (const { sumber, item } of per) {
    for (const i of item) {
      if (terlihat.has(i.tautan)) continue;
      terlihat.add(i.tautan);
      hasil.push({ judul: i.judul, tautan: i.tautan, waktu: i.waktu, sumberId: sumber.id, sumber: sumber.nama });
    }
  }
  return hasil.sort(bandingWaktu).slice(0, MAKS_TOTAL);
}

/** Satu feed gagal hanya memengaruhi barisnya sendiri. */
export async function muatBerita({ sumber, ambilTeks, ingatan, now, saatGagal }: Muat): Promise<BeritaResponse> {
  const hasil = await Promise.all(
    sumber.map(async (s) => {
      try {
        // Disaring sebelum dibatasi, supaya berita nasional tidak memakan jatah per sumber.
        const feed = bacaFeed(await ambilTeks(s.feed)).item.filter((i) => tentangBatam(i.judul));
        const item = rapikanItem(feed, now);
        ingatan.set(s.id, { item, at: now });
        return { s, item, status: (item.length ? "ok" : "kosong") as StatusFeed };
      } catch (e) {
        saatGagal?.(s, e);
        const lama = ingatan.get(s.id);
        const item = lama && now - lama.at < INGATAN_MAKS_MS ? lama.item : [];
        return { s, item, status: "gagal" as StatusFeed };
      }
    }),
  );
  const item = gabungBerita(hasil.map((h) => ({ sumber: h.s, item: h.item })));
  return {
    diperbarui: new Date(now).toISOString(),
    item,
    sumber: hasil.map(({ s, status }) => {
      const at = ingatan.get(s.id)?.at;
      return {
        id: s.id,
        nama: s.nama,
        situs: s.situs,
        status,
        jumlah: item.filter((i) => i.sumberId === s.id).length,
        terakhirBerhasil: at ? new Date(at).toISOString() : null,
      };
    }),
  };
}
