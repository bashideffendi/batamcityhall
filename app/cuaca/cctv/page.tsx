import type { Metadata } from "next";
import MapShell from "@/features/langit-laut/components/MapShell";

export const metadata: Metadata = {
  title: "CCTV Lalu Lintas",
  description: "Siaran kamera lalu lintas di jalan utama Batam.",
};

export default function CctvLaluLintas() {
  return <MapShell mode="cctv" />;
}
