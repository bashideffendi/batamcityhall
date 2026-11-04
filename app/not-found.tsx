import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Tenggelam" };

export default function NotFound() {
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">404</p>
      <h1 className="mt-2">Halaman ini tenggelam.</h1>
      <p className="bch-lede">Kemungkinan di sekitar 1°N.</p>
      <div className="bch-prose">
        <p>Situs ini dibuka bertahap, jadi tautan ke loket yang belum dibuka juga berakhir di sini.</p>
        <p>
          <Link href="/">Kembali ke peta</Link>
        </p>
      </div>
    </div>
  );
}
