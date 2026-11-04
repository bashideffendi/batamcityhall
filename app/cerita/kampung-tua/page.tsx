import type { Metadata } from "next";
import Link from "next/link";
import { DaftarSumber, NavKampungTua } from "@/features/kampung-tua/Bagian";
import {
  daftarPenanda,
  domain,
  ETIKA,
  JUMLAH,
  KAMPUNG,
  KISAH_NAMA,
  LAPISAN,
  lencanaLokasi,
  RUJUKAN,
  titikKampung,
  type Kampung,
} from "@/features/kampung-tua/data";
import { IkonCeritaRakyat, IkonGapura, IkonPerkiraan } from "@/features/kampung-tua/Ikon";
import PetaKampungTuaMuat from "@/features/kampung-tua/PetaKampungTuaMuat";
import "@/features/kampung-tua/kampung-tua.css";

export const metadata: Metadata = {
  title: "Kampung Tua",
  description: "Peta dan daftar kampung tua Batam: asal-usul, suku awal, yang bisa dilihat, dan etika berkunjung.",
};

function perKecamatan(isi: Kampung[]) {
  const grup = new Map<string, Kampung[]>();
  for (const k of isi) {
    const nama = k.kecamatan?.replace(/\s*\(.*\)$/, "") ?? "Kecamatan belum diketahui";
    grup.set(nama, [...(grup.get(nama) ?? []), k]);
  }
  return [...grup.entries()];
}

const namaPendek = (k: Kampung) => k.nama.replace(/^Kampung Tua /, "");

export default function KampungTua() {
  const penanda = daftarPenanda();
  const tanpaTitik = KAMPUNG.filter((k) => !titikKampung(k)).length;
  const infoLapisan = LAPISAN.map((l) => ({
    id: l.id,
    nama: l.nama,
    kicker: l.kicker,
    total: KAMPUNG.filter((k) => k.lapisan === l.id).length,
  }));

  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">Loket 05 · Cerita &amp; Budaya</p>
      <h1 className="mt-2">Kampung Tua</h1>
      <p className="bch-lede">
        Permukiman yang sudah ada sebelum Batam dibangun. {KAMPUNG.length} entri, {penanda.length} di peta, {tanpaTitik}{" "}
        hanya di daftar.
      </p>
      <p className="bch-note mt-3">
        Halaman ini soal asal-usul, orang, dan cerita. Batas, luas, dan status lahan tidak kami tampilkan. Daftarnya
        juga belum lengkap: lampiran SK 105/2004 dan SK 89/2006 belum kami dapat, jadi ejaan dan sebagian nama masih
        perlu dicocokkan.
      </p>
      <NavKampungTua aktif="daftar" />

      <PetaKampungTuaMuat penanda={penanda} lapisan={infoLapisan} />

      <section id="daftar" className="kt-bagian" aria-labelledby="judul-daftar">
        <h2 id="judul-daftar">Semua kampung</h2>
        <p className="bch-measure">Daftar ini memuat semua yang ada di peta, ditambah yang belum punya titik.</p>
        {LAPISAN.map((l) => {
          const isi = KAMPUNG.filter((k) => k.lapisan === l.id);
          return (
            <section key={l.id} data-lapisan-daftar={l.id} aria-labelledby={`lapisan-${l.id}`}>
              <h3 id={`lapisan-${l.id}`} className="mt-5">
                {l.nama} <span className="bch-data">{isi.length}</span>
              </h3>
              <p className="bch-measure">{l.lede}</p>
              {l.id === "rempang" && (
                <p className="bch-measure">
                  Pandangan para pihak ada di <Link href="/cerita/rempang">kronologi Rempang</Link> yang bertanggal.
                </p>
              )}
              {perKecamatan(isi).map(([kec, anggota]) => (
                <div key={kec}>
                  <h4 className="kt-kecamatan">{kec}</h4>
                  <ul className="kt-daftar">
                    {anggota.map((k) => (
                      <li key={k.id} data-kampung={k.id}>
                        <Link href={`/cerita/kampung-tua/${k.id}`} prefetch={false}>
                          <span className="kt-daftar-nama">
                            {namaPendek(k)}
                            {k.cerita_rakyat && (
                              <span className="bch-badge" data-tone="info">
                                <IkonCeritaRakyat ukuran={12} />
                                Ada cerita rakyat
                              </span>
                            )}
                          </span>
                          <span className="kt-daftar-ket">
                            {k.kelurahan ? `${k.kelurahan} · ` : ""}
                            {lencanaLokasi(k).teks}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          );
        })}
      </section>

      <section id="jumlah" className="kt-bagian" aria-labelledby="judul-jumlah">
        <h2 id="judul-jumlah">Kenapa angkanya beda-beda?</h2>
        <p className="bch-measure">
          Jumlah kampung tua bergantung pada siapa yang menghitung, kapan, dan wilayah mana yang dihitung.
        </p>
        <div className="bch-table-wrap mt-3">
          <table className="bch-table bch-tabel-tumpuk" data-tabel-jumlah>
            <thead>
              <tr>
                <th scope="col">Angka</th>
                <th scope="col">Menurut</th>
                <th scope="col">Konteks</th>
                <th scope="col">Sumber</th>
              </tr>
            </thead>
            <tbody>
              {JUMLAH.map((b) => (
                <tr key={b.angka}>
                  <td data-label="Angka">
                    <span className="bch-data">{b.angka}</span>
                    {b.konflik && (
                      <span className="bch-sel-kecil">
                        <span className="bch-badge" data-tone="caution">
                          Sumber bertentangan
                        </span>
                      </span>
                    )}
                  </td>
                  <td data-label="Menurut">{b.sumber}</td>
                  <td data-label="Konteks">{b.konteks}</td>
                  <td data-label="Sumber">
                    {b.tautan.map((u) => (
                      <a key={u} href={u} rel="noopener noreferrer">
                        {domain(u)}
                      </a>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="bch-measure mt-3" data-satu-data>
          Satu Data Batam (Pemko) mencatat 37 kampung tua untuk 2020–2022, dan data lain di sana menyebut 24 lokasi per
          Juni 2024 (Dinas Pertanahan). Kami tidak memilih salah satunya.{" "}
          <a
            href="https://satudata.batam.go.id/satu/detail/statistik-jumlah-kampung-tua-4axedn"
            rel="noopener noreferrer"
          >
            satudata.batam.go.id
          </a>
        </p>
        <div className="bch-prose">
          <h3>Pegangan kami</h3>
          <ul data-pegangan>
            <li>
              Daratan Batam: daftar 37 versi Ranperda DPRD 2019 dan RKWB 2016, satu-satunya daftar terbuka yang memuat
              nama, kelurahan, dan kecamatan sekaligus.
            </li>
            <li>Rempang: 16 nama versi Ombudsman RI, yang memeriksa lapangan dengan merujuk SK 105/2004.</li>
            <li>
              Pulau sekitar: belum ada daftar terbuka. Kami hanya menampilkan situs yang dasarnya jelas, misalnya cagar
              budaya SK Wali Kota No. 483/2022.
            </li>
          </ul>
          <h3>Apa itu kampung tua</h3>
          <p>
            Perda No. 2/2004 (RTRW 2004–2014), menurut kajian STPN dan Batam Pos: &quot;kelompok rumah yang berfungsi
            sebagai lingkungan tempat tinggal penduduk asli Kota Batam sebelum tahun 1970 saat Batam mulai dibangun,
            yang mengandung nilai sejarah, budaya tempatan, dan atau agama&quot;. Perda No. 3/2021 (RTRW 2021–2041),
            menurut Batam Pos, tidak memuat ketentuan spesifik soal perkampungan tua.
          </p>
          <p>Kriteria menurut surat Dinas Pertanahan Pemko, 25 April 2005, via STPN:</p>
          <ul>
            <li>sudah ada sebelum Otorita Batam berdiri;</li>
            <li>belum pernah diganti rugi;</li>
            <li>
              punya bukti berupa surat lama, tapak kampung, situs purbakala, kuburan tua, tanaman budidaya berumur tua,
              bangunan bernilai budaya, atau silsilah keluarga.
            </li>
          </ul>
        </div>
      </section>

      <section id="kisah-nama" className="kt-bagian bch-prose" aria-labelledby="judul-kisah">
        <h2 id="judul-kisah">Kisah nama tempat</h2>
        <p>
          Toponim lama ini sering disebut kampung tua, tetapi tidak ada di daftar 37. Karena itu tidak kami beri penanda
          di peta.
        </p>
        <div className="kt-cerita">
          <p className="kt-cerita-label">
            <IkonCeritaRakyat /> Cerita rakyat, bukan catatan sejarah
          </p>
          <dl className="bch-kartu-fakta m-0" data-kisah-nama>
            {KISAH_NAMA.map((n) => (
              <div key={n.nama}>
                <dt>{n.nama}</dt>
                <dd>
                  {n.kisah}{" "}
                  <a href={n.sumber} rel="noopener noreferrer">
                    {domain(n.sumber)}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="etika" className="kt-bagian bch-prose" aria-labelledby="judul-etika">
        <h2 id="judul-etika">Etika berkunjung</h2>
        <p>Kampung adalah rumah orang, bukan lokasi wisata.</p>
        <ul>
          {ETIKA.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </section>

      <section id="rujukan" className="kt-bagian kt-rujukan bch-prose" aria-labelledby="judul-rujukan">
        <h2 id="judul-rujukan">Rujukan</h2>
        <p>
          Lembaga dan arsip yang kami rujuk. Daftar ini bukan pernyataan kerja sama. Narasumber di kampung sebaiknya
          dihubungi lewat LAM atau RKWB, jadi kontak pribadi tidak kami tampilkan.
        </p>
        {RUJUKAN.map((r) => (
          <div key={r.judul}>
            <h3>{r.judul}</h3>
            <ul>
              {r.butir.map((b) => (
                <li key={b.nama}>
                  {b.url ? (
                    <a href={b.url} rel="noopener noreferrer">
                      {b.nama}
                    </a>
                  ) : (
                    b.nama
                  )}
                  {b.ket && `. ${b.ket}`}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <h3>Penanda di peta</h3>
        <p>
          <IkonGapura ukuran={18} /> untuk titik terverifikasi. <IkonPerkiraan /> untuk titik perkiraan. Saat ini semua
          titik masih perkiraan, jadi semuanya lingkaran berongga. Punya koordinat yang lebih baik?{" "}
          <Link href="/koreksi">Kabari kami</Link>.
        </p>
        <h3>Sumber daftar</h3>
        <DaftarSumber
          urls={[
            "https://batam.tribunnews.com/2019/05/06/tribunwiki-daftar-37-kampung-tua-berdasar-renperda-dprd-kota-batam-status-dibahas-presiden-jokowi?page=all",
            "https://ombudsman.go.id/news/r/-soal-rempang-eco-city-ombudsman-ri-tegaskan-pemerintah-harus-prioritaskan-kepentingan-masyarakat-dibanding-percepatan-pembangunan",
          ]}
        />
      </section>
    </div>
  );
}
