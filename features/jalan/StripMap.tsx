"use client";

import { useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import type { ArahStrip } from "./trans-data";

const LOKASI = {
  pasti: "lokasi terverifikasi",
  perkiraan: "lokasi perkiraan",
  belum: "lokasi belum diisi",
};

// Strip map: semua nama halte berurutan, satu tab per arah. Gap tampil sebagai garis putus dan tidak pernah
// disambung. Nomor urut sengaja tidak ditampilkan: setelah gap, angka di data bukan nomor halte yang sebenarnya.
export default function StripMap({ arah, gaya }: { arah: ArahStrip[]; gaya: CSSProperties }) {
  const [aktif, setAktif] = useState(0);
  const dasar = useId();
  const tombol = useRef<(HTMLButtonElement | null)[]>([]);
  const a = arah[aktif];

  const kunci = (e: KeyboardEvent) => {
    let i = aktif;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") i = (aktif + 1) % arah.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") i = (aktif - 1 + arah.length) % arah.length;
    else if (e.key === "Home") i = 0;
    else if (e.key === "End") i = arah.length - 1;
    else return;
    e.preventDefault();
    setAktif(i);
    tombol.current[i]?.focus();
  };

  return (
    <div className="jl-k jl-strip" style={gaya}>
      <div role="tablist" aria-label="Arah" className="jl-tab" onKeyDown={kunci}>
        {arah.map((x, i) => (
          <button
            key={x.id}
            ref={(el) => {
              tombol.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${dasar}-t${i}`}
            aria-selected={i === aktif}
            aria-controls={`${dasar}-p`}
            tabIndex={i === aktif ? 0 : -1}
            onClick={() => setAktif(i)}
          >
            {x.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${dasar}-p`} aria-labelledby={`${dasar}-t${aktif}`} tabIndex={0}>
        <p className="bch-card-meta jl-strip-sumber">
          {a.tercantum} Sumber: {a.sumber}.
          {a.perluCek && (
            <>
              {" "}
              <span className="bch-badge" data-tone="caution">
                perlu cek ulang
              </span>
            </>
          )}
        </p>
        {a.catatan && <p className="jl-strip-catatan">{a.catatan}</p>}
        <ol className="jl-strip-daftar" data-arah={a.id}>
          {a.baris.map((b) =>
            b.jenis === "gap" ? (
              <li key={b.kunci} className="jl-strip-gap" data-gap="">
                <span className="jl-strip-nama">{b.label}</span>
              </li>
            ) : (
              <li key={b.kunci} className="jl-strip-halte" data-ujung={b.ujung ? "" : undefined}>
                <span className="jl-strip-nama">
                  {b.nama}
                  {b.transit.length > 0 && <span className="jl-strip-transit"> pindah ke {b.transit.join(", ")}</span>}
                </span>
                <span className="jl-strip-meta">
                  {LOKASI[b.lokasi]}
                  {b.catatan ? `. ${b.catatan}` : ""}
                </span>
              </li>
            ),
          )}
        </ol>
      </div>
    </div>
  );
}
