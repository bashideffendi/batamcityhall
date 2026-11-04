import type { Metadata } from "next";
import Link from "next/link";
import Kalkulator from "@/features/main/Kalkulator";

export const metadata: Metadata = {
  title: "Ke Singapura atau ke Nagoya?",
  description: "Hitung ongkos jalan sebelum menyeberang untuk belanja.",
};

export default function HalamanKalkulator() {
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">
        <Link href="/main">Main-main</Link>
      </p>
      <h1 className="mt-2">Ke Singapura atau ke Nagoya?</h1>
      <p className="bch-lede">Sebelum menyeberang demi diskon, hitung dulu ongkosnya.</p>
      <div className="mt-5">
        <Kalkulator />
      </div>
      <div className="bch-prose mt-5">
        <p>
          Jadwal dan aturan menyeberang ada di <Link href="/jalan/feri">Feri &amp; pompong</Link>. Bawa paspor. Nagoya
          tidak menanyakannya.
        </p>
      </div>
    </div>
  );
}
