"use client";

import Link from "next/link";
import Thumb from "./Thumb";
import FavButton from "./FavButton";
import { HalalBadge } from "./Badges";
import { useFilters } from "@/features/makan/lib/filters";
import { useI18n, catName } from "@/features/makan/lib/i18n";
import { placeMap, categoryMap, ferryMap } from "@/features/makan/lib/data";
import { formatRating } from "@/features/makan/lib/format";

export default function MiniCard() {
  const { selectedId, setSelectedId } = useFilters();
  const { t, lang } = useI18n();
  if (!selectedId) return null;
  const p = placeMap[selectedId];
  if (!p) return null;
  const cat = categoryMap[p.category];
  const ferry = ferryMap[p.nearestFerryId];

  return (
    <div className="animate-sheet pointer-events-auto absolute inset-x-3 bottom-3 z-[500] rounded-2xl border border-line bg-card p-2.5 shadow-[var(--shadow-pop)]">
      <button
        onClick={() => setSelectedId(null)}
        aria-label="Close"
        className="absolute -top-2.5 -right-2.5 z-10 grid h-7 w-7 place-items-center rounded-full border border-line bg-card text-muted shadow"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
      <Link href={`/tempat/${p.id}`} className="flex gap-3">
        <Thumb category={p.category} className="h-[76px] w-[76px] shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted">
            <span>{cat?.emoji}</span>
            <span className="clamp-1">{catName(lang, cat)}</span>
          </div>
          <h3 className="clamp-1 text-[15px] font-bold leading-tight">{p.name}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <HalalBadge status={p.halal} />
            {p.rating != null && (
              <span className="inline-flex items-center gap-0.5 text-xs font-bold">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#f2a310"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2Z" /></svg>
                {formatRating(p.rating)}
              </span>
            )}
            <span className="text-xs font-bold text-ink">{p.price_tier}</span>
          </div>
          <div className="clamp-1 mt-1 text-[11px] text-muted">
            ⛴ {p.nearestFerryKm} km {t("from_ferry")} {ferry?.name.replace(/ (Ferry|International).*$/, "")}
          </div>
        </div>
      </Link>
      <div className="mt-2 flex items-center gap-2">
        <Link
          href={`/tempat/${p.id}`}
          className="flex-1 rounded-full bg-ink py-2 text-center text-xs font-bold text-white"
        >
          {t("detail")}
        </Link>
        <a
          href={p.gmaps}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-full bg-brick py-2 text-center text-xs font-bold text-white"
        >
          {t("navigate")}
        </a>
        <FavButton id={p.id} size={36} />
      </div>
    </div>
  );
}
