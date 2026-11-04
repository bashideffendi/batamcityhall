import type { Metadata } from "next";
import poi from "@/data/osm/lapisan/poi.json";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  DAFTAR_KATEGORI,
  kategoriDariSlug,
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
  return DAFTAR_KATEGORI.flatMap((k) => {
    const kategori = slugKategori(k.kategori);
    return [
      ...subDiKategori(k.kategori).map((s) => ({ kategori, sub: slugSub(s.sub) })),
      ...(SUB_KOSONG[k.kategori] ?? []).map((s) => ({ kategori, sub: s.slug })),
    ];
  });
}

type Props = { params: Promise<{ kategori: string; sub: string }> };

function cari(kategori: string, sub: string) {
  const k = kategoriDariSlug(kategori);
  if (!k) return null;
  const ada = subDiKategori(k.kategori).find((s) => slugSub(s.sub) === sub);
  if (ada)
    return {
      k,
      nama: labelSub(ada.sub),
      tempat: tempatDiKategori(k.kategori).filter((p) => (p.subkategori ?? "lainnya") === ada.sub),
    };
  const kosong = SUB_KOSONG[k.kategori]?.find((s) => s.slug === sub);
  return kosong ? { k, nama: kosong.nama, tempat: [] } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kategori, sub } = await params;
  const h = cari(kategori, sub);
  return h ? { title: `${h.nama} · ${h.k.nama}` } : {};
}

export default async function Subkategori({ params }: Props) {
  const { kategori, sub } = await params;
  const h = cari(kategori, sub);
  if (!h) notFound();
  const osm = (poi.daftar as Record<string, { nama: string; osm: string }[]>)[`${kategori}/${sub}`] ?? [];
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">
        <Link href="/info/direktori">Direktori</Link> · <Link href={`/info/direktori/${kategori}`}>{h.k.nama}</Link>
      </p>
      <h1 className="mt-2">{h.nama}</h1>
      {h.tempat.length === 0 ? (
        <p className="bch-lede">
          Belum ada data. Kenal tempatnya? <Link href="/koreksi">Kabari kami</Link>.
        </p>
      ) : (
        <>
          <h2 className="mt-5 mb-1">Daftar tempat</h2>
          <p className="bch-data m-0">{h.tempat.length} tempat</p>
          <ul className="bch-grid mt-3">
            {h.tempat.map((p) => (
              <li key={p.id}>
                <KartuTempat p={p} />
              </li>
            ))}
          </ul>
        </>
      )}
      {osm.length > 0 && (
        <section data-daftar-osm>
          <h2 className="mt-7 mb-2">Menurut OpenStreetMap</h2>
          <p className="bch-note">
            {osm.length} nama dari OpenStreetMap, ditarik {poi.ditarik}. Ini data relawan yang belum kami cek, jadi
            tidak masuk hitungan direktori. Bisa sudah tutup atau pindah. © OpenStreetMap contributors, ODbL.
          </p>
          <ul className="bch-osm-daftar mt-3">
            {osm.map((t) => (
              <li key={t.osm}>
                <a href={`https://www.openstreetmap.org/${t.osm}`} rel="noopener noreferrer">
                  {t.nama}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
