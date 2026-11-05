"use client";

import { useFavorites } from "../lib/favorites";
import { useI18n } from "../lib/i18n";
import Ikon from "./Ikon";

// `denganTeks`: tombol [Simpan] di detail tempat (pedoman 3.4). Di kartu cukup ikon.
export default function FavButton({ id, nama, denganTeks = false }: { id: string; nama: string; denganTeks?: boolean }) {
  const { has, toggle } = useFavorites();
  const { t } = useI18n();
  const active = has(id);
  return (
    <button
      type="button"
      onClick={() => toggle(id)}
      aria-label={`${active ? t("unsave") : t("save")}: ${nama}`}
      aria-pressed={active}
      className={denganTeks ? "bch-btn" : "mk-fav"}
      data-variant={denganTeks ? "ghost" : undefined}
      data-aktif={active || undefined}
    >
      <Ikon nama="hati" />
      {denganTeks && (active ? t("unsave") : t("save"))}
    </button>
  );
}
