import type { Metadata } from "next";
import TautanKirim from "@/components/site/TautanKirim";
import { ROBOTS_TERSEMBUNYI } from "@/lib/site";
import Link from "next/link";
import { NavKampungTua, PitaBertanggal } from "@/features/kampung-tua/Bagian";
import { LEGALITAS_TAMPIL } from "@/features/kampung-tua/data";
import { LABEL_PIHAK } from "@/features/kampung-tua/rempang";
import "@/features/kampung-tua/kampung-tua.css";

const LEDE = "Keputusan dan peristiwa penting tentang kampung tua disusun menurut tanggal.";

export const metadata: Metadata = {
  title: "Kronologi Legalitas Kampung Tua",
  robots: ROBOTS_TERSEMBUNYI,
  description: LEDE,
};

export default function Legalitas() {
  return (
    <div className="bch-page">
      <nav className="bch-remah" aria-label="Remah roti">
        <Link href="/cerita/kampung-tua" prefetch={false}>Kampung Tua</Link> / Kronologi
      </nav>
      <h1 className="mt-2">Kronologi Legalitas Kampung Tua</h1>
      <PitaBertanggal />
      <p className="bch-lede">{LEDE}</p>
      <NavKampungTua aktif="legalitas" />

      <p className="bch-measure mt-5">
        Halaman ini tidak memuat batas wilayah, luas, atau status lahan. Untuk urusan tanah sendiri, lihat{" "}
        <Link href="/info/urusan-tanah">panduan urusan tanah</Link>.
      </p>

      <ol className="kt-kronologi" data-kronologi-legalitas>
        {LEGALITAS_TAMPIL.map((b) => (
          <li key={b.tanggal} data-pihak={b.pelaku ?? undefined}>
            <span className="kt-kronologi-tgl">{b.tanggalTeks}</span>
            {b.pelaku && (
              <p>
                <span className="bch-badge">{LABEL_PIHAK[b.pelaku]}</span>
              </p>
            )}
            <p className="kt-kronologi-isi">{b.peristiwa}</p>
            <p className="kt-kronologi-siapa">Dicatat oleh {b.siapa}</p>
          </li>
        ))}
      </ol>

      <p className="bch-measure mt-5">
        Sejak 2025, Wali Kota Batam Amsakar Achmad juga merangkap Kepala BP Batam.{" "}
        <TautanKirim href="/koreksi">Kirim Koreksi</TautanKirim>
      </p>
    </div>
  );
}
