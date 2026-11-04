"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useI18n } from "../lib/i18n";
import { getTrail, trailStops, trailTitle, trailSubtitle, trailDuration } from "../lib/trails";
import Ikon from "./Ikon";
import PlaceCard from "./PlaceCard";

const TrailMap = dynamic(() => import("./TrailMap"), { ssr: false });

export default function TrailDetail({ slug }: { slug: string }) {
  const { t, lang } = useI18n();
  const trail = getTrail(slug);
  if (!trail) return null;
  const stops = trailStops(trail);

  return (
    <div className="bch-page">
      <p className="m-0">
        <Link href="/makan/jalur" className="mk-kicker-ikon">
          <Ikon nama="kiri" ukuran={18} />
          {t("back_trails")}
        </Link>
      </p>
      <p className="bch-kicker mt-4 mb-0">{trail.area}</p>
      <h1 className="mt-2">{trailTitle(lang, trail)}</h1>
      <p className="bch-lede">{trailSubtitle(lang, trail)}</p>
      <p className="bch-data">
        {stops.length} {t("stops")} · {t("duration")}: {trailDuration(lang, trail)}
      </p>

      <div className="mk-peta-bingkai">
        <TrailMap stops={stops} />
      </div>
      <p className="mk-catatan">{t("trail_line_note")}</p>

      <h2 className="mt-8">{t("stops_list")}</h2>
      <ol className="mk-perhentian">
        {stops.map((p, i) => (
          <li key={p.id}>
            <span className="mk-perhentian-no bch-data" aria-hidden="true">
              {i + 1}
            </span>
            <PlaceCard place={p} />
          </li>
        ))}
      </ol>
    </div>
  );
}
