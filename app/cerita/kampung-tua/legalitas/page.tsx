import type { Metadata } from "next";
import Link from "next/link";
import { NavKampungTua, PitaBertanggal } from "@/features/kampung-tua/Bagian";
import { LEGALITAS } from "@/features/kampung-tua/data";
import "@/features/kampung-tua/kampung-tua.css";

export const metadata: Metadata = {
  title: "Kronologi legalitas kampung tua",
  description: "Garis waktu bertanggal soal kampung tua di Batam, dengan siapa yang mengatakan apa.",
};

export default function Legalitas() {
  const disaring = LEGALITAS.filter((b) => b.disaring).length;
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">
        <Link href="/cerita/kampung-tua">Kampung Tua</Link> · Kronologi
      </p>
      <h1 className="mt-2">Kronologi legalitas</h1>
      <p className="bch-lede">Apa yang terjadi, kapan, dan siapa yang mencatatnya.</p>
      <PitaBertanggal catatan="Situasinya terus bergerak. Peristiwa terakhir yang kami catat: 16 Oktober 2026." />
      <NavKampungTua aktif="legalitas" />

      <p className="bch-measure mt-5">
        Kami tidak menampilkan luas, batas, atau status lahan. {disaring} butir di bawah sudah disaring dan ditandai.
        Untuk urusan tanah Anda sendiri, lihat <Link href="/info/urusan-tanah">panduan urusan tanah</Link>.
      </p>

      <ol className="kt-kronologi" data-kronologi-legalitas>
        {LEGALITAS.map((b) => (
          <li key={b.tanggal} data-disaring={b.disaring}>
            <span className="kt-kronologi-tgl">{b.tanggal}</span>
            <p className="kt-kronologi-isi">{b.peristiwa}</p>
            <p className="kt-kronologi-siapa">Menurut: {b.siapa}</p>
            {b.disaring && (
              <p>
                <span className="bch-badge">Sebagian isi disaring</span>
              </p>
            )}
          </li>
        ))}
      </ol>

      <p className="bch-measure mt-5">
        Sejak 2025, Wali Kota Batam Amsakar Achmad juga merangkap Kepala BP Batam. Ada yang keliru?{" "}
        <Link href="/koreksi">Kabari kami</Link>.
      </p>
    </div>
  );
}
