"use client";

import { kaidahJudul } from "@/lib/judul";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
const BULAN_AWAL = 3;

function BarisAcara({ a }: { a: AcaraPublik }) {
  const status = LABEL_STATUS[a.status];
  const adaTahun = a.edisi.some((e) => /20\d\d/.test(e.tanggal));
  return (
    <article id={a.id} data-acara={a.id} className="bud-baris">
      <div>
        <p className="bud-bidang bud-kelompok">{namaKelompokAcara(a.kelompok)}</p>
        <h4 className="bud-nama">{kaidahJudul(a.nama)}</h4>
        {a.lokasi && <p className="bud-bidang">{a.lokasi}</p>}
        {a.deskripsi && <p className="bud-uraian">{a.deskripsi}</p>}
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
      </div>
      <div className="bud-samping">
        <dl className="bud-fakta">
          <div>
            <dt>{adaTahun && !a.tanggalTidakPasti ? "Edisi Tercatat" : "Tanggal"}</dt>
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
        <span className="bch-badge" data-tone={status.nada}>
          {status.teks}
        </span>
      </div>
    </article>
  );
}

function Daftar({ isi }: { isi: AcaraPublik[] }) {
  return (
    <ul className="bud-daftar">
      {isi.map((a) => (
        <li key={a.id}>
          <BarisAcara a={a} />
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
  // Daftar mulai dari bulan berjalan, supaya yang terdekat tampil lebih dulu. Tanpa JS tetap mulai Januari.
  const mulai = bulanIni ? bulanIni - 1 : 0;
  const urutDaftar = [...urutBulan.slice(mulai, 12), ...urutBulan.slice(0, mulai), ...urutBulan.slice(12)].filter((b) => kelompokBulan.get(b)?.length);
  // Tiga bulan terdekat lebih dulu. Tanpa JS, dengan saringan, atau lewat tautan ke satu acara, semua tampil.
  const [semuaBulan, setSemuaBulan] = useState(() => typeof window !== "undefined" && Boolean(window.location.hash));
  const dipotong = siap && !semuaBulan && !adaFilter && urutDaftar.length > BULAN_AWAL;
  const bulanTampil = dipotong ? urutDaftar.slice(0, BULAN_AWAL) : urutDaftar;
  useEffect(() => {
    if (siap && window.location.hash) document.querySelector(window.location.hash)?.scrollIntoView();
  }, [siap]);

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
            Per Bulan
          </button>
        </div>
        <label className="bch-field">
          Kategori
          <select className="bch-select" value={kelompok} onChange={(e) => tulis({ kategori: e.target.value || null })}>
            <option value="">Semua Kategori</option>
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
            <option value="">Semua Status</option>
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
            Hapus Saringan
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
            <h3 className="bud-judul-bulan">{judulBulan(dipilih)}</h3>
            {kelompokBulan.get(dipilih)?.length ? (
              <Daftar isi={kelompokBulan.get(dipilih) ?? []} />
            ) : (
              <p className="bch-note">Belum ada acara untuk bulan ini.</p>
            )}
          </section>
        </>
      ) : (
        <>
        {bulanTampil.map((b) => (
            <section key={kodeBulan(b)} id={`bulan-${kodeBulan(b)}`}>
              <h3 className="bud-judul-bulan">
                {judulBulan(b)}
                {b !== null && b === bulanIni && <span className="bud-bulan-tag">Bulan Ini</span>}
              </h3>
              {b === null && <p className="bch-measure">Acara yang bulannya bergeser setiap tahun.</p>}
              <Daftar isi={kelompokBulan.get(b) ?? []} />
            </section>
        ))}
        {dipotong && (
          <p className="mt-5">
            <button type="button" className="bch-btn" data-variant="ghost" data-semua-bulan onClick={() => setSemuaBulan(true)}>
              Tampilkan Semua Bulan
            </button>
          </p>
        )}
        </>
      )}
    </>
  );
}
