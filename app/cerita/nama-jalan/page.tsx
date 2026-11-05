import type { Metadata } from "next";
import Link from "next/link";
import DaftarTokoh from "@/features/nama-jalan/DaftarTokoh";
import {
  BACAAN,
  barisTokoh,
  CATATAN_HIKAYAT,
  GARIS_TANPA_KARTU,
  GRUP_STATUS,
  KELOMPOK,
  PENAMAAN,
  PENAMAAN_RESMI,
  TOKOH,
} from "@/features/nama-jalan/data";
import DiagramRelasi from "@/features/nama-jalan/DiagramRelasi";
import "@/features/kampung-tua/kampung-tua.css";
import "@/features/nama-jalan/nama-jalan.css";

const LEDE = "Nama tokoh-tokoh ini dipakai untuk jalan, jembatan, dan gedung di Batam.";

export const metadata: Metadata = {
  title: "Siapa di Balik Nama Jalan",
  description: LEDE,
};

export default function NamaJalan() {
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">Cerita dan Budaya</p>
      <h1 className="mt-2">Siapa di Balik Nama Jalan</h1>
      <p className="bch-lede">{LEDE}</p>
      <p className="bch-note mt-3">
        Ada {TOKOH.length} tokoh dan {PENAMAAN.length} nama tempat. Kartu berbingkai putus-putus dan bertanda bintang
        garis adalah tokoh hikayat.
      </p>
      <nav className="bch-sub-nav" aria-label="Bagian halaman">
        <a href="#tokoh">Tokoh</a>
        <a href="#penamaan">Daftar nama tempat</a>
        <a href="#relasi">Silsilah</a>
        <a href="#penetapan">Penamaan resmi</a>
        <a href="#bacaan">Bacaan</a>
      </nav>

      <section id="tokoh" className="nj-bagian" aria-labelledby="judul-tokoh">
        <h2 id="judul-tokoh">Tokoh</h2>
        <DaftarTokoh
          tokoh={TOKOH.map(barisTokoh)}
          kelompok={KELOMPOK}
          grupStatus={GRUP_STATUS}
          catatanHikayat={CATATAN_HIKAYAT}
        />
      </section>

      <section id="penamaan" className="nj-bagian" aria-labelledby="judul-penamaan">
        <h2 id="judul-penamaan">Daftar Nama Tempat</h2>
        <p className="bch-measure">
          Daftar ruas jalan berasal dari rilis Dishub 2011. Sebagian nama mungkin sudah berganti.
        </p>
        <div className="bch-table-wrap mt-3">
          <table className="bch-table bch-tabel-tumpuk" data-tabel-penamaan>
            <thead>
              <tr>
                <th scope="col">Nama</th>
                <th scope="col">Jenis</th>
                <th scope="col">Letak</th>
                <th scope="col">Dinamai menurut</th>
              </tr>
            </thead>
            <tbody>
              {PENAMAAN.map((p) => (
                <tr key={p.id} data-penamaan={p.id}>
                  <td data-label="Nama">
                    <span className="nj-penamaan-nama">
                      {p.tempat ? (
                        <Link href={`/info/tempat/${p.tempat.id}`} prefetch={false} data-tautan-tempat>
                          {p.nama}
                        </Link>
                      ) : (
                        p.nama
                      )}
                    </span>
                    {p.catatan && <span className="nj-penamaan-catatan">{p.catatan}</span>}
                  </td>
                  <td data-label="Jenis">{p.jenis}</td>
                  <td data-label="Letak">{p.letak}</td>
                  <td data-label="Dinamai menurut">
                    <Link href={`/cerita/nama-jalan/${p.tokohId}`} prefetch={false}>
                      {p.tokohNama}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="relasi" className="nj-bagian" aria-labelledby="judul-relasi">
        <h2 id="judul-relasi">Silsilah dan Hubungan</h2>
        <p className="bch-note" data-catatan-raja-ali>
          Nama “Raja Ali” berulang di keluarga ini. Raja Ali (YDM V, ayah Nong Isa) berbeda orang dari Raja Ali Haji dan
          Raja Ali Kelana.
        </p>
        <DiagramRelasi />
        <div className="bch-prose">
          <h3>Garis Keluarga Lain</h3>
          <p>Nama-nama ini belum punya kartu tokoh.</p>
          <dl className="bch-kartu-fakta" data-garis-tanpa-kartu>
            {GARIS_TANPA_KARTU.map((g) => (
              <div key={g.judul}>
                <dt>{g.judul}</dt>
                <dd>{g.isi}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="penetapan" className="nj-bagian bch-prose" aria-labelledby="judul-penetapan">
        <h2 id="judul-penetapan">Penamaan Resmi</h2>
        <dl className="bch-kartu-fakta" data-penamaan-resmi>
          {PENAMAAN_RESMI.map((p) => (
            <div key={p.judul}>
              <dt>{p.judul}</dt>
              <dd>{p.isi}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="bacaan" className="nj-bagian bch-prose" aria-labelledby="judul-bacaan">
        <h2 id="judul-bacaan">Bacaan Lanjutan</h2>
        <ul data-bacaan>
          {BACAAN.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <p>
          Ada yang keliru atau terlewat? <Link href="/koreksi">Kirim koreksi</Link>
        </p>
      </section>
    </div>
  );
}
