import type { Metadata } from "next";
import { HidanganIndeks } from "@/features/makan/components/HalamanMakan";

export const metadata: Metadata = {
  title: "Hidangan",
  description: "17 hidangan di Batam: gonggong, sup ikan, mi tarempa, kopitiam, dan lainnya.",
};

export default function Halaman() {
  return <HidanganIndeks />;
}
