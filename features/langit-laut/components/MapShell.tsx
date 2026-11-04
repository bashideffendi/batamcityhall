"use client";

import dynamic from "next/dynamic";
import "../langit-laut.css";

// Peta butuh `window`, jadi client-only. Placeholder-nya ikut tema (html[data-theme] dipasang skrip
// inline di layout SEBELUM paint), jadi tidak ada kedipan.
const RadarMap = dynamic(() => import("./RadarMap"), {
  ssr: false,
  loading: () => <div className="map-loading">Itik sedang berbaris…</div>,
});

export default function MapShell() {
  return <RadarMap />;
}
