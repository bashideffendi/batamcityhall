"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import MenuBagian from "@/components/site/MenuBagian";
import { useSiteTheme } from "@/components/site/useSiteTheme";
import { BAGIAN, bagianDiAlamat, SITE_LOGO } from "@/lib/site";
import { followSystemTheme, toggleTheme } from "@/lib/theme";

export const Icon = ({ d }: { d: string }) => (
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
export const MOON = "M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z";
export const SUN =
  "M12 4v2m0 12v2M4 12h2m12 0h2M6.3 6.3l1.4 1.4m8.6 8.6 1.4 1.4m0-11.4-1.4 1.4m-8.6 8.6-1.4 1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z";
export const MENU = "M4 7h16M4 12h16M4 17h16";
const CLOSE = "M6 6l12 12M18 6 6 18";
export const CARI = "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-4-4";

/** Peristiwa untuk membuka menu layar penuh dari luar kepala halaman, mis. pita bawah sampul beranda. */
export const BUKA_MENU = "bch:buka-menu";

// Nomor nasional dari data/darurat. Ditulis di sini supaya tetap tampil walau data lain gagal dimuat.
const DARURAT = [
  { nomor: "112", nama: "Darurat" },
  { nomor: "110", nama: "Polisi" },
  { nomor: "113", nama: "Damkar" },
  { nomor: "115", nama: "SAR" },
  { nomor: "119", nama: "Ambulans" },
];

/** Baris darurat di puncak setiap halaman. */
function BarisDarurat() {
  return (
    <nav className="bch-darurat" aria-label="Nomor Darurat">
      <div className="bch-darurat-dalam">
        <Link href="/info/darurat" prefetch={false} className="bch-darurat-tanda">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2.5 1.5 21h21L12 2.5Zm-1.2 7h2.4l-.3 6h-1.8l-.3-6Zm1.2 7.6a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8Z" />
          </svg>
          Darurat
        </Link>
        <ul>
          {DARURAT.map((d) => (
            <li key={d.nomor}>
              <a href={`tel:${d.nomor}`} aria-label={`${d.nomor} ${d.nama}, telepon`}>
                <b>{d.nomor}</b>{" "}
                <span>{d.nama}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

/** Submenu bagian yang sedang dibuka. Yang dipilih adalah alamat terpanjang yang cocok. */
function Submenu({ path }: { path: string }) {
  const bagian = bagianDiAlamat(path);
  if (!bagian?.isi.length) return null;
  const aktif = bagian.isi
    .filter((s) => path === s.href || path.startsWith(`${s.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
  return (
    <nav className="bch-submenu" aria-label={bagian.nama}>
      <div className="bch-submenu-dalam">
        {bagian.isi.map((s) => (
          <Link key={s.href} href={s.href} prefetch={false} aria-current={s.href === aktif ? "page" : undefined}>
            {s.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

/**
 * Kepala situs. Di beranda kepala ini tidak tampil: sampul beranda (components/site/SampulBeranda.tsx) membawa nama
 * situs dan menu di pita bawahnya, seperti sampul majalah. Halaman lain memakai kepala normal: nama situs di tengah,
 * pita menu di bawahnya (purwarupa arah "kalcer", 9 Nov 2026).
 */
export default function SiteNav() {
  const path = usePathname();
  const theme = useSiteTheme();
  // Menu terbuka hanya untuk path tempat ia dibuka, jadi pindah halaman otomatis menutupnya.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === path;
  const beranda = path === "/";

  useEffect(() => followSystemTheme(), []);

  // Tombol menu di sampul beranda membuka menu yang sama.
  useEffect(() => {
    const buka = () => setOpenedAt(window.location.pathname);
    window.addEventListener(BUKA_MENU, buka);
    return () => window.removeEventListener(BUKA_MENU, buka);
  }, []);

  // Next.js hanya menggulir sampai segmen yang berubah, jadi kepala halaman bisa terpotong saat pindah di dalam
  // satu bagian. Tombol kembali dan tautan ke tanda pagar tetap memakai posisi masing-masing.
  const lewatRiwayat = useRef(false);
  const pertama = useRef(true);
  useEffect(() => {
    const tandai = () => {
      lewatRiwayat.current = true;
    };
    window.addEventListener("popstate", tandai);
    return () => window.removeEventListener("popstate", tandai);
  }, []);
  useEffect(() => {
    if (pertama.current) {
      pertama.current = false;
    } else if (lewatRiwayat.current) {
      lewatRiwayat.current = false;
    } else if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [path]);

  // Saat menu ponsel terbuka, halaman di belakangnya tidak ikut tergulir.
  useEffect(() => {
    if (!open) return;
    const akar = document.documentElement;
    const lama = akar.style.overflow;
    akar.style.overflow = "hidden";
    const tekan = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenedAt(null);
    };
    window.addEventListener("keydown", tekan);
    return () => {
      akar.style.overflow = lama;
      window.removeEventListener("keydown", tekan);
    };
  }, [open]);

  return (
    <>
      <BarisDarurat />
      {!beranda && (
        <>
          <header className="bch-kepala">
            <div className="bch-kepala-utama">
              <span aria-hidden="true" />
              <Link href="/" className="bch-wordmark">
                {SITE_LOGO}
              </Link>
              <div className="bch-nav-tools">
                <Link href="/cari" prefetch={false} className="bch-icon-btn" aria-label="Cari">
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
          </header>
          <div className="bch-pita-menu">
            <MenuBagian path={path} className="bch-menu" />
          </div>
          <Submenu path={path} />
        </>
      )}
      {open && (
        <nav id="bch-toc" className="bch-toc" aria-label="Menu">
          <button type="button" className="bch-icon-btn bch-toc-tutup" onClick={() => setOpenedAt(null)} aria-label="Tutup menu">
            <Icon d={CLOSE} />
          </button>
          <ul>
            <li>
              <Link href="/" className="bch-toc-bagian" aria-current={beranda ? "page" : undefined}>
                Beranda
              </Link>
            </li>
            {BAGIAN.map((b) => (
              <li key={b.id}>
                <Link href={b.href} className="bch-toc-bagian">
                  {b.nama}
                </Link>
                {b.isi.length > 0 && (
                  <div className="bch-toc-isi">
                    {b.isi.map((s) => (
                      <Link key={s.href} href={s.href} prefetch={false}>
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
