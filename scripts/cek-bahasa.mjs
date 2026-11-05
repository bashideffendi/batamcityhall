// Pemeriksaan bahasa otomatis (docs/PEDOMAN.md 7.1). Dijalankan di prebuild, gagal bila ada temuan.
//   node scripts/cek-bahasa.mjs            periksa kode dan data, keluar 1 bila ada temuan
//   node scripts/cek-bahasa.mjs --ringkas  hitungan per berkas saja
//
// Teks JSX diambil dengan compiler TypeScript, jadi komentar, nama kelas, dan path tidak ikut.
// Pengecualian (nama usaha, nama resmi) ada di scripts/cek-bahasa-pengecualian.json.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const rel = (p) => relative(ROOT, p).split(sep).join("/");
const PENGECUALIAN = JSON.parse(readFileSync(join(ROOT, "scripts/cek-bahasa-pengecualian.json"), "utf8"));
// Frasa panjang dihapus lebih dulu supaya frasa pendek tidak memotongnya.
PENGECUALIAN.frasa.sort((a, b) => b.length - a.length);

/** Tempat kredit dan sebutan sumber memang boleh ada (pedoman 2.9). */
const BOLEH_SUMBER = /^(app\/kolofon\/|features\/berita\/|app\/info\/berita\/|app\/api\/)/;

/** Kolom kiri tabel 2.8. Nama usaha dan nama resmi masuk daftar pengecualian. */
const TIDAK_BAKU = [
  "silahkan",
  "himbau",
  "menghimbau",
  "dihimbau",
  "resiko",
  "praktek",
  "apotik",
  "nasehat",
  "ijin",
  "jadual",
  "aktifitas",
  "analisa",
  "sekedar",
  "merubah",
  "obyek",
  "sistim",
  "kadaluarsa",
  "antri",
  "handal",
  "cabe",
  "mie",
  "sop",
  "klenteng",
  "sholat",
  "mushola",
  "ramadhan",
  "ferry",
  "cafe",
  "seafood",
];

export const ATURAN = [
  // Sebutan pemerintah dan sumber
  ...["batam\\.go\\.id", "bukan situs resmi", "layanan resmi", "cek langsung"].map((p) => ({
    id: "sebutan",
    re: new RegExp(p, "i"),
    kecuali: BOLEH_SUMBER,
  })),
  ...["\\bSumber:", "\\bMenurut:"].map((p) => ({ id: "sebutan", re: new RegExp(p), kecuali: BOLEH_SUMBER })),
  // Catatan kerja
  ...[
    "belum dicek ulang",
    "lokasi belum diisi",
    "perlu cek ulang",
    "data lama",
    "sumber sekunder",
    "jam dari berita",
    "tidak menebak",
    "tautan belum tercatat",
    "placeholder",
    "segera hadir",
  ].map((p) => ({ id: "catatan-kerja", re: new RegExp(`\\b${p}\\b`, "i") })),
  // Gaya terlarang
  ...[
    "itik sedang berbaris",
    "halaman ini tenggelam",
    "hidden gem",
    "hits",
    "wajib coba",
    "wajib dikunjungi",
    "premium",
    "instagramable",
    "healing",
    "kekinian",
    "layak dikejar",
    "agak tersembunyi",
  ].map((p) => ({ id: "gaya", re: new RegExp(`\\b${p}\\b`, "i") })),
  { id: "tanda-seru", re: /[A-Za-zÀ-ÿ0-9)]!(\s|$|["”])/, indonesia: true },
  { id: "emoji", re: /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u },
  // Kata tidak baku
  // Koreksi pemilik 5 Nov 2026: bagian situs disebut dengan namanya. Loket sungguhan di kantor ada di daftar pengecualian.
  { id: "istilah-loket", re: /\bloket\b/i, indonesia: true },
  { id: "tidak-baku", re: new RegExp(`\\b(${TIDAK_BAKU.join("|")})\\b`, "i"), indonesia: true, nama: true },
  { id: "tidak-baku", re: /\bJum'at\b/, indonesia: true },
  { id: "tidak-baku", re: /\bnon[ -](halal|tunai)\b/i, indonesia: true },
  // Pola salah
  { id: "jam-titik-dua", re: /\b\d{1,2}:\d{2}\b/, indonesia: true },
  { id: "rupiah", re: /\bRp(\s|\.)/ },
  { id: "satuan-menempel", re: /\d(km|m|kg)\b/, indonesia: true },
  { id: "di-pisah", re: /\bdi (update|cek)\b/i },
  { id: "kata-depan", re: /\b(kemana|dimana|apapun|siapapun)\b/i },
  { id: "non-hubung", re: /\bnon-[a-z]/, indonesia: true },
  { id: "dan-simbol", re: /&/, indonesia: true },
  { id: "anda", re: /\bAnda\b/ },
];

/** Atribut JSX dan properti objek yang isinya bukan teks untuk pembaca. */
const BUKAN_TEKS =
  /^(className|href|src|id|key|type|rel|target|d|viewBox|fill|stroke|style|media|as|name|htmlFor|role|lang|method|action|autoComplete|inputMode|pattern|sizes|srcSet|width|height|transform|points|x|y|cx|cy|r|xmlns|strokeWidth|strokeLinecap|strokeLinejoin|fontFamily|filter|mask|clipPath|url|slug|kode|code|icon|ikon|kelas|warna|color|prefetch|loading|decoding|aria-controls|aria-labelledby|aria-describedby|aria-hidden|data-[\w-]+)$/;

const FUNGSI_KODE =
  /^(fetch|matchMedia|querySelector|querySelectorAll|closest|addEventListener|removeEventListener|getItem|setItem|removeItem|createElement|getContext|getAttribute|setAttribute|setProperty|getPropertyValue|require|import|describe|it|test|expect|RegExp|startsWith|endsWith|includes|split|join|replace|padStart|toLocaleString|toLocaleDateString|toLocaleTimeString|DateTimeFormat|NumberFormat|getLayer|getSource|addSource|removeLayer|removeSource|setPaintProperty|setLayoutProperty|setFilter|on|off|once|log|warn|error|parse|URL|URLSearchParams|Error|readFileSync|join|existsSync)$/;

/** Abaikan string yang jelas bukan kalimat: URL, path, kelas, kode. */
function mirip_kode(s) {
  const t = s.trim();
  if (!t) return true;
  if (/^(https?:|mailto:|tel:|\/|\.\/|#|@\/|data:)/.test(t)) return true;
  if (/^[a-z0-9_.:/#-]+$/.test(t)) return true; // satu token huruf kecil: kunci, kelas, kode
  if (/^[a-z0-9_:/\-\[\]().%, ]+$/.test(t) && !/\s(di|ke|dan|yang|untuk|dari)\s/.test(t) && /[-_:]/.test(t)) return true;
  return false;
}

const temuan = [];

function periksa(teks, file, baris, opsi = {}) {
  if (!teks || mirip_kode(teks)) return;
  let t = teks;
  for (const f of PENGECUALIAN.frasa ?? []) t = t.split(f).join(" ");
  const kecualiBerkas = PENGECUALIAN.berkas?.[file] ?? [];
  for (const a of ATURAN) {
    if (a.kecuali?.test(file)) continue;
    if (a.nama && opsi.nama) continue;
    if (kecualiBerkas.includes(a.id)) continue;
    const m = a.re.exec(t);
    if (m) temuan.push({ file, baris, aturan: a.id, cocok: m[0].trim(), teks: teks.trim().slice(0, 110) });
  }
}

function jalani(dir, hasil = []) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) jalani(p, hasil);
    else hasil.push(p);
  }
  return hasil;
}

/** Alat internal dan mode yang disembunyikan selamanya atau menunggu ilustrasi (pedoman bagian 6). */
const LEWATI = /^(app\/admin\/|app\/api\/|features\/tukang\/admin\/|app\/mural\/|features\/mural\/)/;

function periksaKode(path) {
  const file = rel(path);
  if (LEWATI.test(file)) return;
  const kode = readFileSync(path, "utf8");
  const sf = ts.createSourceFile(path, kode, ts.ScriptTarget.Latest, true, path.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const barisDari = (n) => sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1;

  const kunjungi = (n) => {
    // Bagian bahasa Inggris Loket Makan punya aturan sendiri (pedoman 2.10).
    if (ts.isPropertyAssignment(n) && n.name.getText(sf).replace(/["']/g, "") === "en") return;
    if (ts.isImportDeclaration(n) || ts.isExportDeclaration(n) || ts.isTypeNode(n)) return;

    if (ts.isJsxAttribute(n)) {
      const nama = n.name.getText(sf);
      if (BUKAN_TEKS.test(nama)) return;
    }
    if (ts.isPropertyAssignment(n)) {
      const nama = n.name.getText(sf).replace(/["']/g, "");
      // Hanya nilai string yang dilewati: blok `id: { ... }` di i18n tetap teks untuk pembaca.
      const s = n.initializer;
      if (BUKAN_TEKS.test(nama) && (ts.isStringLiteralLike(s) || ts.isTemplateExpression(s))) return;
    }
    if (ts.isCallExpression(n)) {
      const f = n.expression;
      const nama = ts.isPropertyAccessExpression(f) ? f.name.getText(sf) : f.getText(sf);
      if (FUNGSI_KODE.test(nama)) return;
    }
    if (ts.isNewExpression(n) && /Error|RegExp|URL/.test(n.expression.getText(sf))) return;
    if (ts.isBinaryExpression(n) && /[=!]==?/.test(n.operatorToken.getText(sf))) return;
    if (ts.isCaseClause(n)) {
      n.statements.forEach(kunjungi);
      return;
    }

    if (ts.isJsxText(n)) periksa(n.getText(sf), file, barisDari(n));
    else if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) periksa(n.text, file, barisDari(n));
    else if (ts.isTemplateExpression(n)) {
      periksa(n.head.text, file, barisDari(n));
      n.templateSpans.forEach((s) => {
        kunjungi(s.expression);
        periksa(s.literal.text, file, barisDari(s));
      });
      return;
    }
    ts.forEachChild(n, kunjungi);
  };
  kunjungi(sf);
}

/** Kolom data yang bukan teks untuk pembaca, atau disaring sebelum tampil. */
const KOLOM_LEWAT =
  /^(id|slug|url|[\w]*_url|[\w]*url|sumber|sumber_[\w]*|source|source[\w]*|kode|code|lat|lng|icon|ikon|catatan_laporan|catatan_internal|catatan_kerja|catatan_penyusun|tanggal_data|status_data|status_koordinat|kategori|subkategori|jam[\w]*|berangkat|tiba|tautan[\w]*|link|en|name_en|desc_en|description_en|tags|referensi|lisensi|hash|file|gambar|foto|geometry)$/i;
/** Kolom berisi nama diri: ejaan aslinya dipertahankan (pedoman 8.3). */
const KOLOM_NAMA = /^(nama|name|nama_[\w]*|operator|alamat|alamat_[\w]*|jalan|terminal|lokasi|tempat|penerbit|judul_asli|media)$/i;

const DATA_TAMPIL = [
  "data/budaya/acara.json",
  "data/budaya/fakta_infografis.json",
  "data/budaya/kamus.json",
  "data/budaya/komunitas.json",
  "data/budaya/tradisi_melayu.json",
  "data/darurat/nomor_darurat.json",
  "data/darurat/nomor_darurat_09.json",
  "data/design/microcopy.json",
  "data/feri/rute.json",
  "data/feri/terminal.json",
  "data/kampung_tua/kampung_tua.json",
  "data/kampung_tua/kronologi_legalitas.json",
  "data/makan/areas.json",
  "data/makan/categories.json",
  "data/makan/places.json",
  "data/makan/trails.json",
  "data/panduan/09-rute_pompong.json",
  "data/panduan/urusan_tanah.json",
  "data/sejarah/garis_waktu.json",
  "data/sejarah/perubahan_fisik.json",
  "data/statistik/angka_resmi.json",
  "data/tokoh/tokoh.json",
  "data/trans_batam/info_praktis.json",
  "data/trans_batam/koridor.json",
];

function periksaData(file) {
  let akar;
  try {
    akar = JSON.parse(readFileSync(join(ROOT, file), "utf8"));
  } catch {
    return;
  }
  const kunjungi = (v, kunci, jejak) => {
    if (typeof v === "string") {
      periksa(v, file, jejak, { nama: KOLOM_NAMA.test(kunci ?? "") });
    } else if (Array.isArray(v)) {
      v.forEach((x, i) => kunjungi(x, kunci, `${jejak}[${i}]`));
    } else if (v && typeof v === "object") {
      for (const [k, x] of Object.entries(v)) {
        if (KOLOM_LEWAT.test(k)) continue;
        kunjungi(x, k, jejak ? `${jejak}.${k}` : k);
      }
    }
  };
  kunjungi(akar, null, "");
}

const berkasKode = ["app", "features", "components", "lib"]
  .flatMap((d) => jalani(join(ROOT, d)))
  .filter((p) => /\.tsx?$/.test(p) && !/\.d\.ts$/.test(p));
berkasKode.forEach(periksaKode);
DATA_TAMPIL.forEach(periksaData);

const ringkas = process.argv.includes("--ringkas");
if (temuan.length) {
  const perBerkas = new Map();
  for (const t of temuan) perBerkas.set(t.file, (perBerkas.get(t.file) ?? 0) + 1);
  const perAturan = new Map();
  for (const t of temuan) perAturan.set(t.aturan, (perAturan.get(t.aturan) ?? 0) + 1);
  if (ringkas) {
    console.log([...perAturan].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}=${v}`).join(" "));
    for (const [f, n] of [...perBerkas].sort((a, b) => b[1] - a[1])) console.log(String(n).padStart(5), f);
  } else {
    for (const t of temuan) console.log(`${t.file}:${t.baris} [${t.aturan}] "${t.cocok}" — ${t.teks}`);
  }
  console.error(`\ncek-bahasa: ${temuan.length} temuan di ${perBerkas.size} berkas.`);
  process.exit(1);
}
console.log("cek-bahasa: lulus.");
