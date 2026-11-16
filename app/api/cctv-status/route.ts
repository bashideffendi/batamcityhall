// Status 28 kamera CCTV Pemko, diperiksa server paling sering tiap 5 menit untuk semua pengunjung. Hasilnya dipakai
// untuk menandai kamera mati di peta dan daftar sebelum diketuk, dan untuk menulis perkiraan pemakaian data per kamera.
//
// Per pemeriksaan: satu GET playlist (~250 B) per kamera, dan satu HEAD ke potongan terakhir kamera yang hidup
// (tanpa isi video) untuk membaca ukurannya. Paling banyak 4 permintaan bersamaan ke server Pemko.
import {
  CAMS,
  CCTV_HOST,
  mbPerMenit,
  potonganTerakhir,
  streamUrl,
  vonisPlaylist,
  type JawabanStatusKamera,
  type StatusKamera,
} from "@/features/langit-laut/lib/cctv";
import { cacheRespons } from "@/lib/cache-respons";

export const dynamic = "force-dynamic";

const BATAS_MS = 6000;
const SERENTAK = 4;
// Tenggat seluruh sapuan. Bila server kamera menggantung, 28 kamera x 6 detik bisa menahan jawaban hampir semenit.
const TENGGAT_SAPUAN_MS = 12_000;

async function periksa(slug: string): Promise<StatusKamera> {
  try {
    const r = await fetch(streamUrl(slug), { cache: "no-store", signal: AbortSignal.timeout(BATAS_MS) });
    const teks = r.ok ? await r.text() : "";
    const vonis = vonisPlaylist(r.status, teks, r.headers.get("last-modified"));
    let mb: number | null = null;
    const akhir = vonis.verdict === "ok" ? potonganTerakhir(teks) : null;
    // Nama potongan dari playlist hanya dipakai bila berupa nama berkas biasa di folder kamera ini.
    if (akhir && /^[\w.-]+\.ts$/.test(akhir.nama)) {
      const h = await fetch(`${CCTV_HOST}/cctv/${slug}/${akhir.nama}`, {
        method: "HEAD",
        cache: "no-store",
        signal: AbortSignal.timeout(BATAS_MS),
      }).catch(() => null);
      mb = mbPerMenit(Number(h?.headers.get("content-length") ?? 0), akhir.detik);
    }
    return { ...vonis, mbPerMenit: mb === null ? null : Math.round(mb * 10) / 10 };
  } catch {
    return { verdict: "diam", lastSeen: null, mbPerMenit: null };
  }
}

/** Kamera yang belum sempat diperiksa saat tenggat habis tidak ditulis: statusnya tidak diketahui, bukan mati. */
async function periksaSemua(): Promise<{ kamera: Record<string, StatusKamera>; lengkap: boolean }> {
  const hasil: Record<string, StatusKamera> = {};
  const tenggat = Date.now() + TENGGAT_SAPUAN_MS;
  let berikut = 0;
  const pekerja = async () => {
    while (berikut < CAMS.length && Date.now() < tenggat) {
      const slug = CAMS[berikut++].slug;
      hasil[slug] = await periksa(slug);
    }
  };
  await Promise.all(Array.from({ length: SERENTAK }, pekerja));
  return { kamera: hasil, lengkap: Object.keys(hasil).length === CAMS.length };
}

export async function GET() {
  return cacheRespons("cctv-status", async () => {
    const { kamera, lengkap } = await periksaSemua();
    const isi: JawabanStatusKamera = { diperiksa: new Date().toISOString(), kamera };
    // Sapuan yang terpotong tenggat hanya disimpan semenit, supaya segera diulang.
    const simpan = lengkap ? "public, s-maxage=300, stale-while-revalidate=600" : "public, s-maxage=60";
    return Response.json(isi, { headers: { "Cache-Control": simpan } });
  });
}
