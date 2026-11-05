import Link from "next/link";

export type Pintu = { href: string; nama: string; ket?: string };

/** Kisi tautan ke halaman di dalam bagian: nama dan satu fakta singkat. */
export default function KisiPintu({ isi, kolom = 3 }: { isi: Pintu[]; kolom?: 1 | 2 | 3 | 4 }) {
  return (
    <ul className="bch-pintu" data-kolom={kolom}>
      {isi.map((p) => (
        <li key={p.href}>
          <Link href={p.href} prefetch={false}>
            <span className="nama">
              {p.nama}
              <span className="panah" aria-hidden="true">
                →
              </span>
            </span>
            {p.ket && <span className="ket">{p.ket}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
