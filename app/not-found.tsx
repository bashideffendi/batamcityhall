import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Halaman Tidak Ditemukan" };

export default function NotFound() {
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">404</p>
      <h1 className="mt-2">Halaman Tidak Ditemukan</h1>
      <p className="bch-lede">Alamatnya mungkin salah ketik atau halamannya sudah dipindahkan.</p>
      <div className="flex flex-wrap gap-3 mt-5">
        <Link href="/" className="bch-btn">
          Ke beranda
        </Link>
        <Link href="/info/direktori" className="bch-btn" data-variant="ghost">
          Cari tempat
        </Link>
      </div>
    </div>
  );
}
