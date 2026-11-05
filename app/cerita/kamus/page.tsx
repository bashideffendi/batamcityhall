import type { Metadata } from "next";
import PembukaHalaman from "@/components/site/PembukaHalaman";
import TautanKirim from "@/components/site/TautanKirim";
import { DATA_DIHIMPUN, daftarKata } from "@/features/budaya/data";
import Kamus from "@/features/budaya/Kamus";
import "@/features/budaya/budaya.css";

const judulLede = (jumlah: number) => `Berisi ${jumlah} kata yang sering terdengar di Batam.`;

export const metadata: Metadata = {
  title: "Kamus Melayu Kepri dan Bahasa Batam",
  description: judulLede(daftarKata().length),
};

export default function HalamanKamus() {
  const entri = daftarKata();
  return (
    <div className="bch-page">
      <PembukaHalaman judul="Kamus Melayu Kepri dan Bahasa Batam" gambar="kamus">
        <p className="bch-lede">{judulLede(entri.length)}</p>
      </PembukaHalaman>
      <p className="bch-note" data-keterangan-bintang>
        Kata bertanda * masih menunggu pemeriksaan penutur.
      </p>
      <Kamus entri={entri} />
      <section className="bch-seksi-rapat">
        <h2 className="bch-judul-seksi">Tentang Bahasa Batam</h2>
        <div className="bch-prose">
          <p>
            Bahasa sehari-hari Batam adalah campuran Melayu, Minang, dan “Medan”, ditambah serapan dari Singapura,
            Malaysia, dan Hokkien. Pemakaiannya berbeda menurut lingkungan pergaulan. Banyak kata di sini juga dipakai di
            Riau, Johor, dan Singapura.
          </p>
          <p>BPNB Kepri mencatat 15 dialek Melayu di Kepri, termasuk Dialek Pecong di Kelurahan Pecong, Batam.</p>
        </div>
      </section>
      <p className="bch-card-meta mt-5">
        {DATA_DIHIMPUN} <TautanKirim href="/koreksi">Kirim Koreksi</TautanKirim>
      </p>
    </div>
  );
}
