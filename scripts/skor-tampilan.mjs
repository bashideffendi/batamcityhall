// Skor tampilan per halaman (docs/PEDOMAN.md 7.2) terhadap server yang sedang jalan.
//   node scripts/skor-tampilan.mjs <label> [URL dasar, bawaan http://localhost:3100]
// Hasil: docs/tampilan/skor/<label>.json dan ringkasan di stdout. Skor 0—2 lolos, 3 ke atas direvisi.
//
// Mesin hanya memeriksa yang bisa diperiksa. Butir 8 (kalimat bisa dipindah ke kota lain) dan sebagian
// butir 10 (tombol tampak bisa diklik tetapi mati) perlu dibaca orang, jadi nilainya berasal dari
// CATATAN_MANUAL di bawah, bukan dari hitungan otomatis.
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const label = process.argv[2] ?? "uji";
const BASE = process.argv[3] ?? "http://localhost:3100";

// Nomor mengikuti galeri screenshot di pedoman 8.2 bila ada padanannya.
export const HALAMAN = [
  ["/", "Beranda"],
  ["/cuaca", "Cuaca dan Laut"],
  ["/cuaca/hujan", "Radar Hujan"],
  ["/cuaca/gelombang", "Tinggi Gelombang"],
  ["/cuaca/cctv", "CCTV Lalu Lintas"],
  ["/cuaca/peringatan", "Peringatan Dini Cuaca"],
  ["/cuaca/gempa", "Gempa Terkini"],
  ["/makan", "Makan"],
  ["/makan/peta", "Makan: peta"],
  ["/makan/hidangan", "Makan: hidangan"],
  ["/makan/hidangan/sup-ikan", "Makan: satu hidangan"],
  ["/makan/panduan", "Makan: panduan"],
  ["/makan/panduan/halal-nagoya", "Makan: satu panduan"],
  ["/makan/panduan/sarapan", "Makan: panduan hitungan"],
  ["/makan/kawasan", "Makan: kawasan"],
  ["/makan/kawasan/bengkong", "Makan: satu kawasan"],
  ["/makan/dekat-feri", "Makan: dekat feri"],
  ["/makan/tempat/golden-prawn-933", "Makan: detail tempat"],
  ["/makan/simpanan", "Makan: simpanan"],
  ["/makan/cara-memilih", "Makan: cara memilih"],
  ["/tukang", "Tukang Langganan"],
  ["/tukang/rekomendasi", "Kirim Rekomendasi"],
  ["/jalan", "Transportasi"],
  ["/jalan/trans-batam", "Trans Batam"],
  ["/jalan/trans-batam/k1", "Koridor 1"],
  ["/jalan/peta", "Peta Transportasi"],
  ["/jalan/feri", "Feri"],
  ["/jalan/feri/panduan", "Panduan Menyeberang"],
  ["/jalan/pompong", "Pompong"],
  ["/cerita", "Cerita dan Budaya"],
  ["/cerita/sejarah", "Sejarah Batam"],
  ["/cerita/kampung-tua", "Kampung Tua"],
  ["/cerita/nama-jalan", "Siapa di Balik Nama Jalan"],
  ["/cerita/kalender", "Kalender Acara"],
  ["/cerita/kamus", "Kamus"],
  ["/cerita/budaya", "Budaya Melayu"],
  ["/cerita/komunitas", "Komunitas"],
  ["/cerita/angka", "Batam dalam Angka"],
  ["/info", "Informasi Warga"],
  ["/info/direktori", "Direktori"],
  ["/info/direktori/kesehatan", "Direktori: kategori"],
  ["/info/kecamatan/batam-kota", "Kecamatan"],
  ["/info/darurat", "Nomor Darurat"],
  ["/info/urusan-tanah", "Urusan Tanah dan Rumah"],
  ["/info/bantuan-hukum", "Bantuan Hukum"],
  ["/info/jasa-dokumen", "Jasa Dokumen dan Usaha"],
  ["/info/berita", "Berita Batam"],
  ["/main", "Ruang Main"],
  ["/main/kartu-pos", "Kartu Pos"],
  ["/main/singapura-atau-nagoya", "Singapura atau Nagoya"],
  ["/tentang", "Tentang"],
  ["/kolofon", "Kolofon"],
  ["/koreksi", "Kirim Koreksi"],
  ["/kontribusi", "Cara Berkontribusi"],
  ["/privasi", "Kebijakan Privasi"],
  ["/syarat", "Syarat Penggunaan"],
  ["/tidak-ada-halaman-ini", "404"],
];

// Alamat lama, dipakai selama halaman barunya belum ada (tahap sebelum 4).
const ALAMAT_LAMA = {
  "/cuaca/hujan": "/langit-laut?mode=hujan",
  "/cuaca/gelombang": "/langit-laut?mode=ombak",
  "/cuaca/cctv": "/langit-laut?mode=cctv",
  "/cuaca/peringatan": "/langit-laut/peringatan",
  "/cuaca/gempa": "/langit-laut/gempa",
};

/** Penilaian orang untuk butir yang tidak bisa dihitung mesin: { "/alamat": { 8: "alasan", 10: "alasan" } } */
const CATATAN_MANUAL = {};

async function periksaDesktop(page) {
  return page.evaluate(() => {
    const main = document.querySelector("main") ?? document.body;
    const latarDasar = getComputedStyle(document.body).backgroundColor;
    const berbingkai = (el) => {
      const s = getComputedStyle(el);
      const sisi = ["Top", "Right", "Bottom", "Left"].filter(
        (k) => parseFloat(s[`border${k}Width`]) > 0 && s[`border${k}Style`] !== "none",
      ).length;
      const bg = s.backgroundColor;
      const adaLatar = bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent" && bg !== latarDasar;
      return sisi >= 3 || adaLatar || s.boxShadow !== "none";
    };
    const lewati = "button, [role=button], select, input, textarea, nav, .maplibregl-map, svg, script, style";

    // 1. Porsi teks di dalam kotak
    let semua = 0;
    let dalamKotak = 0;
    const w = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) {
      const t = w.currentNode.textContent.trim();
      const el = w.currentNode.parentElement;
      if (!t || !el || el.closest(lewati) || el.offsetParent === null) continue;
      semua += t.length;
      let a = el;
      while (a && a !== main) {
        if (berbingkai(a)) {
          dalamKotak += t.length;
          break;
        }
        a = a.parentElement;
      }
    }
    const porsiKotak = semua ? dalamKotak / semua : 0;

    // 2. Lebih dari satu label status per objek
    const LABEL = ".bch-badge, .bch-status, [data-label-status]";
    const objek = new Map();
    for (const l of main.querySelectorAll(LABEL)) {
      const o = l.closest("li, tr, article, .bch-card") ?? l.parentElement;
      objek.set(o, (objek.get(o) ?? 0) + 1);
    }
    const labelGanda = [...objek.values()].filter((n) => n > 1).length;

    // 3. Kotak catatan
    const kotakCatatan = [...main.querySelectorAll('.bch-note, [role="note"]')].filter((el) => {
      const s = getComputedStyle(el);
      return berbingkai(el) || (parseFloat(s.borderLeftWidth) > 0 && s.borderLeftStyle !== "none");
    }).length;

    const teks = main.innerText;
    const teksBadan = document.body.innerText;

    // 4. Catatan kerja
    const catatanKerja = [
      ...new Set(
        (
          teks.match(
            /belum dicek ulang|lokasi belum diisi|perlu cek ulang|data lama|sumber sekunder|jam dari berita|tidak menebak|tautan belum tercatat|menyangkut status lahan|\bdraf\b|\bbeta\b|placeholder|segera hadir|belum diverifikasi/gi,
          ) ?? []
        ).map((x) => x.toLowerCase()),
      ),
    ];

    // 5. Label satu kata tanpa waktu atau satuan di area data
    const satuKata = [...main.querySelectorAll("dd, dd a, .answer, .kv dd, [data-area-data] *")]
      .filter((e) => !e.children.length && !e.classList.contains("nilai"))
      .map((e) => e.textContent.trim())
      .filter((x) => /^(Ringan|Sedang|Lebat|Tenang|Rendah|Tinggi|Baik|Hujan|Aman)$/.test(x));

    // 6. Kalimat jenaka
    const jenaka = [
      ...new Set(
        teksBadan.match(
          /itik sedang berbaris|tenggelam|laut masih ada|kami saja yang belum|balai warga, bukan balai kota/gi,
        ) ?? [],
      ),
    ];

    // 7. Sebutan pemerintah atau tautan sumber
    // Pengecualian 7.1: Kolofon dan Berita boleh menyebut sumber dan menaut ke artikelnya.
    const tautanGo = [...document.querySelectorAll("a[href]")]
      .filter((a) => !a.closest(".bch-berita-widget, .bch-berita-daftar, .bch-berita-hari"))
      .map((a) => a.getAttribute("href"))
      .filter((h) => /^https?:\/\/[^/]*\.go\.id/i.test(h));
    const sebutan = [
      ...new Set(teksBadan.match(/bukan situs resmi|layanan resmi|cek langsung|\bsumber:|\bmenurut:/gi) ?? []),
    ];

    // 10. Yang pasti mati: tautan kosong
    const mati = main.querySelectorAll('a[href="#"], a:not([href])').length;

    return {
      porsiKotak: Math.round(porsiKotak * 100),
      labelGanda,
      kotakCatatan,
      catatanKerja,
      satuKata: [...new Set(satuKata)],
      jenaka,
      tautanGo: [...new Set(tautanGo)].length,
      sebutan,
      mati,
      judul: document.querySelector("h1")?.innerText?.trim() ?? "",
    };
  });
}

async function periksaPonsel(page) {
  return page.evaluate(() => {
    const tinggi = window.innerHeight;
    const utama = document.querySelector("h1, .answer");
    const cari = [...document.querySelectorAll('main input[type="search"], main input[placeholder*="Cari"]')].find(
      (e) => e.offsetParent !== null,
    );
    const r = (e) => e.getBoundingClientRect();
    return {
      utamaTerlihat: !!utama && r(utama).top < tinggi && r(utama).bottom <= tinggi,
      adaCari: !!cari,
      cariTerlihat: !cari || r(cari).bottom <= tinggi,
      lebarLuber: document.documentElement.scrollWidth > window.innerWidth + 1,
    };
  });
}

function nilai(d, p, alamat) {
  const manual = CATATAN_MANUAL[alamat] ?? {};
  const butir = {
    1: d.porsiKotak > 50 ? `${d.porsiKotak}% teks di dalam kotak` : "",
    2: d.labelGanda ? `${d.labelGanda} objek berlabel ganda` : "",
    3: d.kotakCatatan > 1 ? `${d.kotakCatatan} kotak catatan` : "",
    4: d.catatanKerja.join(", "),
    5: d.satuKata.join(", "),
    6: d.jenaka.join(", "),
    7: [...d.sebutan, d.tautanGo ? `${d.tautanGo} tautan .go.id` : ""].filter(Boolean).join(", "),
    8: manual[8] ?? "",
    9: !p.utamaTerlihat ? "judul tidak di layar pertama ponsel" : !p.cariTerlihat ? "kolom cari di bawah layar pertama" : "",
    10: [d.mati ? `${d.mati} tautan kosong` : "", manual[10] ?? ""].filter(Boolean).join(", "),
  };
  const kena = Object.entries(butir).filter(([, v]) => v);
  return { skor: kena.length, butir: Object.fromEntries(kena) };
}

const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const hasil = [];
let berikut = 0;
async function pekerja() {
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "id-ID" });
  const ponsel = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: "id-ID" });
  const pd = await desktop.newPage();
  const pp = await ponsel.newPage();
  while (berikut < HALAMAN.length) {
    const [alamat, nama] = HALAMAN[berikut++];
    let url = alamat;
    try {
      const uji = await pd.goto(BASE + url, { waitUntil: "load", timeout: 90000 });
      if (uji?.status() === 404 && ALAMAT_LAMA[alamat]) {
        url = ALAMAT_LAMA[alamat];
        await pd.goto(BASE + url, { waitUntil: "load", timeout: 90000 });
      } else if (uji?.status() === 404 && alamat === "/cuaca") {
        hasil.push({ alamat, nama, skor: null, butir: { catatan: "halaman belum ada" } });
        continue;
      }
      await pd.waitForTimeout(1500);
      const d = await periksaDesktop(pd);
      await pp.goto(BASE + url, { waitUntil: "load", timeout: 90000 });
      await pp.waitForTimeout(1200);
      const p = await periksaPonsel(pp);
      hasil.push({ alamat, nama, ...nilai(d, p, alamat), rincian: { ...d, ...p } });
    } catch (e) {
      hasil.push({ alamat, nama, skor: null, butir: { galat: String(e).slice(0, 160) } });
    }
    process.stderr.write(".");
  }
  await desktop.close();
  await ponsel.close();
}
await Promise.all([pekerja(), pekerja(), pekerja()]);
await browser.close();

hasil.sort((a, b) => HALAMAN.findIndex((h) => h[0] === a.alamat) - HALAMAN.findIndex((h) => h[0] === b.alamat));
const keluar = join(ROOT, "docs", "tampilan", "skor", `${label}.json`);
mkdirSync(dirname(keluar), { recursive: true });
writeFileSync(keluar, JSON.stringify({ label, waktu: new Date().toISOString(), hasil }, null, 1));

const dinilai = hasil.filter((h) => h.skor !== null);
console.log(`\n${label}: ${dinilai.length} halaman, ${dinilai.filter((h) => h.skor <= 2).length} lolos, ${dinilai.filter((h) => h.skor >= 3).length} perlu revisi`);
for (const h of hasil) {
  const rinci = Object.entries(h.butir)
    .map(([k, v]) => `${k}: ${v}`)
    .join("; ");
  console.log(`${String(h.skor ?? "-").padStart(2)}  ${h.alamat.padEnd(32)} ${rinci}`.slice(0, 230));
}
