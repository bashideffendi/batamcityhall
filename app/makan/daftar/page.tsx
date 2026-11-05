import type { Metadata } from "next";
import { DaftarMakan } from "@/features/makan/components/HalamanMakan";

export const metadata: Metadata = {
  title: "Daftar",
  description: "Semua tempat makan pilihan di Batam. Saring menurut status halal, kategori, area, harga, dan terminal feri.",
};

export default function Daftar() {
  return <DaftarMakan />;
}
