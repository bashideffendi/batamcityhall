import type { Metadata } from "next";
import Link from "next/link";
import { BARIS_POMPONG, PELANTAR_KOSONG, POMPONG_TANPA_ASAL } from "@/features/jalan/feri-data";
import JalanNav from "@/features/jalan/JalanNav";

export const metadata: Metadata = {
  title: "Pompong",
  description: "Rute pompong dan pancung ke pulau sekitar Batam. Tarif swadaya, bukan tarif resmi, dan mungkin usang.",
};

const utama = BARIS_POMPONG.find((b) => b.tegas);
const lain = BARIS_POMPONG.filter((b) => !b.tegas);

export default function Pompong() {
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">Loket 04 · Jalan-jalan</p>
      <h1 className="mt-2">Pompong</h1>
      <p className="bch-lede">Rute rakyat ke pulau. Bayarnya ke tekong, bukan ke loket.</p>
      <JalanNav aktif="/jalan/pompong" />

      <p className="bch-note mt-5" data-tone="caution">
        Tarif swadaya, bukan tarif resmi; mungkin usang. Dishub hanya mengetahui kesepakatan tarif. Data pompong
        sebagian besar dari berita dan blog 2014 sampai 2022. Untuk pulau lain, tarif dinegosiasikan langsung dengan
        tekong.
      </p>
      <p className="mt-3">
        <Link href="/koreksi" prefetch={false} className="bch-btn" data-variant="ghost">
          Laporkan tarif terbaru
        </Link>
      </p>

      {utama && (
        <>
          <h2 className="mt-7 mb-3">Sekupang ke Belakang Padang</h2>
          <dl className="bch-daftar" data-rute={utama.id}>
            <dt>Dari</dt>
            <dd>{utama.dari}</dd>
            <dt>Jam</dt>
            <dd>{utama.jam}</dd>
            <dt>Tarif</dt>
            <dd>
              <span className="bch-data">{utama.tarif}</span>{" "}
              {utama.status && (
                <span className="bch-badge" data-tone={utama.status.nada}>
                  {utama.status.teks}
                </span>
              )}
            </dd>
            <dt>Durasi</dt>
            <dd className="bch-data">{utama.durasi}</dd>
            <dt>Catatan</dt>
            <dd>{utama.catatan} Tarif sejak September 2022.</dd>
            <dt>Tautan</dt>
            <dd>
              <a href="https://kpompong.com/" target="_blank" rel="noopener" className="jl-tautan-resmi">
                KPompong
              </a>
            </dd>
          </dl>
        </>
      )}

      <h2 className="mt-7 mb-3">Rute rakyat, tarif nego</h2>
      <div className="bch-table-wrap">
        <table className="bch-table bch-tabel-tumpuk jl-tabel-pompong">
          <thead>
            <tr>
              <th scope="col">Dari</th>
              <th scope="col">Tujuan</th>
              <th scope="col">Jadwal</th>
              <th scope="col">Tarif, tahun bila diketahui</th>
              <th scope="col">Durasi</th>
              <th scope="col">Status data</th>
            </tr>
          </thead>
          <tbody>
            {lain.map((b) => (
              <tr key={b.id} data-rute={b.id}>
                <td data-label="Dari">
                  {b.dari}
                  {b.kecamatan && <span className="jl-catatan-kecil jl-blok">{b.kecamatan}</span>}
                </td>
                <td data-label="Tujuan">{b.tujuan}</td>
                <td data-label="Jadwal">{b.jam ?? "jadwal belum tersedia"}</td>
                <td data-label="Tarif">
                  {b.tarif ?? "belum diketahui"}
                  {b.catatan && <span className="jl-catatan-kecil jl-blok">{b.catatan}</span>}
                </td>
                <td data-label="Durasi">{b.durasi ?? "belum diketahui"}</td>
                <td data-label="Status data">
                  {b.status ? (
                    <span className="bch-badge" data-tone={b.status.nada}>
                      {b.status.teks}
                    </span>
                  ) : (
                    "belum dinilai"
                  )}
                </td>
              </tr>
            ))}
            {POMPONG_TANPA_ASAL.map((b) => (
              <tr key={b.tujuan}>
                <td data-label="Dari">titik asal tidak disebut</td>
                <td data-label="Tujuan">{b.tujuan}</td>
                <td data-label="Jadwal">sekali sehari</td>
                <td data-label="Tarif">{b.keterangan}</td>
                <td data-label="Durasi">belum diketahui</td>
                <td data-label="Status data">
                  <span className="bch-badge" data-tone="caution">
                    mungkin usang
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {PELANTAR_KOSONG.length > 0 && (
        <>
          <h2 className="mt-7 mb-3">Pelantar yang datanya masih kosong</h2>
          <p>Tercatat ada, tetapi tujuan, jam, dan tarifnya belum diketahui.</p>
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
          keselamatan di pompong
        </Link>
        . Nomor tekong pribadi tidak kami tampilkan.
      </p>
    </div>
  );
}
