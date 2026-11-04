import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cerita & Budaya",
  description:
    "Sejarah Batam, Batam Dulu vs Sekarang, kampung tua, nama jalan, kalender, kamus, budaya Melayu, dan angka.",
};

const PINTU = [
  {
    href: "/cerita/sejarah",
    nama: "Sejarah Batam",
    lede: "Garis waktu, dua poros kota, asal nama, dan grafik penduduk. Setiap entri berlabel.",
  },
  {
    href: "/cerita/dulu",
    nama: "Batam Dulu vs Sekarang",
    lede: "Geser tahun, lihat 14 lokasi berubah. Foto hanya kalau lisensinya jelas.",
  },
  {
    href: "/cerita/kampung-tua",
    nama: "Kampung Tua",
    lede: "Kampung yang sudah ada sebelum Otorita. Asal-usul, sumber, dan etika berkunjung.",
  },
  {
    href: "/cerita/nama-jalan",
    nama: "Siapa di Balik Nama Jalan",
    lede: "Tokoh di papan jalan, dipisah antara sejarah dan hikayat.",
  },
  { href: "/cerita/kalender", nama: "Kalender", lede: "Acara budaya sepanjang tahun, dengan tanggal dan sumbernya." },
  { href: "/cerita/kamus", nama: "Kamus", lede: "Melayu Kepri dan bahasa Batam sehari-hari." },
  { href: "/cerita/budaya", nama: "Budaya Melayu", lede: "Tradisi yang masih dijalankan, dengan sumbernya." },
  { href: "/cerita/komunitas", nama: "Komunitas", lede: "Komunitas kreatif dan budaya di Batam." },
  {
    href: "/cerita/angka",
    nama: "Angka Batam",
    lede: "Penduduk, wisman, pulau, dan luas. Selalu dengan sumber dan tahun.",
  },
];

export default function CeritaBudaya() {
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">Loket 05</p>
      <h1 className="mt-2">Cerita & Budaya</h1>
      <p className="bch-lede">Dari mana kota ini datang, dan siapa nama-nama di papan jalan itu.</p>
      <p className="bch-note">
        Yang pasti ditulis pasti. Yang beda versi ditulis beda versi. Cerita rakyat selalu diberi label cerita rakyat.
      </p>

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
    </div>
  );
}
