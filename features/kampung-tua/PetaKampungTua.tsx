"use client";

import { Map as MapLibre, Marker, type ErrorEvent } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSiteTheme } from "@/components/site/useSiteTheme";
import { pasangGlobalPeta, webglAda } from "@/features/peta/global";
import ItikBerbaris from "@/features/peta/ItikBerbaris";
import { Mawar, SkalaBatang } from "@/features/peta/OrnamenChart";
import { baseStyle, MAP_BOUNDS, SOURCE_ID, TAMPILAN_AWAL } from "@/features/peta/style";
import TepiChart from "@/features/peta/TepiChart";
import { usePandangan } from "@/features/peta/usePandangan";
import { readTheme } from "@/lib/theme";
import type { LapisanId, PenandaKampung } from "./data";
import { IkonGapura, IkonPerkiraan } from "./Ikon";

type Status = "memuat" | "siap" | "gagal";
type InfoLapisan = { id: LapisanId; nama: string; kicker: string; total: number };

const TEKS_PETA = {
  "Map.Title": "Peta kampung tua Batam. Semua kampung juga ada di daftar di bawah peta.",
  "AttributionControl.ToggleAttribution": "Buka atau tutup atribusi",
  "CooperativeGesturesHandler.WindowsHelpText": "Tekan Ctrl sambil menggulir untuk memperbesar peta",
  "CooperativeGesturesHandler.MacHelpText": "Tekan ⌘ sambil menggulir untuk memperbesar peta",
  "CooperativeGesturesHandler.MobileHelpText": "Geser dengan dua jari untuk menggerakkan peta",
};

const SVG_GAPURA =
  '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5C7 8 9.5 6.5 12 3.5c2.5 3 5 4.5 9 5"/><path d="M6 8v12.5M18 8v12.5M3.5 20.5h5M15.5 20.5h5M6 12h12"/></svg>';

/** Tombol penanda: gapura bila koordinatnya terverifikasi, lingkaran berongga bila perkiraan. */
function buatPenanda(p: PenandaKampung, onPilih: (id: string) => void): HTMLButtonElement {
  const el = document.createElement("button");
  el.type = "button";
  el.className = "kt-penanda";
  el.dataset.lapisan = p.lapisan;
  el.dataset.kampung = p.id;
  el.dataset.jenis = p.perkiraan ? "perkiraan" : "gapura";
  el.setAttribute("aria-label", `${p.nama}, ${p.perkiraan ? "lokasi perkiraan" : "lokasi terverifikasi"}`);
  if (p.perkiraan) {
    const lingkar = document.createElement("span");
    lingkar.className = "kt-lingkar";
    el.append(lingkar);
  } else {
    el.innerHTML = SVG_GAPURA;
  }
  el.addEventListener("click", () => onPilih(p.id));
  return el;
}

export default function PetaKampungTua({ penanda, lapisan }: { penanda: PenandaKampung[]; lapisan: InfoLapisan[] }) {
  const wadah = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapLibre | null>(null);
  const [status, setStatus] = useState<Status>(() => (webglAda() ? "memuat" : "gagal"));
  const theme = useSiteTheme();
  const pandangan = usePandangan(map);
  // Mainland lapisan utama. Rempang dan situs lama dinyalakan sendiri oleh pembaca (brief 04).
  const [aktif, setAktif] = useState<ReadonlySet<LapisanId>>(() => new Set<LapisanId>(["daratan"]));
  const [pilihId, setPilihId] = useState<string | null>(null);
  const tutup = useRef<HTMLButtonElement>(null);
  const asalFokus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = wadah.current;
    if (!el || !webglAda()) return;
    pasangGlobalPeta();
    const m = new MapLibre({
      container: el,
      style: baseStyle(readTheme(), window.location.origin),
      bounds: TAMPILAN_AWAL,
      fitBoundsOptions: { padding: 24 },
      maxBounds: MAP_BOUNDS,
      minZoom: 7,
      maxZoom: 16,
      maxPitch: 0,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
      renderWorldCopies: false,
      cooperativeGestures: true,
      attributionControl: { compact: false },
      locale: TEKS_PETA,
    });
    m.touchZoomRotate.disableRotation();
    m.keyboard.disableRotation();

    let selesai = false;
    m.on("error", (e: ErrorEvent & { sourceId?: string }) => {
      if (selesai || e.sourceId !== SOURCE_ID) return;
      selesai = true;
      setStatus("gagal");
    });
    m.once("load", () => {
      setMap(m);
      if (selesai) return;
      selesai = true;
      setStatus("siap");
    });

    document.body.classList.add("bch-no-grain");
    return () => {
      document.body.classList.remove("bch-no-grain");
      m.remove();
    };
  }, []);

  useEffect(() => {
    map?.setStyle(baseStyle(theme, window.location.origin));
  }, [map, theme]);

  const tampil = useMemo(() => penanda.filter((p) => aktif.has(p.lapisan)), [penanda, aktif]);

  // Penanda berupa elemen DOM, jadi tidak ikut hilang saat tema berganti dan warnanya tetap dari token.
  useEffect(() => {
    if (!map) return;
    const pasang = tampil.map((p) => {
      const el = buatPenanda(p, (id) => {
        asalFokus.current = el;
        setPilihId(id);
      });
      return new Marker({ element: el, anchor: "center" }).setLngLat([p.lng, p.lat]).addTo(map);
    });
    return () => {
      for (const m of pasang) m.remove();
    };
  }, [map, tampil]);

  const pilih = tampil.find((p) => p.id === pilihId) ?? null;
  const infoPilih = pilih ? lapisan.find((l) => l.id === pilih.lapisan) : null;

  useEffect(() => {
    if (pilih) tutup.current?.focus({ preventScroll: true });
  }, [pilih]);

  const tutupKartu = () => {
    setPilihId(null);
    asalFokus.current?.focus({ preventScroll: true });
  };

  const ubah = (id: LapisanId, nyala: boolean) => {
    const baru = new Set(aktif);
    if (nyala) baru.add(id);
    else baru.delete(id);
    setAktif(baru);
  };

  return (
    <>
      <section
        className="peta"
        aria-label="Peta kampung tua Batam"
        data-peta="kampung-tua"
        data-status={status}
        data-penanda-tampil={map ? tampil.length : undefined}
      >
        <div ref={wadah} className="peta-kanvas" />
        {status === "gagal" && <p className="peta-gagal">Peta gagal dimuat. Semua kampung tetap ada di daftar.</p>}
        {status === "memuat" && <ItikBerbaris />}
        {status === "siap" && pilih && infoPilih && (
          <aside
            className="peta-kartu"
            aria-label={`Kartu ${pilih.nama}`}
            onKeyDown={(e) => {
              if (e.key === "Escape") tutupKartu();
            }}
          >
            <div className="bch-kicker-row bch-kicker">
              <span>{infoPilih.kicker}</span>
              <button
                ref={tutup}
                type="button"
                className="peta-kartu-tutup"
                aria-label="Tutup kartu"
                onClick={tutupKartu}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <h2>{pilih.nama}</h2>
            <p className="bch-card-loc">{pilih.lokasi}</p>
            <hr className="bch-card-rule" />
            <div className="bch-rebung-mini" aria-hidden="true" />
            {pilih.perkiraan && (
              <p className="m-0">
                <span className="bch-badge" data-tone="info">
                  Lokasi perkiraan, belum dicek ulang
                </span>
              </p>
            )}
            <p className="mt-3 mb-0">
              <Link href={`/cerita/kampung-tua/${pilih.id}`} prefetch={false}>
                Buka kartu lengkap
              </Link>
            </p>
          </aside>
        )}
        {status === "siap" && map && pandangan && (
          <>
            <TepiChart map={map} pandangan={pandangan} />
            <Mawar />
            <SkalaBatang pandangan={pandangan} />
            <div className="peta-zoom">
              <button type="button" className="peta-zoom-btn" aria-label="Perbesar peta" onClick={() => map.zoomIn()}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
              <button type="button" className="peta-zoom-btn" aria-label="Perkecil peta" onClick={() => map.zoomOut()}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                </svg>
              </button>
            </div>
          </>
        )}
      </section>
      <fieldset className="peta-lapisan">
        <legend>Lapisan peta</legend>
        {lapisan.map((l) => {
          const dipeta = penanda.filter((p) => p.lapisan === l.id).length;
          return (
            <label key={l.id}>
              <input type="checkbox" checked={aktif.has(l.id)} onChange={(e) => ubah(l.id, e.target.checked)} />
              {l.nama}
              <span className="bch-data">
                {dipeta} dari {l.total} di peta
              </span>
            </label>
          );
        })}
        <p className="peta-lapisan-catatan kt-legenda">
          <span className="kt-legenda-butir">
            <IkonPerkiraan /> lingkaran berongga: lokasi perkiraan, meleset 1 sampai 3 km
          </span>
          <span className="kt-legenda-butir">
            <IkonGapura ukuran={18} /> gapura: lokasi terverifikasi, belum ada
          </span>
          <span>
            Kampung tanpa koordinat hanya ada di <a href="#daftar">daftar</a>. Kami tidak menebak titiknya.
          </span>
        </p>
      </fieldset>
    </>
  );
}
