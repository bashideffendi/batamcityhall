"use client";

import Link from "next/link";
import { categoryMap, areaMap, haversineKm } from "../lib/data";
import { useFilters } from "../lib/filters";
import { formatKm } from "../lib/format";
import { useI18n, catName } from "../lib/i18n";
import type { PlaceWithGeo } from "../lib/types";
import { HalalBadge, LabelBadge, OpenStatus, PriceTag } from "./Badges";
import FavButton from "./FavButton";
import Ikon from "./Ikon";

// Kartu label museum. Judul memakai tautan yang membentang satu kartu; tombol simpan berdiri di atasnya,
// bukan di dalam tautan.
export default function PlaceCard({ place, Judul = "h3" }: { place: PlaceWithGeo; Judul?: "h2" | "h3" }) {
  const { t, lang } = useI18n();
  const { state } = useFilters();
  const cat = categoryMap[place.category];
  const area = areaMap[place.area]?.name ?? "";
  const dist = state.userLoc ? haversineKm(state.userLoc.lat, state.userLoc.lng, place.lat, place.lng) : null;

  return (
    <article className="bch-card mk-kartu">
      <div className="bch-kicker-row">
        <span className="bch-kicker mk-kicker-ikon">
          <Ikon nama={place.category} ukuran={18} />
          {catName(lang, cat)}
        </span>
        <FavButton id={place.id} nama={place.name} />
      </div>
      <Judul>
        <Link href={`/makan/tempat/${place.id}`} className="mk-kartu-tautan">
          {place.name}
        </Link>
      </Judul>
      <p className="bch-card-loc">
        {area}
        {dist !== null && (
          <>
            {" · "}
            {t("about_prefix")} {formatKm(dist, lang)} {t("from_you")}
          </>
        )}
      </p>
      <hr className="bch-card-rule" />
      <div className="bch-badges">
        <HalalBadge status={place.halal} />
        <OpenStatus hours={place.hours} />
        {place.labels.map((l) => (
          <LabelBadge key={l} label={l} />
        ))}
      </div>
      <p className="bch-card-meta mk-kartu-harga">
        <PriceTag tier={place.price_tier} />
      </p>
    </article>
  );
}
