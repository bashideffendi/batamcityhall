// Gambar kartu pos di kanvas, warna tetap dari palet siang supaya hasil unduhan sama di dua tema.
import { PALET } from "@/features/peta/style";

export const LATAR = { peta: "Peta laut", hujan: "Hujan", selat: "Selat" } as const;
export type Latar = keyof typeof LATAR;

const c = PALET.light;
const SERIF = '"Newsreader", Georgia, serif';
const SANS = '"Plus Jakarta Sans", system-ui, sans-serif';

/** Pecah teks per kata menurut lebar. Dipisah supaya bisa dites tanpa kanvas. */
export function bungkus(teks: string, lebar: (s: string) => number, maks: number): string[] {
  const baris: string[] = [];
  let kini = "";
  for (const kata of teks.split(/\s+/).filter(Boolean)) {
    const coba = kini ? `${kini} ${kata}` : kata;
    if (lebar(coba) > maks && kini) {
      baris.push(kini);
      kini = kata;
    } else {
      kini = coba;
    }
  }
  if (kini) baris.push(kini);
  return baris;
}

function gambarLatar(g: CanvasRenderingContext2D, w: number, h: number, latar: Latar) {
  if (latar === "peta") {
    g.fillStyle = c.water;
    g.fillRect(0, 0, w, h);
    g.strokeStyle = c.graticule;
    g.lineWidth = 0.75;
    for (let x = 100; x < w; x += 100) {
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, h);
      g.stroke();
    }
    for (let y = 100; y < h; y += 100) {
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(w, y);
      g.stroke();
    }
    // 1°N: garis putus yang melintasi semua peta laut Batam.
    g.setLineDash([12, 8]);
    g.strokeStyle = c.line1n;
    g.lineWidth = 1.25;
    g.beginPath();
    g.moveTo(0, h * 0.62);
    g.lineTo(w, h * 0.62);
    g.stroke();
    g.setLineDash([]);
    g.fillStyle = c.line1n;
    g.font = `20px ${SANS}`;
    g.fillText("1°00′ U", 24, h * 0.62 - 10);
  } else if (latar === "hujan") {
    g.fillStyle = c.land;
    g.fillRect(0, 0, w, h);
    g.strokeStyle = c.depthLine;
    g.lineWidth = 1.25;
    for (let y = -40; y < h; y += 34) {
      for (let x = (y % 68 === 0 ? 0 : 34) - 40; x < w; x += 68) {
        g.beginPath();
        g.moveTo(x, y);
        g.lineTo(x - 10, y + 24);
        g.stroke();
      }
    }
  } else {
    g.fillStyle = c.water;
    g.fillRect(0, 0, w, h);
    g.strokeStyle = c.waterline;
    g.lineWidth = 0.75;
    for (let y = 40; y < h; y += 26) {
      g.beginPath();
      for (let x = 0; x <= w; x += 20) {
        const yy = y + Math.sin((x + y * 3) / 90) * 6;
        if (x === 0) g.moveTo(x, yy);
        else g.lineTo(x, yy);
      }
      g.stroke();
    }
  }
}

export function gambarKartuPos(
  g: CanvasRenderingContext2D,
  w: number,
  h: number,
  isi: { latar: Latar; tempat: string; pesan: string; dari: string },
) {
  gambarLatar(g, w, h, isi.latar);

  // Bingkai dua garis seperti kartusis peta.
  g.strokeStyle = c.ink;
  g.lineWidth = 2;
  g.strokeRect(24, 24, w - 48, h - 48);
  g.lineWidth = 0.75;
  g.strokeRect(32, 32, w - 64, h - 64);

  const lebarPanel = w * 0.62;
  const x = 72;
  const y = h * 0.14;
  g.font = `28px ${SANS}`;
  const baris = bungkus(isi.pesan, (s) => g.measureText(s).width, lebarPanel - 72);
  const tinggi = 150 + baris.length * 40 + (isi.dari ? 48 : 0);
  g.fillStyle = c.land;
  g.fillRect(x, y, lebarPanel, tinggi);
  g.strokeStyle = c.ink;
  g.lineWidth = 1;
  g.strokeRect(x, y, lebarPanel, tinggi);

  g.fillStyle = c.muted;
  g.font = `22px ${SANS}`;
  g.fillText("Salam dari", x + 36, y + 48);
  g.fillStyle = c.ink;
  g.font = `600 56px ${SERIF}`;
  g.fillText(isi.tempat, x + 36, y + 108);
  g.font = `28px ${SANS}`;
  baris.forEach((b, i) => g.fillText(b, x + 36, y + 156 + i * 40));
  if (isi.dari) {
    g.fillStyle = c.muted;
    g.font = `italic 24px ${SERIF}`;
    g.fillText(`dari ${isi.dari}`, x + 36, y + 156 + baris.length * 40 + 8);
  }

  g.fillStyle = c.ink;
  g.font = `20px ${SANS}`;
  g.textAlign = "right";
  g.fillText("Batam City Hall", w - 60, h - 56);
  g.textAlign = "left";
}
