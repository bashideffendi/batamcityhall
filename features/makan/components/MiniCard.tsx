"use client";

import Link from "next/link";
import { placeMap, categoryMap, ferryMap } from "../lib/data";
import { useFilters } from "../lib/filters";
import { formatKmDesimal } from "../lib/format";
import { useI18n, catName } from "../lib/i18n";
import { HalalBadge } from "./Badges";
import FavButton from "./FavButton";
import Ikon from "./Ikon";

export default function MiniCard() {
  const { selectedId, setSelectedId } = useFilters();
  const { t, lang } = useI18n();
  if (!selectedId) return null;
  const p = placeMap[selectedId];
  if (!p) return null;
  const ferry = ferryMap[p.nearestFerryId];

  return (
    <div className="bch-card mk-kartu-mini">
      <div className="bch-kicker-row">
        <span className="bch-kicker mk-kicker-ikon">
          <Ikon nama={p.category} ukuran={18} />
          {catName(lang, categoryMap[p.category])}
        </span>
        <button type="button" className="bch-icon-btn" aria-label={t("close")} onClick={() => setSelectedId(null)}>
          <Ikon nama="tutup" />
        </button>
      </div>
      <h2>{p.name}</h2>
      <div className="bch-badges">
        <HalalBadge status={p.halal} />
      </div>
      {ferry && (
        <p className="bch-card-meta">
          {t("ferry_distance", { km: formatKmDesimal(p.nearestFerryKm, lang), nama: ferry.label })}
        </p>
      )}
      <div className="mk-aksi">
        <Link href={`/makan/tempat/${p.id}`} className="bch-btn">
          {t("detail")}
        </Link>
        <a href={p.gmaps} target="_blank" rel="noopener noreferrer" className="bch-btn" data-variant="ghost">
          <Ikon nama="navigasi" />
          {t("navigate")}
        </a>
        <FavButton id={p.id} nama={p.name} />
      </div>
    </div>
  );
}
