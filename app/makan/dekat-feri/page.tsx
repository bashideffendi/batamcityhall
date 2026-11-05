import type { Metadata } from "next";
import { DekatFeri } from "@/features/makan/components/HalamanMakan";

export const metadata: Metadata = {
  title: "Dekat Feri",
  description: "Tempat makan terdekat dari Batam Centre, Harbour Bay, Sekupang, dan Nongsapura.",
};

export default function Halaman() {
  return <DekatFeri />;
}
