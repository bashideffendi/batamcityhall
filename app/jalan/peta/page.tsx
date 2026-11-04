import type { Metadata } from "next";
import Link from "next/link";
import osmFeri from "@/data/osm/lapisan/feri.geojson.json";
import osmHalte from "@/data/osm/lapisan/halte.geojson.json";
import { TERMINAL_LUAR_BATAM, TERMINAL_TANPA_TITIK, titikTerminalDiPeta } from "@/features/jalan/feri-data";
import JalanNav from "@/features/jalan/JalanNav";
import PetaJalanMuat from "@/features/jalan/PetaJalanMuat";
import { muatRuteGeo } from "@/features/jalan/rute-geo";
import {
  HUB_TANPA_TITIK,
  jumlahHalteBelumDiisi,
  titikTransDiPeta,
  TEKS_TANGGAL_DATA,
} from "@/features/jalan/trans-data";

export const metadata: Metadata = {
  title: "Peta Jalan-jalan",
  description: "Hub Trans Batam dan terminal feri di peta. Lokasi perkiraan ditandai berongga.",
};

export default async function PetaJalanHalaman() {
  const rute = await muatRuteGeo();
  const titik = [...titikTransDiPeta(), ...titikTerminalDiPeta()];
  const osm = {
    feri: osmFeri as GeoJSON.FeatureCollection,
    halte: osmHalte as GeoJSON.FeatureCollection,
    ditarik: osmHalte.ditarik,
  };
  return (
    <>
      <div className="bch-page jl-page-atas">
        <p className="bch-kicker m-0">Loket 04 · Jalan-jalan</p>
        <h1 className="mt-2">Peta</h1>
        <p className="bch-lede">
          Hub Trans Batam dan terminal feri. Garis dan halte dari OpenStreetMap ditandai terpisah.
        </p>
        <JalanNav aktif="/jalan/peta" />
      </div>
      <PetaJalanMuat titik={titik} rute={rute} osm={osm} />
      <div className="bch-page jl-page-bawah">
        <div className="bch-prose">
          <h2>Dari mana garis di peta ini</h2>
          <p>
            Garis Koridor 1, jalur feri, dan titik kecil halte berasal dari OpenStreetMap (ditarik {osm.ditarik}, ODbL).
            Itu data relawan, belum kami cek di lapangan, dan bukan data resmi Trans Batam. Jalur feri hanya gambaran
            arah, bukan jalur pelayaran yang pasti.
          </p>
          <p>
            Koridor lain belum punya garis, karena OSM belum memuat rutenya. Garis lurus antar landmark akan
            menyesatkan, jadi tidak kami gambar. Di data kurasi kami, {jumlahHalteBelumDiisi()} halte belum punya
            koordinat dan belum ada yang terverifikasi. Urutan halte ada di{" "}
            <Link href="/jalan/trans-batam" prefetch={false}>
              diagram dan halaman tiap koridor
            </Link>
            . Data {TEKS_TANGGAL_DATA}.
          </p>
          <p>
            Punya titik GPS halte?{" "}
            <Link href="/koreksi" prefetch={false}>
              Kabari kami
            </Link>
            .
          </p>

          <h2>Lokasi belum diisi</h2>
          <p>Tempat ini tercatat, tetapi koordinatnya belum ada, jadi tidak muncul di peta.</p>
          <ul className="jl-daftar-rapat" data-testid="lokasi-belum-diisi">
            {HUB_TANPA_TITIK.map((h) => (
              <li key={h.id}>
                {h.nama} (Trans Batam {h.koridor.join(", ")}){" "}
                <span className="bch-badge" data-tone="caution">
                  lokasi belum diisi
                </span>
              </li>
            ))}
            {TERMINAL_TANPA_TITIK.map((t) => (
              <li key={t.id}>
                {t.nama}
                {t.kecamatan ? `, ${t.kecamatan}` : ""}{" "}
                <span className="bch-badge" data-tone="caution">
                  lokasi belum diisi
                </span>
              </li>
            ))}
          </ul>

          <h2>Terminal di luar Batam</h2>
          <p>Tujuan feri, bukan pin di direktori.</p>
          <ul className="jl-daftar-rapat">
            {TERMINAL_LUAR_BATAM.map((t) => (
              <li key={t.id}>
                {t.nama}
                {t.alamat ? `, ${t.alamat}` : ""}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
