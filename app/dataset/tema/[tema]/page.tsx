import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { datasetDiTema, ringkasJenis, TEMA, temaDari } from "@/features/dataset/data";
import "@/features/dataset/dataset.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return TEMA.map((t) => ({ tema: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ tema: string }> }): Promise<Metadata> {
  const t = temaDari((await params).tema);
  return t
    ? { title: `${t.nama}: Dataset`, description: `${t.jumlah} dataset tentang Kota Batam bertema ${t.nama}.` }
    : {};
}

export default async function TemaDataset({ params }: { params: Promise<{ tema: string }> }) {
  const t = temaDari((await params).tema);
  if (!t) notFound();
  const daftar = datasetDiTema(t.id);
  return (
    <div className="bch-page">
      <nav className="bch-remah" aria-label="Lokasi Halaman">
        <Link href="/dataset">Dataset</Link> / {t.nama}
      </nav>
      <h1>{t.nama}</h1>
      <p className="bch-lede">{daftar.length.toLocaleString("id-ID")} dataset.</p>
      <ul className="ds-daftar">
        {daftar.map((d) => (
          <li key={d.slug}>
            <Link href={`/dataset/${d.slug}`} prefetch={false} className="ds-daftar-judul">
              {d.judul}
            </Link>
            <span className="bch-data">{[d.penyedia, ringkasJenis(d), d.periode].filter(Boolean).join(" · ")}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
