import type { Metadata } from "next";
import PembukaHalaman from "@/components/site/PembukaHalaman";
import Link from "next/link";
import { ANGKA_RESMI, KELOMPOK_FAKTA, LINIMASA, LUAS_INVESTASI } from "@/features/sejarah/angka";
import "@/features/sejarah/sejarah.css";

const LEDE = "Angka penting Batam ditulis beserta tahunnya; bila sumber berbeda, semua versi tampil.";

export const metadata: Metadata = {
  title: "Batam dalam Angka",
  description: LEDE,
};

const IDE = [
  {
    angka: "6.000 → 1.394.459",
    judul: "Dari Sekitar 6.000 Jiwa pada 1965",
    isi: "1965 versi BP Batam. Semester II 2025 versi registrasi Disdukcapil. Metodenya berbeda, jadi ini gambaran besar, bukan satu garis.",
    tautan: { href: "/cerita/sejarah#penduduk", teks: "Lihat grafik per metode" },
  },
  {
    angka: "±73%",
    judul: "Hampir 3 dari 4 Bagian Batam Adalah Laut",
    isi: "Perairan 2.791,09 km², daratan 1.038,84 km².",
    bilah: true,
  },
  {
    angka: "±4.400",
    judul: "Wisman Datang Setiap Hari, Rata-Rata 2025",
    isi: "Dihitung dari 1.613.202 ÷ 365. Angka turunan.",
  },
  {
    angka: "789.674",
    judul: "Hampir 1 dari 2 Kunjungan Wisman 2025 dari Singapura",
    isi: "Sekitar 49% dari 1.613.202 kunjungan.",
  },
  {
    angka: "3 angka, 1 kota",
    judul: "Penduduk 2025 Tergantung Siapa yang Menghitung",
    isi: "1.394.459 (Disdukcapil, Semester II). 1.296.960 (BPS, dikutip Wikipedia). 1,79 juta (Databoks, tidak kami pakai). Metodenya berbeda, dan selisihnya belum bisa dijelaskan dengan pasti.",
  },
];

export default function AngkaBatam() {
  return (
    <div className="bch-page">
      <PembukaHalaman judul="Batam dalam Angka" gambar="angka">
        <p className="bch-lede">{LEDE}</p>
      </PembukaHalaman>

      <ul className="sj-ide" data-ide={IDE.length}>
        {IDE.map((i) => (
          <li key={i.judul} className="bch-card">
            <p className="sj-ide-angka">{i.angka}</p>
            <h2 className="mt-2 mb-1 sj-judul-ide">{i.judul}</h2>
            <p className="m-0">{i.isi}</p>
            {i.bilah && (
              <div className="sj-bilah" role="img" aria-label="73 persen perairan, 27 persen daratan">
                <span data-bagian="laut" style={{ flexGrow: 73 }} />
                <span data-bagian="darat" style={{ flexGrow: 27 }} />
              </div>
            )}
            {i.tautan && (
              <p className="mt-2 mb-0">
                <Link href={i.tautan.href} prefetch={false}>
                  {i.tautan.teks}
                </Link>
              </p>
            )}
          </li>
        ))}
      </ul>

      {KELOMPOK_FAKTA.filter((k) => k.baris.length > 0).map((k) => (
        <section key={k.topik} className="mt-7" aria-labelledby={`fakta-${k.topik}`}>
          <h2 id={`fakta-${k.topik}`} className="mb-2">
            {k.judul}
          </h2>
          {k.lede && <p className="bch-measure mt-0">{k.lede}</p>}
          <div className="bch-table-wrap">
            <table className="bch-table bch-tabel-tumpuk sj-tabel">
              <thead>
                <tr>
                  <th scope="col">Indikator</th>
                  <th scope="col">Angka</th>
                  <th scope="col">Tahun</th>
                </tr>
              </thead>
              <tbody>
                {k.baris.map((b) => (
                  <tr key={b.id} data-fi={b.id}>
                    <td data-label="Indikator">
                      {b.indikator}
                      {b.status && <span className="bch-sel-kecil">{b.status}</span>}
                      {b.catatan && <span className="bch-sel-kecil">{b.catatan}</span>}
                    </td>
                    <td data-label="Angka" className="sj-sel-angka">
                      {b.angka}
                    </td>
                    <td data-label="Tahun">{b.tahun}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <section className="mt-7" aria-labelledby="judul-luas">
        <h2 id="judul-luas" className="mb-2">
          Luas dan Investasi
        </h2>
        <div className="bch-table-wrap">
          <table className="bch-table bch-tabel-tumpuk sj-tabel" data-tabel-luas>
            <thead>
              <tr>
                <th scope="col">Indikator</th>
                <th scope="col">Angka</th>
                <th scope="col">Tahun atau Dasar</th>
              </tr>
            </thead>
            <tbody>
              {LUAS_INVESTASI.map((b) => (
                <tr key={b.indikator}>
                  <td data-label="Indikator">
                    {b.indikator}
                    {b.catatan && <span className="bch-sel-kecil">{b.catatan}</span>}
                  </td>
                  <td data-label="Angka" className="sj-sel-angka">
                    {b.angka}
                  </td>
                  <td data-label="Tahun atau Dasar">{b.tahun}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {ANGKA_RESMI.map((k) => (
        <section key={k.judul} className="mt-7" aria-labelledby={`resmi-${k.judul}`}>
          <h2 id={`resmi-${k.judul}`} className="mb-2">
            {k.judul}
          </h2>
          {k.lede && <p className="bch-measure mt-0">{k.lede}</p>}
          <div className="bch-table-wrap">
            <table className="bch-table bch-tabel-tumpuk sj-tabel">
              <thead>
                <tr>
                  <th scope="col">Indikator</th>
                  <th scope="col">Angka</th>
                  <th scope="col">Tahun</th>
                </tr>
              </thead>
              <tbody>
                {k.baris.map((b) => (
                  <tr key={b.indikator} data-resmi={b.indikator}>
                    <td data-label="Indikator">
                      {b.label}
                      {b.catatan && <span className="bch-sel-kecil">{b.catatan}</span>}
                    </td>
                    <td data-label="Angka" className="sj-sel-angka">
                      {b.angka}
                    </td>
                    <td data-label="Tahun">{b.tahun}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <section className="mt-7" aria-labelledby="judul-linimasa">
        <h2 id="judul-linimasa" className="mb-2">
          Linimasa Singkat
        </h2>
        <p className="bch-measure mt-0">
          Versi lengkap dengan label status ada di{" "}
          <Link href="/cerita/sejarah#garis-waktu" prefetch={false}>
            Garis Waktu
          </Link>
          .
        </p>
        <ol className="sj-linimasa" data-linimasa={LINIMASA.length}>
          {LINIMASA.map((l) => (
            <li key={l.id} data-sj={l.id}>
              <span className="bch-data">{l.tahun}</span>
              <p className="mt-1 mb-0">{l.peristiwa}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
