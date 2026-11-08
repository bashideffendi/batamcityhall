// Citra radar MSS lewat route sendiri, diwarnai ulang ke gradasi biru situs. MSS hanya mengizinkan CORS dari
// weather.gov.sg, sedangkan peta WebGL butuh izin itu untuk memakai gambar sebagai tekstur. PNG per timestamp
// tidak pernah berubah, jadi hasilnya boleh di-cache panjang. Citra yang belum atau tidak terbit tetap 404,
// tidak pernah diganti gambar kosong, supaya tidak terbaca sebagai "tidak hujan".
import { radarUrl, tsRadarWajar } from "@/features/langit-laut/lib/radar";
import { warnaiRadar } from "@/features/langit-laut/lib/warna-radar";
import { buatBatasLaju, ipDari } from "@/features/tukang/batas-laju";

const TIMEOUT_MS = 8000;
// Pewarnaan memakan CPU dan Railway tidak punya CDN bawaan (PEDOMAN 8.5). 30 citra = satu putaran radar.
const MAKS_SIMPAN = 36;
// Citra yang belum terbit dicoba lagi paling cepat semenit kemudian.
const TAHAN_404_MS = 60 * 1000;
// Permintaan yang tidak kena simpanan per alamat per 10 menit. Satu putaran radar = 30.
const batas = buatBatasLaju(120, 10 * 60 * 1000);

const simpanan = new Map<string, Buffer>();
const belumAda = new Map<string, number>();
const berjalan = new Map<string, Promise<Buffer | null>>();

const tanpaSimpan = (status: number) => new Response(null, { status, headers: { "Cache-Control": "no-store" } });

async function muat(ts: string): Promise<Buffer | null> {
  const r = await fetch(radarUrl(ts), { cache: "no-store", signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!r.ok) return null;
  return warnaiRadar(Buffer.from(await r.arrayBuffer()));
}

export async function GET(req: Request, ctx: RouteContext<"/api/radar-citra/[ts]">) {
  const { ts } = await ctx.params;
  if (!tsRadarWajar(ts)) return new Response(null, { status: 400 });
  const kirim = (b: Buffer) =>
    new Response(new Uint8Array(b), {
      headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=2592000, immutable" },
    });
  const ada = simpanan.get(ts);
  if (ada) return kirim(ada);
  if ((belumAda.get(ts) ?? 0) > Date.now()) return tanpaSimpan(404);

  let janji = berjalan.get(ts);
  if (!janji) {
    if (!batas(ipDari(req))) return tanpaSimpan(429);
    janji = muat(ts).finally(() => berjalan.delete(ts));
    berjalan.set(ts, janji);
  }
  try {
    const hasil = await janji;
    if (!hasil) {
      belumAda.set(ts, Date.now() + TAHAN_404_MS);
      if (belumAda.size > MAKS_SIMPAN * 4) belumAda.delete(belumAda.keys().next().value as string);
      return tanpaSimpan(404);
    }
    if (!simpanan.has(ts)) {
      simpanan.set(ts, hasil);
      if (simpanan.size > MAKS_SIMPAN) simpanan.delete(simpanan.keys().next().value as string);
    }
    return kirim(hasil);
  } catch {
    return tanpaSimpan(502);
  }
}
