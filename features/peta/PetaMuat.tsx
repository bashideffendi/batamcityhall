"use client";

import dynamic from "next/dynamic";
import ItikBerbaris from "./ItikBerbaris";

// MapLibre butuh WebGL dan cukup besar, jadi hanya dimuat di klien dan terpisah dari bundel halaman.
const PetaTempat = dynamic(() => import("./PetaTempat"), {
  ssr: false,
  loading: () => (
    <div className="br-peta-muat">
      <ItikBerbaris />
    </div>
  ),
});

export default function PetaMuat({ jumlahTanpaTitik }: { jumlahTanpaTitik: Record<string, number> }) {
  return <PetaTempat jumlahTanpaTitik={jumlahTanpaTitik} />;
}
