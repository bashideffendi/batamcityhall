import type { Metadata } from "next";
import TautanKirim from "@/components/site/TautanKirim";
import poi from "@/data/osm/lapisan/poi.json";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import CatatanData from "@/features/direktori/CatatanData";
import DaftarBertahap from "@/features/direktori/DaftarBertahap";
import {
  DAFTAR_KATEGORI,
  kaidahJudul,
  kategoriDariSlug,
  labelSub,
  SLUG_KATEGORI_LAMA,
  slugBaru,
  slugKategori,
  slugSub,
  SUB_KOSONG,
  subDiKategori,
  subTampil,
  tanggalIndonesia,
  tempatDiKategori,
} from "@/features/direktori/data";
import KartuTempat from "@/features/direktori/KartuTempat";

export function generateStaticParams() {
  const baru = DAFTAR_KATEGORI.flatMap((k) => {
    const kategori = slugKategori(k.kategori);
    return [
      ...subDiKategori(k.kategori).map((s) => ({ kategori, sub: slugSub(s.sub) })),
      ...(SUB_KOSONG[k.kategori] ?? []).map((s) => ({ kategori, sub: s.slug })),
    ];
  });
  // Alamat lama kategori yang sudah digabung dialihkan di bawah.
  const lama = SLUG_KATEGORI_LAMA.flatMap((kategori) =>
    subDiKategori(kategori.replace(/-/g, "_")).map((s) => ({ kategori, sub: slugSub(s.sub) })),
  );
  return [...baru, ...lama];
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
      tempat: tempatDiKategori(k.kategori).filter((p) => subTampil(p.subkategori) === ada.sub),
    };
  const kosong = SUB_KOSONG[k.kategori]?.find((s) => s.slug === sub);
  return kosong ? { k, nama: kosong.nama, tempat: [] } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kategori, sub } = await params;
  const h = cari(kategori, sub);
  return h ? { title: `${kaidahJudul(h.nama)} · ${kaidahJudul(h.k.nama)}` } : {};
}

export default async function Subkategori({ params }: Props) {
  const { kategori, sub } = await params;
  const baru = slugBaru(kategori);
  if (baru) permanentRedirect(`/info/direktori/${baru}/${sub}`);
  const h = cari(kategori, sub);
  if (!h) notFound();
  const osm = (poi.daftar as Record<string, { nama: string; osm: string }[]>)[`${kategori}/${sub}`] ?? [];
  return (
    <div className="bch-page">
      <nav className="bch-remah" aria-label="Remah roti">
        <Link href="/info">Layanan Warga</Link> / <Link href="/info/direktori">Direktori</Link> /{" "}
        <Link href={`/info/direktori/${kategori}`}>{h.k.nama}</Link>
      </nav>
      <h1 className="mt-2">{kaidahJudul(h.nama)}</h1>
      {h.tempat.length === 0 ? (
        <p className="bch-lede">
          Belum ada tempat di kategori ini. <TautanKirim href="/koreksi">Kirim Usulan</TautanKirim>
        </p>
      ) : (
        <>
          <h2 className="mt-5 mb-1">Daftar Tempat</h2>
          <p className="bch-data m-0">{h.tempat.length} tempat</p>
          <DaftarBertahap className="bch-daftar-baris mt-3" kolom={2}>
            {h.tempat.map((p) => (
              <li key={p.id}>
                <KartuTempat p={p} />
              </li>
            ))}
          </DaftarBertahap>
        </>
      )}
      {osm.length > 0 && (
        <section data-daftar-osm>
          <h2 className="mt-7 mb-2">Menurut OpenStreetMap</h2>
          <p className="bch-note">
            Ada {osm.length} nama per {tanggalIndonesia(poi.ditarik)}, di luar hitungan direktori. Sebagian mungkin sudah
            tutup atau pindah.
          </p>
          <ul className="bch-osm-daftar mt-3">
            {osm.map((t) => (
              <li key={t.osm}>{t.nama}</li>
            ))}
          </ul>
        </section>
      )}
      {h.tempat.length > 0 && <CatatanData />}
    </div>
  );
}
