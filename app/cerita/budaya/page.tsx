import type { Metadata } from "next";
import Link from "next/link";
import {
  daftarTradisi,
  pengantarPublik,
  PENGANTAR_BUDAYA,
  TERAKHIR_DICEK,
  type TradisiPublik,
} from "@/features/budaya/data";
import NavBudaya, { KickerCerita } from "@/features/budaya/NavBudaya";
import "@/features/budaya/budaya.css";

export const metadata: Metadata = {
  title: "Budaya Melayu",
  description:
    "Kenalan sama tuan rumah: tradisi Melayu Kepri yang hidup di Batam, satu kartu per tradisi, dengan sumber.",
};

const LUAR = { target: "_blank", rel: "noopener noreferrer" } as const;

function Kartu({ t, nomor }: { t: TradisiPublik; nomor: number }) {
  return (
    <article id={t.id} data-tradisi={t.id} className="bch-card bud-kartu">
      <p className="bch-kicker-row bch-kicker m-0">
        <span>Kenalan Sama Tuan Rumah</span>
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
      <p className="bch-card-meta mt-3 mb-0">
        {t.sumber.length > 0 ? (
          t.sumber.map((s) => (
            <span key={s.href}>
              Sumber:{" "}
              <a href={s.href} {...LUAR}>
                {s.label}
              </a>
            </span>
          ))
        ) : (
          <span>Belum ada sumber tertulis</span>
        )}
      </p>
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
  const bersumber = semua.filter((t) => t.sumber.length > 0);
  const belum = semua.filter((t) => t.sumber.length === 0);
  return (
    <div className="bch-page">
      <KickerCerita />
      <h1 className="mt-2">Budaya Melayu</h1>
      <p className="bch-lede">{PENGANTAR_BUDAYA.tuanRumah}</p>
      <div className="bch-prose">
        <p>
          {pengantarPublik(PENGANTAR_BUDAYA.panggung)} Melayu sebagai tuan rumah, dengan komunitas besar dari Sumatra
          Utara, Sumatra Barat, Jawa, Tionghoa, NTT, Sulawesi, dan lain-lain.
        </p>
        <p>
          Sebagian besar tradisi ini milik Melayu Kepri secara luas, bukan asli Batam. Joget dangkong dikaitkan dengan
          Moro, Karimun. Gurindam Dua Belas lahir di Pulau Penyengat.
        </p>
        <p>
          WBTb di kartu berarti Warisan Budaya Takbenda. Daftar resminya ada di{" "}
          <a href="https://warisanbudaya.kemdikbud.go.id/" {...LUAR}>
            warisanbudaya.kemdikbud.go.id
          </a>
          .
        </p>
        <p className="bch-card-meta">Terakhir dicek {TERAKHIR_DICEK}</p>
      </div>

      <section>
        <h2 className="mt-7 mb-3">Yang sudah ada sumber tertulisnya</h2>
        <ul className="bch-grid">
          {bersumber.map((t) => (
            <li key={t.id}>
              <Kartu t={t} nomor={semua.indexOf(t) + 1} />
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mt-7 mb-3">Yang belum ada sumber tertulisnya</h2>
        <p className="bch-note" data-tone="caution">
          Enam kartu ini pengetahuan umum yang belum kami cocokkan ke LAM atau Dinas Kebudayaan. Anggap sebagai
          pengantar, bukan rujukan. Punya sumbernya? <Link href="/kontribusi">Kabari kami</Link>.
        </p>
        <ul className="bch-grid mt-4">
          {belum.map((t) => (
            <li key={t.id}>
              <Kartu t={t} nomor={semua.indexOf(t) + 1} />
            </li>
          ))}
        </ul>
      </section>

      <NavBudaya kini="/cerita/budaya" />
    </div>
  );
}
