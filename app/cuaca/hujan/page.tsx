import type { Metadata } from "next";
import MapShell from "@/features/langit-laut/components/MapShell";

export const metadata: Metadata = {
  title: "Radar Hujan",
  description: "Hujan di Batam dan sekitarnya dari radar cuaca dalam 2,5 jam terakhir, diperbarui setiap 5 menit.",
};

export default function RadarHujan() {
  return <MapShell mode="hujan" />;
}
