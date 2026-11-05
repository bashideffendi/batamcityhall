"use client";

import Link from "next/link";
import { areaMap, categoryMap, ferryMap, placeMap } from "../lib/data";
import { useFilters } from "../lib/filters";
import { formatKmDesimal, hargaRingkas } from "../lib/format";
import { catName, HALAL_LABEL, useI18n } from "../lib/i18n";
import { StatusBuka } from "./Badges";
import FavButton from "./FavButton";
import Ikon from "./Ikon";

// Kartu kecil di atas peta saat satu tempat dipilih.
export default function MiniCard() {
  const { selectedId, setSelectedId } = useFilters();
  const { t, lang } = useI18n();
  if (!selectedId) return null;
  const p = placeMap[selectedId];
  if (!p) return null;
  const feri = ferryMap[p.nearestFerryId];
  const harga = hargaRingkas(p.price_idr, lang);

  return (
    <div className="mk-kartu-mini">
      <div className="mk-kartu-mini-atas">
        <p className="bch-kicker m-0">
          {catName(lang, categoryMap[p.category])} · {areaMap[p.area]?.name}
        </p>
        <button type="button" className="mk-fav" aria-label={t("close")} onClick={() => setSelectedId(null)}>
          <Ikon nama="tutup" />
        </button>
      </div>
      <h2>
        <Link href={`/makan/tempat/${p.id}`}>{p.name}</Link>
      </h2>
      <p className="mk-baris-meta">{HALAL_LABEL[p.halal][lang]}</p>
      <p className="mk-baris-data">
        <StatusBuka hours={p.hours} />
        {harga && <span>{harga}</span>}
        {feri && <span>{t("ferry_short", { km: formatKmDesimal(p.nearestFerryKm, lang), nama: feri.label })}</span>}
      </p>
      <div className="mk-aksi">
        <Link href={`/makan/tempat/${p.id}`} className="bch-btn">
          {t("detail")}
        </Link>
        <a href={p.gmaps} target="_blank" rel="noopener noreferrer" className="bch-btn" data-variant="ghost">
          {t("navigate")}
        </a>
        <FavButton id={p.id} nama={p.name} />
      </div>
    </div>
  );
}
