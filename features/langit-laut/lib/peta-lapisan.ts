// Aturan lapisan Langit & Laut di atas peta dasar bersama. Fungsi murni supaya bisa dites tanpa WebGL.
//
// Semua sumber dan layer milik fitur ini berawalan "ll-". Saat tema berganti, peta dasar diganti
// lewat setStyle dengan diff, dan gabungGaya menjaga lapisan "ll-" supaya radar tidak hilang.
import type { LayerSpecification, StyleSpecification } from "maplibre-gl";

export const AWALAN = "ll-";

// Urutan gambar dari bawah ke atas, semuanya di bawah label peta. Arsiran kecamatan di bawah radar
// supaya warna radar tetap asli; mask daratan di atas field ombak supaya darat tidak ikut berwarna.
const URUTAN = ["ll-kec-fill", "ll-cap-fill", "ll-radar", "ll-kec-line", "ll-cap-line", "ll-ofs", "ll-land"];

export function peringkat(id: string): number {
  const i = URUTAN.findIndex((u) => id === u || id.startsWith(`${u}-`));
  return i === -1 ? URUTAN.length : i;
}

/** Id layer tempat layer baru harus disisipkan di depannya. undefined = paling atas. */
export function sisipSebelum(urutanLayer: { id: string; type: string }[], idBaru: string): string | undefined {
  const r = peringkat(idBaru);
  return urutanLayer.find((l) => l.type === "symbol" || (l.id.startsWith(AWALAN) && peringkat(l.id) > r))?.id;
}

export function gabungGaya(lama: StyleSpecification | undefined, baru: StyleSpecification): StyleSpecification {
  if (!lama) return baru;
  const sources = { ...baru.sources };
  for (const [id, s] of Object.entries(lama.sources)) if (id.startsWith(AWALAN)) sources[id] = s;
  const milik: LayerSpecification[] = lama.layers.filter((l) => l.id.startsWith(AWALAN));
  const iLabel = baru.layers.findIndex((l) => l.type === "symbol");
  const batas = iLabel === -1 ? baru.layers.length : iLabel;
  return { ...baru, sources, layers: [...baru.layers.slice(0, batas), ...milik, ...baru.layers.slice(batas)] };
}

/** [[selatan, barat], [utara, timur]] dari kode lama menjadi [[barat, selatan], [timur, utara]]. */
export function keLngLatBounds(b: [[number, number], [number, number]]): [[number, number], [number, number]] {
  return [
    [b[0][1], b[0][0]],
    [b[1][1], b[1][0]],
  ];
}

/** Sudut citra untuk image source MapLibre: kiri atas, kanan atas, kanan bawah, kiri bawah. */
export function sudutCitra(
  b: [[number, number], [number, number]],
): [[number, number], [number, number], [number, number], [number, number]] {
  const [[s, w], [n, e]] = b;
  return [
    [w, n],
    [e, n],
    [e, s],
    [w, s],
  ];
}

/** Posisi piksel dunia pada zoom tertentu (tile 512 px), padanan map.project(latlng, zoom) Leaflet. */
export function pikselDunia(lat: number, lng: number, zoom: number): { x: number; y: number } {
  const skala = 512 * 2 ** zoom;
  const sin = Math.sin((lat * Math.PI) / 180);
  return {
    x: ((lng + 180) / 360) * skala,
    y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * skala,
  };
}

export type Padding = { paddingTopLeft: [number, number]; paddingBottomRight: [number, number] };

export const kePaddingMapLibre = (p: Padding) => ({
  left: p.paddingTopLeft[0],
  top: p.paddingTopLeft[1],
  right: p.paddingBottomRight[0],
  bottom: p.paddingBottomRight[1],
});

/** Geser minimum (px) supaya titik layar `p` masuk kotak di dalam padding. Padanan panInside Leaflet. */
export function geserKeDalam(
  p: { x: number; y: number },
  ukuran: { w: number; h: number },
  pad: { left: number; top: number; right: number; bottom: number },
): [number, number] {
  const sumbu = (v: number, min: number, max: number) => (v < min ? v - min : v > max ? v - max : 0);
  return [sumbu(p.x, pad.left, ukuran.w - pad.right), sumbu(p.y, pad.top, ukuran.h - pad.bottom)];
}
