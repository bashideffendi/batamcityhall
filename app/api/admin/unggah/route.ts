import { randomUUID } from "node:crypto";
import { ambilKonten } from "@/features/konten/store";
import { aksesAdmin, asalSama } from "@/features/tukang/admin-auth";
import { jawab, tolak } from "@/features/tukang/http";

const MAKS_BYTE = 12 * 1024 * 1024;
const LEBAR_MAKS = 1600;
const MAP_FOLDER = new Set(["jurnal", "makan", "infografik"]);
// Infografik biasanya tegak dan panjang: hanya lebarnya yang dibatasi.
const TINGGI_MAKS: Record<string, number> = { infografik: 12000 };
const TIPE_GAMBAR = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
// Tipe dari peramban hanya label. Yang menentukan adalah isi berkas menurut sharp. AVIF terbaca sebagai "heif".
const FORMAT_GAMBAR = new Set(["jpeg", "png", "webp", "heif"]);
// 60 juta piksel: kamera ponsel 50 MP masih diterima lalu diperkecil. Gambar kecil yang mengaku raksasa ditolak sebelum diurai.
const MAKS_PIKSEL = 60_000_000;

/** Foto diperkecil dan diubah ke WebP di server, supaya halaman tetap ringan apa pun yang diunggah. */
export async function POST(req: Request) {
  if (!asalSama(req) || (await aksesAdmin()) !== "masuk") return tolak(403, "Harus masuk sebagai admin.");
  const store = await ambilKonten();
  if (!store) return tolak(503, "Basis data belum tersambung.");

  // Dicek sebelum formData supaya badan raksasa tidak ditampung dulu. Ruang 64 KB untuk pembatas multipart.
  if (Number(req.headers.get("content-length") ?? 0) > MAKS_BYTE + 64 * 1024) return tolak(413, "Berkas lebih dari 12 MB.");
  const form = await req.formData().catch(() => null);
  const berkas = form?.get("berkas");
  const folder = String(form?.get("folder") ?? "");
  if (!(berkas instanceof File) || !MAP_FOLDER.has(folder)) return tolak(400, "Berkas tidak terbaca.");
  if (!TIPE_GAMBAR.has(berkas.type)) return tolak(400, "Hanya JPG, PNG, WebP, atau AVIF.");
  if (berkas.size > MAKS_BYTE) return tolak(413, "Berkas lebih dari 12 MB.");

  try {
    const { default: sharp } = await import("sharp");
    const gambar = sharp(Buffer.from(await berkas.arrayBuffer()), { limitInputPixels: MAKS_PIKSEL });
    const { format } = await gambar.metadata();
    if (!format || !FORMAT_GAMBAR.has(format)) return tolak(400, "Hanya JPG, PNG, WebP, atau AVIF.");
    const { data, info } = await gambar
      .rotate()
      .resize({ width: LEBAR_MAKS, height: TINGGI_MAKS[folder] ?? LEBAR_MAKS, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer({ resolveWithObject: true });
    const src = await store.unggah(`${folder}/${randomUUID()}.webp`, data, "image/webp");
    return jawab(200, { ok: true, src, w: info.width, h: info.height });
  } catch (e) {
    console.error("Unggah gagal:", e instanceof Error ? e.message : "galat tidak dikenal");
    return tolak(500, "Foto gagal diunggah. Coba berkas lain.");
  }
}
