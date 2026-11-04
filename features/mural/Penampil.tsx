"use client";

import type OpenSeadragon from "openseadragon";
import { useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import type { RainLevel } from "@/features/langit-laut/lib/kecamatan";
import type { Fase } from "./lib/cahaya";
import { lompatMenit, perjalananAktif, posisiKapal, type BarisJadwal } from "./lib/feri";
import { cariHotspot } from "./lib/geom";
import { BATAS_PARTIKEL_HP, BATAS_PARTIKEL_LEBAR } from "./lib/hujan";
import type { ParameterOmbak } from "./lib/ombak";
import { gambarOverlay, type Adegan, type Kapal, type MetaSegmen, type WarnaOverlay } from "./lib/overlay";

export type PenampilApi = {
  panKe: (id: string) => void;
  zoom: (faktor: number) => void;
  pulang: () => void;
};

type Props = {
  dasar: string;
  nomorPin: Map<string, number>;
  pinPerkiraan: Set<string>;
  jadwal: BarisJadwal[];
  hujan: Record<string, RainLevel> | null;
  ombak: ParameterOmbak | null;
  fase: Fase;
  sorot: string | null;
  tenang: boolean;
  fokusAwal: string | null;
  onPilih: (id: string) => void;
  apiRef: Ref<PenampilApi>;
};

const FPS_EFEK = 30;
const FPS_DIAM = 15;
const DPR_MAKS = 1.5;
/** Alamat tile. Produksi: R2 (docs/MURAL.md). Kosong: tile placeholder di public/. */
const TILE_LUAR = process.env.NEXT_PUBLIC_MURAL_TILE_URL;
const WAKTU_ANIMASI = 0.8;

function aturPegas(viewer: OpenSeadragon.Viewer | null, detik: number) {
  const vp = viewer?.viewport as unknown as Record<string, { animationTime: number } | undefined> | undefined;
  if (!vp) return;
  for (const k of ["centerSpringX", "centerSpringY", "zoomSpring"]) {
    const pegas = vp[k];
    if (pegas) pegas.animationTime = detik;
  }
}

const bacaWarna = (): WarnaOverlay => {
  const s = getComputedStyle(document.documentElement);
  const v = (n: string) => s.getPropertyValue(n).trim();
  return {
    hujan: v("--riso-federal-blue"),
    hujanMalam: v("--riso-granite"),
    garisLaut: v("--bch-sea-ink"),
    busa: v("--riso-bisque"),
    lampu: v("--riso-flat-gold"),
    feri: v("--bch-map-ferry"),
    kertas: v("--bch-paper"),
    tinta: v("--bch-ink"),
    sorot: v("--bch-focus"),
  };
};

/** OpenSeadragon dan kanvas overlay. Dimuat lazy lewat next/dynamic, jadi tidak masuk bundel utama. */
export default function Penampil(props: Props) {
  const { dasar, onPilih, apiRef } = props;
  const wadah = useRef<HTMLDivElement>(null);
  const kanvas = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<OpenSeadragon.Viewer | null>(null);
  const osdRef = useRef<typeof OpenSeadragon | null>(null);
  const metaRef = useRef<MetaSegmen | null>(null);
  const gambarRef = useRef<() => void>(() => {});
  const terbaru = useRef(props);
  const pilihRef = useRef(onPilih);
  const [keadaan, setKeadaan] = useState<"muat" | "siap" | "gagal">("muat");

  useEffect(() => {
    terbaru.current = props;
    pilihRef.current = onPilih;
  });

  useImperativeHandle(
    apiRef,
    () => ({
      panKe(id) {
        const v = viewerRef.current;
        const O = osdRef.current;
        const h = metaRef.current?.titik.find((t) => t.id === id);
        if (!v || !O || !h) return;
        const langsung = terbaru.current.tenang;
        v.viewport.panTo(v.viewport.imageToViewportCoordinates(new O.Point(h.x, h.y)), langsung);
        gambarRef.current();
      },
      zoom(faktor) {
        const v = viewerRef.current;
        if (!v) return;
        v.viewport.zoomBy(faktor, undefined, terbaru.current.tenang);
        v.viewport.applyConstraints(terbaru.current.tenang);
      },
      pulang() {
        viewerRef.current?.viewport.goHome(terbaru.current.tenang);
      },
    }),
    [],
  );

  useEffect(() => {
    let batal = false;
    let viewer: OpenSeadragon.Viewer | null = null;
    let raf = 0;
    let jalan = false;
    let terlihat = true;
    let terakhir = 0;
    let hitungan = 0;
    let warna: WarnaOverlay | null = null;
    let kapal: Kapal[] = [];
    let kapalPada = -Infinity;
    const el = wadah.current;
    const cv = kanvas.current;
    if (!el || !cv) return;
    const konteks = cv.getContext("2d");
    if (!konteks) return;

    const bersih: (() => void)[] = [];

    const ukur = () => {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_MAKS);
      cv.width = Math.max(1, Math.round(r.width * dpr));
      cv.height = Math.max(1, Math.round(r.height * dpr));
      konteks.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const hitungKapal = (sekarang: number, meta: MetaSegmen, p: Props): Kapal[] => {
      const waktu = p.tenang ? lompatMenit(sekarang) : sekarang;
      const hasil: Kapal[] = [];
      for (const j of perjalananAktif(p.jadwal, waktu)) {
        const rute = meta.rute.find((r) => r.id === j.ruteId);
        if (rute) hasil.push({ id: j.id, ...posisiKapal(rute.titik, j.fraksi, j.menujuTerminal) });
      }
      return hasil;
    };

    const gambar = (kini: number) => {
      const O = osdRef.current;
      const meta = metaRef.current;
      if (!viewer || !O || !meta) return;
      const r = el.getBoundingClientRect();
      const a = viewer.viewport.imageToViewerElementCoordinates(new O.Point(0, 0));
      const b = viewer.viewport.imageToViewerElementCoordinates(new O.Point(meta.lebar, 0));
      const skala = (b.x - a.x) / meta.lebar;
      const p = terbaru.current;
      warna ??= bacaWarna();
      const sekarang = Date.now();
      // Posisi kapal cukup dihitung sekali sedetik.
      if (sekarang - kapalPada > 1000) {
        kapal = hitungKapal(sekarang, meta, p);
        kapalPada = sekarang;
        el.dataset.kapal = String(kapal.length);
      }
      const adegan: Adegan = {
        meta,
        nomorPin: p.nomorPin,
        pinPerkiraan: p.pinPerkiraan,
        hujan: p.hujan,
        ombak: p.ombak,
        kapal,
        fase: p.fase,
        sorot: p.sorot,
        tenang: p.tenang,
        batasPartikel: r.width < 768 ? BATAS_PARTIKEL_HP : BATAS_PARTIKEL_LEBAR,
        warna,
      };
      gambarOverlay(konteks, adegan, { lebar: r.width, tinggi: r.height, skala, ox: a.x, oy: a.y }, kini / 1000);
      hitungan += 1;
      el.dataset.gambar = String(hitungan);
      el.dataset.skala = skala.toFixed(5);
      el.dataset.ox = a.x.toFixed(1);
      el.dataset.oy = a.y.toFixed(1);
    };

    const putaran = (kini: number) => {
      if (!jalan) return;
      raf = requestAnimationFrame(putaran);
      const p = terbaru.current;
      const bergerak = !!p.ombak || !!p.sorot || kapal.length > 0 || Object.keys(p.hujan ?? {}).length > 0;
      if (kini - terakhir < 1000 / (bergerak ? FPS_EFEK : FPS_DIAM)) return;
      terakhir = kini;
      gambar(kini);
    };

    // Loop hanya hidup kalau gerak hidup, tab terlihat, dan penampil ada di layar.
    const atur = () => {
      const perlu = !terbaru.current.tenang && terlihat && document.visibilityState === "visible" && !!viewer;
      if (perlu && !jalan) {
        jalan = true;
        raf = requestAnimationFrame(putaran);
      } else if (!perlu && jalan) {
        jalan = false;
        cancelAnimationFrame(raf);
      }
      el.dataset.overlay = terbaru.current.tenang ? "diam" : jalan ? "hidup" : "jeda";
    };
    gambarRef.current = () => {
      kapalPada = -Infinity;
      warna = null;
      atur();
      gambar(performance.now());
    };

    const pengamat = new IntersectionObserver(([e]) => {
      terlihat = e.isIntersecting;
      atur();
    });
    pengamat.observe(el);
    const saatVisibilitas = () => atur();
    document.addEventListener("visibilitychange", saatVisibilitas);
    const saatUkuran = new ResizeObserver(() => {
      ukur();
      gambar(performance.now());
    });
    saatUkuran.observe(el);
    ukur();
    bersih.push(() => {
      pengamat.disconnect();
      saatUkuran.disconnect();
      document.removeEventListener("visibilitychange", saatVisibilitas);
      cancelAnimationFrame(raf);
      jalan = false;
    });

    // Saat gerak tenang kapal melompat tiap menit, tanpa loop.
    const tiapMenit = setInterval(() => gambarRef.current(), 60_000);
    bersih.push(() => clearInterval(tiapMenit));

    (async () => {
      try {
        const [modul, respons] = await Promise.all([import("openseadragon"), fetch(`${dasar}/meta.json`)]);
        if (!respons.ok) throw new Error(`meta ${respons.status}`);
        const meta = (await respons.json()) as MetaSegmen;
        if (batal) return;
        const O = modul.default;
        osdRef.current = O;
        metaRef.current = meta;
        const tenang = terbaru.current.tenang;
        viewer = O({
          element: el.querySelector<HTMLElement>("[data-osd]")!,
          tileSources: `${TILE_LUAR ?? dasar}/segmen.dzi`,
          crossOriginPolicy: TILE_LUAR ? "Anonymous" : false,
          drawer: "canvas",
          showNavigationControl: false,
          visibilityRatio: 1,
          constrainDuringPan: true,
          homeFillsViewer: true,
          minZoomImageRatio: 1,
          maxZoomPixelRatio: 2,
          animationTime: tenang ? 0 : WAKTU_ANIMASI,
          springStiffness: tenang ? 100 : 7,
          blendTime: 0,
          immediateRender: tenang,
          gestureSettingsMouse: { clickToZoom: false, dblClickToZoom: true },
          gestureSettingsTouch: { flickEnabled: !tenang, pinchToZoom: true, dblClickToZoom: true },
        });
        viewerRef.current = viewer;
        const v = viewer;

        v.canvas.setAttribute("role", "application");
        v.canvas.setAttribute(
          "aria-label",
          "Mural segmen Harbour Bay, Nagoya, Jodoh. Tombol panah menggeser, plus dan minus memperbesar. Semua titik juga ada di daftar di bawah gambar.",
        );

        v.addHandler("open", () => {
          if (batal) return;
          setKeadaan("siap");
          // Tautan ?spot=: gambar langsung menunjuk titiknya.
          const h = terbaru.current.fokusAwal && meta.titik.find((t) => t.id === terbaru.current.fokusAwal);
          if (h) v.viewport.panTo(v.viewport.imageToViewportCoordinates(new O.Point(h.x, h.y)), true);
          atur();
          gambarRef.current();
        });
        v.addHandler("open-failed", () => setKeadaan("gagal"));
        v.addHandler("update-viewport", () => {
          el.dataset.zoom = v.viewport.getZoom(true).toFixed(3);
          if (!jalan) gambar(performance.now());
        });
        const pelacak = new O.MouseTracker({
          element: v.canvas,
          moveHandler: (e) => {
            const m = metaRef.current;
            const pos = (e as unknown as { position?: OpenSeadragon.Point }).position;
            if (!m || !pos) return;
            const p = v.viewport.viewerElementToImageCoordinates(pos);
            const s = v.viewport.imageToViewerElementCoordinates(new O.Point(1, 0)).x;
            const nol = v.viewport.imageToViewerElementCoordinates(new O.Point(0, 0)).x;
            v.canvas.style.cursor = cariHotspot([p.x, p.y], m.titik, 22 / (s - nol)) ? "pointer" : "";
          },
        });
        bersih.push(() => pelacak.destroy());
        v.addHandler("canvas-click", (e) => {
          const ev = e as OpenSeadragon.CanvasClickEvent;
          if (!ev.quick) return;
          const m = metaRef.current;
          if (!m) return;
          const p = v.viewport.viewerElementToImageCoordinates(ev.position!);
          const a = v.viewport.imageToViewerElementCoordinates(new O.Point(0, 0));
          const b = v.viewport.imageToViewerElementCoordinates(new O.Point(m.lebar, 0));
          const skala = (b.x - a.x) / m.lebar;
          const kena = cariHotspot([p.x, p.y], m.titik, 22 / skala);
          if (kena) {
            ev.preventDefaultAction = true;
            pilihRef.current(kena.id);
          }
        });
      } catch {
        if (!batal) setKeadaan("gagal");
      }
    })();

    return () => {
      batal = true;
      bersih.forEach((f) => f());
      viewer?.destroy();
      viewerRef.current = null;
    };
  }, [dasar]);

  // Perubahan data, fase, atau mode gerak: gambar ulang, dan hidupkan atau matikan loop.
  useEffect(() => {
    gambarRef.current();
  }, [props.hujan, props.ombak, props.fase, props.sorot, props.tenang]);

  // Tombol gerak berlaku langsung: pegas zoom dan geser ikut berhenti.
  useEffect(() => {
    aturPegas(viewerRef.current, props.tenang ? 0 : WAKTU_ANIMASI);
  }, [props.tenang]);

  return (
    <div ref={wadah} className="mural-penampil" data-keadaan={keadaan}>
      <div data-osd className="mural-osd" />
      <div className="mural-cahaya" data-fase={props.fase} aria-hidden="true" />
      <canvas ref={kanvas} className="mural-overlay" aria-hidden="true" />
      {keadaan === "muat" && (
        <p className="mural-pesan" role="status">
          Itik sedang berbaris…
        </p>
      )}
      {keadaan === "gagal" && (
        <p className="mural-pesan" role="alert">
          Mural gagal dimuat. Laut masih ada, kami saja yang belum. Daftar tempat di bawah tetap bisa dibuka.
        </p>
      )}
    </div>
  );
}
