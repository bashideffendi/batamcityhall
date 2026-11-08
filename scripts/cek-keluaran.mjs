// Pemeriksaan keluaran build (npm run check:rules), dijalankan sesudah `npm run build`.
// validate-data menjaga berkas data; skrip ini menjaga yang benar-benar dikirim ke pembaca: HTML, payload RSC,
// sitemap, RSS, dan bundel JavaScript. Gagal (exit 1) bila menemukan:
//   - kunci data pajak hotel (NPWPD, NOP, nilai pajak, SSPD, SPTPD) sebagai kunci JSON;
//   - JSON-LD yang membawa nomor telepon atau rating pihak lain;
//   - JSON-LD yang tidak bisa diurai.
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const AKAR = [join(ROOT, ".next", "server", "app"), join(ROOT, ".next", "static")];
const BERKAS = /\.(html|rsc|body|meta|js|json|xml)$/;
// Sama dengan KUNCI_PAJAK di lib/data/schema.ts, dalam bentuk kunci JSON (boleh ber-escape di payload RSC).
const KUNCI_PAJAK = /\\?"(npwpd|nop|nilai_pajak|sspd|sptpd|no_sspd|no_sptpd|nomor_sspd|nomor_sptpd|pajak)\\?"\s*:/i;
const LD = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
const LD_TERLARANG = ["telephone", "aggregateRating", "review"];

if (!AKAR.every(existsSync)) {
  console.error("cek-keluaran: folder .next belum ada. Jalankan npm run build dulu.");
  process.exit(1);
}

const jalan = (d, out = []) => {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) jalan(p, out);
    else if (BERKAS.test(n)) out.push(p);
  }
  return out;
};

const masalah = [];
let jumlahLd = 0;
for (const f of AKAR.flatMap((a) => jalan(a))) {
  const isi = readFileSync(f, "utf8");
  const nama = relative(ROOT, f);
  const pajak = KUNCI_PAJAK.exec(isi);
  if (pajak) masalah.push(`${nama}: kunci data pajak ${pajak[1]}`);
  if (!f.endsWith(".html")) continue;
  for (const m of isi.matchAll(LD)) {
    jumlahLd++;
    try {
      const data = JSON.parse(m[1]);
      const teks = JSON.stringify(data);
      for (const k of LD_TERLARANG) if (teks.includes(`"${k}"`)) masalah.push(`${nama}: JSON-LD memuat ${k}`);
    } catch {
      masalah.push(`${nama}: JSON-LD tidak bisa diurai`);
    }
  }
}

if (masalah.length) {
  console.error(`cek-keluaran: ${masalah.length} masalah`);
  for (const m of masalah.slice(0, 40)) console.error(`  ${m}`);
  process.exit(1);
}
console.log(`cek-keluaran: lulus (${jumlahLd} blok JSON-LD di HTML statis).`);
