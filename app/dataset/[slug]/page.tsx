import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cariDataset, DATASET, pratinjau, ringkasJenis, tanggalPanjang, temaDari } from "@/features/dataset/data";
import "@/features/dataset/dataset.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return DATASET.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const d = cariDataset((await params).slug);
  return d ? { title: d.judul, description: `${ringkasJenis(d)}. Penyedia: ${d.penyedia}.` } : {};
}

export default async function HalamanDataset({ params }: { params: Promise<{ slug: string }> }) {
  const d = cariDataset((await params).slug);
  if (!d) notFound();
  const tema = temaDari(d.tema);
  const p = pratinjau(d.slug);
  const info: [string, string | null | undefined][] = [
    ["Penyedia", d.penyedia],
    ["Produsen Data", d.produsen],
    ["Periode", d.periode],
    ["Satuan", d.satuan],
    ["Isi", ringkasJenis(d)],
    ["Kolom", `${d.kolom.toLocaleString("id-ID")} kolom`],
    ["Dirilis Penyedia", d.rilis],
    ["Diambil", tanggalPanjang(d.diambil)],
    ["Lisensi", "Tidak dinyatakan oleh penyedia"],
  ];
  const tampil = p?.baris.length ?? 0;
  return (
    <article className="bch-page">
      <nav className="bch-remah" aria-label="Lokasi Halaman">
        <Link href="/dataset">Dataset</Link>
        {tema && (
          <>
            {" / "}
            <Link href={`/dataset/tema/${tema.id}`}>{tema.nama}</Link>
          </>
        )}
      </nav>
      <h1 className="ds-judul">{d.judul}</h1>

      <dl className="bch-tabel-info">
        {info
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
      </dl>

      {d.catatan.length > 0 && (
        <section aria-labelledby="ds-catatan" className="ds-catatan">
          <h2 id="ds-catatan">Catatan</h2>
          <ul>
            {d.catatan.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
      )}

      {p && tampil > 0 && (
        <section aria-labelledby="ds-pratinjau">
          <h2 id="ds-pratinjau">Pratinjau</h2>
          <p className="ds-keterangan">
            {tampil < d.jumlah
              ? `${tampil.toLocaleString("id-ID")} dari ${d.jumlah.toLocaleString("id-ID")} ${d.jenis === "peta" ? "fitur" : "baris"} pertama.`
              : `Semua ${d.jumlah.toLocaleString("id-ID")} ${d.jenis === "peta" ? "fitur" : "baris"}.`}
            {d.jenis === "peta" ? " Yang ditampilkan atribut tiap fitur, tanpa bentuk petanya." : ""}
            {p.kolom.length > 3 ? " Geser tabel ke samping untuk melihat kolom lain." : ""}
          </p>
          {/* Wadah bergulir bisa difokus supaya tabel lebar tetap bisa digeser dengan papan ketik. */}
          <div className="bch-table-wrap ds-tabel" tabIndex={0} role="region" aria-label="Tabel Pratinjau">
            <table className="bch-table">
              <thead>
                <tr>
                  {p.kolom.map((k, i) => (
                    <th key={`${k}-${i}`} scope="col">
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {p.baris.map((b, i) => (
                  <tr key={i}>
                    {b.map((v, j) => (
                      <td key={j}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <p className="bch-note">
        Berkas lengkap belum bisa diunduh dari situs ini karena penyedia tidak menyatakan lisensi pakai ulang.
      </p>
    </article>
  );
}
