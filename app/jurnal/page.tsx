import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PembukaBagian from "@/components/site/PembukaBagian";
import { tanggalTulisan } from "@/features/jurnal/data";
import { semuaTulisan } from "@/features/konten/baca";

export const metadata: Metadata = {
  title: "Jurnal",
  description: "Tulisan tentang Batam.",
};

export const revalidate = 300;

export default async function Jurnal() {
  const tulisan = await semuaTulisan();
  return (
    <div className="bch-page">
      <PembukaBagian id="jurnal" />
      <ul className="bch-jurnal-daftar">
        {tulisan.map((t) => (
          <li key={t.slug}>
            <Link href={`/jurnal/${t.slug}`} prefetch={false}>
              <Image className="bch-grafis" src={t.gambar} alt="" width={720} height={480} unoptimized priority />
              <span className="teks">
                <span className="bch-kicker">{t.rubrik}</span>
                <span className="judul">{t.judul}</span>
                <span className="ringkas">{t.ringkasan}</span>
                <span className="bch-data">
                  {t.penulis} · {tanggalTulisan(t.tanggal)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
