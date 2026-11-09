// Pin peta dan indeks pencarian direktori sebagai berkas statis di public/, dibuat sebelum build dan dev.
// Jalankan: tsx --conditions=react-server scripts/data-direktori.ts
//
// Dulu keduanya route handler. `next start` tidak memampatkan jawaban route handler, dan header Content-Encoding
// buatan sendiri dibuang Next.js 16 (dicek 9 Nov 2026), padahal isinya 900 KB setelah data terbuka Overture masuk.
// Berkas statis di public/ dimampatkan gzip oleh Next: sekitar 164 KB dan 101 KB. Alamatnya tetap sama, jadi peta dan
// pencarian tidak berubah. Kedua berkas tidak ikut repo (.gitignore).
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { barisIndeks, daftarPin, TEMPAT } from "../features/direktori/data";

const DIR = join(import.meta.dirname, "..", "public", "info", "direktori");
mkdirSync(DIR, { recursive: true });
const tulis = (nama: string, isi: unknown) => {
  const teks = JSON.stringify(isi);
  writeFileSync(join(DIR, nama), teks);
  return `${nama} ${(teks.length / 1024).toFixed(0)} KB`;
};
console.log(`data-direktori: ${tulis("pin.json", daftarPin())}, ${tulis("indeks.json", TEMPAT.map(barisIndeks))}`);
