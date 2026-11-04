"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrency } from "../lib/currency";
import { useFavorites } from "../lib/favorites";
import { CURRENCIES, type Currency } from "../lib/format";
import { LANGS, useI18n, type KunciTeks } from "../lib/i18n";

const MENU: { href: string; teks: KunciTeks }[] = [
  { href: "/makan", teks: "nav_home" },
  { href: "/makan/peta", teks: "nav_map" },
  { href: "/makan/daftar", teks: "nav_list" },
  { href: "/makan/kategori", teks: "nav_cat" },
  { href: "/makan/jalur", teks: "nav_trails" },
  { href: "/makan/tersimpan", teks: "nav_saved" },
  { href: "/makan/tentang", teks: "nav_about" },
];

// Menggantikan Header dan BottomNav batam-bites. Strip situs tetap di atasnya; ini hanya isi loket
// ditambah pilihan bahasa dan mata uang, yang situs belum punya.
export default function MakanNav() {
  const path = usePathname();
  const { t, lang, setLang } = useI18n();
  const { currency, setCurrency } = useCurrency();
  const { ids } = useFavorites();

  return (
    <div className="mk-nav">
      <nav aria-label={t("nav_label")} className="mk-nav-menu">
        {MENU.map((m) => {
          const aktif = m.href === "/makan" ? path === m.href : path.startsWith(m.href);
          return (
            <Link key={m.href} href={m.href} aria-current={aktif ? "page" : undefined}>
              {t(m.teks)}
              {m.href === "/makan/tersimpan" && ids.length > 0 && <span className="bch-data"> {ids.length}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="mk-nav-alat">
        <label className="mk-mata-uang">
          <span className="mk-sr">{t("currency")}</span>
          <select className="bch-select" value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
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
  );
}
