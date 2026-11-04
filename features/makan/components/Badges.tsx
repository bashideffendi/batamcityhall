"use client";

import { useI18n, HALAL_LABEL, LABEL_LABEL, PRICE_HINT } from "../lib/i18n";
import { isOpenNow } from "../lib/format";
import type { HalalStatus, PriceTier, RecLabel } from "../lib/types";
import { useSekarang } from "../lib/waktu";

// Status selalu berupa kata, warna hanya penguat (data/design/boleh_jangan.md).
const NADA_HALAL: Record<HalalStatus, string | undefined> = {
  halal: "ok",
  "muslim-friendly": "caution",
  "non-halal": undefined,
};

export function HalalBadge({ status }: { status: HalalStatus }) {
  const { lang } = useI18n();
  return (
    <span className="bch-badge" data-tone={NADA_HALAL[status]}>
      {HALAL_LABEL[status][lang]}
    </span>
  );
}

/** Label kurasi: gaya label museum, bukan lencana warna-warni. */
export function LabelBadge({ label }: { label: RecLabel }) {
  const { lang } = useI18n();
  return <span className="mk-label">{LABEL_LABEL[label][lang]}</span>;
}

export function PriceTag({ tier }: { tier: PriceTier }) {
  const { lang } = useI18n();
  return (
    <span>
      {tier} · {PRICE_HINT[tier][lang]}
    </span>
  );
}

/** Buka atau tutup. Tidak tampil di HTML statis dan tidak tampil kalau jamnya tidak diketahui. */
export function OpenStatus({ hours }: { hours: string }) {
  const { t } = useI18n();
  const sekarang = useSekarang();
  if (sekarang === null) return null;
  const open = isOpenNow(hours, new Date(sekarang));
  if (open === null) return null;
  return (
    <span className="bch-badge" data-tone={open ? "ok" : undefined}>
      {open ? t("open_now") : t("closed_now")}
    </span>
  );
}

/** Penanda perkiraan area. Tampil selama coord_approx true. */
export function PerkiraanBadge() {
  const { t } = useI18n();
  return (
    <span className="bch-badge mk-perkiraan" data-tone="caution">
      {t("approx_badge")}
    </span>
  );
}
