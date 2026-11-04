import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DaftarSumber } from "@/features/kampung-tua/Bagian";
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

export const dynamicParams = false;

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
    <div className="bch-page">
      <p className="bch-kicker m-0">
        <Link href="/cerita/nama-jalan">Siapa di Balik Nama Jalan</Link> · {kelompok}
      </p>

      <article className="bch-card bch-kartu-museum nj-kartu mt-3" data-hikayat={t.status.hikayat}>
        <h1>{t.nama}</h1>
        {t.gelar && <p className="bch-card-loc">{t.gelar}</p>}
        <hr className="bch-card-rule" />
        <div className="bch-rebung-mini" aria-hidden="true" />
        <p className="m-0" data-status-tokoh={t.status.grup}>
          <span className="bch-badge" data-tone={t.status.nada}>
            {t.status.hikayat && <IkonCeritaRakyat ukuran={12} />}
            {t.status.teks}
          </span>
        </p>

        <dl className="bch-kartu-fakta">
          <div>
            <dt>Masa hidup</dt>
            <dd>{t.masaHidup ?? "Belum diketahui"}</dd>
          </div>
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
          {t.statusTeks && (
            <div>
              <dt>Status</dt>
              <dd>{t.statusTeks}</dd>
            </div>
          )}
        </dl>
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
        {t.ringkas && (
          <p className="bch-note">
            Kartu ini ringkas dan tanpa verifikasi. Kami belum punya sumber biografi untuk tokoh ini, jadi tidak kami
            isi dengan tebakan.
          </p>
        )}
        {t.catatan.map((c) => (
          <p key={c} className="bch-note" data-tone="caution">
            {c}
          </p>
        ))}

        {nama.length > 0 && (
          <>
            <h2>Nama yang dipakai</h2>
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
                    {n.jenis}, {n.letak.replace(/\s*\(perlu dicek\)/, "")}
                    {n.lokasiPerluDicek && ", lokasi perlu dicek"}
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
                          Perlu dicek
                        </span>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        )}

        <h2>Sumber</h2>
        <DaftarSumber urls={t.sumber} />
        {t.sumber.length === 0 && nama.some((n) => n.sumber) && (
          <p>Sumber nama tempatnya ada di daftar nama tempat, tetapi itu bukan sumber biografi.</p>
        )}

        <p>
          <Link href="/cerita/nama-jalan#relasi" prefetch={false}>
            Lihat silsilah
          </Link>{" "}
          · Ada yang keliru? <Link href="/koreksi">Kabari kami</Link>.
        </p>
      </div>
    </div>
  );
}
