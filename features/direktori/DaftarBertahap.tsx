"use client";

import { Children, useState, type ReactNode } from "react";

const AWAL = 12;
const LANGKAH = 40;

// Daftar panjang dibuka bertahap: [Tampilkan {33} tempat lagi] (3.8). Isinya tetap dirender di server.
export default function DaftarBertahap({ className, kolom, children }: { className?: string; kolom?: 2; children: ReactNode }) {
  const [tampil, setTampil] = useState(AWAL);
  const isi = Children.toArray(children);
  const sisa = isi.length - tampil;
  return (
    <>
      <ul className={className} data-kolom={kolom}>{isi.slice(0, tampil)}</ul>
      {sisa > 0 && (
        <button type="button" className="bch-btn mt-4" data-variant="ghost" onClick={() => setTampil(tampil + LANGKAH)}>
          Tampilkan {Math.min(LANGKAH, sisa).toLocaleString("id-ID")} Tempat Lagi
        </button>
      )}
    </>
  );
}
