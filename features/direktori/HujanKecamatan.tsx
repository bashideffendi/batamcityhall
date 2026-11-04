"use client";

import Link from "next/link";
import { useNow, useOffline } from "@/features/langit-laut/hooks/useBrowser";
import { useResource } from "@/features/langit-laut/hooks/useResource";
import type { FramesResponse } from "@/features/langit-laut/lib/api-types";
import { ageMinutesOf } from "@/features/langit-laut/lib/radar";
import { kecTable, LIVE_MAX_AGE_MIN } from "@/features/langit-laut/lib/status";

const SEGAR_MS = 2 * 60 * 1000;
const TICK_MS = 30 * 1000;

const samaNama = (a: string, b: string) => a.toLowerCase().replace(/\s+/g, "") === b.toLowerCase().replace(/\s+/g, "");

// "Lagi hujan di sini". Hanya muncul kalau radar terbaru masih segar dan memang ada hujan: selain itu diam,
// karena tidak tahu bukan berarti cerah.
export default function HujanKecamatan({ kecamatan }: { kecamatan: string }) {
  const offline = useOffline();
  const now = useNow(TICK_MS);
  const frames = useResource<FramesResponse>("/api/frames", SEGAR_MS, true, false);
  const terakhir = frames.data?.frames.at(-1);
  const umur = terakhir ? ageMinutesOf(terakhir.ts, now) : null;
  if (offline || umur === null || umur > LIVE_MAX_AGE_MIN) return null;

  const baris = kecTable(frames.data?.echo ?? null, "batam")
    .flatMap((g) => g.rows)
    .find((r) => samaNama(r.name, kecamatan));
  if (!baris?.level) return null;

  return (
    <p className="bch-note" data-hujan-kecamatan>
      Lagi hujan di {kecamatan}. <span className="bch-data">Perkiraan radar MSS, {umur} menit lalu.</span>{" "}
      <Link href="/langit-laut?mode=hujan" prefetch={false}>
        Lihat radar
      </Link>
    </p>
  );
}
