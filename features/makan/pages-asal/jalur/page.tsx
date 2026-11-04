"use client";

import TrailCard from "@/features/makan/components/TrailCard";
import { useI18n } from "@/features/makan/lib/i18n";
import { trails } from "@/features/makan/lib/trails";

export default function JalurPage() {
  const { t, lang } = useI18n();
  const id = lang === "id";

  return (
    <div className="no-scrollbar overflow-y-auto px-4 pb-28 pt-4">
      <h1 className="text-xl font-extrabold">🗺️ {t("trails")}</h1>
      <p className="mt-0.5 text-[13px] text-muted">
        {id
          ? "Rute kuliner tematik — tinggal ikutin urutannya."
          : lang === "zh"
            ? "主题美食路线——跟着顺序走就行。"
            : "Themed food routes — just follow the order."}
      </p>

      <div className="mt-4 space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 lg:grid-cols-3">
        {trails.map((tr) => (
          <TrailCard key={tr.id} trail={tr} />
        ))}
      </div>
    </div>
  );
}
