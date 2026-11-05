"use client";

import dynamic from "next/dynamic";

// Isinya bergantung jam dan jaringan pengguna, jadi hanya dirender di klien. Judul H1 tetap ada sebelum data tiba.
const HariIni = dynamic(() => import("./HariIni"), {
  ssr: false,
  loading: () => (
    <section className="br-pertama" aria-labelledby="br-judul">
      <div className="br-hari">
        <p className="bch-kicker bch-penanda-biru m-0">Hari ini di Batam</p>
        <h1 id="br-judul" className="br-judul">
          Memuat data
        </h1>
      </div>
    </section>
  ),
});

export default function HariIniMuat() {
  return <HariIni />;
}
