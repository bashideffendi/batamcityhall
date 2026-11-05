import type { Metadata } from "next";
import DaftarGempa from "@/features/langit-laut/components/DaftarGempa";
import "@/features/langit-laut/cuaca.css";

export const metadata: Metadata = {
  title: "Gempa Terkini",
  description: "Gempa terkini di seluruh Indonesia, dengan jarak dari Batam.",
};

export default function GempaHalaman() {
  return (
    <div className="bch-page cu-halaman-teks">
      <h1 className="m-0">Gempa Terkini</h1>
      <p className="bch-lede">
        Daftar mencakup seluruh Indonesia.
      </p>
      <DaftarGempa />
    </div>
  );
}
