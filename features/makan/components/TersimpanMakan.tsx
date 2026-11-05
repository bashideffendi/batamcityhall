"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { getPlace, placeMap } from "../lib/data";
import { useFavorites } from "../lib/favorites";
import { useI18n } from "../lib/i18n";
import { bacaDaftarSlug, buatTautan, PARAM_TAUTAN, saringSlug } from "../lib/tautan-simpan";
import BarisTempat from "./BarisTempat";

const dikenal = (slug: string) => getPlace(slug) !== undefined;

// Tautan ?simpan=a,b,c: tidak langsung menimpa daftar, pengguna memilih menambahkannya.
function TawaranTautan() {
  const params = useSearchParams();
  const { t } = useI18n();
  const { tambah, ids } = useFavorites();
  const [pesan, setPesan] = useState("");
  const mentah = params.get(PARAM_TAUTAN);
  if (!mentah) return null;
  const { valid, ditolak } = saringSlug(bacaDaftarSlug(mentah), dikenal);
  const baru = valid.filter((s) => !ids.includes(s));
  if (valid.length === 0 && !pesan) return <p className="bch-note">{t("import_none")}</p>;

  return (
    <div className="bch-note mk-tawaran">
      <p className="m-0">
        {t("link_found", { n: valid.length })} {ditolak.length > 0 && t("import_rejected", { n: ditolak.length })}
      </p>
      {baru.length > 0 && (
        <button
          type="button"
          className="bch-btn"
          onClick={() => {
            tambah(baru);
            setPesan(t("import_done", { n: baru.length }));
          }}
        >
          {t("link_add")}
        </button>
      )}
      {pesan && (
        <p className="m-0" role="status">
          {pesan}
        </p>
      )}
    </div>
  );
}

function EksporImpor() {
  const { t } = useI18n();
  const { ids, tambah } = useFavorites();
  const [teks, setTeks] = useState("");
  const [pesanImpor, setPesanImpor] = useState("");
  const [pesanSalin, setPesanSalin] = useState("");
  const tautan = buatTautan(window.location.origin, ids);

  const salin = async () => {
    try {
      await navigator.clipboard.writeText(tautan);
      setPesanSalin(t("share_copied"));
    } catch {
      // Clipboard ditolak: tautan tetap bisa disalin manual dari kolom.
      setPesanSalin("");
    }
  };

  const impor = () => {
    const { valid, ditolak } = saringSlug(bacaDaftarSlug(teks), dikenal);
    if (valid.length === 0) {
      setPesanImpor(t("import_none"));
      return;
    }
    tambah(valid);
    setTeks("");
    setPesanImpor(
      [t("import_done", { n: valid.length }), ditolak.length > 0 ? t("import_rejected", { n: ditolak.length }) : ""]
        .filter(Boolean)
        .join(" "),
    );
  };

  return (
    <section className="mk-bagian mk-ekspor">
      <h2>{t("export_title")}</h2>
      {ids.length > 0 && (
        <div className="bch-field">
          <label htmlFor="mk-tautan-daftar">{t("export_label")}</label>
          <div className="mk-gabung">
            <input
              id="mk-tautan-daftar"
              className="bch-input"
              readOnly
              value={tautan}
              onFocus={(e) => e.target.select()}
            />
            <button type="button" className="bch-btn" onClick={salin}>
              {t("copy_link")}
            </button>
          </div>
          {pesanSalin && (
            <p className="mk-catatan m-0" role="status">
              {pesanSalin}
            </p>
          )}
        </div>
      )}
      <div className="bch-field">
        <label htmlFor="mk-impor">{t("import_label")}</label>
        <div className="mk-gabung">
          <input id="mk-impor" className="bch-input" value={teks} onChange={(e) => setTeks(e.target.value)} />
          <button type="button" className="bch-btn" data-variant="ghost" onClick={impor} disabled={!teks.trim()}>
            {t("import_btn")}
          </button>
        </div>
        {pesanImpor && (
          <p className="mk-catatan m-0" role="status">
            {pesanImpor}
          </p>
        )}
      </div>
    </section>
  );
}

export default function TersimpanMakan() {
  const { ids, ready } = useFavorites();
  const { t } = useI18n();
  const saved = ids.map((id) => placeMap[id]).filter(Boolean);

  return (
    <div className="bch-page">
      <nav className="bch-remah" aria-label={t("breadcrumb")}>
        <Link href="/makan">{t("nav_home")}</Link> / <span aria-current="page">{t("saved_title")}</span>
      </nav>
      <h1 className="mk-judul">{t("saved_title")}</h1>
      <p className="bch-lede">{t("saved_local")}</p>
      <TawaranTautan />

      {ready && saved.length === 0 && (
        <div className="mk-kosong">
          <p>{t("saved_empty")}</p>
          <Link href="/makan/peta" className="bch-btn">
            {t("idx_all")}
          </Link>
        </div>
      )}
      {saved.length > 0 && (
        <ul className="mk-daftar mk-bagian">
          {saved.map((p) => (
            <li key={p.id}>
              <BarisTempat place={p} Judul="h2" />
            </li>
          ))}
        </ul>
      )}

      {ready && <EksporImpor />}
    </div>
  );
}
