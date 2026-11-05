import type { Metadata } from "next";
import Link from "next/link";
import {
  DATA_DIHIMPUN,
  daftarTradisi,
  pengantarPublik,
  PENGANTAR_BUDAYA,
  type TradisiPublik,
} from "@/features/budaya/data";
import NavBudaya, { KickerCerita } from "@/features/budaya/NavBudaya";
import "@/features/budaya/budaya.css";

const LEDE = "Halaman ini merangkum tradisi Melayu yang masih dijalankan di Batam dan Kepulauan Riau.";

export const metadata: Metadata = {
  title: "Budaya Melayu",
  description: LEDE,
};

function Kartu({ t, nomor }: { t: TradisiPublik; nomor: number }) {
  return (
    <article id={t.id} data-tradisi={t.id} className="bch-card bud-kartu">
      <p className="bch-kicker-row bch-kicker m-0">
        <span>Tradisi</span>
        <span className="bud-nomor">{String(nomor).padStart(2, "0")}</span>
      </p>
      <h3>{t.nama}</h3>
      <hr className="bch-card-rule" />
      <div className="bch-rebung-mini" aria-hidden="true" />
      <p className="m-0">{t.penjelasan}</p>
      <div className="bch-badges mt-3">
        <span className="bch-badge" data-tone={t.status.nada}>
          {t.status.teks}
        </span>
      </div>
      {t.kalender && (
        <p className="mt-1 mb-0">
          <Link className="bud-tautan-kaki" href={`/cerita/kalender#${t.kalender}`} prefetch={false}>
            Lihat di kalender
          </Link>
        </p>
      )}
    </article>
  );
}

export default function HalamanBudaya() {
  const semua = daftarTradisi();
  return (
    <div className="bch-page">
      <KickerCerita />
      <h1 className="mt-2">Budaya Melayu</h1>
      <p className="bch-lede">{LEDE}</p>
      <div className="bch-prose">
        <p>
          {PENGANTAR_BUDAYA.tuanRumah} {pengantarPublik(PENGANTAR_BUDAYA.panggung)} Komunitas besar lain datang dari
          Sumatra Utara, Sumatra Barat, Jawa, Tionghoa, NTT, Sulawesi, dan daerah lainnya.
        </p>
        <p>
          Sebagian besar tradisi ini milik Melayu Kepri secara luas, bukan asli Batam. Joget dangkong dikaitkan dengan
          Moro, Karimun. Gurindam Dua Belas lahir di Pulau Penyengat.
        </p>
        <p>WBTb di kartu berarti Warisan Budaya Takbenda.</p>
        <p className="bch-card-meta">{DATA_DIHIMPUN}</p>
      </div>

      <section>
        <h2 className="mt-7 mb-3">Daftar Tradisi</h2>
        <ul className="bch-grid">
          {semua.map((t, i) => (
            <li key={t.id}>
              <Kartu t={t} nomor={i + 1} />
            </li>
          ))}
        </ul>
      </section>

      <NavBudaya kini="/cerita/budaya" />
    </div>
  );
}
