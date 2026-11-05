// Gempa terkini BMKG: tiga berkas digabung jadi satu daftar. Penguraian ada di lib/gempa.ts.
import type { GempaDaftar, GempaResponse } from "@/features/langit-laut/lib/api-types";
import { gabungGempa, uraiGempa } from "@/features/langit-laut/lib/gempa";
import { BMKG_GEMPA, BMKG_HEADERS } from "@/features/langit-laut/lib/sources";

export const dynamic = "force-dynamic";
export const maxDuration = 15;

const FETCH_TIMEOUT_MS = 8000;
// BMKG membatasi 60 permintaan per menit per IP dan berkasnya ber-max-age=60. Satu tarikan = 3
// permintaan, jadi paling sering 3 per menit per instance, tanpa bergantung CDN (Railway tidak punya).
const SEGAR_MS = 60 * 1000;
// Setelah gagal jangan langsung mencoba lagi: tiap kunjungan akan menambah beban sumber yang sedang susah.
const JEDA_GAGAL_MS = 30 * 1000;
// Daftar gempa tetap benar walau lama, tetapi bisa ketinggalan gempa baru. Lebih lama dari ini = gagal.
const BASI_MAKS_MS = 6 * 3600 * 1000;

const OK_HEADERS = { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=60" };
const SEBAGIAN_HEADERS = { "Cache-Control": "public, s-maxage=30" };

const URUTAN: GempaDaftar[] = ["terbaru", "dirasakan", "m5"];

let simpanan: { body: GempaResponse; at: number } | null = null;
let gagalPada = 0;
let berjalan: Promise<void> | null = null;

async function tarikBerkas(daftar: GempaDaftar) {
  // Tanpa Data Cache: cache Next menyajikan entri basi sebagai 200 saat BMKG gagal.
  const res = await fetch(BMKG_GEMPA[daftar], {
    cache: "no-store",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: BMKG_HEADERS,
  });
  if (!res.ok) throw new Error(`http ${res.status}`);
  const hasil = uraiGempa(await res.json(), daftar);
  if (!hasil) throw new Error("schema");
  return hasil;
}

async function perbarui() {
  const hasil = await Promise.allSettled(URUTAN.map(tarikBerkas));
  const berhasil = hasil.flatMap((h) => (h.status === "fulfilled" ? [h.value] : []));
  hasil.forEach((h, i) => {
    if (h.status === "rejected") console.warn(`[gempa] ${URUTAN[i]} gagal:`, (h.reason as Error)?.message);
  });
  const now = Date.now();
  if (!berhasil.length) {
    gagalPada = now;
    return;
  }
  gagalPada = 0;
  simpanan = {
    at: now,
    body: {
      status: berhasil.length === URUTAN.length ? "ok" : "sebagian",
      diambil: new Date(now).toISOString(),
      gempa: gabungGempa(berhasil),
    },
  };
}

export async function GET() {
  const now = Date.now();
  const perluTarik = !(simpanan && now - simpanan.at < SEGAR_MS) && now - gagalPada >= JEDA_GAGAL_MS;
  if (perluTarik) await (berjalan ??= perbarui().finally(() => (berjalan = null)));

  const s = simpanan;
  if (s && Date.now() - s.at < SEGAR_MS) {
    return Response.json(s.body, { headers: s.body.status === "ok" ? OK_HEADERS : SEBAGIAN_HEADERS });
  }
  if (s && Date.now() - s.at < BASI_MAKS_MS) {
    return Response.json({ ...s.body, status: "basi" } satisfies GempaResponse, { headers: SEBAGIAN_HEADERS });
  }
  const gagal: GempaResponse = { status: "gagal", diambil: "", gempa: [] };
  return Response.json(gagal, { status: 503, headers: { "Cache-Control": "no-store" } });
}
