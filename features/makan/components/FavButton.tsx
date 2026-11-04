"use client";

import { useFavorites } from "../lib/favorites";
import { useI18n } from "../lib/i18n";
import Ikon from "./Ikon";

export default function FavButton({ id, nama }: { id: string; nama: string }) {
  const { has, toggle } = useFavorites();
  const { t } = useI18n();
  const active = has(id);
  return (
    <button
      type="button"
      onClick={() => toggle(id)}
      aria-label={`${active ? t("unsave") : t("save")}: ${nama}`}
      aria-pressed={active}
      className="mk-fav"
      data-aktif={active || undefined}
    >
      <Ikon nama="hati" />
    </button>
  );
}
