"use client";

import Image from "next/image";
import Link from "next/link";
import type { FramesResponse, OfsResponse, PerairanResponse } from "@/features/langit-laut/lib/api-types";
import { MAPPED_CAMS } from "@/features/langit-laut/lib/cctv";
import { currentSlot } from "@/features/langit-laut/lib/perairan";
import { kalimatGelombang, kalimatHujan, radarView, statusRadar } from "@/features/langit-laut/lib/status";
import { useNow } from "@/features/langit-laut/hooks/useBrowser";
import { useResource } from "@/features/langit-laut/hooks/useResource";

const NOL = new Set<string>();
const WIB = (iso: string) =>
  new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Jakarta" }).format(Date.parse(iso));

function useCuacaSekarang() {
  const now = useNow(30_000);
  const frames = useResource<FramesResponse>("/api/frames", 120_000, true, false);
  const perairan = useResource<PerairanResponse>("/api/perairan", 600_000, true, false);
  useResource<OfsResponse>("/api/ofs-frame", 600_000, false, false);
  const daftar = frames.data?.frames ?? [];
  const rv = radarView({
    frames: daftar,
    idx: Math.max(0, daftar.length - 1),
    status: frames.error && !daftar.length ? "error" : daftar.length ? "ok" : "loading",
    offline: false,
    now,
    broken: NOL,
  });
  const slot = currentSlot(perairan.data, now).entry;
  return { rv, echo: frames.data?.echo ?? null, slot, ada: !!frames.data || !!perairan.data };
}

/** Blok SAAT INI di pembuka Loket 01 (PEDOMAN 3.3). */
export function SaatIni() {
  const { rv, echo, slot, ada } = useCuacaSekarang();
  const hujan = kalimatHujan(echo);
  const gelombang = slot ? kalimatGelombang(slot) : null;
  return (
    <div className="cu-saat-ini" data-saat-ini>
      <p className="bch-kicker m-0">Saat ini</p>
      <div>
        <p className="cu-saat-ini-teks">{ada ? [hujan, gelombang].filter(Boolean).join(" ") || "Data cuaca belum dapat dimuat." : "Memuat data"}</p>
        {(rv.latest || slot) && (
          <p className="bch-data cu-saat-ini-baris">
            {rv.latest && `Radar pukul ${rv.latest.time} WIB`}
            {rv.latest && slot && " · "}
            {slot && `prakiraan berlaku sampai pukul ${WIB(slot.validTo)} WIB`}
          </p>
        )}
      </div>
    </div>
  );
}

const ENTRI = [
  {
    no: "01",
    href: "/cuaca/hujan",
    judul: "Radar Hujan",
    ket: "Hujan dalam 2,5 jam terakhir, diperbarui setiap 5 menit.",
    grafis: "/grafis/sub-radar.webp",
  },
  {
    no: "02",
    href: "/cuaca/gelombang",
    judul: "Tinggi Gelombang",
    ket: "Prakiraan gelombang dan angin di perairan Batam.",
    grafis: "/grafis/sub-gelombang.webp",
  },
  {
    no: "03",
    href: "/cuaca/cctv",
    judul: "CCTV Lalu Lintas",
    ket: `Kamera lalu lintas di ${MAPPED_CAMS.length} titik jalan utama Batam.`,
    grafis: "/grafis/sub-cctv.webp",
  },
];

/** ISI LOKET INI: tiga entri berilustrasi dengan baris status. */
export function IsiLoketCuaca() {
  const { rv, slot } = useCuacaSekarang();
  const stat = statusRadar(rv.latestAge);
  const nada = stat === "Langsung" ? "ok" : stat === "Tertunda" ? "caution" : "danger";
  const baris: Record<string, React.ReactNode> = {
    "01": rv.latest ? (
      <span className="bch-status bch-data" data-tone={nada}>
        {stat} · citra pukul {rv.latest.time} WIB
      </span>
    ) : null,
    "02": slot ? <span className="bch-data">Prakiraan berlaku sampai pukul {WIB(slot.validTo)} WIB</span> : null,
    "03": <span className="bch-data">{MAPPED_CAMS.length} titik kamera</span>,
  };
  return (
    <ul className="bch-daftar-polos cu-entri">
      {ENTRI.map((e) => (
        <li key={e.no}>
          <Link href={e.href} prefetch={false}>
            <Image className="bch-grafis" src={e.grafis} alt="" width={746} height={466} unoptimized loading="lazy" />
            <span className="no">{e.no}</span>
            <span className="judul">{e.judul}</span>
            <span className="ket">{e.ket}</span>
          </Link>
          <p className="cu-entri-status">{baris[e.no]}</p>
        </li>
      ))}
    </ul>
  );
}
