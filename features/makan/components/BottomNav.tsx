"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/features/makan/lib/i18n";
import { useFavorites } from "@/features/makan/lib/favorites";
import type { ReactNode } from "react";

function Icon({ name }: { name: string }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const paths: Record<string, ReactNode> = {
    home: <path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5" />,
    map: (
      <>
        <path d="m9 3-6 2.5v15L9 18l6 3 6-2.5v-15L15 6 9 3Z" />
        <path d="M9 3v15M15 6v15" />
      </>
    ),
    list: (
      <>
        <path d="M8 6h13M8 12h13M8 18h13" />
        <circle cx="3.5" cy="6" r="1" />
        <circle cx="3.5" cy="12" r="1" />
        <circle cx="3.5" cy="18" r="1" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    heart: (
      <path d="M12 20s-7-4.35-9.5-8.5C1 8.5 2.5 5 6 5c2 0 3.2 1.3 4 2.5C10.8 6.3 12 5 14 5c3.5 0 5 3.5 3.5 6.5C19 15.65 12 20 12 20Z" />
    ),
  };
  return <svg {...common}>{paths[name]}</svg>;
}

export default function BottomNav() {
  const path = usePathname();
  const { t } = useI18n();
  const { ids } = useFavorites();

  const items = [
    { href: "/", icon: "home", label: t("nav_home") },
    { href: "/peta", icon: "map", label: t("nav_map") },
    { href: "/daftar", icon: "list", label: t("nav_list") },
    { href: "/kategori", icon: "grid", label: t("nav_cat") },
    { href: "/saved", icon: "heart", label: t("nav_saved") },
  ];

  return (
    <nav className="bottom-safe fixed left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-line bg-card/95 backdrop-blur-md md:hidden">
      <ul className="flex items-stretch justify-around px-1 pt-1.5 pb-1.5">
        {items.map((it) => {
          const active =
            it.href === "/" ? path === "/" : path.startsWith(it.href);
          return (
            <li key={it.href} className="flex-1">
              <Link
                href={it.href}
                className={`relative flex flex-col items-center gap-0.5 rounded-xl py-1 text-[10px] font-semibold transition ${
                  active ? "text-brick" : "text-muted"
                }`}
              >
                <span className="relative">
                  <Icon name={it.icon} />
                  {it.icon === "heart" && ids.length > 0 && (
                    <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-brick px-1 text-[9px] font-bold text-white">
                      {ids.length}
                    </span>
                  )}
                </span>
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
