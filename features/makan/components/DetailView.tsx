"use client";

import { kaidahJudul } from "@/lib/judul";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { areaMap, categoryMap, ferryMap, getPlace, tempatTerdekat } from "../lib/data";
import { useCurrency } from "../lib/currency";
import { alamatBersih, formatBulan, formatJam, formatKmDesimal, hargaRingkas, jamSgt } from "../lib/format";
import { slugHidangan } from "../lib/hidangan";
import { catName, miring, namaTerminal, placeDesc, useI18n } from "../lib/i18n";
import { panduanUntuk } from "../lib/panduan";
import { HalalBadge, LabelBadge, StatusBuka } from "./Badges";
import BarisTempat from "./BarisTempat";
import FavButton from "./FavButton";
import GaleriTempat from "./GaleriTempat";

const MiniMap = dynamic(() => import("./MiniMap"), { ssr: false });

export default function DetailView({ slug, cuaca, feri }: { slug: string; cuaca?: ReactNode; feri?: ReactNode }) {
  const { t, lang } = useI18n();
  const { fmt } = useCurrency();
  const [pesan, setPesan] = useState("");
  const p = getPlace(slug);
  if (!p) return null;

  const kategori = catName(lang, categoryMap[p.category]);
  const area = areaMap[p.area]?.name ?? "";
  const terminal = ferryMap[p.nearestFerryId];
  const desc = placeDesc(lang, p);
  const harga = hargaRingkas(p.price_idr, lang);
  const perkiraan = fmt(p.price_idr, lang);
  const sgt = jamSgt(p.hours);
  const menu = p.signature.split(/,\s*/).filter(Boolean).map((m) => kaidahJudul(m));
  const namaBayar: Record<string, string> = { cash: t("pay_cash"), qris: "QRIS", card: t("pay_card") };
  const terdekat = tempatTerdekat(p, 3);
  const diPanduan = panduanUntuk(p.id);
  const label = p.labels[0];

  const bagikan = async () => {
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
    <div className="bch-page mk-detail">
      <header className="mk-detail-kepala">
        <nav className="bch-remah" aria-label={t("breadcrumb")}>
          <Link href="/makan">{t("nav_home")}</Link>
          {" / "}
          <Link href={`/makan/hidangan/${slugHidangan(p.category)}`}>{kategori}</Link>
          {" / "}
          <span aria-current="page">{p.name}</span>
        </nav>
        <p className="bch-kicker mk-penanda">
          {kategori} · {area}
        </p>
        <h1>{p.name}</h1>
        <div className="mk-detail-lencana">
          <HalalBadge status={p.halal} />
          {label && <LabelBadge label={label} />}
          <StatusBuka hours={p.hours} sgt />
        </div>
      </header>

      <div className="mk-detail-galeri">
        <GaleriTempat id={p.id} nama={p.name} kategori={p.category} />
      </div>

      <div className="mk-detail-utama">
        {desc && <p className="mk-detail-dek">{miring(desc)}</p>}

        <div className="mk-aksi">
          <a href={p.gmaps} target="_blank" rel="noopener noreferrer" className="bch-btn">
            {t("navigate")}
          </a>
          <FavButton id={p.id} nama={p.name} denganTeks />
          <button type="button" className="bch-btn" data-variant="ghost" onClick={bagikan}>
            {t("share")}
          </button>
          {pesan && (
            <span className="mk-pesan" role="status">
              {pesan}
            </span>
          )}
        </div>

        {menu.length > 0 && (
          <section className="mk-detail-menu">
            <h2>{t("signature")}</h2>
            <ul className="mk-menu">
              {menu.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </section>
        )}

        {feri && <div className="mk-detail-feri">{feri}</div>}
        {cuaca && <div className="mk-detail-cuaca">{cuaca}</div>}
      </div>

      <aside className="mk-detail-samping">
        <dl className="mk-fakta" aria-label={t("facts")}>
          <div>
            <dt>{t("hours")}</dt>
            <dd>
              {p.hours ? formatJam(p.hours, lang) : t("hours_unknown")}
              {sgt && <span className="mk-fakta-dua">{sgt}</span>}
            </dd>
          </div>
          {harga && (
            <div>
              <dt>{t("price_range")}</dt>
              <dd>
                {harga}
                {perkiraan && <span className="mk-fakta-dua">{perkiraan}</span>}
              </dd>
            </div>
          )}
          <div>
            <dt>{t("halal_label")}</dt>
            <dd>
              <HalalBadge status={p.halal} />{" "}
              <Link href="/makan/cara-memilih#status-halal" className="mk-fakta-tautan">
                {t("what_means")}
              </Link>
            </dd>
          </div>
          <div>
            <dt>{t("payment")}</dt>
            <dd>{p.payments.map((b) => namaBayar[b] ?? b).join(" · ")}</dd>
          </div>
          {terminal && (
            <div>
              <dt>{t("ferry_nearest")}</dt>
              <dd>
                {t("ferry_distance", {
                  km: formatKmDesimal(p.nearestFerryKm, lang),
                  nama: namaTerminal(lang, terminal.label),
                })}
              </dd>
            </div>
          )}
          <div>
            <dt>{t("address")}</dt>
            <dd>{alamatBersih(p.address) || area}</dd>
          </div>
          {p.phone && (
            <div>
              <dt>{t("call")}</dt>
              <dd>
                <a href={`tel:${p.phone.replace(/\s/g, "")}`}>{p.phone}</a>
              </dd>
            </div>
          )}
          {p.instagram && (
            <div>
              <dt>Instagram</dt>
              <dd>
                <a href={p.instagram} target="_blank" rel="noopener noreferrer">
                  {p.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, "@").replace(/\/$/, "")}
                </a>
              </dd>
            </div>
          )}
        </dl>

        <div className="mk-detail-peta">
          <div className="mk-peta-bingkai">
            <MiniMap place={p} />
          </div>
          {p.coord_approx && <p className="mk-catatan">{t("approx_loc")}</p>}
        </div>

        <p className="mk-catatan mk-detail-catatan">
          {p.last_verified && <>{t("data_as_of", { bulan: formatBulan(p.last_verified, lang) })} · </>}
          <Link href={`/koreksi?tempat=${p.id}`} prefetch={false}>
            {t("fix")}
          </Link>
        </p>
      </aside>

      <div className="mk-detail-bawah">
        <section>
          <h2>{t("near_here")}</h2>
          <ul className="mk-daftar">
            {terdekat.map((x) => (
              <li key={x.id}>
                <BarisTempat place={x} ringkas />
              </li>
            ))}
          </ul>
        </section>
        {diPanduan.length > 0 && (
          <section>
            <h2>{t("in_guides")}</h2>
            <ul className="mk-tautan-daftar">
              {diPanduan.map((g) => (
                <li key={g.id}>
                  <Link href={`/makan/panduan/${g.id}`}>
                    <span>{g.judul(lang)}</span>
                    <span className="mk-panah" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
