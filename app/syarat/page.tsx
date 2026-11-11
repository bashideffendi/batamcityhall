import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Syarat Penggunaan",
  description: "Syarat penggunaan Barelang.co, proyek independen warga Batam.",
};

export default function Syarat() {
  return (
    <div className="bch-page bch-baca">
      <h1>Syarat Penggunaan</h1>
      <div className="bch-prose">
        <p>Barelang.co adalah proyek independen warga Batam.</p>
        <ul>
          <li>Data disusun sebaik mungkin dan dapat keliru atau usang. Untuk urusan penting, pastikan kembali sebelum bertindak.</li>
          <li>Panduan urusan tanah dan bantuan hukum adalah gambaran praktis, bukan nasihat hukum.</li>
          <li>
            Informasi cuaca, gelombang, peringatan dini, dan gempa di situs ini tidak menggantikan peringatan resmi dan
            tidak dapat dijadikan dasar keselamatan pelayaran.
          </li>
          <li>Daftar PPAT, notaris, dan pejabat lelang belum seluruhnya diperiksa. Periksa sendiri sebelum memakai jasanya.</li>
          <li>
            Kredit data dan lisensi ada di <Link href="/kolofon">Kolofon</Link>.
          </li>
        </ul>
      </div>
    </div>
  );
}
