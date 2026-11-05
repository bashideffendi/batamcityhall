import type { Metadata } from "next";
import DaftarPeringatan from "@/features/langit-laut/components/DaftarPeringatan";
import "@/features/langit-laut/cuaca.css";

export const metadata: Metadata = {
  title: "Peringatan Dini Cuaca",
  description: "Peringatan dini cuaca yang berlaku di Kepulauan Riau, dengan kecamatan di Batam yang disebut.",
};

export default function PeringatanCuacaHalaman() {
  return (
    <div className="bch-page cu-halaman-teks">
      <h1 className="m-0">Peringatan Dini Cuaca</h1>
      <DaftarPeringatan />
    </div>
  );
}
