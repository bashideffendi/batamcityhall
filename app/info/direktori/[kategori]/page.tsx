import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { kelengkapan } from "@/features/direktori/angka";
import {
  DAFTAR_KATEGORI,
  kategoriDariSlug,
  LABEL_BETA,
  labelSub,
  slugKategori,
  slugSub,
  SUB_KOSONG,
  subDiKategori,
  tempatDiKategori,
} from "@/features/direktori/data";
import KartuTempat from "@/features/direktori/KartuTempat";

export const dynamicParams = false;

export function generateStaticParams() {
  return DAFTAR_KATEGORI.map((k) => ({ kategori: slugKategori(k.kategori) }));
}

type Props = { params: Promise<{ kategori: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const k = kategoriDariSlug((await params).kategori);
  return k ? { title: k.nama, description: k.lede } : {};
}

export default async function Kategori({ params }: Props) {
  const { kategori } = await params;
  const k = kategoriDariSlug(kategori);
  if (!k) notFound();
  const tempat = tempatDiKategori(k.kategori);
  const subs = subDiKategori(k.kategori);
  const kosong = SUB_KOSONG[k.kategori] ?? [];
  const angka = kelengkapan(k.kategori);

  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">
        <Link href="/info/direktori">Direktori</Link>
      </p>
      <h1 className="mt-2">{k.nama}</h1>
      <p className="bch-lede">{k.lede}</p>

      {k.kategori === "pertanahan_hukum" && (
        <p className="bch-note" data-tone="caution">
          PPAT, notaris, dan pejabat lelang: {LABEL_BETA}. Panduan ada di{" "}
          <Link href="/info/bantuan-hukum#cek-status">Cek status</Link>.
        </p>
      )}
      {k.kategori === "kuliner" && (
        <p className="bch-note">
          Lengkapnya, dengan filter dan jalur kuliner, ada di <Link href="/makan">Loket Makan</Link>.
        </p>
      )}
      {k.kategori === "kampung_tua" && (
        <p className="bch-note">Direktori ini hanya daftar nama. Batas, luas, dan status lahan tidak ditampilkan.</p>
      )}

      {angka.length > 0 && (
        <ul className="bch-kelengkapan">
          {angka.map((a) => (
            <li key={a.label}>
              Baru <strong>{a.terdata}</strong> dari <strong>{a.nilai.toLocaleString("id-ID")}</strong> {a.label}{" "}
              terdata.
              {a.sumber && (
                <span>
                  {" "}
                  Sumber angka: {a.sumber}
                  {a.tahun ? `, ${a.tahun}` : ""}.
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      <nav aria-label="Subkategori" className="bch-sub-nav">
        {subs.map((s) => (
          <Link key={s.sub} href={`/info/direktori/${kategori}/${slugSub(s.sub)}`} prefetch={false}>
            {labelSub(s.sub)} <span className="bch-data">{s.jumlah}</span>
          </Link>
        ))}
        {kosong.map((s) => (
          <Link key={s.slug} href={`/info/direktori/${kategori}/${s.slug}`} prefetch={false} data-kosong>
            {s.nama} <span className="bch-data">0</span>
          </Link>
        ))}
      </nav>

      <h2 className="mt-7 mb-1">Daftar tempat</h2>
      <p className="bch-data m-0" data-jumlah-kategori={tempat.length}>
        {tempat.length.toLocaleString("id-ID")} tempat
      </p>
      <ul className="bch-grid mt-3">
        {tempat.map((p) => (
          <li key={p.id}>
            <KartuTempat p={p} />
          </li>
        ))}
      </ul>
    </div>
  );
}
