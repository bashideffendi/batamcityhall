"use client";

import { useState } from "react";
import { jamWib, useBerita, waktuLengkap } from "./klien";

export default function DaftarBerita() {
  const keadaan = useBerita();
  const [pilihan, setPilihan] = useState("");

  if (keadaan.fase === "memuat") return <p className="bch-berita-pesan">Memuat data</p>;
  if (keadaan.fase === "gagal") {
    return (
      <p className="bch-note" data-tone="caution" role="status">
        Data tidak dapat dimuat. Coba muat ulang.
      </p>
    );
  }

  const { item, sumber, diperbarui } = keadaan.data;
  const tampil = pilihan ? item.filter((b) => b.sumberId === pilihan) : item;

  return (
    <>
      <div className="bch-berita-saring">
        <label className="bch-field">
          Media
          <select className="bch-select" value={pilihan} onChange={(e) => setPilihan(e.target.value)}>
            <option value="">Semua Media</option>
            {sumber
              .filter((s) => s.jumlah > 0)
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nama}
                </option>
              ))}
          </select>
        </label>
        <p className="bch-berita-meta" role="status" data-jumlah={tampil.length}>
          {tampil.length} judul · Diperbarui pukul {jamWib(diperbarui)} WIB
        </p>
      </div>

      {!tampil.length && <p className="bch-note">Belum ada berita baru hari ini.</p>}

      {tampil.length > 0 && (
        <section className="bch-berita-hari" aria-label="Daftar berita">
          <ol className="bch-berita-daftar">
            {tampil.map((b) => (
              <li key={b.tautan} data-sumber={b.sumberId}>
                <a href={b.tautan} target="_blank" rel="noopener noreferrer">
                  {b.judul}
                </a>
                <span className="bch-berita-meta">
                  {b.sumber}
                  {b.waktu && ` · ${waktuLengkap(b.waktu)}`}
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}
