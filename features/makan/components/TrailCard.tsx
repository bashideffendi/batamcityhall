"use client";

import Link from "next/link";
import { useI18n } from "@/features/makan/lib/i18n";
import { trailStops, trailTitle, trailSubtitle, trailDuration } from "@/features/makan/lib/trails";
import type { Trail } from "@/features/makan/lib/types";

export default function TrailCard({
  trail,
  variant = "full",
}: {
  trail: Trail;
  variant?: "full" | "tile";
}) {
  const { t, lang } = useI18n();
  const n = trailStops(trail).length;

  return (
    <Link
      href={`/jalur/${trail.id}`}
      className={`block overflow-hidden rounded-2xl border border-line bg-card shadow-[var(--shadow-card)] transition active:scale-[0.99] ${
        variant === "tile" ? "w-[260px] shrink-0 md:w-auto md:shrink" : ""
      }`}
    >
      <div
        className="flex items-center gap-3 px-4 py-3.5"
        style={{
          backgroundImage: `linear-gradient(135deg, ${trail.color}, ${trail.color}cc)`,
        }}
      >
        <span className="text-3xl drop-shadow" aria-hidden>
          {trail.emoji}
        </span>
        <h3 className="clamp-2 text-[15px] font-extrabold leading-tight text-white">
          {trailTitle(lang, trail)}
        </h3>
      </div>
      <div className="p-3">
        <p className="clamp-2 text-xs leading-relaxed text-muted">
          {trailSubtitle(lang, trail)}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-bold text-muted">
          <span>📍 {n} {t("stops")}</span>
          <span className="text-line">·</span>
          <span>⏱ {trailDuration(lang, trail)}</span>
          <span className="text-line">·</span>
          <span>{trail.area}</span>
        </div>
      </div>
    </Link>
  );
}
