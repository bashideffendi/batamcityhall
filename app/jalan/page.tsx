import type { Metadata } from "next";
import Link from "next/link";
import FeriTerakhirMuat from "@/features/jalan/FeriTerakhirMuat";

export const metadata: Metadata = {
  title: "Jalan-jalan",
  description: "Trans Batam, feri, dan pompong. Cara berpindah di Batam tanpa harus punya motor.",
};

const PINTU = [
  {
    href: "/jalan/trans-batam",
    nama: "Trans Batam",
    lede: "9 koridor aktif dan 1 rencana. Diagram, urutan halte, jam, tarif.",
  },
  { href: "/jalan/peta", nama: "Peta", lede: "Hub Trans Batam dan terminal feri. Lokasi perkiraan ditandai berongga." },
  { href: "/jalan/feri", nama: "Feri", lede: "Singapura, Malaysia, domestik. Jadwal bertanggal dan tautan operator." },
  { href: "/jalan/pompong", nama: "Pompong", lede: "Rute rakyat ke pulau. Tarif swadaya, bukan tarif resmi." },
  {
    href: "/jalan/feri/panduan",
    nama: "Panduan menyeberang",
    lede: "Paspor, check-in, barang bawaan, musim angin utara.",
  },
  { href: "/langit-laut?mode=cctv", nama: "CCTV", lede: "Lihat dulu kondisi jalan sebelum keluar." },
];

export default function Jalan() {
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">Loket 04</p>
      <h1 className="mt-2">Jalan-jalan</h1>
      <p className="bch-lede">Trans Batam, feri, pelabuhan. Cara berpindah tanpa harus punya motor.</p>

      <ul className="bch-grid mt-5">
        {PINTU.map((p) => (
          <li key={p.href}>
            <Link href={p.href} className="bch-card h-full" prefetch={false}>
              <h2>{p.nama}</h2>
              <span>{p.lede}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-7">
        <FeriTerakhirMuat varian="ringkas" />
      </div>
    </div>
  );
}
