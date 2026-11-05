"use client";

import { useI18n, HALAL_LABEL, LABEL_LABEL } from "../lib/i18n";
import { isOpenNow, statusJam } from "../lib/format";
import type { HalalStatus, RecLabel } from "../lib/types";
import { useSekarang } from "../lib/waktu";

// Status selalu berupa kata, warna hanya penguat (data/design/boleh_jangan.md).
const NADA_HALAL: Record<HalalStatus, string | undefined> = {
  halal: "ok",
  "muslim-friendly": "ok",
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

/** Kalimat jam buka di tabel detail (pedoman 3.11). Sama seperti OpenStatus, hanya tampil di browser. */
export function KalimatJam({ hours }: { hours: string }) {
  const { t } = useI18n();
  const sekarang = useSekarang();
  if (sekarang === null) return null;
  const s = statusJam(hours, new Date(sekarang));
  if (!s) return null;
  const teks = s.jam
    ? t(s.buka ? "open_until" : "closed_until", { jam: s.jam })
    : t(s.buka ? "open_now" : "closed_now");
  return <span className="mk-catatan mk-blok">{teks}</span>;
}
