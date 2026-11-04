import type { Metadata } from "next";
import { JalurMakan } from "@/features/makan/components/HalamanMakan";

export const metadata: Metadata = {
  title: "Jalur kuliner",
  description: "Lima jalur kuliner tematik di Batam, tinggal ikuti urutannya.",
};

export default function Jalur() {
  return <JalurMakan />;
}
