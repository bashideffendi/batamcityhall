// Peringatan dini cuaca BMKG untuk Kep. Riau: RSS sebagai daftar, XML CAP sebagai isi. Penguraian ada
// di lib/peringatan-cuaca.ts. ?poligon=1 menyertakan poligon untuk peta (±20 KB per peringatan);
// kotak Hari Ini dan halaman teks tidak memerlukannya.
import type { PeringatanResponse } from "@/features/langit-laut/lib/api-types";
import {
  butirKepri,
  susunPeringatan,
  uraiCap,
  uraiRss,
  type HasilCap,
} from "@/features/langit-laut/lib/peringatan-cuaca";
import { BMKG_CAP_RSS, BMKG_HEADERS, bmkgCapUrl } from "@/features/langit-laut/lib/sources";
import { cacheRespons } from "@/lib/cache-respons";

export const dynamic = "force-dynamic";
export const maxDuration = 20;

const FETCH_TIMEOUT_MS = 8000;
const XML_HEADERS = { ...BMKG_HEADERS, Accept: "application/xml, text/xml" };
// BMKG membatasi 60 permintaan per menit per IP. RSS paling sering sekali per menit per instance, dan
// tiap XML cukup diambil sekali karena satu kode = satu pesan, jadi jauh di bawah batas tanpa CDN.
const SEGAR_MS = 60 * 1000;
const JEDA_GAGAL_MS = 30 * 1000;
/** Batas XML per tarikan, supaya RSS yang aneh tidak memicu banyak permintaan. Sisanya dilaporkan "sebagian". */
const MAKS_XML = 8;
// Peringatan berlaku ±2 jam. RSS gagal lebih lama dari ini = sudah tidak bisa dipakai sebagai gambaran.
const BASI_MAKS_MS = 3 * 3600 * 1000;

const OK_HEADERS = { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=60" };
const SEBAGIAN_HEADERS = { "Cache-Control": "public, s-maxage=30" };

const capTersimpan = new Map<string, HasilCap>();
let simpanan: { body: PeringatanResponse; at: number } | null = null;
let gagalPada = 0;
let berjalan: Promise<void> | null = null;

async function tarikTeks(url: string): Promise<string> {
  // Tanpa Data Cache: cache Next menyajikan entri basi sebagai 200 saat BMKG gagal.
  const res = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: XML_HEADERS,
  });
  if (!res.ok) throw new Error(`http ${res.status}`);
  return res.text();
}

async function tarikCap(kode: string): Promise<HasilCap | null> {
  const lama = capTersimpan.get(kode);
  if (lama) return lama;
  try {
    const hasil = uraiCap(await tarikTeks(bmkgCapUrl(kode)), kode);
    if (hasil) capTersimpan.set(kode, hasil);
    else console.warn(`[peringatan-cuaca] ${kode}: skema tidak dikenali`);
    return hasil;
  } catch (e) {
    console.warn(`[peringatan-cuaca] ${kode} gagal:`, (e as Error)?.message);
    return null;
  }
}

async function perbarui() {
  try {
    const rss = uraiRss(await tarikTeks(BMKG_CAP_RSS));
    if (!rss) throw new Error("skema RSS tidak dikenali");
    const kepri = rss.filter(butirKepri);
    const dipilih = kepri.slice(0, MAKS_XML);
    const hasil = await Promise.all(dipilih.map((b) => tarikCap(b.kode)));
    for (const kode of capTersimpan.keys()) if (!dipilih.some((b) => b.kode === kode)) capTersimpan.delete(kode);

    const now = Date.now();
    const berhasil = hasil.filter((h): h is HasilCap => h !== null);
    gagalPada = 0;
    simpanan = {
      at: now,
      body: {
        status: berhasil.length === kepri.length ? "ok" : "sebagian",
        diambil: new Date(now).toISOString(),
        peringatan: susunPeringatan(berhasil, now),
      },
    };
  } catch (e) {
    console.warn("[peringatan-cuaca] RSS gagal:", (e as Error)?.message);
    gagalPada = Date.now();
  }
}

const tanpaPoligon = (b: PeringatanResponse): PeringatanResponse => ({
  ...b,
  peringatan: b.peringatan.map((p) => ({ ...p, poligon: undefined })),
});

async function muatRespons(request: Request): Promise<Response> {
  const now = Date.now();
  const perluTarik = !(simpanan && now - simpanan.at < SEGAR_MS) && now - gagalPada >= JEDA_GAGAL_MS;
  if (perluTarik) await (berjalan ??= perbarui().finally(() => (berjalan = null)));

  const denganPoligon = new URL(request.url).searchParams.get("poligon") === "1";
  const kirim = (b: PeringatanResponse, headers: Record<string, string>) =>
    Response.json(denganPoligon ? b : tanpaPoligon(b), { headers });

  const s = simpanan;
  if (s && Date.now() - s.at < SEGAR_MS) return kirim(s.body, s.body.status === "ok" ? OK_HEADERS : SEBAGIAN_HEADERS);
  if (s && Date.now() - s.at < BASI_MAKS_MS) return kirim({ ...s.body, status: "basi" }, SEBAGIAN_HEADERS);
  const gagal: PeringatanResponse = { status: "gagal", diambil: "", peringatan: [] };
  return Response.json(gagal, { status: 503, headers: { "Cache-Control": "no-store" } });
}

export function GET(request: Request) {
  const poligon = new URL(request.url).searchParams.get("poligon") === "1";
  return cacheRespons(poligon ? "peringatan-cuaca:poligon" : "peringatan-cuaca", () => muatRespons(request));
}
