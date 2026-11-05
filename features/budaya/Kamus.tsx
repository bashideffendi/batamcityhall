"use client";

import { useMemo } from "react";
import { buatPencariKata, hurufDari } from "./cari";
import { KELOMPOK_KATA, RAGAM_KATA, type KataPublik } from "./label";
import { useParamUrl } from "./useParamUrl";

const namaKelompok = (slug: string) => KELOMPOK_KATA.find((k) => k.slug === slug)?.nama ?? slug;

function Entri({ k }: { k: KataPublik }) {
  return (
    <article id={k.id} data-kata={k.id} className="bud-entri">
      <h3>
        {k.kata}
        {k.belumDiperiksa && "*"}
      </h3>
      <div>
        <p className="bud-arti">
          <span className="bud-arti-label">Arti</span>‘{k.arti}’
        </p>
        {k.contoh && (
          <p className="bud-contoh">
            <span className="bud-arti-label">Contoh</span>
            {k.contoh}
          </p>
        )}
        {k.konteks && <p className="bud-rinci">{k.konteks}</p>}
        <div className="bch-badges mt-2">
          <span className="bch-badge" data-tone="info">
            {k.labelRagam}
          </span>
        </div>
        <p className="bch-card-meta mt-2 mb-0">
          {k.asal !== k.labelRagam && (
            <>
              Asal: {k.asal}
              <br />
            </>
          )}
          {namaKelompok(k.kelompok)}
        </p>
      </div>
    </article>
  );
}

// Daftar penuh selalu tercetak di HTML. Pencarian MiniSearch hanya menyaring di browser.
export default function Kamus({ entri }: { entri: KataPublik[] }) {
  const { siap, param, tulis } = useParamUrl();
  const q = param.get("q") ?? "";
  const kelompok = param.get("kelompok") ?? "";
  const ragam = param.get("ragam") ?? "";

  const pencari = useMemo(() => (q.trim() ? buatPencariKata(entri) : null), [entri, q]);
  const hasil = useMemo(() => {
    const cocok = pencari?.(q);
    return entri.filter(
      (k) => (!cocok || cocok.has(k.id)) && (!kelompok || k.kelompok === kelompok) && (!ragam || k.ragam === ragam),
    );
  }, [entri, pencari, q, kelompok, ragam]);

  const perHuruf = useMemo(() => {
    const m = new Map<string, KataPublik[]>();
    for (const k of hasil) m.set(hurufDari(k.kata), [...(m.get(hurufDari(k.kata)) ?? []), k]);
    return m;
  }, [hasil]);

  const semuaHuruf = useMemo(() => [...new Set(entri.map((k) => hurufDari(k.kata)))].sort(), [entri]);

  return (
    <>
      <noscript>
        <p className="bch-note">Pencarian memerlukan JavaScript. Daftar lengkap ada di bawah.</p>
      </noscript>
      <div className="bud-kontrol" hidden={!siap}>
        <label className="bch-field bud-kontrol-lebar">
          Cari kata, arti, atau contoh
          <input
            className="bch-input"
            type="search"
            value={q}
            onChange={(e) => tulis({ q: e.target.value || null })}
            autoComplete="off"
          />
        </label>
        <label className="bch-field">
          Kelompok
          <select className="bch-select" value={kelompok} onChange={(e) => tulis({ kelompok: e.target.value || null })}>
            <option value="">Semua kelompok</option>
            {KELOMPOK_KATA.map((k) => (
              <option key={k.slug} value={k.slug}>
                {k.nama}
              </option>
            ))}
          </select>
        </label>
        <label className="bch-field">
          Asal
          <select className="bch-select" value={ragam} onChange={(e) => tulis({ ragam: e.target.value || null })}>
            <option value="">Semua asal</option>
            {RAGAM_KATA.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
      </div>

      <nav aria-label="Lompat ke huruf" className="bud-huruf">
        {semuaHuruf.map((h) =>
          perHuruf.has(h) ? (
            <a key={h} href={`#huruf-${h}`}>
              {h}
            </a>
          ) : (
            <span key={h} aria-hidden="true">
              {h}
            </span>
          ),
        )}
      </nav>

      <p className="bud-jumlah" aria-live="polite" data-jumlah={hasil.length}>
        {hasil.length} dari {entri.length} kata
      </p>

      {hasil.length === 0 && (
        <p className="bch-note">
          {q.trim()
            ? `Tidak ada hasil untuk “${q.trim()}”. Coba kata lain atau hapus saringan.`
            : "Tidak ada kata untuk saringan ini."}
        </p>
      )}

      {[...perHuruf.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([h, isi]) => (
          <section key={h} id={`huruf-${h}`} className="bud-kelompok-huruf">
            <h2>{h}</h2>
            <div>
              {isi.map((k) => (
                <Entri key={k.id} k={k} />
              ))}
            </div>
          </section>
        ))}
    </>
  );
}
