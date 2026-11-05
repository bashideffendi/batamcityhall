"use client";

import { useState } from "react";
import type { EchoSummary, ForecastResponse, PerairanResponse } from "@/features/langit-laut/lib/api-types";
import type { RainScope } from "@/features/langit-laut/lib/kecamatan";
import { kecTable, perairanDetail, type ForecastStripView } from "@/features/langit-laut/lib/status";

/** Hujan per Kecamatan: yang hujan lebih dulu, sisanya diringkas (PEDOMAN 3.3). */
export function HujanPerKecamatan({ echo, scope }: { echo: EchoSummary | null; scope: RainScope }) {
  const [semua, setSemua] = useState(false);
  const rows = kecTable(echo, scope).flatMap((g) => g.rows);
  const hujan = rows.filter((r) => r.level);
  const kering = rows.filter((r) => !r.level);
  const tampil = semua ? rows : hujan;
  if (!rows.length) {
    return (
      <section className="cu-kecamatan">
        <h2 className="cu-sub">Hujan per Kecamatan</h2>
        <p className="cu-catatan">Deteksi hujan otomatis sedang gangguan. Lihat warna di peta.</p>
      </section>
    );
  }
  return (
    <section className="cu-kecamatan" aria-labelledby="cu-kecamatan-judul">
      <h2 id="cu-kecamatan-judul" className="cu-sub">
        Hujan per Kecamatan
      </h2>
      {tampil.length > 0 && (
        <ul className="bch-daftar-polos cu-kec-baris">
          {tampil.map((r) => (
            <li key={r.code} data-hujan={r.level ? "" : undefined}>
              <span>{r.name}</span>
              <b>{r.text}</b>
            </li>
          ))}
        </ul>
      )}
      {!semua && kering.length > 0 && (
        <p className="cu-catatan">
          Tidak hujan di {kering.length} kecamatan {hujan.length ? "lain" : ""}.{" "}
          <button type="button" className="bch-tautan-tombol" onClick={() => setSemua(true)}>
            Lihat semua
          </button>
        </p>
      )}
    </section>
  );
}

/** Prakiraan Cuaca Batam Kota. */
export function PrakiraanCuaca({ fc, tiles }: { fc: ForecastResponse | null; tiles: ForecastStripView }) {
  return (
    <section aria-labelledby="cu-prakiraan">
      <h2 id="cu-prakiraan">Prakiraan Cuaca Batam Kota</h2>
      {tiles.slots.length > 0 ? (
        <table className="bch-table">
          <thead>
            <tr>
              <th scope="col">Pukul (WIB)</th>
              <th scope="col">Cuaca</th>
              <th scope="col" className="cu-kanan">
                Suhu
              </th>
            </tr>
          </thead>
          <tbody>
            {tiles.slots.map((s) => (
              <tr key={s.time}>
                <td className="bch-data">{s.time}</td>
                <td>{s.desc}</td>
                <td className="bch-data cu-kanan">{s.t !== null ? `${s.t} °C` : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>{tiles.note ?? (fc ? "Prakiraan cuaca belum diperbarui." : "Memuat data")}</p>
      )}
      {tiles.hasHaze && <p className="cu-catatan">Udara kabur berarti jarak pandang berkurang oleh asap, debu, atau uap air.</p>}
    </section>
  );
}

/** Prakiraan Perairan Batam. */
export function PerairanInfo({ p, error, now }: { p: PerairanResponse | null; error: boolean; now: number }) {
  const rows = perairanDetail(p, now);
  return (
    <section aria-labelledby="cu-perairan">
      <h2 id="cu-perairan">Prakiraan Perairan Batam</h2>
      {rows.length ? (
        <dl className="bch-tabel-info cu-tabel-rapat">
          {rows.map((r) => (
            <div key={r.k}>
              <dt>{r.k}</dt>
              <dd>{r.v}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p>{error || p ? "Prakiraan teks perairan belum tersedia. Warna di peta tetap dari model gelombang." : "Memuat data"}</p>
      )}
    </section>
  );
}
