// Bangun aset statis tanpa dependensi native, memakai Chromium (Playwright):
//   app/apple-icon.png               ikon iOS 180 px dari public/logo/monogram.svg
//   public/icon-192.png, icon-512.png ikon PWA dari sumber yang sama
//
//   node scripts/build-aset.mjs
//
// Grain dibuat prosedural dari PRNG berbenih, jadi hasilnya bisa diulang dan tidak ada urusan
// lisensi tekstur. Target ukuran laporan 05: 256×256, di bawah 15 KB, dan bisa disambung (tile).
import { chromium } from "@playwright/test";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const TEX = join(ROOT, "public", "tex");
const MAKS_BYTE = 15 * 1024;
const KUALITAS = [0.6, 0.5, 0.4, 0.3, 0.2, 0.1];

function buatGrain({ ukuran, benih, terang, kualitas }) {
  // mulberry32
  let s = benih >>> 0;
  const acak = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const n = ukuran * ukuran;
  const mentah = new Float32Array(n);
  for (let i = 0; i < n; i++) mentah[i] = acak();

  // Penghalusan kecil dengan tetangga berputar: butiran lebih organik, kompresi lebih baik,
  // dan tepi kiri-kanan serta atas-bawah tetap menyambung.
  const at = (x, y) => mentah[((y + ukuran) % ukuran) * ukuran + ((x + ukuran) % ukuran)];
  const c = document.createElement("canvas");
  c.width = c.height = ukuran;
  const ctx = c.getContext("2d");
  const img = ctx.createImageData(ukuran, ukuran);
  for (let y = 0; y < ukuran; y++) {
    for (let x = 0; x < ukuran; x++) {
      const v = (at(x, y) * 2 + at(x - 1, y) + at(x + 1, y) + at(x, y - 1) + at(x, y + 1)) / 6;
      // Sebaran dilebarkan lagi setelah dihaluskan. Siang: 128-255 supaya multiply hanya menggelapkan
      // sedikit. Malam: 0-127 supaya screen hanya menerangkan sedikit.
      const kontras = Math.min(1, Math.max(0, (v - 0.5) * 2.4 + 0.5));
      const abu = terang ? Math.round(kontras * 127) : Math.round(128 + kontras * 127);
      const i = (y * ukuran + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = abu;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL("image/webp", kualitas);
}

const browser = await chromium.launch();
const page = await browser.newPage();
mkdirSync(TEX, { recursive: true });

for (const [nama, terang, benih] of [
  ["grain-256.webp", false, 1846],
  ["grain-256-light.webp", true, 1847],
]) {
  let hasil = null;
  for (const kualitas of KUALITAS) {
    const url = await page.evaluate(buatGrain, { ukuran: 256, benih, terang, kualitas });
    const buf = Buffer.from(url.split(",")[1], "base64");
    if (buf.length <= MAKS_BYTE) {
      hasil = { buf, kualitas };
      break;
    }
  }
  if (!hasil) throw new Error(`${nama} tetap di atas ${MAKS_BYTE} byte`);
  writeFileSync(join(TEX, nama), hasil.buf);
  console.log(`${nama}: ${(hasil.buf.length / 1024).toFixed(1)} KB, kualitas ${hasil.kualitas}`);
}

const svg = readFileSync(join(ROOT, "public", "logo", "monogram.svg"), "utf8");
await page.setViewportSize({ width: 180, height: 180 });
await page.setContent(
  `<!doctype html><style>html,body{margin:0;background:#F4EFE4}svg{display:block;width:150px;height:150px;margin:15px}</style>${svg}`,
);
writeFileSync(join(ROOT, "app", "apple-icon.png"), await page.screenshot());
console.log("apple-icon.png: 180×180");

for (const ukuran of [192, 512]) {
  const sisi = Math.round(ukuran * 0.72);
  await page.setViewportSize({ width: ukuran, height: ukuran });
  await page.setContent(
    `<!doctype html><style>html,body{margin:0;background:#F4EFE4;display:grid;place-items:center;height:100%}svg{display:block;width:${sisi}px;height:${sisi}px}</style>${svg}`,
  );
  writeFileSync(join(ROOT, "public", `icon-${ukuran}.png`), await page.screenshot());
  console.log(`icon-${ukuran}.png`);
}

await browser.close();
