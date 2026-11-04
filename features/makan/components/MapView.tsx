"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { areaMap } from "../lib/data";
import { useFilters } from "../lib/filters";
import { useI18n } from "../lib/i18n";
import { HalalBadge } from "./Badges";
import FilterBar from "./FilterBar";
import Ikon from "./Ikon";
import MiniCard from "./MiniCard";
import SearchBar from "./SearchBar";

const MapCanvas = dynamic(() => import("./MapCanvas"), { ssr: false });

// Daftar di samping peta: alternatif keyboard untuk pin. Memilih baris menggerakkan peta dan membuka
// kartu yang sama seperti mengetuk pin.
function DaftarPeta() {
  const { results, selectedId, setSelectedId } = useFilters();
  const { t, lang } = useI18n();
  const wadah = useRef<HTMLUListElement>(null);

  // Pin yang diketuk di peta ikut terlihat di daftar.
  useEffect(() => {
    if (!selectedId) return;
    wadah.current?.querySelector(`[data-id="${CSS.escape(selectedId)}"]`)?.scrollIntoView({ block: "nearest" });
  }, [selectedId]);

  if (results.length === 0) return <p className="mk-kosong">{t("no_results")}</p>;
  return (
    <ul ref={wadah} className="mk-peta-daftar" aria-label={t("map_list")} tabIndex={0}>
      {results.map((p) => (
        <li key={p.id} data-id={p.id}>
          <button
            type="button"
            className="mk-peta-baris"
            aria-pressed={selectedId === p.id}
            onClick={() => setSelectedId(p.id)}
          >
            <Ikon nama={p.category} />
            <span className="mk-peta-nama">
              <span>{p.name}</span>
              <span className="bch-card-loc">{areaMap[p.area]?.name}</span>
            </span>
            <span className="mk-sr">{t("show_on_map")}</span>
          </button>
          <HalalBadge status={p.halal} />
          <Link href={`/makan/tempat/${p.id}`} lang={lang}>
            {t("detail")}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function MapView() {
  const { results } = useFilters();
  const { t } = useI18n();

  return (
    <div className="mk-peta-halaman" data-jumlah-pin={results.length}>
      <aside className="mk-peta-sisi">
        <h1 className="mk-sr">{t("nav_map")}</h1>
        <SearchBar />
        <FilterBar />
        <div className="mk-hasil-baris">
          <span className="bch-data" role="status">
            {results.length} {t("results")}
          </span>
          <Link href="/makan/daftar" className="mk-kicker-ikon">
            <Ikon nama="daftar" ukuran={18} />
            {t("view_list")}
          </Link>
        </div>
        <div className="mk-peta-daftar-desktop">
          <DaftarPeta />
        </div>
      </aside>
      <div className="mk-peta-utama">
        <MapCanvas />
        <MiniCard />
        <div className="mk-legenda">
          <p>
            <span className="mk-legenda-pin" aria-hidden="true" />
            {t("map_legend")}
          </p>
          <p>{t("map_legend_ferry")}</p>
        </div>
      </div>
    </div>
  );
}
