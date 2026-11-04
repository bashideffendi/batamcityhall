import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Koreksi data",
  description: "Cara mengoreksi data di Batam City Hall.",
};

export default function Koreksi() {
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">Koreksi data</p>
      <h1 className="mt-2">Ada yang salah?</h1>
      <p className="bch-lede">Pasti ada. Sebagian besar data di sini belum dicek ulang di lapangan.</p>
      <div className="bch-prose">
        <p className="bch-note" data-tone="caution">
          Formulir koreksi belum jadi. Untuk sementara kami belum bisa menerima koreksi dari halaman ini.
        </p>
        <h2>Yang akan paling membantu</h2>
        <ul>
          <li>Tempat yang sudah tutup, pindah, atau ganti nomor.</li>
          <li>Titik lokasi tempat yang belum ada di peta.</li>
          <li>Pemilik kantor PPAT atau notaris yang ingin data kantornya diperbaiki atau dihapus.</li>
        </ul>
        <p>
          Cara kerja data kami ada di <Link href="/tentang">Tentang</Link>.
        </p>
      </div>
    </div>
  );
}
