"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { useFilters, type SortKey } from "../lib/filters";
import { useI18n } from "../lib/i18n";
import BarisTempat from "./BarisTempat";
import FilterBar, { ACARA_BUKA_SARING } from "./FilterBar";
import Ikon from "./Ikon";
import MiniCard from "./MiniCard";
import SearchBar, { PesanKosong } from "./SearchBar";

const MapCanvas = dynamic(() => import("./MapCanvas"), { ssr: false });

type Props = {
  /** Kepala halaman: remah roti, judul, dek. */
  kepala: ReactNode;
  /** Kelompok saringan yang sudah menjadi cakupan halaman. */
  tanpa?: ("hidangan" | "kawasan" | "terminal")[];
  /** Halaman Peta: selebar layar, setinggi layar. */
  penuh?: boolean;
  /** Pilihan urutan yang tersedia. */
  urut?: SortKey[];
  /** Isi tambahan di bawah daftar. */
  bawah?: ReactNode;
};

const URUT_BAWAAN: SortKey[] = ["featured", "ferry", "larut", "harga", "az"];
const TEKS_URUT = {
  featured: "sort_featured",
  ferry: "sort_nearest_ferry",
  larut: "sort_late",
  harga: "sort_price",
  az: "sort_az",
  nearby: "sort_nearby",
} as const;

// Server dan render pertama menganggap layar sempit: peta baru dipasang di browser.
const KUERI_LEBAR = "(min-width: 1000px)";
function langgananLebar(f: () => void) {
  const mq = window.matchMedia(KUERI_LEBAR);
  mq.addEventListener("change", f);
  return () => mq.removeEventListener("change", f);
}
const useLayarLebar = () =>
  useSyncExternalStore(
    langgananLebar,
    () => window.matchMedia(KUERI_LEBAR).matches,
    () => false,
  );

function DaftarHasil({ adaPeta }: { adaPeta: boolean }) {
  const { results, selectedId } = useFilters();
  const wadah = useRef<HTMLUListElement>(null);

  // Pin yang diketuk di peta ikut terlihat di daftar.
  useEffect(() => {
    if (!selectedId) return;
    wadah.current?.querySelector(`[data-id="${CSS.escape(selectedId)}"]`)?.scrollIntoView({ block: "nearest" });
  }, [selectedId]);

  if (results.length === 0) return <PesanKosong />;
  return (
    <ul ref={wadah} className="mk-daftar">
      {results.map((p) => (
        <li key={p.id} data-id={p.id}>
          <BarisTempat place={p} Judul="h2" adaPeta={adaPeta} />
        </li>
      ))}
    </ul>
  );
}

// Daftar dan peta berdampingan di layar lebar. Di ponsel daftar lebih dulu, peta dibuka lewat bilah bawah,
// dan peta baru dimuat saat dibuka supaya tidak memakan kuota.
export default function HalamanDaftar({ kepala, tanpa, penuh = false, urut = URUT_BAWAAN, bawah }: Props) {
  const { results, state, set, dasar, activeCount } = useFilters();
  const { t } = useI18n();
  const lebar = useLayarLebar();
  const [tampil, setTampil] = useState<"daftar" | "peta">("daftar");
  // Halaman Peta selalu menampilkan peta, juga di ponsel.
  const petaTerlihat = lebar || penuh || tampil === "peta";
  const pilihanUrut: SortKey[] = state.userLoc ? ["nearby", ...urut] : urut;

  return (
    <div
      className={penuh ? "mk-tata mk-tata-penuh" : "bch-page mk-tata"}
      data-tampil={tampil}
      data-jumlah-pin={results.length}
    >
      <div className="mk-tata-kepala">{kepala}</div>
      <div className="mk-tata-alat">
        <SearchBar />
        <FilterBar tanpa={tanpa} />
        <div className="mk-hasil-baris">
          <span className="mk-hasil-n" role="status">
            {results.length === dasar.length ? results.length : `${results.length}/${dasar.length}`} {t("results")}
          </span>
          <label className="mk-urut">
            <span>{t("sort")}</span>
            <select className="bch-select" value={state.sort} onChange={(e) => set({ sort: e.target.value as SortKey })}>
              {pilihanUrut.map((u) => (
                <option key={u} value={u}>
                  {t(TEKS_URUT[u])}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="mk-tata-daftar">
        <DaftarHasil adaPeta={petaTerlihat} />
        {bawah && <div className="mk-tata-bawah">{bawah}</div>}
      </div>
      <div className="mk-tata-peta" data-selalu={penuh && tampil === "daftar" ? "" : undefined}>
        {petaTerlihat && (
          <div className="mk-tata-peta-dalam">
            <MapCanvas />
            <MiniCard />
            <p className="mk-peta-catatan">{t("map_legend")}</p>
          </div>
        )}
      </div>

      {/* Bilah bawah ponsel: pindah tampilan, saring, dan simpanan selalu terjangkau jempol. */}
      <div className="mk-bilah" role="group" aria-label={t("view_label")}>
        <button type="button" onClick={() => setTampil(tampil === "daftar" ? "peta" : "daftar")}>
          <Ikon nama={tampil === "daftar" ? "peta" : "daftar"} ukuran={18} />
          {tampil === "daftar" ? t("view_map") : t("view_list")}
        </button>
        <button type="button" onClick={() => window.dispatchEvent(new Event(ACARA_BUKA_SARING))}>
          <Ikon nama="saring" ukuran={18} />
          {t("filters")}
          {activeCount > 0 && <span className="mk-chip-n">{activeCount}</span>}
        </button>
        <Link href="/makan/simpanan" prefetch={false}>
          {t("nav_saved")}
        </Link>
      </div>
    </div>
  );
}
