import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { INFOGRAFIK_REPO } from "@/features/infografik/data";
import Poster from "@/features/infografik/Poster";
import "@/features/infografik/infografik.css";
import { tanggalTulisan } from "@/features/jurnal/data";
import { semuaInfografik } from "@/features/konten/baca";

export const revalidate = 300;

export function generateStaticParams() {
  return INFOGRAFIK_REPO.map((i) => ({ slug: i.slug }));
}

const cari = async (slug: string) => (await semuaInfografik()).find((i) => i.slug === slug);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const i = await cari((await params).slug);
  return i ? { title: i.judul, description: i.ringkasan } : {};
}

export default async function HalamanInfografik({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const semua = await semuaInfografik();
  const i = semua.find((x) => x.slug === slug);
  if (!i) notFound();
  const lain = semua.filter((x) => x.slug !== slug).slice(0, 3);

  return (
    <article className="bch-page ig-detail">
      <nav className="bch-remah" aria-label="Lokasi Halaman">
        <Link href="/infografik">Infografik</Link> / {i.rubrik}
      </nav>
      <h1>{i.judul}</h1>
      <p className="bch-data m-0">
        {i.penulis} · {tanggalTulisan(i.tanggal)}
      </p>
      <figure className="ig-figur">
        {i.poster ? (
          <Poster id={i.poster} />
        ) : (
          i.gambar && <Image src={i.gambar.src} alt={i.gambar.deskripsi} width={i.gambar.w} height={i.gambar.h} unoptimized priority />
        )}
      </figure>
      <p className="bch-measure">{i.ringkasan}</p>
      {i.gambar && (
        <details className="ig-teks-alternatif">
          <summary>Isi Infografik dalam Teks</summary>
          <p className="bch-measure">{i.gambar.deskripsi}</p>
        </details>
      )}
      {i.terkait && (
        <p>
          <Link href={i.terkait.href} className="bch-aksi" prefetch={false}>
            {i.terkait.teks} →
          </Link>
        </p>
      )}

      {lain.length > 0 && (
        <section className="bch-seksi-rapat" aria-labelledby="ig-lain">
          <h2 id="ig-lain" className="bch-judul-seksi">
            Infografik Lain
          </h2>
          <ul className="ig-kisi">
            {lain.map((x) => (
              <li key={x.slug}>
                <Link href={`/infografik/${x.slug}`} prefetch={false} className="ig-kartu">
                  <span className="ig-sampul" aria-hidden="true">
                    {x.poster ? (
                      <Poster id={x.poster} />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={x.gambar?.src} alt="" width={x.gambar?.w} height={x.gambar?.h} loading="lazy" />
                    )}
                  </span>
                  <span className="ig-kartu-judul">{x.judul}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
