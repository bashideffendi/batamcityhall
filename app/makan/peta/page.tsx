import type { Metadata } from "next";
import { PetaSemua } from "@/features/makan/components/HalamanMakan";

export const metadata: Metadata = {
  title: "Peta",
  description: "Peta dan daftar 117 tempat makan di Batam. Saring menurut jam buka, halal, harga, dan terminal feri.",
};

export default function Halaman() {
  return <PetaSemua />;
}
