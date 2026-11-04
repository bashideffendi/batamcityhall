import type { Metadata } from "next";
import Link from "next/link";
import KartuPos from "@/features/main/KartuPos";

export const metadata: Metadata = {
  title: "Kartu pos",
  description: "Buat kartu pos dari Batam dan unduh gambarnya.",
};

export default function HalamanKartuPos() {
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">
        <Link href="/main">Main-main</Link>
      </p>
      <h1 className="mt-2">Kartu pos</h1>
      <p className="bch-lede">Perangkonya urusan Anda.</p>
      <div className="mt-5">
        <KartuPos />
      </div>
    </div>
  );
}
