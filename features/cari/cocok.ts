// Logika pencarian situs, tanpa React supaya bisa dites langsung.
import type { Bagian } from "@/lib/site";

export const HASIL_MAKS = 30;

export type HalamanSitus = { nama: string; href: string; bagian: string; kata?: string };

/** Semua bagian dan submenunya, sebagai daftar yang bisa dicari. */
export function halamanSitus(bagian: Bagian[]): HalamanSitus[] {
  return bagian.flatMap((b) => [
    { nama: b.nama, href: b.href, bagian: b.lede },
    ...b.isi.filter((s) => s.href !== b.href).map((s) => ({ nama: s.label, href: s.href, bagian: b.nama, kata: s.kata })),
  ]);
}

const rapikan = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, " ")
    .trim();

/** Semua kata harus ada. Nama yang memuat semua kata tampil lebih dulu, lalu yang diawali kata pertama. */
export function cariDi<T>(daftar: T[], q: string, teks: (x: T) => string[]): T[] {
  const kata = rapikan(q).split(" ").filter(Boolean);
  if (!kata.length) return [];
  const hasil: { x: T; skor: number }[] = [];
  for (const x of daftar) {
    const bagian = teks(x).map(rapikan);
    const gabung = bagian.join(" ");
    if (!kata.every((k) => gabung.includes(k))) continue;
    const nama = bagian[0];
    const lengkap = kata.every((k) => nama.includes(k));
    hasil.push({ x, skor: (lengkap ? 0 : 2) + (nama.startsWith(kata[0]) ? 0 : 1) });
  }
  return hasil.sort((a, b) => a.skor - b.skor).map((h) => h.x);
}
