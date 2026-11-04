"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Thumb from "./Thumb";
import FavButton from "./FavButton";
import { HalalBadge, LabelBadge } from "./Badges";
import { useI18n, catName, placeDesc } from "@/features/makan/lib/i18n";
import { useCurrency } from "@/features/makan/lib/currency";
import { categoryMap, areaMap, ferryMap } from "@/features/makan/lib/data";
import { formatRating, formatReviews, isOpenNow } from "@/features/makan/lib/format";
import type { PlaceWithGeo } from "@/features/makan/lib/types";

const MiniMap = dynamic(() => import("./MiniMap"), {
  ssr: false,
  loading: () => <div className="h-40 w-full bg-sand" />,
});

const PAY_LABEL: Record<string, string> = {
  cash: "Cash",
  qris: "QRIS",
  card: "Card",
};

function InfoRow({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-sand text-muted">
        {icon}
      </span>
      <div className="min-w-0 flex-1 text-sm">{children}</div>
    </div>
  );
}

export default function DetailView({ place: p }: { place: PlaceWithGeo }) {
  const { t, lang } = useI18n();
  const { fmt, currency } = useCurrency();
  const router = useRouter();
  const cat = categoryMap[p.category];
  const area = areaMap[p.area]?.name ?? "";
  const ferry = ferryMap[p.nearestFerryId];
  const open = isOpenNow(p.hours);
  const desc = placeDesc(lang, p);

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) await navigator.share({ title: p.name, url });
      else {
        await navigator.clipboard.writeText(url);
        alert(lang === "id" ? "Tautan disalin!" : "Link copied!");
      }
    } catch {
      /* cancelled */
    }
  };

  return (
    <div className="no-scrollbar overflow-y-auto pb-28 md:mx-auto md:max-w-2xl md:pb-10">
      {/* Hero */}
      <div className="relative">
        <Thumb category={p.category} className="h-52 w-full" rounded="rounded-none" size="lg" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <button
            onClick={() => router.back()}
            aria-label="Back"
            className="grid h-9 w-9 place-items-center rounded-full bg-card/90 shadow backdrop-blur"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <div className="flex gap-2">
            <button
              onClick={share}
              aria-label="Share"
              className="grid h-9 w-9 place-items-center rounded-full bg-card/90 shadow backdrop-blur"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
              </svg>
            </button>
            <FavButton id={p.id} size={36} className="shadow" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="relative -mt-5 rounded-t-3xl bg-bg px-4 pt-4">
        <div className="flex items-center gap-1.5 text-xs font-bold text-muted">
          <span>{cat?.emoji}</span>
          <span>{catName(lang, cat)}</span>
          <span className="text-line">·</span>
          <span>📍 {area}</span>
        </div>
        <h1 className="mt-1 text-2xl font-extrabold leading-tight">{p.name}</h1>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <HalalBadge status={p.halal} size="md" />
          {p.labels.map((l) => (
            <LabelBadge key={l} label={l} />
          ))}
        </div>

        <div className="mt-3 flex items-center gap-4">
          {p.rating != null && (
            <div className="flex items-center gap-1.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#f2a310"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2Z" /></svg>
              <span className="font-extrabold">{formatRating(p.rating)}</span>
              {p.reviews != null && (
                <span className="text-xs text-muted">
                  {formatReviews(p.reviews)} {t("reviews")}
                </span>
              )}
            </div>
          )}
          <div className="flex items-center gap-1 text-sm">
            <span className="font-extrabold text-ink">{p.price_tier}</span>
            <span className="font-bold text-line">{"$$$".slice(p.price_tier.length)}</span>
          </div>
          {p.verified && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#0e7c7b"><path d="m9 16.2-3.5-3.5L4 14.2l5 5 11-11-1.5-1.5z" /></svg>
              {lang === "id" ? "Terverifikasi" : "Verified"}
            </span>
          )}
        </div>

        {desc && <p className="mt-3 text-sm leading-relaxed text-ink/90">{desc}</p>}

        {/* CTAs */}
        <div className="mt-4 flex gap-2.5">
          <a
            href={p.gmaps}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brick py-3 text-sm font-extrabold text-white shadow-[0_8px_22px_rgba(226,85,43,0.38)]"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 11l19-9-9 19-2-8-8-2Z" />
            </svg>
            {t("navigate")}
          </a>
        </div>

        {/* Signature */}
        {p.signature && (
          <div className="mt-5 rounded-2xl border border-line bg-card p-3.5">
            <div className="text-[11px] font-extrabold uppercase tracking-wide text-muted">
              ⭐ {t("signature")}
            </div>
            <p className="mt-1 text-sm font-semibold">{p.signature}</p>
          </div>
        )}

        {/* Info */}
        <div className="mt-4 divide-y divide-line rounded-2xl border border-line bg-card px-3.5">
          <InfoRow icon="🕒">
            {p.hours ? (
              <div className="flex items-center justify-between">
                <span>{p.hours}</span>
                {open !== null && (
                  <span className={`text-xs font-bold ${open ? "text-halal" : "text-nonhalal"}`}>
                    {open ? t("open_now") : t("closed_now")}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-muted">{t("hours_unknown")}</span>
            )}
          </InfoRow>
          <InfoRow icon="📍">
            <div>{p.address || area}</div>
          </InfoRow>
          <InfoRow icon="⛴">
            <div>
              <span className="font-semibold">{p.nearestFerryKm} km</span> {t("from_ferry")}{" "}
              {ferry?.name}
            </div>
          </InfoRow>
          <InfoRow icon="💰">
            <div className="flex items-center justify-between gap-2">
              <span>{p.price_idr || "—"}</span>
              {currency !== "IDR" && fmt(p.price_idr) && (
                <span className="text-xs font-bold text-muted">{fmt(p.price_idr)}</span>
              )}
            </div>
          </InfoRow>
          <InfoRow icon="💳">
            <div className="flex flex-wrap gap-1.5">
              {(p.payments.length ? p.payments : ["cash"]).map((pm) => (
                <span key={pm} className="rounded-md bg-sand px-2 py-0.5 text-xs font-bold">
                  {PAY_LABEL[pm] ?? pm}
                </span>
              ))}
            </div>
          </InfoRow>
        </div>

        {/* Map */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-line">
          <MiniMap lat={p.lat} lng={p.lng} color={cat?.color ?? "#e2552b"} emoji={cat?.emoji ?? "🍽️"} />
        </div>
        {p.coord_approx && (
          <p className="mt-1.5 px-1 text-[11px] text-muted">ℹ️ {t("approx_loc")}</p>
        )}

        {/* Contact */}
        {(p.phone || p.instagram) && (
          <div className="mt-4 flex gap-2.5">
            {p.phone && (
              <a
                href={`tel:${p.phone.replace(/\s/g, "")}`}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-line bg-card py-2.5 text-sm font-bold"
              >
                📞 {lang === "id" ? "Telepon" : "Call"}
              </a>
            )}
            {p.instagram && (
              <a
                href={p.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-line bg-card py-2.5 text-sm font-bold"
              >
                📸 Instagram
              </a>
            )}
          </div>
        )}

        <p className="mt-5 text-center text-[10px] text-muted">
          {lang === "id" ? "Data diverifikasi" : "Verified"} {p.last_verified} ·{" "}
          {lang === "id" ? "Cek ulang sebelum berangkat" : "Re-check before you go"}
        </p>
      </div>
    </div>
  );
}
