"use client";

import dynamic from "next/dynamic";
import ItikBerbaris from "./ItikBerbaris";
import "./peta.css";

// MapLibre butuh WebGL dan cukup besar, jadi hanya dimuat di klien dan terpisah dari bundel halaman.
const PetaLaut = dynamic(() => import("./PetaLaut"), {
  ssr: false,
  loading: () => (
    <section className="peta" aria-label="Peta laut Batam" data-status="memuat">
      <ItikBerbaris />
    </section>
  ),
});

export default function PetaMuat() {
  return <PetaLaut />;
}
