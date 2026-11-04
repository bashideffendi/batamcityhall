import Link from "next/link";

const HALAMAN = [
  { href: "/cerita/kalender", label: "Kalender acara" },
  { href: "/cerita/kamus", label: "Kamus" },
  { href: "/cerita/budaya", label: "Budaya Melayu" },
  { href: "/cerita/komunitas", label: "Komunitas" },
];

/** Tautan ke halaman sebelah, di kaki halaman. */
export default function NavBudaya({ kini }: { kini: string }) {
  return (
    <nav aria-label="Halaman budaya lainnya" className="bch-sub-nav mt-8">
      {HALAMAN.filter((h) => h.href !== kini).map((h) => (
        <Link key={h.href} href={h.href} prefetch={false}>
          {h.label}
        </Link>
      ))}
    </nav>
  );
}

export function KickerCerita() {
  return (
    <p className="bch-kicker m-0">
      <Link href="/cerita" prefetch={false}>
        Loket 05 · Cerita &amp; Budaya
      </Link>
    </p>
  );
}
