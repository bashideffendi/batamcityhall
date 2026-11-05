"use client";

import dynamic from "next/dynamic";
import type { Mode } from "@/features/langit-laut/lib/radar";
import "../langit-laut.css";
import "../cuaca.css";

// Peta butuh `window`, jadi client-only. Placeholder-nya ikut tema (html[data-theme] dipasang skrip inline di
// layout sebelum paint), jadi tidak ada kedipan.
const RadarMap = dynamic(() => import("./RadarMap"), {
  ssr: false,
  loading: () => <div className="map-loading">Memuat peta</div>,
});

export default function MapShell({ mode }: { mode: Mode }) {
  return <RadarMap mode={mode} />;
}
