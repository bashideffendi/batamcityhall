import type { Metadata } from "next";
import Link from "next/link";
import panduan from "@/data/panduan/urusan_tanah.json";
import { cariTempat, labelSub, LABEL_BETA, slugSub, tempatPerId } from "@/features/direktori/data";
import Teks from "@/features/direktori/Teks";

export const metadata: Metadata = {
  title: "Urusan tanah",
  description: "UWT, HPL, sertifikat, jual-beli rumah di Batam: ke mana untuk apa.",
};

// Sebagian catatan di data panduan masih catatan kerja penyusun, bukan untuk warga.
const catatanWarga = (c: string) => (/riset|perlu ditambahkan/i.test(c) ? null : c);

const LOKET_MPP = ["pertanahan-ptsp-bp-batam-mpp", "mpp-disdukcapil"];

export default function UrusanTanah() {
  const mpp = tempatPerId.get("mpp-batam");
  const instansi = Array.isArray(mpp?.atribut.instansi) ? (mpp.atribut.instansi as string[]) : [];
  const ppatMpp = tempatPerId.get("ppat-yulianti");
  const { judul, catatan, langkah } = panduan.urutan_jual_beli_rumah;
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">
        <Link href="/info">Info Warga</Link>
      </p>
      <h1 className="mt-2">Urusan tanah: ke mana untuk apa</h1>
      <p className="bch-lede">
        <Teks isi={panduan.pengantar} />
      </p>
      <p className="bch-note">Ini gambaran praktis, bukan nasihat hukum.</p>

      <h2 className="mt-7 mb-4">Delapan kebutuhan yang paling sering</h2>
      <div className="bch-table-wrap">
        <table className="bch-table bch-tabel-tumpuk" role="table" data-tabel-tanah>
          <thead>
            <tr>
              <th scope="col">Kebutuhan</th>
              <th scope="col">Ke mana</th>
              <th scope="col">Catatan</th>
            </tr>
          </thead>
          <tbody>
            {panduan.kebutuhan.map((k) => {
              const catatanRow = catatanWarga(k.catatan);
              return (
                <tr key={k.kebutuhan_warga} role="row">
                  <td role="cell" data-label="Kebutuhan">
                    {k.kebutuhan_warga}
                  </td>
                  <td role="cell" data-label="Ke mana">
                    <Teks isi={k.ke_mana} />
                    {k.tempat_terkait.map((id) => {
                      const p = cariTempat(id);
                      return (
                        p && (
                          <span key={id} className="bch-sel-kecil">
                            <Link href={`/info/tempat/${p.id}`} prefetch={false}>
                              {p.nama}
                            </Link>
                          </span>
                        )
                      );
                    })}
                    {k.subkategori_terkait?.map((s) => (
                      <span key={s} className="bch-sel-kecil">
                        <Link href={`/info/direktori/pertanahan-hukum/${slugSub(s)}`} prefetch={false}>
                          Daftar {labelSub(s)}
                        </Link>{" "}
                        (Beta)
                      </span>
                    ))}
                  </td>
                  <td role="cell" data-label="Catatan">
                    {catatanRow ?? "Belum ada catatan."}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bch-prose">
        <h2>{judul}</h2>
        <p className="bch-note" data-tone="caution">
          Ini {catatan}. Bukan nasihat hukum.
        </p>
        <ol data-langkah-jual-beli>
          {langkah.map((l) => (
            <li key={l}>{l.charAt(0).toUpperCase() + l.slice(1)}.</li>
          ))}
        </ol>

        {mpp && (
          <>
            <h2>Satu gedung untuk banyak loket: MPP</h2>
            <p>
              <Link href={`/info/tempat/${mpp.id}`}>{mpp.nama}</Link> menampung beberapa instansi di satu gedung
              {instansi.length > 0 && `: ${instansi.join(", ")}`}. Pajak dari KPP dilayani bergiliran, jadi cek dulu
              jadwalnya.
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
                  </Link>{" "}
                  <span className="bch-badge" data-tone="caution">
                    {LABEL_BETA}
                  </span>
                </li>
              )}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
