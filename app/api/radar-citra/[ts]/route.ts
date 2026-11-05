// Citra radar MSS lewat route sendiri, diwarnai ulang ke gradasi biru situs. MSS hanya mengizinkan CORS dari
// weather.gov.sg, sedangkan peta WebGL butuh izin itu untuk memakai gambar sebagai tekstur. PNG per timestamp
// tidak pernah berubah, jadi hasilnya boleh di-cache panjang. Citra yang belum atau tidak terbit tetap 404,
// tidak pernah diganti gambar kosong, supaya tidak terbaca sebagai "tidak hujan".
import { radarUrl } from "@/features/langit-laut/lib/radar";
import { warnaiRadar } from "@/features/langit-laut/lib/warna-radar";

const TIMEOUT_MS = 8000;
// Pewarnaan memakan CPU dan Railway tidak punya CDN bawaan (PEDOMAN 8.5). 30 citra = satu putaran radar.
const MAKS_SIMPAN = 36;
const simpanan = new Map<string, Buffer>();

export async function GET(_req: Request, ctx: RouteContext<"/api/radar-citra/[ts]">) {
  const { ts } = await ctx.params;
  if (!/^\d{12}$/.test(ts)) return new Response(null, { status: 400 });
  const kirim = (b: Buffer) =>
    new Response(new Uint8Array(b), {
      headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=2592000, immutable" },
    });
  const ada = simpanan.get(ts);
  if (ada) return kirim(ada);
  try {
    const r = await fetch(radarUrl(ts), { cache: "no-store", signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!r.ok) return new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } });
    const hasil = warnaiRadar(Buffer.from(await r.arrayBuffer()));
    simpanan.set(ts, hasil);
    if (simpanan.size > MAKS_SIMPAN) simpanan.delete(simpanan.keys().next().value as string);
    return kirim(hasil);
  } catch {
    return new Response(null, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
