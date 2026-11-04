"use client";

import { useFilters } from "@/features/makan/lib/filters";
import { useI18n } from "@/features/makan/lib/i18n";

export default function SearchBar() {
  const { state, set } = useFilters();
  const { t } = useI18n();
  return (
    <div className="relative">
      <svg
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        value={state.query}
        onChange={(e) => set({ query: e.target.value })}
        placeholder={t("search_ph")}
        className="w-full rounded-full border border-line bg-card py-3 pl-11 pr-10 text-sm font-medium shadow-[var(--shadow-card)] outline-none placeholder:text-muted focus:border-brick/50"
      />
      {state.query && (
        <button
          onClick={() => set({ query: "" })}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-sand text-muted"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
