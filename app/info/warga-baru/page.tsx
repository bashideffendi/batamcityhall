import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Warga baru",
  description: "Baru pindah ke Batam? Titik mulai untuk urusan KTP, tempat tinggal, kesehatan, dan darurat.",
};

// Struktur saja (research/00 bagian 5): panduan langkah demi langkah belum diriset, jadi belum ditulis.
export default function WargaBaru() {
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">
        <Link href="/info">Info Warga</Link>
      </p>
      <h1 className="mt-2">Warga baru</h1>
      <p className="bch-lede">Baru pindah ke Batam? Halaman ini baru kerangka. Isinya kami tambah setelah dicek.</p>

      <div className="bch-prose">
        <h2>KTP dan surat pindah</h2>
        <p>
          Panduan langkahnya belum kami tulis. Untuk sekarang, tanyakan ke{" "}
          <Link href="/info/tempat/mpp-disdukcapil">gerai Disdukcapil di MPP</Link> atau{" "}
          <Link href={`/info/kecamatan/batam-kota`}>kantor kecamatan</Link> Anda.
        </p>

        <h2>Tempat tinggal</h2>
        <p>
          Daftar kos belum ada. Kalau mau membeli atau menyewa rumah, baca dulu{" "}
          <Link href="/info/urusan-tanah">urusan tanah</Link>, karena sebagian besar tanah di Batam berstatus HPL BP
          Batam.
        </p>

        <h2>Kerja di kawasan industri</h2>
        <p>Belum kami riset.</p>

        <h2>Kesehatan</h2>
        <p>
          <Link href="/info/direktori/kesehatan">Puskesmas dan rumah sakit</Link>, juga{" "}
          <Link href="/info/direktori/layanan-publik/bpjs-kes">BPJS Kesehatan</Link>.
        </p>

        <h2>Kalau darurat</h2>
        <p>
          <Link href="/info/darurat">Nomor darurat</Link> dan <Link href="/info/bantuan-hukum">bantuan hukum</Link>.
        </p>

        <h2>Keliling kota</h2>
        <p>
          <Link href="/langit-laut">Cek hujan dan ombak</Link>, lalu <Link href="/makan">cari makan</Link>. Untuk
          berpindah, ada <Link href="/jalan">Trans Batam dan feri</Link>.
        </p>
      </div>
    </div>
  );
}
