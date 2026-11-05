import type { Metadata } from "next";
import Link from "next/link";
import Kalkulator from "@/features/main/Kalkulator";

export const metadata: Metadata = {
  title: "Belanja di Singapura atau di Nagoya?",
  description: "Hitung ongkos menyeberang ke Singapura.",
};

export default function HalamanKalkulator() {
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">
        <Link href="/main">Ruang Main</Link>
      </p>
      <h1 className="mt-2">Belanja di Singapura atau di Nagoya?</h1>
      <p className="bch-lede">Hitung ongkos menyeberang ke Singapura.</p>
      <div className="mt-5">
        <Kalkulator />
      </div>
      <div className="bch-prose mt-5">
        <p>
          Menyeberang ke Singapura perlu paspor. Jadwal dan aturannya ada di <Link href="/jalan/feri">Feri</Link>.
        </p>
      </div>
    </div>
  );
}
