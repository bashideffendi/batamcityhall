"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import FilterBar from "./FilterBar";
import MiniCard from "./MiniCard";
import PlaceCard from "./PlaceCard";
import { useFilters } from "@/features/makan/lib/filters";
import { useI18n } from "@/features/makan/lib/i18n";

const MapCanvas = dynamic(() => import("./MapCanvas"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-[#aadaff]/40 text-sm font-semibold text-muted">
      Memuat peta…
    </div>
  ),
});

export default function MapView() {
  const { results } = useFilters();
  const { t } = useI18n();

  return (
    <div className="md:flex md:h-[calc(100dvh-3.5rem)]">
      {/* Desktop list panel */}
      <aside className="hidden md:flex md:w-[360px] md:shrink-0 md:flex-col md:border-r md:border-line">
        <FilterBar />
        <div className="border-b border-line px-4 py-2">
          <span className="text-xs font-bold text-muted">
            {results.length} {t("results")}
          </span>
        </div>
        <div className="no-scrollbar flex-1 space-y-2.5 overflow-y-auto px-3 py-3">
          {results.length === 0 ? (
            <p className="mt-10 text-center text-sm text-muted">{t("no_results")}</p>
          ) : (
            results.map((p) => <PlaceCard key={p.id} place={p} />)
          )}
        </div>
      </aside>

      {/* Map area */}
      <div className="relative h-[calc(100dvh-3.5rem-4.25rem)] w-full overflow-hidden md:h-auto md:flex-1">
        <MapCanvas />

        {/* Mobile-only floating filter bar */}
        <div className="pointer-events-none absolute inset-x-0 top-2 z-[600] md:hidden">
          <div className="pointer-events-auto mx-2 rounded-full border border-line bg-bg/95 shadow-[var(--shadow-card)] backdrop-blur">
            <FilterBar floating />
          </div>
        </div>

        {/* Mobile-only result count + list toggle */}
        <div className="pointer-events-none absolute inset-x-0 top-[60px] z-[550] flex items-center justify-between px-3 md:hidden">
          <span className="pointer-events-auto rounded-full bg-ink/85 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
            {results.length} {t("results")}
          </span>
          <Link
            href="/daftar"
            className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-card px-3.5 py-2 text-xs font-bold shadow-[var(--shadow-card)]"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" />
            </svg>
            {t("view_list")}
          </Link>
        </div>

        <MiniCard />
      </div>
    </div>
  );
}
