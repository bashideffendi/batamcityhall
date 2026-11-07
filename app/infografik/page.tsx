import type { Metadata } from "next";
import Link from "next/link";
import PembukaBagian from "@/components/site/PembukaBagian";
import Poster from "@/features/infografik/Poster";
import "@/features/infografik/infografik.css";
import { tanggalTulisan } from "@/features/jurnal/data";
import { semuaInfografik } from "@/features/konten/baca";

export const metadata: Metadata = {
  title: "Infografik",
  description: "Data Batam dalam satu gambar.",
};

export const revalidate = 300;

export default async function DaftarInfografik() {
  const daftar = await semuaInfografik();
  return (
    <div className="bch-page">
      <PembukaBagian id="infografik" />
      <ul className="ig-kisi">
        {daftar.map((i, n) => (
          <li key={i.slug}>
            <Link href={`/infografik/${i.slug}`} prefetch={false} className="ig-kartu">
              {/* Sampul hanya hiasan: isinya dibaca di halaman infografik. */}
              <span className="ig-sampul" aria-hidden="true">
                {i.poster ? (
                  <Poster id={i.poster} />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={i.gambar?.src} alt="" width={i.gambar?.w} height={i.gambar?.h} loading={n < 3 ? "eager" : "lazy"} />
                )}
              </span>
              <span className="bch-kicker">{i.rubrik}</span>
              <span className="ig-kartu-judul">{i.judul}</span>
              <span className="bch-data">{tanggalTulisan(i.tanggal)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
