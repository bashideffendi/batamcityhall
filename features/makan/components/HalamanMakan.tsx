"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { categories, categoryCounts, ferries, places } from "../lib/data";
import { useFilters, type FilterState, type SortKey } from "../lib/filters";
import { useI18n, catName, miring, namaTerminal } from "../lib/i18n";
import { RADIUS_FERI_KM } from "../lib/saring";
import { trails } from "../lib/trails";
import type { PlaceWithGeo, RecLabel } from "../lib/types";
import { HalalBadge, LabelBadge } from "./Badges";
import FilterBar from "./FilterBar";
import Ikon from "./Ikon";
import PlaceCard from "./PlaceCard";
import SearchBar, { PesanKosong } from "./SearchBar";
import TrailCard from "./TrailCard";

const pilihan = places.filter((p) => p.featured);

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

function DaftarTempat({ items, Judul }: { items: PlaceWithGeo[]; Judul?: "h2" | "h3" }) {
  return (
    <ul className="bch-daftar-baris" data-kolom="2">
      {items.map((p) => (
        <li key={p.id}>
          <PlaceCard place={p} Judul={Judul} />
        </li>
      ))}
    </ul>
  );
}

export function BerandaMakan() {
  const { t, lang } = useI18n();
  const { state, results } = useFilters();
  const pergi = usePergi();
  const mencari = state.query.trim().length > 0;

  return (
    <div className="bch-page">
      <div className="bch-pembuka">
        <div>
          <p className="bch-kicker bch-penanda-biru m-0">{t("loket")}</p>
          <span className="bch-nomor-besar" aria-hidden="true">
            02
          </span>
          <h1>{t("home_title")}</h1>
          <p className="bch-lede">{miring(t("home_lede", { n: places.length }))}</p>
          <SearchBar />
          <div className="mk-chips mk-bagian-kecil">
            <button type="button" className="mk-chip" onClick={() => pergi({ halal: ["halal"] })}>
              Halal
            </button>
            {["seafood-gonggong", "sup-ikan", "mie-tarempa", "kopitiam", "oleh-oleh"].map((id) => (
              <button key={id} type="button" className="mk-chip" onClick={() => pergi({ cats: [id] })}>
                {catName(
                  lang,
                  categories.find((c) => c.id === id),
                )}
              </button>
            ))}
          </div>
        </div>
        <Image className="bch-grafis" src="/grafis/loket-makan.webp" alt="" width={720} height={720} priority unoptimized />
      </div>

      {mencari ? (
        <section className="bch-seksi">
          <div className="mk-bagian-kepala">
            <p className="bch-data m-0" role="status">
              {results.length} {t("results")}
            </p>
            <Link href="/makan/daftar">{t("see_all")}</Link>
          </div>
          {results.length === 0 ? <PesanKosong /> : <DaftarTempat items={results.slice(0, 10)} />}
        </section>
      ) : (
        <>
          <section className="bch-seksi">
            <div className="bch-kepala-bagian">
              <h2>{t("near_ferry")}</h2>
              <p>{t("near_ferry_note", { km: RADIUS_FERI_KM })}</p>
            </div>
            <ul className="bch-daftar-baris bch-daftar-tanpa-atas" data-kolom="2">
              {ferries.map((f) => (
                <li key={f.id}>
                  <button
                    type="button"
                    className="bch-baris mk-baris-tombol"
                    onClick={() => pergi({ ferry: f.id, sort: "ferry" }, "/makan/peta")}
                  >
                    <span className="nama">{f.label}</span>
                    <span className="mk-panah" aria-hidden="true">
                      →
                    </span>
                    <span className="meta">{namaTerminal(lang, f.nama)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="bch-seksi">
            <div className="mk-bagian-kepala bch-kepala-garis">
              <h2>{t("featured")}</h2>
              <button type="button" className="mk-tautan" onClick={() => pergi({ sort: "featured" })}>
                {t("see_all")}
              </button>
            </div>
            <DaftarTempat items={pilihan.slice(0, 10)} />
          </section>
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
      <h1 className="mt-2">{t("all_places_title")}</h1>
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
        <Link href="/makan/peta">{t("view_map")}</Link>
      </div>

      {results.length === 0 ? <PesanKosong /> : <DaftarTempat items={results} Judul="h2" />}
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
      <ul className="bch-daftar-baris mk-bagian-kecil" data-kolom="2">
        {trails.map((tr) => (
          <li key={tr.id}>
            <TrailCard trail={tr} Judul="h2" />
          </li>
        ))}
      </ul>
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

const LABEL_ARTI: [RecLabel, "about_l_legend" | "about_l_kurator" | "about_l_populer" | "about_l_jarang"][] = [
  ["legendaris", "about_l_legend"],
  ["wajib-coba", "about_l_kurator"],
  ["hits", "about_l_populer"],
  ["hidden-gem", "about_l_jarang"],
];

export function TentangMakan() {
  const { t } = useI18n();

  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">{t("loket")}</p>
      <h1 className="mt-2">{t("about_title")}</h1>

      <div className="bch-prose">
        <BlokTentang judul={t("about_choose_t")}>
          <p>{t("about_choose")}</p>
        </BlokTentang>

        <BlokTentang judul={t("about_labels_t")}>
          <dl className="bch-daftar">
            {LABEL_ARTI.map(([l, teks]) => (
              <div key={l} className="mk-daftar-baris">
                <dt>
                  <LabelBadge label={l} />:
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
          <p>{t("about_coord")}</p>
        </BlokTentang>

        <BlokTentang judul={t("about_rating_t")}>
          <p>{t("about_rating")}</p>
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
      </div>
    </div>
  );
}
