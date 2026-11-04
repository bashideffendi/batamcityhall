"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchBar from "@/features/makan/components/SearchBar";
import PlaceCard from "@/features/makan/components/PlaceCard";
import TrailCard from "@/features/makan/components/TrailCard";
import { useFilters, type FilterState } from "@/features/makan/lib/filters";
import { useI18n, catName } from "@/features/makan/lib/i18n";
import { places, categories, ferries } from "@/features/makan/lib/data";
import { trails } from "@/features/makan/lib/trails";

const featured = places.filter((p) => p.featured);
const legendaris = places.filter((p) => p.labels.includes("legendaris"));
const hits = places.filter((p) => p.labels.includes("hits"));

function Row({
  title,
  emoji,
  items,
  onSeeAll,
}: {
  title: string;
  emoji: string;
  items: typeof places;
  onSeeAll: () => void;
}) {
  const { t } = useI18n();
  if (items.length === 0) return null;
  return (
    <section className="mt-5">
      <div className="mb-2 flex items-center justify-between px-4">
        <h2 className="text-[15px] font-extrabold">
          <span className="mr-1.5">{emoji}</span>
          {title}
        </h2>
        <button onClick={onSeeAll} className="text-xs font-bold text-brick">
          {t("see_all")} →
        </button>
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible lg:grid-cols-4">
        {items.slice(0, 8).map((p) => (
          <PlaceCard key={p.id} place={p} variant="tile" />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const { t, lang } = useI18n();
  const { set, reset, state, results } = useFilters();
  const router = useRouter();

  const go = (patch: Partial<FilterState>, path = "/daftar") => {
    reset();
    set(patch);
    router.push(path);
  };

  const searching = state.query.trim().length > 0;

  return (
    <div className="no-scrollbar overflow-y-auto pb-28">
      {/* Hero */}
      <div className="bg-gradient-to-b from-sand to-bg px-4 pb-3 pt-4 md:pb-8 md:pt-12">
        <h1 className="text-[22px] font-extrabold leading-tight md:text-[40px]">
          {lang === "id" ? (
            <>
              Makan enak di Batam,
              <br />
              <span className="text-brick">tanpa nyasar.</span>
            </>
          ) : lang === "zh" ? (
            <>
              吃遍巴淡岛，
              <br />
              <span className="text-brick">像当地人一样。</span>
            </>
          ) : (
            <>
              Eat the best of Batam,
              <br />
              <span className="text-brick">like a local.</span>
            </>
          )}
        </h1>
        <p className="mt-1 text-[13px] text-muted md:mt-3 md:text-lg">
          {lang === "id"
            ? `${places.length} warung legendaris, seafood, & hidden gem — dikurasi, gratis, tanpa iklan.`
            : lang === "zh"
              ? `${places.length} 家老字号、海鲜与隐藏美食 — 精心精选，免费，无广告。`
              : `${places.length} legendary warungs, seafood & hidden gems — curated, free, ad-free.`}
        </p>
        <div className="mt-3 md:max-w-xl">
          <SearchBar />
        </div>
      </div>

      {searching ? (
        <section className="px-4 pt-3">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold text-muted">
              {results.length} {t("results")}
            </h2>
            <Link href="/daftar" className="text-xs font-bold text-brick">
              {t("see_all")} →
            </Link>
          </div>
          <div className="space-y-2.5 md:grid md:grid-cols-2 md:gap-3 md:space-y-0 lg:grid-cols-3">
            {results.slice(0, 9).map((p) => (
              <PlaceCard key={p.id} place={p} />
            ))}
            {results.length === 0 && (
              <p className="py-10 text-center text-sm text-muted md:col-span-full">
                {t("no_results")}
              </p>
            )}
          </div>
        </section>
      ) : (
        <>
          {/* Quick chips */}
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto px-4 md:flex-wrap">
            <button
              onClick={() => go({ halal: ["halal"] })}
              className="shrink-0 rounded-full bg-halal/12 px-3.5 py-2 text-xs font-bold text-halal"
            >
              ☪︎ Halal
            </button>
            {["seafood-gonggong", "sup-ikan", "mie-tarempa", "kopitiam", "oleh-oleh"].map(
              (id) => {
                const c = categories.find((x) => x.id === id)!;
                return (
                  <button
                    key={id}
                    onClick={() => go({ cats: [id] })}
                    className="shrink-0 rounded-full border border-line bg-card px-3.5 py-2 text-xs font-bold"
                  >
                    {c.emoji} {catName(lang, c)}
                  </button>
                );
              },
            )}
          </div>

          {/* Near ferry */}
          <section className="mt-5 px-4">
            <h2 className="mb-2 text-[15px] font-extrabold">⛴ {t("near_ferry")}</h2>
            <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
              {ferries.map((f) => (
                <button
                  key={f.id}
                  onClick={() => go({ ferry: f.id, sort: "ferry" }, "/peta")}
                  className="rounded-2xl border border-line bg-card p-3 text-left shadow-[var(--shadow-card)] transition active:scale-[0.98]"
                >
                  <div className="text-sm font-bold">
                    {f.name.replace(/ (Ferry|International).*$/, "")}
                  </div>
                  <div className="clamp-2 mt-0.5 text-[11px] text-muted">
                    {lang === "id" ? f.blurb_id : f.blurb_en}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Curated rows */}
          <Row
            title={t("must_try")}
            emoji="⭐"
            items={featured}
            onSeeAll={() => go({ sort: "featured" })}
          />
          <Row
            title={t("legendary")}
            emoji="🏆"
            items={legendaris}
            onSeeAll={() => go({ labels: ["legendaris"] })}
          />
          <Row
            title={t("hits")}
            emoji="🔥"
            items={hits}
            onSeeAll={() => go({ labels: ["hits"] })}
          />

          {/* Food Trails */}
          <section className="mt-6">
            <div className="mb-2 flex items-center justify-between px-4">
              <h2 className="text-[15px] font-extrabold">🗺️ {t("trails")}</h2>
              <Link href="/jalur" className="text-xs font-bold text-brick">
                {t("see_all")} →
              </Link>
            </div>
            <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible lg:grid-cols-5">
              {trails.map((tr) => (
                <TrailCard key={tr.id} trail={tr} variant="tile" />
              ))}
            </div>
          </section>

          {/* Category grid */}
          <section className="mt-6 px-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-[15px] font-extrabold">🍽️ {t("browse_cat")}</h2>
              <Link href="/kategori" className="text-xs font-bold text-brick">
                {t("see_all")} →
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-2 md:grid-cols-8">
              {categories.slice(0, 8).map((c) => (
                <button
                  key={c.id}
                  onClick={() => go({ cats: [c.id] })}
                  className="flex flex-col items-center gap-1 rounded-2xl border border-line bg-card py-3"
                >
                  <span className="text-2xl">{c.emoji}</span>
                  <span className="clamp-1 w-full px-1 text-center text-[10px] font-semibold text-muted">
                    {catName(lang, c)}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Trust note */}
          <p className="mx-4 mt-6 rounded-2xl bg-sand px-4 py-3 text-center text-[11px] leading-relaxed text-muted">
            {lang === "id"
              ? `Dikurasi tangan dari ${places.length}+ tempat. Tanpa listing berbayar, tanpa bias iklan.`
              : `Hand-curated from ${places.length}+ places. No paid listings, no ad bias.`}
            <br />
            <Link href="/about" className="font-bold text-brick">
              {t("nav_about")} →
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
