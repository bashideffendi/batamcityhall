import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cara Berkontribusi",
  description:
    "Tiga cara membantu Batam City Hall: merekomendasikan tukang, mengirim koreksi data, dan mengirim foto lama Batam.",
};

export default function Kontribusi() {
  return (
    <div className="bch-page">
      <h1>Cara Berkontribusi</h1>
      <p className="bch-lede">
        Tiga cara membantu Batam City Hall: merekomendasikan tukang, mengirim koreksi data, dan mengirim foto lama Batam.
      </p>
      <div className="bch-prose">
        <ul>
          <li>
            <Link href="/tukang/rekomendasi">Rekomendasikan tukang</Link> yang pernah kamu pakai sendiri.
          </li>
          <li>
            <Link href="/koreksi">Kirim koreksi</Link> untuk tempat di direktori.
          </li>
          <li>Kirim foto lama Batam, dengan izin pemiliknya. Formulirnya belum aktif.</li>
        </ul>
        <p>Tidak ada yang dapat membayar untuk masuk daftar atau naik urutan.</p>
      </div>
    </div>
  );
}
