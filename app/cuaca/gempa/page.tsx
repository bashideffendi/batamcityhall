import type { Metadata } from "next";
import DaftarGempa from "@/features/langit-laut/components/DaftarGempa";
import TabCuaca from "@/features/langit-laut/components/TabCuaca";
import "@/features/langit-laut/cuaca.css";

export const metadata: Metadata = {
  title: "Gempa Terkini",
  description: "Gempa terkini di seluruh Indonesia, dengan jarak dari Batam.",
};

export default function GempaHalaman() {
  return (
    <div className="bch-page cu-halaman-teks">
      <TabCuaca />
      <h1 className="mt-2">Gempa Terkini</h1>
      <p className="bch-lede">
        Halaman ini memuat gempa terkini di seluruh Indonesia. Batam relatif jarang terdampak, tetapi banyak warganya punya keluarga di daerah lain.
      </p>
      <DaftarGempa />
    </div>
  );
}
