import type { Metadata } from "next";
import HidanganIndeks from "@/features/makan/components/HidanganIndeks";
import { categoryCounts, places } from "@/features/makan/lib/data";

export const metadata: Metadata = {
  title: "Hidangan",
  description: "17 hidangan di Batam: gonggong, sup ikan, mi tarempa, kopitiam, dan lainnya.",
};

export default function Halaman() {
  // Dihitung di server: halaman ini hanya butuh angkanya, bukan seluruh daftar tempat.
  return <HidanganIndeks jumlah={categoryCounts} total={places.length} />;
}
