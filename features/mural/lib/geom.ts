// Geometri ruang piksel mural. Murni, tanpa DOM.
export type Titik = [number, number];

export function dalamPoligon([x, y]: Titik, cincin: Titik[]): boolean {
  let dalam = false;
  for (let i = 0, j = cincin.length - 1; i < cincin.length; j = i++) {
    const [xi, yi] = cincin[i];
    const [xj, yj] = cincin[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) dalam = !dalam;
  }
  return dalam;
}

export function luasPoligon(cincin: Titik[]): number {
  let a = 0;
  for (let i = 0, j = cincin.length - 1; i < cincin.length; j = i++) {
    a += cincin[j][0] * cincin[i][1] - cincin[i][0] * cincin[j][1];
  }
  return Math.abs(a) / 2;
}

export const klem = (n: number, min: number, maks: number) => Math.min(maks, Math.max(min, n));

export type Posisi = { x: number; y: number; sudut: number };

/** Titik pada fraksi f (0..1) sepanjang polyline, beserta arah ruasnya dalam radian. */
export function sepanjangGaris(garis: Titik[], f: number): Posisi {
  if (garis.length === 0) throw new Error("garis kosong");
  if (garis.length === 1) return { x: garis[0][0], y: garis[0][1], sudut: 0 };
  const ruas = garis.slice(1).map((b, i) => Math.hypot(b[0] - garis[i][0], b[1] - garis[i][1]));
  const total = ruas.reduce((s, r) => s + r, 0);
  let sisa = klem(f, 0, 1) * total;
  for (let i = 0; i < ruas.length; i++) {
    const [a, b] = [garis[i], garis[i + 1]];
    if (sisa <= ruas[i] || i === ruas.length - 1) {
      const k = ruas[i] === 0 ? 0 : sisa / ruas[i];
      return { x: a[0] + (b[0] - a[0]) * k, y: a[1] + (b[1] - a[1]) * k, sudut: Math.atan2(b[1] - a[1], b[0] - a[0]) };
    }
    sisa -= ruas[i];
  }
  throw new Error("tidak terjangkau");
}

export type Hotspot = { id: string; x: number; y: number; poligon: Titik[] };

/**
 * Hit-test (research/02): poligon terkecil yang memuat titik didahulukan. Kalau tidak ada, pusat terdekat dalam
 * toleransi, supaya sasaran sentuh tetap 44 CSS px saat diperkecil. `toleransi` dalam piksel gambar.
 */
export function cariHotspot<T extends Hotspot>(p: Titik, daftar: T[], toleransi: number): T | null {
  const kena = daftar
    .filter((h) => dalamPoligon(p, h.poligon))
    .sort((a, b) => luasPoligon(a.poligon) - luasPoligon(b.poligon));
  if (kena.length) return kena[0];
  let terbaik: T | null = null;
  let jarak = toleransi;
  for (const h of daftar) {
    const d = Math.hypot(h.x - p[0], h.y - p[1]);
    if (d <= jarak) {
      terbaik = h;
      jarak = d;
    }
  }
  return terbaik;
}
