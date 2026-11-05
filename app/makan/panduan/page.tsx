import type { Metadata } from "next";
import { PanduanIndeks } from "@/features/makan/components/HalamanMakan";

export const metadata: Metadata = {
  title: "Panduan",
  description: "Rute dan daftar tempat makan di Batam: makanan laut, sarapan, oleh-oleh, dan makan larut.",
};

export default function Halaman() {
  return <PanduanIndeks />;
}
