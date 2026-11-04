"use client";

import dynamic from "next/dynamic";
import ItikBerbaris from "@/features/peta/ItikBerbaris";
import "@/features/peta/peta.css";
import type { ComponentProps } from "react";
import type PetaKampungTua from "./PetaKampungTua";

// MapLibre butuh WebGL dan cukup besar, jadi hanya dimuat di klien dan terpisah dari bundel halaman.
const Peta = dynamic(() => import("./PetaKampungTua"), {
  ssr: false,
  loading: () => (
    <section className="peta" aria-label="Peta kampung tua Batam" data-peta="kampung-tua" data-status="memuat">
      <ItikBerbaris />
    </section>
  ),
});

export default function PetaKampungTuaMuat(props: ComponentProps<typeof PetaKampungTua>) {
  return <Peta {...props} />;
}
