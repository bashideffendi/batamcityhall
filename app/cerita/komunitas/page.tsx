import type { Metadata } from "next";
import Link from "next/link";
import { daftarKomunitas, TERAKHIR_DICEK } from "@/features/budaya/data";
import NavBudaya, { KickerCerita } from "@/features/budaya/NavBudaya";
import "@/features/budaya/budaya.css";

export const metadata: Metadata = {
  title: "Komunitas",
  description:
    "Komunitas dan lembaga budaya, seni, lari, dan media di Batam yang punya jejak tertulis. Tanpa kontak pribadi.",
};

const LUAR = { target: "_blank", rel: "noopener noreferrer" } as const;

export default function HalamanKomunitas() {
  const semua = daftarKomunitas();
  return (
    <div className="bch-page">
      <KickerCerita />
      <h1 className="mt-2">Komunitas</h1>
      <p className="bch-lede">Yang punya jejak tertulis. Tentu lebih banyak lagi yang belum tercatat di sini.</p>
      <div className="bch-prose">
        <p>
          Kanal hanya kami tulis kalau sudah dicek. Sisanya tertulis &ldquo;kanal belum dicek&rdquo;. Nomor HP dan
          kontak pribadi pengurus tidak kami muat. Masuk daftar ini bukan berarti kami mendukung atau bekerja sama.
        </p>
        <p className="bch-card-meta">Terakhir dicek {TERAKHIR_DICEK}</p>
      </div>

      <ul className="bch-grid mt-5">
        {semua.map((k) => (
          <li key={k.id}>
            <article id={k.id} data-komunitas={k.id} className="bch-card bud-kartu">
              <h2>{k.nama}</h2>
              <p className="bch-card-loc">{k.bidang}</p>
              <hr className="bch-card-rule" />
              <div className="bch-rebung-mini" aria-hidden="true" />
              {k.anggota.length > 0 && (
                <ul className="bud-anggota">
                  {k.anggota.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              )}
              <p className="mt-2 mb-0" data-kanal={k.kanal ? "ada" : "belum"}>
                {k.kanal ? (
                  k.kanal.href ? (
                    <a href={k.kanal.href} {...LUAR}>
                      {k.kanal.teks}
                    </a>
                  ) : (
                    k.kanal.teks
                  )
                ) : (
                  <span className="bud-kanal-kosong">Kanal belum dicek</span>
                )}
              </p>
              <div className="bch-badges mt-3">
                <span className="bch-badge" data-tone={k.status.nada}>
                  {k.status.teks}
                </span>
              </div>
              <p className="bch-card-meta mt-3 mb-0">
                Sumber:{" "}
                {k.sumber.map((s, i) => (
                  <span key={s.href}>
                    {i > 0 && ", "}
                    <a href={s.href} {...LUAR}>
                      {s.label}
                    </a>
                  </span>
                ))}
              </p>
            </article>
          </li>
        ))}
      </ul>

      <section>
        <h2 className="mt-7 mb-3">Belum ketemu sumbernya</h2>
        <p className="bch-measure">
          Sanggar seni Melayu, komunitas fotografi, ilustrator dan desainer, kolektif seni atau galeri, taman baca, dan
          komunitas sepeda. Pasti ada, kami saja yang belum menemukan sumber tertulisnya.{" "}
          <Link href="/kontribusi">Kenal salah satunya?</Link>
        </p>
      </section>

      <NavBudaya kini="/cerita/komunitas" />
    </div>
  );
}
