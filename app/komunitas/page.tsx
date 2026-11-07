import type { Metadata } from "next";
import { KIRIMAN_AKTIF } from "@/lib/site";
import Link from "next/link";
import PembukaBagian from "@/components/site/PembukaBagian";
import { DATA_DIHIMPUN, daftarKomunitas } from "@/features/budaya/data";
import { bagianDari } from "@/lib/site";
import "@/features/budaya/budaya.css";
import TautanInstagram from "@/components/site/TautanInstagram";

export const metadata: Metadata = {
  title: "Komunitas",
  description: bagianDari("komunitas").lede,
};

const LUAR = { target: "_blank", rel: "noopener noreferrer" } as const;

export default function HalamanKomunitas() {
  const semua = daftarKomunitas();
  return (
    <div className="bch-page">
      <PembukaBagian id="komunitas" />

      <ul className="bud-daftar bch-seksi-rapat">
        {semua.map((k) => (
          <li key={k.id} id={k.id} data-komunitas={k.id} className="bud-baris">
            <div>
              <h2 className="bud-nama">{k.nama}</h2>
              <p className="bud-bidang">{k.bidang}</p>
              {k.anggota.length > 0 && (
                <ul className="bud-anggota">
                  {k.anggota.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="bud-samping">
              {k.kanal && (
                <p className="m-0" data-kanal="ada">
                  {k.kanal.instagram ? (
                    <TautanInstagram akun={k.kanal.instagram} href={k.kanal.href ?? undefined} />
                  ) : k.kanal.href ? (
                    <a href={k.kanal.href} {...LUAR}>
                      {k.kanal.teks}
                    </a>
                  ) : (
                    k.kanal.teks
                  )}
                </p>
              )}
              {k.status.teks !== "Tercatat" && (
                <span className="bch-badge" data-tone={k.status.nada}>
                  {k.status.teks}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>

      <section className="bch-seksi-rapat">
        <h2 className="bch-judul-seksi">Belum Ada di Daftar</h2>
        <p className="bch-measure">
          Sanggar seni Melayu, komunitas fotografi, ilustrator dan desainer, kolektif seni atau galeri, taman baca, dan
          komunitas sepeda belum tercatat.{" "}
          {KIRIMAN_AKTIF && (
            <>
              Bila tahu komunitasnya, <Link href="/kontribusi">kirim usulan</Link>.
            </>
          )}
        </p>
        <p className="bch-catatan-halaman">
          Nomor ponsel dan kontak pribadi pengurus tidak dimuat. Masuk daftar ini bukan berarti kami mendukung atau bekerja
          sama. {DATA_DIHIMPUN}
        </p>
      </section>
    </div>
  );
}
