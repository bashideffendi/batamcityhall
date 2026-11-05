import type { Metadata } from "next";
import PembukaBagian from "@/components/site/PembukaBagian";
import DaftarBerita from "@/features/berita/DaftarBerita";
import "@/features/berita/berita.css";

export const metadata: Metadata = {
  title: "Berita",
  description: "Judul berita terbaru tentang Batam dari media lokal.",
};

export default function HalamanBerita() {
  return (
    <div className="bch-page">
      <PembukaBagian id="berita" />
      <DaftarBerita />
    </div>
  );
}
