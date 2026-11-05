"use client";

import { useFilters } from "../lib/filters";
import { useI18n } from "../lib/i18n";
import Ikon from "./Ikon";

/** Pesan hasil kosong: menyebut kata yang dicari kalau ada (pedoman 3.1). */
export function PesanKosong() {
  const { state } = useFilters();
  const { t } = useI18n();
  const kata = state.query.trim();
  return <p className="mk-kosong">{kata ? t("no_results_q", { kata }) : t("no_results")}</p>;
}

export default function SearchBar() {
  const { state, set } = useFilters();
  const { t } = useI18n();
  return (
    <div className="mk-cari" role="search">
      <Ikon nama="cari" />
      <input
        type="search"
        value={state.query}
        onChange={(e) => set({ query: e.target.value })}
        placeholder={t("search_ph")}
        aria-label={t("search_label")}
        className="bch-input"
      />
      {state.query && (
        <button
          type="button"
          onClick={() => set({ query: "" })}
          aria-label={t("search_clear")}
          className="mk-cari-hapus"
        >
          <Ikon nama="tutup" ukuran={18} />
        </button>
      )}
    </div>
  );
}
