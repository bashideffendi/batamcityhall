import type { Metadata } from "next";
import Link from "next/link";
import KisiPintu from "@/components/site/KisiPintu";
import PembukaBagian from "@/components/site/PembukaBagian";
import nasional from "@/data/darurat/nomor_darurat_09.json";
import { DAFTAR_KATEGORI, slugKategori, slugKecamatan, TEMPAT, tempatDiKategori } from "@/features/direktori/data";
import { KECAMATAN } from "@/lib/data/schema";
import { kaidahJudul } from "@/lib/judul";

export const metadata: Metadata = {
  title: "Layanan Warga",
  description: "Nomor darurat, direktori 892 tempat, dan panduan urusan tanah, hukum, dan dokumen di Batam.",
};

const PANDUAN = [
  { href: "/info/urusan-tanah", nama: "Urusan Tanah dan Rumah", ket: "Sertifikat, UWT, dan kantor yang dituju" },
  { href: "/info/bantuan-hukum", nama: "Bantuan Hukum", ket: "Bantuan gratis dan cara mengajukannya" },
  { href: "/info/jasa-dokumen", nama: "Jasa Dokumen dan Usaha", ket: "Pajak, izin usaha, dan penerjemah" },
];

const telepon = nasional.filter((n) => n.jenis === "telepon");

export default function LayananWarga() {
  return (
    <div className="bch-page">
      <PembukaBagian id="layanan" />

      <section aria-labelledby="lw-darurat" className="bch-seksi-rapat">
        <div className="bch-judul-baris">
          <h2 id="lw-darurat" className="bch-judul-seksi">
            Nomor Darurat
          </h2>
          <Link href="/info/darurat" className="bch-aksi" prefetch={false}>
            Selengkapnya →
          </Link>
        </div>
        <ul className="bch-darurat-besar">
          {telepon.map((n) => (
            <li key={n.kontak}>
              <a href={`tel:${n.kontak}`} aria-label={`${n.kontak} ${kaidahJudul(n.nama)}, telepon`}>
                <b>{n.kontak}</b>{" "}
                <span>{kaidahJudul(n.nama)}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="lw-direktori" className="bch-seksi-rapat">
        <div className="bch-judul-baris">
          <h2 id="lw-direktori" className="bch-judul-seksi">
            Direktori
          </h2>
          <Link href="/info/direktori" className="bch-aksi" prefetch={false}>
            {TEMPAT.length.toLocaleString("id-ID")} tempat →
          </Link>
        </div>
        <ul className="bch-kategori-ringkas">
          {DAFTAR_KATEGORI.map((k) => (
            <li key={k.kategori}>
              <Link href={`/info/direktori/${slugKategori(k.kategori)}`} prefetch={false}>
                <span>{kaidahJudul(k.nama)}</span>
                <span className="bch-data">{tempatDiKategori(k.kategori).length.toLocaleString("id-ID")}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="lw-panduan" className="bch-seksi-rapat">
        <h2 id="lw-panduan" className="bch-judul-seksi">
          Panduan Urusan
        </h2>
        <KisiPintu isi={PANDUAN} />
      </section>

      <section aria-labelledby="lw-kecamatan" className="bch-seksi-rapat">
        <h2 id="lw-kecamatan" className="bch-judul-seksi">
          Menurut Kecamatan
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
