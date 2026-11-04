"use client";

import dynamic from "next/dynamic";

// Isinya bergantung jam dan jaringan pengguna, jadi hanya dirender di klien.
const HariIni = dynamic(() => import("./HariIni"), {
  ssr: false,
  loading: () => (
    <section className="bch-hari-ini" aria-labelledby="hari-ini">
      <h2 id="hari-ini">Hari ini</h2>
      <p>Itik sedang berbaris…</p>
    </section>
  ),
});

export default function HariIniMuat() {
  return <HariIni />;
}
