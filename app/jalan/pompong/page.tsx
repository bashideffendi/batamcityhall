import type { Metadata } from "next";
import Link from "next/link";
import { BARIS_POMPONG, PELANTAR_KOSONG, POMPONG_TANPA_ASAL } from "@/features/jalan/feri-data";
import { kapital } from "@/features/jalan/feri-terakhir";
import JalanNav from "@/features/jalan/JalanNav";

export const metadata: Metadata = {
  title: "Pompong",
  description: "Perahu kayu bermesin ke pulau sekitar Batam, tarifnya ditentukan pemilik dan dapat ditawar.",
};

const utama = BARIS_POMPONG.find((b) => b.tegas);
const lain = BARIS_POMPONG.filter((b) => !b.tegas);

const BELUM = "Belum tercatat";
const isi = (t: string | null) => (t ? kapital(t) : BELUM);

export default function Pompong() {
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">Transportasi</p>
      <h1 className="mt-2">Pompong</h1>
      <p className="bch-lede">
        Perahu kayu bermesin ke pulau sekitar Batam, tarifnya ditentukan pemilik dan dapat ditawar.
      </p>
      <JalanNav aktif="/jalan/pompong" />

      <p className="bch-note mt-5">Tarif dapat berubah. Tanyakan kepada pengemudi perahu sebelum berangkat.</p>
      <p className="mt-3">
        <Link href="/koreksi" prefetch={false} className="bch-btn" data-variant="ghost">
          Kirim koreksi
        </Link>
      </p>

      {utama && (
        <>
          <h2 className="mt-7 mb-3">Sekupang ke Belakang Padang</h2>
          <dl className="bch-daftar" data-rute={utama.id}>
            <dt>Dari</dt>
            <dd>{utama.dari}</dd>
            <dt>Jadwal</dt>
            <dd>{utama.jam}</dd>
            <dt>Tarif</dt>
            <dd>
              <span className="bch-data">{utama.tarif}</span>
            </dd>
            <dt>Lama perjalanan</dt>
            <dd className="bch-data">{utama.durasi}</dd>
            <dt>Catatan</dt>
            <dd>{utama.catatan}</dd>
          </dl>
        </>
      )}

      <h2 className="mt-7 mb-3">Rute Lain</h2>
      <div className="bch-table-wrap">
        <table className="bch-table bch-tabel-tumpuk jl-tabel-pompong">
          <thead>
            <tr>
              <th scope="col">Dari</th>
              <th scope="col">Tujuan</th>
              <th scope="col">Jadwal</th>
              <th scope="col">Tarif</th>
              <th scope="col">Lama perjalanan</th>
            </tr>
          </thead>
          <tbody>
            {lain.map((b) => (
              <tr key={b.id} data-rute={b.id}>
                <td data-label="Dari">
                  {b.dari}
                  {b.kecamatan && <span className="jl-catatan-kecil jl-blok">{b.kecamatan}</span>}
                </td>
                <td data-label="Tujuan">{kapital(b.tujuan)}</td>
                <td data-label="Jadwal">{isi(b.jam)}</td>
                <td data-label="Tarif">
                  {isi(b.tarif)}
                  {b.catatan && <span className="jl-catatan-kecil jl-blok">{b.catatan}</span>}
                </td>
                <td data-label="Lama perjalanan">{isi(b.durasi)}</td>
              </tr>
            ))}
            {POMPONG_TANPA_ASAL.map((b) => (
              <tr key={b.tujuan}>
                <td data-label="Dari">{BELUM}</td>
                <td data-label="Tujuan">{b.tujuan}</td>
                <td data-label="Jadwal">Sekali sehari</td>
                <td data-label="Tarif">{b.keterangan}</td>
                <td data-label="Lama perjalanan">{BELUM}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {PELANTAR_KOSONG.length > 0 && (
        <>
          <h2 className="mt-7 mb-3">Pelantar Lain</h2>
          <p>Tujuan, jadwal, dan tarifnya belum tercatat.</p>
          <ul className="jl-daftar-rapat">
            {PELANTAR_KOSONG.map((p) => (
              <li key={p.id}>
                {p.nama}
                {p.kecamatan ? `, ${p.kecamatan}` : ""}
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="mt-6">
        Sebelum naik, baca{" "}
        <Link href="/jalan/feri/panduan#pompong" prefetch={false}>
          Keselamatan di Pompong
        </Link>
        .
      </p>
    </div>
  );
}
