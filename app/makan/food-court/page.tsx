import type { Metadata } from "next";
import Link from "next/link";
import { IkonLingkaran, KATEGORI_DIREKTORI } from "@/components/map/icons";
import PetaKategori from "@/features/direktori/PetaKategori";
import { places } from "@/features/makan/lib/data";
import { FOOD_COURT, kelompokFoodCourt, tautanFoodCourt } from "@/features/makan/lib/foodcourt";

export const metadata: Metadata = {
  title: "Food Court",
  description: `${FOOD_COURT.length} food court dan pujasera di Batam, per kecamatan, dengan alamat dan jam buka.`,
};

/** Tempat yang menunjuk food court ini. */
const geraiDi = (id: string) => places.filter((p) => p.food_court === id);
const ikon = KATEGORI_DIREKTORI.find((k) => k.nama === "Kuliner");

export default function HalamanFoodCourt() {
  const berTitik = FOOD_COURT.filter((f) => f.lat !== null && f.lng !== null);
  return (
    <div className="bch-page">
      <nav className="bch-remah" aria-label="Remah roti">
        <Link href="/makan" prefetch={false}>
          Makanan
        </Link>{" "}
        / Food Court
      </nav>
      <div className="mk-fc-kepala">
        {ikon && <IkonLingkaran glyph={ikon.glyph} warna={ikon.warna} ukuran={40} />}
        <h1 className="m-0">Food Court</h1>
      </div>
      <p className="bch-lede">
        {FOOD_COURT.length} food court dan pujasera di Batam, per kecamatan.
      </p>

      {berTitik.length > 0 && ikon && (
        <div className="mk-fc-peta">
          <PetaKategori
            pins={berTitik.map((f) => ({ id: f.id, nama: f.nama, lat: f.lat as number, lng: f.lng as number, perkiraan: false }))}
            glyph={ikon.glyph}
            warna={ikon.warna}
            dasarTautan="/makan/food-court#"
          />
        </div>
      )}

      {kelompokFoodCourt().map((k) => (
        <section key={k.kecamatan} className="bch-seksi-rapat" aria-labelledby={`fc-${k.kecamatan}`}>
          <h2 id={`fc-${k.kecamatan}`} className="bch-judul-seksi">
            {k.kecamatan} <span className="bch-data">{k.isi.length}</span>
          </h2>
          <ul className="mk-fc-daftar">
            {k.isi.map((f) => (
              <li key={f.id} id={f.id} data-food-court={f.id} className="mk-fc-baris">
                <div>
                  <h3>{f.nama}</h3>
                  <p className="mk-fc-alamat">{f.alamat}</p>
                  {f.isi && <p className="mk-fc-isi">{f.isi}</p>}
                  {geraiDi(f.id).length > 0 && (
                    <p className="mk-fc-terkait">
                      <b>Tempat di Sini</b>{" "}
                      {geraiDi(f.id).map((p, i) => (
                        <span key={p.id}>
                          {i > 0 && ", "}
                          <Link href={`/makan/tempat/${p.id}`} prefetch={false}>
                            {p.name}
                          </Link>
                        </span>
                      ))}
                    </p>
                  )}
                </div>
                <div className="mk-fc-samping">
                  {f.jam && (
                    <p>
                      <b>Jam Buka</b> {f.jam}
                    </p>
                  )}
                  {f.tingkat === "daftar" && <p className="mk-fc-cek">Alamat Perlu Dicek</p>}
                  <a href={tautanFoodCourt(f)} target="_blank" rel="noopener noreferrer" className="bch-btn" data-variant="ghost">
                    Petunjuk Arah
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="bch-catatan-halaman">
        Belum kami datangi satu per satu. Alamat dan jam dihimpun dari media dan panduan perjalanan pada November 2026, jadi
        pastikan sebelum berangkat.
      </p>
    </div>
  );
}
