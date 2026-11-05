import type { Metadata } from "next";
import KisiPintu from "@/components/site/KisiPintu";
import PembukaBagian from "@/components/site/PembukaBagian";
import FeriTerakhirMuat from "@/features/jalan/FeriTerakhirMuat";

export const metadata: Metadata = {
  title: "Transportasi",
  description: "Bus Trans Batam, feri ke Singapura dan Malaysia, dan pompong antarpulau.",
};

const PINTU = [
  { href: "/jalan/trans-batam", nama: "Trans Batam", ket: "Sembilan koridor, tarif Rp5.000, nontunai" },
  { href: "/jalan/feri", nama: "Feri", ket: "Jadwal ke Singapura, Johor, dan pulau sekitar" },
  { href: "/jalan/pompong", nama: "Pompong", ket: "Perahu ke pulau sekitar Batam" },
  { href: "/jalan/feri/panduan", nama: "Panduan Menyeberang", ket: "Paspor, lapor masuk, dan barang bawaan" },
  { href: "/jalan/peta", nama: "Peta Transportasi", ket: "Koridor bus, terminal feri, dan pelabuhan rakyat" },
];

export default function Transportasi() {
  return (
    <div className="bch-page">
      <PembukaBagian id="transportasi" />
      <div className="bch-seksi-rapat">
        <KisiPintu isi={PINTU} />
      </div>
      <div className="bch-seksi-rapat">
        <FeriTerakhirMuat varian="ringkas" />
      </div>
    </div>
  );
}
