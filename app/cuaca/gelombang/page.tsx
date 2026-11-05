import type { Metadata } from "next";
import MapShell from "@/features/langit-laut/components/MapShell";

export const metadata: Metadata = {
  title: "Tinggi Gelombang",
  description: "Prakiraan tinggi gelombang dan angin di perairan Batam dan sekitarnya.",
};

export default function TinggiGelombang() {
  return <MapShell mode="ombak" />;
}
