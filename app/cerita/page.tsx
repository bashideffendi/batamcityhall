import type { Metadata } from "next";
import Image from "next/image";
import KisiPintu from "@/components/site/KisiPintu";
import PembukaBagian from "@/components/site/PembukaBagian";
import TautanSelengkapnya from "@/components/site/TautanSelengkapnya";
import { TULISAN } from "@/features/jurnal/data";

export const metadata: Metadata = {
  title: "Sejarah dan Budaya",
  description: "Sejarah Batam, kampung tua, nama jalan, budaya Melayu, kamus, dan angka kota.",
};

// Batam Dulu dan Sekarang disembunyikan sampai ada foto berizin (pedoman bagian 6).
const PINTU = [
  { href: "/cerita/sejarah", nama: "Sejarah Batam", ket: "Dari pulau pesisir sampai kota sejuta jiwa" },
  { href: "/cerita/kampung-tua", nama: "Kampung Tua", ket: "Asal-usul dan penduduk awal" },
  { href: "/cerita/nama-jalan", nama: "Nama Jalan", ket: "Siapa di balik nama jalan di Batam" },
  { href: "/cerita/budaya", nama: "Budaya Melayu", ket: "Tradisi, busana, dan kuliner acara" },
  { href: "/cerita/kamus", nama: "Kamus", ket: "Melayu Kepri dan bahasa sehari-hari Batam" },
  { href: "/cerita/angka", nama: "Batam dalam Angka", ket: "Penduduk, wisatawan, dan investasi" },
  { href: "/kartu-pos", nama: "Kartu Pos", ket: "Pilih desain, tulis pesan, lalu cetak" },
];

export default function SejarahBudaya() {
  const pilihan = TULISAN[0];
  return (
    <div className="bch-page">
      <PembukaBagian id="budaya" />
      <div className="bch-seksi-rapat">
        <KisiPintu isi={PINTU} />
      </div>
      {pilihan && (
        <section className="bch-seksi-rapat bch-sorotan" aria-labelledby="sb-pilihan">
          <Image className="bch-grafis" src={pilihan.gambar} alt="" width={720} height={480} unoptimized loading="lazy" />
          <div>
            <p className="bch-kicker m-0">Dari Jurnal</p>
            <h2 id="sb-pilihan">{pilihan.judul}</h2>
            <p>{pilihan.ringkasan}</p>
            <TautanSelengkapnya href={`/jurnal/${pilihan.slug}`} tentang={pilihan.judul} />
          </div>
        </section>
      )}
    </div>
  );
}
