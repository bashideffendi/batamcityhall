import type { Metadata } from "next";
import { TentangMakan } from "@/features/makan/components/HalamanMakan";

export const metadata: Metadata = {
  title: "Tentang",
  description: "Cara memilih tempat, arti label, dan status halal di Loket Makan.",
};

export default function Tentang() {
  return <TentangMakan />;
}
