"use client";

import Link from "next/link";

// Error boundary segmen: layar berbahasa Indonesia dengan tombol, bukan "Application error" bawaan Next.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="bch-page" role="alert">
      <h1 className="mt-2">Halaman Ini Tidak Dapat Dimuat</h1>
      <p className="bch-lede">Terjadi masalah saat memuat halaman. Coba muat ulang dalam beberapa saat.</p>
      <div className="flex flex-wrap gap-3 mt-5">
        <button type="button" className="bch-btn" onClick={() => reset()}>
          Muat ulang
        </button>
        <Link href="/" className="bch-btn" data-variant="ghost">
          Ke beranda
        </Link>
      </div>
      {error.digest && <p className="bch-card-meta mt-5">Kode: {error.digest}</p>}
    </div>
  );
}
