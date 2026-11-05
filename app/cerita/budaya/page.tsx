import { kaidahJudul } from "@/lib/judul";
import PembukaHalaman from "@/components/site/PembukaHalaman";
import type { Metadata } from "next";
import Link from "next/link";
import {
  DATA_DIHIMPUN,
  daftarTradisi,
  pengantarPublik,
  PENGANTAR_BUDAYA,
  type TradisiPublik,
} from "@/features/budaya/data";
import "@/features/budaya/budaya.css";

const LEDE = "Tradisi Melayu ini masih dijalankan di Batam dan Kepulauan Riau.";

export const metadata: Metadata = {
  title: "Budaya Melayu",
  description: LEDE,
};

function BarisTradisi({ t }: { t: TradisiPublik }) {
  return (
    <article id={t.id} data-tradisi={t.id} className="bud-baris">
      <div>
        <h3 className="bud-nama">{kaidahJudul(t.nama)}</h3>
        <p className="bud-uraian">{t.penjelasan}</p>
      </div>
      <div className="bud-samping">
        <span className="bch-badge" data-tone={t.status.nada}>
          {t.status.teks}
        </span>
        {t.kalender && (
          <Link href={`/things-to-do#${t.kalender}`} prefetch={false}>
            Lihat di Things to Do
          </Link>
        )}
      </div>
    </article>
  );
}

export default function HalamanBudaya() {
  const semua = daftarTradisi();
  return (
    <div className="bch-page">
      <PembukaHalaman judul="Budaya Melayu" gambar="budaya">
        <p className="bch-lede">{LEDE}</p>
      </PembukaHalaman>
      <div className="bch-prose">
        <p>
          {PENGANTAR_BUDAYA.tuanRumah} {pengantarPublik(PENGANTAR_BUDAYA.panggung)} Komunitas besar lain datang dari
          Sumatra Utara, Sumatra Barat, Jawa, Tionghoa, NTT, Sulawesi, dan daerah lainnya.
        </p>
        <p>
          Sebagian besar tradisi ini milik Melayu Kepri secara luas, bukan asli Batam. Joget dangkong dikaitkan dengan
          Moro, Karimun. Gurindam Dua Belas lahir di Pulau Penyengat.
        </p>
      </div>

      <section className="bch-seksi-rapat">
        <h2 className="bch-judul-seksi">Daftar Tradisi</h2>
        <ul className="bud-daftar">
          {semua.map((t) => (
            <li key={t.id}>
              <BarisTradisi t={t} />
            </li>
          ))}
        </ul>
        <p className="bch-catatan-halaman">WBTb: Warisan Budaya Takbenda. {DATA_DIHIMPUN}</p>
      </section>

    </div>
  );
}
