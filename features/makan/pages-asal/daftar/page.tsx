"use client";

import Link from "next/link";
import SearchBar from "@/features/makan/components/SearchBar";
import FilterBar from "@/features/makan/components/FilterBar";
import PlaceCard from "@/features/makan/components/PlaceCard";
import { useFilters, type SortKey } from "@/features/makan/lib/filters";
import { useI18n } from "@/features/makan/lib/i18n";

export default function DaftarPage() {
  const { results, state, set } = useFilters();
  const { t } = useI18n();

  return (
    <div className="flex h-[calc(100dvh-3.5rem-4.25rem)] flex-col md:h-[calc(100dvh-3.5rem)]">
      <div className="space-y-2.5 px-4 pt-3">
        <SearchBar />
      </div>
      <FilterBar />

      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-xs font-bold text-muted">
          {results.length} {t("results")}
        </span>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 rounded-full border border-line bg-card px-2.5 py-1.5 text-xs font-bold">
            <span className="text-muted">{t("sort")}:</span>
            <select
              value={state.sort}
              onChange={(e) => set({ sort: e.target.value as SortKey })}
              className="bg-transparent font-bold outline-none"
            >
              <option value="featured">{t("sort_featured")}</option>
              <option value="rating">{t("sort_rating")}</option>
              {state.userLoc && <option value="nearby">{t("sort_nearby")}</option>}
              <option value="ferry">{t("sort_nearest_ferry")}</option>
              <option value="az">{t("sort_az")}</option>
            </select>
          </label>
          <Link
            href="/peta"
            className="flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-bold text-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 3-6 2.5v15L9 18l6 3 6-2.5v-15L15 6 9 3Z" />
            </svg>
            {t("nav_map")}
          </Link>
        </div>
      </div>

      <div className="no-scrollbar flex-1 space-y-2.5 overflow-y-auto px-4 pb-28 pt-1 md:grid md:auto-rows-min md:grid-cols-2 md:gap-3 md:space-y-0 md:pb-8 lg:grid-cols-3">
        {results.length === 0 ? (
          <p className="mt-16 text-center text-sm text-muted md:col-span-full">
            {t("no_results")}
          </p>
        ) : (
          results.map((p) => <PlaceCard key={p.id} place={p} />)
        )}
      </div>
    </div>
  );
}
