import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DaftarSumber, Lencana } from "@/features/kampung-tua/Bagian";
import {
  dicekKampung,
  domain,
  ETIKA,
  KALIMAT_REMPANG,
  KAMPUNG,
  kampungPerId,
  lapisanDari,
  lencanaLokasi,
  lencanaStatus,
  lokasiKampung,
  sumberKampung,
  TAUTAN_REMPANG,
  titikKampung,
} from "@/features/kampung-tua/data";
import { IkonCeritaRakyat } from "@/features/kampung-tua/Ikon";
import { LABEL_BUTIR, profilUntuk } from "@/features/kampung-tua/profil";
import "@/features/kampung-tua/kampung-tua.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return KAMPUNG.map((k) => ({ id: k.id }));
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const k = kampungPerId.get((await params).id);
  if (!k) return {};
  const description = `${lapisanDari(k.id).nama}, ${lokasiKampung(k)}. ${k.ringkasan}`;
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

  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">
        <Link href="/cerita/kampung-tua">Kampung Tua</Link> · {lapisan.nama}
      </p>

      <article className="bch-card bch-kartu-museum mt-3">
        <p className="bch-kicker m-0">{lapisan.kicker}</p>
        <h1>{k.nama}</h1>
        {k.nama_populer && <p className="m-0">Juga disebut: {k.nama_populer}</p>}
        <p className="bch-card-loc">{lokasiKampung(k)}</p>
        <hr className="bch-card-rule" />
        <div className="bch-rebung-mini" aria-hidden="true" />
        <Lencana isi={[...lencanaStatus(k.status_verifikasi), lencanaLokasi(k)]} />

        <p className="mt-3">{k.ringkasan}</p>

        <dl className="bch-kartu-fakta">
          <div>
            <dt>Asal-usul nama</dt>
            <dd>{k.asal_usul_nama ?? "Belum diketahui"}</dd>
          </div>
          <div>
            <dt>Suku awal</dt>
            <dd>{k.suku_awal ?? "Belum diketahui"}</dd>
          </div>
          <div>
            <dt>Masa berdiri</dt>
            <dd>{k.masa_berdiri ?? "Belum diketahui"}</dd>
          </div>
        </dl>

        <p className="bch-card-meta mt-3 mb-0" data-baris-museum>
          {dicekKampung(k).toUpperCase()}
          <br />
          {titik
            ? `${titik.lat.toFixed(3)}, ${titik.lng.toFixed(3)}${titik.perkiraan ? " · PERKIRAAN, MELESET 1 SAMPAI 3 KM" : ""}`
            : "LOKASI BELUM DIISI"}
        </p>
      </article>

      {k.lapisan === "rempang" && (
        <div className="bch-note mt-5" data-kalimat-rempang>
          <p className="m-0">{KALIMAT_REMPANG}</p>
          <p className="mt-2 mb-0">
            <Link href="/cerita/rempang">Kronologi bertanggal</Link>
            {TAUTAN_REMPANG.map((t) => (
              <span key={t.url}>
                {" · "}
                <a href={t.url} rel="noopener noreferrer">
                  {t.label}
                </a>
              </span>
            ))}
          </p>
        </div>
      )}

      {k.lapisan === "hinterland" && (
        <p className="bch-note mt-5">
          Situs dan kampung lama. Belum tentu tercatat sebagai kampung tua resmi, karena belum ada daftar terbuka untuk
          pulau-pulau ini.
        </p>
      )}

      <div className="bch-prose mt-5">
        <h2>Yang bisa dilihat</h2>
        {k.yang_bisa_dilihat.length > 0 ? (
          <ul data-yang-dilihat>
            {k.yang_bisa_dilihat.map((y) => (
              <li key={y}>{y}</li>
            ))}
          </ul>
        ) : (
          <p>Belum tercatat. Kami tidak mengisinya dengan tebakan.</p>
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
                  <p>
                    {b.teks}
                    {b.sumber && (
                      <>
                        {" "}
                        <a href={b.sumber} rel="noopener noreferrer">
                          {domain(b.sumber)}
                        </a>
                      </>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}

        {tokoh.length > 0 && (
          <>
            <h2>Tokoh yang berkaitan</h2>
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

        <h2>Sumber</h2>
        <DaftarSumber urls={sumberKampung(k)} />

        {titik && k.tempat && (
          <p>
            <Link href={`/?tempat=${k.tempat.id}`} prefetch={false}>
              Lihat di peta beranda
            </Link>
            {titik.perkiraan && ". Titiknya perkiraan, belum dicek ulang."}
          </p>
        )}
        {!titik && <p>Lokasi belum diisi, jadi kampung ini hanya ada di daftar. Kami tidak menebak koordinat.</p>}

        <p>
          Warga kampung ini? <Link href={`/koreksi?tempat=${k.tempat?.id ?? k.id}`}>Ada yang keliru? Kabari kami</Link>.
        </p>
      </div>
    </div>
  );
}
