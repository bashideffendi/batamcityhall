"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { categoryMap, areaMap, ferryMap, getPlace } from "../lib/data";
import { useCurrency } from "../lib/currency";
import { useFilters } from "../lib/filters";
import { formatBulan, formatHarga, formatJam, formatKmDesimal } from "../lib/format";
import { useI18n, catName, miring, namaTerminal, placeDesc } from "../lib/i18n";
import { HalalBadge, KalimatJam, LabelBadge } from "./Badges";
import FavButton from "./FavButton";

const MiniMap = dynamic(() => import("./MiniMap"), { ssr: false });

export default function DetailView({ slug, cuaca, feri }: { slug: string; cuaca?: ReactNode; feri?: ReactNode }) {
  const { t, lang } = useI18n();
  const { fmt, currency } = useCurrency();
  const { reset, set } = useFilters();
  const [pesan, setPesan] = useState("");
  const p = getPlace(slug);
  if (!p) return null;

  const cat = categoryMap[p.category];
  const area = areaMap[p.area]?.name ?? "";
  const ferry = ferryMap[p.nearestFerryId];
  const desc = placeDesc(lang, p);
  const harga = currency !== "IDR" ? fmt(p.price_idr, lang) : "";
  // Penanda kecil bahasa Indonesia ditulis kapital semua (pedoman 2.3), bahasa Inggris tidak (2.10).
  const penanda = `${catName(lang, cat)} · ${area}`;
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

  // Label: status halal dan satu label kurasi (PEDOMAN 3.4).
  const label = p.labels[0];

  return (
    <div className="bch-page bch-detail-tata">
      <div className="bch-detail-kepala">
        <nav className="bch-remah" aria-label={t("breadcrumb")}>
          <Link href="/makan">{t("crumb_root")}</Link>
          {" / "}
          <Link
            href="/makan/daftar"
            onClick={() => {
              reset();
              set({ cats: [p.category] });
            }}
          >
            {catName(lang, cat)}
          </Link>
          {" / "}
          <span aria-current="page">{p.name}</span>
        </nav>
        <p className="bch-kicker mk-penanda mt-4 mb-0">{lang === "id" ? penanda.toLocaleUpperCase("id") : penanda}</p>
        <h1 className="mt-2">{p.name}</h1>
        <div className="bch-badges mk-detail-lencana">
          <HalalBadge status={p.halal} />
          {label && <LabelBadge label={label} />}
        </div>
        {desc && <p className="mk-detail-lede">{miring(desc)}</p>}

        <div className="mk-aksi">
          <a href={p.gmaps} target="_blank" rel="noopener noreferrer" className="bch-btn">
            {t("navigate")}
          </a>
          <button type="button" className="bch-btn" data-variant="ghost" onClick={share}>
            {t("share")}
          </button>
          <FavButton id={p.id} nama={p.name} denganTeks />
          {p.phone && (
            <a href={`tel:${p.phone.replace(/\s/g, "")}`} className="bch-btn" data-variant="ghost">
              {t("call")}
            </a>
          )}
          {p.instagram && (
            <a href={p.instagram} target="_blank" rel="noopener noreferrer" className="bch-btn" data-variant="ghost">
              Instagram
            </a>
          )}
        </div>
        {pesan && (
          <p className="mk-pesan" role="status">
            {pesan}
          </p>
        )}
      </div>

      <aside className="bch-detail-samping">
        <Image
          className="bch-grafis mk-detail-ilustrasi"
          src={p.category === "seafood-gonggong" ? "/grafis/ilustrasi-kepiting.webp" : "/grafis/loket-makan.webp"}
          alt=""
          width={560}
          height={560}
          priority
          unoptimized
        />
        <div className="mk-peta-bingkai">
          <MiniMap place={p} />
        </div>
        {p.coord_approx && (
          <p className="mk-catatan">
            {t("approx_loc")}{" "}
            <a href={p.gmaps} target="_blank" rel="noopener noreferrer">
              {t("navigate")}
            </a>{" "}
            {t("approx_loc_end")}
          </p>
        )}
      </aside>

      <div className="bch-detail-isi">
        <dl className="bch-tabel-info">
          {p.signature && (
            <div>
              <dt>{t("signature")}</dt>
              <dd>{p.signature}</dd>
            </div>
          )}
          <div>
            <dt>{t("hours")}</dt>
            <dd>
              {p.hours ? formatJam(p.hours, lang) : t("hours_unknown")}
              <KalimatJam hours={p.hours} />
            </dd>
          </div>
          {p.price_idr && (
            <div>
              <dt>{t("price_range")}</dt>
              <dd>
                {formatHarga(p.price_idr, lang)}
                {harga && <span className="mk-kurs"> · {harga}</span>}
                {harga && <span className="mk-catatan mk-blok">{t("price_note")}</span>}
              </dd>
            </div>
          )}
          <div>
            <dt>{t("payment")}</dt>
            <dd>{p.payments.map((b) => namaBayar[b] ?? b).join(", ")}</dd>
          </div>
          <div>
            <dt>{t("address")}</dt>
            <dd>{p.address || area}</dd>
          </div>
          {ferry && (
            <div>
              <dt>{t("ferry_nearest")}</dt>
              <dd>
                {t("ferry_distance", {
                  km: formatKmDesimal(p.nearestFerryKm, lang),
                  nama: namaTerminal(lang, ferry.nama),
                })}
              </dd>
            </div>
          )}
        </dl>

        {feri && <div className="mt-6">{feri}</div>}
        {cuaca}

        <p className="mk-catatan mt-5">
          <Link href={`/koreksi?tempat=${p.id}`} prefetch={false}>
            {t("report")}
          </Link>
          {p.last_verified && <> · {t("checked", { bulan: formatBulan(p.last_verified, lang) })}</>}
        </p>
      </div>
    </div>
  );
}
