import type { Metadata } from "next";
import Link from "next/link";
import { FOOTER_DISCLAIMER } from "@/lib/site";

export const metadata: Metadata = {
  title: "Syarat",
  description: "Draf syarat penggunaan Batam City Hall.",
};

export default function Syarat() {
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">Syarat</p>
      <h1 className="mt-2">Syarat penggunaan</h1>
      <p className="bch-note" data-tone="caution">
        Draf, belum ditinjau ahli hukum.
      </p>
      <div className="bch-prose">
        <p>{FOOTER_DISCLAIMER}</p>
        <ul>
          <li>Data disusun sebaik mungkin dan bisa keliru atau usang. Untuk urusan penting, pastikan ke kantornya.</li>
          <li>Panduan urusan tanah dan bantuan hukum adalah gambaran praktis, bukan nasihat hukum.</li>
          <li>Cuaca dan ombak di sini bukan pengganti peringatan resmi dan bukan dasar keselamatan pelayaran.</li>
          <li>Daftar PPAT, notaris, dan pejabat lelang berstatus Beta. Verifikasi sendiri sebelum memakai jasanya.</li>
          <li>
            Atribusi dan lisensi sumber ada di <Link href="/kolofon">Kolofon</Link>.
          </li>
        </ul>
      </div>
    </div>
  );
}
