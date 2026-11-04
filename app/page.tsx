import Link from "next/link";
import BeritaWidget from "@/features/berita/BeritaWidget";
import HariIniMuat from "@/features/hari-ini/HariIniMuat";
import PetaMuat from "@/features/peta/PetaMuat";
import { LOKET, LOKET_DIBUKA, SITE_TAGLINE, type Loket } from "@/lib/site";

function IsiKartu({ loket, dibuka }: { loket: Loket; dibuka: boolean }) {
  return (
    <>
      <div className="bch-kicker-row bch-kicker">
        <span>Loket {loket.nomor}</span>
        {!dibuka && <span>Belum dibuka</span>}
      </div>
      <h3>{loket.nama}</h3>
      <hr className="bch-card-rule" />
      <p className="m-0">{loket.lede}</p>
    </>
  );
}

export default function Beranda() {
  return (
    <>
      <PetaMuat />
      <div className="bch-page">
        <h1 className="bch-display m-0">{SITE_TAGLINE}.</h1>
        <p className="bch-lede">
          Peta laut, hujan, feri, direktori, cerita. Tanpa iklan, tanpa listing berbayar. Sebagian besar datanya belum
          dicek ulang di lapangan, dan kami menulisnya terang-terangan.
        </p>
        <HariIniMuat />
        <BeritaWidget />
        <div className="bch-rebung" aria-hidden="true" />
        <h2 className="mb-5">Daftar loket</h2>
        <ol className="bch-grid">
          {LOKET.map((l) => {
            const dibuka = LOKET_DIBUKA.includes(l.nomor);
            return (
              <li key={l.nomor}>
                {dibuka ? (
                  <Link href={l.href} className="bch-card h-full">
                    <IsiKartu loket={l} dibuka />
                  </Link>
                ) : (
                  <div className="bch-card h-full">
                    <IsiKartu loket={l} dibuka={false} />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}
