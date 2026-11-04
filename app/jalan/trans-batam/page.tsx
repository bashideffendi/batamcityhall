import type { Metadata } from "next";
import Link from "next/link";
import DiagramSkematik, { gayaKoridor } from "@/features/jalan/DiagramSkematik";
import InfoPraktisTrans from "@/features/jalan/InfoPraktisTrans";
import JalanNav from "@/features/jalan/JalanNav";
import {
  INFO,
  KORIDOR,
  lencanaKoridor,
  slugKoridor,
  teksHeadway,
  teksJam,
  TEKS_TANGGAL_DATA,
} from "@/features/jalan/trans-data";

export const metadata: Metadata = {
  title: "Trans Batam",
  description: "Diagram 9 koridor aktif Trans Batam, urutan halte, jam operasi, headway, tarif, dan cara bayar.",
};

export default function TransBatam() {
  const sipTb = INFO.aplikasi.find((a) => a.nama === "SIP TB");
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">Loket 04 · Jalan-jalan</p>
      <h1 className="mt-2">Trans Batam</h1>
      <p className="bch-lede">9 koridor aktif, 1 rencana. Tarif Rp5.000, pelajar Rp2.500, nontunai.</p>
      <JalanNav aktif="/jalan/trans-batam" />

      <p className="bch-note mt-5">
        Data {TEKS_TANGGAL_DATA}. Daftar halte berasal dari media sekunder yang menyalin SIP TB dan Dishub, jadi bisa
        salah ketik atau terpotong. Belum ada satu pun koordinat halte yang terverifikasi.{" "}
        <Link href="/koreksi" prefetch={false}>
          Lapor kalau ada yang salah
        </Link>
        .
      </p>
      <p className="mt-3">
        Mau tahu posisi bus? Pakai{" "}
        <a href={sipTb?.url} target="_blank" rel="noopener" className="jl-tautan-resmi">
          aplikasi SIP TB
        </a>{" "}
        (Android). Situs ini tidak melacak bus.
      </p>

      <h2 className="mt-7 mb-4">Diagram</h2>
      <DiagramSkematik />

      <h2 className="mt-7 mb-4">Koridor</h2>
      <ul className="bch-grid jl-grid-koridor">
        {KORIDOR.map((k) => {
          const jam = teksJam(k);
          const headway = teksHeadway(k);
          return (
            <li key={k.id}>
              <Link
                href={`/jalan/trans-batam/${slugKoridor(k.id)}`}
                prefetch={false}
                className="bch-card h-full jl-k jl-kartu-koridor"
                style={gayaKoridor(k)}
                data-koridor={k.id}
                data-rencana={k.status === "rencana" ? "" : undefined}
              >
                <span className="jl-chip">
                  <span className="jl-chip-warna" aria-hidden="true" />
                  <span className="bch-data">{k.id}</span>
                </span>
                <h3>{k.nama}</h3>
                {k.status === "aktif" ? (
                  <span className="bch-card-meta">
                    {jam}
                    <br />
                    Headway: {headway.teks}
                    {headway.perluCek ? ", perlu cek ulang" : ""}
                  </span>
                ) : (
                  <span className="bch-card-meta">Belum beroperasi. Belum ada jadwal dan daftar halte.</span>
                )}
                <span className="bch-badges mt-2">
                  {lencanaKoridor(k).map((l) => (
                    <span key={l.teks} className="bch-badge" data-tone={l.nada}>
                      {l.teks}
                    </span>
                  ))}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-7">
        <InfoPraktisTrans />
      </div>
    </div>
  );
}
