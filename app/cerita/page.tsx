import type { Metadata } from "next";
import DaftarNomor from "@/components/site/DaftarNomor";
import PembukaLoket from "@/components/site/PembukaLoket";

const LEDE =
  "Bagian ini memuat sejarah Batam, kampung tua, tokoh di balik nama jalan, budaya Melayu, dan kamus bahasa sehari-hari.";

export const metadata: Metadata = {
  title: "Cerita dan Budaya",
  description: LEDE,
};

// Batam Dulu dan Sekarang disembunyikan sampai ada foto berizin (pedoman bagian 6).
const PINTU = [
  { href: "/cerita/sejarah", nama: "Sejarah Batam" },
  { href: "/cerita/kampung-tua", nama: "Kampung Tua" },
  { href: "/cerita/nama-jalan", nama: "Siapa di Balik Nama Jalan" },
  { href: "/cerita/budaya", nama: "Budaya Melayu" },
  { href: "/cerita/kalender", nama: "Kalender Acara" },
  { href: "/cerita/kamus", nama: "Kamus Melayu Kepri dan Bahasa Batam" },
  { href: "/cerita/komunitas", nama: "Komunitas" },
  { href: "/cerita/angka", nama: "Batam dalam Angka" },
];

export default function CeritaBudaya() {
  return (
    <div className="bch-page">
      <PembukaLoket nomor="05" lede={LEDE} />
      <section className="bch-seksi" aria-labelledby="isi-loket">
        <h2 id="isi-loket" className="bch-kicker bch-kepala-penanda">
          Isi bagian ini
        </h2>
        <DaftarNomor isi={PINTU} />
      </section>
    </div>
  );
}
