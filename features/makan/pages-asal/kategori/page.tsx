"use client";

import { useRouter } from "next/navigation";
import { useFilters } from "@/features/makan/lib/filters";
import { useI18n, catName } from "@/features/makan/lib/i18n";
import { categories, categoryCounts } from "@/features/makan/lib/data";

export default function KategoriPage() {
  const { reset, set } = useFilters();
  const { t, lang } = useI18n();
  const router = useRouter();

  const open = (id: string) => {
    reset();
    set({ cats: [id] });
    router.push("/daftar");
  };

  return (
    <div className="no-scrollbar overflow-y-auto pb-28">
      <div className="px-4 pt-4">
        <h1 className="text-xl font-extrabold">{t("browse_cat")}</h1>
        <p className="mt-0.5 text-[13px] text-muted">
          {lang === "id"
            ? "17 kategori kuliner khas Batam."
            : "17 categories of Batam's food scene."}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 px-4 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => open(c.id)}
            className="relative overflow-hidden rounded-2xl border border-line bg-card p-3.5 text-left shadow-[var(--shadow-card)] transition active:scale-[0.98]"
          >
            <span
              className="absolute -right-3 -top-3 text-5xl opacity-15"
              style={{ transform: "rotate(-10deg)" }}
              aria-hidden
            >
              {c.emoji}
            </span>
            <span
              className="grid h-9 w-9 place-items-center rounded-xl text-lg"
              style={{ background: `${c.color}1f` }}
            >
              {c.emoji}
            </span>
            <div className="mt-2 text-sm font-bold leading-tight">
              {catName(lang, c)}
            </div>
            <div className="mt-0.5 text-[11px] font-semibold text-muted">
              {categoryCounts[c.id] ?? 0} {t("results")}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
