import type { Metadata } from "next";
import CaraMemilih from "@/features/makan/components/CaraMemilih";

export const metadata: Metadata = {
  title: "Cara Kami Memilih",
  description: "Arti label, status halal, kurs, dan cara daftar ini disusun.",
};

export default function Halaman() {
  return <CaraMemilih />;
}
