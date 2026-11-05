"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { EntriGaris, KunciStatus } from "./data";
import { IkonStatus, LABEL_STATUS, LencanaStatus, TeksMiring } from "./Status";

const URUTAN_STATUS: KunciStatus[] = ["terverifikasi", "perbedaan_versi", "belum_terverifikasi"];

export default function GarisWaktu({ entri, kategori }: { entri: EntriGaris[]; kategori: Record<string, string> }) {
  const [status, setStatus] = useState<KunciStatus | null>(null);
  const [kat, setKat] = useState("");

  const perStatus = useMemo(() => {
    const n = new Map<KunciStatus, number>();
    for (const e of entri) if (!kat || e.kategori === kat) n.set(e.status, (n.get(e.status) ?? 0) + 1);
    return n;
  }, [entri, kat]);
  const daftarKategori = useMemo(
    () => Object.keys(kategori).filter((k) => entri.some((e) => e.kategori === k)),
    [entri, kategori],
  );
  const tampil = entri.filter((e) => (!status || e.status === status) && (!kat || e.kategori === kat));
  const adaFilter = status !== null || kat !== "";

  return (
    <div>
      <div className="sj-filter">
        <div role="group" aria-label="Saring menurut status" className="sj-filter-status">
          {URUTAN_STATUS.map((s) => (
            <button
              key={s}
              type="button"
              className="sj-tombol-filter"
              aria-pressed={status === s}
              data-filter-status={s}
              onClick={() => setStatus(status === s ? null : s)}
            >
              <IkonStatus status={s} />
              {LABEL_STATUS[s]}
              <span className="bch-data">{perStatus.get(s) ?? 0}</span>
            </button>
          ))}
        </div>
        <div className="sj-filter-baris">
          <label className="bch-field">
            Kategori
            <select className="bch-select" value={kat} onChange={(e) => setKat(e.target.value)}>
              <option value="">Semua kategori</option>
              {daftarKategori.map((k) => (
                <option key={k} value={k}>
                  {kategori[k]}
                </option>
              ))}
            </select>
          </label>
          {adaFilter && (
            <button
              type="button"
              className="bch-btn"
              onClick={() => {
                setStatus(null);
                setKat("");
              }}
            >
              Tampilkan semua
            </button>
          )}
        </div>
        <p className="sj-kecil m-0" aria-live="polite" data-jumlah-garis={tampil.length}>
          Menampilkan {tampil.length} dari {entri.length} peristiwa.
        </p>
      </div>

      {tampil.length === 0 && <p className="bch-note">Tidak ada peristiwa untuk saringan ini.</p>}
      <ol className="sj-garis">
        {tampil.map((e) => (
          <li key={e.id} id={e.id} data-gw={e.id} data-status={e.status} className="sj-garis-item">
            <p className="sj-garis-tahun bch-data">
              {e.tanggal ? <time dateTime={e.tanggal}>{e.tahun}</time> : e.tahun}
            </p>
            <div className="sj-garis-isi">
              <h3>{e.judul}</h3>
              <p className="mt-1 mb-2 sj-garis-teks">
                <TeksMiring isi={e.teks} />
              </p>
              <div className="bch-badges">
                <LencanaStatus status={e.status} />
              </div>
              <p className="sj-kecil mt-1 mb-0">{kategori[e.kategori]}</p>
              {e.tokoh.length > 0 && (
                <p className="sj-kecil mt-1 mb-0">
                  Tokoh:{" "}
                  {e.tokoh.map((t, i) => (
                    <span key={t.nama}>
                      {i > 0 && ", "}
                      {t.id ? (
                        <Link href={`/cerita/nama-jalan/${t.id}`} prefetch={false}>
                          {t.nama}
                        </Link>
                      ) : (
                        t.nama
                      )}
                    </span>
                  ))}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
