import type OpenSeadragon from "openseadragon";
import { kaidahJudul } from "@/lib/judul";

// Lapisan di atas peta Jelajahi (uji lokal, 10 Nov 2026), semuanya bisa dinyalakan/dimatikan pengunjung:
// - Tempat (NEXT_PUBLIC_SAMPUL_POI): hotel, mal & pasar, wisata, oleh-oleh, pelabuhan, money changer, seafood, ibadah,
//   golf, kampung tua, rumah sakit, spa & pijat, darurat (direktori Google milik pemilik).
// - Data kota (NEXT_PUBLIC_SAMPUL_KOTA): kecamatan, perumahan, rusunawa, taman, zona Kebun Raya, waduk, puncak bukit,
//   kawasan industri, mode malam (lampu jalan) dari HANG JEBAT, BP Batam, Satu Data Batam, dan OSM.
// JSON dibuat proyek barelang-iso (pipeline/tiles/poi_wisata.py, lapisan_kota.py) dan disajikan server ubin lokal;
// tidak ada di repo ini. Penanda = overlay OpenSeadragon yang dibuat sekali; garis batas dan cahaya lampu digambar di
// satu kanvas yang mengikuti viewport. Tidak ada render ulang React per bingkai.

export type Kategori = string;

export type Tempat = {
  x: number;
  y: number;
  kategori: Kategori;
  tingkat: number;
  nama: string;
  rating: number;
  ulasan: number;
  lat: number;
  lng: number;
  /** Keterangan dari data kota (baris dipisah \n); kosong untuk tempat dari Google. */
  info?: string;
  sumber?: string;
  /** Lolos aturan rekomendasi pemilik situs (rating dan jumlah ulasan per kategori). */
  rekomendasi?: boolean;
  /** Place ID Google (ChIJ...) dari direktori; kosong untuk data kota dan tempat dari OSM. */
  pid?: string;
};

/** [kotak batas, titik, nama] dalam piksel gambar; nama dipakai label saat kursor di dalam batas. */
type Poligon = [[number, number, number, number], [number, number][], string?];

export type DataTempat = {
  sumber: string[];
  kategori: Record<Kategori, string>;
  grup: Record<Kategori, "tempat" | "kota">;
  bawaanSembunyi: Kategori[];
  tempat: Tempat[];
  poligon: Record<Kategori, Poligon[]>;
  pju: [number, number][];
};

type Mentah = {
  sumber: string;
  kategori: Record<Kategori, string>;
  grup?: "tempat" | "kota";
  bawaan_sembunyi?: Kategori[];
  poi: (string | number)[][];
  poligon?: Record<Kategori, Poligon[]>;
  pju?: [number, number][];
};

/** Warna per kategori (kategori baru tanpa warna memakai abu). */
const WARNA: Record<string, string> = {
  hotel: "#2563eb",
  mal: "#ea580c",
  wisata: "#16a34a",
  oleh: "#c026d3",
  transport: "#0891b2",
  uang: "#ca8a04",
  seafood: "#e11d48",
  ibadah: "#0f766e",
  golf: "#84cc16",
  kampung: "#92400e",
  rs: "#7c3aed",
  spa: "#f472b6",
  darurat: "#111827",
  kuliner: "#b91c1c",
  belanja: "#7e22ce",
  olahraga: "#0284c7",
  kecamatan: "#334155",
  perumahan: "#b45309",
  rusun: "#9333ea",
  taman: "#15803d",
  kebunraya: "#4d7c0f",
  waduk: "#0369a1",
  puncak: "#78350f",
  industri: "#475569",
  malam: "#f59e0b",
};
export const warnaKategori = (k: Kategori) => WARNA[k] ?? "#6b7280";

export async function muatTempat(url: string): Promise<DataTempat> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`data peta ${r.status}`);
  const d = (await r.json()) as Mentah;
  const g = d.grup ?? "tempat";
  return {
    sumber: [d.sumber],
    // Nama kategori tampil sebagai label saringan, jadi Title Case (PEDOMAN koreksi 4): "Mal & pasar" jadi "Mal & Pasar".
    kategori: Object.fromEntries(Object.entries(d.kategori).map(([k, v]) => [k, kaidahJudul(v)])),
    grup: Object.fromEntries(Object.keys(d.kategori).map((k) => [k, g])),
    bawaanSembunyi: d.bawaan_sembunyi ?? [],
    tempat: d.poi.map((p) => ({
      x: Number(p[0]),
      y: Number(p[1]),
      kategori: String(p[2]),
      tingkat: Number(p[3]),
      nama: String(p[4]),
      rating: Number(p[5]),
      ulasan: Number(p[6]),
      lat: Number(p[7]),
      lng: Number(p[8]),
      info: p[9] ? String(p[9]) : undefined,
      sumber: p[10] ? String(p[10]) : undefined,
      rekomendasi: Number(p[11] ?? 0) === 1,
      pid: p[12] ? String(p[12]) : undefined,
    })),
    poligon: d.poligon ?? {},
    pju: d.pju ?? [],
  };
}

/** Gabungan beberapa berkas data (tempat + data kota). */
export function gabungData(daftar: DataTempat[]): DataTempat | null {
  if (!daftar.length) return null;
  return daftar.reduce((a, b) => ({
    sumber: [...a.sumber, ...b.sumber],
    kategori: { ...a.kategori, ...b.kategori },
    grup: { ...a.grup, ...b.grup },
    bawaanSembunyi: [...a.bawaanSembunyi, ...b.bawaanSembunyi],
    tempat: [...a.tempat, ...b.tempat],
    poligon: { ...a.poligon, ...b.poligon },
    pju: [...a.pju, ...b.pju],
  }));
}

const angka = new Intl.NumberFormat("id-ID");
const desimal = new Intl.NumberFormat("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export const formatRating = (t: Tempat) =>
  t.ulasan > 0 && t.rating > 0 ? `${desimal.format(t.rating)} · ${angka.format(t.ulasan)} ulasan` : "belum ada ulasan";

export type Penanda = {
  hapus: () => void;
  /** hanyaRek: hanya tempat rekomendasi yang tampil (data kota tidak terpengaruh). */
  saring: (sembunyi: Kategori[], hanyaRek?: boolean) => void;
  /** Sembunyikan label yang bertumpuk dengan label yang lebih penting (tingkat lebih kecil, ulasan lebih banyak). */
  rapikanLabel: () => void;
};

/**
 * Penanda sebagai overlay. Mengembalikan pembersih dan penyaring kategori.
 *
 * Hanya penanda yang bisa terlihat (kategorinya menyala, tingkatnya cocok dengan zoom, dan berada di sekitar layar)
 * yang dipasang ke OpenSeadragon; sisanya dilepas. OpenSeadragon menghitung ulang posisi setiap overlay di setiap
 * bingkai, jadi 2.263 penanda yang terpasang semua membuat peta patah-patah di HP (diukur di HP tiruan dengan CPU 4x
 * lebih lambat: ±12 bingkai/detik; tanpa penanda ±60). Daftar dipasang ulang saat peta berhenti bergerak dan saat
 * saringan berubah (pemilik 11 Nov 2026: "berat kali di hape").
 */
export function pasangPenanda(
  O: typeof OpenSeadragon,
  v: OpenSeadragon.Viewer,
  data: DataTempat,
  pilih: (t: Tempat) => void,
): Penanda {
  const pelacak: OpenSeadragon.MouseTracker[] = [];
  const elemen: HTMLElement[] = [];
  const prioritas = new Map<HTMLElement, number>();
  // Yang paling ramai digambar paling atas (z-index menurut urutan ini); data kota di bawah tempat.
  const urut = [...data.tempat]
    .filter((t) => t.kategori !== "malam")
    .sort(
      (a, b) =>
        Number(data.grup[a.kategori] === "tempat") - Number(data.grup[b.kategori] === "tempat") ||
        b.tingkat - a.tingkat,
    );
  type Isi = {
    t: Tempat;
    urutan: number;
    el: HTMLElement | null;
    lokasi: OpenSeadragon.Point;
    mati: boolean;
    pasang: boolean;
  };
  const isi: Isi[] = urut.map((t, urutan) => ({
    t,
    urutan,
    el: null,
    lokasi: v.viewport.imageToViewportCoordinates(new O.Point(t.x, t.y)),
    mati: false,
    pasang: false,
  }));
  /** Tombol penanda dibuat saat pertama kali perlu tampil, bukan 2.263 sekaligus saat peta dibuka. */
  const buat = (p: Isi) => {
    const { t } = p;
    const el = document.createElement("button");
    el.type = "button";
    el.className = "bch-poi";
    el.dataset.k = t.kategori;
    el.dataset.t = String(t.tingkat);
    if (data.grup[t.kategori] === "kota") el.dataset.grup = "kota";
    if (t.rekomendasi) el.dataset.rek = "1";
    el.style.setProperty("--poi-warna", warnaKategori(t.kategori));
    el.style.zIndex = String(p.urutan + 1);
    const ulasan = t.ulasan > 0 ? `, rating ${formatRating(t)}` : "";
    const rek = t.rekomendasi ? ", rekomendasi" : "";
    el.setAttribute("aria-label", `${t.nama}, ${data.kategori[t.kategori] ?? t.kategori}${ulasan}${rek}`);
    const titik = document.createElement("span");
    titik.className = "bch-poi-titik";
    titik.setAttribute("aria-hidden", "true");
    const nama = document.createElement("span");
    nama.className = "bch-poi-nama";
    nama.textContent = t.nama;
    el.append(titik, nama);
    // MouseTracker: klik di penanda tidak dianggap seret peta oleh OpenSeadragon.
    pelacak.push(new O.MouseTracker({ element: el, clickHandler: () => pilih(t) }));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        pilih(t);
      }
    });
    elemen.push(el);
    prioritas.set(el, t.tingkat * 1e7 - Math.min(t.ulasan, 9e6));
    p.el = el;
    return el;
  };
  const rapikanLabel = () => {
    for (const el of elemen) el.classList.remove("bch-poi-tabrak");
    const tampil: { el: HTMLElement; r: DOMRect }[] = [];
    for (const el of elemen) {
      if (el.offsetParent === null) continue;
      const nama = el.querySelector<HTMLElement>(".bch-poi-nama");
      if (!nama || getComputedStyle(nama).display === "none") continue;
      tampil.push({ el, r: nama.getBoundingClientRect() });
    }
    tampil.sort((a, b) => (prioritas.get(a.el) ?? 0) - (prioritas.get(b.el) ?? 0));
    const dipakai: DOMRect[] = [];
    for (const { el, r } of tampil) {
      const tabrak = dipakai.some(
        (q) => r.left < q.right + 4 && q.left < r.right + 4 && r.top < q.bottom + 2 && q.top < r.bottom + 2,
      );
      if (tabrak) el.classList.add("bch-poi-tabrak");
      else dipakai.push(r);
    }
  };
  /** Pasang penanda yang bisa terlihat, lepas yang tidak. Tingkat mengikuti data-poi-t dari aturZoomTempat. */
  const sinkron = () => {
    const tMaks = Number((v.element as HTMLElement).dataset.poiT ?? "3");
    const b = v.viewport.getBounds(true);
    // Separuh layar di tiap sisi supaya penanda sudah ada saat peta digeser.
    const x0 = b.x - b.width / 2;
    const x1 = b.x + b.width * 1.5;
    const y0 = b.y - b.height / 2;
    const y1 = b.y + b.height * 1.5;
    let berubah = false;
    for (const p of isi) {
      const { x, y } = p.lokasi;
      const tampil = !p.mati && p.t.tingkat <= tMaks && x >= x0 && x <= x1 && y >= y0 && y <= y1;
      if (tampil === p.pasang) continue;
      if (tampil) {
        const el = p.el ?? buat(p);
        v.addOverlay({ element: el, location: p.lokasi, placement: O.Placement.CENTER, checkResize: false });
      } else if (p.el) v.removeOverlay(p.el);
      p.pasang = tampil;
      berubah = true;
    }
    // Penanda baru diberi posisi pada bingkai berikutnya; label dirapikan sesudahnya.
    if (berubah) requestAnimationFrame(() => requestAnimationFrame(rapikanLabel));
  };
  v.addHandler("animation-finish", sinkron);
  v.addHandler("resize", sinkron);
  sinkron();
  return {
    hapus: () => {
      v.removeHandler("animation-finish", sinkron);
      v.removeHandler("resize", sinkron);
      pelacak.forEach((p) => p.destroy());
      for (const p of isi) if (p.pasang && p.el) v.removeOverlay(p.el);
    },
    saring: (sembunyi, hanyaRek = false) => {
      const s = new Set(sembunyi);
      for (const p of isi) {
        const bukanRek = hanyaRek && data.grup[p.t.kategori] !== "kota" && !p.t.rekomendasi;
        p.mati = s.has(p.t.kategori) || bukanRek;
        p.el?.classList.toggle("bch-poi-mati", p.mati);
      }
      sinkron();
    },
    rapikanLabel,
  };
}

export type Kanvas = { gambar: () => void; hapus: () => void };

/** Urutan cek saat kursor di atas peta: yang lebih kecil/rinci dulu. */
const URUT_SOROT = ["perumahan", "taman", "kebunraya", "industri", "kecamatan"];

function dalamPoligon(x: number, y: number, titik: [number, number][]) {
  let dalam = false;
  for (let i = 0, j = titik.length - 1; i < titik.length; j = i++) {
    const [xi, yi] = titik[i];
    const [xj, yj] = titik[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) dalam = !dalam;
  }
  return dalam;
}

/**
 * Garis batas (kecamatan, perumahan, taman, Kebun Raya, kawasan industri) dan cahaya lampu jalan (mode malam) di satu
 * kanvas di atas gambar peta dan di bawah penanda. Mode malam juga meredupkan gambar peta (filter di kanvas OpenSeadragon).
 */
export function pasangKanvas(
  O: typeof OpenSeadragon,
  v: OpenSeadragon.Viewer,
  data: DataTempat,
  sembunyiSekarang: () => Kategori[],
  pilih: (t: Tempat) => void,
): Kanvas {
  const kanvas = document.createElement("canvas");
  kanvas.className = "bch-peta-kanvas";
  kanvas.setAttribute("aria-hidden", "true");
  const induk = v.canvas as HTMLElement;
  const drawerKanvas = (v.drawer as unknown as { canvas?: HTMLElement }).canvas;
  if (drawerKanvas?.parentElement === induk) induk.insertBefore(kanvas, drawerKanvas.nextSibling);
  else induk.prepend(kanvas);
  const ctx = kanvas.getContext("2d");
  // Label saat kursor di dalam batas (perumahan, taman, Kebun Raya, kawasan industri, kecamatan); klik membuka kartu.
  const tip = document.createElement("div");
  tip.className = "bch-peta-tip";
  tip.hidden = true;
  induk.append(tip);
  let trans = { skala: 1, ox: 0, oy: 0, dpr: 1 };
  let sorot: { k: Kategori; p: Poligon } | null = null;
  const GAYA: Record<string, { isi: number; lebar: number; putus?: number[] }> = {
    kecamatan: { isi: 0, lebar: 2.2, putus: [8, 5] },
    perumahan: { isi: 0.1, lebar: 1.2 },
    taman: { isi: 0.14, lebar: 1.2 },
    kebunraya: { isi: 0.16, lebar: 1 },
    industri: { isi: 0.07, lebar: 1.4, putus: [4, 3] },
  };
  const gambar = () => {
    if (!ctx) return;
    const el = induk.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const lebar = Math.round(el.width * dpr);
    const tinggi = Math.round(el.height * dpr);
    if (kanvas.width !== lebar || kanvas.height !== tinggi) {
      kanvas.width = lebar;
      kanvas.height = tinggi;
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, lebar, tinggi);
    const s = new Set(sembunyiSekarang());
    if (sorot && s.has(sorot.k)) sorot = null;
    const malam = !s.has("malam");
    if (drawerKanvas) drawerKanvas.style.filter = malam ? "brightness(0.42) saturate(0.75) hue-rotate(-12deg)" : "";
    const o = v.viewport.imageToViewerElementCoordinates(new O.Point(0, 0));
    const ujung = v.viewport.imageToViewerElementCoordinates(new O.Point(1000, 0));
    const skala = ((ujung.x - o.x) / 1000) * dpr;
    const ox = o.x * dpr;
    const oy = o.y * dpr;
    trans = { skala, ox, oy, dpr };
    // batas tampak dalam piksel gambar, untuk melewati poligon di luar layar
    const bx0 = -ox / skala;
    const by0 = -oy / skala;
    const bx1 = (lebar - ox) / skala;
    const by1 = (tinggi - oy) / skala;
    for (const [k, gaya] of Object.entries(GAYA)) {
      if (s.has(k) || !data.poligon[k]) continue;
      const warna = warnaKategori(k);
      ctx.setTransform(skala, 0, 0, skala, ox, oy);
      ctx.lineWidth = (gaya.lebar * dpr) / skala;
      ctx.setLineDash(gaya.putus ? gaya.putus.map((d) => (d * dpr) / skala) : []);
      ctx.strokeStyle = warna;
      ctx.fillStyle = warna;
      for (const [[x0, y0, x1, y1], titik] of data.poligon[k]) {
        if (x1 < bx0 || x0 > bx1 || y1 < by0 || y0 > by1) continue;
        // terlalu kecil di layar: lewati (hemat saat diperkecil)
        if ((x1 - x0) * skala < 2 && (y1 - y0) * skala < 2) continue;
        ctx.beginPath();
        titik.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        ctx.closePath();
        if (gaya.isi) {
          ctx.globalAlpha = gaya.isi;
          ctx.fill();
        }
        ctx.globalAlpha = 0.9;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    if (sorot) {
      const warna = warnaKategori(sorot.k);
      ctx.setTransform(skala, 0, 0, skala, ox, oy);
      ctx.setLineDash([]);
      ctx.beginPath();
      sorot.p[1].forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.closePath();
      ctx.globalAlpha = sorot.k === "kecamatan" ? 0.08 : 0.28;
      ctx.fillStyle = warna;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.lineWidth = (3 * dpr) / skala;
      ctx.strokeStyle = warna;
      ctx.stroke();
    }
    if (malam && data.pju.length) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.setLineDash([]);
      const r = Math.max(3 * dpr, Math.min(40 * dpr, 14 * skala * 4));
      for (const [x, y] of data.pju) {
        const sx = x * skala + ox;
        const sy = y * skala + oy;
        if (sx < -r || sy < -r || sx > lebar + r || sy > tinggi + r) continue;
        const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, r);
        g.addColorStop(0, "rgba(255, 236, 170, 0.95)");
        g.addColorStop(0.35, "rgba(255, 196, 90, 0.45)");
        g.addColorStop(1, "rgba(255, 170, 60, 0)");
        ctx.fillStyle = g;
        ctx.fillRect(sx - r, sy - r, 2 * r, 2 * r);
      }
    }
  };
  const cari = (sx: number, sy: number) => {
    const s = new Set(sembunyiSekarang());
    const x = (sx * trans.dpr - trans.ox) / trans.skala;
    const y = (sy * trans.dpr - trans.oy) / trans.skala;
    for (const k of URUT_SOROT) {
      if (s.has(k) || !data.poligon[k]) continue;
      for (const p of data.poligon[k]) {
        const [x0, y0, x1, y1] = p[0];
        if (x < x0 || x > x1 || y < y0 || y > y1 || !p[2]) continue;
        if (dalamPoligon(x, y, p[1])) return { k, p };
      }
    }
    return null;
  };
  let tunda = 0;
  const gerak = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const di = induk.getBoundingClientRect();
    const sx = e.clientX - di.left;
    const sy = e.clientY - di.top;
    const diPenanda = (e.target as HTMLElement | null)?.closest?.(".bch-poi");
    cancelAnimationFrame(tunda);
    tunda = requestAnimationFrame(() => {
      const baru = diPenanda ? null : cari(sx, sy);
      if (baru?.p !== sorot?.p) {
        sorot = baru;
        gambar();
      }
      if (!sorot) {
        tip.hidden = true;
        return;
      }
      tip.textContent = sorot.p[2] ?? "";
      tip.dataset.k = data.kategori[sorot.k] ?? sorot.k;
      tip.style.left = `${Math.round(sx + 14)}px`;
      tip.style.top = `${Math.round(sy + 16)}px`;
      tip.hidden = false;
    });
  };
  const keluar = () => {
    cancelAnimationFrame(tunda);
    tip.hidden = true;
    if (sorot) {
      sorot = null;
      gambar();
    }
  };
  // Klik singkat di dalam batas (juga ketukan di layar sentuh) membuka kartu info tempat itu.
  const klik = (e: OpenSeadragon.CanvasClickEvent) => {
    if (!e.quick) return;
    const hit = cari(e.position.x, e.position.y);
    if (!hit) return;
    const t = data.tempat.find((x) => x.kategori === hit.k && x.nama === hit.p[2]);
    if (t) pilih(t);
  };
  induk.addEventListener("pointermove", gerak);
  induk.addEventListener("pointerleave", keluar);
  v.addHandler("canvas-click", klik);
  v.addHandler("update-viewport", gambar);
  v.addHandler("resize", gambar);
  gambar();
  return {
    gambar,
    hapus: () => {
      cancelAnimationFrame(tunda);
      induk.removeEventListener("pointermove", gerak);
      induk.removeEventListener("pointerleave", keluar);
      v.removeHandler("canvas-click", klik);
      v.removeHandler("update-viewport", gambar);
      v.removeHandler("resize", gambar);
      if (drawerKanvas) drawerKanvas.style.filter = "";
      kanvas.remove();
      tip.remove();
    },
  };
}

/** Tingkat terbanyak yang tampil dan mode label menurut zoom gambar (1 = piksel penuh). */
export function aturZoomTempat(wadah: HTMLElement, zoomGambar: number) {
  const z = zoomGambar;
  // Uji di peramban 10 Nov: pada zoom 0,12 tingkat 0-2 (±225 titik) dan label tingkat 0-1 terlalu ramai di Nagoya.
  const t = z < 0.05 ? "0" : z < 0.15 ? "1" : z < 0.4 ? "2" : "3";
  const label = z < 0.08 ? "tidak" : z < 0.25 ? "besar" : z < 0.6 ? "sedang" : "semua";
  // Dipanggil tiap bingkai (update-viewport): tulis hanya bila berubah, supaya ±1.700 penanda tidak dihitung ulang gayanya.
  if (wadah.dataset.poiT !== t) wadah.dataset.poiT = t;
  if (wadah.dataset.poiLabel !== label) wadah.dataset.poiLabel = label;
}

/**
 * Halaman tempat itu di Google Maps. Dengan place ID dari direktori langsung ke halaman tempatnya (tidak tertukar
 * cabang lain); tanpa ID (data kota, lapangan golf dari OSM) dicari dengan namanya di sekitar titiknya. Dulu hanya
 * koordinat, yang membuka pin tanpa nama (keluhan pemilik situs 11 Nov 2026).
 */
export const tautanGoogle = (t: Tempat) =>
  t.pid
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t.nama)}&query_place_id=${encodeURIComponent(t.pid)}`
    : `https://www.google.com/maps/search/${encodeURIComponent(t.nama)}/@${t.lat},${t.lng},17z`;

/** Hasil pencarian nama tempat: awal kata dulu, lalu yang memuat teks; satu entri per nama + kategori. */
export function cariTempat(data: DataTempat, teks: string, maks = 8): Tempat[] {
  const q = teks.trim().toLowerCase();
  if (q.length < 2) return [];
  const lihat = new Set<string>();
  const skor: { t: Tempat; s: number }[] = [];
  for (const t of data.tempat) {
    const nama = t.nama.toLowerCase();
    const i = nama.indexOf(q);
    if (i < 0) continue;
    const kunci = `${t.kategori}|${nama}`;
    if (lihat.has(kunci)) continue;
    lihat.add(kunci);
    const awalKata = i === 0 || /\s|\(|-/.test(nama[i - 1]);
    skor.push({ t, s: (awalKata ? 0 : 1e9) + t.tingkat * 1e7 - Math.min(t.ulasan, 9e6) });
  }
  return skor
    .sort((a, b) => a.s - b.s)
    .slice(0, maks)
    .map((x) => x.t);
}
