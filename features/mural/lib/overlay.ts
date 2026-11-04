// Satu kanvas overlay untuk semua efek (research/02): lampu, hujan, ombak, feri, dan pin. Tanpa React.
import type { RainLevel } from "@/features/langit-laut/lib/kecamatan";
import type { Fase } from "./cahaya";
import type { Hotspot, Posisi, Titik } from "./geom";
import { jumlahPartikel } from "./hujan";
import type { ParameterOmbak } from "./ombak";

export type MetaSegmen = {
  segmen: string;
  placeholder: boolean;
  lebar: number;
  tinggi: number;
  kecamatan: { kode: string; nama: string; cincin: Titik[][] }[];
  rute: { id: string; keterangan: string; titik: Titik[] }[];
  titik: (Hotspot & { nama: string; asli: Titik | null; urutan: number | null })[];
  lampu: Titik[];
};

export type WarnaOverlay = {
  hujan: string;
  hujanMalam: string;
  garisLaut: string;
  busa: string;
  lampu: string;
  feri: string;
  kertas: string;
  tinta: string;
  sorot: string;
};

export type Kapal = Posisi & { id: string };

export type Adegan = {
  meta: MetaSegmen;
  nomorPin: Map<string, number>;
  pinPerkiraan: Set<string>;
  hujan: Record<string, RainLevel> | null;
  ombak: ParameterOmbak | null;
  kapal: Kapal[];
  fase: Fase;
  sorot: string | null;
  tenang: boolean;
  batasPartikel: number;
  warna: WarnaOverlay;
};

/** Gambar ke layar: x layar = ox + x gambar * skala. */
export type Pandangan = { lebar: number; tinggi: number; skala: number; ox: number; oy: number };

const pecahan = (n: number) => n - Math.floor(n);

function jalurCincin(c: CanvasRenderingContext2D, cincin: Titik[][], v: Pandangan) {
  for (const r of cincin) {
    r.forEach(([x, y], i) => {
      const sx = v.ox + x * v.skala;
      const sy = v.oy + y * v.skala;
      if (i) c.lineTo(sx, sy);
      else c.moveTo(sx, sy);
    });
    c.closePath();
  }
}

function kotakLayar(cincin: Titik[][], v: Pandangan) {
  let [x0, y0, x1, y1] = [Infinity, Infinity, -Infinity, -Infinity];
  for (const r of cincin) {
    for (const [x, y] of r) {
      x0 = Math.min(x0, x);
      y0 = Math.min(y0, y);
      x1 = Math.max(x1, x);
      y1 = Math.max(y1, y);
    }
  }
  const kiri = Math.max(0, v.ox + x0 * v.skala);
  const atas = Math.max(0, v.oy + y0 * v.skala);
  const kanan = Math.min(v.lebar, v.ox + x1 * v.skala);
  const bawah = Math.min(v.tinggi, v.oy + y1 * v.skala);
  return kanan > kiri && bawah > atas ? { kiri, atas, l: kanan - kiri, t: bawah - atas } : null;
}

function gambarLampu(c: CanvasRenderingContext2D, a: Adegan, v: Pandangan) {
  if (a.fase === "siang") return;
  c.save();
  c.globalCompositeOperation = "lighter";
  c.globalAlpha = a.fase === "malam" ? 0.95 : 0.55;
  c.fillStyle = a.warna.lampu;
  const r = Math.max(1.2, Math.min(3, 5 * v.skala));
  c.beginPath();
  for (const [x, y] of a.meta.lampu) {
    const sx = v.ox + x * v.skala;
    const sy = v.oy + y * v.skala;
    if (sx < -4 || sy < -4 || sx > v.lebar + 4 || sy > v.tinggi + 4) continue;
    c.moveTo(sx + r, sy);
    c.arc(sx, sy, r, 0, Math.PI * 2);
  }
  c.fill();
  c.restore();
}

const KECEPATAN_HUJAN: Record<RainLevel, number> = { ringan: 180, sedang: 260, lebat: 340 };

function gambarHujan(c: CanvasRenderingContext2D, a: Adegan, v: Pandangan, t: number) {
  if (!a.hujan) return;
  for (const k of a.meta.kecamatan) {
    const level = a.hujan[k.nama];
    if (!level) continue;
    const kotak = kotakLayar(k.cincin, v);
    if (!kotak) continue;
    c.save();
    c.beginPath();
    jalurCincin(c, k.cincin, v);
    c.clip();
    // Multiply tidak terlihat di atas tinta malam, jadi malam memakai garis terang.
    const malam = a.fase === "malam";
    c.globalCompositeOperation = malam ? "source-over" : "multiply";
    c.strokeStyle = malam ? a.warna.hujanMalam : a.warna.hujan;
    c.lineWidth = 1;
    c.beginPath();
    if (a.tenang) {
      // Arsiran diam: wilayah hujan tetap terbaca tanpa gerak.
      const jarak = level === "lebat" ? 10 : level === "sedang" ? 16 : 24;
      for (let d = -kotak.t; d < kotak.l; d += jarak) {
        c.moveTo(kotak.kiri + d, kotak.atas);
        c.lineTo(kotak.kiri + d + kotak.t * 0.3, kotak.atas + kotak.t);
      }
    } else {
      const n = jumlahPartikel(kotak.l * kotak.t, level, a.batasPartikel);
      const laju = KECEPATAN_HUJAN[level];
      for (let i = 0; i < n; i++) {
        const x = kotak.kiri + pecahan(i * 0.618034) * kotak.l;
        const y = kotak.atas + ((pecahan(i * 0.379) * kotak.t + t * laju) % kotak.t);
        c.moveTo(x, y);
        c.lineTo(x + 2.5, y + 9);
      }
    }
    c.stroke();
    c.restore();
  }
}

function gambarOmbak(c: CanvasRenderingContext2D, a: Adegan, v: Pandangan, t: number) {
  // Ombak berhenti total saat gerak tenang. Tingginya tetap tertulis di panel keadaan.
  if (!a.ombak || a.tenang) return;
  const { amplitudo, kecepatan, busa } = a.ombak;
  c.save();
  c.beginPath();
  c.rect(0, 0, v.lebar, v.tinggi);
  for (const k of a.meta.kecamatan) jalurCincin(c, k.cincin, v);
  c.clip("evenodd");
  c.strokeStyle = a.warna.garisLaut;
  c.globalAlpha = 0.7;
  c.lineWidth = 1;
  c.beginPath();
  const baris = 44;
  const kolom = 110;
  for (let j = 0; j * baris < v.tinggi + baris; j++) {
    const y = j * baris + (j % 2) * 8;
    for (let i = -1; i * kolom < v.lebar + kolom; i++) {
      const x = i * kolom + (j % 2) * 40;
      const geser = Math.sin(t * kecepatan * 2 + j + i * 0.7) * (amplitudo + 2);
      const naik = Math.cos(t * kecepatan * 2 + j) * amplitudo;
      c.moveTo(x + geser, y + naik);
      c.quadraticCurveTo(x + geser + 14, y + naik - amplitudo - 2, x + geser + 28, y + naik);
    }
  }
  c.stroke();
  if (busa) {
    c.fillStyle = a.warna.busa;
    c.globalAlpha = 0.9;
    c.beginPath();
    for (let j = 0; j * baris < v.tinggi + baris; j += 2) {
      for (let i = 0; i * kolom < v.lebar + kolom; i += 2) {
        const x = i * kolom + pecahan(i * 0.618 + j * 0.37) * 90 + Math.sin(t * kecepatan + i) * 8;
        const y = j * baris + pecahan(j * 0.618 + i * 0.37) * 34;
        c.moveTo(x + 2.5, y);
        c.arc(x, y, 2.5, 0, Math.PI * 2);
      }
    }
    c.fill();
  }
  c.restore();
}

function gambarFeri(c: CanvasRenderingContext2D, a: Adegan, v: Pandangan) {
  c.save();
  c.strokeStyle = a.warna.feri;
  c.lineWidth = 1.5;
  c.setLineDash([6, 7]);
  c.beginPath();
  for (const r of a.meta.rute) {
    r.titik.forEach(([x, y], i) => {
      if (i) c.lineTo(v.ox + x * v.skala, v.oy + y * v.skala);
      else c.moveTo(v.ox + x * v.skala, v.oy + y * v.skala);
    });
  }
  c.stroke();
  c.setLineDash([]);
  for (const k of a.kapal) {
    const sx = v.ox + k.x * v.skala;
    const sy = v.oy + k.y * v.skala;
    c.save();
    c.translate(sx, sy);
    c.rotate(k.sudut);
    c.fillStyle = a.warna.kertas;
    c.strokeStyle = a.warna.feri;
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(14, 0);
    c.lineTo(5, -6);
    c.lineTo(-12, -6);
    c.lineTo(-12, 6);
    c.lineTo(5, 6);
    c.closePath();
    c.fill();
    c.stroke();
    c.restore();
    c.font = "500 12px system-ui, sans-serif";
    c.textAlign = "left";
    c.lineWidth = 3;
    c.strokeStyle = a.warna.kertas;
    c.strokeText("perkiraan", sx + 16, sy - 8);
    c.fillStyle = a.warna.tinta;
    c.fillText("perkiraan", sx + 16, sy - 8);
  }
  c.restore();
}

function gambarPin(c: CanvasRenderingContext2D, a: Adegan, v: Pandangan, t: number) {
  c.save();
  c.font = "600 13px system-ui, sans-serif";
  c.textAlign = "center";
  c.textBaseline = "middle";
  for (const h of a.meta.titik) {
    const n = a.nomorPin.get(h.id);
    if (!n) continue;
    const sx = v.ox + h.x * v.skala;
    const sy = v.oy + h.y * v.skala;
    if (sx < -30 || sy < -30 || sx > v.lebar + 30 || sy > v.tinggi + 30) continue;
    if (a.sorot === h.id) {
      c.strokeStyle = a.warna.sorot;
      c.lineWidth = 3;
      c.beginPath();
      c.arc(sx, sy, a.tenang ? 22 : 20 + Math.sin(t * 3) * 3, 0, Math.PI * 2);
      c.stroke();
    }
    c.fillStyle = a.warna.kertas;
    c.strokeStyle = a.warna.tinta;
    c.lineWidth = 1.5;
    // Garis putus berarti lokasinya perkiraan. Daftar di bawah gambar menyebutnya dengan kata.
    c.setLineDash(a.pinPerkiraan.has(h.id) ? [3, 3] : []);
    c.beginPath();
    c.arc(sx, sy, 13, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.setLineDash([]);
    c.fillStyle = a.warna.tinta;
    c.fillText(String(n), sx, sy + 0.5);
  }
  c.restore();
}

export function gambarOverlay(c: CanvasRenderingContext2D, a: Adegan, v: Pandangan, t: number) {
  c.clearRect(0, 0, v.lebar, v.tinggi);
  gambarLampu(c, a, v);
  gambarHujan(c, a, v, t);
  gambarOmbak(c, a, v, t);
  gambarFeri(c, a, v);
  gambarPin(c, a, v, t);
}
