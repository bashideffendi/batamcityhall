"use client";

import { Map as MapLibre, type ErrorEvent, type GeoJSONSource, type MapLayerMouseEvent } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSiteTheme } from "@/components/site/useSiteTheme";
import { useNow } from "@/features/langit-laut/hooks/useBrowser";
import { useResource } from "@/features/langit-laut/hooks/useResource";
import type { FramesResponse } from "@/features/langit-laut/lib/api-types";
import { ageMinutesOf } from "@/features/langit-laut/lib/radar";
import { RADAR_OLD_MIN } from "@/features/langit-laut/lib/status";
import { readTheme } from "@/lib/theme";
import { pasangGlobalPeta, webglAda } from "./global";
import CariPeta, { type PesanLokasi } from "./CariPeta";
import ItikBerbaris from "./ItikBerbaris";
import KartuPin from "./KartuPin";
import {
  gayaBeranda,
  GRUP_AWAL,
  GRUP_PIN,
  grupDari,
  LAYER_KLASTER,
  LAYER_KLIK_PIN,
  SUMBER_PIN,
  type PinPeta,
} from "./lapisan";
import { Kartusis, Mawar, SkalaBatang } from "./OrnamenChart";
import { baseStyle, MAP_BOUNDS, SOURCE_ID, TAMPILAN_AWAL } from "./style";
import TepiChart from "./TepiChart";
import { usePandangan } from "./usePandangan";

type Status = "memuat" | "siap" | "gagal";

const SEGAR_MS = 2 * 60 * 1000;
const TICK_MS = 30 * 1000;

// Terjemahan teks kontrol bawaan MapLibre. Map.Title menjadi aria-label kanvas.
const TEKS_PETA = {
  "Map.Title": "Peta laut Batam. Geser dengan tombol panah, perbesar dengan tombol plus dan minus.",
  "AttributionControl.ToggleAttribution": "Buka atau tutup atribusi",
  "CooperativeGesturesHandler.WindowsHelpText": "Tekan Ctrl sambil menggulir untuk memperbesar peta",
  "CooperativeGesturesHandler.MacHelpText": "Tekan ⌘ sambil menggulir untuk memperbesar peta",
  "CooperativeGesturesHandler.MobileHelpText": "Geser dengan dua jari untuk menggerakkan peta",
};

const gerakTenang = () =>
  document.documentElement.dataset.gerak === "tenang" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function PetaLaut() {
  const wadah = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapLibre | null>(null);
  const [status, setStatus] = useState<Status>(() => (webglAda() ? "memuat" : "gagal"));
  const theme = useSiteTheme();
  const pandangan = usePandangan(map);
  const [pins, setPins] = useState<PinPeta[] | null>(null);
  const [pinGagal, setPinGagal] = useState(false);
  const [aktif, setAktif] = useState<ReadonlySet<string>>(() => new Set(GRUP_AWAL));
  const [hujan, setHujan] = useState(true);
  const [pilihId, setPilihId] = useState(() => new URLSearchParams(window.location.search).get("tempat"));
  const [saya, setSaya] = useState<[number, number] | null>(null);
  const [pesanLokasi, setPesanLokasi] = useState<PesanLokasi>(null);
  const now = useNow(TICK_MS);
  const frames = useResource<FramesResponse>("/api/frames", SEGAR_MS, hujan, false);

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
      // Peta ada di atas halaman yang bisa digulir: satu jari harus tetap menggulir halaman.
      cooperativeGestures: true,
      fadeDuration: gerakTenang() ? 0 : 300,
      attributionControl: { compact: false },
      locale: TEKS_PETA,
    });
    m.touchZoomRotate.disableRotation();
    m.keyboard.disableRotation();

    // Hanya sumber peta dasar yang menentukan gagal, dan hanya sebelum tampilan pertama selesai.
    // Tile yang sesekali gagal setelah itu tidak perlu menutup peta.
    let selesai = false;
    m.on("error", (e: ErrorEvent & { sourceId?: string }) => {
      if (selesai || e.sourceId !== SOURCE_ID) return;
      selesai = true;
      setStatus("gagal");
    });
    // Bukan "idle": selama pengguna menggeser atau memuat tile baru, idle terus tertunda.
    m.once("load", () => {
      setMap(m);
      if (selesai) return;
      selesai = true;
      setStatus("siap");
    });

    // Tekstur kertas tidak boleh menimpa kanvas peta (laporan 05).
    document.body.classList.add("bch-no-grain");
    return () => {
      document.body.classList.remove("bch-no-grain");
      m.remove();
    };
  }, []);

  useEffect(() => {
    let hidup = true;
    fetch("/info/direktori/pin.json")
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json() as Promise<PinPeta[]>;
      })
      .then((d) => hidup && setPins(d))
      .catch(() => hidup && setPinGagal(true));
    return () => {
      hidup = false;
    };
  }, []);

  const pilih = useMemo(
    () => pins?.find((p) => p.id === pilihId || p.lain.some((l) => l.id === pilihId)) ?? null,
    [pins, pilihId],
  );
  // Pin yang dibuka lewat tautan tetap tampil walau grupnya sedang dimatikan.
  const pinTampil = useMemo(
    () => (pins ?? []).filter((p) => aktif.has(grupDari(p.k)) || p.id === pilih?.id),
    [pins, aktif, pilih],
  );

  const terakhir = hujan ? frames.data?.frames.at(-1) : undefined;
  const umurRadar = terakhir ? ageMinutesOf(terakhir.ts, now) : null;
  const radarTs = terakhir && umurRadar !== null && umurRadar <= RADAR_OLD_MIN ? terakhir.ts : null;

  useEffect(() => {
    map?.setStyle(gayaBeranda(baseStyle(theme, window.location.origin), { theme, pins: pinTampil, radarTs, saya }));
  }, [map, theme, pinTampil, radarTs, saya]);

  // Tautan ?tempat=: peta langsung ke pinnya, cukup dekat supaya tidak tertelan klaster.
  useEffect(() => {
    if (!map || !pins) return;
    const id = new URLSearchParams(window.location.search).get("tempat");
    const p = id && pins.find((x) => x.id === id || x.lain.some((l) => l.id === id));
    if (p) map.jumpTo({ center: [p.lng, p.lat], zoom: Math.max(map.getZoom(), 14) });
  }, [map, pins]);

  const ubahPilih = useCallback((id: string | null) => {
    setPilihId(id);
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("tempat", id);
    else url.searchParams.delete("tempat");
    window.history.replaceState(null, "", url);
  }, []);

  useEffect(() => {
    if (!map || !pins) return;
    const klikPin = (e: MapLayerMouseEvent) => {
      const id = e.features?.[0]?.properties?.id;
      if (typeof id !== "string") return;
      ubahPilih(id);
      map.easeTo({ center: e.lngLat, animate: !gerakTenang() });
    };
    const klikKlaster = async (e: MapLayerMouseEvent) => {
      const f = e.features?.[0];
      const sumber = map.getSource<GeoJSONSource>(SUMBER_PIN);
      if (!f || !sumber) return;
      const zoom = await sumber.getClusterExpansionZoom(f.properties.cluster_id);
      map.easeTo({ center: e.lngLat, zoom, animate: !gerakTenang() });
    };
    const masuk = () => {
      map.getCanvas().style.cursor = "pointer";
    };
    const keluar = () => {
      map.getCanvas().style.cursor = "";
    };
    map.on("click", LAYER_KLIK_PIN, klikPin);
    map.on("click", LAYER_KLASTER, klikKlaster);
    for (const l of [LAYER_KLIK_PIN, LAYER_KLASTER]) {
      map.on("mouseenter", l, masuk);
      map.on("mouseleave", l, keluar);
    }
    return () => {
      map.off("click", LAYER_KLIK_PIN, klikPin);
      map.off("click", LAYER_KLASTER, klikKlaster);
      for (const l of [LAYER_KLIK_PIN, LAYER_KLASTER]) {
        map.off("mouseenter", l, masuk);
        map.off("mouseleave", l, keluar);
      }
    };
  }, [map, pins, ubahPilih]);

  const pilihDariCari = (p: PinPeta) => {
    ubahPilih(p.id);
    map?.easeTo({ center: [p.lng, p.lat], zoom: Math.max(map.getZoom(), 14), animate: !gerakTenang() });
  };

  const keSekitar = () => {
    if (!navigator.geolocation) {
      setPesanLokasi({ teks: "Browser ini tidak bisa memberi lokasi." });
      return;
    }
    setPesanLokasi({ teks: "Mencari lokasi Anda…" });
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const [[w, s], [e, n]] = MAP_BOUNDS;
        if (coords.longitude < w || coords.longitude > e || coords.latitude < s || coords.latitude > n) {
          setPesanLokasi({ teks: "Anda di luar peta Batam." });
          return;
        }
        const titik: [number, number] = [coords.longitude, coords.latitude];
        setSaya(titik);
        setPesanLokasi({ teks: "Titik Anda hanya tersimpan di layar ini, tidak dikirim ke mana pun." });
        map?.easeTo({ center: titik, zoom: Math.max(map.getZoom(), 14), animate: !gerakTenang() });
      },
      () => setPesanLokasi({ teks: "Lokasi tidak tersedia. Izinnya mungkin belum diberikan." }),
      { timeout: 10_000, maximumAge: 0 },
    );
  };

  const ubahGrup = (id: string, nyala: boolean) => {
    const baru = new Set(aktif);
    if (nyala) baru.add(id);
    else baru.delete(id);
    setAktif(baru);
  };

  return (
    <>
      <section
        className="peta"
        aria-label="Peta laut Batam"
        data-status={status}
        data-tema={theme}
        data-pin-tampil={pins ? pinTampil.length : undefined}
        data-radar={radarTs ?? undefined}
      >
        <div ref={wadah} className="peta-kanvas" />
        {status === "gagal" && <p className="peta-gagal">Peta gagal dimuat. Laut masih ada, kami saja yang belum.</p>}
        {status === "memuat" && <ItikBerbaris />}
        {status === "siap" && pilih && <KartuPin pin={pilih} onTutup={() => ubahPilih(null)} />}
        {status === "siap" && map && pandangan && (
          <>
            <TepiChart map={map} pandangan={pandangan} />
            <Kartusis pandangan={pandangan} />
            <Mawar />
            <SkalaBatang pandangan={pandangan} />
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
      {pins && <CariPeta pins={pins} onPilih={pilihDariCari} onSekitar={keSekitar} pesan={pesanLokasi} />}
      <fieldset className="peta-lapisan">
        <legend>Lapisan peta</legend>
        <label>
          <input type="checkbox" checked={hujan} onChange={(e) => setHujan(e.target.checked)} />
          Hujan
          <span className="bch-data">
            {!hujan
              ? ""
              : radarTs
                ? `radar MSS, ${umurRadar} menit lalu`
                : frames.error
                  ? "radar gagal dimuat"
                  : "radar belum tersedia"}
          </span>
        </label>
        {GRUP_PIN.map((g) => (
          <label key={g.id}>
            <input type="checkbox" checked={aktif.has(g.id)} onChange={(e) => ubahGrup(g.id, e.target.checked)} />
            {g.label}
            {pins && <span className="bch-data">{pins.filter((p) => grupDari(p.k) === g.id).length}</span>}
          </label>
        ))}
        <p className="peta-lapisan-catatan">
          <span className="peta-lapisan-contoh" data-jenis="pasti" aria-hidden="true" /> terverifikasi{" "}
          <span className="peta-lapisan-contoh" data-jenis="kira" aria-hidden="true" /> perkiraan.{" "}
          {pinGagal ? "Pin gagal dimuat. " : "Tempat tanpa koordinat tidak muncul di peta. "}
          <Link href="/info/direktori">Lihat semua sebagai daftar</Link>
        </p>
      </fieldset>
    </>
  );
}
