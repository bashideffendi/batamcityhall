"use client";

import Link from "next/link";
import { useMemo } from "react";
import { hitungFeri, ringkasHariIni } from "@/features/jalan/feri-terakhir";
import { useEntriFeri } from "@/features/jalan/useFeri";
import { useNow, useOffline } from "@/features/langit-laut/hooks/useBrowser";
import { useResource } from "@/features/langit-laut/hooks/useResource";
import type { FramesResponse, OfsResponse, PerairanResponse } from "@/features/langit-laut/lib/api-types";
import { warnAt } from "@/features/langit-laut/lib/perairan";
import { ofsAnswer, ofsView, radarView, rainAnswer } from "@/features/langit-laut/lib/status";
import { OFS_HOST } from "@/features/langit-laut/lib/sources";

const NOL = new Set<string>();
const SEGAR_MS = 2 * 60 * 1000;
const OMBAK_MS = 10 * 60 * 1000;
const TICK_MS = 30 * 1000;

/** Kalimat peringatan: tidak tahu tetap ditulis tidak tahu, tidak pernah terbaca sebagai aman. */
function teksPeringatan(p: PerairanResponse | null, error: boolean, now: number): string {
  if (!p && !error) return "Memuat…";
  const { current } = warnAt(p?.warns, now);
  if (current.status !== "ok") return "Status belum tersedia. Cek langsung ke BMKG.";
  return current.text || "BMKG tidak menyebut Perairan Kep. Batam di buletin yang berlaku.";
}

/** Baris feri: jadwal statis, jadi tidak pernah terbaca sebagai status kapal sekarang. */
function BarisFeri({ now }: { now: number }) {
  const { data, gagal } = useEntriFeri();
  const ringkas = useMemo(() => (data ? ringkasHariIni(hitungFeri(data, new Date(now))) : null), [data, now]);
  return (
    <div data-baris="feri">
      <dt className="bch-kicker">Feri</dt>
      <dd>
        <Link href="/jalan/feri" prefetch={false}>
          {gagal ? "Jadwal feri gagal dimuat. Cek ke operator." : (ringkas?.judul ?? "Memuat…")}
        </Link>
        {ringkas?.rincian && <span>{ringkas.rincian}</span>}
      </dd>
    </div>
  );
}

// Kotak "Hari Ini" di beranda (CLAUDE_CODE_PROMPT 4.1), dari sumber dan aturan yang sama dengan
// Langit & Laut. Feri terakhir dari jadwal statis data/feri/.
export default function HariIni() {
  const offline = useOffline();
  const now = useNow(TICK_MS);
  const frames = useResource<FramesResponse>("/api/frames", SEGAR_MS, true, false);
  const ofs = useResource<OfsResponse>("/api/ofs-frame", OMBAK_MS, true, false);
  const perairan = useResource<PerairanResponse>("/api/perairan", OMBAK_MS, true, false);

  const daftar = frames.data?.frames ?? [];
  const status = frames.error && !daftar.length ? "error" : daftar.length ? "ok" : "loading";
  const rv = radarView({ frames: daftar, idx: Math.max(0, daftar.length - 1), status, offline, now, broken: NOL });
  const hujan = rainAnswer({
    echo: frames.data?.echo ?? null,
    frames: daftar,
    rv,
    status,
    offline,
    now,
    scope: "batam",
  });
  const ov = ofsView({
    ofs: ofs.data,
    idx: ofs.data?.nowIndex ?? 0,
    failed: ofs.error,
    tilesDown: false,
    maskOk: true,
    offline,
  });
  const ombak = ofsAnswer(perairan.data, perairan.error, ov, offline, now);
  const peringatan = teksPeringatan(perairan.data, perairan.error, now);

  return (
    <section className="bch-hari-ini" aria-labelledby="hari-ini">
      <h2 id="hari-ini">Hari ini</h2>
      <dl>
        <div>
          <dt className="bch-kicker">Hujan</dt>
          <dd>
            <Link href="/langit-laut">{hujan.headline}</Link>
            {hujan.context && <span>{hujan.context}</span>}
          </dd>
        </div>
        <div>
          <dt className="bch-kicker">Ombak</dt>
          <dd>
            <Link href="/langit-laut?mode=ombak">{ombak.headline}</Link>
            {ombak.context && <span>{ombak.context}</span>}
          </dd>
        </div>
        <div>
          <dt className="bch-kicker">Peringatan</dt>
          <dd>
            <a href={OFS_HOST} target="_blank" rel="noopener">
              {peringatan}
            </a>
          </dd>
        </div>
        <BarisFeri now={now} />
      </dl>
      <p className="bch-attrib">
        Hujan dari radar MSS Singapura, proksi untuk Batam. Ombak dan peringatan dari BMKG. Feri dari jadwal operator
        yang kami salin, bukan status kapal.
      </p>
    </section>
  );
}
