"use client";

import Link from "next/link";
import MenuBagian from "@/components/site/MenuBagian";
import { BUKA_MENU, CARI, Icon, MENU, MOON, SUN } from "@/components/site/SiteNav";
import { useSiteTheme } from "@/components/site/useSiteTheme";
import { toggleTheme } from "@/lib/theme";

/**
 * Pita menu di dasar sampul beranda. Di layar lebar berisi menu bagian selebar wadah halaman, sama dengan kepala
 * normal; di layar sempit berisi tombol Menu yang membuka menu layar penuh.
 */
export function MenuSampul() {
  return (
    <div className="bch-sampul-pita">
      <div className="bch-sampul-pita-dalam">
        {/* Tanpa aria-controls: menu layar penuh baru ada di halaman setelah dibuka. */}
        <button
          type="button"
          className="bch-icon-btn bch-sampul-tombol-menu"
          onClick={() => window.dispatchEvent(new Event(BUKA_MENU))}
          aria-label="Buka menu"
        >
          <Icon d={MENU} />
          <span aria-hidden="true">Menu</span>
        </button>
        <MenuBagian path="/" className="bch-menu bch-sampul-menu" />
      </div>
    </div>
  );
}

/** Tombol cari dan tema di kanan atas sampul, di samping tanggal. */
export function AlatSampul() {
  const theme = useSiteTheme();
  return (
    <>
      <Link href="/cari" prefetch={false} className="bch-icon-btn bch-sampul-alat" aria-label="Cari">
        <Icon d={CARI} />
      </Link>
      <button
        type="button"
        className="bch-icon-btn bch-sampul-alat"
        onClick={toggleTheme}
        aria-label={theme === "dark" ? "Ganti ke tampilan terang" : "Ganti ke tampilan gelap"}
      >
        <Icon d={theme === "dark" ? SUN : MOON} />
      </button>
    </>
  );
}
