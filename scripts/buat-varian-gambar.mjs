// Versi kecil gambar yang sering tampil mengecil, supaya daftar dan beranda tidak mengunduh berkas ukuran penuh.
//   public/grafis/hidangan/kecil/<kategori>.webp  352 px, untuk baris daftar 176 px dan beranda 160 px (2x)
//   public/kartu-pos/layar/<id>.webp              874 x 620, untuk pilihan desain dan beranda
// Berkas asli tetap dipakai di tempat yang tampil besar dan untuk cetak kartu pos.
// Jalankan ulang setelah menambah atau mengganti gambar:  node scripts/buat-varian-gambar.mjs
// Tes unit (tests/unit/varian-gambar.test.ts) gagal bila ada gambar tanpa versi kecil.
import { mkdirSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = join(import.meta.dirname, "..");
const TUGAS = [
  { dari: "public/grafis/hidangan", ke: "public/grafis/hidangan/kecil", lebar: 352, tinggi: 352, mutu: 78 },
  { dari: "public/kartu-pos", ke: "public/kartu-pos/layar", lebar: 874, tinggi: 620, mutu: 80 },
];

for (const t of TUGAS) {
  const asal = join(ROOT, t.dari);
  const tujuan = join(ROOT, t.ke);
  mkdirSync(tujuan, { recursive: true });
  for (const nama of readdirSync(asal).filter((n) => n.endsWith(".webp"))) {
    const sumber = join(asal, nama);
    const hasil = join(tujuan, nama);
    try {
      if (statSync(hasil).mtimeMs >= statSync(sumber).mtimeMs) continue;
    } catch {
      /* belum ada */
    }
    const info = await sharp(sumber).resize(t.lebar, t.tinggi, { fit: "cover" }).webp({ quality: t.mutu }).toFile(hasil);
    console.log(`${t.ke}/${nama}: ${Math.round(info.size / 1024)} KB`);
  }
}
