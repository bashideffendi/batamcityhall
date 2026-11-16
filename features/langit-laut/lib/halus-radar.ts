// Menghaluskan citra radar MSS untuk ditampilkan (pemilik 16 Nov 2026: "bikin lebih bagus daripada hujandibatam",
// tepi hujan jangan bergerigi). Citra asli 480x480 piksel, satu piksel ±1 km, jadi di peta tampak kotak-kotak.
//
// Cara kerja. Tiap piksel dibaca sebagai (ada pantulan, posisi warna di skala MSS). Kedua bidang itu diperbesar dan
// dikaburkan (Gauss, simpangan ±1 piksel asli). Tepi daerah hujan digambar di garis kontur 0,5 bidang "ada pantulan":
// tepi lurus tidak bergeser, undakan satu piksel menjadi lengkung, dan luas daerah hujan besar praktis tetap.
//
// Yang dijaga supaya citra tetap jujur:
//   - Skala warna tidak berubah: warna tiap titik diambil dari skala MSS yang sama (LEGEND).
//   - Intensitas dirata-ratakan hanya di antara piksel yang berpantulan, jadi tidak memudar di tepi dan tidak
//     "bocor" ke daerah tanpa hujan.
//   - Pantulan kecil (titik sendirian, garis selebar satu piksel) akan hilang bila hanya dikaburkan. Piksel seperti
//     itu digambar lewat jalur kedua yang hanya memperbesar tanpa mengaburkan, jadi tetap terlihat di tempatnya.
//   - Hitungan hujan per kecamatan (lib/echo.ts) tetap memakai citra asli, bukan citra ini.
import { PNG } from "pngjs";
import { LEGEND } from "./radar";

/**
 * Perbesaran citra: 480 menjadi 960 piksel per sisi. Sesudah dikaburkan, bentuknya sudah halus pada skala satu piksel
 * asli, jadi dua kali cukup; sisanya dihaluskan penyaringan linear di peta. Tiga kali hanya menambah ukuran berkas.
 */
export const SKALA_HALUS = 2;
/** Simpangan baku kabur total, dalam piksel asli (±1 km). */
const SIGMA = 1;
/** B-spline kubik sendiri setara kabur dengan simpangan √(1/3) ≈ 0,58 piksel asli. */
const SIGMA_SPLINE = Math.sqrt(1 / 3);
/** Tepi daerah hujan: kontur 0,5, dengan peralihan alfa selebar ini supaya tidak bergerigi. */
const AMBANG = 0.5;
const LEBAR = 0.09;
/**
 * Jalur pantulan kecil. Puncak B-spline kubik untuk satu piksel sendirian adalah (2/3)² ≈ 0,44; dengan ambang 0,3
 * piksel itu tampil sebagai titik bundar seluas kira-kira satu piksel asli.
 */
const AMBANG_KECIL = 0.3;
const LEBAR_KECIL = 0.05;
/** Piksel dengan tetangga berpantulan paling banyak sejumlah ini dianggap pantulan kecil (titik atau garis tipis). */
const TETANGGA_KECIL = 2;
/**
 * Jumlah tingkat warna di sepanjang skala. Bidang warna yang rata membuat berkas PNG jauh lebih kecil daripada gradasi
 * penuh, dan pita warnanya tetap bertepi halus.
 */
const TINGKAT_WARNA = 17;

const KUNCI = LEGEND.map((h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)] as const);
const RUAS = KUNCI.length - 1;

/** Posisi sebuah warna di skala MSS, 0 (paling ringan) sampai 1 (paling lebat): titik terdekat di jalur LEGEND. */
export function posisiWarna(r: number, g: number, b: number): number {
  let terbaik = 0;
  let jarak = Infinity;
  for (let i = 0; i < RUAS; i++) {
    const [ar, ag, ab] = KUNCI[i];
    const [br, bg, bb] = KUNCI[i + 1];
    const dr = br - ar;
    const dg = bg - ag;
    const db = bb - ab;
    const u = Math.max(0, Math.min(1, ((r - ar) * dr + (g - ag) * dg + (b - ab) * db) / (dr * dr + dg * dg + db * db)));
    const d = (ar + u * dr - r) ** 2 + (ag + u * dg - g) ** 2 + (ab + u * db - b) ** 2;
    if (d < jarak) {
      jarak = d;
      terbaik = (i + u) / RUAS;
    }
  }
  return terbaik;
}

/** Warna skala MSS di posisi t (0 sampai 1), kebalikan posisiWarna. */
export function warnaDiPosisi(t: number): [number, number, number] {
  const x = Math.max(0, Math.min(1, t)) * RUAS;
  const i = Math.min(RUAS - 1, Math.floor(x));
  const u = x - i;
  const a = KUNCI[i];
  const b = KUNCI[i + 1];
  return [Math.round(a[0] + u * (b[0] - a[0])), Math.round(a[1] + u * (b[1] - a[1])), Math.round(a[2] + u * (b[2] - a[2]))];
}

// Bobot B-spline kubik untuk empat tetangga pada pecahan f (0 sampai 1). Selalu tidak negatif dan berjumlah 1.
function bobot(f: number): [number, number, number, number] {
  const f2 = f * f;
  const f3 = f2 * f;
  return [(1 - 3 * f + 3 * f2 - f3) / 6, (4 - 6 * f2 + 3 * f3) / 6, (1 + 3 * f + 3 * f2 - 3 * f3) / 6, f3 / 6];
}

/** Perbesar satu bidang w x h menjadi (w*S) x (h*S) dengan B-spline kubik, dua lintasan (mendatar lalu tegak). */
function perbesar(asal: Float32Array, w: number, h: number, S: number): Float32Array {
  const W = w * S;
  const H = h * S;
  // Tabel bobot per fase: posisi sumber piksel keluaran X adalah (X + 0,5) / S − 0,5.
  const fase = Array.from({ length: S }, (_, k) => {
    const x = (k + 0.5) / S - 0.5;
    const dasar = Math.floor(x);
    return { geser: dasar - 1, b: bobot(x - dasar) };
  });
  const datar = new Float32Array(W * h);
  for (let y = 0; y < h; y++) {
    const baris = y * w;
    for (let X = 0; X < W; X++) {
      const { geser, b } = fase[X % S];
      const x0 = Math.floor(X / S) + geser;
      let v = 0;
      for (let k = 0; k < 4; k++) {
        const x = x0 + k;
        if (x >= 0 && x < w) v += b[k] * asal[baris + x];
      }
      datar[y * W + X] = v;
    }
  }
  const hasil = new Float32Array(W * H);
  for (let Y = 0; Y < H; Y++) {
    const { geser, b } = fase[Y % S];
    const y0 = Math.floor(Y / S) + geser;
    for (let k = 0; k < 4; k++) {
      const y = y0 + k;
      if (y < 0 || y >= h || b[k] === 0) continue;
      const bk = b[k];
      const sumber = y * W;
      const tujuan = Y * W;
      for (let X = 0; X < W; X++) hasil[tujuan + X] += bk * datar[sumber + X];
    }
  }
  return hasil;
}

/** Kabur Gauss terpisah (mendatar lalu tegak), simpangan baku `sigma` piksel. Tepi citra dianggap tanpa pantulan. */
function kabur(asal: Float32Array, W: number, H: number, sigma: number): Float32Array {
  const jari = Math.max(1, Math.ceil(sigma * 2.5));
  const inti = new Float32Array(2 * jari + 1);
  let jumlah = 0;
  for (let k = -jari; k <= jari; k++) jumlah += inti[k + jari] = Math.exp(-(k * k) / (2 * sigma * sigma));
  for (let k = 0; k < inti.length; k++) inti[k] /= jumlah;
  const datar = new Float32Array(W * H);
  for (let y = 0; y < H; y++) {
    const baris = y * W;
    for (let x = 0; x < W; x++) {
      let v = 0;
      const dari = Math.max(0, x - jari);
      const sampai = Math.min(W - 1, x + jari);
      for (let i = dari; i <= sampai; i++) v += inti[i - x + jari] * asal[baris + i];
      datar[baris + x] = v;
    }
  }
  const hasil = new Float32Array(W * H);
  for (let k = -jari; k <= jari; k++) {
    const bk = inti[k + jari];
    for (let y = Math.max(0, -k); y < Math.min(H, H - k); y++) {
      const tujuan = y * W;
      const sumber = (y + k) * W;
      for (let x = 0; x < W; x++) hasil[tujuan + x] += bk * datar[sumber + x];
    }
  }
  return hasil;
}

const alfaTepi = (m: number, ambang: number, lebar: number) => {
  const u = (m - (ambang - lebar)) / (2 * lebar);
  if (u <= 0) return 0;
  if (u >= 1) return 1;
  return u * u * (3 - 2 * u);
};

export type CitraHalus = { width: number; height: number; /** RGBA, 4 byte per piksel */ data: Buffer };

/**
 * Citra radar MSS (PNG) menjadi piksel RGBA yang dihaluskan, SKALA_HALUS kali lebih besar. Melempar bila PNG tidak
 * bisa dibaca: pemanggil memutuskan apa yang dikirim (citra asli), bukan gambar kosong.
 */
export function pikselHalus(png: Buffer, skala = SKALA_HALUS, tingkat = TINGKAT_WARNA): CitraHalus {
  const a = PNG.sync.read(png);
  const { width: w, height: h } = a;
  const ada = new Float32Array(w * h);
  const nilai = new Float32Array(w * h);
  const kenal = new Map<number, number>();
  let adaPantulan = false;
  for (let i = 0, p = 0; i < w * h; i++, p += 4) {
    if (a.data[p + 3] === 0) continue;
    adaPantulan = true;
    const kunci = (a.data[p] << 16) | (a.data[p + 1] << 8) | a.data[p + 2];
    let t = kenal.get(kunci);
    if (t === undefined) {
      t = posisiWarna(a.data[p], a.data[p + 1], a.data[p + 2]);
      kenal.set(kunci, t);
    }
    ada[i] = 1;
    nilai[i] = t;
  }
  const W = w * skala;
  const H = h * skala;
  const keluar = { width: W, height: H, data: Buffer.alloc(W * H * 4) };
  if (!adaPantulan) return keluar;

  // Jalur utama: kaburkan pada ukuran asli, lalu perbesar; simpangan totalnya SIGMA piksel asli. Mengaburkan sebelum
  // memperbesar memberi hasil yang sama dengan seperempat hitungan, dan itu penting: pekerjaan ini menahan server
  // selama berjalan (lihat antrean di app/api/radar-citra).
  const sigmaTambah = Math.sqrt(Math.max(0, SIGMA * SIGMA - SIGMA_SPLINE * SIGMA_SPLINE));
  const A = perbesar(kabur(ada, w, h, sigmaTambah), w, h, skala);
  const T = perbesar(kabur(nilai, w, h, sigmaTambah), w, h, skala);

  // Jalur pantulan kecil: piksel yang tidak selamat dari kabur dan nyaris tanpa tetangga (titik, garis tipis).
  const kecil = new Float32Array(w * h);
  const nilaiKecil = new Float32Array(w * h);
  let adaKecil = false;
  const tengah = Math.floor(skala / 2);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (!ada[i] || A[(y * skala + tengah) * W + x * skala + tengah] >= AMBANG) continue;
      let tetangga = 0;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue;
          const xx = x + dx;
          const yy = y + dy;
          if (xx >= 0 && xx < w && yy >= 0 && yy < h && ada[yy * w + xx]) tetangga++;
        }
      if (tetangga > TETANGGA_KECIL) continue;
      kecil[i] = 1;
      nilaiKecil[i] = nilai[i];
      adaKecil = true;
    }
  const AK = adaKecil ? perbesar(kecil, w, h, skala) : null;
  const TK = adaKecil ? perbesar(nilaiKecil, w, h, skala) : null;

  const warna = new Map<number, [number, number, number]>();
  const warnaTingkat = (t: number) => {
    const k = Math.round(Math.max(0, Math.min(1, t)) * (tingkat - 1));
    let c = warna.get(k);
    if (!c) {
      c = warnaDiPosisi(k / (tingkat - 1));
      warna.set(k, c);
    }
    return c;
  };
  for (let i = 0, p = 0; i < W * H; i++, p += 4) {
    const besar = alfaTepi(A[i], AMBANG, LEBAR);
    const titik = AK ? alfaTepi(AK[i], AMBANG_KECIL, LEBAR_KECIL) : 0;
    if (besar <= 0 && titik <= 0) continue;
    // Intensitas dirata-ratakan hanya di antara piksel yang berpantulan (T sudah dikali "ada").
    const c = besar >= titik ? warnaTingkat(T[i] / A[i]) : warnaTingkat((TK as Float32Array)[i] / (AK as Float32Array)[i]);
    keluar.data[p] = c[0];
    keluar.data[p + 1] = c[1];
    keluar.data[p + 2] = c[2];
    keluar.data[p + 3] = Math.round(255 * Math.max(besar, titik));
  }
  return keluar;
}

/** Citra yang dihaluskan sebagai PNG. Dipakai bila penyandi WebP (sharp) tidak tersedia, dan di tes. */
export function haluskanRadar(png: Buffer, skala = SKALA_HALUS, tingkat = TINGKAT_WARNA): Buffer {
  const c = pikselHalus(png, skala, tingkat);
  const keluar = new PNG({ width: c.width, height: c.height });
  c.data.copy(keluar.data);
  return PNG.sync.write(keluar, { deflateLevel: 6 });
}
