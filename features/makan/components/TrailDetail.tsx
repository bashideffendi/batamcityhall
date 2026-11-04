"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import PlaceCard from "./PlaceCard";
import { useI18n } from "@/features/makan/lib/i18n";
import { trailStops, trailTitle, trailSubtitle, trailDuration } from "@/features/makan/lib/trails";
import type { Trail } from "@/features/makan/lib/types";

const TrailMap = dynamic(() => import("./TrailMap"), {
  ssr: false,
  loading: () => <div className="h-56 w-full bg-sand" />,
});

export default function TrailDetail({ trail }: { trail: Trail }) {
  const { t, lang } = useI18n();
  const router = useRouter();
  const stops = trailStops(trail);

  return (
    <div className="no-scrollbar overflow-y-auto pb-28 md:mx-auto md:max-w-3xl md:pb-10">
      <div
        className="relative px-4 pb-5 pt-4"
        style={{
          backgroundImage: `linear-gradient(150deg, ${trail.color}, ${trail.color}cc)`,
        }}
      >
        <button
          onClick={() => router.back()}
          aria-label="Back"
          className="mb-3 grid h-9 w-9 place-items-center rounded-full bg-white/25 text-white backdrop-blur"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div className="flex items-start gap-3">
          <span className="text-4xl drop-shadow" aria-hidden>
            {trail.emoji}
          </span>
          <div>
            <h1 className="text-xl font-extrabold leading-tight text-white">
              {trailTitle(lang, trail)}
            </h1>
            <p className="mt-1 text-[13px] leading-snug text-white/90">
              {trailSubtitle(lang, trail)}
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-bold text-white">
          <span className="rounded-full bg-white/25 px-2.5 py-1 backdrop-blur">
            📍 {stops.length} {t("stops")}
          </span>
          <span className="rounded-full bg-white/25 px-2.5 py-1 backdrop-blur">
            ⏱ {trailDuration(lang, trail)}
          </span>
          <span className="rounded-full bg-white/25 px-2.5 py-1 backdrop-blur">
            {trail.area}
          </span>
        </div>
      </div>

      <div className="px-4">
        <div className="mt-4 overflow-hidden rounded-2xl border border-line">
          <TrailMap stops={stops} color={trail.color} />
        </div>

        <ol className="mt-4 space-y-3">
          {stops.map((p, i) => (
            <li key={p.id} className="flex items-stretch gap-2">
              <span
                className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-extrabold text-white"
                style={{ background: trail.color }}
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <PlaceCard place={p} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
