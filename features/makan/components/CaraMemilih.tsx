"use client";

import type { ReactNode } from "react";
import { CURRENCY_RATES, TANGGAL_KURS } from "../lib/format";
import { LABEL_LABEL, useI18n, type KunciTeks } from "../lib/i18n";
import type { RecLabel } from "../lib/types";
import Remah from "./Remah";

// Halaman teks Cara Kami Memilih. Sengaja di berkas sendiri dan tanpa impor daftar tempat: sampai 16 Nov 2026 ia
// berada di HalamanMakan.tsx, sehingga pembaca halaman ini ikut mengunduh seluruh data tempat makan.
const LABEL_ARTI: [RecLabel, KunciTeks][] = [
  ["legendaris", "about_l_legend"],
  ["wajib-coba", "about_l_kurator"],
  ["hits", "about_l_populer"],
  ["hidden-gem", "about_l_jarang"],
];

function Blok({ id, judul, children }: { id?: string; judul: string; children: ReactNode }) {
  return (
    <section id={id}>
      <h2>{judul}</h2>
      {children}
    </section>
  );
}

export default function CaraMemilih() {
  const { t, lang } = useI18n();
  const tanggal = new Intl.DateTimeFormat(lang === "id" ? "id-ID" : lang === "zh" ? "zh-CN" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${TANGGAL_KURS}T00:00:00Z`));
  const sgd = `Rp${CURRENCY_RATES.SGD.toLocaleString("id-ID")}`;

  return (
    <div className="bch-page mk-cara">
      <Remah isi={[{ teks: t("nav_home"), href: "/makan" }, { teks: t("how") }]} />
      <h1 className="mk-judul">{t("about_title")}</h1>
      <div className="mk-cara-isi">
        <Blok judul={t("about_pay_t")}>
          <p>{t("about_pay")}</p>
        </Blok>
        <Blok judul={t("about_labels_t")}>
          <dl className="mk-arti">
            {LABEL_ARTI.map(([l, teks]) => (
              <div key={l}>
                <dt>
                  <em className="mk-label">{LABEL_LABEL[l][lang]}</em>
                </dt>
                <dd>{t(teks)}</dd>
              </div>
            ))}
          </dl>
        </Blok>
        <Blok id="status-halal" judul={t("about_halal_t")}>
          <p>{t("about_halal")}</p>
        </Blok>
        <Blok judul={t("about_coord_t")}>
          <p>{t("about_coord")}</p>
        </Blok>
        <Blok judul={t("about_rating_t")}>
          <p>{t("about_rating")}</p>
        </Blok>
        <Blok judul={t("about_rate_t")}>
          <p>{t("about_rate", { tanggal, sgd })}</p>
        </Blok>
        <Blok judul={t("about_qris_t")}>
          <p>{t("about_qris")}</p>
        </Blok>
        <Blok judul={t("about_tips_t")}>
          <ul>
            <li>{t("about_tip1")}</li>
            <li>{t("about_tip2")}</li>
            <li>{t("about_tip3")}</li>
          </ul>
        </Blok>
      </div>
    </div>
  );
}
