import type { Metadata } from "next";
import Link from "next/link";
import darurat from "@/data/darurat/nomor_darurat.json";
import nasional from "@/data/darurat/nomor_darurat_09.json";
import { cariTempat, punyaHalaman } from "@/features/direktori/data";

export const metadata: Metadata = {
  title: "Nomor Darurat",
  description: "Nomor darurat di Batam: 112, polisi 110, pemadam kebakaran 113, SAR 115, dan ambulans 119.",
};

const telHref = (n: string) => `tel:${n.replace(/[^+\d]/g, "")}`;

function TautanTempat({ id, nama }: { id: string; nama: string }) {
  const p = cariTempat(id);
  return p && punyaHalaman(p) ? (
    <Link href={`/info/tempat/${p.id}`} prefetch={false}>
      {nama}
    </Link>
  ) : (
    nama
  );
}

export default function Darurat() {
  const telepon = nasional.filter((n) => n.jenis === "telepon");
  return (
    <div className="bch-page">
      <nav className="bch-remah" aria-label="Remah roti">
        <Link href="/info">Informasi Warga</Link>
      </nav>
      <h1 className="mt-2">Nomor Darurat</h1>
      <p className="bch-lede">Dalam keadaan darurat, hubungi 112.</p>

      <ul className="bch-nomor-daftar" aria-label="Nomor darurat">
        {telepon.map((n) => (
          <li key={n.kontak} className="bch-card">
            <a className="bch-nomor" href={telHref(n.kontak)} aria-label={`${n.nama}, telepon ${n.kontak}`}>
              {n.kontak}
            </a>
            <h2>{n.nama}</h2>
          </li>
        ))}
      </ul>

      <section>
        <h2 className="mt-7 mb-4">Pos Pemadam Kebakaran</h2>
        <div className="bch-table-wrap">
          <table className="bch-table bch-tabel-tumpuk" role="table">
            <thead>
              <tr>
                <th scope="col">Pos</th>
                <th scope="col">Kecamatan</th>
                <th scope="col">Telepon</th>
                <th scope="col">Jam layanan</th>
              </tr>
            </thead>
            <tbody>
              {darurat.pemadam_kebakaran.map((k) => (
                <tr key={k.tempat_id} role="row">
                  <td role="cell" data-label="Pos">
                    <TautanTempat id={k.tempat_id} nama={k.nama} />
                  </td>
                  <td role="cell" data-label="Kecamatan">
                    {k.kecamatan}
                  </td>
                  <td role="cell" data-label="Telepon" className="bch-data">
                    <a href={telHref(k.telepon)}>{k.telepon}</a>
                  </td>
                  <td role="cell" data-label="Jam layanan">
                    {k.jam_layanan}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mt-7 mb-4">Layanan Pengaduan</h2>
        <div className="bch-table-wrap">
          <table className="bch-table bch-tabel-tumpuk" role="table" data-tabel-pengaduan>
            <thead>
              <tr>
                <th scope="col">Layanan</th>
                <th scope="col">Telepon</th>
              </tr>
            </thead>
            <tbody>
              {darurat.call_center.map((c) => (
                <tr key={c.nama} role="row">
                  <td role="cell" data-label="Layanan">
                    <TautanTempat id={c.tempat_id} nama={c.nama} />
                  </td>
                  <td role="cell" data-label="Telepon" className="bch-data">
                    <a href={telHref(c.nomor)}>{c.nomor}</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
