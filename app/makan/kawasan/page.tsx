import type { Metadata } from "next";
import { KawasanIndeks } from "@/features/makan/components/HalamanMakan";

export const metadata: Metadata = {
  title: "Kawasan",
  description: "Tempat makan di Batam per kawasan: Nagoya, Batam Centre, Bengkong, dan lainnya.",
};

export default function Halaman() {
  return <KawasanIndeks />;
}
