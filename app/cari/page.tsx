import type { Metadata } from "next";
import Cari from "@/features/cari/Cari";

export const metadata: Metadata = {
  title: "Cari",
  description: "Cari halaman dan tempat di Batam.",
};

export default function HalamanCari() {
  return (
    <div className="bch-page">
      <h1 className="m-0">Cari</h1>
      <Cari />
    </div>
  );
}
