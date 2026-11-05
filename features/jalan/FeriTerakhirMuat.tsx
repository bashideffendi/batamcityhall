"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type FeriTerakhir from "./FeriTerakhir";
import "./jalan.css";

// Isinya bergantung jam pengguna, jadi hanya dirender di klien.
const Widget = dynamic(() => import("./FeriTerakhir"), {
  ssr: false,
  loading: () => (
    <section className="jl-feri" aria-label="Feri Terakhir Hari Ini">
      <h2>Feri Terakhir Hari Ini</h2>
      <p>Memuat data</p>
    </section>
  ),
});

export default function FeriTerakhirMuat(props: ComponentProps<typeof FeriTerakhir>) {
  return <Widget {...props} />;
}
