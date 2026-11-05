"use client";

import Link from "next/link";
import { useI18n } from "../lib/i18n";
import { trailArea, trailDuration, trailStops, trailTitle } from "../lib/trails";
import type { Trail } from "../lib/types";

// Baris jalur (PEDOMAN 3.4): {judul jalur} · {jumlah perhentian} perhentian · {durasi}
export default function TrailCard({ trail, Judul = "h3" }: { trail: Trail; Judul?: "h2" | "h3" }) {
  const { t, lang } = useI18n();
  const n = trailStops(trail).length;

  return (
    <article className="bch-baris mk-jalur" data-jalur={trail.id}>
      <Judul className="nama">
        <Link href={`/makan/jalur/${trail.id}`}>{trailTitle(lang, trail)}</Link>
      </Judul>
      <p className="meta">
        {trailArea(lang, trail)} · {n} {t("stops")} · {trailDuration(lang, trail)}
      </p>
    </article>
  );
}
