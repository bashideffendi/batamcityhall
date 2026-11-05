import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Lencana } from "@/features/kampung-tua/Bagian";
import {
  ETIKA,
  KALIMAT_REMPANG,
  KAMPUNG,
  kampungPerId,
  lapisanDari,
  lencanaStatus,
  lokasiKampung,
  titikKampung,
} from "@/features/kampung-tua/data";
import { IkonCeritaRakyat } from "@/features/kampung-tua/Ikon";
import { LABEL_BUTIR, profilUntuk } from "@/features/kampung-tua/profil";
import { rapiTeks } from "@/features/sejarah/rapi";
import "@/features/kampung-tua/kampung-tua.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return KAMPUNG.map((k) => ({ id: k.id }));
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const k = kampungPerId.get((await params).id);
  if (!k) return {};
  const description = [lapisanDari(k.id).nama, lokasiKampung(k)].filter(Boolean).join(", ") + `. ${k.ringkasan}`;
  return { title: k.nama, description, openGraph: { title: k.nama, description } };
}

// Tokoh yang kartunya berkaitan langsung. Hanya yang disebut di ringkasan kampungnya sendiri.
const TOKOH_TERKAIT: Record<string, { id: string; nama: string }[]> = {
  "kt-nongsa-pantai": [{ id: "nong_isa", nama: "Nong Isa" }],
  "hl-bulang-lintang": [
    { id: "temenggung_abdul_jamal", nama: "Temenggung Abdul Jamal" },
    { id: "raja_maimunah", nama: "Raja Maimunah" },
  ],
  "hl-pulau-buluh": [{ id: "raja_ali_kelana", nama: "Raja Ali Kelana" }],
};

export default async function KartuKampung({ params }: Props) {
  const k = kampungPerId.get((await params).id);
  if (!k) notFound();
  const lapisan = lapisanDari(k.id);
  const profil = profilUntuk(k.id);
  const titik = titikKampung(k);
  const tokoh = TOKOH_TERKAIT[k.id] ?? [];
  const lokasi = lokasiKampung(k);

  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">
        <Link href="/cerita/kampung-tua">Kampung Tua</Link> · {lapisan.nama}
      </p>

      <article className="bch-card bch-kartu-museum mt-3">
        <p className="bch-kicker m-0">{lapisan.kicker}</p>
        <h1>{k.nama}</h1>
        {k.nama_populer && <p className="m-0">Juga disebut: {k.nama_populer}</p>}
        {lokasi && <p className="bch-card-loc">{lokasi}</p>}
        <hr className="bch-card-rule" />
        <div className="bch-rebung-mini" aria-hidden="true" />
        <Lencana isi={lencanaStatus(k.status_verifikasi)} />

        <p className="mt-3">{k.ringkasan}</p>

        {(k.asal_usul_nama || k.suku_awal || k.masa_berdiri) && (
          <dl className="bch-kartu-fakta">
            {k.asal_usul_nama && (
              <div>
                <dt>Asal-usul nama</dt>
                <dd>{k.asal_usul_nama}</dd>
              </div>
            )}
            {k.suku_awal && (
              <div>
                <dt>Penduduk awal</dt>
                <dd>{k.suku_awal}</dd>
              </div>
            )}
            {k.masa_berdiri && (
              <div>
                <dt>Berdiri sejak</dt>
                <dd>{k.masa_berdiri}</dd>
              </div>
            )}
          </dl>
        )}

        {titik && (
          <p className="bch-card-meta mt-3 mb-0" data-baris-museum>
            {`${titik.lat.toFixed(3)}, ${titik.lng.toFixed(3)}${titik.perkiraan ? " · Lokasi perkiraan, meleset 1—3 km" : ""}`}
          </p>
        )}
      </article>

      {k.lapisan === "rempang" && (
        <div className="bch-note mt-5" data-kalimat-rempang>
          <p className="m-0">{KALIMAT_REMPANG}</p>
        </div>
      )}

      {k.lapisan === "hinterland" && (
        <p className="bch-note mt-5">
          Situs dan kampung lama. Belum tentu tercatat sebagai kampung tua resmi, karena belum ada daftar terbuka untuk
          pulau-pulau ini.
        </p>
      )}

      <div className="bch-prose mt-5">
        {k.yang_bisa_dilihat.length > 0 && (
          <>
            <h2>Yang bisa dilihat</h2>
            <ul data-yang-dilihat>
              {k.yang_bisa_dilihat.map((y) => (
                <li key={y}>{y}</li>
              ))}
            </ul>
          </>
        )}

        {k.cerita_rakyat && (
          <div className="kt-cerita" data-cerita-rakyat>
            <p className="kt-cerita-label">
              <IkonCeritaRakyat /> Cerita rakyat, bukan catatan sejarah
            </p>
            <p>{k.cerita_rakyat}</p>
          </div>
        )}

        {profil && (
          <>
            <h2>{profil.judul}</h2>
            <ul className="kt-profil" data-profil>
              {profil.butir.map((b) => (
                <li key={b.teks}>
                  {b.label && (
                    <span className="bch-badge" data-tone={LABEL_BUTIR[b.label].nada}>
                      {b.label === "cerita_rakyat" && <IkonCeritaRakyat ukuran={12} />}
                      {LABEL_BUTIR[b.label].teks}
                    </span>
                  )}
                  <p>{rapiTeks(b.teks)}</p>
                </li>
              ))}
            </ul>
          </>
        )}

        {tokoh.length > 0 && (
          <>
            <h2>Tokoh yang Berkaitan</h2>
            <ul>
              {tokoh.map((t) => (
                <li key={t.id}>
                  <Link href={`/cerita/nama-jalan/${t.id}`} prefetch={false}>
                    {t.nama}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        <h2>Etika berkunjung</h2>
        <ul data-etika>
          {ETIKA.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>

        {titik && k.tempat && (
          <p>
            <Link href={`/?tempat=${k.tempat.id}`} prefetch={false}>
              Lihat di peta
            </Link>
          </p>
        )}

        <p>
          <Link href={`/koreksi?tempat=${k.tempat?.id ?? k.id}`}>Kirim koreksi</Link>
        </p>
      </div>
    </div>
  );
}
