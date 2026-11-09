// Kualitas udara Batam dari Open-Meteo (model Copernicus CAMS). Ditarik dari server: IP pengguna tidak terkirim ke
// Open-Meteo, dan cache memori menahan permintaan (PEDOMAN 8.5). Model diperbarui dua kali sehari, jadi 30 menit
// sudah cukup segar dan jauh di bawah batas 10.000 permintaan per hari.
import { BMKG_HEADERS, OPEN_METEO_UDARA } from "@/features/langit-laut/lib/sources";
import { bentukUdara, UDARA_KOSONG } from "@/features/langit-laut/lib/udara";
import { cacheRespons } from "@/lib/cache-respons";

export const dynamic = "force-dynamic";
export const maxDuration = 10;

const FETCH_TIMEOUT_MS = 8000;
const LAST_GOOD_MAX_MS = 6 * 3600 * 1000;
const OK_HEADERS = { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" };

let lastGood: { raw: Record<string, unknown>; at: number } | null = null;

async function muatRespons(): Promise<Response> {
  try {
    const res = await fetch(OPEN_METEO_UDARA, {
      cache: "no-store",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      // Identitas yang sama dengan permintaan server lain: nama situs, tanpa menyamar sebagai peramban.
      headers: BMKG_HEADERS,
    });
    if (!res.ok) throw new Error(`http ${res.status}`);
    const raw = (await res.json()) as Record<string, unknown>;
    const body = bentukUdara(raw, new Date());
    lastGood = { raw, at: Date.now() };
    return Response.json(body, { headers: OK_HEADERS });
  } catch (e) {
    console.warn("[kualitas-udara] gagal:", (e as Error)?.message);
    if (lastGood && Date.now() - lastGood.at < LAST_GOOD_MAX_MS) {
      try {
        const body = bentukUdara(lastGood.raw, new Date(lastGood.at));
        return Response.json(body, { headers: { "Cache-Control": "public, s-maxage=120" } });
      } catch {
        // Jatuh ke jawaban kosong di bawah.
      }
    }
    return Response.json(UDARA_KOSONG, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}

export function GET() {
  return cacheRespons("kualitas-udara", muatRespons);
}
