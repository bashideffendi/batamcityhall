import type { Metadata } from "next";
import Link from "next/link";
import { KATEGORI_DIREKTORI } from "@/components/map/icons";
import { notFound, redirect } from "next/navigation";
import {
  adalahProfesi,
  alamatPublik,
  atributPublik,
  barisDaftar,
  catatanPublik,
  jamPublik,
  kartuMinimal,
  kontakPublik,
  kunciTampil,
  labelSub,
  lokasiTeks,
  namaKategori,
  punyaHalaman,
  punyaTitik,
  slugKategori,
  slugKecamatan,
  tautanArah,
  TEMPAT,
  tempatPerId,
} from "@/features/direktori/data";
import HujanKecamatan from "@/features/direktori/HujanKecamatan";
import { DaftarLencana } from "@/features/direktori/KartuTempat";
import PetaKategori from "@/features/direktori/PetaKategori";
import TombolBagikan from "@/features/direktori/TombolBagikan";
import { idKartuKampung } from "@/features/kampung-tua/data";
import { MAPPED_CAMS } from "@/features/langit-laut/lib/cctv";
import { haversineKm } from "@/features/makan/lib/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return TEMPAT.map((p) => ({ id: p.id }));
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = tempatPerId.get((await params).id);
  if (!p) return {};
  const description = `${[labelSub(p.subkategori), lokasiTeks(p)].filter(Boolean).join(", ")}.`;
  return { title: p.nama, description, openGraph: { title: p.nama, description } };
}

const BATAS_KAMERA_KM = 1;

function kameraTerdekat(lat: number | null, lng: number | null) {
  if (lat == null || lng == null) return null;
  const urut = MAPPED_CAMS.map((c) => ({ c, km: haversineKm(lat, lng, c.lat as number, c.lng as number) })).sort(
    (a, b) => a.km - b.km,
  );
  return urut[0] && urut[0].km < BATAS_KAMERA_KM ? urut[0] : null;
}

export default async function Tempat({ params }: Props) {
  const p = tempatPerId.get((await params).id);
  if (!p) notFound();
  if (!punyaHalaman(p)) redirect(barisDaftar(p));
  const minimal = kartuMinimal(p);
  const alamat = alamatPublik(p);
  const jam = jamPublik(p);
  const atribut = atributPublik(p);
  const kontak = kontakPublik(p);
  const catatan = catatanPublik(p);
  const luarBatam = p.atribut.lokasi_luar_batam === true;
  const dipeta = punyaTitik(p);
  const kamera = !minimal && !luarBatam ? kameraTerdekat(p.lat, p.lng) : null;
  const telepon = kontak.filter((k) => k.label === "Telepon");
  const kontakLain = kontak.filter((k) => k.label !== "Telepon");

  const ikon = KATEGORI_DIREKTORI.find((x) => x.nama === namaKategori(p.kategori));
  const penanda = [namaKategori(p.kategori), p.kecamatan].filter(Boolean).join(" · ");

  return (
    <div className="bch-page bch-detail-tata">
      <div className="bch-detail-kepala">
        <nav className="bch-remah" aria-label="Remah roti">
          <Link href="/info">Informasi Warga</Link> / <Link href="/info/direktori">Direktori</Link> /{" "}
          <Link href={`/info/direktori/${slugKategori(kunciTampil(p.kategori))}`}>{namaKategori(p.kategori)}</Link>
        </nav>
        <p className="bch-kicker mt-4 mb-0">{penanda}</p>
        <h1 className="mt-2">{p.nama}</h1>
        <p className="bch-detail-bawah">
          {labelSub(p.subkategori)}
          {(p.kelurahan || p.kecamatan) && " · "}
          {p.kelurahan && `${p.kelurahan}${p.kecamatan ? ", " : ""}`}
          {p.kecamatan && <Link href={`/info/kecamatan/${slugKecamatan(p.kecamatan)}`}>{p.kecamatan}</Link>}
        </p>
        {p.nama_alternatif.length > 0 && <p className="bch-detail-bawah">Juga disebut: {p.nama_alternatif.join(", ")}</p>}
        <DaftarLencana p={p} />

        <div className="bch-detail-aksi" data-aksi-tempat>
          {dipeta && (
            <Link href={`/?tempat=${p.id}`} prefetch={false} className="bch-btn">
              Lihat di peta
            </Link>
          )}
          {!minimal && (
            <a href={tautanArah(p)} target="_blank" rel="noopener noreferrer" className="bch-btn" data-variant={dipeta ? "ghost" : undefined}>
              Petunjuk arah
            </a>
          )}
          <TombolBagikan judul={p.nama} />
        </div>
      </div>

      {dipeta && ikon && p.lat != null && p.lng != null && (
        <aside className="bch-detail-samping">
          <PetaKategori
            pins={[{ id: p.id, nama: p.nama, lat: p.lat, lng: p.lng, perkiraan: p.status_koordinat !== "terverifikasi" }]}
            glyph={ikon.glyph}
            warna={ikon.warna}
            pusat={[p.lng, p.lat]}
          />
          {p.status_koordinat !== "terverifikasi" && (
            <p className="bch-catatan-halaman">
              Titik ini perkiraan area.
              {!minimal && (
                <>
                  {" "}
                  Lokasi persisnya ada di{" "}
                  <a href={tautanArah(p)} target="_blank" rel="noopener noreferrer">
                    Petunjuk arah
                  </a>
                  .
                </>
              )}
            </p>
          )}
        </aside>
      )}

      <div className="bch-detail-isi">
        {adalahProfesi(p) && <p>Pastikan status praktiknya sebelum memakai jasanya.</p>}

        {minimal ? (
          <p>
            Kartu ini hanya memuat nama dan letak umum, tanpa batas, luas, dan status lahan.{" "}
            {idKartuKampung(p) ? (
              <Link href={`/cerita/kampung-tua/${idKartuKampung(p)}`}>Baca ceritanya di Cerita dan Budaya</Link>
            ) : (
              "Ceritanya ada di Cerita dan Budaya."
            )}
          </p>
        ) : (
          <dl className="bch-tabel-info">
            {alamat && (
              <div>
                <dt>Alamat</dt>
                <dd>{alamat}</dd>
              </div>
            )}
            {jam && (
              <div>
                <dt>Jam buka</dt>
                <dd>{jam}</dd>
              </div>
            )}
            {telepon.map((k) => (
              <div key={k.label}>
                <dt>{k.label}</dt>
                <dd>{k.href ? <a href={k.href}>{k.teks}</a> : k.teks}</dd>
              </div>
            ))}
            {atribut.map((a) => (
              <div key={a.label}>
                <dt>{a.label}</dt>
                <dd>{a.nilai}</dd>
              </div>
            ))}
            {kontakLain.map((k) => (
              <div key={k.label}>
                <dt>{k.label}</dt>
                <dd>{k.href ? <a href={k.href}>{k.teks}</a> : k.teks}</dd>
              </div>
            ))}
          </dl>
        )}

        {catatan && <p>{catatan}</p>}
        {p.kategori === "kuliner" && (
          <p>
            <Link href={`/makan/tempat/${p.id}`} prefetch={false}>
              Lihat di Makan
            </Link>
          </p>
        )}

        {!minimal && p.kecamatan && <HujanKecamatan kecamatan={p.kecamatan} />}

        {kamera && (
          <p>
            Kamera lalu lintas terdekat:{" "}
            <Link href={`/cuaca/cctv?cam=${kamera.c.slug}`} prefetch={false}>
              {kamera.c.name}
            </Link>{" "}
            <span className="bch-data">({Math.round(kamera.km * 1000)} m)</span>
          </p>
        )}

        <p className="bch-catatan-halaman">
          <Link href={`/koreksi?tempat=${p.id}`}>Laporkan data yang salah</Link>
        </p>
      </div>
    </div>
  );
}
