// Menyiapkan public/tiles/batam.pmtiles sebelum `next build` di host tanpa R2 (mis. Railway).
// Next.js hanya menyajikan isi public/ yang ada saat build, jadi file harus sudah ada sebelum build.
//
// Urutan:
//   1. NEXT_PUBLIC_PMTILES_URL diisi (peta di R2 atau host lain) -> tidak perlu apa-apa.
//   2. File sudah ada dan checksum cocok -> lewati.
//   3. Unduh dari URL di deploy/peta-dasar.json (cabang aset-peta), cek ukuran dan sha256.
// Gagal = build gagal dengan pesan jelas. Tidak jatuh diam-diam ke peta kosong.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "tiles", "batam.pmtiles");
const info = JSON.parse(readFileSync(join(ROOT, "deploy", "peta-dasar.json"), "utf8"));
const url = process.env.PETA_DASAR_URL || info.url;

const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");

if (process.env.NEXT_PUBLIC_PMTILES_URL) {
  console.log(
    `[peta] NEXT_PUBLIC_PMTILES_URL diisi (${process.env.NEXT_PUBLIC_PMTILES_URL}), file lokal tidak diperlukan.`,
  );
  process.exit(0);
}

if (existsSync(OUT) && statSync(OUT).size === info.bytes && sha256(readFileSync(OUT)) === info.sha256) {
  console.log("[peta] public/tiles/batam.pmtiles sudah ada dan cocok, dilewati.");
  process.exit(0);
}

console.log(`[peta] mengunduh ${url}`);
const res = await fetch(url, { headers: { "User-Agent": "BatamCityHall-build/0.1" } });
if (!res.ok) {
  console.error(
    `[peta] gagal mengunduh: HTTP ${res.status}. Isi NEXT_PUBLIC_PMTILES_URL atau PETA_DASAR_URL, atau jalankan scripts/extract-basemap.mjs.`,
  );
  process.exit(1);
}
const buf = Buffer.from(await res.arrayBuffer());
const hash = sha256(buf);
if (buf.length !== info.bytes || hash !== info.sha256) {
  console.error(
    `[peta] file tidak cocok: ${buf.length} byte, sha256 ${hash}. Diharapkan ${info.bytes} byte, ${info.sha256}.`,
  );
  process.exit(1);
}
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(`${OUT}.tmp`, buf);
renameSync(`${OUT}.tmp`, OUT);
writeFileSync(join(dirname(OUT), "BUILD.txt"), `${info.build}\n`);
console.log(`[peta] siap: ${(buf.length / 1e6).toFixed(1)} MB, build Protomaps ${info.build}.`);
