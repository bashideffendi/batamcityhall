"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrency } from "../lib/currency";
import { useFavorites } from "../lib/favorites";
import { CURRENCIES, type Currency } from "../lib/format";
import { LANGS, useI18n, type KunciTeks } from "../lib/i18n";

const MENU: { href: string; teks: KunciTeks; juga?: string }[] = [
  { href: "/makan/hidangan", teks: "nav_dish" },
  { href: "/makan/kawasan", teks: "nav_area" },
  { href: "/makan/panduan", teks: "nav_guides" },
  { href: "/makan/dekat-feri", teks: "nav_ferry" },
  { href: "/makan/peta", teks: "nav_map" },
  { href: "/makan/simpanan", teks: "nav_saved" },
];

// Kepala bagian Makan, di bawah menu situs: nama bagian, enam menu, pilihan bahasa dan perkiraan harga.
export default function MakanNav() {
  const path = usePathname();
  const { t, lang, setLang } = useI18n();
  const { currency, setCurrency } = useCurrency();
  const { ids } = useFavorites();

  return (
    <div className="mk-nav">
      <div className="mk-nav-dalam">
        <nav aria-label={t("nav_label")} className="mk-nav-menu">
          <Link href="/makan" className="mk-nav-nama" aria-current={path === "/makan" ? "page" : undefined}>
            {t("nav_home")}
          </Link>
          {MENU.map((m) => (
            <Link key={m.href} href={m.href} aria-current={path.startsWith(m.href) ? "page" : undefined}>
              {t(m.teks)}
              {m.href === "/makan/simpanan" && ids.length > 0 && <span className="mk-nav-n">{ids.length}</span>}
            </Link>
          ))}
        </nav>
        <div className="mk-nav-alat">
          <label className="mk-mata-uang">
            <span className="mk-sr">{t("currency")}</span>
            <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c === "IDR" ? t("rupiah_only") : `≈ ${c}`}
                </option>
              ))}
            </select>
          </label>
          <div role="group" aria-label={t("language")} className="mk-bahasa">
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                aria-pressed={lang === l.code}
                aria-label={`${l.label}, ${l.nama}`}
                onClick={() => setLang(l.code)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
