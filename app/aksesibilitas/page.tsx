import type { Metadata } from "next";
import Link from "next/link";
import { KIRIMAN_AKTIF, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Aksesibilitas",
  description: `Target aksesibilitas ${SITE_NAME}, cara kami memeriksanya, dan keterbatasan yang diketahui.`,
};

export default function Aksesibilitas() {
  return (
    <div className="bch-page bch-baca">
      <h1>Aksesibilitas</h1>
      <p className="bch-lede">Kami menargetkan WCAG 2.2 tingkat AA di seluruh situs.</p>

      <div className="bch-prose">
        <h2>Yang Sudah Tersedia</h2>
        <ul>
          <li>Tautan Langsung ke Isi di awal setiap halaman.</li>
          <li>
            Situs bisa dipakai dengan papan ketik. Kamera di peta CCTV bisa dipilih dengan Tab dan Enter, dan Peta Bus
            bisa diperbesar dengan tombol, tidak hanya dengan cubit atau gulir.
          </li>
          <li>
            Tema terang dan gelap. Animasi bisa dimatikan lewat tombol Animasi di kaki situs, dan pengaturan pengurangan
            gerak di perangkat ikut dihormati.
          </li>
          <li>
            Isi peta juga tersedia sebagai teks: kecamatan yang sedang hujan, daftar kamera, daftar halte per koridor,
            dan daftar tempat.
          </li>
          <li>Infografik memuat angkanya juga sebagai teks.</li>
        </ul>

        <h2>Cara Kami Memeriksa</h2>
        <ul>
          <li>
            Halaman diuji otomatis dengan axe pada tema terang dan gelap, di layar desktop dan ponsel, sebelum rilis.
          </li>
          <li>Kontras warna, ukuran target sentuh, dan tata letak selebar 360 piksel diperiksa sebelum rilis.</li>
        </ul>

        <h2>Keterbatasan yang Diketahui</h2>
        <ul>
          <li>
            Peta interaktif digambar di kanvas, sehingga isinya tidak terbaca pembaca layar. Isi yang sama tersedia
            dalam daftar teks di halaman yang sama.
          </li>
          <li>Video CCTV tidak bersuara dan tidak memiliki keterangan teks.</li>
          <li>Sebagian nama halte dan tempat ditulis seperti di lapangan, termasuk singkatannya.</li>
        </ul>

        {KIRIMAN_AKTIF && (
          <>
            <h2>Masukan</h2>
            <p>
              Bila ada bagian yang sulit dipakai, sampaikan lewat <Link href="/koreksi">Kirim Koreksi</Link>.
            </p>
          </>
        )}

        <p className="bch-note">Pernyataan ini terakhir ditinjau 8 November 2026.</p>
      </div>
    </div>
  );
}
