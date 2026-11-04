// Judul berita dari feed RSS media lokal. Ditarik dari server dan ditahan 20 menit, jadi kunjungan
// warga tidak pernah sampai ke situs media. Hanya judul, sumber, waktu, dan tautan yang dikirim.
//
// Bukan `export const revalidate`: cache fetch Next menyajikan salinan lama saat sumbernya mati,
// sehingga feed yang tumbang tetap terbaca berhasil. Status per feed di halaman harus jujur, jadi
// cache-nya dipegang sendiri di memori dan di CDN lewat s-maxage, seperti route lain di app/api.
import { muatBerita, type Ingatan } from "@/features/berita/muat";
import { SUMBER_BERITA, type BeritaResponse } from "@/features/berita/sumber";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";
export const maxDuration = 20;

const SEGAR_DETIK = 20 * 60;
const SEGAR_MS = SEGAR_DETIK * 1000;
// Semua feed gagal: coba lagi lebih cepat, tapi tetap tidak di setiap permintaan.
const SEMUA_GAGAL_MS = 5 * 60 * 1000;
const WAKTU_TUNGGU_MS = 8000;
const UKURAN_MAKS = 3 * 1024 * 1024;

const HEADER_FEED = {
  "User-Agent": `BatamCityHall/0.1 (pembaca RSS, proyek warga non-komersial; +${SITE_URL})`,
  Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9",
};

const ingatan: Ingatan = new Map();
let tersimpan: { isi: BeritaResponse; sampai: number } | null = null;
let sedangJalan: Promise<BeritaResponse> | null = null;

async function ambilTeks(url: string): Promise<string> {
  const res = await fetch(url, {
    cache: "no-store",
    redirect: "follow",
    signal: AbortSignal.timeout(WAKTU_TUNGGU_MS),
    headers: HEADER_FEED,
  });
  if (!res.ok) throw new Error(`http ${res.status}`);
  const baca = res.body?.getReader();
  if (!baca) throw new Error("respons tanpa isi");
  const dekoder = new TextDecoder();
  let teks = "";
  let ukuran = 0;
  for (;;) {
    const { done, value } = await baca.read();
    if (done) return teks + dekoder.decode();
    ukuran += value.byteLength;
    if (ukuran > UKURAN_MAKS) {
      await baca.cancel();
      throw new Error("feed terlalu besar");
    }
    teks += dekoder.decode(value, { stream: true });
  }
}

const semuaGagal = (b: BeritaResponse) => b.sumber.every((s) => s.status === "gagal");

async function muat(): Promise<BeritaResponse> {
  const now = Date.now();
  if (tersimpan && now < tersimpan.sampai) return tersimpan.isi;
  // Permintaan yang datang bersamaan menunggu satu tarikan yang sama.
  sedangJalan ??= muatBerita({
    sumber: SUMBER_BERITA,
    ambilTeks,
    ingatan,
    now,
    saatGagal: (s, e) => console.warn(`[berita] ${s.id} gagal:`, (e as Error)?.message),
  })
    .then((isi) => {
      tersimpan = { isi, sampai: now + (semuaGagal(isi) ? SEMUA_GAGAL_MS : SEGAR_MS) };
      return isi;
    })
    .finally(() => {
      sedangJalan = null;
    });
  return sedangJalan;
}

export async function GET() {
  const isi = await muat();
  if (!isi.item.length && semuaGagal(isi)) {
    return Response.json(isi, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  const tahan = semuaGagal(isi) ? SEMUA_GAGAL_MS / 1000 : SEGAR_DETIK;
  return Response.json(isi, {
    headers: { "Cache-Control": `public, s-maxage=${tahan}, stale-while-revalidate=${tahan}` },
  });
}
