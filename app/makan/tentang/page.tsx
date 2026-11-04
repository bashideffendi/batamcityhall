import type { Metadata } from "next";
import { TentangMakan } from "@/features/makan/components/HalamanMakan";

export const metadata: Metadata = {
  title: "Tentang",
  description: "Prinsip kurasi Loket Makan: tanpa listing berbayar, dan penafian status halal.",
};

export default function Tentang() {
  return <TentangMakan />;
}
