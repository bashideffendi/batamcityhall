// Membuat ilustrasi PLACEHOLDER satu segmen mural beserta tile DZI dan data pikselnya.
// Bukan karya ilustrator. Ilustrasi asli lewat pipeline vips dzsave ke R2, lihat docs/MURAL.md.
//
//   node scripts/buat-mural-placeholder.mjs
//
// Keluaran (semua boleh ditimpa, hasilnya sama selama data dan versi Chromium sama):
//   public/mural/<segmen>/segmen.dzi            deskriptor Deep Zoom
//   public/mural/<segmen>/segmen_files/L/C_R.webp  tile 512 px, overlap 1, WebP
//   public/mural/<segmen>/meta.json             poligon kecamatan, daratan, rute feri, titik, lampu (piksel)
//   data/mural/<segmen>.gcps.json               GCP placeholder, ganti dengan hasil /mural/gcp
//
// Tanpa dependensi native: gambar dan potongan tile dibuat Chromium milik Playwright yang sudah terpasang.
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { GcpTransformer } from "@allmaps/transform";
import { chromium } from "@playwright/test";

const AKAR = join(dirname(fileURLToPath(import.meta.url)), "..");
const baca = async (p) => JSON.parse(await readFile(join(AKAR, p), "utf8"));

const SEGMEN = "harbourbay-nagoya-jodoh";
const LEBAR = 4096;
const TINGGI = 2560;
const TILE = 512;
const OVERLAP = 1;
const KUALITAS = 0.72;

// Bingkai segmen. Rasionya sama dengan kanvas, supaya skala utara-selatan dan barat-timur tidak berbeda jauh.
const BINGKAI = { barat: 103.982, timur: 104.03, utara: 1.167, selatan: 1.137 };

const keLng = (x) => BINGKAI.barat + (x / LEBAR) * (BINGKAI.timur - BINGKAI.barat);
const keLat = (y) => BINGKAI.utara - (y / TINGGI) * (BINGKAI.utara - BINGKAI.selatan);

// Geseran gambar dari koordinat data, dalam piksel: titik di pusat Nagoya berjarak puluhan meter dan pin-nya
// akan bertumpuk. Karena itu kartu dan label selalu menyebut "bukan posisi tepat".
const GESER = {
  "terminal-feri-harbour-bay": [-40, 40],
  "kawasan-nagoya": [-300, 40],
  "nagoya-hill-mall": [-120, 300],
  "kopi-harum-manis": [100, 210],
  "trans-batam": [320, 170],
  "pasar-jodoh": [260, -130],
  "tanjung-uma": [-40, 0],
  "pelabuhan-batu-ampar": [0, 0],
};

// Rute feri di ruang geografis: mulai dari koordinat terminal (terverifikasi), lalu garis skema ke tepi mural.
// Titik ujung di Singapura tidak punya koordinat terverifikasi, jadi garisnya berhenti di tepi bingkai.
const ruteFeri = (hb) => [
  {
    id: "hb-hfc",
    keterangan: "Garis skema dari Harbour Bay ke tepi mural. Geometri perkiraan, bukan lintasan sebenarnya.",
    geo: [
      [hb.lng, hb.lat],
      [103.99513, 1.15317],
      [103.99138, 1.15528],
      [103.9861, 1.15856],
      [103.982, 1.16044],
    ],
  },
];

// Meter per derajat di dekat khatulistiwa.
const METER_PER_DERAJAT = 111_320;

/** Rapatkan tepi poligon tiap `m` meter sebelum transformasi (research/02: densify ~200 m). */
function rapatkan(cincin, m = 200) {
  const hasil = [];
  for (let i = 0; i < cincin.length - 1; i++) {
    const [a, b] = [cincin[i], cincin[i + 1]];
    const jarak = Math.hypot(a[0] - b[0], a[1] - b[1]) * METER_PER_DERAJAT;
    const n = Math.max(1, Math.ceil(jarak / m));
    for (let k = 0; k < n; k++) hasil.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]);
  }
  hasil.push(cincin[cincin.length - 1]);
  return hasil;
}

/** Douglas-Peucker. Cincin tertutup dipecah di titik terjauh dulu, kalau tidak ujungnya berimpit. */
function sederhanakan(titik, toleransi) {
  if (titik.length < 3) return titik;
  const [x0, y0] = titik[0];
  const [xN, yN] = titik[titik.length - 1];
  if (x0 === xN && y0 === yN) {
    let tengah = 1;
    let jauh = -1;
    titik.forEach(([x, y], i) => {
      const d = Math.hypot(x - x0, y - y0);
      if (d > jauh) {
        jauh = d;
        tengah = i;
      }
    });
    return [
      ...sederhanakan(titik.slice(0, tengah + 1), toleransi).slice(0, -1),
      ...sederhanakan(titik.slice(tengah), toleransi),
    ];
  }
  const simpan = new Uint8Array(titik.length);
  simpan[0] = simpan[titik.length - 1] = 1;
  const tumpuk = [[0, titik.length - 1]];
  while (tumpuk.length) {
    const [a, b] = tumpuk.pop();
    const [ax, ay] = titik[a];
    const [bx, by] = titik[b];
    const dx = bx - ax;
    const dy = by - ay;
    const pjg = Math.hypot(dx, dy) || 1;
    let jauh = 0;
    let idx = -1;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs(dy * titik[i][0] - dx * titik[i][1] + bx * ay - by * ax) / pjg;
      if (d > jauh) {
        jauh = d;
        idx = i;
      }
    }
    if (jauh > toleransi && idx > 0) {
      simpan[idx] = 1;
      tumpuk.push([a, idx], [idx, b]);
    }
  }
  return titik.filter((_, i) => simpan[i]);
}

const bulat = (n) => Math.round(n);

function warnaToken(css) {
  const ambil = (nama) => {
    const m = css.match(new RegExp(`--${nama}:\\s*(#[0-9A-Fa-f]{6})`));
    if (!m) throw new Error(`token ${nama} tidak ditemukan`);
    return m[1];
  };
  return {
    kertas: ambil("bch-paper"),
    kertas2: ambil("bch-paper-2"),
    tinta: ambil("bch-ink"),
    laut: ambil("bch-map-water"),
    dangkal: ambil("bch-map-shallow"),
    darat: ambil("bch-map-land"),
    garisLaut: ambil("bch-map-waterline"),
    biru: ambil("riso-federal-blue"),
    tembaga: ambil("riso-copper"),
    arang: ambil("riso-charcoal"),
  };
}

function poligonTitik(x, y, r) {
  const hasil = [];
  for (let i = 0; i < 8; i++) {
    const s = (i / 8) * Math.PI * 2 + Math.PI / 8;
    hasil.push([bulat(x + Math.cos(s) * r), bulat(y + Math.sin(s) * r)]);
  }
  return hasil;
}

// Dijalankan di dalam halaman Chromium: menggambar kanvas lalu memotong tile.
function gambarDiHalaman({ lebar, tinggi, warna, daratan, kecamatan, titik, judul, tileUkuran, kualitas }) {
  let benih = 20261105;
  const acak = () => {
    benih = (benih + 0x6d2b79f5) | 0;
    let t = Math.imul(benih ^ (benih >>> 15), 1 | benih);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const antara = (a, b) => a + (b - a) * acak();

  const kanvas = document.createElement("canvas");
  kanvas.width = lebar;
  kanvas.height = tinggi;
  const c = kanvas.getContext("2d");
  c.lineJoin = "round";
  c.lineCap = "round";

  // Garis bergetar seperti tangan: tiap ruas dipecah dan digeser sedikit.
  const garis = (titikGaris, getar = 1.6) => {
    c.beginPath();
    titikGaris.forEach(([x, y], i) => {
      if (i === 0) {
        c.moveTo(x, y);
        return;
      }
      const [px, py] = titikGaris[i - 1];
      const n = Math.max(1, Math.round(Math.hypot(x - px, y - py) / 40));
      for (let k = 1; k <= n; k++) {
        const g = k === n ? 0 : getar;
        c.lineTo(px + ((x - px) * k) / n + antara(-g, g), py + ((y - py) * k) / n + antara(-g, g));
      }
    });
  };
  const kotak = (x, y, l, t, getar = 1.4) =>
    garis(
      [
        [x, y],
        [x + l, y],
        [x + l, y + t],
        [x, y + t],
        [x, y],
      ],
      getar,
    );

  const jalurCincin = (cincinList) => {
    c.beginPath();
    for (const cincin of cincinList) {
      cincin.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
      c.closePath();
    }
  };

  // Laut dan garis air horizontal terputus, makin rapat ke utara (cakrawala).
  c.fillStyle = warna.laut;
  c.fillRect(0, 0, lebar, tinggi);
  c.strokeStyle = warna.garisLaut;
  c.lineWidth = 1.5;
  c.globalAlpha = 0.45;
  for (let y = 16; y < tinggi; y += 14 + (y / tinggi) * 42) {
    let x = antara(-200, 0);
    while (x < lebar) {
      const p = antara(50, 170);
      garis(
        [
          [x, y + antara(-2, 2)],
          [x + p, y + antara(-2, 2)],
        ],
        1,
      );
      c.stroke();
      x += p + antara(60, 200);
    }
  }
  c.globalAlpha = 1;

  // Arsiran pantai (waterlining), lalu daratan menimpanya.
  for (const [w, a] of [
    [64, 0.1],
    [40, 0.16],
    [18, 0.28],
  ]) {
    jalurCincin(daratan);
    c.strokeStyle = warna.garisLaut;
    c.globalAlpha = a;
    c.lineWidth = w;
    c.stroke();
  }
  c.globalAlpha = 1;
  jalurCincin(daratan);
  c.fillStyle = warna.darat;
  c.fill();
  c.strokeStyle = warna.biru;
  c.lineWidth = 3.5;
  c.stroke();

  const diDarat = (x, y) => {
    jalurCincin(daratan);
    return c.isPointInPath(x, y);
  };

  // Blok ruko sederhana. Hanya pengisi, bukan bangunan sebenarnya.
  c.lineWidth = 1.6;
  for (let i = 0; i < 2600; i++) {
    const x = antara(0, lebar);
    const y = antara(0, tinggi);
    if (!diDarat(x, y) || !diDarat(x + 44, y + 30)) continue;
    const l = antara(26, 64);
    const t = antara(16, 34);
    c.fillStyle = warna.kertas2;
    kotak(x, y, l, t);
    c.fill();
    c.strokeStyle = warna.arang;
    c.stroke();
    if (acak() < 0.35) {
      c.strokeStyle = warna.tembaga;
      garis([
        [x + 3, y + t * 0.45],
        [x + l - 3, y + t * 0.45],
      ]);
      c.stroke();
    }
  }

  // Batas kecamatan dan namanya.
  c.setLineDash([18, 14]);
  c.strokeStyle = warna.arang;
  c.lineWidth = 2.5;
  for (const k of kecamatan) {
    jalurCincin(k.cincin);
    c.stroke();
  }
  c.setLineDash([]);

  // Sketsa per jenis titik. Tinta: biru federal, tembaga, arang.
  const sketsa = {
    terminal(x, y) {
      c.fillStyle = warna.kertas;
      kotak(x - 100, y - 44, 200, 60);
      c.fill();
      c.strokeStyle = warna.biru;
      c.lineWidth = 3.5;
      c.stroke();
      garis([
        [x - 118, y - 44],
        [x, y - 96],
        [x + 118, y - 44],
      ]);
      c.stroke();
      garis([
        [x - 90, y + 16],
        [x - 90, y + 96],
      ]);
      c.stroke();
      kotak(x - 150, y + 96, 120, 18);
      c.stroke();
    },
    ruko(x, y) {
      c.lineWidth = 3;
      for (let i = 0; i < 5; i++) {
        const lx = x - 170 + i * 70;
        c.fillStyle = warna.kertas;
        kotak(lx, y - 110, 66, 130);
        c.fill();
        c.strokeStyle = warna.arang;
        c.stroke();
        c.strokeStyle = warna.tembaga;
        kotak(lx + 8, y - 96, 50, 22);
        c.stroke();
        c.strokeStyle = warna.biru;
        kotak(lx + 8, y - 62, 18, 24);
        c.stroke();
        kotak(lx + 40, y - 62, 18, 24);
        c.stroke();
      }
    },
    mal(x, y) {
      c.fillStyle = warna.kertas;
      kotak(x - 120, y - 100, 240, 130);
      c.fill();
      c.strokeStyle = warna.biru;
      c.lineWidth = 3.5;
      c.stroke();
      for (let i = 1; i < 6; i++) {
        garis([
          [x - 120 + i * 40, y - 100],
          [x - 120 + i * 40, y + 30],
        ]);
        c.stroke();
      }
      garis([
        [x - 120, y - 60],
        [x + 120, y - 60],
      ]);
      c.stroke();
    },
    pasar(x, y) {
      c.lineWidth = 3;
      for (let i = 0; i < 3; i++) {
        const lx = x - 130 + i * 90;
        c.strokeStyle = i % 2 ? warna.biru : warna.tembaga;
        garis([
          [lx, y - 16],
          [lx + 40, y - 70],
          [lx + 80, y - 16],
          [lx, y - 16],
        ]);
        c.stroke();
        garis([
          [lx + 8, y - 16],
          [lx + 8, y + 30],
        ]);
        c.stroke();
        garis([
          [lx + 72, y - 16],
          [lx + 72, y + 30],
        ]);
        c.stroke();
      }
    },
    kopi(x, y) {
      c.fillStyle = warna.kertas;
      kotak(x - 36, y - 44, 72, 64);
      c.fill();
      c.strokeStyle = warna.tembaga;
      c.lineWidth = 4;
      c.stroke();
      c.beginPath();
      c.arc(x + 44, y - 12, 18, -Math.PI / 2, Math.PI / 2);
      c.stroke();
      garis([
        [x - 16, y - 58],
        [x - 8, y - 80],
        [x - 16, y - 100],
      ]);
      c.stroke();
      garis([
        [x + 12, y - 58],
        [x + 20, y - 80],
        [x + 12, y - 100],
      ]);
      c.stroke();
    },
    crane(x, y) {
      c.strokeStyle = warna.tembaga;
      c.lineWidth = 4;
      garis([
        [x - 40, y + 60],
        [x - 22, y - 120],
        [x + 22, y - 120],
        [x + 40, y + 60],
      ]);
      c.stroke();
      garis([
        [x - 90, y - 120],
        [x + 130, y - 120],
      ]);
      c.stroke();
      garis([
        [x + 90, y - 120],
        [x + 90, y - 50],
      ]);
      c.stroke();
      c.strokeStyle = warna.biru;
      for (let i = 0; i < 3; i++) {
        kotak(x + 56 + i * 8, y - 50 + i * 26, 70, 24);
        c.stroke();
      }
    },
    bus(x, y) {
      c.fillStyle = warna.kertas;
      kotak(x - 74, y - 34, 148, 58);
      c.fill();
      c.strokeStyle = warna.biru;
      c.lineWidth = 4;
      c.stroke();
      for (let i = 0; i < 4; i++) {
        kotak(x - 64 + i * 32, y - 26, 24, 20);
        c.stroke();
      }
      c.beginPath();
      c.arc(x - 42, y + 26, 10, 0, Math.PI * 2);
      c.arc(x + 42, y + 26, 10, 0, Math.PI * 2);
      c.stroke();
    },
    panggung(x, y) {
      // Penanda polos, bukan gambar jenaka: rumah panggung tunggal.
      c.strokeStyle = warna.arang;
      c.lineWidth = 3.5;
      c.fillStyle = warna.kertas;
      kotak(x - 60, y - 40, 120, 44);
      c.fill();
      c.stroke();
      garis([
        [x - 72, y - 40],
        [x, y - 84],
        [x + 72, y - 40],
      ]);
      c.stroke();
      for (const d of [-48, 0, 48]) {
        garis([
          [x + d, y + 4],
          [x + d, y + 50],
        ]);
        c.stroke();
      }
    },
  };

  for (const t of titik) {
    if (t.sketsa) sketsa[t.sketsa](t.x, t.y);
    if (t.asli) {
      // Garis penunjuk ke koordinat data, karena sketsa digeser supaya tidak bertumpuk.
      c.strokeStyle = warna.arang;
      c.lineWidth = 2;
      c.setLineDash([6, 8]);
      c.beginPath();
      c.moveTo(t.x, t.y);
      c.lineTo(t.asli[0], t.asli[1]);
      c.stroke();
      c.setLineDash([]);
      c.fillStyle = warna.arang;
      c.beginPath();
      c.arc(t.asli[0], t.asli[1], 5, 0, Math.PI * 2);
      c.fill();
    }
    c.font = "italic 600 34px Georgia, serif";
    c.textAlign = "center";
    c.lineWidth = 8;
    c.strokeStyle = warna.kertas;
    c.strokeText(t.nama, t.x, t.y + (t.sketsa === "terminal" ? 150 : 96));
    c.fillStyle = warna.tinta;
    c.fillText(t.nama, t.x, t.y + (t.sketsa === "terminal" ? 150 : 96));
  }

  // Lampu dan rute feri tidak digambar di sini: keduanya lapisan hidup di kanvas overlay.

  // Label placeholder berulang, supaya tetap terbaca di zoom berapa pun.
  c.save();
  c.font = "600 54px Georgia, serif";
  c.textAlign = "center";
  c.fillStyle = warna.tembaga;
  c.globalAlpha = 0.5;
  for (let y = 180; y < tinggi; y += 520) {
    for (let x = (y % 1040 > 400 ? 0 : 500) + 300; x < lebar; x += 1000) {
      c.save();
      c.translate(x, y);
      c.rotate(-0.12);
      c.fillText("ILUSTRASI PLACEHOLDER", 0, 0);
      c.restore();
    }
  }
  c.restore();

  // Cartouche judul.
  c.fillStyle = warna.kertas;
  c.fillRect(40, tinggi - 210, 1400, 170);
  c.strokeStyle = warna.biru;
  c.lineWidth = 5;
  c.strokeRect(40, tinggi - 210, 1400, 170);
  c.fillStyle = warna.tinta;
  c.textAlign = "left";
  c.font = "600 54px Georgia, serif";
  c.fillText(judul, 72, tinggi - 142);
  c.font = "italic 38px Georgia, serif";
  c.fillText("Ilustrasi placeholder, bukan posisi tepat. Digambar skrip, bukan ilustrator.", 72, tinggi - 80);

  // Piramida DZI: tiap level setengah dari level di atasnya.
  const levelMaks = Math.ceil(Math.log2(Math.max(lebar, tinggi)));
  const tile = [];
  let sumber = kanvas;
  for (let level = levelMaks; level >= 0; level--) {
    const skala = 2 ** (levelMaks - level);
    const l = Math.ceil(lebar / skala);
    const t = Math.ceil(tinggi / skala);
    if (sumber.width !== l || sumber.height !== t) {
      const baru = document.createElement("canvas");
      baru.width = l;
      baru.height = t;
      const bc = baru.getContext("2d");
      bc.imageSmoothingEnabled = true;
      bc.imageSmoothingQuality = "high";
      bc.drawImage(sumber, 0, 0, l, t);
      sumber = baru;
    }
    const kolom = Math.ceil(l / tileUkuran);
    const baris = Math.ceil(t / tileUkuran);
    for (let col = 0; col < kolom; col++) {
      for (let row = 0; row < baris; row++) {
        const x0 = Math.max(0, col * tileUkuran - 1);
        const y0 = Math.max(0, row * tileUkuran - 1);
        const x1 = Math.min(l, (col + 1) * tileUkuran + 1);
        const y1 = Math.min(t, (row + 1) * tileUkuran + 1);
        const potong = document.createElement("canvas");
        potong.width = x1 - x0;
        potong.height = y1 - y0;
        potong.getContext("2d").drawImage(sumber, -x0, -y0);
        tile.push({ level, col, row, data: potong.toDataURL("image/webp", kualitas).split(",")[1] });
      }
    }
  }
  return { levelMaks, tile };
}

async function utama() {
  const [css, landmarks, indeks, tempat, ikon, geo, terminal] = await Promise.all([
    readFile(join(AKAR, "data/design/design_tokens.css"), "utf8"),
    baca("data/mural/landmarks.json"),
    baca("data/places_id_index.json"),
    baca("data/places.json"),
    baca("data/mural/ikon_prioritas.json"),
    baca("data/wilayah/kecamatan-kepri.geojson"),
    baca("data/feri/terminal.json"),
  ]);

  // GCP placeholder: kisi 3x3 dari proyeksi linear bingkai. Hanya berlaku untuk gambar placeholder ini.
  const gcps = [];
  for (const fx of [0, 0.5, 1]) {
    for (const fy of [0, 0.5, 1]) {
      const x = fx * LEBAR;
      const y = fy * TINGGI;
      gcps.push({ resource: [x, y], geo: [keLng(x), keLat(y)], label: `kisi ${fx}/${fy}` });
    }
  }
  const tps = new GcpTransformer(gcps, "thinPlateSpline");
  const kePiksel = ([lng, lat]) => tps.transformToResource([lng, lat]);

  const diBingkai = (cincin) =>
    cincin.some(
      ([lng, lat]) =>
        lng > BINGKAI.barat - 0.01 &&
        lng < BINGKAI.timur + 0.01 &&
        lat > BINGKAI.selatan - 0.01 &&
        lat < BINGKAI.utara + 0.01,
    );

  const cincinPiksel = (cincin, tol) =>
    sederhanakan(rapatkan(cincin.map(([lng, lat]) => [lng, lat])).map(kePiksel), tol).map(([x, y]) => [
      bulat(x),
      bulat(y),
    ]);

  const kecamatan = [];
  const daratan = [];
  for (const f of geo.features) {
    if (f.properties.kab !== "Batam") continue;
    const poligon = f.geometry.type === "MultiPolygon" ? f.geometry.coordinates : [f.geometry.coordinates];
    const cincin = poligon.flatMap((p) => p.slice(0, 1)).filter(diBingkai);
    if (!cincin.length) continue;
    const px = cincin.map((r) => cincinPiksel(r, 3)).filter((r) => r.length >= 3);
    kecamatan.push({ kode: f.properties.code, nama: f.properties.name, cincin: px });
    daratan.push(...px);
  }

  const idTempat = new Map(tempat.map((p) => [p.id, p]));
  const jenisSketsa = {
    pelabuhan: "terminal",
    "kawasan-ruko": "ruko",
    "pusat-belanja": "mal",
    pasar: "pasar",
    "kedai-kopi": "kopi",
    "kampung-tua-rujukan": "panggung",
    "pelabuhan-kargo": "crane",
    "transportasi-ikon-keseharian": "bus",
  };

  const urutan = new Map(ikon.flatMap((i) => i.id_landmark.map((id) => [id, i.urutan])));
  const titik = [];
  for (const l of landmarks.filter((x) => x.segmen === SEGMEN)) {
    const idT = indeks[l.id] ?? l.id;
    const p = idTempat.get(idT);
    const lat = p?.lat ?? l.lat;
    const lng = p?.lng ?? l.lng;
    if (typeof lat !== "number" || typeof lng !== "number") continue;
    // Pelantar Sungai Jodoh berbagi titik dengan Pasar Jodoh (research/03): tidak dibuat pin ganda.
    if (l.kategori === "batam-yang-hilang") continue;
    const [ax, ay] = kePiksel([lng, lat]);
    const [gx, gy] = GESER[idT] ?? GESER[l.id] ?? [0, 0];
    const x = bulat(ax + gx);
    const y = bulat(ay + gy);
    titik.push({
      id: l.id,
      nama: l.nama_populer ?? l.nama,
      x,
      y,
      asli: gx || gy ? [bulat(ax), bulat(ay)] : null,
      poligon: poligonTitik(x, y, 130),
      sketsa: jenisSketsa[l.kategori] ?? "ruko",
      urutan: urutan.get(l.id) ?? null,
    });
  }

  const hb = terminal.terminal.find((t) => t.id === "hb");
  const rute = ruteFeri(hb).map((r) => ({
    id: r.id,
    keterangan: r.keterangan,
    titik: r.geo.map(kePiksel).map(([x, y]) => [bulat(x), bulat(y)]),
  }));

  // Lampu malam: titik seragam di daratan, memakai benih tetap. Bukan posisi bangunan sebenarnya.
  let benih = 7;
  const acak = () => {
    benih = (benih * 16807) % 2147483647;
    return benih / 2147483647;
  };
  const diDalam = (x, y, cincin) => {
    let d = false;
    for (let i = 0, j = cincin.length - 1; i < cincin.length; j = i++) {
      const [xi, yi] = cincin[i];
      const [xj, yj] = cincin[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) d = !d;
    }
    return d;
  };
  const lampu = [];
  for (let i = 0; i < 6000 && lampu.length < 260; i++) {
    const x = bulat(acak() * LEBAR);
    const y = bulat(acak() * TINGGI);
    if (daratan.some((c) => diDalam(x, y, c))) lampu.push([x, y]);
  }

  const peramban = await chromium.launch();
  const halaman = await peramban.newPage();
  const { levelMaks, tile } = await halaman.evaluate(gambarDiHalaman, {
    lebar: LEBAR,
    tinggi: TINGGI,
    warna: warnaToken(css),
    daratan,
    kecamatan,
    titik,
    judul: "Segmen 2: Harbour Bay, Nagoya, Jodoh",
    tileUkuran: TILE,
    kualitas: KUALITAS,
  });
  await peramban.close();

  const keluar = join(AKAR, "public/mural", SEGMEN);
  await rm(keluar, { recursive: true, force: true });
  let total = 0;
  for (const t of tile) {
    const folder = join(keluar, "segmen_files", String(t.level));
    await mkdir(folder, { recursive: true });
    const isi = Buffer.from(t.data, "base64");
    total += isi.length;
    await writeFile(join(folder, `${t.col}_${t.row}.webp`), isi);
  }
  await writeFile(
    join(keluar, "segmen.dzi"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<Image xmlns="http://schemas.microsoft.com/deepzoom/2008" Format="webp" Overlap="${OVERLAP}" TileSize="${TILE}">\n  <Size Width="${LEBAR}" Height="${TINGGI}"/>\n</Image>\n`,
  );

  const meta = {
    segmen: SEGMEN,
    placeholder: true,
    lebar: LEBAR,
    tinggi: TINGGI,
    bingkai: BINGKAI,
    kecamatan,
    rute,
    titik: titik.map((t) => ({
      id: t.id,
      nama: t.nama,
      x: t.x,
      y: t.y,
      asli: t.asli,
      poligon: t.poligon,
      urutan: t.urutan,
    })),
    lampu,
  };
  await writeFile(join(keluar, "meta.json"), JSON.stringify(meta));
  await writeFile(
    join(AKAR, "data/mural", `${SEGMEN}.gcps.json`),
    `${JSON.stringify(
      {
        segmen: SEGMEN,
        catatan: "GCP placeholder: kisi 3x3 dari proyeksi linear gambar placeholder. Ganti dengan hasil /mural/gcp.",
        transformasi: "thinPlateSpline",
        gcps,
      },
      null,
      2,
    )}\n`,
  );

  console.log(
    `level 0-${levelMaks}, ${tile.length} tile, ${(total / 1024 / 1024).toFixed(2)} MB, meta ${(
      JSON.stringify(meta).length / 1024
    ).toFixed(0)} kB, ${kecamatan.length} kecamatan: ${kecamatan.map((k) => k.nama).join(", ")}`,
  );
}

await utama();
