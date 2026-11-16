"use client";

import PetaKerja from "@/features/peta/PetaKerja";
import LapisanTempat, { type FiturPin } from "@/features/peta/LapisanTempat";
import { MAP_BOUNDS } from "@/features/peta/style";
import "@/features/peta/peta.css";

/** Tampilan awal: Pulau Batam. Pin di Rempang dan Galang terlihat setelah peta digeser. */
const TAMPILAN: [[number, number], [number, number]] = [
  [103.86, 0.97],
  [104.17, 1.21],
];

export default function PetaKategoriIsi({
  fitur,
  theme,
  pusat,
  onPilih,
}: {
  fitur: FiturPin[];
  theme: "light" | "dark";
  pusat?: [number, number];
  onPilih: (id: string | null) => void;
}) {
  const bounds: [[number, number], [number, number]] = pusat
    ? [
        [pusat[0] - 0.035, pusat[1] - 0.025],
        [pusat[0] + 0.035, pusat[1] + 0.025],
      ]
    : TAMPILAN;
  return (
    <div className="bch-kategori-peta">
      <PetaKerja theme={theme} opsi={{ bounds, maxBounds: MAP_BOUNDS, koperatif: true, selubung: true }}>
        <LapisanTempat fitur={fitur} onPilih={onPilih} />
      </PetaKerja>
    </div>
  );
}
