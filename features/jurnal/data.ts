import tulisanRaw from "@/data/jurnal/tulisan.json";

export type Tulisan = {
  slug: string;
  judul: string;
  penulis: string;
  /** YYYY-MM-DD */
  tanggal: string;
  rubrik: string;
  ringkasan: string;
  gambar: string;
  isi: string[];
  tautan?: { label: string; href: string };
};

/** Terbaru lebih dulu. */
export const TULISAN: Tulisan[] = [...(tulisanRaw as Tulisan[])].sort((a, b) => b.tanggal.localeCompare(a.tanggal));

export const cariTulisan = (slug: string) => TULISAN.find((t) => t.slug === slug);

export const tanggalTulisan = (iso: string) =>
  new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );
