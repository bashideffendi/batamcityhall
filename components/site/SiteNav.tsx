"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useSiteTheme } from "@/components/site/useSiteTheme";
import { LOKET, SITE_NAME } from "@/lib/site";
import { bacaDiperbarui, subscribeDiperbarui } from "@/lib/diperbarui";
import { followSystemTheme, toggleTheme } from "@/lib/theme";

const Icon = ({ d }: { d: string }) => (
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
    <path d={d} />
  </svg>
);
const MOON = "M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z";
const SUN =
  "M12 4v2m0 12v2M4 12h2m12 0h2M6.3 6.3l1.4 1.4m8.6 8.6 1.4 1.4m0-11.4-1.4 1.4m-8.6 8.6-1.4 1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z";
const MENU = "M4 7h16M4 12h16M4 17h16";
const CLOSE = "M6 6l12 12M18 6 6 18";
const CARI = "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-4-4";

const tanggalHariIni = () =>
  new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(Date.now());
const tanpaLangganan = () => () => {};

/** Baris paling atas beranda. Hanya dirender di klien: halaman statis tidak boleh membawa tanggal saat build. */
function BarisTanggal() {
  const tanggal = useSyncExternalStore(tanpaLangganan, tanggalHariIni, () => "");
  const jam = useSyncExternalStore(subscribeDiperbarui, bacaDiperbarui, () => "");
  return (
    <div className="bch-kepala-tanggal">
      <span>{tanggal}</span>
      {jam && <span className="bch-data">Diperbarui pukul {jam} WIB</span>}
    </div>
  );
}

export default function SiteNav() {
  const path = usePathname();
  const theme = useSiteTheme();
  // Menu terbuka hanya untuk path tempat ia dibuka, jadi pindah halaman otomatis menutupnya.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === path;
  const beranda = path === "/";

  useEffect(() => followSystemTheme(), []);

  return (
    <>
      <header className="bch-kepala" data-beranda={beranda ? "" : undefined}>
        {beranda && <BarisTanggal />}
        <div className="bch-kepala-utama">
          {beranda && <p className="bch-kepala-slogan">Panduan harian Kota Batam, disusun oleh warga.</p>}
          <Link href="/" className="bch-wordmark">
            {SITE_NAME}
          </Link>
          <div className="bch-nav-tools">
            <Link href="/info/direktori" prefetch={false} className="bch-icon-btn" aria-label="Cari">
              <Icon d={CARI} />
            </Link>
            <button
              type="button"
              className="bch-icon-btn"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Ganti ke tampilan terang" : "Ganti ke tampilan gelap"}
            >
              <Icon d={theme === "dark" ? SUN : MOON} />
            </button>
            <button
              type="button"
              className="bch-icon-btn bch-menu-btn"
              onClick={() => setOpenedAt(path)}
              aria-expanded={open}
              aria-controls="bch-toc"
              aria-label="Buka menu"
            >
              <Icon d={MENU} />
            </button>
          </div>
        </div>
        <nav className="bch-menu" aria-label="Bagian situs">
          {LOKET.map((l) => (
            <Link key={l.nomor} href={l.href} aria-current={l.aktifDi.some((p) => path.startsWith(p)) ? "page" : undefined}>
              <span className="no">{l.nomor}</span>
              {l.nama}
            </Link>
          ))}
        </nav>
      </header>
      {open && (
        <nav id="bch-toc" className="bch-toc" aria-label="Menu">
          <button type="button" className="bch-icon-btn bch-toc-tutup" onClick={() => setOpenedAt(null)} aria-label="Tutup menu">
            <Icon d={CLOSE} />
          </button>
          <ol>
            {LOKET.map((l) => (
              <li key={l.nomor}>
                <Link href={l.href}>
                  <span className="no">{l.nomor}</span>
                  <span>
                    {l.nama}
                    <span className="bch-menu-lede">{l.lede}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      )}
    </>
  );
}
