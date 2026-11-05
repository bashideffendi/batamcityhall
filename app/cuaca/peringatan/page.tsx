import type { Metadata } from "next";
import DaftarPeringatan from "@/features/langit-laut/components/DaftarPeringatan";
import TabCuaca from "@/features/langit-laut/components/TabCuaca";
import "@/features/langit-laut/cuaca.css";

export const metadata: Metadata = {
  title: "Peringatan Dini Cuaca",
  description: "Peringatan dini cuaca yang berlaku di Kepulauan Riau, dengan kecamatan di Batam yang disebut.",
};

export default function PeringatanCuacaHalaman() {
  return (
    <div className="bch-page cu-halaman-teks">
      <TabCuaca />
      <h1 className="mt-2">Peringatan Dini Cuaca</h1>
      <p className="bch-lede">Peringatan untuk Batam tampil paling atas, disusul Kepulauan Riau lainnya.</p>
      <DaftarPeringatan />
    </div>
  );
}
