import type { Metadata } from "next";
import DaftarNomor from "@/components/site/DaftarNomor";
import PembukaLoket from "@/components/site/PembukaLoket";
import FeriTerakhirMuat from "@/features/jalan/FeriTerakhirMuat";

export const metadata: Metadata = {
  title: "Transportasi",
  description: "Bagian ini memuat bus Trans Batam, feri ke Singapura dan Malaysia, dan pompong antarpulau.",
};

const PINTU = [
  { href: "/jalan/trans-batam", nama: "Trans Batam", ket: "sembilan koridor, tarif Rp5.000" },
  { href: "/jalan/peta", nama: "Peta Transportasi", ket: "koridor bus, terminal feri, dan pelabuhan rakyat" },
  { href: "/jalan/feri", nama: "Feri", ket: "jadwal ke Singapura, Johor, dan pulau sekitar" },
  { href: "/jalan/pompong", nama: "Pompong", ket: "perahu ke pulau-pulau di sekitar Batam" },
  { href: "/jalan/feri/panduan", nama: "Panduan Menyeberang", ket: "paspor, lapor masuk, dan barang bawaan" },
];

export default function Jalan() {
  return (
    <div className="bch-page">
      <PembukaLoket
        nomor="04"
        lede={
          <>
            Bagian ini memuat bus Trans Batam, feri ke Singapura dan Malaysia, dan <em>pompong</em> antarpulau.
          </>
        }
      />
      <section className="bch-seksi" aria-labelledby="isi-loket">
        <h2 id="isi-loket" className="bch-kicker bch-kepala-penanda">
          Isi bagian ini
        </h2>
        <DaftarNomor isi={PINTU} />
      </section>
      <div className="bch-seksi">
        <FeriTerakhirMuat varian="ringkas" />
      </div>
    </div>
  );
}
