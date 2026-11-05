import type { Metadata } from "next";
import Link from "next/link";
import { DATA_DIHIMPUN, daftarKomunitas } from "@/features/budaya/data";
import NavBudaya, { KickerCerita } from "@/features/budaya/NavBudaya";
import "@/features/budaya/budaya.css";

const LEDE = "Halaman ini memuat komunitas kreatif, olahraga, dan budaya di Batam.";

export const metadata: Metadata = {
  title: "Komunitas",
  description: LEDE,
};

const LUAR = { target: "_blank", rel: "noopener noreferrer" } as const;

export default function HalamanKomunitas() {
  const semua = daftarKomunitas();
  return (
    <div className="bch-page">
      <KickerCerita />
      <h1 className="mt-2">Komunitas</h1>
      <p className="bch-lede">{LEDE}</p>
      <div className="bch-prose">
        <p>
          Nomor ponsel dan kontak pribadi pengurus tidak dimuat. Masuk daftar ini bukan berarti kami mendukung atau
          bekerja sama.
        </p>
        <p className="bch-card-meta">{DATA_DIHIMPUN}</p>
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
              {k.kanal && (
                <p className="mt-2 mb-0" data-kanal="ada">
                  {k.kanal.href ? (
                    <a href={k.kanal.href} {...LUAR}>
                      {k.kanal.teks}
                    </a>
                  ) : (
                    k.kanal.teks
                  )}
                </p>
              )}
              <div className="bch-badges mt-3">
                <span className="bch-badge" data-tone={k.status.nada}>
                  {k.status.teks}
                </span>
              </div>
            </article>
          </li>
        ))}
      </ul>

      <section>
        <h2 className="mt-7 mb-3">Belum Ada di Daftar</h2>
        <p className="bch-measure">
          Sanggar seni Melayu, komunitas fotografi, ilustrator dan desainer, kolektif seni atau galeri, taman baca, dan
          komunitas sepeda belum tercatat di sini. Kalau kamu tahu komunitasnya,{" "}
          <Link href="/kontribusi">kirim usulan</Link>.
        </p>
      </section>

      <NavBudaya kini="/cerita/komunitas" />
    </div>
  );
}
