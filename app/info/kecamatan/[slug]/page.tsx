import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import kelurahanData from "@/data/wilayah/kelurahan.json";
import CatatanData from "@/features/direktori/CatatanData";
import { kecamatanDariSlug, punyaHalaman, slugKecamatan, TEMPAT } from "@/features/direktori/data";
import KartuTempat from "@/features/direktori/KartuTempat";
import { KECAMATAN } from "@/lib/data/schema";

export function generateStaticParams() {
  return KECAMATAN.map((k) => ({ slug: slugKecamatan(k) }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const k = kecamatanDariSlug((await params).slug);
  return k
    ? { title: `Kecamatan ${k}`, description: `Kantor kecamatan, puskesmas, polsek, dan KUA di Kecamatan ${k}.` }
    : {};
}

const BAGIAN: { judul: string; cocok: (sub: string) => boolean }[] = [
  { judul: "Kantor Kecamatan", cocok: (s) => s === "kecamatan" },
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
      <nav className="bch-remah" aria-label="Remah roti">
        <Link href="/info">Layanan Warga</Link>
      </nav>
      <h1 className="mt-2">Kecamatan {nama}</h1>
      <p className="bch-lede">Ada {tempat.length} tempat tercatat.</p>
      <p>
        <Link href={`/info/direktori?kecamatan=${encodeURIComponent(nama)}`}>Lihat semua tempat</Link>
      </p>

      {PULAU.has(nama) && (
        <p className="bch-note">
          PPAT terdekat ada di Batam Kota atau Lubuk Baja. Panduannya ada di{" "}
          <Link href="/info/urusan-tanah">Urusan Tanah dan Rumah</Link>.
        </p>
      )}

      {BAGIAN.map((b) => {
        const isi = tempat.filter((p) => b.cocok(p.subkategori ?? ""));
        if (isi.length === 0) return null;
        return (
          <section key={b.judul}>
            <h2 className="mt-7 mb-4">{b.judul}</h2>
            <ul className="bch-daftar-baris" data-kolom="2">
              {isi.map((p) => (
                <li key={p.id}>
                  <KartuTempat p={p} />
                </li>
              ))}
            </ul>
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
                {kantor && punyaHalaman(kantor) ? (
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

      <CatatanData />
    </div>
  );
}
