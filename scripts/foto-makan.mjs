// Menyusun data/makan/foto.json dari folder public/foto/makan/<id-tempat>/.
// Cukup taruh foto di folder itu. Urutan mengikuti nama berkas, jadi 01.webp tampil paling depan.
// Keterangan dan kredit boleh ditulis di info.json: { "01.webp": { "alt": "...", "kredit": "..." } }.
// Dijalankan di prebuild, jadi foto baru otomatis ikut saat build.
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const AKAR = join(ROOT, "public", "foto", "makan");
const KELUAR = join(ROOT, "data", "makan", "foto.json");
const GAMBAR = /\.(webp|jpe?g|png|avif)$/i;

const ids = new Set(JSON.parse(readFileSync(join(ROOT, "data", "makan", "places.json"), "utf8")).map((p) => p.id));
const folder = existsSync(AKAR) ? readdirSync(AKAR).filter((n) => statSync(join(AKAR, n)).isDirectory()) : [];

const asing = folder.filter((n) => !ids.has(n));
if (asing.length) {
  console.error(`foto-makan: folder tanpa tempat yang cocok: ${asing.join(", ")}. Nama folder harus sama dengan id tempat.`);
  process.exit(1);
}

const hasil = {};
if (folder.length) {
  const { default: sharp } = await import("sharp");
  for (const id of folder.sort()) {
    const dir = join(AKAR, id);
    const jalurInfo = join(dir, "info.json");
    const info = existsSync(jalurInfo) ? JSON.parse(readFileSync(jalurInfo, "utf8")) : {};
    const berkas = readdirSync(dir).filter((n) => GAMBAR.test(n)).sort();
    const daftar = [];
    for (const nama of berkas) {
      const { width, height } = await sharp(join(dir, nama)).metadata();
      if (!width || !height) {
        console.error(`foto-makan: ukuran ${id}/${nama} tidak terbaca.`);
        process.exit(1);
      }
      const { alt, kredit } = info[nama] ?? {};
      daftar.push({
        src: `/foto/makan/${id}/${nama}`,
        w: width,
        h: height,
        ...(alt ? { alt } : {}),
        ...(kredit ? { kredit } : {}),
      });
    }
    if (daftar.length) hasil[id] = daftar;
  }
}

writeFileSync(KELUAR, `${JSON.stringify(hasil, null, 2)}\n`);
const n = Object.values(hasil).reduce((a, d) => a + d.length, 0);
console.log(`foto-makan: ${n} foto di ${Object.keys(hasil).length} tempat.`);
