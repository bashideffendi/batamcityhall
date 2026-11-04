"use client";

import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import type { KartuMural } from "./data";

type Props = {
  kartu: KartuMural | null;
  catatanQuest: string | null;
  onTutup: () => void;
};

/**
 * Kartu museum di <dialog> asli: fokus terkunci dan Esc menutup dari peramban sendiri. Saat tutup, fokus dikembalikan
 * ke elemen pembuka (tombol daftar atau kanvas mural).
 */
export default function KartuMuseum({ kartu, catatanQuest, onTutup }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const pembuka = useRef<HTMLElement | null>(null);
  const idJudul = useId();
  const terbuka = !!kartu;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (terbuka && !d.open) {
      pembuka.current = document.activeElement as HTMLElement | null;
      d.showModal();
    } else if (!terbuka && d.open) {
      d.close();
    }
    if (!terbuka && pembuka.current) {
      pembuka.current.focus?.();
      pembuka.current = null;
    }
  }, [terbuka]);

  return (
    <dialog
      ref={ref}
      className="mural-kartu"
      aria-labelledby={idJudul}
      onClose={onTutup}
      onClick={(e) => {
        // Klik di latar (di luar kotak isi) menutup kartu.
        if (e.target === e.currentTarget) onTutup();
      }}
    >
      {kartu && (
        <article className="mural-kartu-isi bch-kartu-museum">
          <div className="mural-kartu-atas">
            <p className="bch-kicker m-0">{kartu.kicker}</p>
            <button type="button" className="bch-btn mural-tutup" onClick={onTutup}>
              Tutup
            </button>
          </div>
          <h2 id={idJudul} className="mural-kartu-judul">
            {kartu.judul}
          </h2>
          <p className="bch-card-loc">
            {kartu.nama}. {kartu.lokasi}
          </p>
          <hr className="bch-card-rule" />
          <div className="bch-rebung-mini" aria-hidden="true" />
          {kartu.isi.map((p) => (
            <p key={p}>{p}</p>
          ))}
          {kartu.fakta.length > 0 && (
            <dl className="bch-kartu-fakta">
              {kartu.fakta.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.nilai}</dd>
                </div>
              ))}
            </dl>
          )}
          {kartu.lencana.length > 0 && (
            <div className="bch-badges">
              {kartu.lencana.map((l) => (
                <span key={l.teks} className="bch-badge" data-tone={l.nada}>
                  {l.teks}
                </span>
              ))}
            </div>
          )}
          {catatanQuest && (
            <p className="bch-note mural-kartu-quest" data-catatan-quest>
              {catatanQuest}
            </p>
          )}
          <p className="bch-sel-kecil">Ilustrasi placeholder, bukan posisi tepat.</p>
          <p className="bch-sel-kecil">
            Sumber:{" "}
            {kartu.sumberUrl ? (
              <a href={kartu.sumberUrl} rel="noreferrer noopener" target="_blank">
                {kartu.sumberTeks}
              </a>
            ) : (
              kartu.sumberTeks
            )}
            . {kartu.dicek}.
          </p>
          <p className="mural-kartu-tautan">
            {kartu.rujukan && (
              <Link href={kartu.rujukan.href} prefetch={false}>
                {kartu.rujukan.teks}
              </Link>
            )}
            {kartu.bisaDiPeta && kartu.idTempat && (
              <Link href={`/?tempat=${kartu.idTempat}`} prefetch={false}>
                Buka di Mode Peta
              </Link>
            )}
            {kartu.idTempat && (
              <Link href={`/info/tempat/${kartu.idTempat}`} prefetch={false}>
                Lihat di direktori
              </Link>
            )}
          </p>
        </article>
      )}
    </dialog>
  );
}
