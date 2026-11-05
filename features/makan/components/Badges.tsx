"use client";

import { useI18n, HALAL_LABEL, LABEL_LABEL } from "../lib/i18n";
import { keSgt, statusJam } from "../lib/format";
import type { HalalStatus, RecLabel } from "../lib/types";
import { useSekarang } from "../lib/waktu";

// Status selalu berupa kata, warna hanya penguat.
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

/** Label kurasi: huruf miring, bukan lencana berwarna. */
export function LabelBadge({ label }: { label: RecLabel }) {
  const { lang } = useI18n();
  return <span className="mk-label">{LABEL_LABEL[label][lang]}</span>;
}

/**
 * Status buka atau tutup. Tidak tampil di HTML statis (jam build bukan jam pembaca) dan tidak tampil kalau
 * jamnya tidak diketahui. `sgt` menambahkan waktu Singapura.
 */
export function StatusBuka({ hours, sgt = false }: { hours: string; sgt?: boolean }) {
  const { t } = useI18n();
  const sekarang = useSekarang();
  if (sekarang === null) return null;
  const s = statusJam(hours, new Date(sekarang));
  if (!s) return null;
  const teks = s.jam
    ? sgt
      ? t(s.buka ? "open_until_sgt" : "closed_until_sgt", { jam: s.jam, sgt: keSgt(s.jam) })
      : t(s.buka ? "open_until" : "closed_until", { jam: s.jam })
    : t(s.buka ? "open_now" : "closed_now");
  return (
    <span className="mk-status" data-buka={s.buka || undefined}>
      {teks}
    </span>
  );
}
