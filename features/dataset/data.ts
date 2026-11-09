// Katalog menu Dataset, disusun scripts/dataset/terbitkan.mjs dari arsip lokal. Hanya di server.
// Keputusan pemilik 9 Nov 2026: penyedia disebut sebagai teks biasa tanpa tautan; berkas mentah tidak ditawarkan
// untuk diunduh sampai penyedia menyatakan izin pakai ulang.
import "server-only";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import katalog from "@/data/dataset/katalog.json";

export type Dataset = {
  slug: string;
  judul: string;
  tema: string;
  penyedia: string;
  produsen: string | null;
  jenis: "tabel" | "peta";
  periode: string | null;
  satuan?: string;
  rilis?: string;
  jumlah: number;
  kolom: number;
  geometri?: string[];
  diambil: string | null;
  catatan: string[];
};

export type Tema = { id: string; nama: string };
export type Pratinjau = { kolom: string[]; baris: string[][] };

const K = katalog as { tema: Tema[]; dataset: Dataset[] };

export const DATASET: Dataset[] = K.dataset;
/** Tema yang punya isi, urut menurut jumlah dataset. */
export const TEMA: (Tema & { jumlah: number })[] = K.tema
  .map((t) => ({ ...t, jumlah: K.dataset.filter((d) => d.tema === t.id).length }))
  .filter((t) => t.jumlah > 0)
  .sort((a, b) => b.jumlah - a.jumlah);
export const PENYEDIA: { nama: string; jumlah: number }[] = [...new Set(K.dataset.map((d) => d.penyedia))]
  .map((nama) => ({ nama, jumlah: K.dataset.filter((d) => d.penyedia === nama).length }))
  .sort((a, b) => b.jumlah - a.jumlah);

export const cariDataset = (slug: string) => DATASET.find((d) => d.slug === slug);
export const temaDari = (id: string) => TEMA.find((t) => t.id === id);
export const datasetDiTema = (id: string) => DATASET.filter((d) => d.tema === id);

/** Tiga contoh untuk kartu tema: yang menyebut Batam dan berjudul pendek lebih dulu, tanpa judul kembar. */
export function contohTema(id: string): Dataset[] {
  const pilih: Dataset[] = [];
  const urut = [...datasetDiTema(id)].sort(
    (a, b) => Number(!/batam/i.test(a.judul)) - Number(!/batam/i.test(b.judul)) || a.judul.length - b.judul.length,
  );
  for (const d of urut) {
    const inti = d.judul.replace(/\s*\(Bagian \d+\)$/, "").replace(/\b(19|20)\d\d\b.*$/, "");
    if (pilih.some((p) => p.judul.startsWith(inti.slice(0, 18)))) continue;
    pilih.push(d);
    if (pilih.length === 3) break;
  }
  return pilih;
}

/** Pratinjau dibaca dari berkas saat halaman dibangun; tidak dikirim ke peramban sebagai JSON. */
export function pratinjau(slug: string): Pratinjau | null {
  const f = join(process.cwd(), "data", "dataset", "pratinjau", `${slug}.json`);
  return existsSync(f) ? (JSON.parse(readFileSync(f, "utf8")) as Pratinjau) : null;
}

const GEOMETRI: Record<string, string> = {
  Point: "titik",
  MultiPoint: "titik",
  LineString: "garis",
  MultiLineString: "garis",
  Polygon: "area",
  MultiPolygon: "area",
};

/** "Tabel, 12 baris" atau "Peta area, 29 fitur". */
export function ringkasJenis(d: Dataset): string {
  const angka = d.jumlah.toLocaleString("id-ID");
  if (d.jenis === "tabel") return `Tabel, ${angka} baris`;
  const g = [...new Set((d.geometri ?? []).map((x) => GEOMETRI[x]).filter(Boolean))];
  return `Peta${g.length ? ` ${g.join(" dan ")}` : ""}, ${angka} fitur`;
}

const BULAN = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
export const tanggalPanjang = (iso: string | null) => {
  if (!iso) return null;
  const [th, bl, tg] = iso.split("-").map(Number);
  return `${tg} ${BULAN[bl - 1]} ${th}`;
};
