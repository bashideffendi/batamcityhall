import type { Metadata } from "next";
import PembukaBagian from "@/components/site/PembukaBagian";
import { lokerAktif } from "@/features/konten/baca";
import { JENIS_LOKER } from "@/features/konten/skema";
import { tanggalTulisan } from "@/features/jurnal/data";
import "@/features/budaya/budaya.css";

export const metadata: Metadata = {
  title: "Info Loker",
  description: "Lowongan kerja di Batam, dengan tanggal posting dan batas lamaran.",
};

export const revalidate = 300;

const namaJenis = (slug: string) => JENIS_LOKER.find((j) => j.slug === slug)?.nama ?? slug;

export default async function InfoLoker() {
  const daftar = await lokerAktif();
  return (
    <div className="bch-page">
      <PembukaBagian id="loker" />

      {daftar.length === 0 ? (
        <p className="bch-measure" data-loker-kosong>
          Belum ada lowongan.
        </p>
      ) : (
        <ul className="bud-daftar bch-seksi-rapat">
          {daftar.map((l) => (
            <li key={l.id} id={l.id} className="bud-baris" data-loker={l.id}>
              <div>
                <p className="bud-bidang bud-kelompok">{namaJenis(l.jenis)}</p>
                <h2 className="bud-nama">{l.posisi}</h2>
                <p className="bud-bidang">
                  {l.perusahaan} · {l.lokasi}
                </p>
                {l.syarat && <p className="bud-uraian">{l.syarat}</p>}
                <p className="bud-uraian">{l.cara_melamar}</p>
              </div>
              <div className="bud-samping">
                <dl className="bud-fakta">
                  <div>
                    <dt>Diposting</dt>
                    <dd>{tanggalTulisan(l.tanggal)}</dd>
                  </div>
                  {l.batas && (
                    <div>
                      <dt>Batas Lamaran</dt>
                      <dd>{tanggalTulisan(l.batas)}</dd>
                    </div>
                  )}
                  {l.gaji && (
                    <div>
                      <dt>Gaji</dt>
                      <dd>{l.gaji}</dd>
                    </div>
                  )}
                </dl>
                {l.tautan && (
                  <a href={l.tautan} target="_blank" rel="noopener noreferrer">
                    Lihat Sumber
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="bch-catatan-halaman">Melamar kerja tidak dipungut biaya. Waspadai lowongan yang meminta bayaran atau pinjaman.</p>
    </div>
  );
}
