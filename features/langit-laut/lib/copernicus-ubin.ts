// Protokol "cmems://" untuk ubin gelombang Copernicus (lihat lib/copernicus.ts): ambil ubin abu-abu,
// balik warnanya menjadi meter, lalu warnai dengan pita BMKG. Hanya berjalan di peramban.
import { addProtocol } from "maplibre-gl";
import { haluskan, keIso, lebarSelPx, tabelNilai, tabelPita } from "./copernicus";
import { OFS_MAX_M } from "./radar";
import { CMEMS_LEGENDA, cmemsUbin } from "./sources";

let tabel: Promise<Float32Array> | null = null;
function muatTabel(): Promise<Float32Array> {
  tabel ??= fetch(CMEMS_LEGENDA)
    .then((r) => {
      if (!r.ok) throw new Error(`legenda Copernicus ${r.status}`);
      return r.json() as Promise<{ continuous?: { cmap?: { colorMap?: number[][] } } }>;
    })
    .then((j) => {
      const cm = j.continuous?.cmap?.colorMap;
      if (!Array.isArray(cm) || cm.length < 2) throw new Error("legenda Copernicus tanpa tabel warna");
      return tabelNilai(cm);
    })
    .catch((e) => {
      tabel = null; // coba lagi di ubin berikutnya
      throw e;
    });
  return tabel;
}

function kanvas(w: number, h: number) {
  if (typeof OffscreenCanvas !== "undefined") return new OffscreenCanvas(w, h);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

const PITA = tabelPita();
const POLA = /^cmems:\/\/(\d+)\/(\d+)\/(\d+)\/(\d{12})$/;

async function muatUbin(url: string, signal: AbortSignal): Promise<ImageBitmap> {
  const m = POLA.exec(url);
  if (!m) throw new Error(`alamat ubin Copernicus tidak dikenal: ${url}`);
  const [, z, x, y, valid] = m;
  const [lut, res] = await Promise.all([muatTabel(), fetch(cmemsUbin(keIso(valid), z, x, y), { signal })]);
  if (!res.ok) throw new Error(`ubin Copernicus ${res.status}`);
  const asli = await createImageBitmap(await res.blob());
  const c = kanvas(asli.width, asli.height);
  const ctx = c.getContext("2d", { willReadFrequently: true }) as
    | OffscreenCanvasRenderingContext2D
    | CanvasRenderingContext2D
    | null;
  if (!ctx) throw new Error("kanvas 2D tidak tersedia");
  ctx.drawImage(asli, 0, 0);
  asli.close();
  const img = ctx.getImageData(0, 0, c.width, c.height);
  const d = img.data;
  const n = c.width * c.height;
  const nilai = new Float32Array(n);
  const bobot = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    if (d[i * 4 + 3] === 0) continue; // darat atau tanpa data
    nilai[i] = lut[d[i * 4]];
    bobot[i] = 1;
  }
  // Ubin 256 px; untuk ubin @2x atau lainnya, lebar sel ikut skala gambar.
  haluskan(nilai, bobot, c.width, c.height, Math.floor((lebarSelPx(Number(z)) * (c.width / 256)) / 2));
  const maksCm = Math.round(OFS_MAX_M * 100);
  for (let i = 0; i < n; i++) {
    const o = i * 4;
    // Tepi hasil penghalusan yang terlalu tipis datanya dibiarkan kosong.
    if (bobot[i] < 0.2) {
      d[o + 3] = 0;
      continue;
    }
    const k = Math.min(maksCm, Math.max(0, Math.round(nilai[i] * 100))) * 3;
    d[o] = PITA[k];
    d[o + 1] = PITA[k + 1];
    d[o + 2] = PITA[k + 2];
    d[o + 3] = 255;
  }
  return createImageBitmap(img);
}

let terpasang = false;
/** Protokol cmems:// global di MapLibre; cukup dipasang sekali per halaman. */
export function pasangProtokolCopernicus() {
  if (terpasang) return;
  addProtocol("cmems", async (params, ctrl) => ({ data: await muatUbin(params.url, ctrl.signal) }));
  terpasang = true;
}
