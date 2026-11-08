import type { MetadataRoute } from "next";
import koridorData from "@/data/trans_batam/koridor.json";
import { DAFTAR_KATEGORI, punyaHalaman, slugKategori, slugKecamatan, TEMPAT } from "@/features/direktori/data";
import { INFOGRAFIK_REPO } from "@/features/infografik/data";
import { TULISAN } from "@/features/jurnal/data";
import { categoryCounts, kawasanBerisi, places } from "@/features/makan/lib/data";
import { semuaSlugHidangan } from "@/features/makan/lib/hidangan";
import { panduan } from "@/features/makan/lib/panduan";
import { KECAMATAN } from "@/lib/data/schema";
import { BAGIAN, KIRIMAN_AKTIF, SITE_URL } from "@/lib/site";

type Ubah = "hourly" | "weekly" | "monthly";

/** Menu dan submenu sumber utamanya, jadi alamat baru tidak perlu ditulis dua kali. */
export default function sitemap(): MetadataRoute.Sitemap {
  const baris = (daftar: string[], changeFrequency: Ubah, priority: number) =>
    daftar.map((alamat) => ({ url: `${SITE_URL}${alamat}`, changeFrequency, priority }));

  const semua = [
    ...baris(["/"], "hourly", 1),
    ...baris(BAGIAN.map((b) => b.href), "hourly", 0.8),
    ...baris(BAGIAN.flatMap((b) => b.isi.map((s) => s.href)), "weekly", 0.7),
    ...baris(["/makan/cara-memilih", "/jalan/feri/panduan"], "weekly", 0.6),
    // Kategori yang belum punya tempat belum perlu diindeks.
    ...baris(semuaSlugHidangan.filter((s) => categoryCounts[s]).map((s) => `/makan/hidangan/${s}`), "monthly", 0.5),
    ...baris(kawasanBerisi.map((a) => `/makan/kawasan/${a.id}`), "monthly", 0.5),
    ...baris(places.map((p) => `/makan/tempat/${p.id}`), "monthly", 0.5),
    ...baris(panduan.map((t) => `/makan/panduan/${t.id}`), "monthly", 0.5),
    ...baris(DAFTAR_KATEGORI.map((k) => `/info/direktori/${slugKategori(k.kategori)}`), "weekly", 0.5),
    ...baris(KECAMATAN.map((k) => `/info/kecamatan/${slugKecamatan(k)}`), "monthly", 0.5),
    ...baris(TEMPAT.filter(punyaHalaman).map((p) => `/info/tempat/${p.id}`), "monthly", 0.4),
    ...baris(koridorData.koridor.map((k) => `/jalan/trans-batam/${k.id.toLowerCase()}`), "weekly", 0.5),
    ...baris(TULISAN.map((t) => `/jurnal/${t.slug}`), "monthly", 0.6),
    ...baris(INFOGRAFIK_REPO.map((i) => `/infografik/${i.slug}`), "monthly", 0.6),
    ...baris(["/tentang", "/kolofon", "/privasi", "/syarat", "/standar-redaksi", "/aksesibilitas"], "monthly", 0.3),
    ...baris(["/log-koreksi"], "weekly", 0.3),
    // Formulir warga hanya didaftarkan bila sudah aktif.
    ...baris(KIRIMAN_AKTIF ? ["/kontribusi", "/koreksi", "/tukang/rekomendasi"] : [], "monthly", 0.3),
  ];
  // Alamat ganda, misalnya submenu yang sama dengan bagiannya, cukup sekali.
  return [...new Map(semua.map((b) => [b.url, b])).values()];
}
