"use client";

import { useState } from "react";
import { hariWib, jamWib, useBerita, waktuWib } from "./klien";
import type { BeritaItem, StatusSumber } from "./sumber";

const TANPA_WAKTU = "Waktu tidak terbaca";

function kelompokHari(item: BeritaItem[]) {
  const grup: { hari: string; isi: BeritaItem[] }[] = [];
  for (const b of item) {
    const hari = b.waktu ? hariWib(b.waktu) : TANPA_WAKTU;
    const akhir = grup[grup.length - 1];
    if (akhir?.hari === hari) akhir.isi.push(b);
    else grup.push({ hari, isi: [b] });
  }
  return grup;
}

function keteranganStatus(s: StatusSumber): string {
  const kapan = s.terakhirBerhasil ? waktuWib(s.terakhirBerhasil) : null;
  if (s.status === "gagal") {
    if (!kapan) return "Belum ada pengambilan yang berhasil tercatat.";
    return s.jumlah
      ? `Terakhir berhasil ${kapan}. Judul yang tampil dari saat itu.`
      : `Terakhir berhasil ${kapan}. Tidak ada judul yang bisa ditampilkan.`;
  }
  if (s.status === "kosong") return `Terakhir berhasil ${kapan}. Feed-nya terbaca, tapi tidak ada judul.`;
  return `Terakhir berhasil ${kapan}.`;
}

const LABEL_STATUS = {
  ok: { teks: "Berhasil", tone: "ok" },
  kosong: { teks: "Kosong", tone: "caution" },
  gagal: { teks: "Gagal dimuat", tone: "danger" },
} as const;

function TabelStatus({ sumber }: { sumber: StatusSumber[] }) {
  return (
    <div className="bch-table-wrap">
      <table className="bch-table bch-tabel-tumpuk" role="table">
        <thead>
          <tr>
            <th scope="col">Sumber</th>
            <th scope="col">Status</th>
            <th scope="col">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          {sumber.map((s) => {
            const l = LABEL_STATUS[s.status];
            return (
              <tr key={s.id} role="row" data-sumber={s.id}>
                <td role="cell" data-label="Sumber">
                  <a href={s.situs} target="_blank" rel="noopener noreferrer">
                    {s.nama}
                  </a>
                </td>
                <td role="cell" data-label="Status">
                  <span className="bch-badge" data-tone={l.tone}>
                    {l.teks}
                  </span>
                </td>
                <td role="cell" data-label="Keterangan">
                  {keteranganStatus(s)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function DaftarBerita() {
  const keadaan = useBerita();
  const [pilihan, setPilihan] = useState("");

  if (keadaan.fase === "memuat") return <p className="bch-berita-pesan">Memuat judul…</p>;
  if (keadaan.fase === "gagal") {
    return (
      <p className="bch-note" data-tone="caution" role="status">
        Daftar berita gagal dimuat. Coba muat ulang halaman ini sebentar lagi.
      </p>
    );
  }

  const { item, sumber, diperbarui } = keadaan.data;
  const tampil = pilihan ? item.filter((b) => b.sumberId === pilihan) : item;
  const namaPilihan = sumber.find((s) => s.id === pilihan)?.nama;

  return (
    <>
      <div className="bch-berita-saring">
        <label className="bch-field">
          Sumber
          <select className="bch-select" value={pilihan} onChange={(e) => setPilihan(e.target.value)}>
            <option value="">Semua sumber ({item.length})</option>
            {sumber.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nama} ({s.jumlah})
              </option>
            ))}
          </select>
        </label>
        <p className="bch-berita-meta" role="status" data-jumlah={tampil.length}>
          {tampil.length} judul. Diambil {waktuWib(diperbarui)}.
        </p>
      </div>

      {!tampil.length && (
        <p className="bch-note" data-tone="caution">
          {namaPilihan
            ? `Belum ada judul dari ${namaPilihan}. Lihat statusnya di bawah.`
            : "Belum ada judul yang bisa ditampilkan. Lihat status tiap sumber di bawah."}
        </p>
      )}

      {kelompokHari(tampil).map((g) => (
        <section key={g.hari} className="bch-berita-hari">
          <h2>{g.hari}</h2>
          <ol className="bch-berita-daftar">
            {g.isi.map((b) => (
              <li key={b.tautan} data-sumber={b.sumberId}>
                <a href={b.tautan} target="_blank" rel="noopener noreferrer">
                  {b.judul}
                </a>
                <span className="bch-berita-meta">
                  {b.sumber} · {b.waktu ? jamWib(b.waktu) : TANPA_WAKTU}
                </span>
              </li>
            ))}
          </ol>
        </section>
      ))}

      <section className="bch-berita-hari">
        <h2>Status sumber</h2>
        <p className="bch-berita-meta">
          &quot;Terakhir berhasil&quot; adalah catatan server sejak terakhir dinyalakan, jadi bisa kosong walau feed-nya
          sehat kemarin.
        </p>
        <TabelStatus sumber={sumber} />
      </section>
    </>
  );
}
