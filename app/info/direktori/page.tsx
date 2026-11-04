import type { Metadata } from "next";
import Link from "next/link";
import kelurahanData from "@/data/wilayah/kelurahan.json";
import { DAFTAR_KATEGORI, slugKategori, tempatDiKategori, TEMPAT } from "@/features/direktori/data";
import Penjelajah from "@/features/direktori/Penjelajah";

export const metadata: Metadata = {
  title: "Direktori",
  description:
    "Direktori tempat di Batam: kantor, kesehatan, sekolah, ibadah, belanja, dan lainnya. Tanpa listing berbayar.",
};

const KELURAHAN = Object.fromEntries(kelurahanData.map((k) => [k.kecamatan, k.kelurahan]));

export default function Direktori() {
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">Loket 06 · Info Warga</p>
      <h1 className="mt-2">Direktori</h1>
      <p className="bch-lede">
        {TEMPAT.length.toLocaleString("id-ID")} tempat, dan masih jauh dari lengkap. Tidak ada yang membayar untuk masuk
        daftar ini.
      </p>

      <h2 className="mt-7 mb-4">Menurut kategori</h2>
      <ul className="bch-grid" data-kategori-grid>
        {DAFTAR_KATEGORI.map((k) => (
          <li key={k.kategori}>
            <Link href={`/info/direktori/${slugKategori(k.kategori)}`} className="bch-card h-full" prefetch={false}>
              <span className="bch-kicker-row bch-kicker">
                <span>Kategori</span>
                <span data-kategori={k.kategori}>{tempatDiKategori(k.kategori).length} tempat</span>
              </span>
              <h3>{k.nama}</h3>
              <span>{k.lede}</span>
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-7 mb-4">Cari dan saring</h2>
      <Penjelajah kategori={DAFTAR_KATEGORI.map(({ kategori, nama }) => ({ kategori, nama }))} kelurahan={KELURAHAN} />
    </div>
  );
}
