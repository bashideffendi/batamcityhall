import type { Metadata } from "next";
import poi from "@/data/osm/lapisan/poi.json";
import Link from "next/link";
import { IkonLingkaran, KATEGORI_DIREKTORI } from "@/components/map/icons";
import { notFound, permanentRedirect } from "next/navigation";
import { kelengkapan } from "@/features/direktori/angka";
import CatatanData from "@/features/direktori/CatatanData";
import DaftarBertahap from "@/features/direktori/DaftarBertahap";
import {
  DAFTAR_KATEGORI,
  daftarPin,
  kaidahJudul,
  kategoriDariSlug,
  labelSub,
  ledeKategori,
  punyaTitik,
  SLUG_KATEGORI_LAMA,
  slugBaru,
  slugKategori,
  slugSub,
  SUB_KOSONG,
  subDiKategori,
  tempatDiKategori,
} from "@/features/direktori/data";
import KartuTempat from "@/features/direktori/KartuTempat";
import PetaKategori from "@/features/direktori/PetaKategori";

export const dynamicParams = false;

export function generateStaticParams() {
  return [...DAFTAR_KATEGORI.map((k) => slugKategori(k.kategori)), ...SLUG_KATEGORI_LAMA].map((kategori) => ({
    kategori,
  }));
}

type Props = { params: Promise<{ kategori: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const k = kategoriDariSlug((await params).kategori);
  return k ? { title: kaidahJudul(k.nama), description: ledeKategori(k, tempatDiKategori(k.kategori).length) } : {};
}

const DAFTAR_OSM = poi.daftar as Record<string, unknown[]>;

export default async function Kategori({ params }: Props) {
  const { kategori } = await params;
  const baru = slugBaru(kategori);
  if (baru) permanentRedirect(`/info/direktori/${baru}`);
  const k = kategoriDariSlug(kategori);
  if (!k) notFound();
  const tempat = tempatDiKategori(k.kategori);
  const subs = subDiKategori(k.kategori);
  // Jenis tanpa data hanya ditautkan kalau ada daftar nama dari OpenStreetMap di halamannya.
  const kosong = (SUB_KOSONG[k.kategori] ?? []).filter((s) => DAFTAR_OSM[`${kategori}/${s.slug}`]?.length);
  const angka = kelengkapan(k.kategori);
  const bertitik = tempat.filter(punyaTitik).length;

  const ikon = KATEGORI_DIREKTORI.find((x) => x.nama === k.nama);
  const ids = new Set(tempat.map((p) => p.id));
  const pins = daftarPin()
    .filter((p) => ids.has(p.id))
    .map(({ id, nama, lat, lng, perkiraan }) => ({ id, nama, lat, lng, perkiraan }));

  return (
    <div className="bch-page">
      <nav className="bch-remah" aria-label="Remah roti">
        <Link href="/info">Informasi Warga</Link> / <Link href="/info/direktori">Direktori</Link> /{" "}
        <span aria-current="page">{k.nama}</span>
      </nav>
      <div className="bch-judul-ikon">
        {ikon && <IkonLingkaran glyph={ikon.glyph} warna={ikon.warna} ukuran={76} />}
        <h1>{kaidahJudul(k.nama)}</h1>
      </div>
      <p className="bch-lede">{ledeKategori(k, tempat.length)}</p>

      <nav aria-label="Saringan" className="bch-saring-baris bch-saring-garis">
        <Link href={`/info/direktori/${kategori}`} prefetch={false} aria-current="page" className="bch-pil">
          Semua <span className="bch-data">{tempat.length}</span>
        </Link>
        {subs.map((s) => (
          <Link key={s.sub} href={`/info/direktori/${kategori}/${slugSub(s.sub)}`} prefetch={false} className="bch-pil">
            {labelSub(s.sub)} <span className="bch-data">{s.jumlah}</span>
          </Link>
        ))}
        {kosong.map((s) => (
          <Link
            key={s.slug}
            href={`/info/direktori/${kategori}/${s.slug}`}
            prefetch={false}
            data-kosong
            className="bch-pil"
          >
            {s.nama}
          </Link>
        ))}
        <span className="bch-saring-kanan">
          <Link href={`/info/direktori?kategori=${k.kategori}`} prefetch={false} className="bch-pil">
            Kecamatan
          </Link>
          {k.kategori === "kesehatan" && (
            <Link href={`/info/direktori?kategori=${k.kategori}&igd=1`} prefetch={false} className="bch-pil">
              IGD 24 jam
            </Link>
          )}
        </span>
      </nav>

      <div className="bch-kategori-isi" data-ada-peta={pins.length > 0 ? "" : undefined}>
        <div>
          <p className="sr-only" data-jumlah-kategori={tempat.length}>
            {tempat.length.toLocaleString("id-ID")} tempat
          </p>
          <h2 className="sr-only">Daftar Tempat</h2>
          <DaftarBertahap className="bch-daftar-baris bch-daftar-tanpa-atas">
            {[...tempat]
              .sort((a, b) => Number(b.atribut.igd_24jam === true) - Number(a.atribut.igd_24jam === true))
              .map((p) => (
                <li key={p.id}>
                  <KartuTempat p={p} />
                </li>
              ))}
          </DaftarBertahap>

          {k.kategori === "pertanahan_hukum" && (
            <p className="bch-catatan-halaman">
              Daftar PPAT dan notaris belum lengkap. Pastikan status praktiknya sebelum memakai jasanya.
            </p>
          )}
          {k.kategori === "kuliner" && (
            <p className="bch-catatan-halaman">
              Saringan dan panduan kuliner ada di <Link href="/makan">Makan</Link>.
            </p>
          )}
          {k.kategori === "kampung_tua" && (
            <p className="bch-catatan-halaman">Direktori ini hanya memuat nama, tanpa batas, luas, dan status lahan.</p>
          )}
          {angka.map((a) => (
            <p key={a.label} className="bch-catatan-halaman bch-kelengkapan">
              Baru {a.terdata} dari {a.nilai.toLocaleString("id-ID")} {a.label} terdata.
            </p>
          ))}
          <CatatanData />
        </div>

        {pins.length > 0 && ikon && (
          <aside className="bch-kategori-samping">
            <PetaKategori pins={pins} glyph={ikon.glyph} warna={ikon.warna} />
            {bertitik < tempat.length && (
              <p className="bch-catatan-halaman" data-baru-bertitik>
                Baru {bertitik} dari {tempat.length} tempat punya titik di peta.
              </p>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
