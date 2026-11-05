import Link from "next/link";
import { labelSub, labelTempat, lokasiTeks, punyaHalaman, punyaTitik, statusBaris, type Place } from "./data";

/** Paling banyak satu label, dan hanya untuk keadaan yang mengubah cara membaca barisnya. */
export function DaftarLencana({ p }: { p: Parameters<typeof labelTempat>[0] }) {
  const isi = labelTempat(p);
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

// Baris tempat (PEDOMAN 3.8, 4.5): nama, {jenis} · {kelurahan}, {kecamatan}, dan satu status di kanan. Hanya yang
// ada isinya yang tampil. Tempat yang hanya punya nama tidak punya halaman, jadi namanya tidak ditautkan.
export default function KartuTempat({ p }: { p: Place }) {
  const lokasi = lokasiTeks(p);
  const status = statusBaris(p);
  const catatan = labelTempat(p).map((l) => l.teks);
  const meta = [labelSub(p.subkategori), lokasi, ...catatan].filter(Boolean).join(" · ");
  return (
    <article className="bch-baris">
      <h3 className="nama">
        {punyaHalaman(p) ? (
          <Link href={`/info/tempat/${p.id}`} prefetch={false}>
            {p.nama}
          </Link>
        ) : (
          p.nama
        )}
      </h3>
      {status && (
        <span className="bch-status" data-tone={p.atribut.igd_24jam === true ? "ok" : undefined}>
          {status}
        </span>
      )}
      <p className="meta">
        {meta}
        {punyaTitik(p) && (
          <>
            {meta && " · "}
            <b>Ada di peta</b>
          </>
        )}
      </p>
    </article>
  );
}
