import type { Metadata } from "next";
import Link from "next/link";
import { daftarKata, TERAKHIR_DICEK } from "@/features/budaya/data";
import Kamus from "@/features/budaya/Kamus";
import NavBudaya, { KickerCerita } from "@/features/budaya/NavBudaya";
import "@/features/budaya/budaya.css";

export const metadata: Metadata = {
  title: "Kamus Melayu Kepri dan bahasa Batam",
  description:
    "Kata yang sering terdengar di Batam: Melayu Kepri, serapan, istilah kota, dan dunia kerja. Dengan contoh kalimat.",
};

export default function HalamanKamus() {
  const entri = daftarKata();
  const bersumber = entri.filter((k) => k.bersumber).length;
  return (
    <div className="bch-page">
      <KickerCerita />
      <h1 className="mt-2">Kamus Melayu Kepri dan bahasa Batam</h1>
      <p className="bch-lede">{entri.length} kata yang akan kamu dengar di pelantar, kedai, dan kawasan industri.</p>
      <div className="bch-prose">
        <p>
          Bahasa sehari-hari Batam campuran Melayu, Minang, dan &ldquo;Medan&rdquo;, ditambah serapan Singapura,
          Malaysia, dan Hokkien. Pemakaiannya beda menurut lingkungan pergaulan. Banyak kata di sini juga dipakai di
          Riau, Johor, dan Singapura, jadi jangan anggap khas Batam saja.
        </p>
        <p>
          BPNB Kepri mencatat 15 dialek Melayu di Kepri, termasuk Dialek Pecong di Kelurahan Pecong, Batam (
          <a
            href="https://kebudayaan.kemdikbud.go.id/bpnbkepri/15-dialek-bahasa-melayu-di-kepri/"
            target="_blank"
            rel="noopener noreferrer"
          >
            sumber
          </a>
          ).
        </p>
        <p className="bch-note" data-tone="caution">
          {bersumber} kata bersumber. {entri.length - bersumber} lainnya pengamatan yang belum divalidasi warga atau
          ahli bahasa, jadi jangan dibaca sebagai definisi pasti.
        </p>
        <p>
          Ada yang keliru atau kurang? <Link href="/koreksi">Koreksi atau tambah kata</Link>.
        </p>
        <p className="bch-card-meta">Terakhir dicek {TERAKHIR_DICEK}</p>
      </div>
      <Kamus entri={entri} />
      <NavBudaya kini="/cerita/kamus" />
    </div>
  );
}
