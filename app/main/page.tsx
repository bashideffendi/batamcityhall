import type { Metadata } from "next";
import DaftarNomor from "@/components/site/DaftarNomor";
import PembukaLoket from "@/components/site/PembukaLoket";

const LEDE = "Buat kartu pos digital dan hitung ongkos belanja ke Singapura.";

export const metadata: Metadata = {
  title: "Ruang Main",
  description: LEDE,
};

const PINTU = [
  {
    href: "/main/kartu-pos",
    nama: "Kartu Pos dari Batam",
    ket: "Pilih gambar, tulis pesan, lalu unduh.",
  },
  {
    href: "/main/singapura-atau-nagoya",
    nama: "Belanja di Singapura atau di Nagoya?",
    ket: "Hitung ongkos menyeberang ke Singapura.",
  },
];

export default function RuangMain() {
  return (
    <div className="bch-page">
      <PembukaLoket nomor="07" lede={LEDE} />
      <section className="bch-seksi" aria-labelledby="isi-loket">
        <h2 id="isi-loket" className="bch-kicker bch-kepala-penanda">
          Isi bagian ini
        </h2>
        <DaftarNomor isi={PINTU} />
      </section>
    </div>
  );
}
