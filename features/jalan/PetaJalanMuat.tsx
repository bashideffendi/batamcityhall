"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import ItikBerbaris from "@/features/peta/ItikBerbaris";
import "@/features/peta/peta.css";
import type PetaJalan from "./PetaJalan";

// MapLibre butuh WebGL dan cukup besar, jadi hanya dimuat di klien dan terpisah dari bundel halaman.
const Peta = dynamic(() => import("./PetaJalan"), {
  ssr: false,
  loading: () => (
    <section className="peta jl-peta" aria-label="Peta hub Trans Batam dan terminal feri" data-status="memuat">
      <ItikBerbaris />
    </section>
  ),
});

export default function PetaJalanMuat(props: ComponentProps<typeof PetaJalan>) {
  return <Peta {...props} />;
}
