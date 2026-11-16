// Citra radar MSS lewat route sendiri, dengan warna aslinya dan tepi yang dihaluskan (lib/halus-radar.ts: citra asli
// 1 km per piksel tampak kotak-kotak di peta). MSS hanya mengizinkan CORS dari
// weather.gov.sg, sedangkan peta WebGL butuh izin itu untuk memakai gambar sebagai tekstur. PNG per timestamp
// tidak pernah berubah, jadi hasilnya boleh di-cache panjang. Citra yang belum atau tidak terbit tetap 404,
// tidak pernah diganti gambar kosong, supaya tidak terbaca sebagai "tidak hujan".
import { haluskanRadar, pikselHalus } from "@/features/langit-laut/lib/halus-radar";
import { radarUrl, tsRadarWajar } from "@/features/langit-laut/lib/radar";
import { buatBatasLaju, ipDari } from "@/features/tukang/batas-laju";

const TIMEOUT_MS = 8000;
// Penghalusan memakan CPU dan Railway tidak punya CDN bawaan (PEDOMAN 8.5). Simpan 36 citra; 30 citra = satu putaran.
const MAKS_SIMPAN = 36;
// Citra yang belum terbit dicoba lagi paling cepat semenit kemudian.
const TAHAN_404_MS = 60 * 1000;
// Permintaan yang tidak kena simpanan per alamat per 10 menit. Satu putaran radar = 30.
const batas = buatBatasLaju(120, 10 * 60 * 1000);

type Citra = { isi: Buffer; tipe: "image/webp" | "image/png" };
const simpanan = new Map<string, Citra>();
const belumAda = new Map<string, number>();
const berjalan = new Map<string, Promise<Citra | null>>();

// Gradasi halus jauh lebih kecil sebagai WebP (±70 KB) daripada PNG (±300 KB). sharp ikut terpasang bersama Next;
// bila ternyata tidak ada, citra dikirim sebagai PNG dengan tingkat warna terbatas.
type Sharp = typeof import("sharp").default;
let sharpJanji: Promise<Sharp | null> | undefined;
const muatSharp = () =>
  (sharpJanji ??= import("sharp").then(
    (m) => m.default,
    () => null,
  ));
const TINGKAT_HALUS = 256;

async function sandikan(asli: Buffer): Promise<Citra> {
  const sharp = await muatSharp();
  if (!sharp) return { isi: haluskanRadar(asli), tipe: "image/png" };
  const c = pikselHalus(asli, undefined, TINGKAT_HALUS);
  const isi = await sharp(c.data, { raw: { width: c.width, height: c.height, channels: 4 } })
    .webp({ quality: 80, alphaQuality: 90, effort: 4 })
    .toBuffer();
  return { isi, tipe: "image/webp" };
}

const tanpaSimpan = (status: number) => new Response(null, { status, headers: { "Cache-Control": "no-store" } });

async function muat(ts: string): Promise<Citra | null> {
  const r = await fetch(radarUrl(ts), { cache: "no-store", signal: AbortSignal.timeout(TIMEOUT_MS) });
  // Hanya 404 yang berarti citra belum terbit. Galat lain (5xx, 403) bersifat sementara: dijawab 502 tanpa
  // ditahan, supaya permintaan berikutnya langsung mencoba lagi.
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`MSS ${r.status}`);
  const asli = Buffer.from(await r.arrayBuffer());
  try {
    return await sandikan(asli);
  } catch (e) {
    // PNG tidak terbaca: kirim citra aslinya apa adanya, jangan gambar kosong (terbaca "tidak hujan").
    console.warn("[radar-citra] penghalusan gagal:", ts, (e as Error)?.message);
    return { isi: asli, tipe: "image/png" };
  }
}

export async function GET(req: Request, ctx: RouteContext<"/api/radar-citra/[ts]">) {
  const { ts } = await ctx.params;
  if (!tsRadarWajar(ts)) return new Response(null, { status: 400 });
  const kirim = (c: Citra) =>
    new Response(new Uint8Array(c.isi), {
      headers: { "Content-Type": c.tipe, "Cache-Control": "public, max-age=2592000, immutable" },
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
