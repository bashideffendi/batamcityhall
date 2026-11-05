import type { Metadata } from "next";
import Link from "next/link";
import osmFeri from "@/data/osm/lapisan/feri.geojson.json";
import osmHalte from "@/data/osm/lapisan/halte.geojson.json";
import { TERMINAL_LUAR_BATAM, TERMINAL_TANPA_TITIK, titikTerminalDiPeta } from "@/features/jalan/feri-data";
import JalanNav from "@/features/jalan/JalanNav";
import PetaJalanMuat from "@/features/jalan/PetaJalanMuat";
import { muatRuteGeo } from "@/features/jalan/rute-geo";
import { HUB_TANPA_TITIK, titikTransDiPeta } from "@/features/jalan/trans-data";

export const metadata: Metadata = {
  title: "Peta Transportasi",
  description: "Peta koridor bus Trans Batam, terminal feri, dan pelabuhan rakyat di Batam.",
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
        <p className="bch-kicker m-0">Loket 04 · Transportasi</p>
        <h1 className="mt-2">Peta Transportasi</h1>
        <p className="bch-lede">Peta ini memuat koridor bus, terminal feri, dan pelabuhan rakyat di Batam.</p>
        <JalanNav aktif="/jalan/peta" />
      </div>
      <PetaJalanMuat titik={titik} rute={rute} osm={osm} />
      <div className="bch-page jl-page-bawah">
        <div className="bch-prose">
          <h2>Tentang Garis di Peta</h2>
          <p>
            Garis Koridor 1, jalur feri, dan titik kecil halte berasal dari OpenStreetMap, yang diisi relawan. Jalur
            feri hanya menggambarkan arah pelayaran.
          </p>
          <p>
            Koridor lain belum memiliki garis di peta. Urutan haltenya ada di{" "}
            <Link href="/jalan/trans-batam" prefetch={false}>
              diagram dan halaman tiap koridor
            </Link>
            .
          </p>

          <h2>Belum Ada di Peta</h2>
          <p>Tempat berikut tercatat, tetapi belum memiliki titik di peta.</p>
          <ul className="jl-daftar-rapat" data-testid="lokasi-belum-diisi">
            {HUB_TANPA_TITIK.map((h) => (
              <li key={h.id}>
                {h.nama} (Trans Batam {h.koridor.join(", ")})
              </li>
            ))}
            {TERMINAL_TANPA_TITIK.map((t) => (
              <li key={t.id}>
                {t.nama}
                {t.kecamatan ? `, ${t.kecamatan}` : ""}
              </li>
            ))}
          </ul>

          <h2>Terminal di Luar Batam</h2>
          <p>Terminal berikut menjadi tujuan feri dan tidak ditandai di peta.</p>
          <ul className="jl-daftar-rapat">
            {TERMINAL_LUAR_BATAM.map((t) => (
              <li key={t.id}>
                {t.nama}
                {t.alamat ? `, ${t.alamat}` : ""}
              </li>
            ))}
          </ul>

          <p className="jl-catatan-kecil">
            Data dihimpun pada November 2026. Sebagian lokasi masih perkiraan.{" "}
            <Link href="/koreksi" prefetch={false}>
              Kirim koreksi
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
