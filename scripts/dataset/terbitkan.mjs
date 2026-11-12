// Terbitkan bagian arsip yang layak tampil ke repo, untuk menu Dataset (keputusan pemilik 9 Nov 2026:
// penyedia disebut sebagai teks biasa, tanpa tautan; berkas mentah tidak ditawarkan untuk diunduh).
//   node scripts/dataset/terbitkan.mjs
// Masukan: dataset-arsip/ (tidak ikut repo). Keluaran: data/dataset/katalog.json dan data/dataset/pratinjau/<slug>.json.
// Yang tidak diterbitkan: tabel Kepri tanpa baris Batam, tabel kosong, kolom pajak atau data pribadi, dan dataset yang
// sensitif secara sosial (penemuan pekerja liar, penertiban, pengamanan unjuk rasa).
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ARSIP, ROOT, terlarang } from "./sopan.mjs";

const KELUAR = join(ROOT, "data", "dataset");
const PRATINJAU = join(KELUAR, "pratinjau");
const MAKS_BARIS = 50;
const KOLOM_PRIBADI =
  /^(nik|nip|no_?kk|kk|ktp|no_?ktp|nama_?kk|kepala_?kel|no_?hp|hp|telp|telepon|email|no_?kontak|kontak|pemilik)$/i;
const KOLOM_PAJAK = /pajak|pbjt|retribusi|npwpd|sspd|sptpd/i;
const SENSITIF = /pekerja liar|penertiban|unjuk rasa/i;
// Kolom tautan dan foto (misalnya img_link ke penyimpanan foto penyedia) tidak ditampilkan: hak cipta foto tidak jelas,
// dan PEDOMAN melarang tautan ke situs pemerintah.
const KOLOM_TAUTAN = /(img|foto|gambar|image|photo|link|url|^sumber_?dat)/i;
/** Sel berisi tag HTML atau alamat web dikosongkan. */
const selAman = (v) => (/<[a-z][^>]*>|https?:\/\/|www\.|\.go\.id\b/i.test(v) ? "" : v);

const PENYEDIA = {
  "satudata-batam": "Satu Data Kota Batam",
  "satudata-kepri": "Satu Data Provinsi Kepulauan Riau",
  "bpbatam-data": "Portal Satu Data BP Batam",
  "bpbatam-geoportal": "Geoportal BP Batam",
  hangjebat: "HANG JEBAT Geoportal",
};

// Urutan menentukan: aturan pertama yang cocok menang.
// Kata utuh saja: "pulau" tidak boleh cocok di "Kepulauan Riau", "rth" tidak di "Forth".
const kata = (...k) => new RegExp(`(^|[^a-z])(${k.join("|")})(?![a-z])`, "i");
const TEMA = [
  [
    "kesehatan",
    "Kesehatan",
    kata(
      "kesehatan",
      "puskesmas",
      "rumah sakit",
      "faskes",
      "stunting",
      "posyandu",
      "penyakit",
      "imunisasi",
      "gizi",
      "pasien",
      "medis",
      "klinik",
      "farmasi",
      "harapan hidup",
      "kematian ibu",
      "kematian bayi",
      "jamkesda",
      "universal health coverage",
      "tenaga medis",
    ),
  ],
  [
    "pendidikan",
    "Pendidikan",
    kata(
      "sekolah",
      "sd",
      "smp",
      "sma",
      "smk",
      "slb",
      "tk",
      "paud",
      "guru",
      "murid",
      "siswa",
      "pendidikan",
      "perpustakaan",
      "pustaka",
      "lulusan",
      "partisipasi \\w+",
    ),
  ],
  [
    "kependudukan",
    "Kependudukan",
    kata(
      "penduduk",
      "kependudukan",
      "kepala keluarga",
      "akta \\w+",
      "kelahiran",
      "kematian",
      "keluarga berencana",
      "kb",
      "agama",
      "umur",
      "jenis kelamin",
      "lansia",
    ),
  ],
  [
    "perumahan",
    "Perumahan dan Permukiman",
    kata(
      "perumahan",
      "rusun",
      "rusunawa",
      "psu",
      "permukiman",
      "kumuh",
      "rumah di atas air",
      "pju",
      "penerangan jalan umum",
      "drainase",
      "batu miring",
      "gedung serbaguna",
      "sanitasi",
      "air minum",
    ),
  ],
  [
    "lingkungan",
    "Air, Lingkungan, dan Bencana",
    kata(
      "air baku",
      "air bersih",
      "waduk",
      "ipa",
      "wtp",
      "olah air minum",
      "sampah",
      "limbah",
      "lingkungan hidup",
      "kualitas udara",
      "kualitan udara",
      "bencana",
      "banjir",
      "kebakaran",
      "longsor",
      "puting beliung",
      "cuaca",
      "kontur",
      "kebun raya",
      "rth",
      "taman",
      "hutan",
      "mangrove",
    ),
  ],
  [
    "transportasi",
    "Transportasi dan Pelabuhan",
    kata(
      "penumpang",
      "kapal penumpang",
      "kunjungan kapal",
      "pelabuhan",
      "bandara",
      "bandar udara",
      "penerbangan",
      "trans batam",
      "angkutan",
      "kendaraan",
      "dermaga",
      "bongkar muat",
      "peti kemas",
      "lalu lintas",
      "jalan",
      "chasis",
    ),
  ],
  [
    "pariwisata",
    "Pariwisata",
    kata("wisata", "wisatawan", "wisman", "hotel", "destinasi", "guest house", "taman rusa", "asrama haji"),
  ],
  [
    "ekonomi",
    "Ekonomi, Investasi, dan Usaha",
    kata(
      "ekonomi",
      "investasi",
      "pma",
      "pmdn",
      "umkm",
      "koperasi",
      "wirausaha",
      "ekspor",
      "impor",
      "inflasi",
      "pdrb",
      "harga",
      "pasar",
      "industri\\w*",
      "kek",
      "kawasan ekonomi khusus",
      "tenant",
      "niaga",
      "reklame",
      "pangan",
      "pertanian",
      "perikanan",
      "peternakan",
      "ikan",
      "nib",
      "cold storage",
      "project",
      "cost of doing business",
      "marine",
    ),
  ],
  [
    "tenaga-kerja",
    "Ketenagakerjaan",
    kata("tenaga kerja", "ketenagakerjaan", "pencari kerja", "pengangguran", "tpt", "upah", "angkatan kerja"),
  ],
  [
    "wilayah",
    "Wilayah dan Tata Ruang",
    kata(
      "wilayah",
      "kecamatan",
      "kelurahan",
      "desa",
      "pola ruang",
      "tata ruang",
      "rencana jalan",
      "administrasi",
      "pulau",
      "kawasan",
      "utilitas",
      "kabel listrik",
      "elektrifikasi",
      "berlistrik",
      "tower",
      "menara",
      "tanah",
      "lahan",
    ),
  ],
  [
    "sosial",
    "Sosial dan Ketertiban",
    kata(
      "sosial",
      "miskin",
      "kemiskinan",
      "psks",
      "disabilitas",
      "trantibum",
      "ketertiban",
      "satlinmas",
      "keamanan",
      "kriminal",
    ),
  ],
  ["pemerintahan", "Pemerintahan dan Layanan Publik", /./],
];
const cocokTema = (teks) => TEMA.find(([, , re]) => re.test(teks)) ?? TEMA.at(-1);
/** Judul lebih dulu. Nama produsen hanya dipakai bila judul tidak cocok dengan tema mana pun. */
// Data internal kepegawaian dan kelembagaan, bukan data penduduk atau sekolah.
const INTERNAL = kata("pegawai", "personil", "legislatif", "asn", "pppk", "asrama haji");
// Pokok bahasan yang menang atas kata pembagi seperti "jenis kelamin" atau "rumah tangga".
const PRIORITAS = [
  ["ekonomi", kata("koperasi", "umkm", "wirausaha")],
  ["sosial", kata("kdrt", "kekerasan", "anak jalanan", "terlantar", "disabilitas")],
];
const temaDari = (judul, produsen) => {
  if (INTERNAL.test(judul)) return TEMA.at(-1);
  const utama = PRIORITAS.find(([, re]) => re.test(judul));
  if (utama) return TEMA.find(([id]) => id === utama[0]);
  const t = cocokTema(judul);
  return t[0] !== "pemerintahan" || !produsen ? t : cocokTema(produsen);
};

// Catatan kualitas dari riset 9 Nov 2026 (research/17-portal-data). Ditampilkan apa adanya di halaman dataset.
const CATATAN = [
  [
    /penumpang trans ?batam per ?semester/i,
    "Angka semester 1 tahun 2023 (1.103) dan 2024 (128.131) tidak sebanding. Kemungkinan ada salah catat atau beda definisi di penyedia.",
  ],
  [/jumlah hotel menurut kecamatan/i, "Di penyedia, nilai tahun 2024 sama persis dengan 2022."],
  [
    /kepala keluarga berjenis kelamin laki-laki dan perempuan/i,
    "Angka laki-laki dan perempuan di Batu Aji sama persis di penyedia.",
  ],
  [
    /kunjungan kapal penumpang/i,
    "Kolom GT di penyedia selalu sama dengan jumlah kunjungan (CALL), kemungkinan salah isi.",
  ],
  [
    /profil dermaga|daftar kawasan industri/i,
    "Koordinat di penyedia ditulis sebagai teks derajat, menit, detik yang tidak seragam. Tidak dipakai untuk peta situs.",
  ],
  [
    /kejadian bencana banjir/i,
    "Hanya kejadian yang dilaporkan ke penanggulangan bencana daerah, bukan seluruh kejadian banjir.",
  ],
  [
    /indikator ekonomi makro/i,
    "Nilai di penyedia berupa teks bebas, misalnya persentase dan nilai dolar dalam satu kolom.",
  ],
  [/rencana jalan/i, "Jumlah fitur sangat besar untuk sebuah rencana. Isinya belum ditelaah."],
  [/pola ruang perpres/i, "Rencana tata ruang menurut Perpres 87 Tahun 2011, bukan rencana terbaru."],
];
const catatanUntuk = (judul, sumber) => {
  const c = CATATAN.filter(([re]) => re.test(judul)).map(([, t]) => t);
  if (sumber === "satudata-kepri")
    c.push("Kode wilayah kabupaten lain tidak selalu sama antardataset di penyedia. Kota Batam selalu 21.71.");
  return c;
};

const entitas = (s) =>
  String(s ?? "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
const buatSlug = (s) =>
  entitas(s)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, " ")
    .replace(/_/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 72)
    .replace(/-$/, "");
const periodeDari = (teks) => {
  const th = [...String(teks).matchAll(/\b(19[5-9]\d|20[0-4]\d)\b/g)].map((m) => Number(m[1]));
  if (!th.length) return null;
  const a = Math.min(...th);
  const b = Math.max(...th);
  return a === b ? String(a) : `${a}–${b}`;
};
const nilai = (v) =>
  v === null || v === undefined ? "" : typeof v === "object" ? JSON.stringify(v) : String(v).trim();

/** CSV RFC 4180 sederhana. */
function uraiCsv(teks) {
  const baris = [];
  let sel = "";
  let barisIni = [];
  let kutip = false;
  for (let i = 0; i < teks.length; i++) {
    const c = teks[i];
    if (kutip) {
      if (c === '"' && teks[i + 1] === '"') {
        sel += '"';
        i++;
      } else if (c === '"') kutip = false;
      else sel += c;
    } else if (c === '"') kutip = true;
    else if (c === ",") {
      barisIni.push(sel);
      sel = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && teks[i + 1] === "\n") i++;
      barisIni.push(sel);
      sel = "";
      if (barisIni.some((x) => x !== "")) baris.push(barisIni);
      barisIni = [];
    } else sel += c;
  }
  if (sel !== "" || barisIni.length) {
    barisIni.push(sel);
    baris.push(barisIni);
  }
  return baris;
}

/** Kolom pribadi dan pajak dibuang; kolom teknis CKAN dan indeks teks Kepri juga. */
function saringKolom(kolom, baris) {
  const pakai = kolom
    .map((k, i) => [k, i])
    .filter(([k]) => !KOLOM_PRIBADI.test(k) && !KOLOM_PAJAK.test(k) && !KOLOM_TAUTAN.test(k) && !/^_(id|full_text)$/.test(k));
  return { kolom: pakai.map(([k]) => k), baris: baris.map((b) => pakai.map(([, i]) => selAman(nilai(b[i])))) };
}

// --- dari tiap sumber ke bentuk seragam: { sumber, judul, produsen, jenis, kolom, baris, total, fitur, geometri, diambil } ---
const calon = [];
const manifest = (sumber) => {
  const f = join(ARSIP, sumber, "_manifest.json");
  return existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) : [];
};
const bacaArsip = (berkas) => readFileSync(join(ARSIP, berkas), "utf8");

for (const m of manifest("satudata-batam")) {
  if (!["diunduh", "sudah_ada"].includes(m.status) || !m.berkas) continue;
  const d = JSON.parse(bacaArsip(m.berkas));
  const judul = entitas(d.judul || m.judul);
  let kolom;
  let baris;
  if (d.data && typeof d.data === "object") {
    const luar = Object.keys(d.data);
    const bersarang = luar.every((k) => d.data[k] && typeof d.data[k] === "object");
    if (bersarang) {
      const dalam = [...new Set(luar.flatMap((k) => Object.keys(d.data[k])))];
      kolom = ["Wilayah atau Rincian", ...luar];
      baris = dalam.map((r) => [r, ...luar.map((k) => nilai(d.data[k][r]))]);
    } else {
      kolom = ["Rincian", "Nilai"];
      baris = luar.map((k) => [k, nilai(d.data[k])]);
    }
  } else {
    kolom = ["Nilai"];
    baris = [[nilai(d.data)]];
  }
  calon.push({
    sumber: "satudata-batam",
    judul,
    produsen: entitas(d.produsen_data) || null,
    satuan: d.satuan && d.satuan !== "-" ? entitas(d.satuan) : null,
    rilis: d.tanggal_rilis || null,
    jenis: "tabel",
    kolom,
    baris,
    diambil: m.diakses,
  });
}

for (const m of manifest("satudata-kepri")) {
  if (!["diunduh", "sudah_ada"].includes(m.status) || !m.memuat_batam) continue;
  const rows = JSON.parse(bacaArsip(m.berkas));
  if (!Array.isArray(rows) || !rows.length) continue;
  const kolom = [...new Set(rows.flatMap((r) => Object.keys(r)))];
  // Nama bagian tabel di Kepri biasanya judul yang lebih rinci (misalnya Rumah Sakit dari kelompok Fasilitas Kesehatan).
  const rinci = entitas(m.sumber_daya ?? "").replace(/^dataset ini berisi(kan)? (data )?/i, "");
  const judul = rinci.length >= 15 ? rinci[0].toUpperCase() + rinci.slice(1) : entitas(m.judul);
  calon.push({
    sumber: "satudata-kepri",
    judul,
    produsen: entitas(m.produsen) || null,
    jenis: "tabel",
    kolom,
    baris: rows.map((r) => kolom.map((k) => r[k])),
    diambil: m.diakses,
  });
}

for (const m of manifest("bpbatam-data")) {
  if (!["diunduh", "sudah_ada"].includes(m.status) || !m.berkas?.endsWith(".csv")) continue;
  const csv = uraiCsv(bacaArsip(m.berkas).replace(/^﻿/, ""));
  if (csv.length < 2) continue;
  calon.push({
    sumber: "bpbatam-data",
    judul: entitas(m.judul),
    produsen: entitas(m.organisasi) || null,
    jenis: "tabel",
    kolom: csv[0],
    baris: csv.slice(1),
    diambil: m.diakses,
  });
}

for (const sumber of ["bpbatam-geoportal", "hangjebat"]) {
  for (const m of manifest(sumber)) {
    if (!["diunduh", "sudah_ada"].includes(m.status) || !m.berkas) continue;
    const g = JSON.parse(bacaArsip(m.berkas));
    const fitur = g.features ?? [];
    if (!fitur.length) continue;
    const kolom = [...new Set(fitur.flatMap((f) => Object.keys(f.properties ?? {})))];
    const geometri = [...new Set(fitur.map((f) => f.geometry?.type).filter(Boolean))];
    calon.push({
      sumber,
      judul: entitas(m.judul),
      produsen: sumber === "hangjebat" ? "Dinas Perumahan, Kawasan Permukiman dan Pertamanan Kota Batam" : "BP Batam",
      jenis: "peta",
      kolom,
      baris: fitur.map((f) => kolom.map((k) => f.properties?.[k])),
      fitur: fitur.length,
      geometri,
      diambil: m.diakses,
    });
  }
}

// --- saring, beri slug dan tema, tulis ---
rmSync(PRATINJAU, { recursive: true, force: true });
mkdirSync(PRATINJAU, { recursive: true });
const dipakai = new Set();
const katalog = [];
const dibuang = { pajak: 0, sensitif: 0, kosong: 0 };
/** Judul dari penyedia dirapikan sedikit: label teknis berkurung di depan dibuang, spasi ganda disatukan, huruf
 *  pertama kapital. Isi judul lainnya tidak diubah. */
const rapikanJudul = (s) => {
  const t = s.replace(/^\s*\[[^\]]*\]\s*/, "").replace(/\s+/g, " ").trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
};
for (const c of calon) {
  c.judul = rapikanJudul(c.judul);
  if (terlarang(c.judul)) {
    dibuang.pajak++;
    continue;
  }
  if (SENSITIF.test(c.judul)) {
    dibuang.sensitif++;
    continue;
  }
  const { kolom, baris } = saringKolom(
    c.kolom.map((k) => entitas(k)),
    c.baris,
  );
  if (!kolom.length || !baris.length) {
    dibuang.kosong++;
    continue;
  }
  let slug = buatSlug(c.judul) || "dataset";
  for (let n = 2; dipakai.has(slug); n++) slug = `${buatSlug(c.judul).slice(0, 68)}-${n}`;
  dipakai.add(slug);
  const [tema] = temaDari(c.judul, c.produsen);
  const entri = {
    slug,
    judul: c.judul,
    tema,
    penyedia: PENYEDIA[c.sumber],
    produsen: c.produsen,
    jenis: c.jenis,
    periode: periodeDari(c.judul),
    ...(c.satuan ? { satuan: c.satuan } : {}),
    ...(c.rilis ? { rilis: c.rilis } : {}),
    jumlah: c.jenis === "peta" ? c.fitur : baris.length,
    kolom: kolom.length,
    ...(c.geometri ? { geometri: c.geometri } : {}),
    diambil: c.diambil,
    catatan: catatanUntuk(c.judul, c.sumber),
  };
  katalog.push(entri);
  writeFileSync(join(PRATINJAU, `${slug}.json`), JSON.stringify({ kolom, baris: baris.slice(0, MAKS_BARIS) }));
}
katalog.sort((a, b) => a.tema.localeCompare(b.tema) || a.judul.localeCompare(b.judul, "id"));
// Judul kembar (dua tabel dalam satu dataset) diberi pembeda.
const hitungJudul = new Map();
for (const e of katalog) hitungJudul.set(e.judul, (hitungJudul.get(e.judul) ?? 0) + 1);
const keJudul = new Map();
for (const e of katalog) {
  if (hitungJudul.get(e.judul) < 2) continue;
  const n = (keJudul.get(e.judul) ?? 0) + 1;
  keJudul.set(e.judul, n);
  if (n > 1) e.judul = `${e.judul} (Bagian ${n})`;
}
writeFileSync(
  join(KELUAR, "katalog.json"),
  JSON.stringify({ tema: TEMA.map(([id, nama]) => ({ id, nama })), dataset: katalog }, null, 1) + "\n",
);
const perTema = katalog.reduce((a, e) => ((a[e.tema] = (a[e.tema] ?? 0) + 1), a), {});
const ukuran = readdirSync(PRATINJAU).reduce((a, f) => a + readFileSync(join(PRATINJAU, f)).length, 0);
console.log(
  `terbit: ${katalog.length} dataset, pratinjau ${(ukuran / 1e6).toFixed(1)} MB`,
  perTema,
  "dibuang",
  dibuang,
);
