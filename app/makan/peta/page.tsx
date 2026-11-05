import type { Metadata } from "next";
import MapView from "@/features/makan/components/MapView";

export const metadata: Metadata = {
  title: "Peta",
  description: "Peta tempat makan di Batam. Titik di peta adalah perkiraan area.",
};

export default function Peta() {
  return <MapView />;
}
