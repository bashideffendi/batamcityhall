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

async function periksaSemua(): Promise<Record<string, StatusKamera>> {
  const hasil: Record<string, StatusKamera> = {};
  let berikut = 0;
  const pekerja = async () => {
    while (berikut < CAMS.length) {
      const slug = CAMS[berikut++].slug;
      hasil[slug] = await periksa(slug);
    }
  };
  await Promise.all(Array.from({ length: SERENTAK }, pekerja));
  return hasil;
}

export async function GET() {
  return cacheRespons("cctv-status", async () => {
    const isi: JawabanStatusKamera = { diperiksa: new Date().toISOString(), kamera: await periksaSemua() };
    return Response.json(isi, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } });
  });
}
