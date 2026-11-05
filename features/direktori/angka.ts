// Angka pembanding "baru N dari M terdata" dari data/statistik/angka_resmi.json. Sumber dan tahunnya tetap
// dibawa untuk Kolofon, tetapi tidak tampil di halaman direktori (pedoman 2.9).
import raw from "@/data/statistik/angka_resmi.json";
import { TEMPAT, type Place } from "./data";

type Baris = { indikator: string; nilai: unknown; sumber?: string | null; tahun?: unknown };
const DATA = (raw as { data: Baris[] }).data;

export function angkaResmi(indikator: string): { nilai: number; sumber: string | null; tahun: string | null } | null {
  const b = DATA.find((d) => d.indikator === indikator);
  if (!b || typeof b.nilai !== "number") return null;
  return { nilai: b.nilai, sumber: b.sumber ?? null, tahun: b.tahun == null ? null : String(b.tahun) };
}

type Pembanding = { label: string; indikator: string; cocok: (p: Place) => boolean };

const PEMBANDING: Partial<Record<Place["kategori"], Pembanding[]>> = {
  pendidikan: [
    { label: "SD sederajat", indikator: "sd_sederajat", cocok: (p) => p.subkategori === "sd" },
    { label: "SMP sederajat", indikator: "smp_sederajat", cocok: (p) => p.subkategori === "smp" },
    {
      label: "pendidikan menengah",
      indikator: "pendidikan_menengah_total",
      cocok: (p) => p.subkategori === "sma" || p.subkategori === "smk",
    },
  ],
  ibadah: [
    { label: "masjid", indikator: "masjid", cocok: (p) => p.subkategori === "masjid" },
    { label: "wihara", indikator: "vihara", cocok: (p) => p.subkategori === "vihara" },
    {
      label: "gereja",
      indikator: "gereja",
      cocok: (p) => p.subkategori === "gereja" || p.subkategori === "gereja_katolik",
    },
  ],
  kesehatan: [{ label: "fasilitas kesehatan", indikator: "faskes_total", cocok: (p) => p.kategori === "kesehatan" }],
};

export function kelengkapan(kategori: Place["kategori"]) {
  return (PEMBANDING[kategori] ?? []).flatMap((p) => {
    const resmi = angkaResmi(p.indikator);
    if (!resmi) return [];
    return [{ label: p.label, terdata: TEMPAT.filter(p.cocok).length, ...resmi }];
  });
}
