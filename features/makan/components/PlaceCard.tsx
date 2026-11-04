"use client";

import Link from "next/link";
import Thumb from "./Thumb";
import FavButton from "./FavButton";
import { HalalBadge, LabelBadge } from "./Badges";
import { useI18n, catName } from "@/features/makan/lib/i18n";
import { useFilters } from "@/features/makan/lib/filters";
import { categoryMap, areaMap, haversineKm } from "@/features/makan/lib/data";
import { formatRating, formatReviews, isOpenNow, formatKm } from "@/features/makan/lib/format";
import type { PlaceWithGeo } from "@/features/makan/lib/types";

function Stars({ rating }: { rating: number | null }) {
  if (rating == null) return null;
  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-ink">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="#f2a310">
        <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2Z" />
      </svg>
      {formatRating(rating)}
    </span>
  );
}

export default function PlaceCard({
  place,
  variant = "row",
}: {
  place: PlaceWithGeo;
  variant?: "row" | "tile";
}) {
  const { t, lang } = useI18n();
  const { state } = useFilters();
  const cat = categoryMap[place.category];
  const area = areaMap[place.area]?.name ?? "";
  const open = isOpenNow(place.hours);
  const dist = state.userLoc
    ? haversineKm(state.userLoc.lat, state.userLoc.lng, place.lat, place.lng)
    : null;

  if (variant === "tile") {
    return (
      <Link
        href={`/tempat/${place.id}`}
        className="group block w-[200px] shrink-0 overflow-hidden rounded-2xl border border-line bg-card shadow-[var(--shadow-card)] md:w-auto md:shrink"
      >
        <div className="relative">
          <Thumb category={place.category} className="h-28 w-full" rounded="rounded-none" />
          <FavButton id={place.id} size={30} className="absolute right-2 top-2" />
          {place.labels[0] && (
            <span className="absolute left-2 top-2">
              <LabelBadge label={place.labels[0]} />
            </span>
          )}
        </div>
        <div className="p-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted">
            <span>{cat?.emoji}</span>
            <span className="clamp-1">{catName(lang, cat)}</span>
          </div>
          <h3 className="clamp-1 mt-0.5 text-sm font-bold">{place.name}</h3>
          <div className="mt-1.5 flex items-center justify-between">
            <HalalBadge status={place.halal} />
            <Stars rating={place.rating} />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/tempat/${place.id}`}
      className="flex gap-3 rounded-2xl border border-line bg-card p-2.5 shadow-[var(--shadow-card)] transition active:scale-[0.99]"
    >
      <Thumb category={place.category} className="h-[88px] w-[88px] shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted">
              <span>{cat?.emoji}</span>
              <span className="clamp-1">{catName(lang, cat)}</span>
            </div>
            <h3 className="clamp-1 text-[15px] font-bold leading-tight">{place.name}</h3>
          </div>
          <FavButton id={place.id} size={32} />
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <HalalBadge status={place.halal} />
          {place.labels[0] && <LabelBadge label={place.labels[0]} />}
        </div>

        <div className="mt-1.5 flex items-center gap-2 text-xs text-muted">
          <Stars rating={place.rating} />
          {place.reviews != null && (
            <span className="text-[11px]">({formatReviews(place.reviews)})</span>
          )}
          <span className="text-line">·</span>
          <span className="font-bold text-ink">{place.price_tier}</span>
          {open !== null && (
            <>
              <span className="text-line">·</span>
              <span className={open ? "font-semibold text-halal" : "font-semibold text-nonhalal"}>
                {open ? t("open_now") : t("closed_now")}
              </span>
            </>
          )}
        </div>
        <div className="clamp-1 mt-0.5 text-[11px] text-muted">
          📍 {area}
          {dist != null && (
            <span className="ml-1 font-semibold text-teal">
              · {formatKm(dist)} {t("from_you")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
