import type { Metadata } from "next";
import { KategoriMakan } from "@/features/makan/components/HalamanMakan";

export const metadata: Metadata = {
  title: "Kategori",
  description: "Kategori kuliner Batam: seafood, sup ikan, kopitiam, mi, dan lainnya.",
};

export default function Kategori() {
  return <KategoriMakan />;
}
