import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DiagramSkematik, { gayaKoridor } from "@/features/jalan/DiagramSkematik";
import InfoPraktisTrans from "@/features/jalan/InfoPraktisTrans";
import JalanNav from "@/features/jalan/JalanNav";
import StripMap from "@/features/jalan/StripMap";
import {
  arahStrip,
  CATATAN_KORIDOR,
  INFO,
  JEDA_JUMAT,
  kataKonektivitas,
  konektivitasKoridor,
  KORIDOR,
  koridorDariSlug,
  lencanaKoridor,
  pindahKoridor,
  polaKoridor,
  slugKoridor,
  teksHeadway,
  teksJam,
  teksJumlahHalte,
  TEKS_TANGGAL_DATA,
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
  const judul = `Trans Batam ${k.id} ${k.nama}`;
  return {
    title: judul,
    description:
      k.status === "rencana"
        ? `${k.id} ${k.nama}: rencana, belum beroperasi.`
        : `${judul}: urutan halte per arah, jam, headway, tarif, titik transit.`,
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
        · Koridor
      </p>
      <h1
        className="mt-2 jl-k jl-judul-koridor"
        style={gayaKoridor(k)}
        data-rencana={k.status === "rencana" ? "" : undefined}
      >
        <span className="jl-chip jl-chip-besar">
          <span className="jl-chip-warna" aria-hidden="true" />
          <span className="bch-data">{k.id}</span>
        </span>{" "}
        {k.nama}
      </h1>
      <div className="bch-badges mt-2">
        {lencana.map((l) => (
          <span key={l.teks} className="bch-badge" data-tone={l.nada}>
            {l.teks}
          </span>
        ))}
        <span className="bch-badge">data {TEKS_TANGGAL_DATA}</span>
      </div>
      <JalanNav aktif="/jalan/trans-batam" />
    </>
  );

  if (k.status === "rencana") {
    return (
      <div className="bch-page">
        {Kepala}
        <p className="bch-lede mt-5">Rencana, belum beroperasi. Belum ada daftar halte, jam, atau tarif.</p>
        <p className="bch-note">
          Koridor Tembesi sampai Barelang dan Galang masih disiapkan. Feeder ditargetkan mulai pertengahan 2027 dan
          masih menunggu pengesahan anggaran 2027. Jangan merencanakan perjalanan dengan koridor ini.
        </p>
        <h2 className="mt-7 mb-4">Di diagram</h2>
        <DiagramSkematik sorot={k.id} legenda={false} />
      </div>
    );
  }

  const jam = teksJam(k);
  const headway = teksHeadway(k);
  const jumlah = teksJumlahHalte(k);
  const pola = polaKoridor(k.id);
  const transit = transitKoridor(k.id);
  const pindah = pindahKoridor(k.id);
  const konektivitas = konektivitasKoridor(k.id);

  return (
    <div className="bch-page">
      {Kepala}

      <dl className="bch-daftar mt-5">
        <dt>Rute</dt>
        <dd>{k.dari_tabel?.terminal_a_ke_b?.replace(/TP /g, "Transferpoint ")}</dd>
        <dt>Lewat</dt>
        <dd>{k.dari_tabel?.jalan_kawasan_utama}</dd>
        <dt>Jam operasi</dt>
        <dd>
          <span className="bch-data">{jam}</span>
        </dd>
        <dt>Hari</dt>
        <dd>{k.hari}</dd>
        <dt>Headway</dt>
        <dd>
          {headway.teks}{" "}
          {headway.perluCek && (
            <span className="bch-badge" data-tone="caution">
              perlu cek ulang
            </span>
          )}
        </dd>
        {JEDA_JUMAT[k.id] && (
          <>
            <dt>Jeda Jumat</dt>
            <dd>
              {JEDA_JUMAT[k.id]}{" "}
              <span className="bch-badge" data-tone="caution">
                perlu cek ulang
              </span>
            </dd>
          </>
        )}
        <dt>Tarif</dt>
        <dd>
          <span className="bch-data">{INFO.tarif.umum}</span> umum,{" "}
          <span className="bch-data">{INFO.tarif.pelajar}</span> pelajar, mahasiswa, dan anak di bawah 12 tahun
        </dd>
        <dt>Cara bayar</dt>
        <dd>Nontunai: BRIZZI, QRIS, m-banking. Rincian di info praktis.</dd>
        {jumlah && (
          <>
            <dt>Jumlah halte</dt>
            <dd>
              {jumlah.teks}{" "}
              {jumlah.perluCek && (
                <span className="bch-badge" data-tone="caution">
                  perlu cek ulang
                </span>
              )}
            </dd>
          </>
        )}
        {CATATAN_KORIDOR[k.id] && (
          <>
            <dt>Catatan</dt>
            <dd>{CATATAN_KORIDOR[k.id]}</dd>
          </>
        )}
        <dt>Sumber</dt>
        <dd>
          <ul className="jl-daftar-rapat">
            {(k.sumber_url ?? []).map((u) => (
              <li key={u}>
                <a href={u} target="_blank" rel="noopener" className="jl-putus-kata">
                  {new URL(u).hostname.replace(/^www\./, "")}
                </a>
              </li>
            ))}
          </ul>
        </dd>
      </dl>

      <h2 className="mt-7 mb-3">Urutan halte</h2>
      <p className="bch-note">
        Dari media sekunder, bisa salah ketik atau terpotong. Garis putus berarti ada halte yang tidak tercantum di
        sumber, jadi halte di kedua sisinya tidak berurutan. Belum ada koordinat halte yang terverifikasi.{" "}
        <Link href="/koreksi" prefetch={false}>
          Lapor kalau ada yang salah
        </Link>
        .
      </p>
      <StripMap arah={pola.map(arahStrip)} gaya={gayaKoridor(k)} />

      <h2 className="mt-7 mb-3">Titik transit</h2>
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

      <h2 className="mt-7 mb-3">Konektivitas</h2>
      {konektivitas.length > 0 ? (
        <div className="bch-table-wrap">
          <table className="bch-table bch-tabel-tumpuk">
            <thead>
              <tr>
                <th scope="col">Tujuan penting</th>
                <th scope="col">Halte terdekat</th>
                <th scope="col">Status data</th>
              </tr>
            </thead>
            <tbody>
              {konektivitas.map((c) => {
                const s = kataKonektivitas(c.status);
                return (
                  <tr key={c.titik_penting}>
                    <td data-label="Tujuan penting">{c.titik_penting}</td>
                    <td data-label="Halte terdekat">{c.halte_terdekat}</td>
                    <td data-label="Status data">
                      <span className="bch-badge" data-tone={s.nada}>
                        {s.teks}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Belum ada data konektivitas untuk koridor ini.</p>
      )}

      <h2 className="mt-7 mb-4">Di diagram</h2>
      <DiagramSkematik sorot={k.id} legenda={false} />

      <div className="mt-7">
        <InfoPraktisTrans />
      </div>
    </div>
  );
}
