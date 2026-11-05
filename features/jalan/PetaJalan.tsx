"use client";

import { Map as MapLibre, Popup, type ErrorEvent, type MapLayerMouseEvent } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { IkonLingkaran } from "@/components/map/icons";
import { muatGambar, WARNA } from "@/features/peta/gambar-penanda";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSiteTheme } from "@/components/site/useSiteTheme";
import { pasangGlobalPeta, webglAda } from "@/features/peta/global";
import ItikBerbaris from "@/features/peta/ItikBerbaris";
import { baseStyle, MAP_BOUNDS, SOURCE_ID, TAMPILAN_AWAL } from "@/features/peta/style";
import { usePandangan } from "@/features/peta/usePandangan";
import { readTheme } from "@/lib/theme";
import { gayaJalan, LAYER_KLIK, type LapisanOsm } from "./peta-lapisan";
import type { KoleksiRute } from "./rute-geo";
import type { TitikJalan } from "./trans-data";

type Status = "memuat" | "siap" | "gagal";

const TANPA_RUTE: KoleksiRute = { type: "FeatureCollection", features: [] };

const gerakTenang = () =>
  document.documentElement.dataset.gerak === "tenang" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const NAMA_JENIS = { hub: "Titik transit Trans Batam", halte: "Halte Trans Batam", terminal: "Terminal Feri" };

function KartuTitik({ titik, onTutup }: { titik: TitikJalan[]; onTutup: () => void }) {
  const tutup = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    tutup.current?.focus({ preventScroll: true });
  }, []);
  return (
    <aside
      className="peta-kartu"
      aria-label={`Kartu ${titik[0].nama}`}
      onKeyDown={(e) => {
        if (e.key === "Escape") onTutup();
      }}
    >
      <div className="bch-kicker-row bch-kicker">
        <span>Transportasi</span>
        <button ref={tutup} type="button" className="peta-kartu-tutup" aria-label="Tutup kartu" onClick={onTutup}>
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
      {titik.map((t) => (
        <div key={t.id} className="jl-kartu-titik">
          <h2>{t.nama}</h2>
          <p className="bch-card-loc">
            {NAMA_JENIS[t.jenis]}. {t.rincian}
          </p>
          <div className="bch-badges mt-2">
            <span className="bch-badge" data-tone={t.perkiraan ? "caution" : "ok"}>
              {t.perkiraan ? "Lokasi perkiraan" : "Lokasi terverifikasi"}
            </span>
          </div>
          {t.catatan && <p className="mt-2 mb-0">{t.catatan}</p>}
          <p className="mt-2 mb-0">
            <Link href={t.href} prefetch={false}>
              Buka Kartu Lengkap
            </Link>
          </p>
        </div>
      ))}
    </aside>
  );
}

export default function PetaJalan({
  titik,
  rute,
  osm,
}: {
  titik: TitikJalan[];
  rute: KoleksiRute;
  osm: LapisanOsm & { ditarik?: string };
}) {
  const wadah = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapLibre | null>(null);
  const [status, setStatus] = useState<Status>(() => (webglAda() ? "memuat" : "gagal"));
  const theme = useSiteTheme();
  const pandangan = usePandangan(map);
  const [hub, setHub] = useState(true);
  const [terminal, setTerminal] = useState(true);
  const [osmNyala, setOsmNyala] = useState(true);
  const [pilih, setPilih] = useState<string[]>([]);

  const tampil = useMemo(() => titik.filter((t) => (t.jenis === "terminal" ? terminal : hub)), [titik, hub, terminal]);
  const dipilih = pilih.flatMap((id) => titik.filter((t) => t.id === id));

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
      fadeDuration: gerakTenang() ? 0 : 300,
      attributionControl: { compact: false },
      locale: {
        "Map.Title": "Peta titik transit Trans Batam dan terminal feri. Daftar lengkapnya ada di bawah peta.",
        "AttributionControl.ToggleAttribution": "Buka atau tutup atribusi",
        "CooperativeGesturesHandler.WindowsHelpText": "Tekan Ctrl sambil menggulir untuk memperbesar peta",
        "CooperativeGesturesHandler.MacHelpText": "Tekan ⌘ sambil menggulir untuk memperbesar peta",
        "CooperativeGesturesHandler.MobileHelpText": "Geser dengan dua jari untuk menggerakkan peta",
      },
    });
    m.on("styleimagemissing", (e) => muatGambar(m, e.id));
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
    map?.setStyle(
      gayaJalan(baseStyle(theme, window.location.origin), {
        theme,
        titik: tampil,
        rute: osmNyala ? rute : TANPA_RUTE,
        osm: osmNyala ? osm : undefined,
      }),
    );
  }, [map, theme, tampil, rute, osm, osmNyala]);

  useEffect(() => {
    if (!map) return;
    const popup = new Popup({ closeButton: false, closeOnClick: false, className: "jl-popup", offset: 12 });
    const klik = (e: MapLayerMouseEvent) => {
      const ids = (e.features ?? []).map((f) => f.properties?.id).filter((x): x is string => typeof x === "string");
      if (ids.length) setPilih([...new Set(ids)]);
    };
    const masuk = (e: MapLayerMouseEvent) => {
      map.getCanvas().style.cursor = "pointer";
      const f = e.features?.[0];
      if (!f || f.geometry.type !== "Point") return;
      const [lng, lat] = f.geometry.coordinates;
      const teks = f.properties?.perkiraan ? "lokasi perkiraan" : "lokasi terverifikasi";
      popup.setLngLat([lng, lat]).setText(`${f.properties?.nama}: ${teks}`).addTo(map);
    };
    const keluar = () => {
      map.getCanvas().style.cursor = "";
      popup.remove();
    };
    map.on("click", LAYER_KLIK, klik);
    map.on("mouseenter", LAYER_KLIK, masuk);
    map.on("mouseleave", LAYER_KLIK, keluar);
    return () => {
      map.off("click", LAYER_KLIK, klik);
      map.off("mouseenter", LAYER_KLIK, masuk);
      map.off("mouseleave", LAYER_KLIK, keluar);
      popup.remove();
    };
  }, [map]);

  const jumlah = (j: (t: TitikJalan) => boolean) => titik.filter(j).length;

  return (
    <>
      <section
        className="peta jl-peta"
        aria-label="Peta titik transit Trans Batam dan terminal feri"
        data-status={status}
        data-tema={theme}
        data-titik={tampil.length}
        data-rute={rute.features.length}
      >
        <div ref={wadah} className="peta-kanvas" />
        {status === "gagal" && <p className="peta-gagal">Peta tidak dapat dimuat. Coba muat ulang.</p>}
        {status === "memuat" && <ItikBerbaris />}
        {status === "siap" && dipilih.length > 0 && <KartuTitik titik={dipilih} onTutup={() => setPilih([])} />}
        {status === "siap" && map && pandangan && (
          <>
            <div className="peta-zoom">
              <button
                type="button"
                className="peta-zoom-btn"
                aria-label="Perbesar peta"
                onClick={() => map.zoomIn({ animate: !gerakTenang() })}
              >
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
              <button
                type="button"
                className="peta-zoom-btn"
                aria-label="Perkecil peta"
                onClick={() => map.zoomOut({ animate: !gerakTenang() })}
              >
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
        <legend>Lapisan Peta</legend>
        <label>
          <input type="checkbox" checked={hub} onChange={(e) => setHub(e.target.checked)} />
          Trans Batam
          <span className="bch-data">{jumlah((t) => t.jenis !== "terminal")}</span>
        </label>
        <label>
          <input type="checkbox" checked={terminal} onChange={(e) => setTerminal(e.target.checked)} />
          Feri
          <span className="bch-data">{jumlah((t) => t.jenis === "terminal")}</span>
        </label>
        <label>
          <input type="checkbox" checked={osmNyala} onChange={(e) => setOsmNyala(e.target.checked)} />
          Jalur dan Halte dari OpenStreetMap
          <span className="bch-data">{osm.halte.features.length} halte</span>
        </label>
        <p className="peta-lapisan-catatan">
          <IkonLingkaran glyph="halte" warna={WARNA.transportasi} ukuran={18} /> Lokasi pasti{" "}
          <IkonLingkaran glyph="halte" warna={WARNA.transportasi} ukuran={18} garis /> Lokasi perkiraan. Titik transit
          Trans Batam mengikuti penanda kota terdekat, belum tentu posisi halte.
        </p>
      </fieldset>
    </>
  );
}
