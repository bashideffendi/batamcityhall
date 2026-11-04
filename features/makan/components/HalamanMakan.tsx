"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { categories, categoryCounts, ferries, places } from "../lib/data";
import { useFilters, type FilterState, type SortKey } from "../lib/filters";
import { useI18n, catName } from "../lib/i18n";
import { RADIUS_FERI_KM } from "../lib/saring";
import { trails } from "../lib/trails";
import type { PlaceWithGeo, RecLabel } from "../lib/types";
import { HalalBadge, LabelBadge } from "./Badges";
import FilterBar from "./FilterBar";
import Ikon from "./Ikon";
import PlaceCard from "./PlaceCard";
import SearchBar from "./SearchBar";
import TrailCard from "./TrailCard";

const pilihan = places.filter((p) => p.featured);
const legendaris = places.filter((p) => p.labels.includes("legendaris"));
const hits = places.filter((p) => p.labels.includes("hits"));

/** Buka daftar atau peta dengan filter tertentu, mulai dari filter kosong. */
function usePergi() {
  const { set, reset } = useFilters();
  const router = useRouter();
  return (patch: Partial<FilterState>, path = "/makan/daftar") => {
    reset();
    set(patch);
    router.push(path);
  };
}

function Baris({ judul, items, onSeeAll }: { judul: string; items: PlaceWithGeo[]; onSeeAll: () => void }) {
  const { t } = useI18n();
  if (items.length === 0) return null;
  return (
    <section className="mk-bagian">
      <div className="mk-bagian-kepala">
        <h2>{judul}</h2>
        <button type="button" className="mk-tautan" onClick={onSeeAll}>
          {t("see_all")}
        </button>
      </div>
      <div className="bch-grid">
        {items.slice(0, 6).map((p) => (
          <PlaceCard key={p.id} place={p} />
        ))}
      </div>
    </section>
  );
}

export function BerandaMakan() {
  const { t, lang } = useI18n();
  const { state, results } = useFilters();
  const pergi = usePergi();
  const mencari = state.query.trim().length > 0;

  return (
    <div className="bch-page">
      <header className="bch-loket-head">
        <span className="bch-loket-no" aria-hidden="true">
          02
        </span>
        <p className="bch-kicker m-0">{t("loket")}</p>
        <h1>{t("home_title")}</h1>
        <p className="bch-lede m-0">{t("home_lede", { n: places.length })}</p>
      </header>
      <SearchBar />

      {mencari ? (
        <section className="mk-bagian">
          <div className="mk-bagian-kepala">
            <p className="bch-data m-0" role="status">
              {results.length} {t("results")}
            </p>
            <Link href="/makan/daftar">{t("see_all")}</Link>
          </div>
          {results.length === 0 ? (
            <p className="mk-kosong">{t("no_results")}</p>
          ) : (
            <div className="bch-grid">
              {results.slice(0, 9).map((p) => (
                <PlaceCard key={p.id} place={p} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          <div className="mk-chips mk-bagian-kecil">
            <button type="button" className="mk-chip" onClick={() => pergi({ halal: ["halal"] })}>
              Halal
            </button>
            {["seafood-gonggong", "sup-ikan", "mie-tarempa", "kopitiam", "oleh-oleh"].map((id) => (
              <button key={id} type="button" className="mk-chip" onClick={() => pergi({ cats: [id] })}>
                <Ikon nama={id} ukuran={18} />
                {catName(
                  lang,
                  categories.find((c) => c.id === id),
                )}
              </button>
            ))}
          </div>

          <section className="mk-bagian">
            <div className="mk-bagian-kepala">
              <h2>{t("near_ferry")}</h2>
            </div>
            <p className="mk-catatan">{t("near_ferry_note", { km: RADIUS_FERI_KM })}</p>
            <div className="bch-grid">
              {ferries.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className="bch-card mk-kartu-tombol"
                  onClick={() => pergi({ ferry: f.id, sort: "ferry" }, "/makan/peta")}
                >
                  <span className="bch-kicker mk-kicker-ikon">
                    <Ikon nama="feri" ukuran={18} />
                    {t("map_ferry_loc")}
                  </span>
                  <span className="mk-kartu-judul">{f.label}</span>
                  <span className="bch-card-loc">{f.nama}</span>
                </button>
              ))}
            </div>
          </section>

          <Baris judul={t("featured")} items={pilihan} onSeeAll={() => pergi({ sort: "featured" })} />
          <Baris judul={t("legendary")} items={legendaris} onSeeAll={() => pergi({ labels: ["legendaris"] })} />
          <Baris judul={t("hits")} items={hits} onSeeAll={() => pergi({ labels: ["hits"] })} />

          <section className="mk-bagian">
            <div className="mk-bagian-kepala">
              <h2>{t("trails")}</h2>
              <Link href="/makan/jalur">{t("see_all")}</Link>
            </div>
            <div className="bch-grid">
              {trails.map((tr) => (
                <TrailCard key={tr.id} trail={tr} />
              ))}
            </div>
          </section>

          <section className="mk-bagian">
            <div className="mk-bagian-kepala">
              <h2>{t("browse_cat")}</h2>
              <Link href="/makan/kategori">{t("see_all")}</Link>
            </div>
            <div className="mk-chips">
              {categories.slice(0, 8).map((c) => (
                <button key={c.id} type="button" className="mk-chip" onClick={() => pergi({ cats: [c.id] })}>
                  <Ikon nama={c.id} ukuran={18} />
                  {catName(lang, c)}
                </button>
              ))}
            </div>
          </section>

          <p className="bch-note mk-bagian">
            {t("about_note", { n: places.length })} <Link href="/makan/tentang">{t("nav_about")}</Link>
          </p>
        </>
      )}
    </div>
  );
}

export function DaftarMakan() {
  const { results, state, set } = useFilters();
  const { t } = useI18n();

  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">{t("loket")}</p>
      <h1 className="mt-2">{t("all_places")}</h1>
      <SearchBar />
      <FilterBar />

      <div className="mk-hasil-baris">
        <span className="bch-data" role="status">
          {results.length} {t("results")}
        </span>
        <label className="mk-urut">
          <span>{t("sort")}</span>
          <select className="bch-select" value={state.sort} onChange={(e) => set({ sort: e.target.value as SortKey })}>
            <option value="featured">{t("sort_featured")}</option>
            {state.userLoc && <option value="nearby">{t("sort_nearby")}</option>}
            <option value="ferry">{t("sort_nearest_ferry")}</option>
            <option value="az">{t("sort_az")}</option>
          </select>
        </label>
        <Link href="/makan/peta" className="mk-kicker-ikon">
          <Ikon nama="peta" ukuran={18} />
          {t("view_map")}
        </Link>
      </div>

      {results.length === 0 ? (
        <p className="mk-kosong">{t("no_results")}</p>
      ) : (
        <div className="bch-grid">
          {results.map((p) => (
            <PlaceCard key={p.id} place={p} Judul="h2" />
          ))}
        </div>
      )}
    </div>
  );
}

export function KategoriMakan() {
  const { reset, set } = useFilters();
  const { t, lang } = useI18n();

  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">{t("loket")}</p>
      <h1 className="mt-2">{t("browse_cat")}</h1>
      <p className="bch-lede">{t("browse_cat_sub", { n: categories.length })}</p>
      <div className="bch-grid mk-bagian-kecil">
        {categories.map((c) => (
          <Link
            key={c.id}
            href="/makan/daftar"
            className="bch-card"
            onClick={() => {
              reset();
              set({ cats: [c.id] });
            }}
          >
            <span className="mk-kategori-ikon">
              <Ikon nama={c.id} ukuran={32} />
            </span>
            <h2>{catName(lang, c)}</h2>
            <p className="bch-card-meta m-0">
              {categoryCounts[c.id] ?? 0} {t("results")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function JalurMakan() {
  const { t } = useI18n();
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">{t("loket")}</p>
      <h1 className="mt-2">{t("trails")}</h1>
      <p className="bch-lede">{t("trails_sub")}</p>
      <div className="bch-grid mk-bagian-kecil">
        {trails.map((tr) => (
          <TrailCard key={tr.id} trail={tr} Judul="h2" />
        ))}
      </div>
    </div>
  );
}

function BlokTentang({ judul, children }: { judul: string; children: ReactNode }) {
  return (
    <section>
      <h2>{judul}</h2>
      {children}
    </section>
  );
}

const LABEL_ARTI: [RecLabel, "about_l_wajib" | "about_l_legend" | "about_l_hits" | "about_l_gem"][] = [
  ["wajib-coba", "about_l_wajib"],
  ["legendaris", "about_l_legend"],
  ["hits", "about_l_hits"],
  ["hidden-gem", "about_l_gem"],
];

export function TentangMakan() {
  const { t } = useI18n();
  const perkiraan = places.filter((p) => p.coord_approx).length;

  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">{t("loket")}</p>
      <h1 className="mt-2">{t("about_title")}</h1>
      <p className="bch-lede">{t("about_lede", { n: places.length })}</p>

      <div className="bch-prose">
        <BlokTentang judul={t("about_promise_t")}>
          <p>{t("about_promise")}</p>
        </BlokTentang>

        <BlokTentang judul={t("about_labels_t")}>
          <dl className="bch-daftar">
            {LABEL_ARTI.map(([l, teks]) => (
              <div key={l} className="mk-daftar-baris">
                <dt>
                  <LabelBadge label={l} />
                </dt>
                <dd>{t(teks)}</dd>
              </div>
            ))}
          </dl>
        </BlokTentang>

        <BlokTentang judul={t("about_halal_t")}>
          <div className="bch-badges">
            <HalalBadge status="halal" />
            <HalalBadge status="muslim-friendly" />
            <HalalBadge status="non-halal" />
          </div>
          <p className="bch-note" data-tone="caution">
            {t("about_halal")}
          </p>
        </BlokTentang>

        <BlokTentang judul={t("about_coord_t")}>
          <p>{t("about_coord", { a: perkiraan, n: places.length })}</p>
        </BlokTentang>

        <BlokTentang judul={t("about_rating_t")}>
          <p>{t("about_rating")}</p>
        </BlokTentang>

        <BlokTentang judul={t("about_ferry_t")}>
          <p>{t("about_ferry")}</p>
          <ul>
            {ferries.map((f) => (
              <li key={f.id}>
                {f.nama}
                {f.status_koordinat !== "terverifikasi" && <span className="mk-catatan"> ({t("coord_unsure")})</span>}
              </li>
            ))}
          </ul>
        </BlokTentang>

        <BlokTentang judul={t("about_qris_t")}>
          <p>{t("about_qris")}</p>
        </BlokTentang>

        <BlokTentang judul={t("about_tips_t")}>
          <ul>
            <li>{t("about_tip1")}</li>
            <li>{t("about_tip2")}</li>
            <li>{t("about_tip3")}</li>
          </ul>
        </BlokTentang>

        <p className="mk-catatan">{t("about_source")}</p>
      </div>
    </div>
  );
}
