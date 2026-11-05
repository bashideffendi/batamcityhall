import type { Metadata } from "next";
import { KategoriMakan } from "@/features/makan/components/HalamanMakan";

export const metadata: Metadata = {
  title: "Kategori",
  description: "Kategori tempat makan di Batam: makanan laut dan gonggong, sup ikan, kopitiam, mi, dan lainnya.",
};

export default function Kategori() {
  return <KategoriMakan />;
}
