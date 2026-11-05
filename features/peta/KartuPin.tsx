"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { PinPeta } from "./lapisan";

// Kartu label museum saat pin diklik: panel samping di layar lebar, bottom sheet di HP.
export default function KartuPin({ pin, onTutup }: { pin: PinPeta; onTutup: () => void }) {
  const tutup = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Dibuka lewat tautan (fokus masih di body): jangan rebut fokus saat halaman baru dimuat.
    if (document.activeElement !== document.body) tutup.current?.focus({ preventScroll: true });
  }, [pin.id]);

  return (
    <aside
      className="peta-kartu"
      aria-label={`Kartu ${pin.nama}`}
      onKeyDown={(e) => {
        if (e.key === "Escape") onTutup();
      }}
    >
      <div className="bch-kicker-row bch-kicker">
        <span>{pin.sl}</span>
        <button ref={tutup} type="button" className="peta-kartu-tutup" aria-label="Tutup kartu" onClick={onTutup}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
      <h2>{pin.nama}</h2>
      <p className="bch-card-loc">{pin.lokasi}</p>
      <hr className="bch-card-rule" />
      <div className="bch-rebung-mini" aria-hidden="true" />
      {pin.alamat && <p className="m-0">{pin.alamat}</p>}
      {pin.jam && <p className="bch-card-meta mt-2 mb-0">BUKA {pin.jam}</p>}
      {pin.lencana.length > 0 && (
        <div className="bch-badges mt-2">
          {pin.lencana.map((l) => (
            <span key={l.teks} className="bch-badge" data-tone={l.nada}>
              {l.teks}
            </span>
          ))}
        </div>
      )}
      {pin.lain.length > 0 && (
        <>
          <p className="mt-3 mb-1">Di titik yang sama:</p>
          <ul className="peta-kartu-lain">
            {pin.lain.map((l) => (
              <li key={l.id}>
                <Link href={`/info/tempat/${l.id}`} prefetch={false}>
                  {l.nama}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
      <p className="mt-3 mb-0">
        <Link href={`/info/tempat/${pin.id}`} prefetch={false}>
          Buka Kartu Lengkap
        </Link>
      </p>
    </aside>
  );
}
