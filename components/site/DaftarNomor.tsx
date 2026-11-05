import Link from "next/link";

export type ButirNomor = { href: string; nama: string; ket?: string };

const kalimat = (s: string) => `${s.replace(/\.$/, "").replace(/^./, (c) => c.toUpperCase())}.`;

/** Daftar bernomor di pembuka loket (PEDOMAN 4.6): 01 Judul → dan keterangan satu kalimat. */
export default function DaftarNomor({ isi }: { isi: readonly ButirNomor[] }) {
  return (
    <ol className="bch-daftar-nomor">
      {isi.map((b, i) => (
        <li key={b.href}>
          <Link href={b.href} prefetch={false}>
            <span className="no">{String(i + 1).padStart(2, "0")}</span>
            <span className="nama">{b.nama}</span>
            <span className="panah" aria-hidden="true">
              →
            </span>
            {b.ket && <span className="ket">{kalimat(b.ket)}</span>}
          </Link>
        </li>
      ))}
    </ol>
  );
}
