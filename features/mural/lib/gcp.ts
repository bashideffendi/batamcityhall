// Georeferensi segmen: pasangan titik gambar dan koordinat, ditransformasi dengan @allmaps/transform.
import { GcpTransformer } from "@allmaps/transform";
import type { Titik } from "./geom";

export type Gcp = { resource: Titik; geo: Titik; label?: string };
export const MIN_GCP_TPS = 3;

export function buatTransformer(gcps: Gcp[]): GcpTransformer | null {
  if (gcps.length < MIN_GCP_TPS) return null;
  try {
    return new GcpTransformer(
      gcps.map((g) => ({ resource: g.resource, geo: g.geo })),
      "thinPlateSpline",
    );
  } catch {
    return null;
  }
}

export const kePiksel = (t: GcpTransformer, lngLat: Titik) => t.transformToResource(lngLat) as Titik;
export const keGeo = (t: GcpTransformer, piksel: Titik) => t.transformToGeo(piksel) as Titik;

/** Galat leave-one-out dalam piksel, per titik. null kalau titiknya terlalu sedikit (research/02). */
export function galatTinggalkanSatu(gcps: Gcp[]): (number | null)[] {
  return gcps.map((g, i) => {
    const t = buatTransformer(gcps.filter((_, k) => k !== i));
    if (!t) return null;
    try {
      const [x, y] = kePiksel(t, g.geo);
      const d = Math.hypot(x - g.resource[0], y - g.resource[1]);
      return Number.isFinite(d) ? d : null;
    } catch {
      return null;
    }
  });
}

export type BerkasGcp = { segmen: string; transformasi: "thinPlateSpline"; dibuat: string; gcps: Gcp[] };

export const berkasGcp = (segmen: string, gcps: Gcp[], dibuat: string): BerkasGcp => ({
  segmen,
  transformasi: "thinPlateSpline",
  dibuat,
  gcps,
});

const titikSah = (p: unknown): p is Titik =>
  Array.isArray(p) && p.length === 2 && p.every((n) => typeof n === "number" && Number.isFinite(n));

/** Membaca berkas GCP yang dimuat sendiri. Isi yang rusak ditolak, tidak ditebak. */
export function uraiBerkasGcp(teks: string): Gcp[] | null {
  try {
    const data = JSON.parse(teks) as { gcps?: unknown };
    if (!Array.isArray(data.gcps)) return null;
    const hasil: Gcp[] = [];
    for (const g of data.gcps as Partial<Gcp>[]) {
      if (!titikSah(g.resource) || !titikSah(g.geo)) return null;
      hasil.push({ resource: g.resource, geo: g.geo, ...(typeof g.label === "string" ? { label: g.label } : {}) });
    }
    return hasil;
  } catch {
    return null;
  }
}
