import type { Metadata } from "next";
import Link from "next/link";
import DaftarNomor from "@/components/site/DaftarNomor";
import PembukaLoket from "@/components/site/PembukaLoket";
import { slugKecamatan } from "@/features/direktori/data";
import { KECAMATAN } from "@/lib/data/schema";

export const metadata: Metadata = {
  title: "Informasi Warga",
  description: "Direktori tempat, nomor darurat, panduan urusan tanah dan rumah, bantuan hukum, dan berita Batam.",
};

const PINTU = [
  { href: "/info/direktori", nama: "Direktori" },
  { href: "/info/darurat", nama: "Nomor Darurat" },
  { href: "/info/urusan-tanah", nama: "Urusan Tanah dan Rumah" },
  { href: "/info/bantuan-hukum", nama: "Bantuan Hukum" },
  { href: "/info/jasa-dokumen", nama: "Jasa Dokumen dan Usaha" },
  { href: "/info/berita", nama: "Berita Batam" },
];

export default function InfoWarga() {
  return (
    <div className="bch-page">
      <PembukaLoket nomor="06" lede="Cari tempat, nomor darurat, dan panduan urusan di Batam." />
      <section className="bch-seksi" aria-labelledby="isi-loket">
        <h2 id="isi-loket" className="bch-kicker bch-kepala-penanda">
          Isi bagian ini
        </h2>
        <DaftarNomor isi={PINTU} />
      </section>
      <section className="bch-seksi" aria-labelledby="info-kecamatan">
        <h2 id="info-kecamatan" className="bch-kicker bch-kepala-penanda">
          Menurut kecamatan
        </h2>
        <ul className="bch-daftar-kecamatan">
          {KECAMATAN.map((k) => (
            <li key={k}>
              <Link href={`/info/kecamatan/${slugKecamatan(k)}`} prefetch={false}>
                {k}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
