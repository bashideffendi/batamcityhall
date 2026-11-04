import type { Metadata } from "next";
import Link from "next/link";
import stats from "@/data/places_stats.json";
import { FOOTER_DISCLAIMER } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tentang",
  description: "Prinsip non-komersial dan cara kerja data Batam City Hall.",
};

const angka = (n: number) => n.toLocaleString("id-ID");

export default function Tentang() {
  const k = stats.per_status_koordinat;
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">Tentang</p>
      <h1 className="mt-2">Balai warga, bukan balai kota</h1>
      <p className="bch-lede">
        Website kota indie untuk Batam, dibuat seorang warga Batam. Peta laut, hujan, feri, direktori, dan cerita, dalam
        satu tempat.
      </p>

      <div className="bch-prose">
        <p className="bch-note">{FOOTER_DISCLAIMER}</p>

        <h2>Prinsip</h2>
        <ul>
          <li>Tanpa iklan, tanpa listing berbayar, tanpa artikel sponsor.</li>
          <li>Tidak ada yang bisa membayar supaya masuk daftar atau naik urutan.</li>
          <li>Tanpa pelacak iklan.</li>
          <li>Biaya rencananya dari donasi, dan mungkin merch kecil.</li>
        </ul>

        <h2>Cara kerja data</h2>
        <p>
          Isi situs ini berasal dari riset sumber terbuka, data resmi yang dipublikasikan, OpenStreetMap, dan masukan
          warga. Kami tidak mengarang data. Kalau belum tahu, kami tulis belum tahu.
        </p>
        <p>
          Direktori saat ini memuat {angka(stats.total_tempat)} tempat. Dari jumlah itu, koordinat{" "}
          {angka(k.terverifikasi)} tempat sudah terverifikasi, {angka(k.perlu_cek_ulang)} tempat perlu dicek ulang, dan{" "}
          {angka(k.perlu_diisi_user)} tempat belum punya koordinat.
        </p>
        <p>
          Koordinat tidak pernah ditebak. Tempat tanpa koordinat tidak muncul di peta, hanya di daftar. Yang
          koordinatnya belum pasti akan ditandai sebagai perkiraan.
        </p>
        <p>
          Cerita rakyat diberi label sebagai cerita rakyat. Hal yang masih diperdebatkan ditulis bertanggal, dengan
          sumber tiap pihak.
        </p>

        <h2>Keadaan sekarang</h2>
        <p>
          Situs ini masih dibangun. Yang sudah jalan baru peta dasar dan halaman ini. Loket lain dibuka bertahap, dan
          daftarnya ada di beranda.
        </p>
        <p>
          Huruf, lisensi, dan atribusi ada di <Link href="/kolofon">Kolofon</Link>.
        </p>
      </div>
    </div>
  );
}
