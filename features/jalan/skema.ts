// Tata letak diagram skematik Trans Batam (brief 10 bagian 2). Fungsi murni: dari urutan halte di data menjadi
// koordinat garis. Grid x,y di bawah bukan lokasi di bumi, hanya posisi diagram (laporan 10: schematic.json).
//
// Yang berasal dari data: urutan simpul tiap koridor (dites terhadap `pola`), garis putus di gap, jumlah tick,
// halte transfer, warna. Yang ditata tangan: posisi simpul dan titik belok.

import type { ItemPola, JumlahHalte } from "./trans-data";

export type ArahLabel = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";
type Grid = [number, number];

export type DefSimpul = {
  x: number;
  y: number;
  pos: ArahLabel;
  /** Nama pendek, "|" untuk pindah baris. Kalau kosong, memakai nama kelompok dari data. */
  label?: string;
  labelHp?: string;
  posHp?: ArahLabel;
  /** Tampil di diagram HP. Hub dan ujung saja, supaya tetap terbaca. */
  hp?: boolean;
  ikon?: "pelabuhan" | "bandara";
  utama?: boolean;
};

export const SIMPUL: Record<string, DefSimpul> = {
  "tp-sekupang": { x: 3, y: 9, pos: "w", label: "TP Sekupang", hp: true, ikon: "pelabuhan", utama: true },
  kartini: { x: 6, y: 9, pos: "n" },
  uib: { x: 10, y: 9, pos: "s", hp: true },
  "nagoya-hill": { x: 10, y: 6, pos: "w" },
  "tp-jodoh": { x: 11, y: 3, pos: "n", label: "TP Terminal Jodoh", labelHp: "TP Jodoh", hp: true, utama: true },
  "pasar-angkasa": { x: 14, y: 3, pos: "n" },
  raflesia: { x: 15, y: 9, pos: "s", hp: true },
  "bundaran-madani": { x: 18, y: 9, pos: "n" },
  "ikan-daun": { x: 20, y: 9, pos: "n", label: "Ikan|Daun", labelHp: "Ikan Daun", hp: true },
  "mega-mall": { x: 22, y: 9, pos: "n", label: "Mega|Mall" },
  "tp-batam-center": { x: 27, y: 9, pos: "se", label: "TP Batam Center", hp: true, ikon: "pelabuhan", utama: true },
  "masjid-agung": { x: 20, y: 11, pos: "w" },
  politeknik: { x: 20, y: 12, pos: "e" },
  "kepri-mall": { x: 20, y: 13, pos: "e" },
  "stadion-temenggung": { x: 20, y: 14, pos: "e" },
  panbil: { x: 20, y: 15, pos: "e", label: "Panbil", hp: true },
  "simpang-tembesi": { x: 15, y: 15, pos: "n" },
  basecamp: { x: 8, y: 15, pos: "se", label: "Base Camp" },
  hidayatullah: { x: 6, y: 17, pos: "e", label: "Hidayatullah", hp: true },
  "pelabuhan-sagulung": { x: 4, y: 19, pos: "e", hp: true, ikon: "pelabuhan", utama: true },
  "tanjung-riau": { x: 6, y: 12, pos: "w" },
  "tanjung-piayu-laut": { x: 29, y: 18, pos: "e", hp: true, utama: true },
  uniba: { x: 30, y: 9, pos: "n" },
  "bandara-hang-nadim": { x: 33, y: 9, pos: "s", label: "Bandara Hang Nadim", hp: true, ikon: "bandara", utama: true },
  "kampung-mangga": { x: 33, y: 5, pos: "w" },
  "polda-kepri": { x: 33, y: 3, pos: "w" },
  "pelabuhan-nongsa": { x: 31, y: 1, pos: "sw", posHp: "e", ikon: "pelabuhan", hp: true },
  "teluk-mata-ikan": { x: 27, y: 1, pos: "w", hp: true, utama: true },
  "kampung-sambau": { x: 35, y: 1, pos: "se" },
  "kabil-raya": { x: 36, y: 12, pos: "e", hp: true },
  "tp-punggur": { x: 36, y: 14, pos: "w", label: "TP Punggur", hp: true, ikon: "pelabuhan", utama: true },
};

/** Satu jalur per koridor (brief 10). Urutan simpul harus cocok dengan pola; dites di tests/unit/skema.test.ts. */
export const RANTAI: Record<string, string[]> = {
  K1: ["tp-sekupang", "kartini", "uib", "raflesia", "bundaran-madani", "ikan-daun", "mega-mall", "tp-batam-center"],
  K2: [
    "tp-batam-center",
    "ikan-daun",
    "masjid-agung",
    "politeknik",
    "kepri-mall",
    "stadion-temenggung",
    "panbil",
    "simpang-tembesi",
    "basecamp",
    "hidayatullah",
  ],
  K3: ["tp-sekupang", "kartini", "uib", "nagoya-hill", "tp-jodoh"],
  K4: ["pelabuhan-sagulung", "hidayatullah", "basecamp", "tanjung-riau", "tp-sekupang"],
  K5: ["tp-jodoh", "pasar-angkasa", "raflesia", "bundaran-madani", "ikan-daun", "mega-mall", "tp-batam-center"],
  K6: [
    "tanjung-piayu-laut",
    "panbil",
    "stadion-temenggung",
    "kepri-mall",
    "politeknik",
    "masjid-agung",
    "tp-batam-center",
  ],
  K7: [
    "teluk-mata-ikan",
    "pelabuhan-nongsa",
    "polda-kepri",
    "kampung-mangga",
    "bandara-hang-nadim",
    "uniba",
    "tp-batam-center",
  ],
  K8: ["tp-punggur", "kabil-raya", "pasar-angkasa", "tp-jodoh"],
  K9: ["tp-punggur", "kabil-raya", "kampung-mangga", "polda-kepri", "kampung-sambau"],
};

/** Titik belok antarsimpul. Tanpa entri: garis lurus, jadi pasangan itu harus sudah 0, 45, atau 90 derajat. */
const BELOK: Record<string, Grid[]> = {
  "uib>nagoya-hill": [],
  "nagoya-hill>tp-jodoh": [[10, 4]],
  "pasar-angkasa>raflesia": [[15, 4]],
  "masjid-agung>tp-batam-center": [[25, 11]],
  "tanjung-piayu-laut>panbil": [
    [22, 18],
    [20, 16],
  ],
  "basecamp>tanjung-riau": [[8, 14]],
  "kabil-raya>pasar-angkasa": [
    [24, 12],
    [24, 5],
    [22, 3],
  ],
  "kabil-raya>kampung-mangga": [[36, 8]],
};

// Urutan paralel tetap sepanjang ruas. K2 paling luar di ruas Ikan Daun sampai TP Batam Center, karena tidak
// berhenti di Mega Mall.
const URUTAN = ["K1", "K5", "K2", "K3", "K4", "K6", "K7", "K9", "K8"];

/** Ujung koridor yang berakhir dengan gap di sumber: K9 tidak mencantumkan halte ujung di Nongsa. */
const STUB: Record<string, { ke: Grid; label: string }> = {
  K9: { ke: [37, 1], label: "ke Nongsa" },
};

const POSISI_LENCANA: Record<string, Grid> = {
  K1: [12, 9],
  K2: [12, 15],
  K3: [10, 8],
  K4: [7, 13],
  K5: [15, 6],
  K6: [25, 18],
  K7: [28, 9],
  K8: [30, 12],
  K9: [36, 10],
};

const LABEL_GAP: Record<string, { di: Grid; pos: ArahLabel; diHp?: Grid; posHp?: ArahLabel }> = {
  K3: { di: [10, 5], pos: "w", diHp: [10, 4], posHp: "n" },
  K8: { di: [29, 12], pos: "s", diHp: [25, 12], posHp: "e" },
  K9: { di: [37, 3], pos: "s", diHp: [37, 3], posHp: "s" },
};

// Feri: garis tipis, tidak menunjukkan lintasan. Di HP hanya ujungnya yang diberi nama pendek.
const FERI: { dari: string; lewat: Grid[]; label: string; pos: ArahLabel; labelHp: string; posHp: ArahLabel }[] = [
  { dari: "tp-sekupang", lewat: [[1, 7]], label: "ke Singapura", pos: "n", labelHp: "ke Singapura", posHp: "w" },
  {
    dari: "tp-batam-center",
    lewat: [[29, 7]],
    label: "ke Singapura, Johor",
    pos: "ne",
    labelHp: "ke Singapura, Johor",
    posHp: "w",
  },
  { dari: "pelabuhan-nongsa", lewat: [[30, 0]], label: "ke Tanah Merah", pos: "w", labelHp: "", posHp: "e" },
  {
    dari: "tp-punggur",
    lewat: [[36, 17]],
    label: "ke Tanjungpinang, Tanjung Uban",
    pos: "w",
    labelHp: "ke Tanjungpinang",
    posHp: "s",
  },
];

const RENCANA = { mulai: [15, 16] as Grid, ujung: [15, 19] as Grid };

export type Titik = [number, number];
export type SegmenGaris = { titik: Titik[]; putus: boolean };
export type GarisKoridor = {
  id: string;
  segmen: SegmenGaris[];
  tick: [Titik, Titik][];
  lencana: Titik;
  labelGap: { teks: string[]; x: number; y: number; anchor: "start" | "middle" | "end" } | null;
  stub: Titik[] | null;
  labelStub: { teks: string; x: number; y: number; anchor: "start" | "middle" | "end" } | null;
};
export type SimpulDiagram = {
  id: string;
  transfer: boolean;
  utama: boolean;
  ikon?: "pelabuhan" | "bandara";
  koridor: string[];
  kapsul: [Titik, Titik];
  label: { baris: string[]; x: number; y: number; anchor: "start" | "middle" | "end" } | null;
  ikonDi: Titik | null;
};
export type GarisFeri = {
  titik: Titik[];
  label: { teks: string; x: number; y: number; anchor: "start" | "middle" | "end" };
};
export type Diagram = {
  orientasi: "lebar" | "hp";
  lebar: number;
  tinggi: number;
  fontUtama: number;
  fontBiasa: number;
  lebarGaris: number;
  jarakParalel: number;
  garis: GarisKoridor[];
  simpul: SimpulDiagram[];
  feri: GarisFeri[];
  rencana: { titik: Titik[]; labelMulai: LabelBebas; labelUjung: LabelBebas };
};
type LabelBebas = { teks: string; x: number; y: number; anchor: "start" | "middle" | "end" };

export type SumberSkema = {
  koridor: { id: string; jumlah_halte_sumber?: JumlahHalte; status: string }[];
  pola: { id: string; koridor: string; halte: ItemPola[]; jumlah_halte_sumber: JumlahHalte | null }[];
  kelompokDari: (halteId: string) => string;
  namaDari: (kelompok: string) => string;
  labelGapDari: (koridor: string) => string | null;
};

// ---------- Pencocokan dengan pola ----------

/**
 * Antara dua simpul berurutan: pola pertama yang memuat keduanya menentukan jumlah tick dan ada tidaknya gap.
 * Null berarti tidak ada pola yang memuat pasangan ini, dan garisnya digambar putus.
 */
export function pasanganDiPola(
  pola: SumberSkema["pola"],
  kelompokDari: SumberSkema["kelompokDari"],
  koridor: string,
  a: string,
  b: string,
): { antara: number; adaGap: boolean; polaId: string } | null {
  for (const p of pola) {
    if (p.koridor !== koridor) continue;
    const urut = p.halte.map((h) => (h.jenis === "gap" ? "<gap>" : kelompokDari(h.halte_id)));
    const ia = urut.indexOf(a);
    const ib = urut.indexOf(b);
    if (ia === -1 || ib === -1) continue;
    const potong = urut.slice(Math.min(ia, ib) + 1, Math.max(ia, ib));
    return {
      antara: potong.filter((x) => x !== "<gap>").length,
      adaGap: potong.includes("<gap>"),
      polaId: p.id,
    };
  }
  return null;
}

// ---------- Geometri ----------

type Langkah = { dari: Grid; ke: Grid; pasangan: number };

function langkahLurus(a: Grid, b: Grid, pasangan: number): Langkah[] {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const n = Math.max(Math.abs(dx), Math.abs(dy));
  if (n === 0) return [];
  if (!(dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy))) {
    throw new Error(`Bukan oktilinier: ${a} ke ${b}`);
  }
  const sx = Math.sign(dx);
  const sy = Math.sign(dy);
  return Array.from({ length: n }, (_, i) => ({
    dari: [a[0] + sx * i, a[1] + sy * i] as Grid,
    ke: [a[0] + sx * (i + 1), a[1] + sy * (i + 1)] as Grid,
    pasangan,
  }));
}

const kunciLangkah = (l: Langkah) => {
  const a = `${l.dari[0]},${l.dari[1]}`;
  const b = `${l.ke[0]},${l.ke[1]}`;
  return a < b ? `${a}|${b}` : `${b}|${a}`;
};

/** Arah normal supaya dua koridor yang berlawanan arah tetap di sisi yang sama. */
function arahNormal(dx: number, dy: number): [number, number] {
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  return dx > 0 || (dx === 0 && dy > 0) ? [ux, uy] : [-ux, -uy];
}

function perpotongan(p: Titik, d1: Titik, q: Titik, d2: Titik): Titik | null {
  const det = d1[0] * d2[1] - d1[1] * d2[0];
  if (Math.abs(det) < 1e-6) return null;
  const t = ((q[0] - p[0]) * d2[1] - (q[1] - p[1]) * d2[0]) / det;
  return [p[0] + d1[0] * t, p[1] + d1[1] * t];
}

function bagiLabel(nama: string): string[] {
  if (nama.length <= 13 || !nama.includes(" ")) return [nama];
  const kata = nama.split(" ");
  let terbaik: string[] = [nama];
  let selisih = Infinity;
  for (let i = 1; i < kata.length; i++) {
    const a = kata.slice(0, i).join(" ");
    const b = kata.slice(i).join(" ");
    const s = Math.abs(a.length - b.length);
    if (s < selisih) {
      selisih = s;
      terbaik = [a, b];
    }
  }
  return terbaik;
}

const TUKAR_ARAH: Record<ArahLabel, ArahLabel> = {
  n: "w",
  w: "n",
  s: "e",
  e: "s",
  ne: "sw",
  sw: "ne",
  nw: "nw",
  se: "se",
};

const JAM = (n: number) => Math.round(n * 100) / 100;

type Opsi = { orientasi: "lebar" | "hp" };

export function susunDiagram(sumber: SumberSkema, { orientasi }: Opsi): Diagram {
  const hp = orientasi === "hp";
  const U = hp ? 21 : 28;
  const jarak = hp ? 5 : 6.5;
  const pinggirX = hp ? 34 : 86;
  const pinggirY = hp ? 34 : 42;
  const fontUtama = hp ? 15 : 13;
  const fontBiasa = hp ? 14 : 12;

  const putar = ([x, y]: Grid): Grid => (hp ? [y, x] : [x, y]);
  const keLayar = ([x, y]: Grid): Titik => [pinggirX + x * U, pinggirY + y * U];

  // Langkah satuan per koridor, untuk menemukan ruas berimpit.
  const langkahKoridor = new Map<string, Langkah[]>();
  const pemakaiLangkah = new Map<string, string[]>();
  for (const [k, rantai] of Object.entries(RANTAI)) {
    const semua: Langkah[] = [];
    for (let i = 0; i < rantai.length - 1; i++) {
      const a = SIMPUL[rantai[i]];
      const b = SIMPUL[rantai[i + 1]];
      const lewat =
        BELOK[`${rantai[i]}>${rantai[i + 1]}`] ?? [...(BELOK[`${rantai[i + 1]}>${rantai[i]}`] ?? [])].reverse();
      const titik: Grid[] = [[a.x, a.y], ...lewat, [b.x, b.y]].map((t) => putar(t as Grid));
      for (let j = 0; j < titik.length - 1; j++) semua.push(...langkahLurus(titik[j], titik[j + 1], i));
    }
    langkahKoridor.set(k, semua);
    for (const l of semua) {
      const kunci = kunciLangkah(l);
      pemakaiLangkah.set(kunci, [...(pemakaiLangkah.get(kunci) ?? []), k]);
    }
  }

  const offset = (l: Langkah, k: string) => {
    const pemakai = pemakaiLangkah.get(kunciLangkah(l)) ?? [k];
    const urut = [...pemakai].sort((a, b) => URUTAN.indexOf(a) - URUTAN.indexOf(b));
    return (urut.indexOf(k) - (urut.length - 1) / 2) * jarak;
  };

  const titikSimpul = new Map<string, Map<string, Titik>>();
  const catatSimpul = (id: string, k: string, t: Titik) => {
    const m = titikSimpul.get(id) ?? new Map<string, Titik>();
    if (!m.has(k)) m.set(k, t);
    titikSimpul.set(id, m);
  };

  const garis: GarisKoridor[] = [];
  const titikPadaLangkah = new Map<string, Map<string, Titik>>();

  for (const [k, rantai] of Object.entries(RANTAI)) {
    const langkah = langkahKoridor.get(k) as Langkah[];
    // Gabungkan langkah searah dengan offset dan pasangan yang sama menjadi satu potongan.
    type Potongan = { a: Grid; b: Grid; d: Titik; n: Titik; o: number; pasangan: number };
    const potongan: Potongan[] = [];
    for (const l of langkah) {
      const dx = l.ke[0] - l.dari[0];
      const dy = l.ke[1] - l.dari[1];
      const len = Math.hypot(dx, dy);
      const d: Titik = [dx / len, dy / len];
      const [nx, ny] = arahNormal(dx, dy);
      const n: Titik = [-ny, nx];
      const o = offset(l, k);
      const akhir = potongan[potongan.length - 1];
      if (akhir && akhir.pasangan === l.pasangan && akhir.o === o && akhir.d[0] === d[0] && akhir.d[1] === d[1]) {
        akhir.b = l.ke;
      } else {
        potongan.push({ a: l.dari, b: l.ke, d, n, o, pasangan: l.pasangan });
      }
    }

    // Sudut baru: garis tetap sejajar arah aslinya, jadi 0/45/90 terjaga walau digeser.
    const mulaiP: Titik[] = [];
    const akhirP: Titik[] = [];
    potongan.forEach((p, i) => {
      const [ax, ay] = keLayar(p.a);
      const [bx, by] = keLayar(p.b);
      mulaiP[i] = [ax + p.n[0] * p.o, ay + p.n[1] * p.o];
      akhirP[i] = [bx + p.n[0] * p.o, by + p.n[1] * p.o];
    });
    for (let i = 0; i < potongan.length - 1; i++) {
      const p = potongan[i];
      const q = potongan[i + 1];
      const silang = perpotongan(mulaiP[i], p.d, mulaiP[i + 1], q.d);
      if (silang) {
        akhirP[i] = silang;
        mulaiP[i + 1] = silang;
      }
    }

    // Titik tiap simpul di koridor ini: ujung potongan pasangan yang bersangkutan.
    const peta = new Map<string, Titik>();
    potongan.forEach((p, i) => {
      peta.set(`${p.a[0]},${p.a[1]}`, peta.get(`${p.a[0]},${p.a[1]}`) ?? mulaiP[i]);
      peta.set(`${p.b[0]},${p.b[1]}`, akhirP[i]);
    });
    titikPadaLangkah.set(k, peta);
    rantai.forEach((id, i) => {
      const def = SIMPUL[id];
      const [gx, gy] = putar([def.x, def.y]);
      const akhir = potongan.filter((p) => p.pasangan === i - 1).pop();
      const awal = potongan.find((p) => p.pasangan === i);
      if (awal) catatSimpul(id, k, mulaiP[potongan.indexOf(awal)]);
      else if (akhir) catatSimpul(id, k, akhirP[potongan.indexOf(akhir)]);
      else catatSimpul(id, k, keLayar([gx, gy]));
    });

    // Satu segmen per pasangan simpul, lalu yang bersebelahan dan sejenis digabung.
    const segmen: SegmenGaris[] = [];
    const tick: [Titik, Titik][] = [];
    for (let i = 0; i < rantai.length - 1; i++) {
      const milik = potongan.map((p, j) => ({ p, j })).filter((x) => x.p.pasangan === i);
      const titik: Titik[] = [];
      for (const { j } of milik) {
        if (!titik.length) titik.push(mulaiP[j]);
        else {
          const akhir = titik[titik.length - 1];
          if (akhir[0] !== mulaiP[j][0] || akhir[1] !== mulaiP[j][1]) titik.push(mulaiP[j]);
        }
        titik.push(akhirP[j]);
      }
      // Sambungan ke pasangan sebelumnya kalau offset berubah di simpul.
      const prev = potongan.filter((p) => p.pasangan === i - 1).length
        ? akhirP[
            potongan
              .map((p, j) => ({ p, j }))
              .filter((x) => x.p.pasangan === i - 1)
              .pop()!.j
          ]
        : null;
      if (prev && (prev[0] !== titik[0][0] || prev[1] !== titik[0][1])) titik.unshift(prev);

      const info = pasanganDiPola(sumber.pola, sumber.kelompokDari, k, rantai[i], rantai[i + 1]);
      const putus = !info || info.adaGap;
      const seb = segmen[segmen.length - 1];
      if (seb && seb.putus === putus) seb.titik.push(...titik.slice(1));
      else segmen.push({ titik: titik.map(([x, y]) => [JAM(x), JAM(y)] as Titik), putus });
      if (seb && seb.putus === putus) seb.titik = seb.titik.map(([x, y]) => [JAM(x), JAM(y)] as Titik);

      // Tick seragam, hanya pada ruas yang urutannya utuh.
      if (info && !putus && info.antara > 0) {
        const panjang = titik.slice(1).map((t, n) => Math.hypot(t[0] - titik[n][0], t[1] - titik[n][1]));
        const total = panjang.reduce((a, b) => a + b, 0);
        for (let n = 1; n <= info.antara; n++) {
          let sisa = (total * n) / (info.antara + 1);
          let s = 0;
          while (s < panjang.length - 1 && sisa > panjang[s]) sisa -= panjang[s++];
          const [ax, ay] = titik[s];
          const [bx, by] = titik[s + 1];
          const ux = (bx - ax) / panjang[s];
          const uy = (by - ay) / panjang[s];
          const [nx, ny] = arahNormal(bx - ax, by - ay);
          const off = milik[Math.min(s, milik.length - 1)].p.o;
          const sisi = off < 0 ? -1 : 1;
          const px = ax + ux * sisa;
          const py = ay + uy * sisa;
          const panjangTick = hp ? 4 : 5;
          tick.push([
            [JAM(px), JAM(py)],
            [JAM(px + -ny * sisi * panjangTick), JAM(py + nx * sisi * panjangTick)],
          ]);
        }
      }
    }

    // Lencana id koridor di tengah ruasnya sendiri.
    const pl = putar(POSISI_LENCANA[k]);
    const lencana = peta.get(`${pl[0]},${pl[1]}`) ?? keLayar(pl);
    const putusTunggal = sumber.labelGapDari(k);
    const posGap = LABEL_GAP[k];
    let labelGapKoridor: GarisKoridor["labelGap"] = null;
    if (putusTunggal && posGap) {
      const [gx, gy] = keLayar(putar(hp ? (posGap.diHp ?? posGap.di) : posGap.di));
      const a = hp ? (posGap.posHp ?? TUKAR_ARAH[posGap.pos]) : posGap.pos;
      const teks = bagiLabel(putusTunggal);
      labelGapKoridor = {
        teks,
        x: gx + (a.includes("e") ? 10 : a.includes("w") ? -10 : 0),
        y: gy + (a.includes("s") ? 18 : a.includes("n") ? -8 - (teks.length - 1) * 13 : 0),
        anchor: a.includes("e") ? "start" : a.includes("w") ? "end" : "middle",
      };
    }

    // Ujung koridor yang tidak tercantum: garis putus pendek, tidak disambung ke apa pun.
    let stub: Titik[] | null = null;
    let labelStub: GarisKoridor["labelStub"] = null;
    const defStub = STUB[k];
    if (defStub) {
      const ujung = rantai[rantai.length - 1];
      const dari = titikSimpul.get(ujung)?.get(k);
      const ke = keLayar(putar(defStub.ke));
      if (dari) {
        stub = [dari, ke];
        labelStub = {
          teks: defStub.label,
          x: ke[0] + (hp ? -6 : 8),
          y: ke[1] + (hp ? 16 : 4),
          anchor: hp ? "end" : "start",
        };
      }
    }

    garis.push({
      id: k,
      segmen,
      tick,
      lencana: [JAM(lencana[0]), JAM(lencana[1])],
      labelGap: labelGapKoridor,
      stub,
      labelStub,
    });
  }

  // Simpul.
  const simpul: SimpulDiagram[] = Object.entries(SIMPUL).map(([id, def]) => {
    const peta = titikSimpul.get(id) ?? new Map<string, Titik>();
    const titik = [...peta.values()];
    const [gx, gy] = keLayar(putar([def.x, def.y]));
    let kapsul: [Titik, Titik] = [
      [gx, gy],
      [gx, gy],
    ];
    let jauh = -1;
    for (const a of titik) {
      for (const b of titik) {
        const j = Math.hypot(a[0] - b[0], a[1] - b[1]);
        if (j > jauh) {
          jauh = j;
          kapsul = [a, b];
        }
      }
    }
    if (titik.length) kapsul = [kapsul[0], kapsul[1]];
    const xs = kapsul.map((t) => t[0]);
    const ys = kapsul.map((t) => t[1]);
    const pos = hp ? (def.posHp ?? TUKAR_ARAH[def.pos]) : def.pos;
    const namaLabel = (hp ? def.labelHp : undefined) ?? def.label ?? sumber.namaDari(id);
    const baris = namaLabel.includes("|") ? namaLabel.split("|") : bagiLabel(namaLabel);
    const tampil = !hp || def.hp;
    const lh = hp ? 16 : 14;
    const celah = hp ? 11 : 10;
    const minX = Math.min(...xs) - 3;
    const maxX = Math.max(...xs) + 3;
    const minY = Math.min(...ys) - 3;
    const maxY = Math.max(...ys) + 3;
    const fs = def.utama ? fontUtama : fontBiasa;
    const anchor: "start" | "middle" | "end" = pos.includes("e") ? "start" : pos.includes("w") ? "end" : "middle";
    const x = pos.includes("e") ? maxX + celah : pos.includes("w") ? minX - celah : (minX + maxX) / 2;
    let y: number;
    if (pos.includes("n")) y = minY - celah - (baris.length - 1) * lh;
    else if (pos.includes("s")) y = maxY + celah + fs * 0.8;
    else y = (minY + maxY) / 2 + fs * 0.35 - ((baris.length - 1) * lh) / 2;
    const lebarTeks = Math.max(...baris.map((b) => b.length)) * fs * 0.54;
    const ikonX =
      anchor === "start" ? x + lebarTeks + 11 : anchor === "end" ? x - lebarTeks - 11 : x + lebarTeks / 2 + 11;
    return {
      id,
      transfer: peta.size >= 2,
      utama: !!def.utama,
      ikon: def.ikon,
      koridor: [...peta.keys()],
      kapsul: [
        [JAM(kapsul[0][0]), JAM(kapsul[0][1])],
        [JAM(kapsul[1][0]), JAM(kapsul[1][1])],
      ],
      label: tampil ? { baris, x: JAM(x), y: JAM(y), anchor } : null,
      ikonDi: tampil && def.ikon ? [JAM(ikonX), JAM(y - fs * 0.35)] : null,
    };
  });

  const feri: GarisFeri[] = FERI.map((f) => {
    const asal = SIMPUL[f.dari];
    const titik = [keLayar(putar([asal.x, asal.y])), ...f.lewat.map((g) => keLayar(putar(g)))];
    const [x, y] = titik[titik.length - 1];
    const a = hp ? f.posHp : f.pos;
    return {
      titik: titik.map(([p, q]) => [JAM(p), JAM(q)] as Titik),
      label: {
        teks: hp ? f.labelHp : f.label,
        x: x + (a.includes("e") ? 6 : a.includes("w") ? -6 : 0),
        y: y + (a.includes("s") ? 15 : a.includes("n") ? -6 : 4),
        anchor: a.includes("e") ? "start" : a.includes("w") ? "end" : "middle",
      },
    };
  });

  const rm = keLayar(putar(RENCANA.mulai));
  const ru = keLayar(putar(RENCANA.ujung));
  const rencana = {
    titik: [rm, ru] as Titik[],
    labelMulai: hp
      ? { teks: "", x: rm[0], y: rm[1], anchor: "end" as const }
      : { teks: "Tembesi", x: rm[0] + 7, y: rm[1] + 11, anchor: "start" as const },
    labelUjung: hp
      ? { teks: "K10 rencana", x: ru[0] + 4, y: ru[1] - 7, anchor: "end" as const }
      : { teks: "K10 rencana: Barelang/Galang", x: ru[0] + 7, y: ru[1] + 4, anchor: "start" as const },
  };

  const lebarGrid = hp ? 20 : 39;
  const tinggiGrid = hp ? 38 : 20;
  return {
    orientasi,
    lebar: pinggirX * 2 + lebarGrid * U - (hp ? 0 : 60),
    tinggi: pinggirY * 2 + tinggiGrid * U - (hp ? 0 : 20),
    fontUtama,
    fontBiasa,
    lebarGaris: hp ? 3.5 : 4.5,
    jarakParalel: jarak,
    garis,
    simpul,
    feri,
    rencana,
  };
}

export const keJalur = (t: Titik[]) => `M${t.map(([x, y]) => `${x} ${y}`).join("L")}`;
