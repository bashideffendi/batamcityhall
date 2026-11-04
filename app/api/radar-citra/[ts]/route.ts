// Citra radar MSS lewat route sendiri. MSS hanya mengizinkan CORS dari weather.gov.sg, sedangkan peta
// WebGL butuh izin itu untuk memakai gambar sebagai tekstur. PNG per timestamp tidak pernah berubah,
// jadi hasilnya boleh di-cache panjang. Citra yang belum atau tidak terbit tetap 404, tidak pernah
// diganti gambar kosong, supaya tidak terbaca sebagai "tidak hujan".
import { radarUrl } from "@/features/langit-laut/lib/radar";

const TIMEOUT_MS = 8000;

export async function GET(_req: Request, ctx: RouteContext<"/api/radar-citra/[ts]">) {
  const { ts } = await ctx.params;
  if (!/^\d{12}$/.test(ts)) return new Response(null, { status: 400 });
  try {
    const r = await fetch(radarUrl(ts), { cache: "no-store", signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!r.ok) return new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } });
    return new Response(await r.arrayBuffer(), {
      headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=2592000, immutable" },
    });
  } catch {
    return new Response(null, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
