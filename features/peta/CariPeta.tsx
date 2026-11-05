import type { PinPeta } from "./lapisan";

const MAKS = 6;

const norma = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

/** Murni supaya bisa dites: cocok di nama, lokasi, atau tempat lain di titik yang sama. */
export function cariPin(pins: PinPeta[], q: string): PinPeta[] {
  const n = norma(q);
  if (n.length < 2) return [];
  return pins
    .filter((p) => [p.nama, p.lokasi, ...p.lain.map((l) => l.nama)].some((t) => norma(t).includes(n)))
    .sort((a, b) => Number(norma(b.nama).startsWith(n)) - Number(norma(a.nama).startsWith(n)))
    .slice(0, MAKS);
}

export type PesanLokasi = { teks: string } | null;
