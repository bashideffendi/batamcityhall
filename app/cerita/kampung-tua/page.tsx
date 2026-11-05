import type { Metadata } from "next";
import Link from "next/link";
import { NavKampungTua } from "@/features/kampung-tua/Bagian";
import {
  daftarPenanda,
  ETIKA,
  JUMLAH,
  KAMPUNG,
  KISAH_NAMA,
  LAPISAN,
  labelLokasi,
  type Kampung,
} from "@/features/kampung-tua/data";
import { IkonCeritaRakyat } from "@/features/kampung-tua/Ikon";
import PetaKampungTuaMuat from "@/features/kampung-tua/PetaKampungTuaMuat";
import "@/features/kampung-tua/kampung-tua.css";

const LEDE =
  "Kampung tua adalah permukiman yang sudah ada sebelum Batam dibangun sebagai kawasan industri. Halaman ini memuat asal-usul, penduduk awal, dan etika berkunjung.";

export const metadata: Metadata = {
  title: "Kampung Tua",
  description: LEDE,
};

function perKecamatan(isi: Kampung[]) {
  const grup = new Map<string, Kampung[]>();
  for (const k of isi) {
    const nama = k.kecamatan?.replace(/\s*\(.*\)$/, "") ?? "Tanpa Kecamatan";
    grup.set(nama, [...(grup.get(nama) ?? []), k]);
  }
  return [...grup.entries()];
}

const namaPendek = (k: Kampung) => k.nama.replace(/^Kampung Tua /, "");

export default function KampungTua() {
  const penanda = daftarPenanda();
  const infoLapisan = LAPISAN.map((l) => ({
    id: l.id,
    nama: l.nama,
    kicker: l.kicker,
    total: KAMPUNG.filter((k) => k.lapisan === l.id).length,
  }));

  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">Cerita dan Budaya</p>
      <h1 className="mt-2">Kampung Tua</h1>
      <p className="bch-lede">{LEDE}</p>
      <p className="bch-note mt-3">Halaman ini tidak memuat batas wilayah, luas, atau status lahan.</p>
      <NavKampungTua aktif="daftar" />

      <PetaKampungTuaMuat penanda={penanda} lapisan={infoLapisan} />

      <section id="daftar" className="kt-bagian" aria-labelledby="judul-daftar">
        <h2 id="judul-daftar">Semua Kampung</h2>
        <p className="bch-measure">
          Daftar ini memuat {KAMPUNG.length} kampung. Sebanyak {penanda.length} kampung ada di peta.
        </p>
        {LAPISAN.map((l) => {
          const isi = KAMPUNG.filter((k) => k.lapisan === l.id);
          return (
            <section key={l.id} data-lapisan-daftar={l.id} aria-labelledby={`lapisan-${l.id}`}>
              <h3 id={`lapisan-${l.id}`} className="mt-5">
                {l.nama} <span className="bch-data">{isi.length}</span>
              </h3>
              <p className="bch-measure">{l.lede}</p>
              {perKecamatan(isi).map(([kec, anggota]) => (
                <div key={kec}>
                  <h4 className="kt-kecamatan">{kec}</h4>
                  <ul className="kt-daftar">
                    {anggota.map((k) => {
                      const ket = [k.kelurahan, labelLokasi(k)].filter(Boolean).join(" · ");
                      return (
                        <li key={k.id} data-kampung={k.id}>
                          <Link href={`/cerita/kampung-tua/${k.id}`} prefetch={false}>
                            <span className="kt-daftar-nama">
                              {namaPendek(k)}
                              {k.cerita_rakyat && (
                                <span className="bch-badge" data-tone="info">
                                  <IkonCeritaRakyat ukuran={12} />
                                  Cerita rakyat
                                </span>
                              )}
                            </span>
                            {ket && <span className="kt-daftar-ket">{ket}</span>}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </section>
          );
        })}
      </section>

      <section id="jumlah" className="kt-bagian" aria-labelledby="judul-jumlah">
        <h2 id="judul-jumlah">Mengapa Jumlahnya Berbeda</h2>
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
                          Berbeda versi
                        </span>
                      </span>
                    )}
                  </td>
                  <td data-label="Menurut">{b.sumber}</td>
                  <td data-label="Konteks">{b.konteks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="bch-measure mt-3" data-satu-data>
          Satu Data Batam (Pemko) mencatat 37 kampung tua untuk 2020—2022, dan data lain di sana menyebut 24 lokasi per
          Juni 2024 (Dinas Pertanahan). Kami tidak memilih salah satunya.
        </p>
        <div className="bch-prose">
          <h3>Pegangan Kami</h3>
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
          <h3>Apa Itu Kampung Tua</h3>
          <p>
            Perda No. 2/2004 (RTRW 2004—2014), menurut kajian STPN dan Batam Pos: “kelompok rumah yang berfungsi sebagai
            lingkungan tempat tinggal penduduk asli Kota Batam sebelum tahun 1970 saat Batam mulai dibangun, yang
            mengandung nilai sejarah, budaya tempatan, dan atau agama”. Perda No. 3/2021 (RTRW 2021—2041), menurut Batam
            Pos, tidak memuat ketentuan spesifik soal perkampungan tua.
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
        <h2 id="judul-kisah">Kisah Nama Tempat</h2>
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
                <dd>{n.kisah}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="etika" className="kt-bagian bch-prose" aria-labelledby="judul-etika">
        <h2 id="judul-etika">Etika Berkunjung</h2>
        <p>Kampung adalah rumah orang, bukan lokasi wisata.</p>
        <ul>
          {ETIKA.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </section>

      <p className="bch-measure mt-5" data-catatan-data>
        Data dihimpun pada November 2026. Sebagian lokasi masih perkiraan. <Link href="/koreksi">Kirim koreksi</Link>
      </p>
    </div>
  );
}
