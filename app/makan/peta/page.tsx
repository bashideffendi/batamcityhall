import type { Metadata } from "next";
import MapView from "@/features/makan/components/MapView";

export const metadata: Metadata = {
  title: "Peta",
  description: "Peta tempat makan Batam. Pin masih berupa perkiraan area.",
};

export default function Peta() {
  return <MapView />;
}
