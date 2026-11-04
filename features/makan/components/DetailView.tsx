"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { categoryMap, areaMap, ferryMap, getPlace } from "../lib/data";
import { useCurrency } from "../lib/currency";
import { formatKm } from "../lib/format";
import { useI18n, catName, placeDesc } from "../lib/i18n";
import { HalalBadge, LabelBadge, OpenStatus, PerkiraanBadge, PriceTag } from "./Badges";
import FavButton from "./FavButton";
import Ikon from "./Ikon";

const MiniMap = dynamic(() => import("./MiniMap"), { ssr: false });

export default function DetailView({ slug }: { slug: string }) {
  const { t, lang } = useI18n();
  const { fmt, currency } = useCurrency();
  const [pesan, setPesan] = useState("");
  const p = getPlace(slug);
  if (!p) return null;

  const cat = categoryMap[p.category];
  const area = areaMap[p.area]?.name ?? "";
  const ferry = ferryMap[p.nearestFerryId];
  const desc = placeDesc(lang, p);
  const harga = currency !== "IDR" ? fmt(p.price_idr) : "";
  const namaBayar: Record<string, string> = { cash: t("pay_cash"), qris: "QRIS", card: t("pay_card") };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: p.name, url });
      else {
        await navigator.clipboard.writeText(url);
        setPesan(t("share_copied"));
      }
    } catch {
      // Dibatalkan pengguna.
    }
  };

  return (
    <div className="bch-page">
      <p className="m-0">
        <Link href="/makan/daftar" className="mk-kicker-ikon">
          <Ikon nama="kiri" ukuran={18} />
          {t("back_list")}
        </Link>
      </p>
      <p className="bch-kicker mk-kicker-ikon mt-4 mb-0">
        <Ikon nama={p.category} ukuran={18} />
        {catName(lang, cat)} · {area}
      </p>
      <h1 className="mt-2">{p.name}</h1>
      <div className="bch-badges mk-detail-lencana">
        <HalalBadge status={p.halal} />
        <OpenStatus hours={p.hours} />
        {p.verified && <span className="bch-badge">{t("info_verified")}</span>}
        {p.labels.map((l) => (
          <LabelBadge key={l} label={l} />
        ))}
      </div>
      {desc && <p className="bch-lede">{desc}</p>}

      <div className="mk-aksi">
        <a href={p.gmaps} target="_blank" rel="noopener noreferrer" className="bch-btn">
          <Ikon nama="navigasi" />
          {t("navigate")}
        </a>
        <button type="button" className="bch-btn" data-variant="ghost" onClick={share}>
          <Ikon nama="bagikan" />
          {t("share")}
        </button>
        {p.phone && (
          <a href={`tel:${p.phone.replace(/\s/g, "")}`} className="bch-btn" data-variant="ghost">
            <Ikon nama="telepon" />
            {t("call")}
          </a>
        )}
        {p.instagram && (
          <a href={p.instagram} target="_blank" rel="noopener noreferrer" className="bch-btn" data-variant="ghost">
            <Ikon nama="tautan" />
            Instagram
          </a>
        )}
        <FavButton id={p.id} nama={p.name} />
      </div>
      {pesan && (
        <p className="mk-pesan" role="status">
          {pesan}
        </p>
      )}

      <div className="mk-detail">
        <dl className="bch-daftar">
          {p.signature && (
            <>
              <dt>{t("signature")}</dt>
              <dd>{p.signature}</dd>
            </>
          )}
          <dt>{t("hours")}</dt>
          <dd>
            <span className="bch-data">{p.hours || t("hours_unknown")}</span>
            {p.hours && <span className="mk-catatan mk-blok">{t("hours_tz")}</span>}
          </dd>
          <dt>{t("price")}</dt>
          <dd>
            <span className="bch-data">
              <PriceTag tier={p.price_tier} />
              {" · "}
              {p.price_idr || t("price_unknown")}
              {harga && <span className="mk-kurs"> · {harga}</span>}
            </span>
            {harga && <span className="mk-catatan mk-blok">{t("price_note")}</span>}
          </dd>
          <dt>{t("payment")}</dt>
          <dd>{p.payments.map((b) => namaBayar[b] ?? b).join(", ")}</dd>
          <dt>{t("address")}</dt>
          <dd>{p.address || area}</dd>
          {ferry && (
            <>
              <dt>{t("ferry")}</dt>
              <dd>
                {t("about_prefix")} <span className="bch-data">{formatKm(p.nearestFerryKm, lang)}</span>{" "}
                {t("from_ferry")} {ferry.nama}
              </dd>
            </>
          )}
        </dl>

        <div>
          <div className="mk-peta-bingkai">
            <MiniMap place={p} />
          </div>
          {p.coord_approx && (
            <p className="mk-catatan">
              <PerkiraanBadge /> {t("approx_loc")}
            </p>
          )}
        </div>
      </div>

      <p className="mk-catatan">
        {t("checked")} <span className="bch-data">{p.last_verified}</span>. {t("recheck")}
      </p>
    </div>
  );
}
