import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  adalahProfesi,
  atributPublik,
  catatanPublik,
  kartuMinimal,
  kontakPublik,
  LABEL_BETA,
  labelSub,
  lokasiTeks,
  namaKategori,
  slugKategori,
  slugKecamatan,
  tautanAman,
  teksDicek,
  TEMPAT,
  tempatPerId,
} from "@/features/direktori/data";
import HujanKecamatan from "@/features/direktori/HujanKecamatan";
import { DaftarLencana } from "@/features/direktori/KartuTempat";
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
  const description = `${labelSub(p.subkategori)}, ${lokasiTeks(p)}.`;
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

const domain = (u: string) => {
  try {
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return u;
  }
};

export default async function Tempat({ params }: Props) {
  const p = tempatPerId.get((await params).id);
  if (!p) notFound();
  const minimal = kartuMinimal(p);
  const atribut = atributPublik(p);
  const kontak = kontakPublik(p);
  const catatan = catatanPublik(p);
  const luarBatam = p.atribut.lokasi_luar_batam === true;
  const dipeta = p.lat != null && !luarBatam;
  const kamera = !minimal && !luarBatam ? kameraTerdekat(p.lat, p.lng) : null;
  const sumber = p.sumber_url.filter(tautanAman);

  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">
        <Link href="/info/direktori">Direktori</Link> ·{" "}
        <Link href={`/info/direktori/${slugKategori(p.kategori)}`}>{namaKategori(p.kategori)}</Link>
      </p>

      <article className="bch-card bch-kartu-museum mt-3">
        <p className="bch-kicker-row bch-kicker m-0">
          <span>{labelSub(p.subkategori)}</span>
          <span className="bch-data">{p.id}</span>
        </p>
        <h1>{p.nama}</h1>
        {p.nama_alternatif.length > 0 && <p className="m-0">Juga disebut: {p.nama_alternatif.join(", ")}</p>}
        <p className="bch-card-loc">
          {p.kecamatan ? (
            <>
              {p.kelurahan && `${p.kelurahan}, `}
              <Link href={`/info/kecamatan/${slugKecamatan(p.kecamatan)}`}>{p.kecamatan}</Link>
            </>
          ) : (
            lokasiTeks(p)
          )}
        </p>
        <hr className="bch-card-rule" />
        <div className="bch-rebung-mini" aria-hidden="true" />
        <DaftarLencana p={p} />

        {adalahProfesi(p) && (
          <p className="bch-note mt-3" data-tone="caution">
            {LABEL_BETA}. Data ini belum dikonfirmasi pemilik kantor.{" "}
            <Link href="/info/bantuan-hukum#cek-status">Cek status</Link> sebelum memakai jasanya.
          </p>
        )}

        {minimal ? (
          <p className="mt-3">
            Kartu ini hanya memuat nama dan letak umumnya. Batas, luas, dan status lahan tidak kami tampilkan.{" "}
            {idKartuKampung(p) ? (
              <Link href={`/cerita/kampung-tua/${idKartuKampung(p)}`}>Baca ceritanya di Loket Cerita &amp; Budaya</Link>
            ) : (
              "Ceritanya ada di Loket Cerita & Budaya."
            )}
          </p>
        ) : (
          <dl className="bch-kartu-fakta">
            {p.alamat && (
              <div>
                <dt>Alamat</dt>
                <dd>{p.alamat}</dd>
              </div>
            )}
            {kontak.map((k) => (
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
          </dl>
        )}

        {catatan && <p>{catatan}</p>}
        {p.kategori === "kuliner" && (
          <p>
            <Link href={`/makan/tempat/${p.id}`} prefetch={false}>
              Lihat di Loket Makan
            </Link>
          </p>
        )}

        <p className="bch-card-meta mt-3 mb-0" data-baris-museum>
          {p.jam_layanan && !minimal && (
            <>
              BUKA {p.jam_layanan}
              <br />
            </>
          )}
          {teksDicek(p).toUpperCase()}
          {dipeta && (
            <>
              <br />
              {(p.lat as number).toFixed(5)}, {(p.lng as number).toFixed(5)}
            </>
          )}
        </p>
      </article>

      <div className="bch-prose mt-5">
        {luarBatam ? (
          <p>Tempat ini ada di luar Batam, jadi tidak muncul di peta kami.</p>
        ) : dipeta ? (
          <p>
            <Link href={`/?tempat=${p.id}`} prefetch={false}>
              Lihat di peta
            </Link>
            {p.status_koordinat === "perlu_cek_ulang" && " Titiknya perkiraan, belum dicek ulang."}
          </p>
        ) : (
          <p>Lokasi belum diisi, jadi tempat ini belum muncul di peta. Kami tidak menebak koordinat.</p>
        )}

        {!minimal && p.kecamatan && <HujanKecamatan kecamatan={p.kecamatan} />}

        {kamera && (
          <p>
            Kamera lalu lintas terdekat:{" "}
            <Link href={`/langit-laut?mode=cctv&cam=${kamera.c.slug}`} prefetch={false}>
              {kamera.c.name}
            </Link>{" "}
            <span className="bch-data">({Math.round(kamera.km * 1000)} m)</span>
          </p>
        )}

        {sumber.length > 0 && (
          <>
            <h2>Sumber</h2>
            <ul>
              {sumber.map((u) => (
                <li key={u}>
                  <a href={u} rel="noopener noreferrer">
                    {domain(u)}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}

        <p>
          Ada yang salah, atau ini kantor Anda? <Link href={`/koreksi?tempat=${p.id}`}>Kirim koreksi</Link>.
        </p>
      </div>
    </div>
  );
}
