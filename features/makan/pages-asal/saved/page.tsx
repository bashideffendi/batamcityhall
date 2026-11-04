"use client";

import Link from "next/link";
import PlaceCard from "@/features/makan/components/PlaceCard";
import { useFavorites } from "@/features/makan/lib/favorites";
import { useI18n } from "@/features/makan/lib/i18n";
import { placeMap } from "@/features/makan/lib/data";

export default function SavedPage() {
  const { ids, ready } = useFavorites();
  const { t } = useI18n();
  const saved = ids.map((id) => placeMap[id]).filter(Boolean);

  return (
    <div className="no-scrollbar overflow-y-auto pb-28">
      <div className="px-4 pt-4">
        <h1 className="text-xl font-extrabold">❤️ {t("saved_title")}</h1>
        <p className="mt-0.5 text-[13px] text-muted">
          {saved.length} {t("results")}
        </p>
      </div>

      <div className="mt-4 space-y-2.5 px-4 md:grid md:auto-rows-min md:grid-cols-2 md:gap-3 md:space-y-0 lg:grid-cols-3">
        {ready && saved.length === 0 && (
          <div className="mt-16 text-center">
            <div className="text-5xl">🍽️</div>
            <p className="mx-auto mt-3 max-w-[16rem] text-sm text-muted">
              {t("saved_empty")}
            </p>
            <Link
              href="/daftar"
              className="mt-4 inline-block rounded-full bg-brick px-5 py-2.5 text-sm font-bold text-white"
            >
              {t("all_places")} →
            </Link>
          </div>
        )}
        {saved.map((p) => (
          <PlaceCard key={p.id} place={p} />
        ))}
      </div>
    </div>
  );
}
