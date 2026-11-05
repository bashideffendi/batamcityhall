import type { Metadata } from "next";
import Link from "next/link";
import KartuPos from "@/features/main/KartuPos";

export const metadata: Metadata = {
  title: "Kartu Pos dari Batam",
  description: "Pilih gambar, tulis pesan, lalu unduh sebagai gambar untuk dikirim.",
};

export default function HalamanKartuPos() {
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">
        <Link href="/main">Ruang Main</Link>
      </p>
      <h1 className="mt-2">Kartu Pos dari Batam</h1>
      <p className="bch-lede">Pilih gambar, tulis pesan, lalu unduh sebagai gambar untuk dikirim.</p>
      <div className="mt-5">
        <KartuPos />
      </div>
    </div>
  );
}
