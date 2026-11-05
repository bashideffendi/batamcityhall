// Citra radar MSS diwarnai ulang ke gradasi biru situs (PEDOMAN 5.2): ringan berupa titik raster biru di atas
// --bch-radar-light, sedang --bch-radar-mid, lebat --bch-radar-heavy. Pembagian kelas sama dengan lib/echo.ts.
import { PNG } from "pngjs";

type Warna = readonly [number, number, number];
const TERANG: Warna = [0xcf, 0xe4, 0xf2];
const TENGAH: Warna = [0x3f, 0x8f, 0xcb];
const GELAP: Warna = [0x2c, 0x4f, 0x88];

/** Tiga kali ukuran asli: satu titik raster di tengah tiap piksel radar (±1 km). */
export const SKALA_RADAR = 3;

export function warnaiRadar(png: Buffer): Buffer {
  const a = PNG.sync.read(png);
  const h = new PNG({ width: a.width * SKALA_RADAR, height: a.height * SKALA_RADAR });
  for (let y = 0; y < h.height; y++) {
    for (let x = 0; x < h.width; x++) {
      const i = (Math.floor(y / SKALA_RADAR) * a.width + Math.floor(x / SKALA_RADAR)) * 4;
      const o = (y * h.width + x) * 4;
      if (a.data[i + 3] === 0) {
        h.data[o + 3] = 0;
        continue;
      }
      const r = a.data[i];
      const g = a.data[i + 1];
      const w = r === 0 ? (x % SKALA_RADAR === 1 && y % SKALA_RADAR === 1 ? TENGAH : TERANG) : g >= 128 ? TENGAH : GELAP;
      h.data[o] = w[0];
      h.data[o + 1] = w[1];
      h.data[o + 2] = w[2];
      h.data[o + 3] = 255;
    }
  }
  return PNG.sync.write(h, { deflateLevel: 6 });
}
