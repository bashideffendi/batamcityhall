"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type FeriTerakhir from "./FeriTerakhir";
import "./jalan.css";

// Isinya bergantung jam pengguna, jadi hanya dirender di klien.
const Widget = dynamic(() => import("./FeriTerakhir"), {
  ssr: false,
  loading: () => (
    <section className="jl-feri" aria-label="Feri terakhir hari ini">
      <h2>Feri terakhir hari ini</h2>
      <p>Itik sedang berbaris…</p>
    </section>
  ),
});

export default function FeriTerakhirMuat(props: ComponentProps<typeof FeriTerakhir>) {
  return <Widget {...props} />;
}
