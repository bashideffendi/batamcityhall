import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/site/JsonLd";
import { tanggalTulisan, TULISAN } from "@/features/jurnal/data";
import { semuaTulisan } from "@/features/konten/baca";
import { artikel, grafLd, organisasi } from "@/lib/data-terstruktur";

export const revalidate = 300;

const cariTulisan = async (slug: string) => (await semuaTulisan()).find((t) => t.slug === slug);

export function generateStaticParams() {
  return TULISAN.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = await cariTulisan(slug);
  return t ? { title: t.judul, description: t.ringkasan, authors: [{ name: t.penulis }] } : {};
}

export default async function HalamanTulisan({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = await cariTulisan(slug);
  if (!t) notFound();
  return (
    <article className="bch-page bch-tulisan">
      <JsonLd
        data={grafLd(
          artikel({ judul: t.judul, ringkasan: t.ringkasan, tanggal: t.tanggal, gambar: t.gambar, alamat: `/jurnal/${t.slug}`, penulis: t.penulis }),
          organisasi(),
        )}
      />
      <header>
        <nav className="bch-remah" aria-label="Lokasi Halaman">
          <Link href="/jurnal">Jurnal</Link> / {t.rubrik}
        </nav>
        <h1>{t.judul}</h1>
        <p className="bch-tulisan-dek">{t.ringkasan}</p>
        <p className="bch-tulisan-byline">
          <span>Oleh {t.penulis}</span>
          <time dateTime={t.tanggal}>{tanggalTulisan(t.tanggal)}</time>
        </p>
      </header>
      <Image className="bch-grafis" src={t.gambar} alt="" width={1200} height={800} unoptimized priority />
      <div className="bch-tulisan-isi">
        {t.isi.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      {t.tautan && (
        <p className="bch-tulisan-kaki">
          <Link href={t.tautan.href} className="bch-aksi" prefetch={false}>
            {t.tautan.label} →
          </Link>
        </p>
      )}
    </article>
  );
}
