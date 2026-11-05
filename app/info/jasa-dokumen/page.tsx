import type { Metadata } from "next";
import Link from "next/link";
import { TEMPAT } from "@/features/direktori/data";
import KartuTempat from "@/features/direktori/KartuTempat";

export const metadata: Metadata = {
  title: "Jasa Dokumen dan Usaha",
  description: "Konsultan pajak, penilai properti, dan layanan izin usaha di Batam.",
};

const disub = (...sub: string[]) => TEMPAT.filter((p) => sub.includes(p.subkategori ?? ""));

const BAGIAN = [
  {
    judul: "Konsultan Pajak",
    lede: "Daftar ini memuat asosiasinya. Untuk konsultan perorangan, gunakan direktori anggota IKPI dan pastikan konsultannya punya izin praktik dari DJP.",
    isi: disub("asosiasi_konsultan_pajak"),
  },
  {
    judul: "Penilai Properti (KJPP)",
    lede: "Dibutuhkan untuk KPR, waris, lelang, dan sengketa rumah. Daftar lebih lengkap ada di direktori MAPPI.",
    isi: disub("kjpp"),
  },
  {
    judul: "Izin Usaha dan UMKM",
    lede: "NIB diurus lewat OSS. Di kawasan FTZ, perizinan berusaha diurus PTSP BP Batam. Izin daerah diurus DPMPTSP Kota Batam. PLUT-KUMKM membantu pembuatan NIB.",
    isi: disub("umkm", "perizinan"),
  },
];

export default function JasaDokumen() {
  return (
    <div className="bch-page">
      <nav className="bch-remah" aria-label="Remah roti">
        <Link href="/info">Informasi Warga</Link>
      </nav>
      <h1 className="mt-2">Jasa Dokumen dan Usaha</h1>
      <p className="bch-lede">Cari konsultan pajak, penilai properti, dan layanan izin usaha di Batam.</p>

      {BAGIAN.map((b) => (
        <section key={b.judul}>
          <h2 className="mt-7 mb-3">{b.judul}</h2>
          <p className="bch-measure">{b.lede}</p>
          <ul className="bch-daftar-baris" data-kolom="2">
            {b.isi.map((p) => (
              <li key={p.id}>
                <KartuTempat p={p} />
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="bch-prose">
        <h2>Jasa Lain</h2>
        <h3>Penerjemah Tersumpah</h3>
        <p>
          Minta nomor SK pengangkatannya (format AHU-xx.AH.03.07.tahun), cocokkan pasangan bahasanya, dan konfirmasikan ke
          instansi penerima dokumen.
        </p>
        <h3>Legalisasi dan Apostille</h3>
        <p>
          Negara anggota Konvensi Apostille: ajukan daring lewat Ditjen AHU. Negara lain: legalisasi Kemenkum, lalu Kemenlu,
          lalu kedutaan.
        </p>
        <h3>Biro Jasa STNK dan Paspor</h3>
        <p>
          Direktori ini tidak memuat biro jasa. Urusan STNK dan paspor dilayani di Samsat, Kantor Imigrasi Batam, atau MPP.
          Alamatnya ada di <Link href="/info/direktori/pemerintahan">Kantor dan layanan publik</Link>.
        </p>
      </section>
    </div>
  );
}
