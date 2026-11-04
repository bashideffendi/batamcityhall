import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cara mural ini dibuat",
  description: "Bagian mana yang digambar skrip, mana yang menunggu ilustrator, dan dari mana data hidupnya.",
};

export default function CaraDibuat() {
  return (
    <div className="bch-page bch-prose">
      <p className="bch-kicker m-0">Mode Mural</p>
      <h1 className="mt-2">Cara mural ini dibuat</h1>
      <p className="bch-lede">
        Sekarang gambarnya placeholder. Halaman ini menjelaskan apa yang asli dan apa yang belum.
      </p>

      <h2>Yang tampil sekarang</h2>
      <p>
        Satu segmen, Harbour Bay sampai Jodoh, digambar oleh skrip di repo. Garis pantainya berasal dari batas kecamatan
        Badan Informasi Geospasial. Ruko, pasar, dan crane hanya sketsa pengisi, dan posisinya bukan posisi tepat. Tidak
        ada ilustrator dan tidak ada AI yang terlibat dalam gambar ini.
      </p>

      <h2>Yang hidup oleh data</h2>
      <ul>
        <li>Cahaya: dihitung dari posisi matahari di Batam.</li>
        <li>Hujan: per kecamatan, dari radar Meteorological Service Singapore. Perkiraan radar.</li>
        <li>Ombak: prakiraan gelombang BMKG untuk Perairan Kep. Batam.</li>
        <li>Feri: dihitung dari jadwal operator. Posisi perkiraan, bukan AIS.</li>
      </ul>
      <p>Semuanya data berkala. Mural ini bukan alat navigasi dan bukan pemantauan langsung.</p>

      <h2>Rencana ilustrasi asli</h2>
      <p>
        Rencananya ilustrator lokal memegang landmark dan kunci gaya, dengan palet tinta risograph yang terbatas. Laut
        tidak digambar AI: laut dirender prosedural di atas masker air.
      </p>
      <p>
        Kalau nanti ada bagian latar yang dibantu AI, bagian itu akan disebut di halaman ini. Keputusannya belum
        diambil. Soal hak cipta: Kantor Hak Cipta Amerika Serikat (Januari 2025) menyatakan keluaran murni AI tidak
        dilindungi, tetapi seleksi, susunan, dan modifikasi manusia bisa. Hukum Indonesia untuk hal ini belum kami
        riset.
      </p>

      <p>
        <Link href="/mural" prefetch={false}>
          Kembali ke mural
        </Link>
      </p>
    </div>
  );
}
