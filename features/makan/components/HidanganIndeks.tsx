"use client";

import { useI18n } from "../lib/i18n";
import IndeksHidangan from "./IndeksHidangan";
import Remah from "./Remah";

/** Halaman indeks Hidangan. Angka per kategori dihitung halaman server dan dikirim sebagai props. */
export default function HidanganIndeks({ jumlah, total }: { jumlah: Record<string, number>; total: number }) {
  const { t } = useI18n();
  return (
    <div className="bch-page">
      <Remah isi={[{ teks: t("nav_home"), href: "/makan" }, { teks: t("nav_dish") }]} />
      <h1 className="mk-judul">{t("nav_dish")}</h1>
      <IndeksHidangan jumlah={jumlah} total={total} />
    </div>
  );
}
