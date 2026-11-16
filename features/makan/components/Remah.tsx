"use client";

import Link from "next/link";
import { useI18n } from "../lib/i18n";

/** Remah roti halaman Makanan. */
export default function Remah({ isi }: { isi: { teks: string; href?: string }[] }) {
  const { t } = useI18n();
  return (
    <nav className="bch-remah" aria-label={t("breadcrumb")}>
      {isi.map((x, i) => (
        <span key={x.teks}>
          {i > 0 && " / "}
          {x.href ? <Link href={x.href}>{x.teks}</Link> : <span aria-current="page">{x.teks}</span>}
        </span>
      ))}
    </nav>
  );
}
