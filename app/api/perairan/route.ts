// Prakiraan resmi BMKG untuk "Perairan Kep. Batam" (P.R.02, Stamet Hang Nadim): kategori &
// tinggi gelombang per jam, angin/hembusan, arus, cuaca — plus PERINGATAN DINI gelombang yang
// menyebut perairan Batam. Data persis Batam (bukan proksi), pelengkap field warna OFS.
// Penguraian & pemilihan jam yang berlaku ada di lib/perairan.ts.
import type { PerairanResponse, PerairanWarn } from "@/features/langit-laut/lib/api-types";
import { emptyPerairan, parseBulletin, pickPerairan, warnAt } from "@/features/langit-laut/lib/perairan";
import { BMKG_HEADERS, OFS_PERAIRAN, OFS_WARNINGS } from "@/features/langit-laut/lib/sources";

export const dynamic = "force-dynamic";
export const maxDuration = 10;

// Latensi BMKG terukur 0,7–3,6 dtk → 8 dtk (4 dtk pernah bikin 503 di panggilan pertama).
const FETCH_TIMEOUT_MS = 8000;
// Berkas terbit ±sekali sehari (issued 12.00 UTC, Last-Modified ±00.00 UTC) dan mencakup
// 3 hari; data mentah terakhir tetap jujur selama jamnya dipilih ulang tiap request.
const LAST_GOOD_MAX_MS = 36 * 3600 * 1000;
// Aman di-cache: respons membawa slot 48 jam ke depan dan klien memilih jamnya sendiri.
const OK_HEADERS = { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1800" };
// Peringatan gagal dimuat → status "unknown"; jangan dikunci lama di CDN.
const WARN_UNKNOWN_HEADERS = { "Cache-Control": "public, s-maxage=60" };

type Raw = Record<string, unknown>;
let lastGood: { raw: Raw; at: number } | null = null;
// Buletin peringatan yang pernah terlihat (per instance). BMKG MENIMPA warnings.json ±19.00 WIB
// dengan buletin yang baru berlaku 07.00 WIB esoknya → buletin yang berlaku malam itu hanya
// ada kalau instance ini sempat melihatnya. Dibuang begitu masa berlakunya habis.
let bulletins: PerairanWarn[] = [];
let warnFetchedAt = 0;
const WARN_FRESH_MS = 24 * 3600e3; // lebih lama tak berhasil ambil → buletin pengganti bisa terlewat

// Prakiraan: Data Cache Next boleh (berkas harian; slot dipilih ulang tiap request).
// Peringatan: TANPA Data Cache — cache Next menyajikan entri basi sebagai 200 saat BMKG gagal,
// sehingga "gagal ambil" tak pernah terdeteksi dan aturan kesegaran 24 jam tak jalan.
async function getJson(url: string, fresh = false): Promise<Raw> {
  const res = await fetch(url, {
    ...(fresh ? { cache: "no-store" as const } : { next: { revalidate: 1800 } }),
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: BMKG_HEADERS,
  });
  if (!res.ok) throw new Error(`http ${res.status}`);
  return (await res.json()) as Raw;
}

export async function GET() {
  const [p, w] = await Promise.allSettled([getJson(OFS_PERAIRAN), getJson(OFS_WARNINGS, true)]);
  const now = Date.now();
  // Peringatan: simpan buletin baru; gagal/skema berubah → tetap pakai yang masih berlaku.
  if (w.status === "fulfilled") {
    const b = parseBulletin(w.value);
    if (b) {
      warnFetchedAt = now;
      // satu masa mulai = satu buletin: terbitan koreksi (from sama, isi/until beda) menggantikan yang lama
      bulletins = [...bulletins.filter((x) => x.from !== b.from), b]
        .filter((x) => Date.parse(x.until) > now)
        .slice(-4);
      // warnings.json tidak selalu memuat semua provinsi (4 Nov 2026: 25 dari 38 tidak ada), jadi ini
      // bukan berarti tidak ada peringatan. Statusnya tetap "unknown", tidak pernah "aman".
    } else console.warn('[perairan] peringatan: tidak ada buletin "Kep. Riau" di warnings.json, atau skemanya berubah');
  } else console.warn("[perairan] peringatan gagal:", (w.reason as Error)?.message);
  const known = now - warnFetchedAt < WARN_FRESH_MS ? bulletins : [];

  if (p.status === "fulfilled" && Array.isArray(p.value.forecast_day1)) {
    lastGood = { raw: p.value, at: now };
    const body = pickPerairan(p.value, known, now) satisfies PerairanResponse;
    const ok = warnAt(body.warns, now).current.status === "ok";
    return Response.json(body, { headers: ok ? OK_HEADERS : WARN_UNKNOWN_HEADERS });
  }
  console.warn(
    "[perairan] prakiraan gagal:",
    p.status === "rejected" ? (p.reason as Error)?.message : "schema: forecast_day1 bukan array",
  );
  if (lastGood && now - lastGood.at < LAST_GOOD_MAX_MS) {
    return Response.json(pickPerairan(lastGood.raw, known, now), { headers: { "Cache-Control": "public, s-maxage=120" } });
  }
  return Response.json(emptyPerairan(), { status: 503, headers: { "Cache-Control": "no-store" } });
}
