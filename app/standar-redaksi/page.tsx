import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/site/JsonLd";
import { grafLd, organisasi } from "@/lib/data-terstruktur";
import { KIRIMAN_AKTIF, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Standar Redaksi",
  description: `Cara ${SITE_NAME} memilih, memeriksa, dan memperbaiki isinya, termasuk koreksi dan penggunaan AI.`,
};

// Kerangka mengikuti indikator The Trust Project: prinsip, metode, jenis isi, koreksi, dan masukan pembaca.
// Isinya hanya menyebut praktik yang benar-benar berjalan di situs ini.
export default function StandarRedaksi() {
  return (
    <div className="bch-page bch-baca">
      <JsonLd data={grafLd(organisasi())} />
      <h1>Standar Redaksi</h1>
      <p className="bch-lede">Cara kami memilih, memeriksa, dan memperbaiki isi situs ini.</p>

      <div className="bch-prose">
        <h2>Independen</h2>
        <p>
          {SITE_NAME} disusun secara independen oleh warga Batam. Situs ini tidak memasang iklan, tidak memakai pelacak,
          dan tidak menerima bayaran untuk mencantumkan, mengurutkan, atau menilai tempat.
        </p>
        <p>
          Bila kelak ada kerja sama berbayar atau tautan afiliasi, isinya diberi label yang jelas dan halaman ini
          diperbarui lebih dulu. Bila redaksi punya hubungan pribadi atau usaha dengan tempat yang ditulis, hubungan itu
          disebutkan di halaman tersebut.
        </p>

        <h2>Cara Data Dihimpun</h2>
        <ul>
          <li>
            Layanan Warga, Makanan, dan Transportasi disusun dari data terbuka, riset pustaka, dan pengamatan warga.
            Nama penyedia datanya ditulis di <Link href="/kolofon">Kolofon</Link>.
          </li>
          <li>
            Titik di peta hanya tampil bila lokasinya sudah dipastikan. Titik yang mewakili sebuah kawasan, pulau, atau
            kampung ditandai Lokasi Perkiraan.
          </li>
          <li>Halaman tempat makan mencantumkan kapan datanya terakhir diperiksa.</li>
          <li>
            Sebagian tempat di Direktori berasal dari Google Maps dan belum didatangi. Titiknya ditandai sebagai
            perkiraan. Tanda Rekomendasi diberikan pada tempat dengan rating minimal 4,5 dari sedikitnya 100 ulasan.
          </li>
          <li>
            Radar hujan, gelombang, gempa, peringatan dini, kualitas udara, dan CCTV diambil otomatis dari penyedianya. Bila datanya
            terlambat atau terputus, halaman menuliskannya apa adanya.
          </li>
          <li>Jadwal feri dan bus, harga, serta jam buka dapat berubah sewaktu-waktu.</li>
        </ul>

        <h2>Jenis Isi</h2>
        <ul>
          <li>
            <strong>Jurnal</strong> berisi tulisan redaksi, bertanggal dan bernama penulis.
          </li>
          <li>
            <strong>Infografik</strong> menyajikan angka dari data yang sudah diperiksa. Isinya juga tersedia sebagai
            teks.
          </li>
          <li>
            <strong>Berita</strong> memuat judul dari media lain dan menautkan ke artikel aslinya. Isi artikel menjadi
            tanggung jawab media tersebut.
          </li>
          <li>
            <strong>Daftar dan panduan</strong> di Makanan, Transportasi, dan Layanan Warga disusun redaksi. Urutannya
            tidak bisa dibeli.
          </li>
        </ul>

        <h2 id="koreksi">Koreksi</h2>
        <p>
          Bila kami keliru, kami memperbaikinya secepatnya. Perbaikan atas fakta penting dicatat bertanggal di{" "}
          <Link href="/log-koreksi">Log Koreksi</Link>, beserta tautan ke halaman yang diperbaiki.
        </p>
        <p>
          Isi tidak diubah atas permintaan pihak yang ditulis, kecuali datanya memang keliru. Permintaan menghapus data
          kantor atau data pribadi dilayani sesuai <Link href="/privasi">Kebijakan Privasi</Link>.
        </p>
        {KIRIMAN_AKTIF && (
          <p>
            Kesalahan bisa dilaporkan lewat <Link href="/koreksi">Kirim Koreksi</Link>. Tautannya juga ada di setiap
            halaman tempat.
          </p>
        )}

        <h2 id="ai">Penggunaan AI</h2>
        <p>
          Situs ini dibangun dan dirawat dengan bantuan asisten AI: untuk menulis kode, mengolah dan memeriksa data,
          serta menyusun rancangan teks. Hasilnya diperiksa dengan uji otomatis dan ditinjau sebelum tayang. Tidak ada
          perubahan yang tayang tanpa persetujuan pemilik situs.
        </p>
        <p>Gambar yang dibuat dengan AI generatif disebutkan di Kolofon.</p>

        <p className="bch-note">Halaman ini terakhir diperbarui 11 November 2026.</p>
      </div>
    </div>
  );
}
