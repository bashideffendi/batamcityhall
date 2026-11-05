import Link from "next/link";

const MENU = [
  { href: "/jalan/trans-batam", label: "Trans Batam" },
  { href: "/jalan/peta", label: "Peta" },
  { href: "/jalan/feri", label: "Feri" },
  { href: "/jalan/pompong", label: "Pompong" },
  { href: "/jalan/feri/panduan", label: "Panduan menyeberang" },
];

export default function JalanNav({ aktif }: { aktif?: string }) {
  return (
    <nav aria-label="Transportasi" className="bch-sub-nav jl-nav">
      {MENU.map((m) => (
        <Link key={m.href} href={m.href} prefetch={false} aria-current={m.href === aktif ? "page" : undefined}>
          {m.label}
        </Link>
      ))}
    </nav>
  );
}
