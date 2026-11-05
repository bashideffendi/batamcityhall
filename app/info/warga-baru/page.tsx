import type { Metadata } from "next";
import { ROBOTS_TERSEMBUNYI } from "@/lib/site";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Warga Baru",
  robots: ROBOTS_TERSEMBUNYI,
  description: "Titik awal bagi warga yang baru pindah ke Batam: KTP, tempat tinggal, kesehatan, dan nomor darurat.",
};

// Disembunyikan sampai isinya lengkap (pedoman 3.8 dan bagian 6). Jangan ditautkan dari halaman mana pun.
export default function WargaBaru() {
  return (
    <div className="bch-page">
      <nav className="bch-remah" aria-label="Remah roti">
        <Link href="/info">Layanan Warga</Link>
      </nav>
      <h1 className="mt-2">Warga Baru</h1>
      <p className="bch-lede">Mulai dari sini kalau baru pindah ke Batam.</p>

      <div className="bch-prose">
        <h2>KTP dan Surat Pindah</h2>
        <p>
          Urusan ini dilayani di <Link href="/info/tempat/mpp-disdukcapil">gerai Disdukcapil di MPP</Link> atau di{" "}
          <Link href="/info">kantor kecamatan</Link>.
        </p>

        <h2>Tempat Tinggal</h2>
        <p>
          Sebelum membeli atau menyewa rumah, baca <Link href="/info/urusan-tanah">Urusan Tanah dan Rumah</Link> karena
          sebagian besar tanah di Batam berstatus HPL BP Batam.
        </p>

        <h2>Kesehatan</h2>
        <p>
          Direktori memuat <Link href="/info/direktori/kesehatan">puskesmas dan rumah sakit</Link>, juga{" "}
          <Link href="/info/direktori/pemerintahan/bpjs-kes">BPJS Kesehatan</Link>.
        </p>

        <h2>Keadaan Darurat</h2>
        <p>
          Nomor penting ada di <Link href="/info/darurat">Nomor Darurat</Link>, dan bantuan hukum gratis ada di{" "}
          <Link href="/info/bantuan-hukum">Bantuan Hukum</Link>.
        </p>

        <h2>Keliling Kota</h2>
        <p>
          Hujan dan gelombang ada di <Link href="/cuaca">Cuaca</Link>, tempat makan ada di{" "}
          <Link href="/makan">Makanan</Link>, serta Trans Batam dan feri ada di <Link href="/jalan">Transportasi</Link>.
        </p>
      </div>
    </div>
  );
}
