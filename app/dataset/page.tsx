import type { Metadata } from "next";
import Link from "next/link";
import PembukaBagian from "@/components/site/PembukaBagian";
import { contohTema, DATASET, PENYEDIA, TEMA } from "@/features/dataset/data";
import "@/features/dataset/dataset.css";

export const metadata: Metadata = {
  title: "Dataset",
  description: `${DATASET.length} dataset tentang Kota Batam dari lima portal data, dikumpulkan di satu tempat.`,
};

export default function DaftarDataset() {
  return (
    <div className="bch-page">
      <PembukaBagian
        id="dataset"
        lede={`${DATASET.length.toLocaleString("id-ID")} dataset tentang Kota Batam dari ${PENYEDIA.length} portal data, dikumpulkan di satu tempat.`}
      />

      <section aria-labelledby="ds-tema-judul" className="ds-seksi">
        <h2 id="ds-tema-judul" className="bch-judul-seksi">
          Menurut Tema
        </h2>
        <ul className="ds-tema">
          {TEMA.map((t) => (
            <li key={t.id}>
              <Link href={`/dataset/tema/${t.id}`} className="ds-tema-kartu">
                <span className="ds-tema-nama">{t.nama}</span>
                <span className="bch-data">{t.jumlah.toLocaleString("id-ID")} dataset</span>
                <span className="ds-tema-contoh">
                  {contohTema(t.id)
                    .map((d) => d.judul)
                    .join(" · ")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="ds-penyedia-judul" className="bch-prose">
        <h2 id="ds-penyedia-judul">Penyedia</h2>
        <ul>
          {PENYEDIA.map((p) => (
            <li key={p.nama}>
              {p.nama}: {p.jumlah.toLocaleString("id-ID")} dataset
            </li>
          ))}
        </ul>
        <p>
          Judul, angka, dan nama kolom ditampilkan seperti di penyedianya. Catatan kualitas yang kami temukan ditulis di
          halaman tiap dataset. Penyedia tidak menyatakan lisensi pakai ulang, jadi tiap halaman hanya menampilkan
          pratinjau dan berkas lengkapnya belum bisa diunduh dari situs ini.
        </p>
        <p>
          Data pribadi, data pajak, dan data yang menyangkut penertiban warga tidak ikut dikumpulkan. Cara kami
          menangani data dijelaskan di <Link href="/standar-redaksi">Standar Redaksi</Link>.
        </p>
      </section>
    </div>
  );
}
