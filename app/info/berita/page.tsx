import type { Metadata } from "next";
import Link from "next/link";
import DaftarBerita from "@/features/berita/DaftarBerita";
import "@/features/berita/berita.css";

export const metadata: Metadata = {
  title: "Berita Batam",
  description: "Judul berita terbaru tentang Batam dari media lokal.",
};

export default function HalamanBerita() {
  return (
    <div className="bch-page">
      <nav className="bch-remah" aria-label="Remah roti">
        <Link href="/info">Informasi Warga</Link>
      </nav>
      <h1 className="mt-2">Berita Batam</h1>
      <p className="bch-lede">Judul terbaru dari media lokal tertaut ke situs medianya.</p>
      <DaftarBerita />
    </div>
  );
}
