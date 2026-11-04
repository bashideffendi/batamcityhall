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

export const metadata: Metadata = {
  title: "Sejarah Batam",
  description:
    "Garis waktu Batam dari Bulang, mandat Nong Isa 1829, sampai kota hari ini. Semua entri berlabel dan bersumber.",
};

const LEGENDA: KunciStatus[] = ["terverifikasi", "perbedaan_versi", "belum_terverifikasi", "cerita_rakyat"];
const ARTI: Record<string, string> = {
  terverifikasi: "ada sumber yang bisa dicek",
  perbedaan_versi: "sumber berbeda atau dikutip sekunder",
  belum_terverifikasi: "belum ada sumber primer",
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
          Loket 05
        </Link>
      </p>
      <h1 className="mt-2">Sejarah Batam</h1>
      <p className="bch-lede">
        Batam bukan pulau kosong yang tiba-tiba jadi kota. Ada dua poros: pemerintahan lokal sejak 1829, dan proyek
        negara sejak 1969.
      </p>

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
          Dua poros
        </h2>
        <EsaiGulir langkah={ESAI} judul={Object.fromEntries(GARIS_WAKTU.map((e) => [e.id, e.judul]))} />
      </section>

      <section id="garis-waktu" className="sj-jangkar mt-8" aria-labelledby="judul-garis">
        <h2 id="judul-garis" className="mb-2">
          Garis waktu
        </h2>
        <p className="bch-measure mt-0">
          {GARIS_WAKTU.length} entri, urut tahun. Banyak media lokal saling mengutip, jadi kesamaan bunyi tidak kami
          hitung sebagai verifikasi.
        </p>
        <GarisWaktu entri={GARIS_WAKTU} kategori={LABEL_KATEGORI} />
      </section>

      <section id="asal-nama" className="sj-jangkar mt-8" aria-labelledby="judul-nama">
        <h2 id="judul-nama" className="mb-2">
          Asal nama Batam
        </h2>
        <p className="bch-lede mt-0">Belum ada etimologi yang terbukti.</p>
        <p className="bch-measure">
          BPNB Kepri menulis: “belum ada data yang valid yang jadi argumen pemberian nama Batam”. Jadi {versi.length}{" "}
          versi di bawah ditaruh berdampingan.{" "}
          <a
            href="https://kebudayaan.kemdikbud.go.id/bpnbkepri/beragam-versi-asal-usul-nama-batam/"
            rel="noopener noreferrer"
          >
            Baca sumbernya
          </a>
          .
        </p>
        <ul className="sj-versi" data-versi-nama={versi.length}>
          {versi.map((v) => (
            <li key={v.versi} className="bch-card">
              <h3>{v.versi}</h3>
              <p className="mt-1 mb-2">
                <TeksMiring isi={v.isi} />
              </p>
              <div className="bch-badges">
                {v.status.map((s) => (
                  <LencanaStatus key={s} status={s} />
                ))}
              </div>
              <p className="sj-sumber">
                Asal: <TeksMiring isi={v.asal} />
                {v.rincian && `. Rincian status: ${v.rincian}`}
              </p>
            </li>
          ))}
        </ul>

        <h3 className="mt-6 mb-2">Nama tempat</h3>
        <ul className="sj-versi" data-nama-tempat={tempat.length}>
          {tempat.map((t) => (
            <li key={t.nama} className="bch-card">
              <h4>{t.nama}</h4>
              <p className="mt-1 mb-2">
                <TeksMiring isi={t.isi} />
              </p>
              <div className="bch-badges">
                {t.status.map((s) => (
                  <LencanaStatus key={s} status={s} />
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="perubahan-fisik" className="sj-jangkar mt-8" aria-labelledby="judul-fisik">
        <h2 id="judul-fisik" className="mb-2">
          Perubahan fisik kota
        </h2>
        <p className="bch-measure mt-0">
          {KARTU_DULU.length} lokasi. Isi lengkap, slider tahun, dan peta ada di{" "}
          <Link href="/cerita/dulu" prefetch={false}>
            Batam Dulu vs Sekarang
          </Link>
          .
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
                  <td data-label="Lokasi">
                    <Link href={`/cerita/dulu#${k.id}`} prefetch={false}>
                      {k.lokasi}
                    </Link>
                  </td>
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
          Penduduk, dari sekitar 6.000 jiwa
        </h2>
        <p className="bch-measure mt-0">
          Setiap metode punya garisnya sendiri. Angka yang berbeda bukan berarti salah satunya bohong: yang dihitung
          memang berbeda.
        </p>
        <GrafikPenduduk data={PENDUDUK} />
        <div className="bch-table-wrap mt-4">
          <table className="bch-table bch-tabel-tumpuk sj-tabel" data-tabel-penduduk>
            <caption className="sj-kecil text-left">Semua titik data penduduk</caption>
            <thead>
              <tr>
                <th scope="col">Periode</th>
                <th scope="col">Jiwa</th>
                <th scope="col">Metode</th>
                <th scope="col">Sumber</th>
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
                  <td data-label="Sumber">
                    {p.sumber.map((s) => (
                      <a key={s.url} href={s.url} rel="noopener noreferrer">
                        {s.nama}
                      </a>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="wisman" className="sj-jangkar mt-8" aria-labelledby="judul-wisman">
        <h2 id="judul-wisman" className="mb-2">
          Wisatawan mancanegara
        </h2>
        <p className="bch-measure mt-0">
          Data BPS Kota Batam yang dikutip media. Angka lain ada di{" "}
          <Link href="/cerita/angka" prefetch={false}>
            Angka Batam
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
                <th scope="col">Sumber</th>
              </tr>
            </thead>
            <tbody>
              {WISMAN.map((w) => (
                <tr key={w.tahun}>
                  <td data-label="Tahun">{w.tahun}</td>
                  <td data-label="Kunjungan" className="sj-sel-angka">
                    {w.teks}
                  </td>
                  <td data-label="Sumber">
                    {w.sumber.map((s) => (
                      <a key={s.url} href={s.url} rel="noopener noreferrer">
                        {s.nama}
                      </a>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="bacaan" className="sj-jangkar mt-8" aria-labelledby="judul-bacaan">
        <h2 id="judul-bacaan" className="mb-2">
          Bacaan lanjutan
        </h2>
        <ul className="sj-linimasa" data-bacaan={bacaan.length}>
          {bacaan.map((b) => (
            <li key={b.url}>
              <a href={b.url} rel="noopener noreferrer">
                <TeksMiring isi={b.judul} />
              </a>
              <span className="bch-sel-kecil">
                <TeksMiring isi={b.penulis} />
              </span>
              <p className="mt-1 mb-0">{b.isi}</p>
            </li>
          ))}
        </ul>
        <p className="bch-measure sj-kecil mt-4">
          Jurnal kampus lokal (UNRIKA, UMRAH, UIB) dan kajian STPN belum kami jaring. Coba cari di{" "}
          <a href="https://garuda.kemdikbud.go.id" rel="noopener noreferrer">
            Garuda
          </a>{" "}
          dengan kata kunci “sejarah Batam” dan “Otorita Batam”.
        </p>
        <p className="sj-kecil">Halaman ini terakhir diperbarui 5 November 2026.</p>
      </section>
    </div>
  );
}
