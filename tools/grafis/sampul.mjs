// Gambar sampul beranda dari peta isometrik pemilik. Jalankan: node tools/grafis/sampul.mjs "<berkas peta>"
// Purwarupa 9 Nov 2026 memakai dummy Harbour Bay (harbourbay_4096x2048.jpg). Peta final Barelang menyusul, jadi
// ukuran sumber tidak dikunci: hasilnya selalu lebar layar 1280/1920/2560 dan potongan tegak 2:3 untuk ponsel.
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const SUMBER = process.argv[2];
if (!SUMBER) {
  console.error('pakai: node tools/grafis/sampul.mjs "<berkas peta>" [nama]');
  process.exit(1);
}
const NAMA = process.argv[3] ?? "harbourbay";
const KE = join(import.meta.dirname, "..", "..", "public", "grafis", "sampul");
mkdirSync(KE, { recursive: true });

const meta = await sharp(SUMBER).metadata();
console.log("sumber", meta.width, "x", meta.height);
for (const w of [1280, 1920, 2560]) {
  const info = await sharp(SUMBER).resize({ width: w }).webp({ quality: 78, effort: 6 }).toFile(join(KE, `${NAMA}-${w}.webp`));
  console.log(`${NAMA}-${w}.webp`, Math.round(info.size / 1024), "KB");
}
// Ponsel: potongan tegak 2:3 di sekitar pusat kota, skala asli supaya bangunannya tetap terbaca.
const tinggi = meta.height;
const lebar = Math.round((tinggi * 2) / 3);
const kiri = Math.max(0, Math.min(meta.width - lebar, Math.round(meta.width * 0.42 - lebar / 2)));
for (const w of [720, 1080]) {
  const info = await sharp(SUMBER)
    .extract({ left: kiri, top: 0, width: lebar, height: tinggi })
    .resize({ width: w })
    .webp({ quality: 80, effort: 6 })
    .toFile(join(KE, `${NAMA}-tegak-${w}.webp`));
  console.log(`${NAMA}-tegak-${w}.webp`, Math.round(info.size / 1024), "KB");
}
