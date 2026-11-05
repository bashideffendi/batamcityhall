import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Halaman Tidak Ditemukan" };

export default function NotFound() {
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">404</p>
      <h1 className="mt-2">Halaman Tidak Ditemukan</h1>
      <p className="bch-lede">Alamatnya mungkin salah ketik atau halamannya sudah pindah.</p>
      <div className="flex flex-wrap gap-3 mt-5">
        <Link href="/" className="bch-btn">
          Ke Beranda
        </Link>
        <Link href="/cari" className="bch-btn" data-variant="ghost">
          Cari
        </Link>
        <Link href="/info/darurat" className="bch-btn" data-variant="ghost">
          Nomor Darurat
        </Link>
        <Link href="/makan" className="bch-btn" data-variant="ghost">
          Makanan
        </Link>
        <Link href="/info/direktori" className="bch-btn" data-variant="ghost">
          Direktori
        </Link>
      </div>
    </div>
  );
}
