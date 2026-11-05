"use client";

import Link from "next/link";
import { categoryMap, areaMap, haversineKm } from "../lib/data";
import { useFilters } from "../lib/filters";
import { formatHarga, formatKm } from "../lib/format";
import { HALAL_LABEL, LABEL_LABEL, useI18n, catName } from "../lib/i18n";
import type { PlaceWithGeo } from "../lib/types";
import { OpenStatus } from "./Badges";
import FavButton from "./FavButton";

// Baris tempat (PEDOMAN 4.5): nama, metadata, dan satu status di kanan. Status halal dan label kurasi jadi bagian
// metadata supaya satu tempat tidak memikul label bertumpuk.
export default function PlaceCard({ place, Judul = "h3" }: { place: PlaceWithGeo; Judul?: "h2" | "h3" }) {
  const { t, lang } = useI18n();
  const { state } = useFilters();
  const cat = categoryMap[place.category];
  const area = areaMap[place.area]?.name ?? "";
  const dist = state.userLoc ? haversineKm(state.userLoc.lat, state.userLoc.lng, place.lat, place.lng) : null;
  const label = place.labels[0];
  const meta = [
    catName(lang, cat),
    area,
    dist !== null ? t("from_you", { km: formatKm(dist, lang) }) : "",
    HALAL_LABEL[place.halal][lang],
    place.price_idr ? formatHarga(place.price_idr, lang) : "",
  ].filter(Boolean);

  return (
    <article className="bch-baris mk-kartu">
      <Judul className="nama">
        <Link href={`/makan/tempat/${place.id}`} className="mk-kartu-tautan">
          {place.name}
        </Link>
      </Judul>
      <div className="mk-baris-kanan">
        <OpenStatus hours={place.hours} />
        <FavButton id={place.id} nama={place.name} />
      </div>
      <p className="meta">
        {meta.join(" · ")}
        {label && (
          <>
            {" · "}
            <em className="mk-label">{LABEL_LABEL[label][lang]}</em>
          </>
        )}
      </p>
    </article>
  );
}
