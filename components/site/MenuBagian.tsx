import Link from "next/link";
import { BAGIAN, bagianDiAlamat } from "@/lib/site";

const RUMAH = "M3 11 12 4l9 7M5.5 9.5V20h5v-6h3v6h5V9.5";

/**
 * Menu bagian situs, dipakai di kepala halaman dan di pita bawah sampul beranda supaya isinya tidak pernah berbeda.
 * Beranda bukan anggota BAGIAN: alamat "/" adalah awalan semua halaman. Di menu lebar tampil sebagai ikon.
 */
export default function MenuBagian({ path, className }: { path: string; className: string }) {
  const beranda = path === "/";
  const aktif = bagianDiAlamat(path)?.id;
  return (
    <nav className={className} aria-label="Bagian situs">
      <Link href="/" className="bch-menu-beranda" aria-current={beranda ? "page" : undefined} title="Beranda">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d={RUMAH} />
        </svg>
        <span className="sr-only">Beranda</span>
      </Link>
      {BAGIAN.map((b) => (
        <Link key={b.id} href={b.href} aria-current={b.id === aktif ? "page" : undefined}>
          {b.nama}
        </Link>
      ))}
    </nav>
  );
}
