"use client";

import type OpenSeadragon from "openseadragon";
import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import {
  aturZoomTempat,
  cariTempat,
  type DataTempat,
  formatRating,
  gabungData,
  type Kanvas,
  type Kategori,
  muatTempat,
  type Penanda,
  pasangKanvas,
  pasangPenanda,
  type Tempat,
  tautanGoogle,
  warnaKategori,
} from "@/components/site/lapisanTempat";
import { PETA_SAMPUL } from "@/lib/peta-sampul";

// Peta isometrik interaktif di sampul beranda (purwarupa 9 Nov 2026, contoh dari pemilik: yadongxie.com/lab/san-francisco).
// - Layar dengan tetikus: peta di sampul langsung bisa digeser; gulir biasa tetap menggulir halaman, Ctrl/Cmd+gulir
//   memperbesar (mode kooperatif OpenSeadragon 6, seperti peta Google di dalam halaman).
// - Layar sentuh: sampul tetap gambar biasa supaya hemat kuota; peta baru dimuat saat Jelajahi Peta ditekan.
// - Jelajahi Peta: layar penuh dengan peta kecil di pojok; posisi disimpan di alamat (#x,y,zoom) supaya bisa dibagikan.
// Gambar sampul (<img> di SampulBeranda) tetap tampil sampai ubin peta selesai digambar.

// Peta Barelang dari Cloudflare Pages (lib/peta-sampul.ts). Env NEXT_PUBLIC_SAMPUL_* menimpa tiap nilai untuk uji lokal,
// mis. ubin versi baru dari server lokal barelang-iso http://127.0.0.1:8765/<versi>/barelang.dzi. Ubin dari asal lain
// dimuat dengan CORS.
const DZI = process.env.NEXT_PUBLIC_SAMPUL_DZI || PETA_SAMPUL.dzi;
const LINTAS_ASAL = /^https?:\/\//.test(DZI);
const JUDUL = process.env.NEXT_PUBLIC_SAMPUL_JUDUL || PETA_SAMPUL.judul;
const NAMA_PETA = JUDUL;
/**
 * Bingkai sampul di peta besar, dalam piksel gambar "x0,y0,x1,y1" (kosong = seluruh gambar): area gambar sampul
 * (Harbour Bay dan Nagoya), supaya peta muncul tepat di tempat gambarnya.
 */
const BINGKAI = (process.env.NEXT_PUBLIC_SAMPUL_BINGKAI || PETA_SAMPUL.bingkai).split(",").map(Number);
const ADA_BINGKAI =
  BINGKAI.length === 4 && BINGKAI.every(Number.isFinite) && BINGKAI[2] > BINGKAI[0] && BINGKAI[3] > BINGKAI[1];
/** Warna laut peta: latar di luar tepi gambar saat Jelajahi diperkecil penuh, supaya laut tidak berhenti di tepi persegi. */
const LATAR = process.env.NEXT_PUBLIC_SAMPUL_LATAR || PETA_SAMPUL.latar;
/** Lapisan tempat di Jelajahi (direktori Google Maps pemilik). */
const POI = process.env.NEXT_PUBLIC_SAMPUL_POI || PETA_SAMPUL.poi;
/** Lapisan data kota (kecamatan, perumahan, rusunawa, taman, Kebun Raya, waduk, puncak bukit, kawasan industri, mode malam). */
const KOTA = process.env.NEXT_PUBLIC_SAMPUL_KOTA || PETA_SAMPUL.kota;
/** Sama dengan object-position gambar sampul (50% 50%), supaya peta muncul tepat di tempat gambarnya. */
const POSISI_X = 0.5;
const POSISI_Y = 0.5;
const POLA_HASH = /^#(\d+),(\d+),(\d*\.?\d+)$/;

type Keadaan = "diam" | "muat" | "siap" | "gagal";

/** Bintang rekomendasi sebagai SVG, bukan karakter bintang (cek bahasa melarang emoji di teks). */
const Bintang = () => (
  <svg className="bch-bintang" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M8 1.2l2.1 4.3 4.7.7-3.4 3.3.8 4.7L8 12l-4.2 2.2.8-4.7L1.2 6.2l4.7-.7z" />
  </svg>
);
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
  const [dataTempat, setDataTempat] = useState<DataTempat | null>(null);
  const [tempatPilih, setTempatPilih] = useState<Tempat | null>(null);
  const [sembunyi, setSembunyi] = useState<Kategori[]>([]);
  const [hanyaRek, setHanyaRek] = useState(false);
  const [cari, setCari] = useState("");
  /** Panel saringan lapisan; tertutup saat dibuka supaya peta tidak tertutup deretan tombol (pemilik 11 Nov 2026). */
  const [panel, setPanel] = useState(false);
  const penanda = useRef<Penanda | null>(null);
  const kanvas = useRef<Kanvas | null>(null);
  const sembunyiRef = useRef<Kategori[]>([]);

  /**
   * Bingkai seperti object-fit: contain di tengah (atas seluruh gambar, atau BINGKAI bila diisi): Batam, Rempang, dan
   * Galang selalu tampil utuh, di laptop maupun HP tegak; sisanya laut (pemilik 11 Nov 2026).
   */
  const bingkaiSampul = useCallback(() => {
    const v = viewerRef.current;
    const O = osdRef.current;
    const el = wadah.current;
    if (!v || !O || !el) return null;
    const ukuran = v.world.getItemAt(0)?.getContentSize();
    if (!ukuran) return null;
    // Koordinat viewport OpenSeadragon: lebar gambar = 1.
    const [x0, y0, x1, y1] = ADA_BINGKAI ? BINGKAI : [0, 0, ukuran.x, ukuran.y];
    const bx = x0 / ukuran.x;
    const by = y0 / ukuran.x;
    const bw = (x1 - x0) / ukuran.x;
    const bh = (y1 - y0) / ukuran.x;
    const rasio = el.clientHeight / Math.max(1, el.clientWidth);
    if (rasio < bh / bw) {
      const lebar = bh / rasio;
      return new O.Rect(bx + (bw - lebar) * POSISI_X, by, lebar, bh);
    }
    const tinggi = rasio * bw;
    return new O.Rect(bx, by + (bh - tinggi) * POSISI_Y, bw, tinggi);
  }, []);

  const tulisHash = useCallback(() => {
    const v = viewerRef.current;
    const O = osdRef.current;
    // Sebelum gambar terbuka koordinatnya belum ada (dulu menulis "#1,1,516" yang membuka peta kosong bila dimuat ulang).
    if (!v || !O || !jelajahRef.current || !v.world.getItemCount()) return;
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
      // HP (layar sentuh): drawer WebGL dengan resolusi layar penuh (DPR 2-3) patah-patah dan mengunduh ubin terlalu
      // tajam. Diukur di HP tiruan (CPU 4x lebih lambat): WebGL ±5 bingkai/detik dan 12 MB, canvas dengan kepadatan
      // piksel 1,5 ±60 bingkai/detik dan 8 MB untuk tampilan jalan yang sama (pemilik 11 Nov 2026: "berat kali di hape").
      const hp = !pakaiTetikus();
      // pixelDensityRatio dibaca drawer saat mengukur kanvas; di tipe OpenSeadragon tertulis hanya-baca.
      if (hp) (O as unknown as { pixelDensityRatio: number }).pixelDensityRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      const v = O({
        element: wadah.current,
        tileSources: DZI,
        ...(hp ? { drawer: "canvas" } : {}),
        // Drawer WebGL menolak gambar lintas asal tanpa CORS.
        ...(LINTAS_ASAL ? { crossOriginPolicy: "Anonymous" as const } : {}),
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
        if (wadah.current) aturZoomTempat(wadah.current, v.viewport.viewportToImageZoom(v.viewport.getZoom(true)));
        if (jelajahRef.current) tulisHash();
        const sumber = [POI, KOTA].filter((u): u is string => Boolean(u));
        if (sumber.length && !penanda.current) {
          void Promise.all(sumber.map((u) => muatTempat(u).catch(() => null))).then((hasil) => {
            const d = gabungData(hasil.filter((x): x is DataTempat => x !== null));
            if (!d || viewerRef.current !== v) return;
            // Yang mati saat dibuka (bawaan_sembunyi di data): rumah sakit, spa, darurat, dan semua data kota.
            sembunyiRef.current = d.bawaanSembunyi;
            penanda.current = pasangPenanda(O, v, d, setTempatPilih);
            kanvas.current = pasangKanvas(O, v, d, () => sembunyiRef.current, setTempatPilih);
            setSembunyi(d.bawaanSembunyi);
            setDataTempat(d);
          });
        }
      });
      v.addHandler("open-failed", () => setKeadaan("gagal"));
      // Pixel art: tajam saat diperbesar, halus saat diperkecil supaya tidak bergerigi.
      v.addHandler("zoom", () => {
        const z = v.viewport.viewportToImageZoom(v.viewport.getZoom(true));
        v.drawer.setImageSmoothingEnabled(z < 1);
        if (wadah.current) aturZoomTempat(wadah.current, z);
      });
      // Event "zoom" hanya sekali di awal animasi (mis. tombol +/-): tingkat penanda diperbarui tiap bingkai juga.
      v.addHandler("update-viewport", () => {
        if (wadah.current) aturZoomTempat(wadah.current, v.viewport.viewportToImageZoom(v.viewport.getZoom(true)));
      });
      v.addHandler("animation-finish", tulisHash);
      // label yang bertumpuk disembunyikan setelah peta berhenti bergerak (bukan tiap bingkai)
      v.addHandler("animation-finish", () => penanda.current?.rapikanLabel());
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
    setTempatPilih(null);
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
      penanda.current?.hapus();
      penanda.current = null;
      kanvas.current?.hapus();
      kanvas.current = null;
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

  // Saringan kategori: kelas di penanda yang sudah ada, tanpa membuat ulang overlay.
  useEffect(() => {
    sembunyiRef.current = sembunyi;
    penanda.current?.saring(sembunyi, hanyaRek);
    kanvas.current?.gambar();
    requestAnimationFrame(() => penanda.current?.rapikanLabel());
  }, [sembunyi, hanyaRek, dataTempat]);

  /** Hasil cari dipilih: kategorinya dinyalakan, peta terbang ke tempat itu, kartu info dibuka. */
  const pilihHasil = (t: Tempat) => {
    const v = viewerRef.current;
    const O = osdRef.current;
    setSembunyi((s) => s.filter((k) => k !== t.kategori));
    setTempatPilih(t);
    setCari("");
    if (!v || !O) return;
    v.viewport.panTo(v.viewport.imageToViewportCoordinates(new O.Point(t.x, t.y)), tenang());
    v.viewport.zoomTo(v.viewport.imageToViewportZoom(0.45), undefined, tenang());
  };
  const hasilCari = dataTempat ? cariTempat(dataTempat, cari) : [];

  const alihKategori = (k: Kategori) => {
    setSembunyi((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
    if (tempatPilih?.kategori === k) setTempatPilih(null);
  };

  // "Hapus semua" mematikan semua lapisan (tempat dan data kota) supaya pengunjung bisa memilih hanya yang ia mau;
  // bila semuanya sudah mati, tombol yang sama menjadi "Atur ulang" ke pilihan awal (permintaan pemilik 11 Nov 2026).
  const adaYangMenyala =
    !!dataTempat && (Object.keys(dataTempat.kategori) as Kategori[]).some((k) => !sembunyi.includes(k));
  const jumlahMenyala = dataTempat
    ? (Object.keys(dataTempat.kategori) as Kategori[]).filter((k) => !sembunyi.includes(k)).length
    : 0;
  const hapusSemua = () => {
    if (!dataTempat) return;
    setSembunyi(Object.keys(dataTempat.kategori) as Kategori[]);
    setHanyaRek(false);
    setTempatPilih(null);
  };
  const aturUlang = () => {
    if (!dataTempat) return;
    setSembunyi(dataTempat.bawaanSembunyi);
    setHanyaRek(false);
  };

  const zoom = (faktor: number) => {
    const v = viewerRef.current;
    if (!v) return;
    v.viewport.zoomBy(faktor, undefined, tenang());
    v.viewport.applyConstraints(tenang());
  };

  return (
    <div
      className="bch-peta-sampul"
      style={LATAR ? ({ "--bch-peta-laut": LATAR } as CSSProperties) : undefined}
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
            ? `Peta isometrik ${NAMA_PETA}. Seret untuk menggeser, tombol panah dan plus minus untuk menjelajah.`
            : undefined
        }
      />
      {jelajah && (
        <div className="bch-peta-jelajah-atas">
          <div className="bch-peta-jelajah-kiri">
            <p className="bch-peta-jelajah-judul">{JUDUL}</p>
            {dataTempat && (
              <div className="bch-poi-alat">
                <div className="bch-poi-cari" role="search">
                  <input
                    type="search"
                    className="bch-poi-cari-isian"
                    placeholder="Cari tempat"
                    aria-label="Cari tempat di peta"
                    value={cari}
                    onChange={(e) => setCari(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && hasilCari[0]) pilihHasil(hasilCari[0]);
                      if (e.key === "Escape") setCari("");
                    }}
                  />
                  {hasilCari.length > 0 && (
                    <ul className="bch-poi-cari-hasil" aria-label="Hasil pencarian">
                      {hasilCari.map((t) => (
                        <li key={`${t.kategori}-${t.nama}-${t.x}`}>
                          <button type="button" onClick={() => pilihHasil(t)}>
                            <span
                              className="bch-poi-titik"
                              aria-hidden="true"
                              style={{ "--poi-warna": warnaKategori(t.kategori) } as CSSProperties}
                            />
                            <span className="bch-poi-cari-nama">{t.nama}</span>
                            <span className="bch-poi-cari-jenis">{dataTempat.kategori[t.kategori]}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <button
                  type="button"
                  className="bch-poi-hapus bch-poi-lapisan"
                  aria-expanded={panel}
                  aria-controls="bch-poi-panel"
                  onClick={() => setPanel((v) => !v)}
                >
                  <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
                    <path d="M8 2 1.8 5.2 8 8.4l6.2-3.2zM1.8 8 8 11.2 14.2 8M1.8 10.8 8 14l6.2-3.2" />
                  </svg>
                  Lapisan
                  <span className="bch-poi-jumlah">
                    {jumlahMenyala}
                  </span>
                </button>
              </div>
            )}
            {dataTempat && (
              <div id="bch-poi-panel" className="bch-poi-panel" hidden={!panel}>
                <div className="bch-poi-panel-atas">
                  <p className="bch-poi-panel-judul">Tampilkan di Peta</p>
                  <button
                    type="button"
                    className="bch-poi-hapus"
                    onClick={adaYangMenyala ? hapusSemua : aturUlang}
                    title={adaYangMenyala ? "Matikan semua lapisan tempat dan data kota" : "Kembalikan pilihan awal"}
                  >
                    {adaYangMenyala ? (
                      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                        <path d="M4 4l8 8M12 4l-8 8" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                        <path d="M3.2 9.2A5 5 0 1 0 4.6 4.4M3.4 1.8v3h3" />
                      </svg>
                    )}
                    {adaYangMenyala ? "Hapus Semua" : "Atur Ulang"}
                  </button>
                </div>
                {(["tempat", "kota"] as const).map((grup) => {
                  const ks = (Object.keys(dataTempat.kategori) as Kategori[]).filter(
                    (k) => dataTempat.grup[k] === grup,
                  );
                  if (!ks.length) return null;
                  const judul = grup === "tempat" ? "Tempat" : "Data Kota";
                  return (
                    <div key={grup} className="bch-poi-saring" role="group" aria-label={`${judul} di peta`}>
                      <span className="bch-poi-grup">{judul}</span>
                      {grup === "tempat" && dataTempat.tempat.some((x) => x.rekomendasi) && (
                        <button
                          type="button"
                          className="bch-poi-chip bch-poi-chip-rek"
                          aria-pressed={hanyaRek}
                          onClick={() => setHanyaRek((v) => !v)}
                          title="Hanya tempat dengan rating dan jumlah ulasan tinggi"
                        >
                          <span className="bch-poi-chip-bintang" aria-hidden="true">
                            <Bintang />
                          </span>
                          Rekomendasi Saja
                        </button>
                      )}
                      {ks.map((k) => (
                        <button
                          key={k}
                          type="button"
                          className="bch-poi-chip"
                          data-k={k}
                          aria-pressed={!sembunyi.includes(k)}
                          onClick={() => alihKategori(k)}
                          style={{ "--poi-warna": warnaKategori(k) } as CSSProperties}
                        >
                          <span className="bch-poi-titik" aria-hidden="true" />
                          {dataTempat.kategori[k]}
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {/* Kotak putih seperti nama peta dan tombol lain di atas peta isometrik (penyelarasan 12 Nov 2026). */}
          <button ref={tombolTutup} type="button" className="bch-peta-jelajahi bch-peta-tutup" onClick={tutup}>
            <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
              <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
            </svg>
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
      {jelajah && tempatPilih && dataTempat && (
        <div className="bch-poi-kartu" role="status">
          <p
            className="bch-poi-kartu-jenis"
            style={{ "--poi-warna": warnaKategori(tempatPilih.kategori) } as CSSProperties}
          >
            {dataTempat.kategori[tempatPilih.kategori]}
          </p>
          <p className="bch-poi-kartu-nama">{tempatPilih.nama}</p>
          {tempatPilih.rekomendasi && (
            <p className="bch-poi-kartu-rek">
              <Bintang />
              Rekomendasi
            </p>
          )}
          {tempatPilih.info ? (
            tempatPilih.info.split("\n").map((baris) => (
              <p key={baris} className="bch-poi-kartu-rating">
                {baris}
              </p>
            ))
          ) : (
            <p className="bch-poi-kartu-rating">
              {tempatPilih.ulasan > 0 ? (
                <>
                  <Bintang />
                  {formatRating(tempatPilih)} di Google
                </>
              ) : (
                "Belum ada ulasan di Google"
              )}
            </p>
          )}
          {tempatPilih.sumber && <p className="bch-poi-kartu-sumber">Data dari {tempatPilih.sumber}</p>}
          <a
            className="bch-poi-kartu-tautan"
            href={tautanGoogle(tempatPilih)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Buka di Google Maps
          </a>
          <button
            type="button"
            className="bch-poi-kartu-tutup"
            aria-label="Tutup info tempat"
            onClick={() => setTempatPilih(null)}
          >
            ×
          </button>
        </div>
      )}
      {/* Hanya atribusi OpenStreetMap (wajib, ODbL) di pojok kanan bawah seperti peta lain (pemilik 11 Nov 2026:
          "openstreetmap aja"). Keterangan AI dan sumber lapisan ada di Kolofon. */}
      {jelajah && <p className="bch-peta-atribusi">© OpenStreetMap</p>}
      {jelajah && keadaan === "gagal" && <p className="bch-peta-gagal">Peta belum dapat dimuat.</p>}
    </div>
  );
}
