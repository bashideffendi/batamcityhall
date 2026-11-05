import type { Metadata } from "next";
import KartuPos from "@/features/kartu-pos/KartuPos";
import "@/features/kartu-pos/kartu-pos.css";

export const metadata: Metadata = {
  title: "Kartu Pos",
  description: "Pilih desain kartu pos Batam, tulis pesan, lalu cetak ukuran A6.",
};

export default function HalamanKartuPos() {
  return (
    <div className="bch-page">
      <h1 className="kp-judul">Kartu Pos</h1>
      <p className="bch-lede">Pilih desain, tulis pesan, lalu cetak ukuran A6.</p>
      <KartuPos />
    </div>
  );
}
