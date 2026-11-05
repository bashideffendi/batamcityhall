import { kaidahJudul } from "@/lib/judul";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { IkonLingkaran, KATEGORI_DIREKTORI } from "@/components/map/icons";
import CatatanData from "@/features/direktori/CatatanData";
import { DAFTAR_KATEGORI, slugKategori, slugKecamatan, tempatDiKategori, TEMPAT } from "@/features/direktori/data";
import Penjelajah from "@/features/direktori/Penjelajah";
import { KECAMATAN } from "@/lib/data/schema";

export const metadata: Metadata = {
  title: "Direktori",
  description: "Daftar tempat di Batam menurut keperluan, tanpa bayaran untuk masuk daftar.",
};

const ikonKategori = (nama: string) => KATEGORI_DIREKTORI.find((k) => k.nama === nama);

export default function Direktori() {
  return (
    <div className="bch-page">
      <Penjelajah
        kategori={DAFTAR_KATEGORI.map(({ kategori, nama }) => ({ kategori, nama }))}
        kepala={
          <>
            <nav className="bch-remah" aria-label="Remah roti">
              <Link href="/info">Informasi Warga</Link> / <span aria-current="page">Direktori</span>
            </nav>
            <h1 className="mt-2">Direktori</h1>
            <p className="bch-lede">
              Sebanyak {TEMPAT.length.toLocaleString("id-ID")} tempat di Batam tercatat, tanpa bayaran untuk masuk
              daftar.
            </p>
          </>
        }
        ilustrasi={<Image className="bch-grafis" src="/grafis/loket-informasi.webp" alt="" width={480} height={480} priority unoptimized />}
      >
        <section className="bch-seksi" aria-labelledby="dir-keperluan">
          <h2 id="dir-keperluan" className="bch-kicker bch-kepala-penanda">
            Menurut keperluan
          </h2>
          <ul className="bch-daftar-kategori" data-kategori-grid>
            {DAFTAR_KATEGORI.map((k) => {
              const ikon = ikonKategori(k.nama);
              return (
                <li key={k.kategori}>
                  <Link href={`/info/direktori/${slugKategori(k.kategori)}`} prefetch={false}>
                    {ikon && <IkonLingkaran glyph={ikon.glyph} warna={ikon.warna} ukuran={40} />}
                    <span className="nama" data-kategori={k.kategori}>
                      {kaidahJudul(k.nama)}
                    </span>
                    <span className="bch-data jumlah">{tempatDiKategori(k.kategori).length.toLocaleString("id-ID")}</span>
                    <span className="ket">{k.keterangan}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
        <section className="bch-seksi" aria-labelledby="dir-kecamatan">
          <h2 id="dir-kecamatan" className="bch-kicker bch-kepala-penanda">
            Menurut kecamatan
          </h2>
          <ul className="bch-daftar-kecamatan">
            {KECAMATAN.map((k) => (
              <li key={k}>
                <Link href={`/info/kecamatan/${slugKecamatan(k)}`} prefetch={false}>
                  {k}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Penjelajah>

      <CatatanData />
    </div>
  );
}
