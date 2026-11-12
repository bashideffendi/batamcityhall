"use client";

import Link from "next/link";
import MenuBagian from "@/components/site/MenuBagian";
import { CARI, Icon, MOON, SUN } from "@/components/site/SiteNav";
import { useSiteTheme } from "@/components/site/useSiteTheme";
import { toggleTheme } from "@/lib/theme";

/**
 * Pita menu di dasar sampul beranda: menu bagian yang sama dengan kepala halaman lain, di semua ukuran layar. Panel
 * Lainnya membuka ke atas karena pita menempel di dasar layar.
 */
export function MenuSampul() {
  return (
    <div className="bch-sampul-pita">
      <div className="bch-sampul-pita-dalam">
        <MenuBagian path="/" className="bch-menu bch-sampul-menu" arah="atas" />
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
