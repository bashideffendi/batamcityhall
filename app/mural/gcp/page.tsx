import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DASAR_TILE, SEGMEN_AKTIF } from "@/features/mural/data";
import AlatGcpMuat from "@/features/mural/gcp/AlatGcpMuat";

export const metadata: Metadata = {
  title: "Alat GCP mural",
  description: "Alat internal untuk memasangkan titik gambar mural dengan koordinat.",
  robots: { index: false, follow: false },
};

const ukuran = () =>
  JSON.parse(readFileSync(join(process.cwd(), "public", DASAR_TILE, "meta.json"), "utf8")) as {
    lebar: number;
    tinggi: number;
  };

export default function AlatGcpHalaman() {
  const { lebar, tinggi } = ukuran();
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">Internal, tidak masuk peta situs</p>
      <h1 className="mt-2">Alat GCP mural</h1>
      <p className="bch-lede">Klik titik yang sama di gambar dan di peta, lalu simpan pasangannya.</p>
      <p className="bch-note">
        Pilih titik yang jelas: ujung jembatan, pelabuhan, simpang, menara masjid. Hasilnya hanya berkas unduhan.
      </p>
      <AlatGcpMuat dasar={DASAR_TILE} segmen={SEGMEN_AKTIF} lebar={lebar} tinggi={tinggi} />
    </div>
  );
}
