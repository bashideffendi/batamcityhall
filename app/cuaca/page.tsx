import type { Metadata } from "next";
import PembukaBagian from "@/components/site/PembukaBagian";
import { IsiCuaca } from "@/features/langit-laut/components/PembukaCuaca";
import "@/features/langit-laut/cuaca.css";

export const metadata: Metadata = {
  title: "Cuaca",
  description:
    "Radar hujan, tinggi gelombang, peringatan dini, kualitas udara, dan gempa untuk Batam dan perairan sekitarnya.",
};

export default function Cuaca() {
  return (
    <div className="bch-page">
      {/* Keadaan sekarang ada di IsiCuaca, di luar kepala, supaya garisnya selebar halaman dan datanya diambil sekali. */}
      <PembukaBagian id="cuaca" />
      <IsiCuaca />
    </div>
  );
}
