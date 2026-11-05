import type { Metadata } from "next";
import TautanKirim from "@/components/site/TautanKirim";
import Link from "next/link";
import osmFeri from "@/data/osm/lapisan/feri.geojson.json";
import osmHalte from "@/data/osm/lapisan/halte.geojson.json";
import { TERMINAL_LUAR_BATAM, TERMINAL_TANPA_TITIK, titikTerminalDiPeta } from "@/features/jalan/feri-data";
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
        <h1 className="m-0">Peta Transportasi</h1>
        <p className="bch-lede">Lihat koridor bus, terminal feri, dan pelabuhan rakyat di Batam.</p>
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

          <details className="jl-tabel-lipat">
            <summary>Belum Ada di Peta ({HUB_TANPA_TITIK.length})</summary>
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
          </details>

          <h2>Terminal di Luar Batam</h2>
          <p>Tujuan feri ini tidak ditandai di peta.</p>
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
            <TautanKirim href="/koreksi" prefetch={false}>
              Kirim Koreksi
            </TautanKirim>
          </p>
        </div>
      </div>
    </>
  );
}
