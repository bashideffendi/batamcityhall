import type { MetadataRoute } from "next";
import { places } from "@/features/makan/lib/data";
import { trails } from "@/features/makan/lib/trails";
import { LOKET, LOKET_DIBUKA, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "hourly", priority: 1 },
    ...LOKET.filter((l) => LOKET_DIBUKA.includes(l.nomor)).map((l) => ({
      url: `${SITE_URL}${l.href}`,
      changeFrequency: "hourly" as const,
      priority: 0.8,
    })),
    ...["daftar", "peta", "kategori", "jalur", "tentang"].map((h) => ({
      url: `${SITE_URL}/makan/${h}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...places.map((p) => ({
      url: `${SITE_URL}/makan/tempat/${p.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...trails.map((t) => ({
      url: `${SITE_URL}/makan/jalur/${t.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    { url: `${SITE_URL}/tentang`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/kolofon`, changeFrequency: "monthly", priority: 0.3 },
  ];
}
