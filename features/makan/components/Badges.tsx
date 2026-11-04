"use client";

import { useI18n, HALAL_LABEL, LABEL_LABEL } from "@/features/makan/lib/i18n";
import type { HalalStatus, RecLabel } from "@/features/makan/lib/types";

const HALAL_STYLE: Record<HalalStatus, string> = {
  halal: "bg-halal/12 text-halal",
  "non-halal": "bg-nonhalal/12 text-nonhalal",
  "muslim-friendly": "bg-muslim/12 text-muslim",
};
const HALAL_DOT: Record<HalalStatus, string> = {
  halal: "bg-halal",
  "non-halal": "bg-nonhalal",
  "muslim-friendly": "bg-muslim",
};

export function HalalBadge({
  status,
  size = "sm",
}: {
  status: HalalStatus;
  size?: "sm" | "md";
}) {
  const { lang } = useI18n();
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-bold ${HALAL_STYLE[status]} ${
        size === "md" ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-[10px]"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${HALAL_DOT[status]}`} />
      {HALAL_LABEL[status][lang]}
    </span>
  );
}

const LABEL_STYLE: Record<RecLabel, string> = {
  legendaris: "bg-amber/15 text-[#a9710a]",
  hits: "bg-brick/12 text-brick-dark",
  "wajib-coba": "bg-teal/12 text-teal-dark",
  "hidden-gem": "bg-ink/8 text-ink",
};

export function LabelBadge({ label }: { label: RecLabel }) {
  const { lang } = useI18n();
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${LABEL_STYLE[label]}`}
    >
      {LABEL_LABEL[label][lang]}
    </span>
  );
}

export function PriceTag({ tier }: { tier: string }) {
  return (
    <span className="text-xs font-bold text-muted">
      <span className="text-ink">{tier}</span>
      <span className="opacity-30">{"$$$".slice(tier.length)}</span>
    </span>
  );
}
