import Link from "next/link";
import { AlatSampul, MenuSampul } from "@/components/site/MenuSampul";
import PetaSampul from "@/components/site/PetaSampul";
import Tanggal from "@/components/site/Tanggal";
import { SITE_LOGO } from "@/lib/site";
import "./sampul.css";

export type SampulTulisan = { href: string; label: string; judul: string };

// Gambar sampul = area Harbour Bay dan Nagoya dari peta isometrik Barelang (sama dengan bingkai di lib/peta-sampul.ts),
// dibuat tools/grafis/sampul.mjs. Ponsel memakai potongan tegak supaya bangunannya tetap terbaca.
const LEBAR = [1280, 1920, 2560];
const srcset = (nama: string, lebar: number[]) => lebar.map((w) => `/grafis/sampul/${nama}-${w}.webp ${w}w`).join(", ");

/**
 * Sampul beranda (purwarupa 9 Nov 2026). Yang mengikuti pola sampul majalah hanya posisinya: gambar selebar layar dan
 * menu di pita bawah; menu yang diklik membuka halaman dengan kepala normal. Huruf dan warna tetap milik situs.
 */
export default function SampulBeranda({ tulisan }: { tulisan: SampulTulisan | null }) {
  return (
    <section className="bch-sampul" aria-label="Sampul">
      <picture>
        <source media="(max-aspect-ratio: 4/5)" srcSet={srcset("barelang-tegak", [720, 1080])} sizes="100vw" />
        {/* Gambar sudah diolah tools/grafis/sampul.mjs dan dipilih lewat <picture>, jadi tidak lewat next/image. */}
        <img
          src="/grafis/sampul/barelang-1920.webp"
          srcSet={srcset("barelang", LEBAR)}
          sizes="100vw"
          width={1920}
          height={960}
          alt="Peta isometrik Barelang di sekitar Harbour Bay dan Nagoya: laut di kiri, kota padat bangunan, dan bukit hijau di atas"
          fetchPriority="high"
          decoding="async"
        />
      </picture>
      {/* Peta interaktif di atas gambar sampul; muncul setelah ubinnya selesai digambar. */}
      <PetaSampul />
      <div className="bch-sampul-atas">
        <Link href="/" className="bch-sampul-merek">
          {SITE_LOGO}
        </Link>
        <div className="bch-sampul-kanan">
          <Tanggal className="bch-sampul-tanggal" />
          <AlatSampul />
        </div>
      </div>
      {tulisan && (
        <div className="bch-sampul-isi">
          <p className="bch-sampul-label">{tulisan.label}</p>
          <h2 className="bch-sampul-judul">
            <Link href={tulisan.href} prefetch={false}>
              <span>{tulisan.judul}</span>
            </Link>
          </h2>
        </div>
      )}
      {/* Standar Redaksi: gambar AI diberi keterangan di dekat gambarnya. Atribusi OpenStreetMap wajib (ODbL). */}
      <p className="bch-sampul-atribusi">Ilustrasi dibuat dengan AI dari data peta © kontributor OpenStreetMap</p>
      <MenuSampul />
    </section>
  );
}
