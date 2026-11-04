"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSiteTheme } from "@/components/site/useSiteTheme";
import { LOKET, LOKET_DIBUKA, SITE_NAME } from "@/lib/site";
import { followSystemTheme, toggleTheme } from "@/lib/theme";

const Icon = ({ d }: { d: string }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.25"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);
const MOON = "M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z";
const SUN =
  "M12 4v2m0 12v2M4 12h2m12 0h2M6.3 6.3l1.4 1.4m8.6 8.6 1.4 1.4m0-11.4-1.4 1.4m-8.6 8.6-1.4 1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z";
const MENU = "M4 7h16M4 12h16M4 17h16";
const CLOSE = "M6 6l12 12M18 6 6 18";

export default function SiteNav() {
  const path = usePathname();
  const theme = useSiteTheme();
  // Menu terbuka hanya untuk path tempat ia dibuka, jadi pindah halaman otomatis menutupnya.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === path;

  useEffect(() => followSystemTheme(), []);

  return (
    <>
      <header className="bch-nav">
        <Link href="/" className="bch-wordmark">
          {SITE_NAME}
        </Link>
        <nav className="bch-nav-loket" aria-label="Loket">
          {LOKET.map((l) => (
            // Loket yang belum dibuka belum punya route: prefetch hanya akan menghasilkan 404.
            <Link
              key={l.nomor}
              href={l.href}
              prefetch={LOKET_DIBUKA.includes(l.nomor) ? undefined : false}
              aria-current={path.startsWith(l.href) ? "page" : undefined}
            >
              {l.nomor} {l.nama}
            </Link>
          ))}
        </nav>
        <div className="bch-nav-tools">
          <button
            type="button"
            className="bch-icon-btn"
            onClick={toggleTheme}
            aria-label={theme === "night" ? "Ganti ke peta siang" : "Ganti ke chart malam"}
          >
            <Icon d={theme === "night" ? SUN : MOON} />
          </button>
          <button
            type="button"
            className="bch-icon-btn bch-menu-btn"
            onClick={() => setOpenedAt(open ? null : path)}
            aria-expanded={open}
            aria-controls="bch-toc"
            aria-label={open ? "Tutup daftar isi" : "Buka daftar isi"}
          >
            <Icon d={open ? CLOSE : MENU} />
          </button>
        </div>
      </header>
      {open && (
        <nav id="bch-toc" className="bch-toc" aria-label="Daftar isi">
          <ol>
            <li>
              <Link href="/">
                <span className="no">00</span>
                <span>Beranda</span>
              </Link>
            </li>
            {LOKET.map((l) => (
              <li key={l.nomor}>
                <Link href={l.href} prefetch={LOKET_DIBUKA.includes(l.nomor) ? undefined : false}>
                  <span className="no">{l.nomor}</span>
                  <span>{l.nama}</span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      )}
    </>
  );
}
