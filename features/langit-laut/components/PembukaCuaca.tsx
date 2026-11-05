"use client";

import Image from "next/image";
import Link from "next/link";
import KisiPintu from "@/components/site/KisiPintu";
import type { FramesResponse, OfsResponse, PerairanResponse } from "@/features/langit-laut/lib/api-types";
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

/** Keadaan sekarang di kepala halaman Cuaca. */
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
            {slot && `prakiraan sampai pukul ${WIB(slot.validTo)} WIB`}
          </p>
        )}
      </div>
    </div>
  );
}

const ENTRI = [
  {
    href: "/cuaca/hujan",
    judul: "Radar Hujan",
    ket: "Hujan 2,5 jam terakhir, diperbarui setiap 5 menit.",
    grafis: "/grafis/sub-radar.webp",
  },
  {
    href: "/cuaca/gelombang",
    judul: "Tinggi Gelombang",
    ket: "Prakiraan gelombang dan angin di perairan Batam.",
    grafis: "/grafis/sub-gelombang.webp",
  },
];

/** Isi halaman Cuaca: dua peta dengan status langsung, lalu peringatan dan gempa. */
export function IsiCuaca() {
  const { rv, slot } = useCuacaSekarang();
  const stat = statusRadar(rv.latestAge);
  const nada = stat === "Langsung" ? "ok" : stat === "Tertunda" ? "caution" : "danger";
  const baris: Record<string, React.ReactNode> = {
    "/cuaca/hujan": rv.latest ? (
      <span className="bch-status bch-data" data-tone={nada}>
        {stat} · citra pukul {rv.latest.time} WIB
      </span>
    ) : null,
    "/cuaca/gelombang": slot ? <span className="bch-data">Berlaku sampai pukul {WIB(slot.validTo)} WIB</span> : null,
  };
  return (
    <>
      <ul className="bch-daftar-polos cu-entri">
        {ENTRI.map((e) => (
          <li key={e.href}>
            <Link href={e.href} prefetch={false}>
              <Image className="bch-grafis" src={e.grafis} alt="" width={746} height={466} unoptimized loading="lazy" />
              <span className="judul">{e.judul}</span>
              <span className="ket">{e.ket}</span>
            </Link>
            <p className="cu-entri-status">{baris[e.href]}</p>
          </li>
        ))}
        <li className="cu-entri-pintu">
          <KisiPintu
            kolom={1}
            isi={[
          { href: "/cuaca/peringatan", nama: "Peringatan Dini", ket: "Yang berlaku di Kepulauan Riau, kecamatan di Batam disebut." },
          { href: "/cuaca/gempa", nama: "Gempa Terkini", ket: "Gempa di seluruh Indonesia, dengan jarak dari Batam." },
            ]}
          />
        </li>
      </ul>
    </>
  );
}
