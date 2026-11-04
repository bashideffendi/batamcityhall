import type { Metadata } from "next";
import Link from "next/link";
import { ANGKA_RESMI, CELAH_LUAS, KELOMPOK_FAKTA, LINIMASA, LUAS_INVESTASI } from "@/features/sejarah/angka";
import { DaftarSumber } from "@/features/sejarah/Status";
import "@/features/sejarah/sejarah.css";

export const metadata: Metadata = {
  title: "Angka Batam",
  description: "Penduduk, wisman, pulau, luas, dan layanan di Batam. Setiap angka bersumber dan bertahun.",
};

function TautanSumber({ sumber, asal }: { sumber: { url: string; nama: string }[]; asal?: string | null }) {
  return (
    <>
      {asal && <span className="bch-sel-kecil">{asal}</span>}
      {sumber.map((s) => (
        <a key={s.url} href={s.url} rel="noopener noreferrer" className="block">
          {s.nama}
        </a>
      ))}
      {!asal && !sumber.length && <span className="sj-kecil">Tautan sumber belum ada</span>}
    </>
  );
}

const IDE = [
  {
    angka: "6.000 → 1.394.459",
    judul: "Dari sekitar 6.000 jiwa pada 1965",
    isi: "1965 versi BP Batam. Semester II 2025 versi registrasi Disdukcapil. Metodenya berbeda, jadi ini gambaran besar, bukan satu garis.",
    tautan: { href: "/cerita/sejarah#penduduk", teks: "Lihat grafik per metode" },
  },
  {
    angka: "±73%",
    judul: "Hampir 3 dari 4 bagian Batam adalah laut",
    isi: "Perairan 2.791,09 km², daratan 1.038,84 km².",
    bilah: true,
  },
  {
    angka: "±4.400",
    judul: "Wisman datang setiap hari, rata-rata 2025",
    isi: "Dihitung dari 1.613.202 ÷ 365. Angka turunan.",
  },
  {
    angka: "789.674",
    judul: "Hampir 1 dari 2 kunjungan wisman 2025 dari Singapura",
    isi: "Sekitar 49% dari 1.613.202 kunjungan.",
  },
  {
    angka: "3 angka, 1 kota",
    judul: "Penduduk 2025 tergantung siapa yang menghitung",
    isi: "1.394.459 (Disdukcapil, Semester II). 1.296.960 (BPS, dikutip Wikipedia). 1,79 juta (Databoks, tidak kami pakai). Metodenya berbeda, dan kami belum bisa menjelaskan selisihnya dengan pasti.",
  },
];

export default function AngkaBatam() {
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">
        <Link href="/cerita" prefetch={false}>
          Loket 05
        </Link>
      </p>
      <h1 className="mt-2">Angka Batam</h1>
      <p className="bch-lede">
        Angka yang sering dikutip, dengan sumber dan tahunnya. Kalau sumbernya berbeda, semuanya kami tulis.
      </p>

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

      {KELOMPOK_FAKTA.map((k) => (
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
                  <th scope="col">Status</th>
                  <th scope="col">Sumber</th>
                </tr>
              </thead>
              <tbody>
                {k.baris.map((b) => (
                  <tr key={b.id} data-fi={b.id}>
                    <td data-label="Indikator">
                      {b.indikator}
                      {b.catatan && <span className="bch-sel-kecil">{b.catatan}</span>}
                    </td>
                    <td data-label="Angka" className="sj-sel-angka">
                      {b.angka}
                    </td>
                    <td data-label="Tahun">{b.tahun}</td>
                    <td data-label="Status">{b.status}</td>
                    <td data-label="Sumber">
                      <TautanSumber sumber={b.sumber} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <section className="mt-7" aria-labelledby="judul-luas">
        <h2 id="judul-luas" className="mb-2">
          Luas dan investasi
        </h2>
        <div className="bch-table-wrap">
          <table className="bch-table bch-tabel-tumpuk sj-tabel" data-tabel-luas>
            <thead>
              <tr>
                <th scope="col">Indikator</th>
                <th scope="col">Angka</th>
                <th scope="col">Tahun atau dasar</th>
                <th scope="col">Sumber</th>
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
                  <td data-label="Tahun atau dasar">{b.tahun}</td>
                  <td data-label="Sumber">
                    <TautanSumber sumber={b.sumber} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="bch-measure sj-kecil mt-3">{CELAH_LUAS}</p>
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
                  <th scope="col">Sumber</th>
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
                    <td data-label="Sumber">
                      <TautanSumber sumber={b.sumber} asal={b.asal} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <section className="mt-7" aria-labelledby="judul-linimasa">
        <h2 id="judul-linimasa" className="mb-2">
          Linimasa singkat
        </h2>
        <p className="bch-measure mt-0">
          Versi lengkap dengan label status ada di{" "}
          <Link href="/cerita/sejarah#garis-waktu" prefetch={false}>
            Garis waktu
          </Link>
          .
        </p>
        <ol className="sj-linimasa" data-linimasa={LINIMASA.length}>
          {LINIMASA.map((l) => (
            <li key={l.id} data-sj={l.id}>
              <span className="bch-data">{l.tahun}</span>
              <p className="mt-1 mb-0">{l.peristiwa}</p>
              <DaftarSumber sumber={l.sumber} />
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
