"use client";

import { kaidahJudul } from "@/lib/judul";
import Link from "next/link";
import { useMemo, useState } from "react";
import { IkonCeritaRakyat } from "@/features/kampung-tua/Ikon";
import type { BarisTokoh, GrupStatus } from "./data";

type Props = {
  tokoh: BarisTokoh[];
  kelompok: { id: string; nama: string }[];
  grupStatus: { id: GrupStatus; nama: string }[];
  catatanHikayat: string[];
};

// Tanpa JavaScript pun semua kartu tampil: filter hanya menyembunyikan.
export default function DaftarTokoh({ tokoh, kelompok, grupStatus, catatanHikayat }: Props) {
  const [k, setK] = useState("");
  const [s, setS] = useState("");
  const tampil = useMemo(
    () => tokoh.filter((t) => (!k || t.kelompok === k) && (!s || t.status.grup === s)),
    [tokoh, k, s],
  );

  return (
    <>
      <div className="nj-filter">
        <label className="bch-field">
          <span>Kelompok</span>
          <select className="bch-select" value={k} onChange={(e) => setK(e.target.value)}>
            <option value="">Semua kelompok</option>
            {kelompok.map((o) => (
              <option key={o.id} value={o.id}>
                {o.nama}
              </option>
            ))}
          </select>
        </label>
        <label className="bch-field">
          <span>Status</span>
          <select className="bch-select" value={s} onChange={(e) => setS(e.target.value)}>
            <option value="">Semua status</option>
            {grupStatus.map((o) => (
              <option key={o.id} value={o.id}>
                {o.nama}
              </option>
            ))}
          </select>
        </label>
        {(k || s) && (
          <button
            type="button"
            className="bch-btn"
            data-variant="ghost"
            onClick={() => {
              setK("");
              setS("");
            }}
          >
            Hapus saringan
          </button>
        )}
      </div>
      <p className="mt-3" aria-live="polite" data-jumlah-tokoh={tampil.length}>
        {tampil.length} tokoh
      </p>

      {kelompok.map((g) => {
        const isi = tampil.filter((t) => t.kelompok === g.id);
        if (!isi.length) return null;
        return (
          <section key={g.id} aria-labelledby={`kelompok-${g.id}`} data-kelompok={g.id}>
            <h3 id={`kelompok-${g.id}`} className="mt-5">
              {kaidahJudul(g.nama)}
            </h3>
            {g.id === "b" && (
              <div className="kt-cerita" data-catatan-hikayat>
                <p className="kt-cerita-label">
                  <IkonCeritaRakyat /> Hikayat dan legenda, bukan catatan sejarah
                </p>
                <ul className="m-0 pl-5">
                  {catatanHikayat.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
            <ul className="bch-grid mt-3">
              {isi.map((t) => (
                <li key={t.id} data-tokoh={t.id}>
                  <article className="bch-card nj-kartu h-full" data-hikayat={t.status.hikayat}>
                    <h4 className="m-0">
                      <Link href={`/cerita/nama-jalan/${t.id}`} prefetch={false}>
                        {t.nama}
                      </Link>
                    </h4>
                    {t.gelar && <p className="bch-card-loc">{t.gelar}</p>}
                    {t.masaHidup && <p className="bch-card-meta m-0">{t.masaHidup}</p>}
                    <p className="mt-2 mb-2">{t.ringkasan}</p>
                    <span className="bch-badge" data-tone={t.status.nada}>
                      {t.status.grup === "hikayat" && <IkonCeritaRakyat ukuran={12} />}
                      {t.status.teks}
                    </span>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      {tampil.length === 0 && <p>Tidak ada tokoh untuk saringan ini.</p>}
    </>
  );
}
