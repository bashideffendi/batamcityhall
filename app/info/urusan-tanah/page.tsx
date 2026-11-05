import type { Metadata } from "next";
import Link from "next/link";
import panduan from "@/data/panduan/urusan_tanah.json";
import { labelSub, slugSub, tempatPerId } from "@/features/direktori/data";
import Teks from "@/features/direktori/Teks";

export const metadata: Metadata = {
  title: "Urusan Tanah dan Rumah",
  description: "Tempat mengurus tanah dan rumah di Batam: pembayaran UWT, sertifikat, dan jual beli.",
};

const LOKET_MPP = ["pertanahan-ptsp-bp-batam-mpp", "mpp-disdukcapil"];

export default function UrusanTanah() {
  const mpp = tempatPerId.get("mpp-batam");
  const instansi = Array.isArray(mpp?.atribut.instansi) ? (mpp.atribut.instansi as string[]) : [];
  const ppatMpp = tempatPerId.get("ppat-yulianti");
  return (
    <div className="bch-page">
      <nav className="bch-remah" aria-label="Remah roti">
        <Link href="/info">Layanan Warga</Link>
      </nav>
      <h1 className="mt-2">Urusan Tanah dan Rumah</h1>
      <p className="bch-lede">Cari tempat mengurus pembayaran UWT, sertifikat, dan jual beli di Batam.</p>
      <p className="bch-measure">
        <Teks isi={panduan.pengantar} />
      </p>

      <h2 className="mt-7 mb-4">Keperluan yang Paling Sering Diurus</h2>
      <div className="bch-table-wrap">
        <table className="bch-table bch-tabel-tumpuk" role="table" data-tabel-tanah>
          <thead>
            <tr>
              <th scope="col">Keperluan</th>
              <th scope="col">Tempat Mengurus</th>
              <th scope="col">Catatan</th>
            </tr>
          </thead>
          <tbody>
            {panduan.kebutuhan.map((k) => (
              <tr key={k.kebutuhan_warga} role="row">
                <td role="cell" data-label="Keperluan">
                  {k.kebutuhan_warga}
                </td>
                <td role="cell" data-label="Tempat Mengurus">
                  <Teks isi={k.ke_mana} />
                  {k.subkategori_terkait?.map((s) => (
                    <span key={s} className="bch-sel-kecil">
                      <Link href={`/info/direktori/pertanahan-hukum/${slugSub(s)}`} prefetch={false}>
                        Daftar {labelSub(s)}
                      </Link>
                    </span>
                  ))}
                </td>
                <td role="cell" data-label="Catatan">
                  {k.catatan}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bch-prose">
        <h2>Urutan Jual Beli Rumah</h2>
        <ol data-langkah-jual-beli>
          {panduan.urutan_jual_beli_rumah.langkah.map((l) => (
            <li key={l}>{l.charAt(0).toUpperCase() + l.slice(1)}.</li>
          ))}
        </ol>

        {mpp && (
          <>
            <h2>MPP: Satu Gedung untuk Banyak Loket</h2>
            <p>
              <Link href={`/info/tempat/${mpp.id}`}>{mpp.nama}</Link> menampung beberapa instansi
              {instansi.length > 0 && `: ${instansi.join(", ")}`}. Layanan pajak dari KPP tersedia bergiliran.
            </p>
            <ul>
              {LOKET_MPP.map((id) => {
                const p = tempatPerId.get(id);
                return (
                  p && (
                    <li key={id}>
                      <Link href={`/info/tempat/${p.id}`} prefetch={false}>
                        {p.nama}
                      </Link>
                    </li>
                  )
                );
              })}
              {ppatMpp && (
                <li>
                  <Link href={`/info/tempat/${ppatMpp.id}`} prefetch={false}>
                    {ppatMpp.nama}
                  </Link>
                </li>
              )}
            </ul>
          </>
        )}
      </div>

      <p className="bch-note mt-7" data-catatan-hukum>
        Halaman ini adalah panduan umum, bukan nasihat hukum.
      </p>
    </div>
  );
}
