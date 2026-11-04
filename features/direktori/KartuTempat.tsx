import Link from "next/link";
import {
  adalahProfesi,
  atributPublik,
  lencana,
  lokasiTeks,
  namaKategori,
  labelSub,
  teksDicek,
  type Place,
} from "./data";

// Kartu label museum (research/05): kicker, nama, lokasi italic, garis, lalu fakta. Versi ringkas untuk
// daftar; isi lengkap, sumber, dan kontak ada di halaman tempat.
export function DaftarLencana({ p }: { p: Parameters<typeof lencana>[0] }) {
  const isi = lencana(p);
  if (!isi.length) return null;
  return (
    <div className="bch-badges mt-2">
      {isi.map((l) => (
        <span key={l.teks} className="bch-badge" data-tone={l.nada}>
          {l.teks}
        </span>
      ))}
    </div>
  );
}

export default function KartuTempat({ p }: { p: Place }) {
  const atribut = atributPublik(p).slice(0, 3);
  return (
    <article className="bch-card h-full">
      <p className="bch-kicker-row bch-kicker m-0">
        <span>{namaKategori(p.kategori)}</span>
        <span>{labelSub(p.subkategori)}</span>
      </p>
      <h3>
        <Link href={`/info/tempat/${p.id}`} prefetch={false}>
          {p.nama}
        </Link>
      </h3>
      <p className="bch-card-loc">{lokasiTeks(p)}</p>
      <hr className="bch-card-rule" />
      <div className="bch-rebung-mini" aria-hidden="true" />
      {p.alamat && <p className="m-0">{p.alamat}</p>}
      {atribut.length > 0 && (
        <dl className="bch-kartu-atribut">
          {atribut.map((a) => (
            <div key={a.label}>
              <dt>{a.label}</dt>
              <dd>{a.nilai}</dd>
            </div>
          ))}
        </dl>
      )}
      <p className="bch-card-meta mt-2 mb-0">
        {p.jam_layanan && (
          <>
            {p.jam_layanan}
            <br />
          </>
        )}
        {teksDicek(p)}
      </p>
      <DaftarLencana p={p} />
      {adalahProfesi(p) && (
        <p className="mt-2 mb-0">
          <Link href="/info/bantuan-hukum#cek-status" prefetch={false}>
            Cek status
          </Link>
        </p>
      )}
    </article>
  );
}
