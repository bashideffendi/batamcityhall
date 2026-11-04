import type { Metadata } from "next";
import Link from "next/link";
import { TEMPAT } from "@/features/direktori/data";
import KartuTempat from "@/features/direktori/KartuTempat";

export const metadata: Metadata = {
  title: "Jasa dokumen & usaha",
  description:
    "Konsultan pajak, KJPP, izin usaha, legalisasi dokumen, dan cara mengecek penerjemah tersumpah di Batam.",
};

const disub = (...sub: string[]) => TEMPAT.filter((p) => sub.includes(p.subkategori ?? ""));

const BAGIAN = [
  {
    judul: "Konsultan pajak",
    lede: "Yang tercantum di sini asosiasinya. Untuk konsultan perorangan, pakai direktori anggota IKPI dan pastikan punya izin praktik dari DJP.",
    isi: disub("asosiasi_konsultan_pajak"),
  },
  {
    judul: "Penilai (KJPP)",
    lede: "Dibutuhkan untuk penilaian rumah: KPR, waris, lelang, sengketa. Direktori MAPPI (e-directory.mappi.or.id) lebih lengkap dari daftar ini.",
    isi: disub("kjpp"),
  },
  {
    judul: "Izin usaha dan UMKM",
    lede: "NIB lewat OSS (oss.go.id). Di kawasan FTZ, perizinan berusaha diurus PTSP BP Batam. Izin daerah diurus DPMPTSP Kota Batam. PLUT-KUMKM membantu pembuatan NIB.",
    isi: disub("umkm", "perizinan"),
  },
];

export default function JasaDokumen() {
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">
        <Link href="/info">Info Warga</Link>
      </p>
      <h1 className="mt-2">Jasa dokumen &amp; usaha</h1>
      <p className="bch-lede">Sebagian jasa sengaja tidak kami daftar, karena kami tidak bisa memastikannya.</p>

      {BAGIAN.map((b) => (
        <section key={b.judul}>
          <h2 className="mt-7 mb-3">{b.judul}</h2>
          <p className="bch-measure">{b.lede}</p>
          <ul className="bch-grid">
            {b.isi.map((p) => (
              <li key={p.id}>
                <KartuTempat p={p} />
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="bch-prose">
        <h2>Tanpa daftar, ini cara mengeceknya</h2>
        <h3>Penerjemah tersumpah</h3>
        <p>
          Hasil pencarian didominasi situs pemasaran tanpa nomor SK yang bisa dicek. Minta nomor SK pengangkatannya
          (format AHU-xx.AH.03.07.tahun), cocokkan pasangan bahasanya, dan konfirmasikan ke instansi penerima dokumen.
        </p>
        <h3>Legalisasi dan Apostille</h3>
        <p>
          Untuk negara anggota Konvensi Apostille, urus online lewat Ditjen AHU. Untuk negara lain, jalurnya legalisasi
          Kemenkum, lalu Kemenlu, lalu kedutaan. Cek status negara tujuan di situs AHU atau HCCH. Kami belum
          memverifikasinya.
        </p>
        <h3>Biro jasa STNK dan paspor</h3>
        <p>
          Tidak ada daftar resmi biro jasa yang bisa dipercaya, jadi kami tidak membuatnya. Urus langsung ke Samsat,
          Kantor Imigrasi Batam, atau MPP. Alamatnya ada di{" "}
          <Link href="/info/direktori/pemerintahan">Kantor Pemerintahan</Link>.
        </p>
        <h3>Kantor akuntan</h3>
        <p>Belum kami riset. Sumber terbaik adalah direktori resmi PPPK Kemenkeu dan IAPI.</p>
      </section>
    </div>
  );
}
