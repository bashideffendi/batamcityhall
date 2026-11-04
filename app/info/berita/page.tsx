import type { Metadata } from "next";
import DaftarBerita from "@/features/berita/DaftarBerita";
import "@/features/berita/berita.css";
import { BELUM_IKUT } from "@/features/berita/sumber";

export const metadata: Metadata = {
  title: "Berita Batam",
  description: "Judul terbaru dari media lokal dan Pemko Batam, dengan tautan ke artikel aslinya.",
};

export default function HalamanBerita() {
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">Loket 06</p>
      <h1 className="mt-2">Berita Batam</h1>
      <p className="bch-lede">Judul terbaru dari media lokal dan Pemko Batam. Baca isinya di situs aslinya.</p>
      <div className="bch-note mt-4">
        <p className="m-0">
          Halaman ini hanya daftar tautan. Judul, sumber, dan waktu diambil dari feed RSS tiap media, lalu disegarkan
          sekitar tiap 20 menit. Kami tidak menulis, menyunting, atau memilih judulnya, dan tidak menyalin isi artikel.
          Tautan terbuka di tab baru.
        </p>
        <p className="mb-0 mt-2">Feed media lokal juga memuat berita nasional, jadi tidak semua judul soal Batam.</p>
        <p className="mb-0 mt-2">{BELUM_IKUT} belum ikut: feed mereka belum bisa kami baca saat dicek 5 Nov 2026.</p>
      </div>
      <DaftarBerita />
    </div>
  );
}
