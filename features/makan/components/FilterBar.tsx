"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { areas, categories, ferries } from "../lib/data";
import { useFilters, type FilterState } from "../lib/filters";
import { catName, HALAL_LABEL, LABEL_LABEL, PRICE_HINT, useI18n } from "../lib/i18n";
import type { Bayar, Waktu } from "../lib/saring";
import type { HalalStatus, PriceTier, RecLabel } from "../lib/types";
import Ikon from "./Ikon";

/** Tombol Saring di bilah bawah ponsel membuka lembar yang sama. */
export const ACARA_BUKA_SARING = "mk-buka-saring";

function Chip({
  active,
  onClick,
  jumlah,
  children,
}: {
  active: boolean;
  onClick: () => void;
  /** Hasil bila saringan ini dipakai. Nol berarti tidak ada yang bisa ditampilkan. */
  jumlah?: number | null;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="mk-chip"
      disabled={!active && jumlah === 0}
    >
      {children}
      {jumlah !== undefined && jumlah !== null && <span className="mk-chip-n">{jumlah}</span>}
    </button>
  );
}

function Grup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="mk-filter-grup">
      <legend>{title}</legend>
      <div className="mk-chips">{children}</div>
    </fieldset>
  );
}

const HALAL_OPTS: HalalStatus[] = ["halal", "muslim-friendly", "non-halal"];
const TIER_OPTS: PriceTier[] = ["$", "$$", "$$$"];
const LABEL_OPTS: RecLabel[] = ["legendaris", "wajib-coba", "hits", "hidden-gem"];

const tambah = <T,>(daftar: T[], v: T) => (daftar.includes(v) ? daftar : [...daftar, v]);

/**
 * Saringan cepat dan lembar lengkap. Angka di tombol adalah jumlah hasil bila saringan itu dipakai, jadi
 * pembaca tidak pernah mendarat di hasil kosong. `tanpa` menyembunyikan kelompok yang sudah jadi cakupan halaman.
 */
export default function FilterBar({ tanpa = [] }: { tanpa?: ("hidangan" | "kawasan" | "terminal")[] }) {
  const { state, set, toggle, reset, activeCount, results, hitung, sekarang } = useFilters();
  const { t, lang } = useI18n();
  const lembar = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const buka = () => lembar.current?.showModal();
    window.addEventListener(ACARA_BUKA_SARING, buka);
    return () => window.removeEventListener(ACARA_BUKA_SARING, buka);
  }, []);
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

  const nDaftar = <K extends "cats" | "areas" | "halal" | "tiers" | "labels" | "waktu" | "bayar">(
    key: K,
    v: FilterState[K][number],
  ) => hitung({ [key]: tambah(state[key] as string[], v as string) } as Partial<FilterState>);

  const waktu = (w: Waktu, teks: string) => (
    <Chip active={state.waktu.includes(w)} onClick={() => toggle("waktu", w)} jumlah={nDaftar("waktu", w)}>
      {teks}
    </Chip>
  );
  const bayar = (b: Bayar, teks: string) => (
    <Chip active={state.bayar.includes(b)} onClick={() => toggle("bayar", b)} jumlah={nDaftar("bayar", b)}>
      {teks}
    </Chip>
  );

  return (
    <>
      <div className="mk-filter-baris">
        <button type="button" className="mk-chip mk-chip-saring" onClick={() => lembar.current?.showModal()}>
          <Ikon nama="saring" ukuran={18} />
          {t("filters")}
          {activeCount > 0 && <span className="mk-chip-n">{activeCount}</span>}
        </button>
        <Chip
          active={state.openNow}
          onClick={() => set({ openNow: !state.openNow })}
          jumlah={sekarang === null ? null : hitung({ openNow: true })}
        >
          {t("open_now")}
        </Chip>
        <Chip active={state.halal.includes("halal")} onClick={() => toggle("halal", "halal")} jumlah={nDaftar("halal", "halal")}>
          {HALAL_LABEL.halal[lang]}
        </Chip>
        {waktu("sarapan", t("breakfast"))}
        {waktu("larut", t("late"))}
        <Chip active={state.murah} onClick={() => set({ murah: !state.murah })} jumlah={hitung({ murah: true })}>
          {t("cheap")}
        </Chip>
        <Chip active={!!state.userLoc} onClick={requestLoc}>
          <Ikon nama="lokasi" ukuran={18} />
          {locating ? t("locating") : t("near_me")}
        </Chip>
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
          <button type="button" className="mk-fav" aria-label={t("filter_close")} onClick={() => lembar.current?.close()}>
            <Ikon nama="tutup" />
          </button>
        </div>
        <div className="mk-lembar-isi">
          <Grup title={t("halal_label")}>
            {HALAL_OPTS.map((h) => (
              <Chip key={h} active={state.halal.includes(h)} onClick={() => toggle("halal", h)} jumlah={nDaftar("halal", h)}>
                {HALAL_LABEL[h][lang]}
              </Chip>
            ))}
          </Grup>
          <Grup title={t("time")}>
            {waktu("sarapan", t("breakfast"))}
            {waktu("larut", t("late"))}
          </Grup>
          <Grup title={t("price")}>
            <Chip active={state.murah} onClick={() => set({ murah: !state.murah })} jumlah={hitung({ murah: true })}>
              {t("cheap")}
            </Chip>
            {TIER_OPTS.map((p) => (
              <Chip key={p} active={state.tiers.includes(p)} onClick={() => toggle("tiers", p)} jumlah={nDaftar("tiers", p)}>
                {PRICE_HINT[p][lang]}
              </Chip>
            ))}
          </Grup>
          <Grup title={t("payment")}>
            {bayar("qris", "QRIS")}
            {bayar("card", t("pay_card"))}
          </Grup>
          {!tanpa.includes("hidangan") && (
            <Grup title={t("category")}>
              {categories.map((c) => (
                <Chip key={c.id} active={state.cats.includes(c.id)} onClick={() => toggle("cats", c.id)} jumlah={nDaftar("cats", c.id)}>
                  {catName(lang, c)}
                </Chip>
              ))}
            </Grup>
          )}
          {!tanpa.includes("kawasan") && (
            <Grup title={t("area")}>
              {areas.map((a) => (
                <Chip key={a.id} active={state.areas.includes(a.id)} onClick={() => toggle("areas", a.id)} jumlah={nDaftar("areas", a.id)}>
                  {a.name}
                </Chip>
              ))}
            </Grup>
          )}
          {!tanpa.includes("terminal") && (
            <Grup title={t("ferry")}>
              {ferries.map((f) => (
                <Chip
                  key={f.id}
                  active={state.ferry === f.id}
                  onClick={() => set({ ferry: state.ferry === f.id ? null : f.id })}
                  jumlah={hitung({ ferry: f.id })}
                >
                  {f.label}
                </Chip>
              ))}
            </Grup>
          )}
          <Grup title={t("labels")}>
            {LABEL_OPTS.map((l) => (
              <Chip key={l} active={state.labels.includes(l)} onClick={() => toggle("labels", l)} jumlah={nDaftar("labels", l)}>
                {LABEL_LABEL[l][lang]}
              </Chip>
            ))}
          </Grup>
        </div>
        <div className="mk-lembar-kaki">
          <button type="button" className="bch-btn" data-variant="ghost" onClick={reset}>
            {t("reset")}
          </button>
          <button type="button" className="bch-btn mk-lebar" onClick={() => lembar.current?.close()}>
            {t("apply", { n: results.length })}
          </button>
        </div>
      </dialog>
    </>
  );
}
