import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import kelurahanData from "@/data/wilayah/kelurahan.json";
import { kecamatanDariSlug, slugKecamatan, TEMPAT } from "@/features/direktori/data";
import KartuTempat from "@/features/direktori/KartuTempat";
import { KECAMATAN } from "@/lib/data/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return KECAMATAN.map((k) => ({ slug: slugKecamatan(k) }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const k = kecamatanDariSlug((await params).slug);
  return k ? { title: `Kecamatan ${k}`, description: `Kantor kecamatan, polsek, puskesmas, dan KUA di ${k}.` } : {};
}

const BAGIAN: { judul: string; cocok: (sub: string) => boolean }[] = [
  { judul: "Kantor kecamatan", cocok: (s) => s === "kecamatan" },
  { judul: "Puskesmas", cocok: (s) => s.startsWith("puskesmas") },
  { judul: "Polsek", cocok: (s) => s === "polsek" },
  { judul: "KUA", cocok: (s) => s === "kua" },
];

const PULAU = new Set(["Belakang Padang", "Bulang", "Galang"]);

export default async function Kecamatan({ params }: Props) {
  const nama = kecamatanDariSlug((await params).slug);
  if (!nama) notFound();
  const tempat = TEMPAT.filter((p) => p.kecamatan === nama);
  const kantorKelurahan = tempat.filter((p) => p.subkategori === "kantor_kelurahan");
  const kelurahan = kelurahanData.find((k) => k.kecamatan === nama)?.kelurahan ?? [];

  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">
        <Link href="/info">Info Warga</Link>
      </p>
      <h1 className="mt-2">Kecamatan {nama}</h1>
      <p className="bch-lede">
        {tempat.length} tempat terdata di kecamatan ini.{" "}
        <Link href={`/info/direktori?kecamatan=${encodeURIComponent(nama)}`}>Lihat semuanya</Link>.
      </p>

      {PULAU.has(nama) && (
        <p className="bch-note">
          PPAT terdekat ada di Batam Kota atau Lubuk Baja. Soal PPAT Sementara di kecamatan ini, kami belum tahu.
          Tanyakan ke <Link href="/info/urusan-tanah">Kantor Pertanahan Kota Batam</Link>.
        </p>
      )}

      {BAGIAN.map((b) => {
        const isi = tempat.filter((p) => b.cocok(p.subkategori ?? ""));
        return (
          <section key={b.judul}>
            <h2 className="mt-7 mb-4">{b.judul}</h2>
            {isi.length === 0 ? (
              <p>
                Belum ada data. Kenal tempatnya? <Link href="/koreksi">Kabari kami</Link>.
              </p>
            ) : (
              <ul className="bch-grid">
                {isi.map((p) => (
                  <li key={p.id}>
                    <KartuTempat p={p} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}

      <h2 className="mt-7 mb-4">Kelurahan</h2>
      <div className="bch-prose">
        <ul>
          {kelurahan.map((k) => {
            const kantor = kantorKelurahan.find((p) => p.kelurahan === k);
            return (
              <li key={k}>
                {kantor ? (
                  <Link href={`/info/tempat/${kantor.id}`} prefetch={false}>
                    {k}
                  </Link>
                ) : (
                  k
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
