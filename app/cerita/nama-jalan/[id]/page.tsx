import type { Metadata } from "next";
import { KIRIMAN_AKTIF } from "@/lib/site";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IkonCeritaRakyat } from "@/features/kampung-tua/Ikon";
import {
  CATATAN_HIKAYAT,
  KELOMPOK,
  penamaanTokoh,
  relasiTokoh,
  TOKOH,
  tokohPerId,
  tempatTokoh,
} from "@/features/nama-jalan/data";
import "@/features/kampung-tua/kampung-tua.css";
import "@/features/nama-jalan/nama-jalan.css";

export function generateStaticParams() {
  return TOKOH.map((t) => ({ id: t.id }));
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = tokohPerId.get((await params).id);
  if (!t) return {};
  return { title: t.nama, description: t.ringkasan, openGraph: { title: t.nama, description: t.ringkasan } };
}

export default async function KartuTokoh({ params }: Props) {
  const t = tokohPerId.get((await params).id);
  if (!t) notFound();
  const nama = penamaanTokoh(t.id);
  const tempat = tempatTokoh(t.id);
  const relasi = relasiTokoh(t.id);
  const kelompok = KELOMPOK.find((k) => k.id === t.kelompok)?.nama;

  return (
    <div className="bch-page bch-baca">
      <nav className="bch-remah" aria-label="Remah roti">
        <Link href="/cerita/nama-jalan" prefetch={false}>Nama Jalan</Link> / {kelompok}
      </nav>

      <article className="bch-card bch-kartu-museum nj-kartu mt-3" data-hikayat={t.status.hikayat}>
        <h1>{t.nama}</h1>
        {t.gelar && <p className="bch-card-loc">{t.gelar}</p>}
        <hr className="bch-card-rule" />
        <p className="m-0" data-status-tokoh={t.status.grup}>
          <span className="bch-badge" data-tone={t.status.nada}>
            {t.status.grup === "hikayat" && <IkonCeritaRakyat ukuran={12} />}
            {t.status.teks}
          </span>
        </p>

        {(t.masaHidup || t.kaitan || t.tempatTeks) && (
          <dl className="bch-kartu-fakta">
            {t.masaHidup && (
              <div>
                <dt>Masa Hidup</dt>
                <dd>{t.masaHidup}</dd>
              </div>
            )}
            {t.kaitan && (
              <div>
                <dt>Kaitan dengan Batam</dt>
                <dd>{t.kaitan}</dd>
              </div>
            )}
            {t.tempatTeks && (
              <div>
                <dt>Tempat</dt>
                <dd>{t.tempatTeks}</dd>
              </div>
            )}
          </dl>
        )}
      </article>

      <div className="bch-prose mt-5">
        {t.status.hikayat && (
          <div className="kt-cerita" data-catatan-hikayat>
            <p className="kt-cerita-label">
              <IkonCeritaRakyat /> Tokoh hikayat atau legenda, kesejarahan diperdebatkan
            </p>
            <ul className="m-0 pl-5">
              {CATATAN_HIKAYAT.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        )}

        <h2>Kisah</h2>
        <p>{t.kisah ?? t.ringkasan}</p>
        {t.catatan.map((c) => (
          <p key={c} className="bch-note" data-tone="caution">
            {c}
          </p>
        ))}

        {nama.length > 0 && (
          <>
            <h2>Nama yang Dipakai</h2>
            <ul data-nama-dipakai>
              {nama.map((n) => (
                <li key={n.id}>
                  {n.tempat ? (
                    <Link href={`/info/tempat/${n.tempat.id}`} prefetch={false}>
                      {n.nama}
                    </Link>
                  ) : (
                    n.nama
                  )}{" "}
                  <span className="bch-sel-kecil">
                    {n.jenis}, {n.letak}
                    {n.catatan && `. ${n.catatan}`}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}

        {tempat.length > 0 && (
          <p data-tempat-tokoh>
            Kartu tempat di direktori:{" "}
            {tempat.map((p, i) => (
              <span key={p.id}>
                {i > 0 && ", "}
                <Link href={`/info/tempat/${p.id}`} prefetch={false}>
                  {p.nama}
                </Link>
              </span>
            ))}
            .
          </p>
        )}

        {relasi.length > 0 && (
          <>
            <h2>Hubungan</h2>
            <ul data-hubungan>
              {relasi.map((r) => {
                const lain = r.a === t.id ? { id: r.b, nama: r.namaB } : { id: r.a, nama: r.namaA };
                return (
                  <li key={r.id}>
                    <Link href={`/cerita/nama-jalan/${lain.id}`} prefetch={false}>
                      {lain.nama}
                    </Link>
                    : {r.jenis}.
                    {r.perluDicek && (
                      <>
                        {" "}
                        <span className="bch-badge" data-tone="caution">
                          Belum Terverifikasi
                        </span>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        )}

        <p>
          <Link href="/cerita/nama-jalan#relasi" prefetch={false}>
            Lihat Silsilah
          </Link>{" "}
          {KIRIMAN_AKTIF && (
            <>
              · <Link href="/koreksi">Kirim Koreksi</Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
