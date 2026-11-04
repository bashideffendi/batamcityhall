"use client";

import { useId, useMemo, useState } from "react";
import type { PinPeta } from "./lapisan";

const MAKS = 6;

const norma = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

/** Murni supaya bisa dites: cocok di nama, lokasi, atau tempat lain di titik yang sama. */
export function cariPin(pins: PinPeta[], q: string): PinPeta[] {
  const n = norma(q);
  if (n.length < 2) return [];
  return pins
    .filter((p) => [p.nama, p.lokasi, ...p.lain.map((l) => l.nama)].some((t) => norma(t).includes(n)))
    .sort((a, b) => Number(norma(b.nama).startsWith(n)) - Number(norma(a.nama).startsWith(n)))
    .slice(0, MAKS);
}

export type PesanLokasi = { teks: string } | null;

// Pencarian tempat dan "Di sekitarku". Posisi hanya dipakai di browser ini, tidak dikirim ke mana pun.
export default function CariPeta({
  pins,
  onPilih,
  onSekitar,
  pesan,
}: {
  pins: PinPeta[];
  onPilih: (p: PinPeta) => void;
  onSekitar: () => void;
  pesan: PesanLokasi;
}) {
  const [q, setQ] = useState("");
  const idHasil = useId();
  const hasil = useMemo(() => cariPin(pins, q), [pins, q]);
  return (
    <div className="peta-cari">
      <label className="bch-field">
        Cari tempat di peta
        <input
          className="bch-input"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Nama tempat atau kecamatan"
          aria-controls={idHasil}
        />
      </label>
      <button type="button" className="bch-btn" data-variant="ghost" onClick={onSekitar}>
        Di sekitarku
      </button>
      {pesan && (
        <p className="peta-cari-pesan" role="status">
          {pesan.teks}
        </p>
      )}
      <ul id={idHasil} className="peta-cari-hasil">
        {hasil.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => {
                onPilih(p);
                setQ("");
              }}
            >
              {p.nama} <span>{p.lokasi}</span>
            </button>
          </li>
        ))}
        {q.trim().length >= 2 && hasil.length === 0 && (
          <li className="peta-cari-kosong">Tidak ada di peta. Mungkin belum punya koordinat: cek di Direktori.</li>
        )}
      </ul>
    </div>
  );
}
