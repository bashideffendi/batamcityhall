"use client";

import { useState } from "react";
import { useFilters } from "@/features/makan/lib/filters";
import {
  useI18n,
  catName,
  HALAL_LABEL,
  LABEL_LABEL,
  PRICE_HINT,
} from "@/features/makan/lib/i18n";
import { categories, areas, ferries } from "@/features/makan/lib/data";
import type { HalalStatus, PriceTier, RecLabel } from "@/features/makan/lib/types";

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
        active
          ? "border-brick bg-brick text-white"
          : "border-line bg-card text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-3">
      <h3 className="mb-2 text-[11px] font-extrabold uppercase tracking-wide text-muted">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

const HALAL_OPTS: HalalStatus[] = ["halal", "muslim-friendly", "non-halal"];
const TIER_OPTS: PriceTier[] = ["$", "$$", "$$$"];
const LABEL_OPTS: RecLabel[] = ["wajib-coba", "legendaris", "hits", "hidden-gem"];

export default function FilterBar({ floating = false }: { floating?: boolean }) {
  const { state, set, toggle, reset, activeCount, results } = useFilters();
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [locating, setLocating] = useState(false);

  const requestLoc = () => {
    if (state.userLoc) {
      set({ userLoc: null, sort: "featured" });
      return;
    }
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      alert(t("loc_denied"));
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        set({
          userLoc: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          sort: "nearby",
        });
        setLocating(false);
      },
      () => {
        alert(t("loc_denied"));
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const rowBase =
    "no-scrollbar flex items-center gap-2 overflow-x-auto px-4 py-2.5";
  const rowClass = floating
    ? `${rowBase} rounded-full`
    : `${rowBase} border-b border-line bg-bg`;

  return (
    <>
      <div className={rowClass}>
        <button
          onClick={() => setOpen(true)}
          className="relative flex shrink-0 items-center gap-1.5 rounded-full border border-ink bg-ink px-3 py-1.5 text-xs font-bold text-white"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M3 5h18M6 12h12M10 19h4" />
          </svg>
          {t("filters")}
          {activeCount > 0 && (
            <span className="grid h-4 min-w-4 place-items-center rounded-full bg-brick px-1 text-[9px]">
              {activeCount}
            </span>
          )}
        </button>

        <Chip active={state.halal.includes("halal")} onClick={() => toggle("halal", "halal")}>
          ☪︎ {HALAL_LABEL.halal[lang]}
        </Chip>
        <Chip active={state.openNow} onClick={() => set({ openNow: !state.openNow })}>
          🟢 {t("open_now")}
        </Chip>
        <Chip active={!!state.userLoc} onClick={requestLoc}>
          📍 {locating ? t("locating") : t("near_me")}
        </Chip>
        <span className="h-5 w-px shrink-0 bg-line" />
        {categories.map((c) => (
          <Chip
            key={c.id}
            active={state.cats.includes(c.id)}
            onClick={() => toggle("cats", c.id)}
          >
            {c.emoji} {catName(lang, c)}
          </Chip>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-[1100] flex justify-center">
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
          <div className="animate-sheet absolute bottom-0 z-10 flex max-h-[85dvh] w-full max-w-[480px] flex-col rounded-t-3xl bg-card">
            <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
              <h2 className="text-base font-extrabold">{t("filters")}</h2>
              <button
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-sand"
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="no-scrollbar divide-y divide-line overflow-y-auto px-5">
              <Section title={t("halal_label")}>
                {HALAL_OPTS.map((h) => (
                  <Chip key={h} active={state.halal.includes(h)} onClick={() => toggle("halal", h)}>
                    {HALAL_LABEL[h][lang]}
                  </Chip>
                ))}
              </Section>

              <Section title={t("category")}>
                {categories.map((c) => (
                  <Chip key={c.id} active={state.cats.includes(c.id)} onClick={() => toggle("cats", c.id)}>
                    {c.emoji} {catName(lang, c)}
                  </Chip>
                ))}
              </Section>

              <Section title={t("price")}>
                {TIER_OPTS.map((p) => (
                  <Chip key={p} active={state.tiers.includes(p)} onClick={() => toggle("tiers", p)}>
                    {p} · {PRICE_HINT[p][lang]}
                  </Chip>
                ))}
              </Section>

              <Section title={t("area")}>
                {areas.map((a) => (
                  <Chip key={a.id} active={state.areas.includes(a.id)} onClick={() => toggle("areas", a.id)}>
                    {a.name}
                  </Chip>
                ))}
              </Section>

              <Section title={t("ferry")}>
                {ferries.map((f) => (
                  <Chip
                    key={f.id}
                    active={state.ferry === f.id}
                    onClick={() => set({ ferry: state.ferry === f.id ? null : f.id })}
                  >
                    ⛴ {f.name.replace(/ (Ferry|International).*$/, "")}
                  </Chip>
                ))}
              </Section>

              <Section title={t("labels")}>
                {LABEL_OPTS.map((l) => (
                  <Chip key={l} active={state.labels.includes(l)} onClick={() => toggle("labels", l)}>
                    {LABEL_LABEL[l][lang]}
                  </Chip>
                ))}
              </Section>
            </div>

            <div className="flex items-center gap-3 border-t border-line px-5 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
              <button
                onClick={reset}
                className="rounded-full border border-line px-5 py-2.5 text-sm font-bold text-muted"
              >
                {t("reset")}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="flex-1 rounded-full bg-brick py-2.5 text-sm font-extrabold text-white shadow-[0_6px_18px_rgba(226,85,43,0.35)]"
              >
                {t("apply")} · {results.length} {t("results")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
