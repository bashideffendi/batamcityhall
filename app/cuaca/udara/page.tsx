import type { Metadata } from "next";
import KualitasUdara from "@/features/langit-laut/components/KualitasUdara";
import { KATEGORI_UDARA, rentangKategori } from "@/features/langit-laut/lib/udara";
import "@/features/langit-laut/cuaca.css";

export const metadata: Metadata = {
  title: "Kualitas Udara",
  description: "Indeks kualitas udara (AQI) Batam saat ini dan 24 jam ke depan, dengan arti tiap angka.",
};

export default function KualitasUdaraHalaman() {
  return (
    <div className="bch-page cu-halaman-teks">
      <h1 className="m-0">Kualitas Udara</h1>
      <p className="bch-lede">Indeks kualitas udara (AQI) Batam saat ini dan 24 jam ke depan.</p>
      <KualitasUdara />

      <section aria-labelledby="udara-arti">
        <h2 id="udara-arti" className="mt-7 mb-3">
          Arti Angka
        </h2>
        <div className="bch-table-wrap">
          <table className="bch-table bch-tabel-tumpuk" role="table">
            <caption className="sr-only">Kategori AQI dan saran kegiatan</caption>
            <thead>
              <tr>
                <th scope="col">AQI</th>
                <th scope="col">Kategori</th>
                <th scope="col">Saran</th>
              </tr>
            </thead>
            <tbody>
              {KATEGORI_UDARA.map((k, i) => (
                <tr key={k.kode} role="row">
                  <td role="cell" data-label="AQI" className="bch-data">
                    {rentangKategori(i)}
                  </td>
                  <td role="cell" data-label="Kategori">
                    {k.label}
                  </td>
                  <td role="cell" data-label="Saran">
                    {k.saran}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="bch-card-meta mt-4 mb-0">
          Angka ini perkiraan model komputer untuk wilayah selebar sekitar 45 km, bukan hasil alat ukur di Batam, dan
          diperbarui dua kali sehari. Skalanya mengikuti indeks AQI Amerika Serikat. Saran di atas bersifat umum; penderita
          penyakit pernapasan atau jantung sebaiknya mengikuti anjuran dokter.
        </p>
      </section>
    </div>
  );
}
