import type { Metadata } from "next";
import Link from "next/link";
import { DaftarSumber } from "@/features/kampung-tua/Bagian";
import { domain } from "@/features/kampung-tua/data";
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
  SUMBER_PENAMAAN_RESMI,
  TOKOH,
} from "@/features/nama-jalan/data";
import DiagramRelasi from "@/features/nama-jalan/DiagramRelasi";
import "@/features/kampung-tua/kampung-tua.css";
import "@/features/nama-jalan/nama-jalan.css";

export const metadata: Metadata = {
  title: "Siapa di Balik Nama Jalan",
  description: "Tokoh di balik nama jalan, jembatan, dan tempat di Batam, dengan label sejarah dan hikayat.",
};

export default function NamaJalan() {
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">Loket 05 · Cerita &amp; Budaya</p>
      <h1 className="mt-2">Siapa di Balik Nama Jalan</h1>
      <p className="bch-lede">
        {TOKOH.length} tokoh, {PENAMAAN.length} nama tempat. Anda sudah lewat di depan nama mereka hari ini.
      </p>
      <p className="bch-note mt-3">
        Sejarah dan hikayat kami pisahkan. Kartu berbingkai putus-putus dan bertanda bintang garis adalah tokoh hikayat
        atau semi-historis. Kartu berlabel ringkas belum punya sumber biografi, dan tidak kami isi dengan tebakan.
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
        <h2 id="judul-penamaan">Daftar nama tempat</h2>
        <p className="bch-measure">
          Daftar ruas jalan berasal dari rilis Dishub 2011 yang disalin sebuah blog. Sebagian mungkin sudah berganti
          nama dan belum dicocokkan dengan OpenStreetMap. Jalan belum kami sorot di peta.
        </p>
        <div className="bch-table-wrap mt-3">
          <table className="bch-table bch-tabel-tumpuk" data-tabel-penamaan>
            <thead>
              <tr>
                <th scope="col">Nama</th>
                <th scope="col">Jenis</th>
                <th scope="col">Letak</th>
                <th scope="col">Dinamai menurut</th>
                <th scope="col">Kartu dan sumber</th>
              </tr>
            </thead>
            <tbody>
              {PENAMAAN.map((p) => (
                <tr key={p.id} data-penamaan={p.id}>
                  <td data-label="Nama">
                    <span className="nj-penamaan-nama">{p.nama}</span>
                    {p.catatan && <span className="nj-penamaan-catatan">{p.catatan}</span>}
                  </td>
                  <td data-label="Jenis">{p.jenis}</td>
                  <td data-label="Letak">
                    {p.letak.replace(/\s*\(perlu dicek\)/, "")}
                    {p.lokasiPerluDicek && (
                      <span className="bch-sel-kecil">
                        <span className="bch-badge" data-tone="caution">
                          Lokasi perlu dicek
                        </span>
                      </span>
                    )}
                  </td>
                  <td data-label="Dinamai menurut">
                    <Link href={`/cerita/nama-jalan/${p.tokohId}`} prefetch={false}>
                      {p.tokohNama}
                    </Link>
                  </td>
                  <td data-label="Kartu dan sumber" className="nj-tabel-sel-tautan">
                    {p.tempat && (
                      <>
                        <Link href={`/info/tempat/${p.tempat.id}`} prefetch={false} data-tautan-tempat>
                          Kartu tempat
                        </Link>
                        <br />
                      </>
                    )}
                    {p.sumber ? (
                      <a href={p.sumber} rel="noopener noreferrer">
                        {domain(p.sumber)}
                      </a>
                    ) : (
                      "Sumber belum tercatat"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="relasi" className="nj-bagian" aria-labelledby="judul-relasi">
        <h2 id="judul-relasi">Silsilah dan hubungan</h2>
        <p className="bch-note" data-catatan-raja-ali>
          Nama &quot;Raja Ali&quot; berulang di keluarga ini. Raja Ali (YDM V, ayah Nong Isa) berbeda orang dari Raja
          Ali Haji dan Raja Ali Kelana.
        </p>
        <DiagramRelasi />
        <div className="bch-prose">
          <h3>Garis keluarga yang tokohnya belum punya kartu</h3>
          <p>Nama-nama ini belum kami buatkan kartu. Sumbernya sama dengan kartu tokoh terkait.</p>
          <dl className="bch-kartu-fakta" data-garis-tanpa-kartu>
            {GARIS_TANPA_KARTU.map((g) => (
              <div key={g.judul}>
                <dt>{g.judul}</dt>
                <dd>
                  {g.isi}
                  {g.sumber && (
                    <>
                      {" "}
                      <a href={g.sumber} rel="noopener noreferrer">
                        {domain(g.sumber)}
                      </a>
                    </>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="penetapan" className="nj-bagian bch-prose" aria-labelledby="judul-penetapan">
        <h2 id="judul-penetapan">Penamaan resmi</h2>
        <dl className="bch-kartu-fakta" data-penamaan-resmi>
          {PENAMAAN_RESMI.map((p) => (
            <div key={p.judul}>
              <dt>{p.judul}</dt>
              <dd>{p.isi}</dd>
            </div>
          ))}
        </dl>
        <h3>Sumber</h3>
        <DaftarSumber urls={SUMBER_PENAMAAN_RESMI} />
        <p>
          Kualitas sumber kami campur. Yang paling kokoh: BPCB dan BPNB, Dinas Kebudayaan Kepri, Media Center Pemko, dan
          Keppres pahlawan nasional. Banyak sisanya artikel populer atau advertorial.
        </p>
      </section>

      <section id="bacaan" className="nj-bagian bch-prose" aria-labelledby="judul-bacaan">
        <h2 id="judul-bacaan">Bacaan lanjutan</h2>
        <ul data-bacaan>
          {BACAAN.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <p>
          Ada yang keliru, atau tahu siapa di balik nama jalan di kampung Anda? <Link href="/koreksi">Kabari kami</Link>
          .
        </p>
      </section>
    </div>
  );
}
