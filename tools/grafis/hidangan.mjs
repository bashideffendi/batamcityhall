/**
 * Ilustrasi cetak Riso untuk bagian Makan: 17 hidangan (480 x 480) dan 6 panduan (720 x 480).
 * Port algoritma riso.py memakai sharp, tanpa rsvg-convert dan Pillow.
 *
 * Tiap tinta satu lapisan SVG hitam di atas transparan, dirender dua kali ukuran menjadi topeng alfa,
 * digeser (salah register), diberi butiran dan ketidakrataan tinta dengan derau ber-seed tetap,
 * lalu ditimpakan multiply di atas kertas putih dan disimpan WebP.
 *
 * Menjalankan (dari akar repo):
 *   node tools/grafis/hidangan.mjs                 semua gambar
 *   node tools/grafis/hidangan.mjs bakso cafe      sebagian gambar menurut id
 *   node tools/grafis/hidangan.mjs --kontak <folder>   lembar kontak dan versi 72 px
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const AKAR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const KELUARAN = { hidangan: "public/grafis/hidangan", panduan: "public/grafis/panduan" };
const BATAS_BYTE = 200 * 1024;

const INK = { blue: [0, 120, 191], red: [241, 80, 96], yellow: [255, 181, 17], black: [34, 34, 38] };
const OFF = { blue: [1.5, -1], red: [-1, 1.5], yellow: [0, 0], black: [0.6, 0.6] };

// Enam pola pertama disalin dari DEFS riso.py. Dua terakhir pola yang sama dua kali lipat, agar di kanvas
// 480 satuan titiknya sebesar titik dotbig pada ilustrasi loket 240 satuan.
const DEFS = `
<pattern id="dot1" patternUnits="userSpaceOnUse" width="4" height="4"><circle cx="2" cy="2" r="1.15"/></pattern>
<pattern id="dot2" patternUnits="userSpaceOnUse" width="4" height="4"><circle cx="2" cy="2" r="0.8"/></pattern>
<pattern id="dot3" patternUnits="userSpaceOnUse" width="4" height="4"><circle cx="2" cy="2" r="0.5"/></pattern>
<pattern id="dotbig" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(30)"><circle cx="3" cy="3" r="1.6"/></pattern>
<pattern id="hatch" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)"><rect x="0" y="0" width="1.7" height="5"/></pattern>
<pattern id="hatchfine" patternUnits="userSpaceOnUse" width="3.4" height="3.4" patternTransform="rotate(-35)"><rect x="0" y="0" width="0.9" height="3.4"/></pattern>
<pattern id="dot2x" patternUnits="userSpaceOnUse" width="11" height="11" patternTransform="rotate(30)"><circle cx="5.5" cy="5.5" r="3"/></pattern>
<pattern id="hatch2x" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)"><rect x="0" y="0" width="3.4" height="10"/></pattern>
`;

// ---------------------------------------------------------------- mesin (port riso.py)
async function mask(inner, W, H, s) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W * s}" height="${H * s}" viewBox="0 0 ${W} ${H}">` +
    `<defs>${DEFS}</defs>${inner}</svg>`;
  const data = await sharp(Buffer.from(svg)).ensureAlpha().extractChannel("alpha").raw().toBuffer();
  const a = new Float32Array(data.length);
  for (let i = 0; i < data.length; i++) a[i] = data[i] / 255;
  return a;
}

function mulberry32(seed) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Satu lintasan kotak geser mendatar lalu menegak, tepi dijepit. */
function kotak(src, w, h, r) {
  const n = 2 * r + 1;
  const a = new Float32Array(src.length);
  for (let y = 0; y < h; y++) {
    let jml = 0;
    for (let i = -r; i <= r; i++) jml += src[y * w + Math.min(w - 1, Math.max(0, i))];
    for (let x = 0; x < w; x++) {
      a[y * w + x] = jml / n;
      jml += src[y * w + Math.min(w - 1, x + r + 1)] - src[y * w + Math.max(0, x - r)];
    }
  }
  const b = new Float32Array(src.length);
  for (let x = 0; x < w; x++) {
    let jml = 0;
    for (let i = -r; i <= r; i++) jml += a[Math.min(h - 1, Math.max(0, i)) * w + x];
    for (let y = 0; y < h; y++) {
      b[y * w + x] = jml / n;
      jml += a[Math.min(h - 1, y + r + 1) * w + x] - a[Math.max(0, y - r) * w + x];
    }
  }
  return b;
}

/** GaussianBlur tanpa sharp: blur() sharp pada sigma kecil meninggalkan guratan mendatar. */
function kabur(src, w, h, sigma) {
  if (sigma >= 3) {
    // Tiga lintasan kotak, cara yang sama dengan Pillow.
    const r = Math.round((Math.sqrt((12 * sigma * sigma) / 3 + 1) - 1) / 2);
    let t = src;
    for (let i = 0; i < 3; i++) t = kotak(t, w, h, r);
    return t;
  }
  const R = Math.ceil(sigma * 3);
  const inti = [];
  let jml = 0;
  for (let i = -R; i <= R; i++) {
    const v = Math.exp(-(i * i) / (2 * sigma * sigma));
    inti.push(v);
    jml += v;
  }
  for (let i = 0; i < inti.length; i++) inti[i] /= jml;
  const a = new Float32Array(src.length);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let v = 0;
      for (let i = -R; i <= R; i++) v += inti[i + R] * src[y * w + Math.min(w - 1, Math.max(0, x + i))];
      a[y * w + x] = v;
    }
  }
  const b = new Float32Array(src.length);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let v = 0;
      for (let i = -R; i <= R; i++) v += inti[i + R] * a[Math.min(h - 1, Math.max(0, y + i)) * w + x];
      b[y * w + x] = v;
    }
  }
  return b;
}

const CACHE_DERAU = new Map();
function noise(h, w, seed, blur) {
  const kunci = `${h}x${w}:${seed}:${blur}`;
  if (CACHE_DERAU.has(kunci)) return CACHE_DERAU.get(kunci);
  const rng = mulberry32(Math.imul(seed, 2654435761));
  const mentah = new Float32Array(h * w);
  for (let i = 0; i < mentah.length; i++) mentah[i] = Math.floor(rng() * 255);
  // Dibulatkan ke 8 bit seperti Pillow. Pembulatan ini yang membuat bercak tinta pada acuan.
  const data = kabur(mentah, w, h, blur).map((v) => Math.round(v));
  let rata = 0;
  for (let i = 0; i < data.length; i++) rata += data[i];
  rata /= data.length;
  let varian = 0;
  for (let i = 0; i < data.length; i++) varian += (data[i] - rata) ** 2;
  const sb = Math.sqrt(varian / data.length) + 1e-6;
  const n = new Float32Array(data.length);
  for (let i = 0; i < data.length; i++) n[i] = (data[i] - rata) / sb;
  CACHE_DERAU.set(kunci, n);
  return n;
}

/** layers: [tinta, svg_dalam] atau [tinta, svg_dalam, [dx, dy]] */
async function riso(rel, W, H, layers, { s = 2, grain = 0.15 } = {}) {
  const h = H * s;
  const w = W * s;
  const out = new Float32Array(h * w * 3).fill(1);
  for (let i = 0; i < layers.length; i++) {
    const [ink, inner, off = OFF[ink]] = layers[i];
    if (!inner) continue;
    const a = await mask(inner, W, H, s);
    if (a.length !== h * w) throw new Error(`${rel}: ukuran topeng ${a.length} bukan ${h * w}`);
    const dx = Math.round(off[0] * s);
    const dy = Math.round(off[1] * s);
    const fine = noise(h, w, 11 + i, 0.6);
    const coarse = noise(h, w, 101 + i, (26 * s) / 2);
    const c = INK[ink].map((v) => v / 255);
    // np.roll di riso.py membungkus tepi. Di sini tepi dijepit, agar bidang yang menyentuh tepi bawah
    // tidak muncul lagi sebagai garis di tepi atas.
    for (let y = 0; y < h; y++) {
      const sy = Math.min(h - 1, Math.max(0, y - dy));
      for (let x = 0; x < w; x++) {
        const sx = Math.min(w - 1, Math.max(0, x - dx));
        let A = a[sy * w + sx];
        if (A === 0) continue;
        const idx = y * w + x;
        const k = 1 - grain * Math.abs(fine[idx]) * 0.9 - 0.07 * coarse[idx];
        A *= k < 0 ? 0 : k > 1 ? 1 : k;
        const p = idx * 3;
        out[p] *= 1 - A * (1 - c[0]);
        out[p + 1] *= 1 - A * (1 - c[1]);
        out[p + 2] *= 1 - A * (1 - c[2]);
      }
    }
  }
  const piksel = Buffer.alloc(h * w * 3);
  for (let i = 0; i < out.length; i++) {
    const v = out[i];
    piksel[i] = Math.floor((v < 0 ? 0 : v > 1 ? 1 : v) * 255);
  }
  // Kualitas 88 seperti riso.py, diturunkan bertahap hanya bila melewati batas ukuran.
  let q = 88;
  let berkas;
  for (;;) {
    berkas = await sharp(piksel, { raw: { width: w, height: h, channels: 3 } })
      .webp({ quality: q, effort: 6 })
      .toBuffer();
    if (berkas.length <= BATAS_BYTE || q <= 70) break;
    q -= 2;
  }
  const tujuan = path.join(AKAR, rel);
  fs.mkdirSync(path.dirname(tujuan), { recursive: true });
  fs.writeFileSync(tujuan, berkas);
  console.log(`${rel}  ${w}x${h}  q${q}  ${Math.round(berkas.length / 1024)} KB`);
}

// ---------------------------------------------------------------- bahan gambar
const K = 'fill="#000"';
const pola = (n) => `fill="url(#${n})"`;
const tipis = (o) => `fill="#000" fill-opacity="${o}"`;
const circ = (cx, cy, r, extra = K) => `<circle cx="${cx}" cy="${cy}" r="${r}" ${extra}/>`;
const ell = (cx, cy, rx, ry, extra = K) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ${extra}/>`;
const rect = (x, y, w, h, rx = 0, extra = K) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" ${extra}/>`;
const bidang = (d, extra = K) => `<path d="${d}" ${extra}/>`;
const garis = (d, lebar, extra = "") =>
  `<path d="${d}" fill="none" stroke="#000" stroke-width="${lebar}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const grup = (attr, ...isi) => `<g ${attr}>${isi.join("")}</g>`;
const buram = (o, ...isi) => grup(`opacity="${o}"`, ...isi);
const putar = (a, cx, cy, ...isi) => grup(`transform="rotate(${a} ${cx} ${cy})"`, ...isi);
const letak = (x, y, a, k, ...isi) => grup(`transform="translate(${x} ${y}) rotate(${a}) scale(${k})"`, ...isi);
/** Ganti isian hitam penuh dengan pola atau tinta tipis. Hanya untuk bentuk polos, tanpa kurang(). */
const sebagai = (bentuk, attr) => bentuk.replaceAll(K, attr);
/** Bongkah bersudut bundar. */
const bongkah = (d, bulat = 8) => `<path d="${d}" fill="#000" stroke="#000" stroke-width="${bulat}" stroke-linejoin="round"/>`;
/** Bidang bertepi remah: titik-titik bundar sepanjang keliling. */
const remah = (d, besar = 13, jarak = 15) =>
  `<path d="${d}" fill="#000" stroke="#000" stroke-width="${besar}" stroke-linecap="round" stroke-dasharray="0.1 ${jarak}"/>`;

let nomor = 0;
/** Isi dikurangi bentuk `lubang` (knock-out): tinta tidak mengenai bagian itu. */
function kurang(isi, ...lubang) {
  const id = `k${++nomor}`;
  return (
    `<mask id="${id}" maskUnits="userSpaceOnUse" x="-300" y="-300" width="1500" height="1200">` +
    `<rect x="-300" y="-300" width="1500" height="1200" fill="#fff"/>${lubang.join("")}</mask>` +
    `<g mask="url(#${id})">${isi}</g>`
  );
}
/** Isi hanya tampak di dalam bentuk `tepi`. Bentuk tepi polos, tanpa kurang(). */
function dalam(isi, ...tepi) {
  const id = `d${++nomor}`;
  return (
    `<mask id="${id}" maskUnits="userSpaceOnUse" x="-300" y="-300" width="1500" height="1200">` +
    `<rect x="-300" y="-300" width="1500" height="1200" fill="#000"/>${tepi.join("").replaceAll("#000", "#fff")}</mask>` +
    `<g mask="url(#${id})">${isi}</g>`
  );
}
/** Garis gelombang atau bidang berombak, sama dengan wave() di riso.py. */
function wave(y, amp, per, W, { x0 = -10, x1 = W + 10, tutup = null } = {}) {
  const t = [];
  for (let x = x0; x <= x1; x += 4) t.push(`${x},${(y + amp * Math.sin(((x - x0) / per) * 2 * Math.PI)).toFixed(1)}`);
  let d = "M" + t.join(" L");
  if (tutup !== null) d += ` L${x1},${tutup} L${x0},${tutup} Z`;
  return d;
}
function spiral(cx, cy, rx0, rx1, rasio, putaran, mulai = 0) {
  const t = [];
  const n = Math.round(putaran * 48);
  for (let i = 0; i <= n; i++) {
    const a = mulai + (i / 48) * 2 * Math.PI;
    const r = rx0 + ((rx1 - rx0) * i) / n;
    t.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * rasio * Math.sin(a)).toFixed(1)}`);
  }
  return "M" + t.join(" L");
}
/** Gumpalan bertepi lengkung: lingkaran-lingkaran pada keliling elips. */
function gumpal(cx, cy, rx, ry, n, rb, mulai = 0) {
  let s = ell(cx, cy, rx, ry);
  for (let i = 0; i < n; i++) {
    const a = mulai + (i / n) * 2 * Math.PI;
    s += circ((cx + rx * Math.cos(a)).toFixed(1), (cy + ry * Math.sin(a)).toFixed(1), rb);
  }
  return grup("", s);
}

const halo = (cx = 240, cy = 226, r = 172, p = "dot2x") => circ(cx, cy, r, pola(p));
const alas = (cx = 240, cy = 424, rx = 128, ry = 10) => ell(cx, cy, rx, ry, pola("hatchfine"));

/** Objek gambar: bentuk per tinta dan siluet untuk knock-out. */
const kosong = () => ({ siluet: [], kuning: "", merah: "", biru: "", hitam: "" });
const TINTA = ["kuning", "merah", "biru", "hitam"];
function gabung(...objek) {
  const o = kosong();
  for (const b of objek) {
    o.siluet.push(...b.siluet);
    for (const t of TINTA) o[t] += b[t] || "";
  }
  return o;
}
/** Objek `depan` menutup objek `belakang`. */
function timpa(belakang, depan) {
  const o = kosong();
  o.siluet = [...belakang.siluet, ...depan.siluet];
  for (const t of TINTA) {
    o[t] = (belakang[t] ? kurang(belakang[t], ...depan.siluet) : "") + (depan[t] || "");
  }
  return o;
}
function pindah(obj, x, y, k = 1, a = 0) {
  const o = kosong();
  o.siluet = [letak(x, y, a, k, ...obj.siluet)];
  for (const t of TINTA) o[t] = obj[t] ? letak(x, y, a, k, obj[t]) : "";
  return o;
}

/** Lima lapisan dengan urutan tetap, agar butiran tiap tinta sama di semua gambar. */
const lapis = ({ siluet = [], latar = halo(), kuning = "", merah = "", biru = "", hitam = "", dasar = alas() }) => [
  ["blue", kurang(latar, ...siluet) + dasar],
  ["yellow", kuning],
  ["red", merah],
  ["blue", biru],
  ["black", hitam],
];

function mangkuk({ cx = 240, y = 262, rx = 142, ry = 32, tinggi = 112, kaki = 80, tKaki = 14 } = {}) {
  const b = y + tinggi;
  const d =
    `M${cx - rx},${y} C${cx - rx + 4},${y + tinggi * 0.62} ${cx - kaki * 0.8},${b} ${cx - kaki / 2},${b} ` +
    `L${cx + kaki / 2},${b} C${cx + kaki * 0.8},${b} ${cx + rx - 4},${y + tinggi * 0.62} ${cx + rx},${y} ` +
    `A${rx},${ry} 0 0 1 ${cx - rx},${y} Z`;
  const t = `M${cx - kaki / 2},${b - 1} L${cx + kaki / 2},${b - 1} L${cx + kaki / 2 - 7},${b + tKaki} L${cx - kaki / 2 + 7},${b + tKaki} Z`;
  const badan = bidang(d) + (tKaki ? bidang(t) : "");
  const isi = ell(cx, y + 5, rx - 11, ry - 7);
  return {
    badan,
    d,
    mulut: ell(cx, y, rx, ry),
    isi,
    dinding: kurang(ell(cx, y, rx, ry), isi),
    klip: rect(-300, -300, 1500, y + 300) + ell(cx, y, rx, ry),
    /** Bayangan sisi kanan dengan arsir. */
    bayang: (p = "hatch") => kurang(sebagai(badan, pola(p)), ell(cx - rx * 0.34, y + tinggi * 0.14, rx * 0.98, tinggi * 1.02)),
    /** Pita melingkar badan mangkuk: lengkung bawah ikut bentuk mulut. */
    pita: (yy, tebal) =>
      dalam(
        bidang(`M${cx - rx - 10},${yy} Q${cx},${yy + ry * 0.9} ${cx + rx + 10},${yy} L${cx + rx + 10},${yy + tebal} Q${cx},${yy + tebal + ry * 0.9} ${cx - rx - 10},${yy + tebal} Z`),
        bidang(d),
      ),
  };
}

function piringAtas(cx, cy, r, tepi = 28) {
  return {
    utuh: circ(cx, cy, r),
    cincin: kurang(circ(cx, cy, r), circ(cx, cy, r - tepi), circ(cx, cy, r - 9, 'fill="none" stroke="#000" stroke-width="2.6"')),
  };
}

function uap(xs, atas, bawah, lebar = 7.5) {
  return xs
    .map((x, i) => {
      const t = i % 2 ? -1 : 1;
      const m = (atas + bawah) / 2;
      return garis(`M${x},${bawah} C${x - 22 * t},${bawah - 30} ${x + 22 * t},${m + 18} ${x},${m} C${x - 18 * t},${m - 18} ${x + 16 * t},${atas + 22} ${x},${atas}`, lebar);
    })
    .join("");
}

function kepiting(cx, cy, k = 1) {
  const kaki = [];
  for (const t of [-1, 1]) {
    for (const [a, b, c, d, e, f] of [
      [84, 12, 142, -6, 178, 30],
      [90, 32, 150, 28, 176, 70],
      [78, 52, 134, 62, 152, 104],
    ]) {
      kaki.push(garis(`M${t * a},${b} L${t * c},${d} L${t * e},${f}`, 14));
    }
  }
  const lengan = [-1, 1].map((t) => garis(`M${t * 60},-46 C${t * 78},-66 ${t * 92},-76 ${t * 106},-96`, 18));
  const capit = [-1, 1].map((t) =>
    grup(
      `transform="translate(${t * 106} -92) scale(${t * 1.45} 1.45)"`,
      bidang("M0,0 C28,-4 38,-28 24,-46 C16,-34 6,-28 -8,-28 C-6,-38 -8,-48 -16,-54 C-26,-34 -22,-10 0,0 Z"),
    ),
  );
  const badan = bidang("M-108,6 C-108,-44 -54,-68 0,-68 C54,-68 108,-44 108,6 C108,54 58,80 0,80 C-58,80 -108,54 -108,6 Z");
  const tata = (...s) => letak(cx, cy, 0, k, ...s);
  const utuh = tata(...kaki, ...lengan, ...capit, badan);
  return {
    siluet: [utuh],
    merah: utuh,
    kuning: tata(ell(0, 6, 76, 50, pola("dot2x"))),
    biru: tata(kurang(sebagai(badan, pola("hatch")), ell(-34, -8, 112, 84))),
    hitam: tata(
      circ(-26, -78, 9),
      circ(26, -78, 9),
      garis("M-24,-68 L-22,-58", 4),
      garis("M24,-68 L22,-58", 4),
      buram(0.7, garis("M-36,-26 Q-16,4 -38,38", 3.5), garis("M36,-26 Q16,4 38,38", 3.5)),
    ),
  };
}

function gonggong(x, y, a, k = 1) {
  const kulit = bidang(
    "M-2,-72 C2,-66 6,-58 8,-52 C12,-50 15,-45 16,-40 C22,-36 26,-30 27,-24 C36,-16 41,-1 37,12 C32,29 19,43 7,49 C0,52 -7,49 -9,43 C-16,29 -28,15 -28,-2 C-28,-13 -23,-23 -18,-31 C-15,-41 -11,-49 -8,-55 C-6,-61 -4,-67 -2,-72 Z",
  );
  const celah = bidang("M19,-6 C25,7 17,27 6,42 C4,28 7,8 19,-6 Z");
  const tata = (...s) => letak(x, y, a, k, ...s);
  return {
    siluet: [tata(kulit)],
    kuning: tata(kulit),
    merah: tata(sebagai(kulit, pola("dot1")), garis("M-9,-52 Q0,-46 8,-51", 4.5), garis("M-16,-34 Q2,-26 16,-37", 5.5), garis("M-26,-10 Q-4,4 26,-21", 6.5)),
    biru: "",
    hitam: tata(buram(0.9, celah)),
  };
}

function ikan(x, y, a, k = 1) {
  return letak(x, y, a, k, bidang("M-62,0 C-38,-28 14,-32 44,-7 L72,-27 C68,-9 68,9 72,27 L44,7 C14,32 -38,28 -62,0 Z"));
}

/** Kerupuk bertepi kuning dan berbintik. Pusat di (0, 0), lebar sekitar 145. */
function krupuk(x, y, a, k = 1) {
  const t = (...s) => letak(x, y, a, k, ...s);
  const b = bongkah("M-68,-10 L-44,-38 L-18,-30 L8,-54 L32,-32 L54,-38 L52,-6 L70,14 L42,30 L24,56 L-6,40 L-34,50 L-48,24 L-74,16 Z", 6);
  const bintik = [
    [-40, -18], [-12, -4], [16, -24], [36, 6], [-22, 24], [6, 20], [-46, 6],
  ]
    .map(([u, v]) => circ(u, v, 4))
    .join("");
  return { siluet: [t(b)], kuning: t(sebagai(b, pola("dot1"))), merah: "", biru: "", hitam: t(bintik) };
}

/** Sarang mi tampak atas: cincin berombak yang terputus-putus, tiap pita bergantian warna. */
function sarangMi(cx, cy) {
  const pita = [];
  [20, 38, 56, 74, 92].forEach((r, i) => {
    const jumlah = i === 0 ? 1 : i < 3 ? 2 : 3;
    for (let s = 0; s < jumlah; s++) {
      const a0 = (s / jumlah) * 360 + i * 47 + 9;
      const a1 = ((s + 1) / jumlah) * 360 + i * 47 - 9;
      const t = [];
      for (let a = a0; a <= a1; a += 6) {
        const rad = (a * Math.PI) / 180;
        const rr = r + 3.5 * Math.sin(rad * 5 + i);
        t.push(`${(cx + rr * Math.cos(rad)).toFixed(1)},${(cy + rr * 0.96 * Math.sin(rad)).toFixed(1)}`);
      }
      pita.push({ d: "M" + t.join(" L"), jingga: (i + s) % 2 === 0 });
    }
  });
  return pita;
}

// ---------------------------------------------------------------- objek hidangan (kanvas 480 x 480)
const O = {};

O["seafood-gonggong"] = () => ({
  ...gabung(kepiting(240, 196, 0.9), gonggong(150, 374, -62, 1.2), gonggong(330, 374, 62, 1.2)),
  dasar: alas(240, 434, 150, 8),
});

O["sup-ikan"] = () => {
  const m = mangkuk({ y: 256, ry: 46, tinggi: 114 });
  const posisi = [
    [158, 266, -8, 0.82],
    [242, 250, 2, 0.88],
    [324, 268, 8, 0.8],
  ];
  const tata = (...s) => posisi.map(([x, y, a, k]) => letak(x, y, a, k, ...s)).join("");
  const iris = tata(bidang("M-50,8 C-44,-20 20,-30 50,-10 C58,10 32,26 -6,28 C-30,28 -48,22 -50,8 Z"));
  const kulit = tata(bidang("M-50,8 C-44,-20 20,-30 50,-10 C24,-14 -22,-9 -50,8 Z"));
  const serat = tata(garis("M-24,0 Q-16,10 -22,20", 3), garis("M0,-8 Q9,6 2,21", 3), garis("M24,-8 Q32,3 25,16", 3));
  const motif = ikan(240, 340, 0, 0.66);
  const naik = uap([176, 240, 304], 64, 184);
  return {
    siluet: [m.badan, m.mulut, uap([176, 240, 304], 64, 184, 22)],
    kuning: kurang(m.isi, iris),
    merah: kurang(sebagai(m.isi, pola("dot1")), iris) + kulit + m.bayang("hatch"),
    biru: kurang(m.badan, motif) + m.dinding + naik,
    hitam: serat + letak(240, 340, 0, 0.66, circ(-38, -4, 5)),
  };
};

O["mie-tarempa"] = () => {
  const cx = 224;
  const cy = 214;
  const pr = piringAtas(cx, cy, 146);
  // Pita mi lebar: sarang melingkar, ditimpa beberapa pita lepas dengan celah putih tipis.
  const ox = cx + 6;
  const oy = cy + 10;
  const sarang = sarangMi(ox, oy);
  const lepas = [
    `M${ox - 92},${oy - 22} C${ox - 54},${oy - 54} ${ox - 18},${oy + 8} ${ox + 22},${oy - 22} S${ox + 72},${oy - 30} ${ox + 92},${oy - 6}`,
    `M${ox - 80},${oy + 44} C${ox - 44},${oy + 16} ${ox - 8},${oy + 72} ${ox + 28},${oy + 40} S${ox + 62},${oy + 28} ${ox + 78},${oy + 46}`,
  ];
  const lepasG = lepas.map((d) => garis(d, 14)).join("");
  const lepasL = lepas.map((d) => garis(d, 20)).join("");
  const sarangJ = sarang.filter((p) => p.jingga).map((p) => garis(p.d, 14)).join("");
  const sarangK = sarang.filter((p) => !p.jingga).map((p) => garis(p.d, 14)).join("");
  const kr = gabung(krupuk(132, 150, -14, 0.62), krupuk(186, 104, 22, 0.5));
  const tutup = kr.siluet;
  const tBungkus = (...s) => letak(366, 356, -22, 1, ...s);
  const bungkus = tBungkus(bongkah("M-86,0 L-60,-30 L60,-30 L86,0 L60,30 L-60,30 Z", 8));
  const tali = tBungkus(rect(-46, -40, 9, 80), rect(36, -40, 9, 80));
  return {
    siluet: [pr.utuh, bungkus, garis("M278,36 L424,214", 16), garis("M304,26 L442,194", 16), ...tutup],
    kuning: kurang(kurang(sarangJ + sarangK, lepasL) + lepasG, ...tutup, bungkus) + kr.kuning + bungkus,
    merah: kurang(kurang(sarangJ, lepasL), ...tutup, bungkus),
    biru: kurang(pr.cincin, bungkus, ...tutup) + bungkus,
    hitam:
      garis("M278,36 L424,214", 8) +
      garis("M304,26 L442,194", 8) +
      tali +
      tBungkus(buram(0.8, garis("M-30,-14 L24,-14", 2.6), garis("M-30,0 L24,0", 2.6), garis("M-30,14 L24,14", 2.6))) +
      kr.hitam,
  };
};

O["nasi-ayam-hainan"] = () => {
  const m = mangkuk({ cx: 398, y: 362, rx: 44, ry: 12, tinggi: 36, kaki: 36, tKaki: 7 });
  const piring = ell(238, 330, 180, 66);
  const nasi = bidang("M92,322 C82,236 142,176 194,176 C250,176 298,240 288,322 C288,352 94,352 92,322 Z");
  const irisD = "M-19,-44 C-6,-53 13,-51 21,-40 L26,36 C13,45 -11,45 -23,36 Z";
  const kulitD = "M-19,-44 C-6,-53 13,-51 21,-40 L22,-20 C11,-29 -6,-29 -21,-22 Z";
  const posisi = [0, 1, 2, 3].map((i) => [282 + i * 38, 298 + i * 3, 10 + i * 2]);
  const iris = posisi.map(([x, y, a]) => letak(x, y, a, 1, bidang(irisD))).join("");
  const kulit = posisi.map(([x, y, a]) => letak(x, y, a, 1, bidang(kulitD))).join("");
  const serat = posisi.map(([x, y, a]) => letak(x, y, a, 1, buram(0.75, garis("M-5,-12 L-6,24", 2.6), garis("M8,-12 L10,24", 2.6)))).join("");
  const timun = [
    [106, 354],
    [156, 368],
    [208, 376],
  ];
  const timunL = timun.map(([x, y]) => ell(x, y, 24, 15)).join("");
  const timunD = timun.map(([x, y]) => ell(x, y, 16, 9)).join("");
  const butir = [
    [150, 240], [190, 214], [228, 238], [170, 282], [214, 292], [128, 288], [250, 274], [186, 258], [146, 318], [226, 324],
  ]
    .map(([x, y], i) => putar(i * 47, x, y, rect(x - 6, y - 2, 12, 4, 2)))
    .join("");
  const mangkukS = m.badan + m.mulut;
  return {
    siluet: [piring, nasi, iris, m.badan, m.mulut],
    kuning:
      kurang(kulit + sebagai(iris, pola("dot1")), mangkukS) +
      kurang(sebagai(nasi, pola("dot3")), ell(164, 240, 100, 94), iris) +
      kurang(timunL, m.badan, timunD) +
      m.isi,
    merah: kurang(sebagai(kulit, pola("dot1")), mangkukS) + m.badan + m.dinding + m.isi,
    biru: kurang(piring, nasi, iris, mangkukS, timunD) + m.bayang("hatch"),
    hitam: butir + kurang(serat, mangkukS),
    dasar: alas(240, 424, 150, 9),
  };
};

/** Cangkir porselen, tatakan, kopi, dan uap. Pusat cangkir di x = 300. */
function cangkirPorselen() {
  const cx = 300;
  const d = `M${cx - 92},170 C${cx - 92},244 ${cx - 68},306 ${cx - 32},312 L${cx + 32},312 C${cx + 68},306 ${cx + 92},244 ${cx + 92},170 A92,22 0 0 1 ${cx - 92},170 Z`;
  const cangkir = bidang(d);
  const mulut = ell(cx, 170, 92, 22);
  const kopi = ell(cx, 174, 78, 14);
  const gagang = garis("M386,198 C438,192 442,258 372,268", 16);
  const tatakan = ell(cx, 326, 138, 28);
  const pitaC = dalam(rect(200, 208, 200, 11) + rect(200, 228, 200, 5), cangkir);
  return {
    siluet: [cangkir, mulut, gagang, tatakan, uap([266, 334], 60, 140, 22)],
    kuning: kopi,
    merah: kopi,
    biru: kurang(cangkir, pitaC) + kurang(gagang, cangkir) + kurang(tatakan, cangkir) + kurang(mulut, kopi) + buram(0.5, kopi) + uap([266, 334], 60, 140),
    hitam: "",
  };
}

O["kopitiam"] = () => {
  const rotiD = "M-72,76 L-72,-20 C-96,-30 -96,-76 -58,-78 L58,-78 C96,-76 96,-30 72,-20 L72,76 C72,84 -72,84 -72,76 Z";
  const tRoti = (...s) => letak(132, 318, -9, 1, ...s);
  const tRoti2 = (...s) => letak(154, 300, 4, 1, ...s);
  const roti = tRoti(bidang(rotiD));
  const roti2 = tRoti2(bidang(rotiD));
  const isiRoti = tRoti(letak(0, 3, 0, 0.84, bidang(rotiD)));
  const mentega = tRoti(putar(14, 4, -10, rect(-22, -32, 46, 40, 5)));
  // Srikaya: olesan kehijauan dari titik biru di atas kuning.
  const srikaya = tRoti(bidang("M-48,-34 C-20,-56 32,-50 48,-30 C58,-6 52,30 30,44 C4,56 -34,52 -48,32 C-58,8 -58,-16 -48,-34 Z"));
  const rotiO = {
    siluet: [roti, roti2],
    kuning: roti2 + kurang(roti, mentega),
    merah: kurang(roti2, roti) + kurang(roti, isiRoti) + kurang(tRoti(letak(0, 3, 0, 0.84, bidang(rotiD, pola("dot1")))), mentega, srikaya),
    biru: kurang(sebagai(srikaya, pola("dotbig")), mentega),
    hitam: "",
  };
  return { ...timpa(cangkirPorselen(), rotiO), dasar: alas(250, 424, 150, 9) };
};

/** Martabak dipotong kotak dalam proyeksi isometrik, satu potong tergeser. */
function martabakBlok() {
  // u dari sudut kiri ke atas, v dari sudut kiri ke bawah.
  const L = [50, 292];
  const eu = [142, -88];
  const ev = [142, 88];
  const p = (u, v, dx = 0, dy = 0) => [(L[0] + u * eu[0] + v * ev[0] + dx).toFixed(1), (L[1] + u * eu[1] + v * ev[1] + dy).toFixed(1)];
  const tebal = 26;
  const n = 3;
  const celah = 0.012;
  const atas = [];
  const sisi = [];
  const noda = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const lepas = i === 2 && j === 2;
      const dx = lepas ? 26 : 0;
      const dy = lepas ? -2 : 0;
      const u0 = i / n + celah;
      const u1 = (i + 1) / n - celah;
      const v0 = j / n + celah;
      const v1 = (j + 1) / n - celah;
      const a = p(u0, v0, dx, dy);
      const b = p(u1, v0, dx, dy);
      const c = p(u1, v1, dx, dy);
      const e = p(u0, v1, dx, dy);
      atas.push(`M${a} L${b} L${c} L${e} Z`);
      const bwh = (t) => [t[0], (+t[1] + tebal).toFixed(1)];
      if (i === 0 || lepas) sisi.push(`M${a} L${e} L${bwh(e)} L${bwh(a)} Z`);
      if (j === n - 1 || lepas) sisi.push(`M${e} L${c} L${bwh(c)} L${bwh(e)} Z`);
      const t = p((u0 + u1) / 2, (v0 + v1) / 2, dx, dy);
      noda.push(ell(+t[0] - 8 + ((i * 7 + j * 3) % 16), +t[1] - 3 + ((i * 5 + j * 2) % 6), 10, 6));
    }
  }
  const muka = atas.map((d) => bongkah(d, 3)).join("");
  const samping = sisi.map((d) => bongkah(d, 3)).join("");
  const blok = muka + samping;
  return {
    siluet: [blok],
    kuning: blok,
    merah: sebagai(muka, pola("dot1")).replaceAll('stroke="#000"', 'stroke="none"') + samping + noda.join(""),
    biru: "",
    hitam: sisi.map((d) => dalam(bidang(d, pola("hatchfine")), bidang(d))).join(""),
  };
}

O["martabak-prata"] = () => {
  const prX = 334;
  const prY = 170;
  // Bulatan pipih dengan beberapa tonjolan kecil, seperti adonan yang ditebar tangan.
  const bentukPrata = (y) => {
    const tonjol = [18, 96, 158, 232, 306]
      .map((a) => {
        const r = (a * Math.PI) / 180;
        return circ((prX + 90 * Math.cos(r)).toFixed(1), (y + 61 * Math.sin(r)).toFixed(1), 15);
      })
      .join("");
    return grup("", ell(prX, y, 100, 69), tonjol);
  };
  const prata = bentukPrata(prY);
  const prataT = bentukPrata(prY + 9);
  // Bercak kecokelatan bekas wajan, di sela lilitan.
  const bercak = dalam(rect(220, 80, 240, 190, 0, pola("dot1")), ell(300, 142, 34, 13), ell(380, 186, 38, 14), ell(292, 200, 26, 10));
  const prataO = {
    siluet: [prata, prataT],
    kuning: prata + prataT,
    merah: garis(spiral(prX, prY, 6, 92, 0.69, 3.2, 0.6), 5.5) + kurang(prataT, prata) + bercak,
    biru: "",
    hitam: "",
  };
  return { ...timpa(prataO, martabakBlok()), dasar: alas(220, 430, 150, 8) };
};

O["mie-bakmi"] = () => {
  const m = mangkuk();
  const helai = [
    "M200,88 C190,160 212,190 200,224 C194,244 200,258 206,272",
    "M213,86 C204,158 226,190 214,226 C208,246 212,258 218,274",
    "M226,84 C218,158 240,190 228,226 C222,246 226,260 232,276",
    "M239,82 C232,158 254,190 242,226 C236,246 240,260 246,276",
    "M252,80 C246,156 268,190 256,226 C250,246 254,260 260,274",
    "M265,78 C260,156 282,188 270,224 C264,244 268,258 274,272",
  ];
  const lebarLubang = grup("", ...helai.map((d) => garis(d, 15)));
  const mi = grup("", ...helai.map((d) => garis(d, 8.5)));
  const pita = m.pita(292, 24);
  const seledri = [
    [320, 256, -30],
    [346, 262, 18],
    [302, 268, 40],
  ]
    .map(([x, y, a]) => putar(a, x, y, ell(x, y, 22, 9)))
    .join("");
  const irisan = dalam(putar(-12, 150, 258, rect(126, 246, 54, 22, 4)), m.klip);
  const hias = [100, 128, 156, 184, 212, 240, 268, 296, 324, 352, 380]
    .map((x) => {
      const y = 304 + 28 * (1 - ((x - 240) / 150) ** 2) * 0.55;
      return bidang(`M${x},${y - 7} L${x + 11},${y} L${x},${y + 7} L${x - 11},${y} Z`);
    })
    .join("");
  return {
    siluet: [m.badan, m.mulut, lebarLubang],
    kuning: kurang(m.isi, mi) + mi + dalam(seledri, m.klip) + pita,
    merah:
      kurang(m.badan, pita) +
      irisan +
      kurang(dalam(ell(240, 268, 120, 20, pola("dot1")), m.klip), mi) +
      garis("M207,94 C198,160 218,190 206,226", 2.6) +
      garis("M233,90 C226,158 247,190 235,226", 2.6) +
      garis("M259,86 C253,156 275,190 263,226", 2.6),
    biru: kurang(m.dinding, lebarLubang) + dalam(seledri, m.klip) + kurang(m.bayang("hatch"), pita),
    hitam: garis("M92,62 L410,36", 8) + garis("M98,100 L420,72", 8) + dalam(hias, bidang(m.d)),
  };
};

O["bubur"] = () => {
  const m = mangkuk({ y: 270, ry: 44, tinggi: 106 });
  const bubur = bidang("M112,268 C124,232 186,206 240,206 C294,206 356,232 368,268 C356,296 124,296 112,268 Z") + m.isi;
  const sendokT = bongkah("M172,244 L106,142 C100,132 108,126 116,132 L192,232 Z", 4);
  const sendokM = putar(-34, 180, 254, ell(180, 254, 40, 21));
  const sendok = sendokT + sendokM;
  const tCakwe = (...s) => letak(352, 176, -54, 1, ...s);
  const cakwe = tCakwe(remah("M-84,-24 L84,-24 C98,-24 98,-1 84,-1 L-84,-1 C-98,-1 -98,-24 -84,-24 Z", 5, 9), remah("M-84,1 L84,1 C98,1 98,24 84,24 L-84,24 C-98,24 -98,1 -84,1 Z", 5, 9));
  const seam = tCakwe(garis("M-82,0 L82,0", 3.5));
  const hangus = tCakwe(...[-66, -32, 2, 36, 68].flatMap((x, i) => [circ(x, -12, 5 + (i % 2)), circ(x + 14, 12, 5 + ((i + 1) % 2))]));
  const daun = [
    [232, 232],
    [262, 248],
    [290, 232],
    [246, 262],
  ]
    .map(([x, y]) => kurang(circ(x, y, 9), circ(x, y, 4)))
    .join("");
  const bawang = [
    [212, 250],
    [276, 222],
    [272, 266],
    [308, 254],
    [228, 272],
  ]
    .map(([x, y], i) => putar(i * 50, x, y, rect(x - 8, y - 3, 16, 6, 3)))
    .join("");
  const pitaB = m.pita(310, 18);
  return {
    siluet: [m.badan, m.mulut, bubur, sendok, cakwe],
    kuning:
      kurang(m.badan, pitaB) +
      cakwe +
      kurang(daun + bawang, sendokM) +
      kurang(sebagai(bubur, pola("dot3")), sendok, cakwe, ell(214, 236, 142, 62)),
    merah: kurang(m.bayang("hatch2x"), pitaB) + pitaB + kurang(sendok, cakwe) + dalam(tCakwe(rect(-110, -32, 220, 64, 0, pola("dot1"))), cakwe) + hangus + kurang(bawang, sendokM),
    biru: kurang(daun, sendokM) + kurang(m.dinding, bubur, sendok),
    hitam: seam,
  };
};

O["nasi-padang"] = () => {
  const tata = (...s) => putar(-11, 240, 232, ...s);
  const daunD = "M38,206 L62,214 L46,232 L70,240 L52,262 L96,332 L380,332 C414,316 440,276 452,232 C440,190 414,146 380,132 L96,132 L60,178 Z";
  const daun = tata(bidang(daunD));
  const nasi = gumpal(168, 214, 62, 52, 10, 22, 0.2);
  const rendangB = [
    "M284,158 L308,148 L334,152 L350,178 L338,204 L312,212 L284,204 L272,180 Z",
    "M340,206 L366,196 L392,206 L400,232 L384,256 L356,260 L334,244 Z",
    "M270,220 L296,214 L318,228 L322,256 L300,274 L270,272 L254,248 Z",
  ]
    .map((d) => bongkah(d, 16))
    .join("");
  const sambal = bidang("M300,296 C286,274 324,266 356,272 C392,280 392,314 354,322 C328,328 308,318 300,296 Z");
  const sayur = bidang("M112,290 C116,266 170,262 200,274 C232,288 222,320 186,324 C146,328 104,318 112,290 Z");
  const lauk = nasi + rendangB + sambal + sayur;
  const urat = [garis("M50,232 L452,232", 6)];
  for (let x = 84; x <= 400; x += 24) {
    urat.push(garis(`M${x},232 L${x + 40},136`, 3));
    urat.push(garis(`M${x},232 L${x + 40},328`, 3));
  }
  const biji = [
    [322, 290],
    [344, 302],
    [366, 288],
    [334, 312],
    [370, 306],
  ]
    .map(([x, y]) => circ(x, y, 4.2))
    .join("");
  const butir = [
    [130, 190], [166, 170], [202, 186], [120, 232], [160, 222], [196, 240], [146, 258], [186, 262], [222, 214],
  ]
    .map(([x, y], i) => putar(i * 37, x, y, rect(x - 6, y - 2, 12, 4, 2)))
    .join("");
  const nangka = [
    [140, 290, 20],
    [168, 306, -20],
    [192, 288, 50],
  ]
    .map(([x, y, a]) => putar(a, x, y, rect(x - 12, y - 5, 24, 10, 5)))
    .join("");
  // Serpih rempah: sebaran tetap, mengikuti bentuk rendang.
  const acak = mulberry32(7);
  const serpih = [];
  for (let i = 0; i < 46; i++) {
    const x = (256 + acak() * 150).toFixed(1);
    const y = (144 + acak() * 134).toFixed(1);
    serpih.push(putar(Math.round(acak() * 180), x, y, rect(+x - 4.5, +y - 2, 9, 4, 2)));
  }
  return {
    siluet: [daun],
    kuning: kurang(daun, tata(nasi)),
    merah: tata(rendangB) + kurang(tata(buram(0.75, sayur)), tata(nangka), tata(nasi)),
    biru: kurang(daun, tata(lauk), tata(...urat)) + tata(buram(0.5, rendangB)) + tata(sebagai(sambal, pola("dotbig"))),
    hitam: tata(butir, biji) + tata(dalam(serpih.join(""), rendangB)),
    dasar: alas(240, 424, 150, 9),
  };
};

O["sunda-jawa"] = () => {
  const cx = 240;
  const cy = 226;
  const tepi = circ(cx, cy, 158);
  const daun = circ(cx, cy, 120);
  const nasi = gumpal(186, 172, 40, 34, 9, 16, 0.2);
  const lk = ikan(268, 276, -8, 1.12);
  const timun = [
    [298, 158],
    [332, 196],
  ];
  const timunL = timun.map(([x, y]) => circ(x, y, 27)).join("");
  const timunD = timun.map(([x, y]) => circ(x, y, 20)).join("");
  const sambal = circ(150, 262, 28);
  const lauk = nasi + lk + timunL + sambal;
  const butir = [
    [168, 152], [196, 142], [214, 168], [160, 186], [190, 192], [212, 196],
  ]
    .map(([x, y], i) => putar(i * 47, x, y, rect(x - 6, y - 2, 12, 4, 2)))
    .join("");
  const benih = timun
    .flatMap(([x, y]) => [0, 60, 120, 180, 240, 300].map((a) => circ((x + 10 * Math.cos((a * Math.PI) / 180)).toFixed(1), (y + 10 * Math.sin((a * Math.PI) / 180)).toFixed(1), 2.4)))
    .join("");
  const panggang = letak(268, 276, -8, 1.12, garis("M-24,-20 L-34,20", 4), garis("M-4,-22 L-14,22", 4), garis("M16,-20 L6,20", 4), circ(-44, -3, 5));
  const anyam = [];
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * 2 * Math.PI;
    const c = Math.cos(a).toFixed(4);
    const s = Math.sin(a).toFixed(4);
    anyam.push(garis(`M${(cx + 128 * c).toFixed(1)},${(cy + 128 * s).toFixed(1)} L${(cx + 150 * c).toFixed(1)},${(cy + 150 * s).toFixed(1)}`, 3));
  }
  const urat = [];
  for (let x = 110; x <= 370; x += 26) urat.push(garis(`M${x},100 L${x},352`, 2.8));
  return {
    siluet: [tepi],
    kuning: kurang(tepi, nasi, timunD, sambal),
    merah: kurang(sebagai(tepi, pola("hatch2x")), daun, nasi, timunL) + lk + sambal,
    biru: kurang(daun, lauk, ...urat) + buram(0.2, lk),
    hitam: butir + benih + panggang + kurang(anyam.join(""), nasi, timunL) + circ(150, 262, 28, 'fill="none" stroke="#000" stroke-width="5"'),
    dasar: alas(240, 424, 140, 9),
  };
};

O["sate-kambing"] = () => {
  const tusuk = [0, 1, 2, 3].map((i) => ({ y: 112 + i * 54, x0: 56 + i * 6 }));
  const tata = (...s) => putar(-13, 240, 190, ...s);
  const daging = [];
  const lemak = [];
  const lidi = [];
  for (const { y, x0 } of tusuk) {
    lidi.push(garis(`M${x0 - 12},${y} L${x0 + 344},${y}`, 6));
    for (let j = 0; j < 5; j++) {
      const r = rect(x0 + 18 + j * 48, y - 20, 42, 40, 10);
      if (j === 1 || j === 3) lemak.push(r);
      else daging.push(r);
    }
  }
  const potongan = tata(...daging, ...lemak);
  const arang = [
    "M92,398 L114,362 L156,354 L172,386 L146,414 L104,414 Z",
    "M162,404 L178,358 L226,348 L248,382 L230,416 L176,418 Z",
    "M240,400 L254,358 L298,352 L320,384 L298,416 L252,416 Z",
    "M310,404 L328,366 L366,360 L386,392 L360,416 L320,414 Z",
  ]
    .map((d) => bongkah(d, 8))
    .join("");
  // Arang menyala: bara di sela bongkah, tanpa nyala api.
  const bara = bidang("M96,372 C116,344 152,350 170,346 C196,332 232,340 250,348 C276,336 300,344 322,352 C352,346 376,358 388,380 L388,400 L96,400 Z");
  const percik = [
    [128, 330, 3.5],
    [186, 318, 4.5],
    [258, 324, 3.5],
    [316, 314, 4],
    [364, 334, 3.5],
  ]
    .map(([x, y, r]) => circ(x, y, r))
    .join("");
  return {
    siluet: [potongan, arang, tata(...lidi), bara, percik],
    latar: halo(240, 206, 172),
    kuning: potongan + kurang(bara, arang) + percik,
    merah: potongan + kurang(bara, arang) + percik,
    biru: tata(...daging.map((r) => sebagai(r, tipis(0.46)))),
    hitam: tata(...lidi) + tata(...daging.map((r) => sebagai(r, pola("dotbig")))) + buram(0.92, arang),
    dasar: alas(240, 436, 150, 7),
  };
};

O["bakso"] = () => {
  const m = mangkuk({ y: 262, ry: 42, tinggi: 112 });
  const bola = [
    [150, 228, 48],
    [238, 200, 60],
    [328, 230, 46],
  ];
  const b = dalam(bola.map(([x, y, r]) => circ(x, y, r)).join(""), m.klip);
  const pitaB = m.pita(310, 24);
  const miGaris = [
    "M136,286 q17,-11 34,0 t34,0 t34,0 t34,0 t34,0 t34,0",
    "M150,296 q17,-9 30,0 t30,0 t30,0 t30,0 t30,0",
    "M126,276 q14,-8 28,0 t28,0",
    "M300,272 q14,-8 28,0 t28,0",
  ];
  const mi = miGaris.map((d) => garis(d, 6.5)).join("");
  const seledri = [
    [120, 288], [148, 302], [352, 288], [326, 304], [238, 304], [200, 278], [282, 280],
  ]
    .map(([x, y]) => circ(x, y, 5))
    .join("");
  const titik = [100, 138, 176, 214, 252, 290, 328, 366];
  const hias = titik.map((x) => circ(x, 320 + 22 * (1 - ((x - 240) / 150) ** 2) * 0.9, 6)).join("");
  return {
    siluet: [m.badan, m.mulut, b],
    kuning: kurang(m.isi, b) + b + pitaB,
    merah: dalam(buram(0.62, bola.map(([x, y, r]) => circ(x, y, r)).join("")), m.klip) + kurang(m.isi, b, mi) + kurang(m.bayang("hatch"), pitaB),
    biru: dalam(buram(0.24, bola.map(([x, y, r]) => circ(x, y, r)).join("")), m.klip) + kurang(m.badan, pitaB) + kurang(m.dinding, b) + kurang(seledri, b),
    hitam:
      dalam(bola.map(([x, y, r]) => kurang(circ(x, y, r, pola("dotbig")), ell(x - r * 0.26, y - r * 0.26, r * 0.98, r * 0.98))).join(""), m.klip) + dalam(hias, bidang(m.d)),
  };
};

O["dimsum-chinese"] = () => {
  const cx = 240;
  const y = 268;
  const rx = 156;
  const ry = 46;
  const tinggi = 82;
  const pita = bidang(`M${cx - rx},${y} L${cx - rx},${y + tinggi} A${rx},${ry} 0 0 0 ${cx + rx},${y + tinggi} L${cx + rx},${y} A${rx},${ry} 0 0 1 ${cx - rx},${y} Z`);
  const atas = ell(cx, y, rx, ry);
  const isi = ell(cx, y + 3, rx - 14, ry - 9);
  const tiang = [];
  for (let x = cx - rx + 12; x < cx + rx; x += 15) {
    const t = (x - cx) / rx;
    const dy = ry * Math.sqrt(Math.max(0, 1 - t * t));
    tiang.push(garis(`M${x},${y + dy + 8} L${x},${y + tinggi + dy - 6}`, 3));
  }
  const ikat = (yy) => dalam(garis(`M${cx - rx},${yy} A${rx},${ry} 0 0 0 ${cx + rx},${yy}`, 9), pita);
  const siomay = (x, yy, k) => {
    const t = (...s) => letak(x, yy, 0, k, ...s);
    const tubuh = bidang("M-38,-30 C-46,-6 -44,24 -36,36 C-16,48 16,48 36,36 C44,24 46,-6 38,-30 Z");
    const tutup = ell(0, -30, 38, 15);
    return {
      siluet: [t(tubuh, tutup)],
      kuning: t(tubuh, tutup),
      merah: t(tutup, kurang(sebagai(tubuh, pola("hatch")), ell(-14, -2, 46, 56))),
      biru: "",
      hitam: t(garis("M-38,-24 q9.5,12 19,0 t19,0 t19,0 t19,0", 3.2), circ(0, -32, 6)),
    };
  };
  const hakau = (x, yy, k) => {
    const t = (...s) => letak(x, yy, 0, k, ...s);
    const tubuh = bidang("M-50,30 C-54,-14 -22,-42 4,-42 C32,-42 56,-14 52,30 C26,40 -24,40 -50,30 Z");
    const lipat = [-36, -24, -11, 3, 17, 30].map((u) => garis(`M${u},${-34 + Math.abs(u) * 0.32} l${(u * 0.1).toFixed(1)},14`, 3.2));
    return {
      siluet: [t(tubuh)],
      kuning: "",
      merah: t(ell(2, 8, 34, 22, pola("dot1"))),
      biru: "",
      hitam: t(garis("M-50,30 C-54,-14 -22,-42 4,-42 C32,-42 56,-14 52,30", 3.2), ...lipat),
    };
  };
  const isian = timpa(gabung(siomay(166, 206, 0.92), hakau(246, 190, 1), siomay(322, 208, 0.92)), gabung(hakau(190, 262, 0.92), siomay(286, 262, 0.98)));
  const naik = uap([180, 300], 50, 122);
  const dumpling = isian.siluet;
  return {
    siluet: [pita, atas, ...dumpling, uap([180, 300], 50, 122, 22)],
    kuning: kurang(pita, ...dumpling) + kurang(atas, isi, ...dumpling) + kurang(sebagai(isi, pola("dot2")), ...dumpling) + isian.kuning,
    merah: kurang(ikat(y + 14) + ikat(y + tinggi - 12), ...dumpling) + isian.merah + kurang(sebagai(pita, pola("hatch")), ell(cx - rx * 0.3, y + 34, rx * 1.02, 120)),
    biru: naik,
    hitam: kurang(tiang.join(""), ...dumpling) + isian.hitam,
    dasar: alas(240, 432, 140, 8),
  };
};

O["ayam-penyet"] = () => {
  const m = mangkuk({ y: 296, rx: 174, ry: 40, tinggi: 62, kaki: 190, tKaki: 0 });
  const kaki = [
    [146, 352],
    [240, 362],
    [334, 352],
  ]
    .map(([x, y]) => rect(x - 22, y, 44, 26, 10))
    .join("");
  // Paha ayam goreng: pangkal bulat di kiri, meruncing ke pergelangan di kanan atas. Kulit renyah bertepi tak rata.
  const ayamD = "M92,246 C84,196 130,154 188,154 C236,154 272,188 308,180 C328,176 342,162 354,150 L378,176 C364,194 354,214 342,236 C320,278 262,298 200,298 C146,298 100,284 92,246 Z";
  const ayamBentuk =
    `<path d="${ayamD}" fill="#000" stroke="#000" stroke-width="12" stroke-linecap="round" stroke-dasharray="0.1 13 0.1 19 0.1 11 0.1 23 0.1 15"/>` +
    `<path d="${ayamD}" fill="none" stroke="#000" stroke-width="17" stroke-linecap="round" stroke-dasharray="0.1 61 0.1 47 0.1 73"/>`;
  const tulangLuar = garis("M362,162 L408,108", 26) + circ(420, 108, 17) + circ(406, 92, 17);
  const tulang = garis("M362,162 L408,108", 18) + circ(420, 108, 13) + circ(406, 92, 13);
  const sambal = bidang("M126,232 C140,196 214,186 252,204 C282,220 266,246 238,244 C232,264 208,268 202,248 C184,254 168,272 158,250 C134,252 118,244 126,232 Z");
  const biji = [
    [166, 222], [204, 206], [238, 216], [186, 234], [222, 232], [150, 234], [254, 224],
  ]
    .map(([x, y]) => ell(x, y, 5, 3))
    .join("");
  const ulek = bongkah("M58,120 C58,102 84,100 88,116 L122,226 C130,258 86,272 76,244 Z", 6);
  const batu = m.badan + kaki + ulek;
  return {
    siluet: [m.badan, m.mulut, ayamBentuk, tulangLuar, ulek, kaki],
    kuning: ayamBentuk + kurang(m.isi, ayamBentuk),
    merah:
      dalam(kurang(rect(60, 120, 340, 200, 0, pola("dot1")), sambal), ayamBentuk) +
      kurang(sambal, biji) +
      kurang(dalam(rect(60, 120, 340, 200, 0, pola("hatch")), ayamBentuk), ell(176, 200, 176, 92), sambal) +
      kurang(m.isi, ayamBentuk),
    biru: "",
    hitam:
      kurang(buram(0.66, batu) + buram(0.4, m.dinding) + dalam(rect(40, 90, 400, 310, 0, pola("dotbig")), batu), ayamBentuk, m.isi, tulangLuar) +
      kurang(tulangLuar, tulang, ayamBentuk),
  };
};

O["pecel-gado"] = () => {
  const cx = 240;
  const cy = 222;
  const pr = piringAtas(cx, cy, 158, 24);
  const sayur = gumpal(232, 238, 100, 86, 13, 24, 0.2);
  const garisSaus = ["M136,196 C176,168 186,236 226,204 S288,192 322,220", "M132,244 C172,218 196,284 240,250 S300,246 330,270", "M154,292 C186,270 208,326 248,298 S274,290 292,300"];
  const saus = garisSaus.map((d) => garis(d, 19)).join("");
  const sausTipis = buram(0.42, saus);
  const telur = [
    [318, 146],
    [362, 196],
    [348, 262],
  ];
  const putih = (i) => circ(telur[i][0], telur[i][1], 37);
  const kuningT = (i) => circ(telur[i][0], telur[i][1], 18);
  const tepiT = (i) => circ(telur[i][0], telur[i][1], 37, 'fill="none" stroke="#000" stroke-width="2.8"');
  const kr = krupuk(152, 122, 0, 1);
  const krS = kr.siluet[0];
  const telurS = putih(0) + putih(1) + putih(2);
  const tutup = telurS + krS;
  const tauge = [
    [132, 306, 20], [170, 326, -30], [214, 334, 10], [262, 330, -20], [240, 156, 30], [284, 170, -10], [114, 248, 80],
  ]
    .map(([x, y, a]) => putar(a, x, y, rect(x - 13, y - 2.5, 26, 5, 2.5)))
    .join("");
  return {
    siluet: [pr.utuh, krS],
    kuning: kurang(sayur, tutup, tauge) + kurang(kuningT(0), putih(1)) + kurang(kuningT(1), putih(2)) + kuningT(2) + kr.kuning + kurang(saus, tutup),
    merah: kurang(saus, tutup),
    biru: kurang(sayur, tutup, saus, tauge) + kurang(pr.cincin, krS, telurS) + kurang(sausTipis, tutup),
    hitam: kurang(tepiT(0), putih(1)) + kurang(tepiT(1), putih(2)) + tepiT(2) + kr.hitam,
  };
};

/** Blok kue lapis dalam proyeksi miring. */
function blokLapis(x, y, l, t, dx, dy, n) {
  const muka = rect(x, y, l, t);
  const atas = bidang(`M${x},${y} L${x + dx},${y + dy} L${x + l + dx},${y + dy} L${x + l},${y} Z`);
  const sisi = bidang(`M${x + l},${y} L${x + l + dx},${y + dy} L${x + l + dx},${y + t + dy} L${x + l},${y + t} Z`);
  let garisMuka = "";
  let garisSisi = "";
  for (let i = 1; i < n; i += 2) {
    const yy = y + (i * t) / n;
    garisMuka += rect(x, yy, l, t / n);
    garisSisi += bidang(`M${x + l},${yy} L${x + l + dx},${yy + dy} L${x + l + dx},${yy + dy + t / n} L${x + l},${yy + t / n} Z`);
  }
  const utuh = muka + atas + sisi;
  return {
    siluet: [utuh],
    kuning: utuh,
    merah: garisMuka + garisSisi + sebagai(atas, pola("dot1")),
    biru: buram(0.45, garisMuka + garisSisi) + sebagai(sisi, pola("hatch")),
    hitam: "",
  };
}

/** Kotak kue berpita dalam proyeksi miring. warna: "merah" atau "biru". */
function kotakPita(bx, by, bl, bt, dx, dy, warna = "merah", { pakaiSimpul = true } = {}) {
  const muka = rect(bx, by, bl, bt);
  const atas = bidang(`M${bx},${by} L${bx + dx},${by + dy} L${bx + bl + dx},${by + dy} L${bx + bl},${by} Z`);
  const sisi = bidang(`M${bx + bl},${by} L${bx + bl + dx},${by + dy} L${bx + bl + dx},${by + bt + dy} L${bx + bl},${by + bt} Z`);
  const utuh = muka + atas + sisi;
  const tp = Math.round(bl * 0.18);
  const px = bx + (bl - tp) / 2;
  const ty = by + (bt - tp) / 2;
  const pitaV = rect(px, by, tp, bt);
  const pitaH = rect(bx, ty, bl, tp);
  const pitaA = bidang(`M${px},${by} L${px + dx},${by + dy} L${px + tp + dx},${by + dy} L${px + tp},${by} Z`);
  const pitaS = bidang(`M${bx + bl},${ty} L${bx + bl + dx},${ty + dy} L${bx + bl + dx},${ty + dy + tp} L${bx + bl},${ty + tp} Z`);
  const pita = pitaV + pitaH + pitaA + pitaS;
  const pusatX = px + tp / 2 + dx / 2;
  const pusatY = by + dy / 2;
  const ukuran = bl * 0.3;
  const simpul = pakaiSimpul
    ? grup(
        "",
        bidang(`M${pusatX},${pusatY} C${pusatX - ukuran},${pusatY - ukuran * 0.95} ${pusatX - ukuran * 1.25},${pusatY - ukuran * 0.1} ${pusatX - 4},${pusatY + 6} Z`),
        bidang(`M${pusatX},${pusatY} C${pusatX + ukuran},${pusatY - ukuran * 0.95} ${pusatX + ukuran * 1.25},${pusatY - ukuran * 0.1} ${pusatX + 4},${pusatY + 6} Z`),
        ell(pusatX, pusatY, ukuran * 0.2, ukuran * 0.16),
      )
    : "";
  const badan = kurang(utuh, pita, simpul);
  const o = { siluet: [utuh, simpul], kuning: "", merah: "", biru: "", hitam: "" };
  o.kuning = kurang(pita, simpul) + simpul;
  if (warna === "merah") {
    o.merah = badan;
    o.biru = kurang(sebagai(sisi, pola("hatch")), pitaS);
  } else {
    o.biru = badan;
    o.merah = kurang(sebagai(sisi, pola("hatch")), pitaS);
  }
  return o;
}

O["oleh-oleh"] = () => {
  const kotakB = kotakPita(232, 130, 150, 130, 32, -26);
  const utama = blokLapis(70, 240, 132, 128, 38, -30, 13);
  const iris = blokLapis(212, 248, 44, 128, 38, -30, 13);
  const kue = timpa(utama, iris);
  return { ...timpa(kotakB, kue), dasar: alas(240, 424, 150, 9) };
};

O["cafe"] = () => {
  const gelasD = "M162,192 L318,192 L298,392 C296,402 184,402 182,392 Z";
  const gelas = bidang(gelasD);
  const kopi = bidang("M170,262 C200,274 280,250 310,262 L298,392 C296,402 184,402 182,392 Z");
  const krucut = bidang("M136,84 L344,84 L272,184 L208,184 Z");
  const dudukan = rect(158, 178, 164, 14, 7);
  const gagang = garis("M326,104 C376,100 378,158 300,160", 13);
  const kertas = bidang("M136,84 L150,62 L172,76 L196,58 L222,74 L250,56 L274,74 L300,58 L322,76 L344,84 Z");
  const rusuk = ["M176,96 L222,172", "M214,96 L232,172", "M266,96 L248,172", "M304,96 L258,172"].map((d) => garis(d, 3.5)).join("");
  const tetes = [
    [240, 206],
    [240, 228],
  ]
    .map(([x, y]) => bidang(`M${x},${y - 9} C${x + 8},${y + 2} ${x + 6},${y + 8} ${x},${y + 8} C${x - 6},${y + 8} ${x - 8},${y + 2} ${x},${y - 9} Z`))
    .join("");
  const dinding = garis("M162,192 L182,392 C184,402 296,402 298,392 L318,192", 4.5);
  return {
    siluet: [gelas, krucut, dudukan, kertas, gagang],
    kuning: kopi + kurang(kertas, krucut),
    merah: kopi + kurang(krucut, kertas) + dudukan + gagang,
    biru: buram(0.5, kopi) + kurang(sebagai(krucut, pola("hatch")), bidang("M136,84 L250,84 L238,184 L208,184 Z")),
    hitam: dinding + rusuk + tetes,
    dasar: alas(240, 430, 120, 8),
  };
};

// ---------------------------------------------------------------- objek panduan (kanvas 720 x 480)
function laut(W, y0, ...lubang) {
  const isi =
    bidang(wave(y0, 5, 150, W, { tutup: 500 }), pola("dot2x")) +
    bidang(wave(y0 + 50, 7, 190, W, { tutup: 500 }), tipis(0.55)) +
    bidang(wave(y0 + 112, 6, 170, W, { tutup: 500 }), tipis(0.9));
  return lubang.length ? kurang(isi, ...lubang) : isi;
}
const riak = (...r) => r.map(([x, y, l]) => garis(`M${x},${y} L${x + l},${y}`, 3)).join("");

function kelong(x, y, k = 1, { titian = true } = {}) {
  const t = (...s) => letak(x, y, 0, k, ...s);
  const atap = bidang("M-132,-46 L0,-126 L132,-46 Z");
  const dinding = rect(-104, -46, 208, 62);
  const tiang = [-94, -48, 48, 94].map((u) => garis(`M${u},16 L${u},92`, 6)).join("");
  const dek = garis("M-146,16 L146,16", 4.5);
  const jembatan = titian ? garis("M-146,22 L-250,22", 4.5) + garis("M-186,22 L-186,84", 5) + garis("M-232,22 L-232,84", 5) : "";
  const pintu = rect(-16, -30, 32, 46);
  const jendela = rect(-78, -30, 34, 22) + rect(44, -30, 34, 22);
  const siluet = atap + dinding;
  return {
    siluet: [t(siluet)],
    kuning: "",
    merah: t(atap),
    biru: t(dinding),
    hitam: t(tiang, dek, jembatan, pintu, jendela, garis("M-146,-46 L146,-46", 3.5)),
  };
}

function feri(x, y, k = 1) {
  const t = (...s) => letak(x, y, 0, k, ...s);
  const lambung = bidang("M-110,0 L110,0 L88,42 L-86,42 Z");
  const kabin = rect(-70, -42, 140, 42, 6) + rect(-32, -70, 66, 28, 4);
  let jendela = "";
  for (let u = -58; u <= 46; u += 21) jendela += rect(u, -30, 13, 12, 2);
  return {
    siluet: [t(lambung, kabin)],
    kuning: t(kabin),
    merah: t(lambung),
    biru: "",
    hitam: t(jendela, rect(-22, -62, 46, 11, 2), garis("M2,-70 L2,-98", 3.5), bidang("M2,-98 L24,-90 L2,-82 Z"), garis("M-110,0 L110,0", 4)),
  };
}

const P = {};

P["seafood-classics"] = () => {
  const kp = kepiting(258, 322, 1.08);
  const kl = kelong(556, 214, 0.92, { titian: false });
  const matahari = circ(118, 104, 58);
  return [
    ["yellow", matahari],
    ["blue", laut(720, 240, ...kp.siluet, ...kl.siluet)],
    ["yellow", kp.kuning],
    ["red", kp.merah + kl.merah],
    ["blue", kp.biru + kl.biru],
    ["black", kp.hitam + kl.hitam + riak([486, 404, 58], [508, 420, 86], [40, 440, 40], [600, 446, 60])],
  ];
};

P["halal-nagoya"] = () => {
  // Deretan ruko sederhana di latar, meja kopitiam pagi di depan.
  const lebar = 118;
  const mejaY = 300;
  const yt = 104;
  const warnaDinding = { biru: "", kuning: "", merah: "" };
  let jendela = "";
  let pintu = "";
  let kaca = "";
  let tenda = "";
  let hias = "";
  ["biru", "kuning", "merah", "biru", "kuning", "merah"].forEach((w, i) => {
    const x = 8 + i * lebar;
    const yy = yt + (i % 2 ? 8 : 0);
    warnaDinding[w] += rect(x, yy, lebar - 4, mejaY - yy) + bidang(`M${x + 12},${yy} L${x + 57},${yy - 20} L${x + 102},${yy} Z`);
    for (const u of [22, 66]) {
      jendela += rect(x + u, yy + 16, 26, 44, 13);
      hias += garis(`M${x + u + 13},${yy + 20} L${x + u + 13},${yy + 58}`, 2.4);
    }
    tenda += bidang(`M${x},${yy + 72} L${x + lebar - 4},${yy + 72} L${x + lebar + 2},${yy + 92} L${x - 6},${yy + 92} Z`);
    pintu += rect(x + 16, yy + 92, 38, mejaY - yy - 92);
    kaca += rect(x + 64, yy + 102, 38, mejaY - yy - 110);
    for (let g = yy + 100; g < mejaY - 4; g += 10) hias += garis(`M${x + 19},${g} L${x + 51},${g}`, 2.2);
  });
  const dinding = warnaDinding.biru + warnaDinding.kuning + warnaDinding.merah;
  const objek = gabung(pindah(martabakBlok(), 6, 170, 0.62), pindah(O["mie-bakmi"](), 176, 142, 0.72), pindah(cangkirPorselen(), 372, 158, 0.74));
  const meja = rect(-10, mejaY, 740, 200);
  const tepiMeja = rect(-10, mejaY, 740, 5);
  const lis = rect(-10, 438, 740, 15);
  const kakiMeja = garis("M70,456 L70,500", 12) + garis("M650,456 L650,500", 12);
  const utama = objek.siluet;
  const bukaan = [jendela, tenda, pintu, kaca, meja, ...utama];
  return [
    ["yellow", kurang(circ(640, 62, 52), dinding) + kurang(buram(0.6, warnaDinding.kuning), ...bukaan) + objek.kuning],
    ["red", kurang(buram(0.34, warnaDinding.merah), ...bukaan) + kurang(tenda, meja, ...utama) + objek.merah + lis],
    ["blue", kurang(buram(0.3, warnaDinding.biru), ...bukaan) + buram(0.75, kurang(pintu, meja, ...utama)) + kurang(sebagai(kaca, pola("dot2x")), meja, ...utama) + objek.biru],
    ["black", kurang(hias + tepiMeja, tenda, ...utama) + objek.hitam + kakiMeja],
  ];
};

P["barelang-sunset"] = () => {
  const horizon = 292;
  const matahari = dalam(circ(330, 214, 170), rect(-20, -20, 800, horizon + 20));
  let pantul = "";
  [
    [6, 170],
    [26, 140],
    [46, 200],
    [70, 110],
    [96, 170],
    [124, 90],
    [156, 130],
  ].forEach(([dy, l]) => {
    pantul += rect(330 - l / 2, horizon + dy, l, 12, 6);
  });
  const rumah = kelong(574, 226, 0.78);
  const awan = [
    [40, 92, 190],
    [84, 116, 110],
    [470, 70, 170],
    [536, 94, 130],
    [420, 138, 90],
  ]
    .map(([x, y, l]) => rect(x, y, l, 9, 4.5))
    .join("");
  const siluetRumah = rumah.siluet;
  const perahu = letak(112, 300, 0, 1, bidang("M-52,0 L52,0 L38,20 L-36,20 Z"), rect(-20, -20, 38, 20, 4));
  return [
    ["yellow", kurang(matahari, awan) + pantul],
    ["red", kurang(matahari, awan) + awan + rumah.merah],
    ["blue", laut(720, horizon, pantul, perahu, ...siluetRumah) + rumah.biru],
    ["black", rumah.hitam + buram(0.9, perahu) + garis("M112,280 L112,250", 3.5) + riak([40, 420, 70], [600, 440, 80], [500, 410, 48])],
  ];
};

P["chinese-eats"] = () => {
  // Panci tanah bak kut teh dan teko teh.
  const m = mangkuk({ cx: 248, y: 222, rx: 164, ry: 40, tinggi: 138, kaki: 210, tKaki: 0 });
  const pegangan = rect(50, 250, 44, 20, 10) + rect(402, 250, 44, 20, 10);
  const potBadan = m.badan;
  const iga = [
    [172, 212, -34],
    [248, 198, 8],
    [318, 214, 30],
  ];
  const tIga = (...s) => iga.map(([x, y, a]) => letak(x, y, a, 1, ...s)).join("");
  const daging = tIga(rect(-27, -30, 54, 66, 15));
  const tulang = tIga(rect(-12, -60, 24, 36, 9));
  const tepiTulang = tIga(rect(-12, -60, 24, 36, 9, 'fill="none" stroke="#000" stroke-width="3.2"'));
  const klip = m.klip;
  const igaUtuh = dalam(daging + tulang, klip);
  const bawang = [
    [130, 242],
    [212, 248],
    [288, 246],
    [366, 240],
  ]
    .map(([x, y]) => ell(x, y, 11, 7))
    .join("");
  const goji = [
    [172, 244],
    [250, 246],
    [328, 248],
    [108, 228],
    [390, 228],
  ]
    .map(([x, y]) => circ(x, y, 5))
    .join("");
  const naikP = uap([168, 248, 328], 34, 116);
  const garisPot = m.pita(276, 6);
  // Teko
  const tkx = 566;
  const tky = 318;
  const tBadan = ell(tkx, tky, 84, 72);
  const tTutup = ell(tkx, tky - 68, 42, 11);
  const tPentol = circ(tkx, tky - 86, 11);
  const tCerat = bidang(`M${tkx - 76},${tky - 12} C${tkx - 106},${tky - 24} ${tkx - 116},${tky - 58} ${tkx - 142},${tky - 64} L${tkx - 150},${tky - 46} C${tkx - 128},${tky - 30} ${tkx - 122},${tky + 18} ${tkx - 72},${tky + 26} Z`);
  const tGagang = garis(`M${tkx + 76},${tky - 34} C${tkx + 142},${tky - 50} ${tkx + 142},${tky + 40} ${tkx + 72},${tky + 28}`, 15);
  const teko = tBadan + tTutup + tPentol + tCerat;
  const cangkirD = (x) => bidang(`M${x - 30},372 L${x + 30},372 L${x + 22},414 C${x + 21},421 ${x - 21},421 ${x - 22},414 Z`);
  const cangkirM = (x) => ell(x, 372, 30, 8);
  const cangkirIsi = (x) => ell(x, 373, 23, 5);
  const cangkir1 = cangkirD(446) + cangkirD(684);
  const cangkir1M = cangkirM(446) + cangkirM(684);
  const tehCangkir = cangkirIsi(446) + cangkirIsi(684);
  const lubangSemua = [potBadan, m.mulut, pegangan, igaUtuh, teko, tGagang, cangkir1, cangkir1M, uap([168, 248, 328], 34, 116, 20)];
  return lapis({
    latar: ell(350, 226, 300, 186, pola("dot2x")),
    siluet: lubangSemua,
    kuning: kurang(potBadan + pegangan, garisPot) + kurang(m.mulut, igaUtuh, bawang) + dalam(daging, klip) + tehCangkir,
    merah:
      kurang(potBadan + pegangan, garisPot) +
      kurang(m.dinding, igaUtuh) +
      dalam(daging, klip) +
      kurang(m.isi, igaUtuh, bawang) +
      kurang(goji, igaUtuh) +
      kurang(teko, dalam(rect(tkx - 90, tky - 2, 180, 7), tBadan)) +
      kurang(tGagang, teko) +
      tehCangkir,
    biru:
      buram(0.5, kurang(potBadan + pegangan, garisPot)) +
      dalam(buram(0.55, daging), klip) +
      naikP +
      kurang(sebagai(tBadan, pola("hatch")), ell(tkx - 26, tky - 12, 92, 86)) +
      cangkir1 +
      kurang(cangkir1M, tehCangkir) +
      buram(0.45, tehCangkir),
    hitam:
      dalam(kurang(tepiTulang, daging), klip) +
      kurang(dalam(rect(40, 200, 420, 180, 0, pola("dotbig")), potBadan), ell(190, 280, 200, 110), garisPot),
    dasar: ell(350, 438, 270, 10, pola("hatchfine")),
  });
};

P["oleh-oleh-run"] = () => {
  const horizon = 276;
  const k1 = kotakPita(62, 322, 236, 104, 44, -34, "merah", { pakaiSimpul: false });
  const k2 = kotakPita(106, 214, 186, 100, 36, -28, "biru", { pakaiSimpul: false });
  const k3 = kotakPita(138, 118, 128, 88, 28, -22, "merah");
  const tumpuk = timpa(timpa(k3, k2), k1);
  const fr = feri(560, 248, 0.46);
  const dermaga = rect(-10, 426, 400, 60);
  const lubang = [...tumpuk.siluet, ...fr.siluet, dermaga];
  return [
    ["yellow", kurang(circ(600, 112, 54), ...tumpuk.siluet) + tumpuk.kuning + fr.kuning + dermaga],
    ["red", tumpuk.merah + fr.merah + sebagai(dermaga, pola("hatch"))],
    ["blue", laut(720, horizon, ...lubang) + tumpuk.biru],
    ["black", tumpuk.hitam + fr.hitam + garis("M-10,426 L392,426", 4) + riak([430, 360, 60], [520, 386, 86], [640, 350, 46], [470, 430, 70])],
  ];
};

P["dekat-feri"] = () => {
  const fr = feri(474, 196, 1.28);
  const piring = ell(214, 438, 262, 92);
  const dalamP = ell(214, 434, 226, 70);
  const lk = ikan(214, 398, -6, 1.92);
  const panggang = letak(214, 398, -6, 1.92, garis("M-24,-20 L-34,20", 3), garis("M-4,-22 L-14,22", 3), garis("M16,-20 L6,20", 3), circ(-44, -3, 4.4));
  // Irisan jeruk: cincin dan juring, garis pemisahnya kertas putih.
  const jeruk = ell(70, 412, 34, 25);
  const juring = kurang(ell(70, 412, 28, 20), garis("M42,412 L98,412", 3.2), garis("M52,398 L88,426", 3.2), garis("M52,426 L88,398", 3.2));
  const cincinJeruk = kurang(jeruk, ell(70, 412, 30, 21.5));
  const sumpit = garis("M340,300 L492,460", 9) + garis("M372,292 L524,450", 9);
  const lubang = [piring, ...fr.siluet, garis("M340,300 L492,460", 18), garis("M372,292 L524,450", 18)];
  return [
    ["yellow", circ(120, 92, 56) + fr.kuning + kurang(lk, sumpit) + cincinJeruk + juring],
    ["red", fr.merah + kurang(piring, dalamP) + kurang(lk, sumpit)],
    ["blue", laut(720, 196, ...lubang) + buram(0.3, lk)],
    ["black", fr.hitam + sumpit + kurang(panggang, sumpit) + riak([560, 400, 70], [620, 430, 80])],
  ];
};

// ---------------------------------------------------------------- jalankan
const DAFTAR = [
  ...Object.keys(O).map((id) => ({ id, grup: "hidangan", W: 480, H: 480, buat: () => lapis(O[id]()) })),
  // Panduan berbidang luas: butiran sedikit lebih halus agar kualitas tetap dekat 88 di bawah batas ukuran.
  ...Object.keys(P).map((id) => ({ id, grup: "panduan", W: 720, H: 480, buat: P[id], grain: 0.11 })),
];

/** Lembar kontak: kisi semua gambar dengan nama id, dan kisi ukuran 72 px untuk menguji keterbacaan. */
async function kontak(folder) {
  fs.mkdirSync(folder, { recursive: true });
  const label = (t, w, h, ukuran) =>
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#fff"/>` +
        `<text x="${w / 2}" y="${h - 5}" font-family="Arial, Helvetica, sans-serif" font-size="${ukuran}" text-anchor="middle" fill="#222226">${t}</text></svg>`,
    );
  const berkas = (g) => path.join(AKAR, KELUARAN[g.grup], `${g.id}.webp`);
  const lembar = async (nama, skemaH, skemaP, q) => {
    const tumpuk = [];
    let y = 0;
    let lebarTotal = 0;
    for (const [daftar, kolom, selW, selH, ukuran] of [
      [DAFTAR.filter((g) => g.grup === "hidangan"), ...skemaH],
      [DAFTAR.filter((g) => g.grup === "panduan"), ...skemaP],
    ]) {
      const labelH = Math.round(ukuran * 1.6);
      lebarTotal = Math.max(lebarTotal, kolom * selW);
      for (let i = 0; i < daftar.length; i++) {
        const x = (i % kolom) * selW;
        const yy = y + Math.floor(i / kolom) * (selH + labelH);
        const gambar = await sharp(berkas(daftar[i])).resize(selW, selH, { fit: "contain", background: "#fff" }).png().toBuffer();
        tumpuk.push({ input: gambar, left: x, top: yy });
        tumpuk.push({ input: label(daftar[i].id, selW, labelH, ukuran), left: x, top: yy + selH });
      }
      y += Math.ceil(daftar.length / kolom) * (selH + labelH);
    }
    const tujuan = path.join(folder, nama);
    await sharp({ create: { width: lebarTotal, height: y, channels: 3, background: "#fff" } })
      .composite(tumpuk)
      .webp({ quality: q, effort: 4 })
      .toFile(tujuan);
    console.log(tujuan);
  };
  await lembar("ilustrasi-kontak.webp", [6, 300, 300, 15], [3, 600, 400, 15], 86);
  await lembar("ilustrasi-kontak-72.webp", [9, 96, 72, 9], [6, 144, 72, 9], 90);
}

const argumen = process.argv.slice(2);
if (argumen[0] === "--kontak") {
  await kontak(path.resolve(argumen[1] ?? "."));
} else {
  const pilihan = argumen.length ? DAFTAR.filter((g) => argumen.includes(g.id)) : DAFTAR;
  for (const g of pilihan) {
    await riso(`${KELUARAN[g.grup]}/${g.id}.webp`, g.W, g.H, g.buat(), { grain: g.grain ?? 0.15 });
  }
}
