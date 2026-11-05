"use client";

import { useRef, useState, type ReactNode } from "react";
import { categories, areas, ferries } from "../lib/data";
import { useFilters } from "../lib/filters";
import { useI18n, catName, HALAL_LABEL, LABEL_LABEL, PRICE_HINT } from "../lib/i18n";
import { RADIUS_FERI_KM } from "../lib/saring";
import type { HalalStatus, PriceTier, RecLabel } from "../lib/types";
import Ikon from "./Ikon";

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className="mk-chip">
      {children}
    </button>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="mk-filter-grup">
      <legend className="bch-kicker">{title}</legend>
      <div className="mk-chips">{children}</div>
    </fieldset>
  );
}

const HALAL_OPTS: HalalStatus[] = ["halal", "muslim-friendly", "non-halal"];
const TIER_OPTS: PriceTier[] = ["$", "$$", "$$$"];
const LABEL_OPTS: RecLabel[] = ["legendaris", "wajib-coba", "hits", "hidden-gem"];

export default function FilterBar() {
  const { state, set, toggle, reset, activeCount, results } = useFilters();
  const { t, lang } = useI18n();
  const lembar = useRef<HTMLDialogElement>(null);
  const [locating, setLocating] = useState(false);
  const [pesanLokasi, setPesanLokasi] = useState("");

  const requestLoc = () => {
    setPesanLokasi("");
    if (state.userLoc) {
      set({ userLoc: null, sort: "featured" });
      return;
    }
    if (!navigator.geolocation) {
      setPesanLokasi(t("loc_denied"));
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        set({ userLoc: { lat: pos.coords.latitude, lng: pos.coords.longitude }, sort: "nearby" });
        setLocating(false);
      },
      () => {
        setPesanLokasi(t("loc_denied"));
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <>
      <div className="mk-filter-baris">
        <button type="button" className="bch-btn mk-filter-buka" onClick={() => lembar.current?.showModal()}>
          <Ikon nama="saring" />
          {t("filters")}
          {activeCount > 0 && <span className="mk-filter-n">{activeCount}</span>}
        </button>
        <Chip active={state.halal.includes("halal")} onClick={() => toggle("halal", "halal")}>
          {HALAL_LABEL.halal[lang]}
        </Chip>
        <Chip active={state.openNow} onClick={() => set({ openNow: !state.openNow })}>
          {t("open_now")}
        </Chip>
        <Chip active={!!state.userLoc} onClick={requestLoc}>
          <Ikon nama="lokasi" ukuran={18} />
          {locating ? t("locating") : t("near_me")}
        </Chip>
        <span className="mk-pemisah" aria-hidden="true" />
        {categories.map((c) => (
          <Chip key={c.id} active={state.cats.includes(c.id)} onClick={() => toggle("cats", c.id)}>
            <Ikon nama={c.id} ukuran={18} />
            {catName(lang, c)}
          </Chip>
        ))}
      </div>
      {pesanLokasi && (
        <p className="mk-pesan" role="status">
          {pesanLokasi}
        </p>
      )}

      {/* Dialog asli: fokus terkunci di dalam dan Esc menutup tanpa kode tambahan. */}
      <dialog ref={lembar} className="mk-lembar" aria-labelledby="mk-lembar-judul">
        <div className="mk-lembar-kepala">
          <h2 id="mk-lembar-judul">{t("filters_title")}</h2>
          <button
            type="button"
            className="bch-icon-btn"
            aria-label={t("filter_close")}
            onClick={() => lembar.current?.close()}
          >
            <Ikon nama="tutup" />
          </button>
        </div>
        <div className="mk-lembar-isi">
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
                <Ikon nama={c.id} ukuran={18} />
                {catName(lang, c)}
              </Chip>
            ))}
          </Section>
          <Section title={t("price")}>
            {TIER_OPTS.map((p) => (
              <Chip key={p} active={state.tiers.includes(p)} onClick={() => toggle("tiers", p)}>
                {PRICE_HINT[p][lang]}
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
                <Ikon nama="feri" ukuran={18} />
                {f.label}
              </Chip>
            ))}
            <p className="mk-catatan">{t("near_ferry_note", { km: RADIUS_FERI_KM })}</p>
          </Section>
          <Section title={t("labels")}>
            {LABEL_OPTS.map((l) => (
              <Chip key={l} active={state.labels.includes(l)} onClick={() => toggle("labels", l)}>
                {LABEL_LABEL[l][lang]}
              </Chip>
            ))}
          </Section>
        </div>
        <div className="mk-lembar-kaki">
          <button type="button" className="bch-btn" data-variant="ghost" onClick={reset}>
            {t("reset")}
          </button>
          <button type="button" className="bch-btn mk-lebar" onClick={() => lembar.current?.close()}>
            {t("apply")} · {results.length} {t("results")}
          </button>
        </div>
      </dialog>
    </>
  );
}
