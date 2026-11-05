import type { Metadata } from "next";
import { JalurMakan } from "@/features/makan/components/HalamanMakan";

export const metadata: Metadata = {
  title: "Jalur Kuliner",
  description: "Jalur kuliner adalah rute makan bertema yang bisa diikuti dalam setengah hari atau sehari.",
};

export default function Jalur() {
  return <JalurMakan />;
}
