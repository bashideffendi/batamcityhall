import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kolofon",
  description: "Huruf, peta, grafis, dan kredit data Barelang.co.",
};

// Satu-satunya halaman yang memuat kredit data (PEDOMAN 2.9 dan 3.10). Ditulis sebagai teks, tanpa tautan.
const DATA = [
  "Radar hujan: Meteorological Service Singapore.",
  "Kondisi cuaca: National Environment Agency.",
  "Prakiraan gelombang dan cuaca: BMKG.",
  "Peta tinggi gelombang pilihan kedua: Copernicus Marine Service (Uni Eropa), model gelombang global 1/12 derajat.",
  "Peringatan dini cuaca dan gempa: BMKG.",
  "Kualitas udara: Open-Meteo (CC BY 4.0), dari model Copernicus Atmosphere Monitoring Service.",
  "Batas kecamatan: Badan Informasi Geospasial.",
  "Kamera lalu lintas: Pemerintah Kota Batam.",
  "Food court: BatamGems, Wikivoyage, Eatbook, Trip.com, Wanderlog, KepriOnline, Foursquare, dan TribunBatam.",
  "Sebagian tempat di Direktori: Google Maps.",
  "Data OpenStreetMap berlisensi ODbL.",
];

export default function Kolofon() {
  return (
    <div className="bch-page bch-baca">
      <h1>Kolofon</h1>

      <div className="bch-prose">
        <h2>Huruf</h2>
        <p>Newsreader, Plus Jakarta Sans, dan IBM Plex Mono (SIL Open Font License).</p>

        <h2>Peta</h2>
        <p>Peta dasar dari kontributor OpenStreetMap, diolah dengan Protomaps dan MapLibre.</p>
        <p>
          Peta Bus Trans Batam mengikuti tata letak, bentuk pulau, dan sebagian nama halte dari Peta Bus Batam karya
          Farhan S. Fadhillah dengan kontribusi informasi Hazakura, akurat per 24 Oktober 2024, lisensi CC BY 4.0. Peta
          itu juga melengkapi urutan halte di halaman koridor. Gaya, warna, dan daftar halte November 2026 diubah untuk
          situs ini.
        </p>

        <h2>Grafis</h2>
        <p>Ilustrasi bergaya cetak Riso dibuat khusus untuk situs ini.</p>
        <p>
          Peta isometrik Barelang di sampul beranda dibuat dengan AI dari data OpenStreetMap dan ditampilkan dengan
          OpenSeadragon. Tempat di Jelajahi Peta dari Google Maps; data kota dari HANG JEBAT (Disperkimtan), BP Batam,
          dan Satu Data Batam.
        </p>

        <h2>Data</h2>
        <ul>
          {DATA.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
