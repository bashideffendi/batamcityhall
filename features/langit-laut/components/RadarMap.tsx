"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as PE } from "react";
import type { ConditionsResponse, ForecastResponse, PeringatanResponse } from "@/features/langit-laut/lib/api-types";
import { CCTV_HOST, MAPPED_CAMS, loadHls, type Cam } from "@/features/langit-laut/lib/cctv";
import { reduceMotion, saveData } from "@/features/langit-laut/lib/client";
import { readInitialState } from "@/features/langit-laut/lib/initial-state";
import { aktifPada, kalimatPeringatan } from "@/features/langit-laut/lib/peringatan-cuaca";
import { PREF, writePref } from "@/features/langit-laut/lib/prefs";
import { VIEW_KEYS, defaultViewFor, type Mode, type ViewKey } from "@/features/langit-laut/lib/radar";
import {
  RADAR_OLD_MIN,
  cctvAnswer,
  forecastStrip,
  ofsAnswer,
  ofsCaption,
  ofsView,
  radarView,
  rainAnswer,
  rainCaption,
  rainyMap,
  scopeOf,
  statusRadar,
} from "@/features/langit-laut/lib/status";
import { useInstallPrompt, useMedia, useNow, useOffline, useShare } from "@/features/langit-laut/hooks/useBrowser";
import { useOfs } from "@/features/langit-laut/hooks/useOfs";
import { useRevisit } from "@/features/langit-laut/hooks/usePolling";
import { useRadar } from "@/features/langit-laut/hooks/useRadar";
import { useResource } from "@/features/langit-laut/hooks/useResource";
import { useThemeMode } from "@/features/langit-laut/hooks/useThemeMode";
import Berteduh from "@/features/direktori/Berteduh";
import CctvLayer, { type CamGroup, type CctvApi } from "./CctvLayer";
import CctvPlayer from "./CctvPlayer";
import IosInstallHint from "./IosInstallHint";
import KecamatanLayer, { TempatLayer } from "./KecamatanLayer";
import LandMask from "./LandMask";
import MapController, { type Padding } from "./MapController";
import OfsField from "./OfsField";
import PeringatanLayer from "./PeringatanLayer";
import PetaLangit from "./PetaLangit";
import RadarLayer from "./RadarLayer";
import TabCuaca from "./TabCuaca";
import CamDirectory from "./panel/CamDirectory";
import CamList from "./panel/CamList";
import CctvBlock from "./panel/CctvBlock";
import KondisiSaatIni from "./panel/Conditions";
import { Cakupan, Sakelar, Transport } from "./panel/Controls";
import { HujanPerKecamatan, PerairanInfo, PrakiraanCuaca } from "./panel/DetailSections";
import { KategoriGelombang, LegendaGelombang, LegendaHujan } from "./panel/Legends";
import { Ringkasan } from "./panel/Status";

// ---------------------------------------------------------------------------
// Orkestrator satu halaman peta cuaca (PEDOMAN 3.3, 4.6): panel kiri, peta kanan, data di bawah.
// Logika data ada di hook, aturan tampilan + salinan ada di lib/status.ts.
// ---------------------------------------------------------------------------

const TICK_MS = 30 * 1000; // label "X menit lalu" dihitung ulang
const CONDITIONS_MS = 2 * 60 * 1000;
const FORECAST_MS = 30 * 60 * 1000; // prakiraan 3-jaman; server menahan 15–30 menit
const PERINGATAN_MS = 2 * 60 * 1000; // server menahan 1 menit
/** "Perbesar peta ke sini" dari daftar kelompok: cukup dekat untuk memisahkan pin. */
const GROUP_ZOOM = 15;
/** Warna gelombang diredam (PEDOMAN 5.2): laut tidak boleh biru pekat. */
const REDAM_GELOMBANG = 0.4;
const SERET_PX = 36;

const NASKAH: Record<Mode, { judul: string; penjelas: string }> = {
  hujan: {
    judul: "Radar Hujan",
    penjelas: "Peta ini menunjukkan hujan dari radar cuaca dalam 2,5 jam terakhir. Citra diperbarui setiap 5 menit.",
  },
  ombak: {
    judul: "Tinggi Gelombang",
    penjelas:
      "Peta ini menunjukkan prakiraan tinggi gelombang di perairan Batam dan sekitarnya. Prakiraan diperbarui setiap 3 jam.",
  },
  cctv: {
    judul: "CCTV Lalu Lintas",
    penjelas: `Kamera lalu lintas di ${MAPPED_CAMS.length} titik jalan utama Batam. Pilih kamera di peta atau di daftar untuk melihat siaran langsung.`,
  },
};

type Lapisan = { radar: boolean; gelombang: boolean; kamera: boolean; batas: boolean };
const LAPISAN_AWAL: Record<Mode, Lapisan> = {
  hujan: { radar: true, gelombang: false, kamera: false, batas: true },
  ombak: { radar: false, gelombang: true, kamera: false, batas: false },
  cctv: { radar: false, gelombang: false, kamera: true, batas: false },
};
/** Sakelar "Tampilkan juga di peta" per halaman, urutan persis PEDOMAN 3.3. */
const SAKELAR: Record<Mode, { kunci: keyof Lapisan; label: string }[]> = {
  hujan: [
    { kunci: "batas", label: "Batas kecamatan" },
    { kunci: "gelombang", label: "Tinggi gelombang" },
    { kunci: "kamera", label: "Kamera lalu lintas" },
  ],
  ombak: [
    { kunci: "radar", label: "Radar hujan" },
    { kunci: "kamera", label: "Kamera lalu lintas" },
    { kunci: "batas", label: "Batas kecamatan" },
  ],
  cctv: [
    { kunci: "radar", label: "Radar hujan" },
    { kunci: "gelombang", label: "Tinggi gelombang" },
  ],
};

/** Param URL tampilan sekarang (?view=&cam=), hanya yang bukan bawaan. */
function applyStateParams(p: URLSearchParams, mode: Mode, view: ViewKey, cam: Cam | null) {
  p.delete("view");
  p.delete("cam");
  if (view !== defaultViewFor(mode)) p.set("view", view);
  if (cam) p.set("cam", cam.slug);
  return p;
}

export default function RadarMap({ mode }: { mode: Mode }) {
  // Komponen ini client-only (dynamic ssr:false) jadi aman baca window/localStorage di initializer.
  const [init] = useState(() => readInitialState(mode));
  const [view, setView] = useState<ViewKey>(init.view);
  const [playing, setPlaying] = useState(false);
  const [collapsed, setCollapsed] = useState(init.collapsed);
  const [lapisan, setLapisan] = useState<Lapisan>(() => LAPISAN_AWAL[mode]);
  const wide = useMedia("(min-width: 900px)");

  // Kamera yang diputar (null = tidak ada stream), kamera yang gagal diputar di sesi ini, 3 kamera
  // terakhir dibuka, dan kelompok yang daftarnya terbuka.
  const [activeCam, setActiveCam] = useState<Cam | null>(init.cam);
  const [camAutoStart, setCamAutoStart] = useState(!init.cam); // dari link: tombol putar dulu
  const [deadCams, setDeadCams] = useState<Map<string, number | null>>(() => new Map());
  const [recentCams, setRecentCams] = useState<Cam[]>(init.recentCams);
  const [camGroup, setCamGroup] = useState<CamGroup | null>(null);
  const cctvApi = useRef<CctvApi | null>(null);

  const panelRef = useRef<HTMLElement>(null);
  const seret = useRef<number | null>(null);

  const tampilRadar = lapisan.radar;
  const tampilGelombang = lapisan.gelombang;
  const tampilKamera = lapisan.kamera;

  // ---- data ----
  const offline = useOffline();
  const tick = useNow(TICK_MS);
  const stopPlaying = useCallback(() => setPlaying(false), []);
  const radar = useRadar({ enabled: tampilRadar, playing: mode === "hujan" && playing });
  const ofs = useOfs({ enabled: tampilGelombang, playing: mode === "ombak" && playing, onSweepEnd: stopPlaying });
  const conditions = useResource<ConditionsResponse>("/api/conditions", CONDITIONS_MS, mode === "hujan", false);
  const forecast = useResource<ForecastResponse>("/api/prakiraan", FORECAST_MS, mode === "hujan", true);
  const cuaca = useResource<PeringatanResponse>("/api/peringatan-cuaca?poligon=1", PERINGATAN_MS, mode === "hujan", false);

  const theme = useThemeMode(() => playing || !!activeCam);
  const { canInstall, install } = useInstallPrompt();
  const { share, toast } = useShare();

  // App kembali terlihat atau sinyal kembali: muat ulang data yang tampil.
  useRevisit((reopen) => {
    if (tampilRadar) radar.load();
    if (mode === "hujan") {
      conditions.load();
      cuaca.load();
    }
    if (tampilGelombang) {
      if (reopen) ofs.reopen();
      else ofs.load(false);
      if (navigator.onLine !== false) ofs.loadPerairan();
    }
  });

  // Padding fit: lembar bawah menutup peta di ponsel; di desktop hanya kendali waktu yang menutup.
  const getPadding = useCallback((): Padding => {
    if (window.matchMedia("(min-width: 900px)").matches) {
      return { paddingTopLeft: [24, 24], paddingBottomRight: [24, mode === "cctv" ? 24 : 110] };
    }
    const tinggi = panelRef.current?.offsetHeight ?? 160;
    return { paddingTopLeft: [14, 14], paddingBottomRight: [14, Math.min(tinggi, window.innerHeight * 0.5) + 14] };
  }, [mode]);
  const focusPanel = useCallback(() => {
    panelRef.current?.querySelector<HTMLElement>(".answer")?.focus();
  }, []);

  useEffect(() => {
    writePref(PREF.view, view);
    writePref(PREF.collapsed, collapsed ? "1" : "0");
  }, [view, collapsed]);

  // URL mencerminkan keadaan (bisa dibagikan); param lain dipertahankan.
  useEffect(() => {
    try {
      const q = applyStateParams(new URLSearchParams(window.location.search), mode, view, activeCam).toString();
      const next = `${window.location.pathname}${q ? `?${q}` : ""}${window.location.hash}`;
      if (next !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
        window.history.replaceState(null, "", next);
      }
    } catch {
      /* abaikan */
    }
  }, [mode, view, activeCam]);

  // Lapisan kamera tampil: preconnect ke host kamera (tanpa muatan) dan chunk hls.js. Nol byte video
  // sebelum pin diketuk.
  useEffect(() => {
    if (!tampilKamera) return;
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = CCTV_HOST;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
    if (!saveData()) loadHls().catch(() => {});
    return () => {
      link.remove();
    };
  }, [tampilKamera]);

  // ---- aksi ----
  const togglePlay = () => {
    if (!playing && mode === "ombak") ofs.rewindIfAtEnd();
    setPlaying((p) => !p);
  };
  const scrub = (v: number) => {
    setPlaying(false);
    if (mode === "ombak") ofs.scrub(v);
    else radar.scrub(v);
  };
  const toNow = () => {
    setPlaying(false);
    if (mode === "ombak") ofs.toNow();
    else radar.scrub(Math.max(0, radar.frames.length - 1));
  };
  const closeCam = useCallback(() => {
    setActiveCam(null);
    setCamAutoStart(true);
  }, []);
  const pickCam = useCallback((cam: Cam) => {
    setCamAutoStart(true);
    setActiveCam(cam);
    writePref(PREF.camHint, "1");
    setRecentCams((prev) => {
      const next = [cam, ...prev.filter((c) => c.slug !== cam.slug)].slice(0, 3);
      writePref(PREF.recentCams, JSON.stringify(next.map((c) => c.slug)));
      return next;
    });
  }, []);
  const onDead = useCallback((slug: string, lastSeen: number | null) => {
    setDeadCams((m) => {
      const n = new Map(m);
      n.set(slug, lastSeen);
      return n;
    });
  }, []);
  const onCluster = useCallback((g: CamGroup | null) => {
    setCamGroup(g);
    if (g) setCollapsed(false);
  }, []);
  // Tutup daftar kelompok: fokus kembali ke gelembungnya (tunggu panel merender ulang).
  const closeGroup = () => {
    const key = camGroup?.key;
    setCamGroup(null);
    if (key) window.setTimeout(() => cctvApi.current?.focusGroup(key), 30);
  };
  const zoomGroup = () => {
    const cams = camGroup?.cams ?? [];
    setCamGroup(null);
    window.setTimeout(() => {
      cctvApi.current?.zoomToCams(cams, GROUP_ZOOM);
      focusPanel();
    }, 30);
  };
  const toggleBuka = () => {
    setCollapsed((c) => {
      const tutup = !c;
      if (!tutup) {
        window.setTimeout(() => panelRef.current?.scrollTo({ top: 0, behavior: reduceMotion() ? "auto" : "smooth" }), 40);
      }
      return tutup;
    });
  };
  // Lembar bawah bisa ditarik: seret ke atas membuka, ke bawah menutup, ketuk membalik.
  const mulaiSeret = (e: PE<HTMLButtonElement>) => {
    seret.current = e.clientY;
  };
  const akhirSeret = (e: PE<HTMLButtonElement>) => {
    if (seret.current === null) return;
    const dy = e.clientY - seret.current;
    seret.current = null;
    if (dy < -SERET_PX) setCollapsed(false);
    else if (dy > SERET_PX) setCollapsed(true);
    else toggleBuka();
  };

  // ---- turunan tampilan ----
  const now = Math.max(tick, radar.loadedAt);
  const rv = radarView({
    frames: radar.frames,
    idx: radar.idx,
    status: radar.status,
    offline,
    now,
    broken: radar.broken,
  });
  // "Batam" menjawab untuk Kota Batam; "Kepulauan Riau" dan "Luas" untuk semua kab/kota Kepri.
  const scope = scopeOf(view);
  const rain = rainAnswer({ echo: radar.echo, frames: radar.frames, rv, status: radar.status, offline, now, scope });
  const rainCap = rainCaption(rv, now);
  const tiles = forecastStrip(forecast.data, forecast.error, now, 4);
  const rainyKecs = rainyMap(radar.echo);
  // Terputus: citra lebih tua dari 30 menit tidak ditampilkan (PEDOMAN 3.3).
  const radarTerputus = rv.latestAge !== null && rv.latestAge > RADAR_OLD_MIN;
  const showKec = rv.isLatest && !rv.currentBroken && radar.status === "ok" && !radarTerputus;
  const ov = ofsView({
    ofs: ofs.ofs,
    idx: ofs.idx,
    failed: ofs.failed,
    tilesDown: ofs.tilesDown,
    maskOk: ofs.maskOk,
    offline,
  });
  const ombak = ofsAnswer(ofs.perairan, ofs.perairanError, ov, offline, now);
  const ombakCap = ofsCaption(ov);
  const cctv = cctvAnswer(MAPPED_CAMS.length, deadCams.size);
  // Peringatan dini: poligon selalu digambar; kalimat di panel mengikuti cakupan yang dipilih.
  const cuacaAktif = useMemo(() => aktifPada(cuaca.data?.peringatan, now), [cuaca.data, now]);
  const cuacaSorot = scope === "batam" ? cuacaAktif.find((p) => p.batam.length > 0) : cuacaAktif[0];
  const cuacaKalimat = cuacaSorot ? `Peringatan dini: ${kalimatPeringatan(cuacaSorot, now)}` : "";
  const statRadar = statusRadar(rv.latestAge);
  const nadaRadar = statRadar === "Langsung" ? "ok" : statRadar === "Tertunda" ? "caution" : "danger";
  const jamRadar = rv.current?.time ?? "";
  const peringatanGelombang = mode === "ombak" ? ombak.warning : null;

  // Pembaca layar: hanya keadaan terbaru (bukan tiap frame animasi atau geseran).
  const liveText =
    mode === "hujan" ? [cuacaKalimat, rain.live].filter(Boolean).join(" ") : mode === "ombak" ? ombak.live : "";

  const onShare = () => {
    const q = applyStateParams(new URLSearchParams(), mode, view, activeCam).toString();
    const url = `${window.location.origin}${window.location.pathname}${q ? `?${q}` : ""}`;
    const text =
      mode === "hujan"
        ? rain.share
        : mode === "ombak"
          ? ombak.share
          : activeCam
            ? `CCTV ${activeCam.name}, Batam`
            : "Kamera lalu lintas Batam";
    share({ title: "Cuaca dan Laut · Batam City Hall", text, url });
  };

  const modalOpen = !!activeCam;
  const firstTime = radar.frames[0]?.time;

  const cakupan = mode !== "cctv" && <Cakupan keys={VIEW_KEYS[mode]} view={view} onChange={setView} />;
  const waktu =
    mode === "hujan" ? (
      <Transport
        playing={playing}
        ready={rv.ready}
        onTogglePlay={togglePlay}
        playLabel={firstTime ? `Putar radar sejak pukul ${firstTime} WIB` : "Putar radar"}
        label="Waktu citra radar"
        valueText={rv.sliderText}
        max={Math.max(0, radar.frames.length - 1)}
        value={radar.idx}
        onScrub={scrub}
        caption={rainCap}
        jam={jamRadar}
        ketJam={rv.isLatest ? "Terbaru" : "Riwayat"}
        onToNow={toNow}
      />
    ) : mode === "ombak" ? (
      <Transport
        playing={playing}
        ready={ov.ready}
        onTogglePlay={togglePlay}
        playLabel={ov.lastWib ? `Putar prakiraan sampai ${ov.lastWib.day} ${ov.lastWib.time}` : "Putar prakiraan"}
        label="Waktu prakiraan gelombang"
        valueText={ov.sliderText}
        max={Math.max(0, ov.count - 1)}
        value={ofs.idx}
        onScrub={scrub}
        caption={ombakCap}
        jam={ov.wib?.time ?? ""}
        ketJam={ov.phase === "now" ? "Sekarang" : "Prakiraan"}
        onToNow={toNow}
      />
    ) : null;

  return (
    <div className="app-root cu-halaman" data-mode={mode}>
      {wide && <TabCuaca aktif={mode} />}

      <div className="cu-kerja" inert={modalOpen}>
        <section
          ref={panelRef}
          className="cu-panel"
          aria-label={NASKAH[mode].judul}
          data-tutup={collapsed && !wide ? "" : undefined}
        >
          {!wide && (
            <button
              type="button"
              className="cu-pegangan"
              onPointerDown={mulaiSeret}
              onPointerUp={akhirSeret}
              aria-label={collapsed ? "Buka panel" : "Tutup panel"}
              aria-expanded={!collapsed}
              aria-controls="cu-isi"
            >
              <i aria-hidden />
            </button>
          )}
          <h1>{NASKAH[mode].judul}</h1>
          <p className="cu-penjelas">{NASKAH[mode].penjelas}</p>

          {mode === "hujan" && (
            <Ringkasan
              kalimat={rain.headline}
              baris={rain.context}
              nada={nadaRadar}
              onRetry={rain.retry && !offline ? radar.load : undefined}
            />
          )}
          {mode === "ombak" && (
            <Ringkasan kalimat={ombak.headline} baris={ombak.context} onRetry={ombak.retry ? () => ofs.load(true) : undefined} />
          )}
          {mode === "cctv" && <p className="cu-petunjuk">Ketuk titik di peta untuk memilih kamera.</p>}

          {!wide && <TabCuaca aktif={mode} tanpaRemah />}

          <div id="cu-isi" className="cu-isi">
            {mode === "hujan" && cuacaKalimat && (
              <p className="bch-note cu-peringatan" data-tone="danger" data-peringatan-cuaca>
                <Link href="/cuaca/peringatan" prefetch={false}>
                  {cuacaKalimat}
                </Link>
              </p>
            )}
            {peringatanGelombang && (
              <p className="bch-note cu-peringatan" data-tone="danger" data-peringatan-gelombang>
                {peringatanGelombang}
              </p>
            )}
            {mode === "ombak" && ov.problem && <p className="cu-masalah">{ov.problem}</p>}
            {mode === "cctv" && deadCams.size > 0 && <p className="cu-masalah">{cctv.context}</p>}

            {!wide && cakupan && <div className="cu-kendali-ponsel">{cakupan}</div>}
            {!wide && waktu && <div className="cu-kendali-ponsel">{waktu}</div>}

            {mode === "hujan" && <LegendaHujan />}
            {mode === "ombak" && <LegendaGelombang />}

            <section className="cu-sakelar-grup" aria-labelledby="cu-sakelar-judul">
              <h2 id="cu-sakelar-judul" className="cu-sub">
                Tampilkan juga di peta
              </h2>
              {SAKELAR[mode].map((s) => (
                <Sakelar
                  key={s.kunci}
                  label={s.label}
                  nyala={lapisan[s.kunci]}
                  onUbah={(v) => setLapisan((l) => ({ ...l, [s.kunci]: v }))}
                />
              ))}
            </section>

            {mode === "hujan" && radar.frames.length > 0 && <HujanPerKecamatan echo={radar.echo} scope={scope} />}
            {mode === "hujan" && <Berteduh echo={radar.echo} segar={rv.fresh} />}

            {mode === "cctv" &&
              (camGroup ? (
                <CamList
                  key={camGroup.key}
                  members={camGroup.cams}
                  dead={deadCams}
                  onPick={pickCam}
                  onZoom={zoomGroup}
                  onClose={closeGroup}
                />
              ) : (
                <>
                  <CctvBlock recent={recentCams} dead={deadCams} onPick={pickCam} showHint={false} />
                  <CamDirectory dead={deadCams} onPick={pickCam} />
                </>
              ))}

            <p className="cu-aksi">
              <button type="button" className="bch-btn" data-variant="ghost" onClick={onShare}>
                Bagikan
              </button>
              {canInstall && (
                <button type="button" className="bch-btn" data-variant="ghost" onClick={install}>
                  Pasang aplikasi
                </button>
              )}
            </p>
          </div>
          <div className="sr-only" role="status" aria-live="polite">
            {liveText}
          </div>
        </section>

        <div className="cu-peta">
          <PetaLangit theme={theme}>
            {tampilRadar && (
              <RadarLayer
                url={rv.current && !rv.currentBroken && !radarTerputus ? rv.current.url : null}
                opacity={0.85}
                onBroken={radar.markBroken}
              />
            )}
            {lapisan.batas && <KecamatanLayer rainy={rainyKecs} showRain={showKec && tampilRadar} theme={theme} />}
            {mode === "hujan" && <PeringatanLayer peringatan={cuacaAktif} theme={theme} />}
            {mode === "hujan" && <TempatLayer />}
            {tampilGelombang && ofs.ofs?.baserun && ov.valid && (
              <OfsField
                baserun={ofs.ofs.baserun}
                valid={ov.valid}
                opacity={Math.min(ov.opacity, REDAM_GELOMBANG)}
                onTilesDown={ofs.setTilesDown}
              />
            )}
            {/* Mask daratan di atas field: warna gelombang hanya di laut. */}
            {tampilGelombang && <LandMask theme={theme} onStatus={ofs.setMaskOk} />}
            {tampilKamera && (
              <CctvLayer
                onPick={pickCam}
                dead={deadCams}
                getPadding={getPadding}
                onCluster={onCluster}
                focusPanel={focusPanel}
                selectedKey={camGroup?.key ?? null}
                apiRef={cctvApi}
              />
            )}
            <MapController view={view} mode={mode} getPadding={getPadding} collapsed={collapsed} />
          </PetaLangit>
          {wide && cakupan && <div className="cu-cakupan">{cakupan}</div>}
          {wide && waktu && <div className="cu-waktu">{waktu}</div>}
        </div>
      </div>

      {mode === "hujan" && (
        <div className="cu-data">
          <PrakiraanCuaca fc={forecast.data} tiles={tiles} />
          <KondisiSaatIni data={conditions.data} error={conditions.error} echo={radar.echo} />
        </div>
      )}
      {mode === "ombak" && (
        <div className="cu-data">
          <PerairanInfo p={ofs.perairan} error={ofs.perairanError} now={now} />
          <KategoriGelombang />
        </div>
      )}

      {activeCam && (
        <CctvPlayer key={activeCam.slug} cam={activeCam} onClose={closeCam} onDead={onDead} autoStart={camAutoStart} />
      )}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
      <IosInstallHint />
    </div>
  );
}
