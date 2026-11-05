import type { MetadataRoute } from "next";
import koridorData from "@/data/trans_batam/koridor.json";
import { DAFTAR_KATEGORI, punyaHalaman, slugKategori, slugKecamatan, TEMPAT } from "@/features/direktori/data";
import { places } from "@/features/makan/lib/data";
import { KECAMATAN } from "@/lib/data/schema";
import { panduan } from "@/features/makan/lib/panduan";
import { kawasanBerisi } from "@/features/makan/lib/data";
import { semuaSlugHidangan } from "@/features/makan/lib/hidangan";
import { LOKET, LOKET_DIBUKA, SITE_URL } from "@/lib/site";

const koridor = koridorData.koridor;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "hourly", priority: 1 },
    ...LOKET.filter((l) => LOKET_DIBUKA.includes(l.nomor)).map((l) => ({
      url: `${SITE_URL}${l.href}`,
      changeFrequency: "hourly" as const,
      priority: 0.8,
    })),
    ...["hujan", "gelombang", "cctv", "peringatan", "gempa"].map((h) => ({
      url: `${SITE_URL}/cuaca/${h}`,
      changeFrequency: "hourly" as const,
      priority: 0.7,
    })),
    ...["hidangan", "kawasan", "panduan", "dekat-feri", "peta", "cara-memilih"].map((h) => ({
      url: `${SITE_URL}/makan/${h}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...semuaSlugHidangan.map((s) => ({
      url: `${SITE_URL}/makan/hidangan/${s}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...kawasanBerisi.map((a) => ({
      url: `${SITE_URL}/makan/kawasan/${a.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...places.map((p) => ({
      url: `${SITE_URL}/makan/tempat/${p.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...panduan.map((t) => ({
      url: `${SITE_URL}/makan/panduan/${t.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...["direktori", "darurat", "urusan-tanah", "bantuan-hukum", "jasa-dokumen"].map((h) => ({
      url: `${SITE_URL}/info/${h}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...DAFTAR_KATEGORI.map((k) => ({
      url: `${SITE_URL}/info/direktori/${slugKategori(k.kategori)}`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...KECAMATAN.map((k) => ({
      url: `${SITE_URL}/info/kecamatan/${slugKecamatan(k)}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...TEMPAT.filter(punyaHalaman).map((p) => ({
      url: `${SITE_URL}/info/tempat/${p.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
    ...[
      "info/berita",
      "tukang/rekomendasi",
      "jalan/trans-batam",
      "jalan/peta",
      "jalan/feri",
      "jalan/feri/panduan",
      "jalan/pompong",
      ...koridor.map((k) => `jalan/trans-batam/${k.id.toLowerCase()}`),
      "cerita/sejarah",
      "cerita/kampung-tua",
      "cerita/nama-jalan",
      "cerita/kalender",
      "cerita/kamus",
      "cerita/budaya",
      "cerita/komunitas",
      "cerita/angka",
      "main/kartu-pos",
      "main/singapura-atau-nagoya",
    ].map((h) => ({
      url: `${SITE_URL}/${h}`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...["kontribusi", "koreksi", "privasi", "syarat"].map((h) => ({
      url: `${SITE_URL}/${h}`,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    })),
    { url: `${SITE_URL}/tentang`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/kolofon`, changeFrequency: "monthly", priority: 0.3 },
  ];
}
