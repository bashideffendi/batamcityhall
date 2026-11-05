import type { Metadata } from "next";
import MapShell from "@/features/langit-laut/components/MapShell";

export const metadata: Metadata = {
  title: "CCTV",
  description: "Siaran kamera lalu lintas di jalan utama Batam.",
};

export default function Cctv() {
  return <MapShell mode="cctv" />;
}
