import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cara berkontribusi",
  description: "Cara warga ikut mengisi Batam City Hall.",
};

export default function Kontribusi() {
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">Cara berkontribusi</p>
      <h1 className="mt-2">Balai warga diisi warga</h1>
      <p className="bch-lede">Kanal kirimnya belum dibuka. Yang berikut ini rencananya.</p>
      <div className="bch-prose">
        <ul>
          <li>Rekomendasi Tukang Langganan dari warga yang pernah memakai jasanya.</li>
          <li>Foto lama Batam, dengan izin pemiliknya.</li>
          <li>Kata dan cerita untuk kamus dan kampung tua.</li>
          <li>
            <Link href="/koreksi">Koreksi data</Link> tempat di direktori.
          </li>
        </ul>
        <p>Tidak ada yang bisa membayar supaya masuk daftar atau naik urutan.</p>
      </div>
    </div>
  );
}
