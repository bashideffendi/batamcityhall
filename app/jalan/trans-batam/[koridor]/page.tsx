import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DiagramSkematik, { gayaKoridor } from "@/features/jalan/DiagramSkematik";
import { kapital } from "@/features/jalan/feri-terakhir";
import InfoPraktisTrans from "@/features/jalan/InfoPraktisTrans";
import JalanNav from "@/features/jalan/JalanNav";
import StripMap from "@/features/jalan/StripMap";
import {
  arahStrip,
  CATATAN_DAFTAR_HALTE,
  CATATAN_KORIDOR,
  INFO,
  JEDA_JUMAT,
  konektivitasKoridor,
  KORIDOR,
  koridorDariSlug,
  lencanaKoridor,
  nomorKoridor,
  pindahKoridor,
  polaKoridor,
  ruteKoridor,
  slugKoridor,
  teksJam,
  teksJumlah,
  teksSelang,
  transitKoridor,
} from "@/features/jalan/trans-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return KORIDOR.map((k) => ({ koridor: slugKoridor(k.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ koridor: string }> }): Promise<Metadata> {
  const { koridor } = await params;
  const k = koridorDariSlug(koridor);
  if (!k) return {};
  const judul = `Koridor ${nomorKoridor(k)}: ${k.nama}`;
  return {
    title: judul,
    description:
      k.status === "rencana"
        ? `Trans Batam ${judul}: direncanakan dan belum beroperasi.`
        : `Trans Batam ${judul}: urutan halte, jam operasi, selang keberangkatan, tarif, dan titik transit.`,
  };
}

export default async function HalamanKoridor({ params }: { params: Promise<{ koridor: string }> }) {
  const { koridor } = await params;
  const k = koridorDariSlug(koridor);
  if (!k) notFound();

  const lencana = lencanaKoridor(k);
  const Kepala = (
    <>
      <p className="bch-kicker m-0">
        <Link href="/jalan/trans-batam" prefetch={false}>
          Trans Batam
        </Link>{" "}
        · {k.id}
      </p>
      <h1
        className="mt-2 jl-k jl-judul-koridor"
        style={gayaKoridor(k)}
        data-rencana={k.status === "rencana" ? "" : undefined}
      >
        <span className="jl-chip jl-chip-besar">
          <span className="jl-chip-warna" aria-hidden="true" />
        </span>{" "}
        Koridor {nomorKoridor(k)}: {k.nama}
      </h1>
      {lencana.length > 0 && (
        <div className="bch-badges mt-2">
          {lencana.map((l) => (
            <span key={l.teks} className="bch-badge" data-tone={l.nada}>
              {kapital(l.teks)}
            </span>
          ))}
        </div>
      )}
      <JalanNav aktif="/jalan/trans-batam" />
    </>
  );

  if (k.status === "rencana") {
    return (
      <div className="bch-page">
        {Kepala}
        <p className="bch-lede mt-5">Daftar halte, jam, dan tarifnya belum ada.</p>
        <p className="bch-note">
          Koridor Tembesi—Barelang dan Galang masih disiapkan. Bus pengumpan ditargetkan mulai pertengahan 2027,
          menunggu pengesahan anggaran 2027.
        </p>
        <h2 className="mt-7 mb-4">Diagram Koridor</h2>
        <DiagramSkematik sorot={k.id} legenda={false} />
      </div>
    );
  }

  const jam = teksJam(k);
  const selang = teksSelang(k);
  const jumlah = teksJumlah(k);
  const pola = polaKoridor(k.id);
  const transit = transitKoridor(k.id);
  const pindah = pindahKoridor(k.id);
  const konektivitas = konektivitasKoridor(k.id);

  return (
    <div className="bch-page">
      {Kepala}

      <dl className="bch-daftar mt-5">
        <dt>Rute</dt>
        <dd>{ruteKoridor(k)}</dd>
        <dt>Melewati</dt>
        <dd>{k.dari_tabel?.jalan_kawasan_utama}</dd>
        <dt>Jam operasi</dt>
        <dd>
          <span className="bch-data">{jam}</span>, {k.hari}
        </dd>
        {selang && (
          <>
            <dt>Selang keberangkatan</dt>
            <dd>{selang}</dd>
          </>
        )}
        {JEDA_JUMAT[k.id] && (
          <>
            <dt>Jeda Jumat</dt>
            <dd>{JEDA_JUMAT[k.id]}</dd>
          </>
        )}
        <dt>Tarif</dt>
        <dd>
          <span className="bch-data">{INFO.tarif.umum}</span>, pelajar{" "}
          <span className="bch-data">{INFO.tarif.pelajar}</span>
        </dd>
        <dt>Cara bayar</dt>
        <dd>nontunai (BRIZZI, QRIS, dan aplikasi bank)</dd>
        {jumlah && (
          <>
            <dt>Jumlah halte</dt>
            <dd>{jumlah}</dd>
          </>
        )}
        {CATATAN_KORIDOR[k.id] && (
          <>
            <dt>Catatan</dt>
            <dd>{CATATAN_KORIDOR[k.id]}</dd>
          </>
        )}
      </dl>

      <h2 className="mt-7 mb-3">Urutan Halte</h2>
      <StripMap arah={pola.map(arahStrip)} gaya={gayaKoridor(k)} />

      <h2 className="mt-7 mb-3">Titik Transit</h2>
      {pindah.length > 0 && (
        <ul className="jl-pindah">
          {pindah.map((p) => {
            const lain = KORIDOR.find((x) => x.id === p.koridor);
            return (
              <li key={p.koridor} className="jl-k" style={lain && gayaKoridor(lain)}>
                <Link
                  href={`/jalan/trans-batam/${slugKoridor(p.koridor)}`}
                  prefetch={false}
                  className="jl-chip jl-chip-tautan-kecil"
                >
                  <span className="jl-chip-warna" aria-hidden="true" />
                  <span className="bch-data">{p.koridor}</span>
                </Link>
                <span>{p.halte.join(", ")}</span>
              </li>
            );
          })}
        </ul>
      )}
      {transit.length > 0 && (
        <div className="bch-table-wrap mt-4">
          <table className="bch-table bch-tabel-tumpuk">
            <thead>
              <tr>
                <th scope="col">Halte</th>
                <th scope="col">Koridor</th>
                <th scope="col">Fungsi</th>
              </tr>
            </thead>
            <tbody>
              {transit.map((t) => (
                <tr key={t.halte}>
                  <td data-label="Halte">{t.halte}</td>
                  <td data-label="Koridor" className="bch-data">
                    {t.koridor}
                  </td>
                  <td data-label="Fungsi">{t.fungsi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {konektivitas.length > 0 && (
        <>
          <h2 className="mt-7 mb-3">Tujuan Penting</h2>
          <div className="bch-table-wrap">
            <table className="bch-table bch-tabel-tumpuk">
              <thead>
                <tr>
                  <th scope="col">Tujuan penting</th>
                  <th scope="col">Halte terdekat</th>
                </tr>
              </thead>
              <tbody>
                {konektivitas.map((c) => (
                  <tr key={c.titik_penting}>
                    <td data-label="Tujuan penting">{c.titik_penting}</td>
                    <td data-label="Halte terdekat">{c.halte_terdekat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <h2 className="mt-7 mb-4">Diagram Koridor</h2>
      <DiagramSkematik sorot={k.id} legenda={false} />

      <div className="mt-7">
        <InfoPraktisTrans />
      </div>

      <p className="jl-catatan-kecil mt-7">
        {CATATAN_DAFTAR_HALTE}{" "}
        <Link href="/koreksi" prefetch={false}>
          Kirim koreksi
        </Link>
      </p>
    </div>
  );
}
