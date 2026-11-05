import type { Metadata } from "next";
import Link from "next/link";
import { GARIS_WAKTU, LABEL_KATEGORI, LABEL_METODE, PENDUDUK, WISMAN } from "@/features/sejarah/data";
import { KARTU_DULU } from "@/features/sejarah/dulu";
import EsaiGulir from "@/features/sejarah/EsaiGulir";
import { ESAI } from "@/features/sejarah/esai";
import GarisWaktu from "@/features/sejarah/GarisWaktu";
import { GrafikPenduduk, GrafikWisman } from "@/features/sejarah/Grafik";
import { bacaanLanjutan, namaTempat, versiNama } from "@/features/sejarah/md";
import { LencanaStatus, TeksMiring } from "@/features/sejarah/Status";
import type { KunciStatus } from "@/features/sejarah/data";
import "@/features/sejarah/sejarah.css";

const LEDE =
  "Halaman ini menelusuri perjalanan Batam dari pulau di pesisir Selat Singapura menjadi kota berpenduduk lebih dari satu juta jiwa. Peristiwa yang versinya berbeda antarsumber diberi tanda.";

export const metadata: Metadata = {
  title: "Sejarah Batam",
  description: LEDE,
};

const LEGENDA: KunciStatus[] = ["terverifikasi", "perbedaan_versi", "belum_terverifikasi", "cerita_rakyat"];
const ARTI: Record<KunciStatus, string> = {
  terverifikasi: "ada catatan tertulisnya",
  perbedaan_versi: "catatan yang ada saling berbeda",
  belum_terverifikasi: "belum ada catatan asli yang mendukung",
  cerita_rakyat: "tradisi lisan, bukan catatan",
};

const BAGIAN = [
  { href: "#esai", label: "Dua poros" },
  { href: "#garis-waktu", label: "Garis waktu" },
  { href: "#asal-nama", label: "Asal nama" },
  { href: "#perubahan-fisik", label: "Perubahan fisik" },
  { href: "#penduduk", label: "Penduduk" },
  { href: "#wisman", label: "Wisman" },
  { href: "#bacaan", label: "Bacaan" },
];

export default function Sejarah() {
  const versi = versiNama();
  const tempat = namaTempat();
  const bacaan = bacaanLanjutan();
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">
        <Link href="/cerita" prefetch={false}>
          LOKET 05
        </Link>
      </p>
      <h1 className="mt-2">Sejarah Batam</h1>
      <p className="bch-lede">{LEDE}</p>

      <ul className="sj-legenda" aria-label="Arti label">
        {LEGENDA.map((s) => (
          <li key={s}>
            <LencanaStatus status={s} /> <span className="sj-kecil">{ARTI[s]}</span>
          </li>
        ))}
      </ul>
      <nav aria-label="Bagian halaman" className="bch-sub-nav">
        {BAGIAN.map((b) => (
          <a key={b.href} href={b.href}>
            {b.label}
          </a>
        ))}
      </nav>

      <section id="esai" className="sj-jangkar mt-7" aria-labelledby="judul-esai">
        <h2 id="judul-esai" className="mb-4">
          Dua Poros
        </h2>
        <EsaiGulir langkah={ESAI} judul={Object.fromEntries(GARIS_WAKTU.map((e) => [e.id, e.judul]))} />
      </section>

      <section id="garis-waktu" className="sj-jangkar mt-8" aria-labelledby="judul-garis">
        <h2 id="judul-garis" className="mb-2">
          Garis Waktu
        </h2>
        <p className="bch-measure mt-0">Bagian ini memuat {GARIS_WAKTU.length} peristiwa, diurutkan menurut tahun.</p>
        <GarisWaktu entri={GARIS_WAKTU} kategori={LABEL_KATEGORI} />
      </section>

      <section id="asal-nama" className="sj-jangkar mt-8" aria-labelledby="judul-nama">
        <h2 id="judul-nama" className="mb-2">
          Asal Nama Batam
        </h2>
        <p className="bch-lede mt-0">Belum ada etimologi yang terbukti.</p>
        <p className="bch-measure">
          BPNB Kepri menulis: “belum ada data yang valid yang jadi argumen pemberian nama Batam”. Karena itu,{" "}
          {versi.length} versi di bawah ditulis berdampingan.
        </p>
        <ul className="sj-versi" data-versi-nama={versi.length}>
          {versi.map((v) => (
            <li key={v.versi} className="bch-card">
              <h3>{v.versi}</h3>
              <p className="mt-1 mb-2">
                <TeksMiring isi={v.isi} />
              </p>
              <div className="bch-badges">
                <LencanaStatus status={v.status} />
              </div>
              <p className="sj-sumber">
                Asal: <TeksMiring isi={v.asal} />
              </p>
            </li>
          ))}
        </ul>

        <h3 className="mt-6 mb-2">Nama Tempat</h3>
        <ul className="sj-versi" data-nama-tempat={tempat.length}>
          {tempat.map((t) => (
            <li key={t.nama} className="bch-card">
              <h4>{t.nama}</h4>
              <p className="mt-1 mb-2">
                <TeksMiring isi={t.isi} />
              </p>
              <div className="bch-badges">
                <LencanaStatus status={t.status} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="perubahan-fisik" className="sj-jangkar mt-8" aria-labelledby="judul-fisik">
        <h2 id="judul-fisik" className="mb-2">
          Perubahan Fisik Kota
        </h2>
        <p className="bch-measure mt-0">
          Tabel ini memuat {KARTU_DULU.length} lokasi yang berubah sejak Batam dibangun.
        </p>
        <div className="bch-table-wrap">
          <table className="bch-table bch-tabel-tumpuk sj-tabel">
            <thead>
              <tr>
                <th scope="col">Lokasi</th>
                <th scope="col">Tahun</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {KARTU_DULU.map((k) => (
                <tr key={k.id}>
                  <td data-label="Lokasi">{k.lokasi}</td>
                  <td data-label="Tahun">{k.tahunKunci}</td>
                  <td data-label="Status">
                    <LencanaStatus status={k.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="penduduk" className="sj-jangkar mt-8" aria-labelledby="judul-penduduk">
        <h2 id="judul-penduduk" className="mb-2">
          Penduduk, dari Sekitar 6.000 Jiwa
        </h2>
        <p className="bch-measure mt-0">Setiap metode punya garis sendiri karena yang dihitung memang berbeda.</p>
        <GrafikPenduduk data={PENDUDUK} />
        <div className="bch-table-wrap mt-4">
          <table className="bch-table bch-tabel-tumpuk sj-tabel" data-tabel-penduduk>
            <caption className="sj-kecil text-left">Semua titik data penduduk</caption>
            <thead>
              <tr>
                <th scope="col">Periode</th>
                <th scope="col">Jiwa</th>
                <th scope="col">Metode</th>
              </tr>
            </thead>
            <tbody>
              {PENDUDUK.map((p) => (
                <tr key={p.kunci} data-metode={p.metode}>
                  <td data-label="Periode">{p.periode}</td>
                  <td data-label="Jiwa" className="sj-sel-angka">
                    {p.jumlahTeks}
                  </td>
                  <td data-label="Metode">
                    {LABEL_METODE[p.metode]}
                    {p.catatan && <span className="bch-sel-kecil">{p.catatan}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="wisman" className="sj-jangkar mt-8" aria-labelledby="judul-wisman">
        <h2 id="judul-wisman" className="mb-2">
          Wisatawan Mancanegara
        </h2>
        <p className="bch-measure mt-0">
          BPS Kota Batam mencatat kunjungan berikut. Angka lain ada di{" "}
          <Link href="/cerita/angka" prefetch={false}>
            Batam dalam Angka
          </Link>
          .
        </p>
        <GrafikWisman data={WISMAN} />
        <div className="bch-table-wrap mt-4">
          <table className="bch-table bch-tabel-tumpuk sj-tabel" data-tabel-wisman>
            <caption className="sj-kecil text-left">Semua titik data wisman</caption>
            <thead>
              <tr>
                <th scope="col">Tahun</th>
                <th scope="col">Kunjungan</th>
              </tr>
            </thead>
            <tbody>
              {WISMAN.map((w) => (
                <tr key={w.tahun}>
                  <td data-label="Tahun">{w.tahun}</td>
                  <td data-label="Kunjungan" className="sj-sel-angka">
                    {w.teks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="bacaan" className="sj-jangkar mt-8" aria-labelledby="judul-bacaan">
        <h2 id="judul-bacaan" className="mb-2">
          Bacaan Lanjutan
        </h2>
        <ul className="sj-linimasa" data-bacaan={bacaan.length}>
          {bacaan.map((b) => (
            <li key={b.url}>
              <TeksMiring isi={b.judul} />
              <span className="bch-sel-kecil">
                <TeksMiring isi={b.penulis} />
              </span>
              <p className="mt-1 mb-0">{b.isi}</p>
            </li>
          ))}
        </ul>
        <p className="sj-kecil mt-4">Halaman ini terakhir diperbarui 5 November 2026.</p>
      </section>
    </div>
  );
}
