"use client";

import Link from "next/link";
import { useI18n } from "../lib/i18n";
import { trailStops, trailTitle, trailSubtitle, trailDuration } from "../lib/trails";
import type { Trail } from "../lib/types";
import Ikon from "./Ikon";

export default function TrailCard({ trail, Judul = "h3" }: { trail: Trail; Judul?: "h2" | "h3" }) {
  const { t, lang } = useI18n();
  const n = trailStops(trail).length;

  return (
    <Link href={`/makan/jalur/${trail.id}`} className="bch-card">
      <span className="bch-kicker mk-kicker-ikon">
        <Ikon nama="jalur" ukuran={18} />
        {trail.area}
      </span>
      <Judul>{trailTitle(lang, trail)}</Judul>
      <p className="bch-card-loc">{trailSubtitle(lang, trail)}</p>
      <hr className="bch-card-rule" />
      <p className="bch-card-meta m-0">
        {n} {t("stops")} · {trailDuration(lang, trail)}
      </p>
    </Link>
  );
}
