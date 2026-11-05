import type { Metadata } from "next";
import Link from "next/link";
import { DATA_DIHIMPUN, daftarKata } from "@/features/budaya/data";
import Kamus from "@/features/budaya/Kamus";
import NavBudaya, { KickerCerita } from "@/features/budaya/NavBudaya";
import "@/features/budaya/budaya.css";

const judulLede = (jumlah: number) =>
  `Kamus ini memuat ${jumlah} kata yang sering terdengar di Batam: kata Melayu Kepri, serapan dari Singapura dan Malaysia, dan istilah kawasan industri.`;

export const metadata: Metadata = {
  title: "Kamus Melayu Kepri dan Bahasa Batam",
  description: judulLede(daftarKata().length),
};

export default function HalamanKamus() {
  const entri = daftarKata();
  return (
    <div className="bch-page">
      <KickerCerita />
      <h1 className="mt-2">Kamus Melayu Kepri dan Bahasa Batam</h1>
      <p className="bch-lede">{judulLede(entri.length)}</p>
      <div className="bch-prose">
        <p>
          Bahasa sehari-hari Batam adalah campuran Melayu, Minang, dan “Medan”, ditambah serapan dari Singapura,
          Malaysia, dan Hokkien. Pemakaiannya berbeda menurut lingkungan pergaulan. Banyak kata di sini juga dipakai di
          Riau, Johor, dan Singapura.
        </p>
        <p>BPNB Kepri mencatat 15 dialek Melayu di Kepri, termasuk Dialek Pecong di Kelurahan Pecong, Batam.</p>
        <p className="bch-note" data-keterangan-bintang>
          Kata bertanda * masih menunggu pemeriksaan penutur.
        </p>
      </div>
      <Kamus entri={entri} />
      <p className="bch-card-meta mt-5">
        {DATA_DIHIMPUN} <Link href="/koreksi">Kirim koreksi</Link>
      </p>
      <NavBudaya kini="/cerita/kamus" />
    </div>
  );
}
