"use client";

import type OpenSeadragon from "openseadragon";
import { useCallback, useEffect, useRef, useState } from "react";

// Peta isometrik interaktif di sampul beranda (purwarupa 9 Nov 2026, contoh dari pemilik: yadongxie.com/lab/san-francisco).
// - Layar dengan tetikus: peta di sampul langsung bisa digeser; gulir biasa tetap menggulir halaman, Ctrl/Cmd+gulir
//   memperbesar (mode kooperatif OpenSeadragon 6, seperti peta Google di dalam halaman).
// - Layar sentuh: sampul tetap gambar biasa supaya hemat kuota; peta baru dimuat saat Jelajahi Peta ditekan.
// - Jelajahi Peta: layar penuh dengan peta kecil di pojok; posisi disimpan di alamat (#x,y,zoom) supaya bisa dibagikan.
// Gambar sampul (<img> di SampulBeranda) tetap tampil sampai ubin peta selesai digambar.

const DZI = "/grafis/sampul/harbourbay-zoom/zoom.dzi";
/** Sama dengan object-position gambar sampul, supaya peta muncul tepat di tempat gambarnya. */
const POSISI_X = 0.42;
const POSISI_Y = 0.5;
const POLA_HASH = /^#(\d+),(\d+),(\d*\.?\d+)$/;

type Keadaan = "diam" | "muat" | "siap" | "gagal";
type OSD = typeof OpenSeadragon;

/** minZoomLevel ada di Viewport OpenSeadragon tetapi belum ada di tipenya. */
const aturZoomMin = (v: OpenSeadragon.Viewer, z: number) => {
  (v.viewport as unknown as { minZoomLevel: number }).minZoomLevel = z;
};

const tenang = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.gerak === "tenang";
const pakaiTetikus = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export default function PetaSampul() {
  const wadah = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<OpenSeadragon.Viewer | null>(null);
  const osdRef = useRef<OSD | null>(null);
  const tombolJelajah = useRef<HTMLButtonElement>(null);
  const tombolTutup = useRef<HTMLButtonElement>(null);
  const [keadaan, setKeadaan] = useState<Keadaan>("diam");
  const [jelajah, setJelajah] = useState(false);
  const jelajahRef = useRef(false);
  const tujuanAwal = useRef<{ x: number; y: number; z: number } | null>(null);

  /** Bingkai seperti object-fit: cover dengan object-position 42% 50%. */
  const bingkaiSampul = useCallback(() => {
    const v = viewerRef.current;
    const O = osdRef.current;
    const el = wadah.current;
    if (!v || !O || !el) return null;
    const ukuran = v.world.getItemAt(0)?.getContentSize();
    if (!ukuran) return null;
    const a = ukuran.y / ukuran.x;
    const rasio = el.clientHeight / Math.max(1, el.clientWidth);
    if (rasio < a) {
      const tinggi = rasio;
      return new O.Rect(0, (a - tinggi) * POSISI_Y, 1, tinggi);
    }
    const lebar = a / rasio;
    return new O.Rect((1 - lebar) * POSISI_X, 0, lebar, a);
  }, []);

  const tulisHash = useCallback(() => {
    const v = viewerRef.current;
    const O = osdRef.current;
    if (!v || !O || !jelajahRef.current) return;
    const pusat = v.viewport.viewportToImageCoordinates(v.viewport.getCenter(true));
    const zoom = v.viewport.viewportToImageZoom(v.viewport.getZoom(true));
    history.replaceState(null, "", `#${Math.round(pusat.x)},${Math.round(pusat.y)},${zoom.toFixed(4)}`);
  }, []);

  const buatPenampil = useCallback(async () => {
    if (viewerRef.current || !wadah.current) return;
    setKeadaan("muat");
    try {
      const O = (await import("openseadragon")).default;
      osdRef.current = O;
      O.setString("GestureHints.Scroll", "Tekan {0} sambil menggulir untuk memperbesar peta");
      O.setString("GestureHints.Touch", "Pakai dua jari untuk menggeser peta");
      const diam = tenang();
      const v = O({
        element: wadah.current,
        tileSources: DZI,
        showNavigationControl: false,
        showNavigator: true,
        navigatorPosition: "BOTTOM_LEFT",
        navigatorSizeRatio: 0.16,
        navigatorAutoFade: false,
        visibilityRatio: 1,
        constrainDuringPan: true,
        maxZoomPixelRatio: 3,
        imageSmoothingEnabled: false,
        animationTime: diam ? 0 : 0.9,
        springStiffness: diam ? 100 : 6.5,
        tabIndex: -1,
        gestureSettingsMouse: { clickToZoom: false, dblClickToZoom: true, flickEnabled: !diam },
        gestureSettingsTouch: { pinchToZoom: true, dblClickToZoom: true, flickEnabled: !diam },
        // Mode kooperatif: halaman tetap bisa digulir saat peta di sampul (opsi OpenSeadragon 6, belum ada di tipe).
        ...({ cooperativeGestures: !jelajahRef.current } as object),
      } as OpenSeadragon.Options);
      viewerRef.current = v;
      v.addHandler("open", () => {
        const awal = tujuanAwal.current;
        const ukuran = v.world.getItemAt(0)?.getContentSize();
        if (awal && ukuran) {
          v.viewport.zoomTo(v.viewport.imageToViewportZoom(awal.z), undefined, true);
          v.viewport.panTo(v.viewport.imageToViewportCoordinates(new O.Point(awal.x, awal.y)), true);
        } else {
          const b = bingkaiSampul();
          if (b) v.viewport.fitBounds(b, true);
        }
        // Di sampul peta tidak bisa diperkecil melewati bingkainya; di Jelajahi bisa sampai seluruh peta terlihat.
        if (!jelajahRef.current) aturZoomMin(v, v.viewport.getZoom(true));
        v.world.getItemAt(0)?.addOnceHandler("fully-loaded-change", () => setKeadaan("siap"));
      });
      v.addHandler("open-failed", () => setKeadaan("gagal"));
      // Pixel art: tajam saat diperbesar, halus saat diperkecil supaya tidak bergerigi.
      v.addHandler("zoom", () => {
        const z = v.viewport.viewportToImageZoom(v.viewport.getZoom(true));
        v.drawer.setImageSmoothingEnabled(z < 1);
      });
      v.addHandler("animation-finish", tulisHash);
    } catch {
      setKeadaan("gagal");
    }
  }, [bingkaiSampul, tulisHash]);

  const janjiMuat = useRef<Promise<void> | null>(null);
  const muat = useCallback(() => {
    // Satu penampil saja, walau Jelajahi ditekan saat peta masih dimuat.
    janjiMuat.current ??= buatPenampil();
    return janjiMuat.current;
  }, [buatPenampil]);

  const buka = useCallback(async () => {
    jelajahRef.current = true;
    setJelajah(true);
    await muat();
    const v = viewerRef.current as (OpenSeadragon.Viewer & { setCooperativeGestures?: (b: boolean) => void }) | null;
    if (!v) return;
    v.setCooperativeGestures?.(false);
    aturZoomMin(v, 0);
    if (v.canvas) v.canvas.tabIndex = 0;
    tulisHash();
  }, [muat, tulisHash]);

  const tutup = useCallback(() => {
    jelajahRef.current = false;
    setJelajah(false);
    history.replaceState(null, "", location.pathname + location.search);
    const v = viewerRef.current as (OpenSeadragon.Viewer & { setCooperativeGestures?: (b: boolean) => void }) | null;
    if (!v) return;
    v.setCooperativeGestures?.(true);
    if (v.canvas) v.canvas.tabIndex = -1;
    const b = bingkaiSampul();
    if (b) {
      v.viewport.fitBounds(b, true);
      aturZoomMin(v, v.viewport.getZoom(true));
    }
  }, [bingkaiSampul]);

  // Setelah Jelajahi ditutup, fokus kembali ke tombol yang membukanya (tombolnya baru ada lagi setelah dirender).
  const pernahJelajah = useRef(false);
  useEffect(() => {
    if (jelajah) pernahJelajah.current = true;
    else if (pernahJelajah.current) tombolJelajah.current?.focus();
  }, [jelajah]);

  // Dimuat setelah halaman tenang, hanya di layar bertetikus; alamat berposisi langsung membuka Jelajahi.
  useEffect(() => {
    const m = location.hash.match(POLA_HASH);
    if (m) {
      tujuanAwal.current = { x: Number(m[1]), y: Number(m[2]), z: Number(m[3]) };
      // Dibuka setelah gambar pertama, bukan di tengah effect.
      const f = requestAnimationFrame(() => void buka());
      return () => cancelAnimationFrame(f);
    }
    if (!pakaiTetikus()) return;
    const tunda = "requestIdleCallback" in window ? window.requestIdleCallback(() => void muat()) : null;
    const cadangan = tunda === null ? window.setTimeout(() => void muat(), 1200) : null;
    return () => {
      if (tunda !== null) window.cancelIdleCallback(tunda);
      if (cadangan !== null) window.clearTimeout(cadangan);
    };
  }, [buka, muat]);

  useEffect(
    () => () => {
      viewerRef.current?.destroy();
      viewerRef.current = null;
    },
    [],
  );

  // Selama Jelajahi: halaman di belakang tidak tergulir, Esc menutup, fokus ke tombol Tutup.
  useEffect(() => {
    if (!jelajah) return;
    const akar = document.documentElement;
    const lama = akar.style.overflow;
    akar.style.overflow = "hidden";
    tombolTutup.current?.focus();
    const tekan = (e: KeyboardEvent) => {
      if (e.key === "Escape") tutup();
    };
    window.addEventListener("keydown", tekan);
    return () => {
      akar.style.overflow = lama;
      window.removeEventListener("keydown", tekan);
    };
  }, [jelajah, tutup]);

  const zoom = (faktor: number) => {
    const v = viewerRef.current;
    if (!v) return;
    v.viewport.zoomBy(faktor, undefined, tenang());
    v.viewport.applyConstraints(tenang());
  };

  return (
    <div
      className="bch-peta-sampul"
      data-keadaan={keadaan}
      data-jelajah={jelajah ? "" : undefined}
      role={jelajah ? "dialog" : undefined}
      aria-modal={jelajah ? true : undefined}
      aria-label={jelajah ? "Jelajahi Peta" : undefined}
    >
      <div
        ref={wadah}
        className="bch-peta-sampul-osd"
        // Di sampul peta ini hiasan (gambar sampul sudah punya teks alternatif). Di Jelajahi ia peta yang dikendalikan
        // dengan seret, cubit, tombol panah, dan +/− milik OpenSeadragon.
        aria-hidden={jelajah ? undefined : true}
        role={jelajah ? "application" : undefined}
        aria-label={
          jelajah
            ? "Peta isometrik Harbour Bay, Nagoya, dan Jodoh. Seret untuk menggeser, tombol panah dan plus minus untuk menjelajah."
            : undefined
        }
      />
      {jelajah && (
        <div className="bch-peta-jelajah-atas">
          {/* Atribusi ikut alur di bawah judul supaya tidak menabrak peta kecil atau tombol, selebar apa pun layarnya. */}
          <div className="bch-peta-jelajah-kiri">
            <p className="bch-peta-jelajah-judul">Harbour Bay · Nagoya · Jodoh</p>
            <p className="bch-peta-atribusi">Ilustrasi dibuat dengan AI dari data peta © kontributor OpenStreetMap</p>
          </div>
          <button ref={tombolTutup} type="button" className="bch-btn" onClick={tutup}>
            Tutup
          </button>
        </div>
      )}
      <div className="bch-peta-kendali">
        {(jelajah || keadaan === "siap") && (
          <>
            <button
              type="button"
              className="bch-peta-tombol"
              onClick={() => zoom(1.6)}
              aria-label="Perbesar peta isometrik"
            >
              +
            </button>
            <button
              type="button"
              className="bch-peta-tombol"
              onClick={() => zoom(1 / 1.6)}
              aria-label="Perkecil peta isometrik"
            >
              −
            </button>
          </>
        )}
        {!jelajah && (
          <button ref={tombolJelajah} type="button" className="bch-peta-jelajahi" onClick={() => void buka()}>
            Jelajahi Peta
          </button>
        )}
      </div>
      {jelajah && keadaan === "gagal" && <p className="bch-peta-gagal">Peta belum dapat dimuat.</p>}
    </div>
  );
}
