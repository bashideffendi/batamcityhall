"use client";

import dynamic from "next/dynamic";
import type { TitikVibe } from "./PetaVibe";

const PetaVibe = dynamic(() => import("./PetaVibe"), {
  ssr: false,
  loading: () => <p>Memuat peta</p>,
});

export default function PetaVibeMuat({ titik }: { titik: TitikVibe[] }) {
  return <PetaVibe titik={titik} />;
}
