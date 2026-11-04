"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/features/makan/lib/i18n";
import { useCurrency } from "@/features/makan/lib/currency";
import { CURRENCIES } from "@/features/makan/lib/format";
import type { Lang } from "@/features/makan/lib/types";
import type { Currency } from "@/features/makan/lib/format";

const LANGS: { code: Lang; label: string }[] = [
  { code: "id", label: "ID" },
  { code: "en", label: "EN" },
  { code: "zh", label: "中" },
];

export default function Header() {
  const { lang, setLang, t } = useI18n();
  const { currency, setCurrency } = useCurrency();
  const path = usePathname();

  const nav = [
    { href: "/", label: t("nav_home") },
    { href: "/peta", label: t("nav_map") },
    { href: "/daftar", label: t("nav_list") },
    { href: "/kategori", label: t("nav_cat") },
    { href: "/jalur", label: t("trails") },
    { href: "/saved", label: t("nav_saved") },
    { href: "/about", label: t("nav_about") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-3 md:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-brick text-white shadow-[0_4px_12px_rgba(226,85,43,0.4)]">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"
                fill="currentColor"
              />
              <circle cx="12" cy="9" r="2.6" fill="#0e7c7b" />
            </svg>
          </span>
          <span className="text-[16px] font-extrabold tracking-tight">
            Batam<span className="text-brick">Bites</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 text-sm font-bold text-muted md:flex">
          {nav.map((it) => {
            const active =
              it.href === "/" ? path === "/" : path.startsWith(it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                className={`rounded-full px-3 py-1.5 transition hover:bg-sand ${
                  active ? "bg-sand text-brick" : ""
                }`}
              >
                {it.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            aria-label="Currency"
            className="rounded-full border border-line bg-card px-2 py-1.5 text-[11px] font-bold outline-none"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <div className="flex items-center rounded-full border border-line bg-card p-0.5 text-[11px] font-bold">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`rounded-full px-2 py-1 transition ${
                  lang === l.code ? "bg-ink text-white" : "text-muted"
                }`}
                aria-pressed={lang === l.code}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
