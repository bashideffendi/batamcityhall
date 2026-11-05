"use client";

import { kaidahJudul } from "@/lib/judul";
import Link from "next/link";
import { useMemo } from "react";
import {
  BULAN,
  BULAN_TIDAK_TETAP,
  bulanWib,
  KELOMPOK_ACARA,
  LABEL_STATUS,
  namaKelompokAcara,
  STATUS_ACARA,
  type AcaraPublik,
} from "./label";
import { useParamUrl } from "./useParamUrl";

const KODE_TIDAK_TETAP = "lain";

function KartuAcara({ a }: { a: AcaraPublik }) {
  const status = LABEL_STATUS[a.status];
  const adaTahun = a.edisi.some((e) => /20\d\d/.test(e.tanggal));
  return (
    <article id={a.id} data-acara={a.id} className="bch-card bud-kartu">
      <p className="bch-kicker-row bch-kicker m-0">
        <span>{namaKelompokAcara(a.kelompok)}</span>
        <span>{a.bulan ? BULAN[a.bulan - 1] : BULAN_TIDAK_TETAP}</span>
      </p>
      <h3>{kaidahJudul(a.nama)}</h3>
      {a.lokasi && <p className="bch-card-loc">{a.lokasi}</p>}
      <hr className="bch-card-rule" />
      <div className="bch-rebung-mini" aria-hidden="true" />
      {a.deskripsi && <p className="m-0">{a.deskripsi}</p>}
      <dl className="bud-fakta">
        <div>
          <dt>{adaTahun && !a.tanggalTidakPasti ? "Edisi tercatat" : "Tanggal"}</dt>
          <dd>
            {a.edisi.map((e) => (
              <span key={`${e.judul}-${e.tanggal}`} className="bud-edisi" data-tanggal>
                {e.judul && <span className="bud-edisi-judul">{e.judul}</span>}
                <span className="bch-data">{e.tanggal}</span>
                {e.lokasi && <span className="bch-sel-kecil">{e.lokasi}</span>}
              </span>
            ))}
            {a.pola && <span className="bch-sel-kecil">{a.pola}</span>}
            {a.tanggalTidakPasti && a.status !== "belum pasti" && (
              <span className="bch-sel-kecil">Tanggal belum pasti</span>
            )}
          </dd>
        </div>
        <div>
          <dt>Penyelenggara</dt>
          <dd>{a.penyelenggara}</dd>
        </div>
      </dl>
      <div className="bch-badges mt-3">
        <span className="bch-badge" data-tone={status.nada}>
          {status.teks}
        </span>
      </div>
      {a.statusRinci && <p className="bud-rinci">{a.statusRinci}</p>}
      {a.catatan.map((c) => (
        <p key={c} className="bud-rinci">
          {c}
        </p>
      ))}
      {a.tempat.length > 0 && (
        <p className="bud-tempat">
          {a.tempat.map((t) => (
            <Link key={t.id} href={`/info/tempat/${t.id}`} prefetch={false}>
              {t.nama}
            </Link>
          ))}
        </p>
      )}
    </article>
  );
}

function Kisi({ isi }: { isi: AcaraPublik[] }) {
  return (
    <ul className="bch-grid">
      {isi.map((a) => (
        <li key={a.id}>
          <KartuAcara a={a} />
        </li>
      ))}
    </ul>
  );
}

const judulBulan = (b: number | null) => (b ? BULAN[b - 1] : BULAN_TIDAK_TETAP);
const kodeBulan = (b: number | null) => (b ? String(b) : KODE_TIDAK_TETAP);

// Urutan acara sudah disiapkan data.ts. Di sini hanya filter dan cara tampil. Tanpa JS, tampilan daftar lengkap.
export default function Kalender({ acara }: { acara: AcaraPublik[] }) {
  const { siap, param, tulis } = useParamUrl();
  const kelompok = param.get("kategori") ?? "";
  const status = param.get("status") ?? "";
  const perBulan = param.get("tampilan") === "bulan";

  const hasil = useMemo(
    () => acara.filter((a) => (!kelompok || a.kelompok === kelompok) && (!status || a.status === status)),
    [acara, kelompok, status],
  );

  const kelompokBulan = useMemo(() => {
    const m = new Map<number | null, AcaraPublik[]>();
    for (const a of hasil) m.set(a.bulan, [...(m.get(a.bulan) ?? []), a]);
    return m;
  }, [hasil]);

  // Bulan ini dihitung di WIB dan hanya di browser: halaman ini statis.
  const bulanIni = siap ? bulanWib(new Date()) : null;
  const dipilihKode = param.get("bulan") ?? (bulanIni ? String(bulanIni) : "1");
  const dipilih = dipilihKode === KODE_TIDAK_TETAP ? null : Number(dipilihKode);
  const adaFilter = Boolean(kelompok || status);
  const adaTanpaBulan = acara.some((a) => a.bulan === null);
  const urutBulan: (number | null)[] = [...BULAN.map((_, i) => i + 1), ...(adaTanpaBulan ? [null] : [])];

  return (
    <>
      <div className="bud-kontrol" hidden={!siap}>
        <div className="bud-pilih-tampilan" role="group" aria-label="Cara tampil">
          <button
            type="button"
            className="bud-tombol"
            aria-pressed={!perBulan}
            onClick={() => tulis({ tampilan: null })}
          >
            Daftar
          </button>
          <button
            type="button"
            className="bud-tombol"
            aria-pressed={perBulan}
            onClick={() => tulis({ tampilan: "bulan" })}
          >
            Per bulan
          </button>
        </div>
        <label className="bch-field">
          Kategori
          <select className="bch-select" value={kelompok} onChange={(e) => tulis({ kategori: e.target.value || null })}>
            <option value="">Semua kategori</option>
            {KELOMPOK_ACARA.map((k) => (
              <option key={k.slug} value={k.slug}>
                {k.nama}
              </option>
            ))}
          </select>
        </label>
        <label className="bch-field">
          Status
          <select className="bch-select" value={status} onChange={(e) => tulis({ status: e.target.value || null })}>
            <option value="">Semua status</option>
            {STATUS_ACARA.map((s) => (
              <option key={s} value={s}>
                {LABEL_STATUS[s].teks}
              </option>
            ))}
          </select>
        </label>
        {adaFilter && (
          <button
            type="button"
            className="bud-tombol"
            data-reset
            onClick={() => tulis({ kategori: null, status: null })}
          >
            Hapus saringan
          </button>
        )}
      </div>

      <p className="bud-jumlah" aria-live="polite" data-jumlah={hasil.length}>
        {hasil.length} dari {acara.length} acara
      </p>

      {hasil.length === 0 && <p className="bch-note">Tidak ada acara untuk saringan ini.</p>}

      {perBulan ? (
        <>
          <div className="bud-tahun" role="group" aria-label="Pilih bulan">
            {urutBulan.map((b) => {
              const n = kelompokBulan.get(b)?.length ?? 0;
              return (
                <button
                  key={kodeBulan(b)}
                  type="button"
                  className="bud-bulan"
                  aria-pressed={dipilih === b}
                  data-kosong={n === 0 ? "" : undefined}
                  onClick={() => tulis({ bulan: kodeBulan(b) })}
                >
                  <span>{judulBulan(b)}</span>
                  <span className="bch-data">
                    {n} acara{b !== null && b === bulanIni ? ", bulan ini" : ""}
                  </span>
                </button>
              );
            })}
          </div>
          <section data-bulan-terpilih={dipilihKode}>
            <h2 className="mt-6 mb-3">{judulBulan(dipilih)}</h2>
            {kelompokBulan.get(dipilih)?.length ? (
              <Kisi isi={kelompokBulan.get(dipilih) ?? []} />
            ) : (
              <p className="bch-note">Belum ada acara untuk bulan ini.</p>
            )}
          </section>
        </>
      ) : (
        urutBulan.map((b) =>
          kelompokBulan.get(b)?.length ? (
            <section key={kodeBulan(b)} id={`bulan-${kodeBulan(b)}`}>
              <h2 className="mt-7 mb-3">{judulBulan(b)}</h2>
              {b === null && <p className="bch-measure">Acara yang bulannya bergeser setiap tahun.</p>}
              <Kisi isi={kelompokBulan.get(b) ?? []} />
            </section>
          ) : null,
        )
      )}
    </>
  );
}
