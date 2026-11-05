import type { Metadata } from "next";
import Link from "next/link";
import PembukaLoket from "@/components/site/PembukaLoket";
import { IsiLoketCuaca, SaatIni } from "@/features/langit-laut/components/PembukaCuaca";
import "@/features/langit-laut/cuaca.css";

export const metadata: Metadata = {
  title: "Cuaca dan Laut",
  description: "Radar hujan, tinggi gelombang, dan kamera lalu lintas untuk Batam dan perairan sekitarnya.",
};

export default function CuacaDanLaut() {
  return (
    <div className="bch-page">
      <PembukaLoket nomor="01" lede="Data untuk Batam dan perairan sekitarnya diperbarui otomatis.">
        <SaatIni />
      </PembukaLoket>

      <section className="bch-seksi" aria-labelledby="isi-loket">
        <h2 id="isi-loket" className="bch-kicker bch-kepala-penanda">
          Isi bagian ini
        </h2>
        <IsiLoketCuaca />
        <ol className="bch-daftar-nomor cu-tambahan">
          <li>
            <Link href="/cuaca/peringatan" prefetch={false}>
              <span className="no">04</span>
              <span className="nama">Peringatan Dini Cuaca</span>
              <span className="panah" aria-hidden="true">
                →
              </span>
              <span className="ket">Yang berlaku di Kepulauan Riau, dengan kecamatan di Batam yang disebut.</span>
            </Link>
          </li>
          <li>
            <Link href="/cuaca/gempa" prefetch={false}>
              <span className="no">05</span>
              <span className="nama">Gempa Terkini</span>
              <span className="panah" aria-hidden="true">
                →
              </span>
              <span className="ket">Gempa di seluruh Indonesia, dengan jarak dari Batam.</span>
            </Link>
          </li>
        </ol>
        <p className="mt-5">
          Jadwal feri dan pompong ada di <Link href="/jalan">Transportasi</Link>.
        </p>
      </section>
    </div>
  );
}
