"use client";

// Error boundary segmen: kalau peta atau data di klien gagal, tampilkan layar berbahasa Indonesia dengan
// tombol, bukan "Application error" bawaan Next.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="bch-page" role="alert">
      <p className="bch-kicker m-0">Gangguan</p>
      <h1 className="mt-2">Peta gagal dimuat.</h1>
      <p className="bch-lede">Laut masih ada, kami saja yang belum.</p>
      <div className="flex flex-wrap gap-3 mt-5">
        <button type="button" className="bch-btn" onClick={() => reset()}>
          Coba lagi
        </button>
        <button type="button" className="bch-btn" data-variant="ghost" onClick={() => window.location.reload()}>
          Muat ulang
        </button>
      </div>
      {error.digest && <p className="bch-card-meta mt-5">Kode: {error.digest}</p>}
    </div>
  );
}
