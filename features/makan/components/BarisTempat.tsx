"use client";

import Image from "next/image";
import Link from "next/link";
import { areaMap, categoryMap, ferryMap, haversineKm } from "../lib/data";
import { useCurrency } from "../lib/currency";
import { useFiltersOpsional } from "../lib/filters";
import { formatKmDesimal, hargaRingkas } from "../lib/format";
import { useFotoTempat } from "@/features/konten/useFotoTempat";
import { grafisHidangan } from "../lib/hidangan";
import { catName, HALAL_LABEL, LABEL_LABEL, useI18n } from "../lib/i18n";
import type { PlaceWithGeo } from "../lib/types";
import { StatusBuka } from "./Badges";
import FavButton from "./FavButton";
import Ikon from "./Ikon";

type Props = {
  place: PlaceWithGeo;
  Judul?: "h2" | "h3";
  /** Nomor urut di panduan. */
  nomor?: number;
  /** Tanpa menu andalan dan tanpa gambar, untuk daftar pendek di beranda. */
  ringkas?: boolean;
  /** Tombol "tampilkan di peta", hanya bila ada peta di samping daftar. */
  adaPeta?: boolean;
};

// Baris tempat. Atribut sama di setiap baris, dan yang tidak ada datanya dilewati tanpa lubang.
export default function BarisTempat({ place, Judul = "h3", nomor, ringkas = false, adaPeta = false }: Props) {
  const { t, lang } = useI18n();
  const { fmt } = useCurrency();
  const saringan = useFiltersOpsional();
  const lokasi = saringan?.state.userLoc;
  const area = areaMap[place.area]?.name ?? "";
  const feri = ferryMap[place.nearestFerryId];
  const jarakSaya = lokasi ? haversineKm(lokasi.lat, lokasi.lng, place.lat, place.lng) : null;
  const label = place.labels[0];
  const harga = hargaRingkas(place.price_idr, lang);
  const perkiraan = fmt(place.price_idr, lang);
  const foto = useFotoTempat(place.id)[0];
  const terpilih = saringan?.selectedId === place.id;

  return (
    <article className="mk-baris" data-ringkas={ringkas || undefined} data-nomor={nomor !== undefined || undefined} data-terpilih={terpilih || undefined}>
      {nomor !== undefined && (
        <span className="mk-baris-no" aria-hidden="true">
          {String(nomor).padStart(2, "0")}
        </span>
      )}
      {!ringkas && (
        <span className="mk-baris-gambar" aria-hidden="true">
          <Image
            src={foto?.src ?? grafisHidangan(place.category)}
            alt=""
            width={176}
            height={176}
            loading="lazy"
            unoptimized
            data-foto={foto ? "" : undefined}
          />
        </span>
      )}
      <div className="mk-baris-isi">
        <Judul className="mk-baris-nama">
          <Link href={`/makan/tempat/${place.id}`}>{place.name}</Link>
        </Judul>
        <p className="mk-baris-meta">
          {/* Di baris bergambar, ilustrasi dan menu andalan sudah menyebut hidangannya. */}
          {[ringkas ? catName(lang, categoryMap[place.category]) : "", area, HALAL_LABEL[place.halal][lang]]
            .filter(Boolean)
            .join(" · ")}
          {label && (
            <>
              {" · "}
              <em className="mk-label">{LABEL_LABEL[label][lang]}</em>
            </>
          )}
        </p>
        {!ringkas && place.signature && <p className="mk-baris-menu">{place.signature}</p>}
        <p className="mk-baris-data">
          <StatusBuka hours={place.hours} />
          {harga && (
            <span>
              {harga}
              {perkiraan && <span className="mk-baris-kurs"> {perkiraan}</span>}
            </span>
          )}
          {jarakSaya !== null ? (
            <span>{t("from_you", { km: formatKmDesimal(jarakSaya, lang) })}</span>
          ) : (
            feri && <span>{t("ferry_short", { km: formatKmDesimal(place.nearestFerryKm, lang), nama: feri.label })}</span>
          )}
        </p>
      </div>
      <div className="mk-baris-aksi">
        <FavButton id={place.id} nama={place.name} />
        {adaPeta && saringan && (
          <button
            type="button"
            className="mk-fav"
            aria-label={`${t("show_on_map")}: ${place.name}`}
            aria-pressed={terpilih}
            onClick={() => saringan.setSelectedId(place.id)}
          >
            <Ikon nama="lokasi" />
          </button>
        )}
      </div>
    </article>
  );
}
