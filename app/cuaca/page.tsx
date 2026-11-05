import type { Metadata } from "next";
import PembukaBagian from "@/components/site/PembukaBagian";
import { IsiCuaca, SaatIni } from "@/features/langit-laut/components/PembukaCuaca";
import "@/features/langit-laut/cuaca.css";

export const metadata: Metadata = {
  title: "Cuaca",
  description: "Radar hujan, tinggi gelombang, peringatan dini, dan gempa untuk Batam dan perairan sekitarnya.",
};

export default function Cuaca() {
  return (
    <div className="bch-page">
      <PembukaBagian id="cuaca">
        <SaatIni />
      </PembukaBagian>
      <IsiCuaca />
    </div>
  );
}
