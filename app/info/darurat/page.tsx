import type { Metadata } from "next";
import Link from "next/link";
import darurat from "@/data/darurat/nomor_darurat.json";
import nasional from "@/data/darurat/nomor_darurat_09.json";
import { cariTempat } from "@/features/direktori/data";

export const metadata: Metadata = {
  title: "Nomor darurat",
  description: "Nomor darurat dan call center layanan di Batam: polisi, pemadam kebakaran, SAR, ambulans.",
};

const telHref = (n: string) => `tel:${n.replace(/[^+\d]/g, "")}`;

function TautanTempat({ id, nama }: { id: string; nama: string }) {
  const p = cariTempat(id);
  return p ? (
    <Link href={`/info/tempat/${p.id}`} prefetch={false}>
      {nama}
    </Link>
  ) : (
    nama
  );
}

type Kantor = {
  tempat_id: string;
  nama: string;
  kecamatan?: string | null;
  alamat?: string | null;
  telepon?: string | null;
  jam_layanan?: string | null;
};

function TabelKantor({ judul, isi }: { judul: string; isi: Kantor[] }) {
  return (
    <section>
      <h2 className="mt-7 mb-4">{judul}</h2>
      <div className="bch-table-wrap">
        <table className="bch-table bch-tabel-tumpuk" role="table">
          <thead>
            <tr>
              <th scope="col">Kantor</th>
              <th scope="col">Kecamatan</th>
              <th scope="col">Telepon</th>
              <th scope="col">Jam</th>
            </tr>
          </thead>
          <tbody>
            {isi.map((k) => (
              <tr key={k.tempat_id} role="row">
                <td role="cell" data-label="Kantor">
                  <TautanTempat id={k.tempat_id} nama={k.nama} />
                  {k.alamat && <span className="bch-sel-kecil">{k.alamat}</span>}
                </td>
                <td role="cell" data-label="Kecamatan">
                  {k.kecamatan ?? "Belum diketahui"}
                </td>
                <td role="cell" data-label="Telepon" className="bch-data">
                  {k.telepon ? <a href={telHref(k.telepon)}>{k.telepon}</a> : "Belum ada"}
                </td>
                <td role="cell" data-label="Jam">
                  {k.jam_layanan ?? "Belum diketahui"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function Darurat() {
  const telepon = nasional.filter((n) => n.jenis === "telepon");
  const kanal = nasional.filter((n) => n.jenis !== "telepon");
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">
        <Link href="/info">Info Warga</Link>
      </p>
      <h1 className="mt-2">Nomor darurat</h1>
      <p className="bch-lede">Sedang darurat? Telepon dulu, baca belakangan.</p>

      <ul className="bch-nomor-daftar" aria-label="Nomor darurat nasional">
        {telepon.map((n) => (
          <li key={n.kontak} className="bch-card">
            <a className="bch-nomor" href={telHref(n.kontak)} aria-label={`${n.nama}, telepon ${n.kontak}`}>
              {n.kontak}
            </a>
            <h2>{n.nama}</h2>
            <p className="m-0">
              {n.catatan === "nasional" ? "Nomor nasional." : `${n.catatan}.`}
              {n.catatan !== "nasional" && n.tempat_terkait.length > 0 && " "}
              {n.tempat_terkait.map((id) => (
                <TautanTempat key={id} id={id} nama="Lihat kartunya" />
              ))}
            </p>
          </li>
        ))}
      </ul>
      <p className="bch-note mt-4">
        Nomor nasional di atas belum kami verifikasi pengelolanya di Batam. Kalau tidak tersambung, pakai nomor kantor
        di bawah.
      </p>
      {darurat.peringatan.map((t) => (
        <p key={t} className="bch-note mt-4" data-tone="danger" data-peringatan-situs>
          {t}
        </p>
      ))}

      <section>
        <h2 className="mt-7 mb-4">Call center layanan</h2>
        <ul className="bch-grid">
          {darurat.call_center.map((c) => (
            <li key={c.nama} className="bch-card">
              <h3>
                <TautanTempat id={c.tempat_id} nama={c.nama} />
              </h3>
              <p className="bch-data mt-2 mb-0">
                <a href={telHref(c.nomor)}>{c.nomor}</a>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <TabelKantor judul="Pemadam kebakaran" isi={darurat.pemadam_kebakaran} />
      <TabelKantor judul="Polisi" isi={darurat.polisi} />

      <section>
        <h2 className="mt-7 mb-4">Pengaduan layanan publik</h2>
        {kanal.map((k) => (
          <p key={k.kontak}>
            <a href={`https://${k.kontak}`} rel="noopener noreferrer">
              {k.nama}
            </a>
            . {k.catatan}.
          </p>
        ))}
      </section>
    </div>
  );
}
