// Tata letak Peta Bus Trans Batam: dari simpul, ruas, dan rantai koridor (jaringan.ts) menjadi geometri SVG.
// Fungsi murni, tanpa React, supaya bisa dites dan dipratinjau di luar Next.
//
// Model: halte duduk di ruas (jalan di antara dua simpul). Semua koridor yang melewati ruas berhenti di semua
// halte ruas itu, seperti peta transit pada umumnya. Simpul adalah ujung, persimpangan, atau halte transit.

export type Titik = [number, number];
export type Arah = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export type DefSimpul = {
  x: number;
  y: number;
  /** Id halte bila simpul ini halte. Kosong: persimpangan tanpa halte. */
  halte?: string;
  /** Posisi label. Kosong: tanpa label. */
  pos?: Arah;
  /** Teks label, "|" untuk pindah baris. Kosong: nama halte. */
  teks?: string;
  ikon?: "pelabuhan" | "bandara";
  utama?: boolean;
  /** Jarak tambahan label dari simpul. */
  jarak?: number;
};

export type DefRuas = {
  dari: string;
  ke: string;
  /** Titik belok, berurutan dari `dari` ke `ke`. Tiap potongan harus 0, 45, atau 90 derajat. */
  lewat?: Titik[];
  halte: string[];
  /**
   * Sisi label: satu arah untuk semua halte, atau per halte. "seling-ns"/"seling-ew" bergantian.
   * "kiri"/"kanan" menurut arah tempuh dari `dari` ke `ke`, cocok untuk ruas yang berbelok.
   */
  label: SisiLabel | "seling-ns" | "seling-ew" | SisiLabel[];
  /** Urutan koridor dari kiri ke kanan arah tempuh. Kosong: urutan umum. */
  urutan?: string[];
  /** Bagian ruas tempat halte disebar, pecahan panjang dari `dari`. Bawaan [0, 1]. */
  rentang?: [number, number];
  /** Jumlah halte di tiap potongan lurus (urut dari `dari`). Kosong: disebar rata sepanjang ruas. */
  perPotongan?: number[];
};
export type SisiLabel = Arah | "kiri" | "kanan";

export type DefFeri = { dari: string; ke: Titik; teks: string; pos: Arah };

export type Jaringan = {
  simpul: Record<string, DefSimpul>;
  ruas: DefRuas[];
  jalur: Record<string, string[][]>;
  urutan: string[];
  nama: (halte: string) => string;
  /** Koordinat simpul ditulis dalam satuan sumber; kanvas = (x + gx) * skala. */
  kanvas?: { skala: number; gx: number; gy: number };
  feri?: DefFeri[];
  /** Garis koridor rencana, putus-putus. */
  rencana?: { id: string; titik: Titik[]; teks: string; pos: Arah }[];
};

export type GarisKoridor = { id: string; d: string[] };
export type TandaHalte = {
  id: string;
  ruas: number;
  /** Koridor yang berhenti. */
  koridor: string[];
  /** Garis tanda: tick (satu koridor) atau batang melintang (beberapa koridor). */
  a: Titik;
  b: Titik;
  jenis: "tick" | "batang";
};
export type Label = {
  id: string;
  baris: string[];
  x: number;
  y: number;
  anchor: "start" | "middle" | "end";
  ukuran: number;
  tebal: boolean;
  koridor: string[];
  /** Kotak perkiraan untuk uji tabrakan, termasuk deret nomor koridor. */
  kotak: [number, number, number, number];
  /** Letak deret nomor koridor pada label terminal. */
  deret?: "atas" | "bawah";
};
export type TandaSimpul = {
  id: string;
  halte: string | null;
  koridor: string[];
  a: Titik;
  b: Titik;
  utama: boolean;
  ikon?: "pelabuhan" | "bandara";
  ikonDi: Titik | null;
};
export type PetaBus = {
  garis: GarisKoridor[];
  halte: TandaHalte[];
  simpul: TandaSimpul[];
  label: Label[];
  feri: { d: string; label: Label }[];
  rencana: { id: string; d: string; label: Label }[];
  /** Kotak tiap koridor, untuk memperbesar ke satu koridor. */
  batas: Record<string, [number, number, number, number]>;
};

export const UKURAN = {
  jarak: 6, // jarak antargaris sejajar
  garis: 4.5,
  font: 12,
  fontUtama: 17,
  celah: 7,
  sudut: 26,
  tick: 8,
};

/** Salinan jaringan dengan koordinat kanvas. */
function keKanvas(j: Jaringan): Jaringan {
  const k = j.kanvas;
  if (!k) return j;
  const t = ([x, y]: Titik): Titik => [(x + k.gx) * k.skala, (y + k.gy) * k.skala];
  const simpul: Record<string, DefSimpul> = {};
  for (const [id, s] of Object.entries(j.simpul)) {
    const [x, y] = t([s.x, s.y]);
    simpul[id] = { ...s, x, y };
  }
  return {
    ...j,
    kanvas: undefined,
    simpul,
    ruas: j.ruas.map((r) => ({ ...r, lewat: r.lewat?.map(t) })),
    feri: j.feri?.map((f) => ({ ...f, ke: t(f.ke) })),
    rencana: j.rencana?.map((r) => ({ ...r, titik: r.titik.map(t) })),
  };
}

const JAM = (n: number) => Math.round(n * 10) / 10;
const ARAH_VEKTOR: Record<Arah, Titik> = {
  n: [0, -1],
  s: [0, 1],
  e: [1, 0],
  w: [-1, 0],
  ne: [Math.SQRT1_2, -Math.SQRT1_2],
  nw: [-Math.SQRT1_2, -Math.SQRT1_2],
  se: [Math.SQRT1_2, Math.SQRT1_2],
  sw: [-Math.SQRT1_2, Math.SQRT1_2],
};

export function polilinRuas(j: Jaringan, r: DefRuas): Titik[] {
  const a = j.simpul[r.dari];
  const b = j.simpul[r.ke];
  if (!a || !b) throw new Error(`Simpul tidak ada: ${r.dari} atau ${r.ke}`);
  const titik: Titik[] = [[a.x, a.y], ...(r.lewat ?? []), [b.x, b.y]];
  for (let i = 0; i < titik.length - 1; i++) {
    const dx = titik[i + 1][0] - titik[i][0];
    const dy = titik[i + 1][1] - titik[i][1];
    if (!(dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) || (dx === 0 && dy === 0)) {
      throw new Error(`Bukan oktilinier: ruas ${r.dari}>${r.ke}, potongan ${i}: ${titik[i]} ke ${titik[i + 1]}`);
    }
  }
  return titik;
}

const LAWAN: Record<SisiLabel, SisiLabel> = {
  n: "s",
  s: "n",
  e: "w",
  w: "e",
  ne: "sw",
  sw: "ne",
  nw: "se",
  se: "nw",
  kiri: "kanan",
  kanan: "kiri",
};

const kunci = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);

/** Koridor per ruas, dari rantai. */
export function koridorPerRuas(j: Jaringan): Map<number, string[]> {
  const indeks = new Map<string, number>();
  j.ruas.forEach((r, i) => {
    const k = kunci(r.dari, r.ke);
    if (indeks.has(k)) throw new Error(`Ruas ganda: ${k}`);
    indeks.set(k, i);
  });
  const hasil = new Map<number, string[]>();
  for (const [kor, rantai] of Object.entries(j.jalur)) {
    for (const r of rantai) {
      for (let i = 0; i < r.length - 1; i++) {
        const idx = indeks.get(kunci(r[i], r[i + 1]));
        if (idx === undefined) throw new Error(`${kor}: tidak ada ruas ${r[i]}>${r[i + 1]}`);
        const daftar = hasil.get(idx) ?? [];
        if (!daftar.includes(kor)) daftar.push(kor);
        hasil.set(idx, daftar);
      }
    }
  }
  return hasil;
}

function panjang(p: Titik[]) {
  let s = 0;
  for (let i = 0; i < p.length - 1; i++) s += Math.hypot(p[i + 1][0] - p[i][0], p[i + 1][1] - p[i][1]);
  return s;
}

/** Titik dan arah pada jarak s sepanjang polilin. */
function padaJarak(p: Titik[], s: number): { t: Titik; d: Titik } {
  let sisa = s;
  for (let i = 0; i < p.length - 1; i++) {
    const l = Math.hypot(p[i + 1][0] - p[i][0], p[i + 1][1] - p[i][1]);
    if (sisa <= l || i === p.length - 2) {
      const d: Titik = [(p[i + 1][0] - p[i][0]) / l, (p[i + 1][1] - p[i][1]) / l];
      return { t: [p[i][0] + d[0] * sisa, p[i][1] + d[1] * sisa], d };
    }
    sisa -= l;
  }
  return { t: p[p.length - 1], d: [1, 0] };
}

/** Normal kiri arah tempuh (layar: y ke bawah). */
const kiri = (d: Titik): Titik => [d[1], -d[0]];

/** Jalur SVG dengan sudut dibulatkan. */
function keJalur(p: Titik[], r = UKURAN.sudut): string {
  if (p.length < 3) return `M${p.map(([x, y]) => `${JAM(x)} ${JAM(y)}`).join("L")}`;
  let d = `M${JAM(p[0][0])} ${JAM(p[0][1])}`;
  for (let i = 1; i < p.length - 1; i++) {
    const [ax, ay] = p[i - 1];
    const [bx, by] = p[i];
    const [cx, cy] = p[i + 1];
    const l1 = Math.hypot(bx - ax, by - ay);
    const l2 = Math.hypot(cx - bx, cy - by);
    const potong = Math.min(r, l1 / 2, l2 / 2);
    const m1: Titik = [bx - ((bx - ax) / l1) * potong, by - ((by - ay) / l1) * potong];
    const m2: Titik = [bx + ((cx - bx) / l2) * potong, by + ((cy - by) / l2) * potong];
    d += `L${JAM(m1[0])} ${JAM(m1[1])}Q${JAM(bx)} ${JAM(by)} ${JAM(m2[0])} ${JAM(m2[1])}`;
  }
  const z = p[p.length - 1];
  return `${d}L${JAM(z[0])} ${JAM(z[1])}`;
}

type Potongan = { a: Titik; b: Titik; d: Titik; o: number; L: number };

function arahSatuan(a: Titik, b: Titik): Titik {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
  return [(b[0] - a[0]) / l, (b[1] - a[1]) / l];
}

/**
 * Jalur satu koridor dari potongan garis tengah dan geserannya. Tikungan memakai busur dengan pusat yang sama
 * untuk semua garis sejajar: jari-jari R dikurangi geseran di sisi dalam, ditambah di sisi luar. Pergantian
 * geseran di simpul tanpa tikungan dibuat serong 45 derajat.
 */
function jalurSejajar(segs: Potongan[]): { jalur: string; titik: Titik[] } {
  const R = UKURAN.sudut;
  const off = segs.map((s) => {
    const n = kiri(s.d);
    return {
      ...s,
      a: [s.a[0] + n[0] * s.o, s.a[1] + n[1] * s.o] as Titik,
      b: [s.b[0] + n[0] * s.o, s.b[1] + n[1] * s.o] as Titik,
    };
  });
  const titik: { p: Titik; r: number }[] = [{ p: off[0].a, r: 0 }];
  for (let i = 0; i < off.length - 1; i++) {
    const s1 = off[i];
    const s2 = off[i + 1];
    const silang = s1.d[0] * s2.d[1] - s1.d[1] * s2.d[0];
    const dot = s1.d[0] * s2.d[0] + s1.d[1] * s2.d[1];
    if (Math.abs(silang) < 1e-9) {
      if (dot > 0 && Math.abs(s1.o - s2.o) < 0.01) continue;
      if (dot > 0) {
        const jog = Math.abs(s1.o - s2.o) / 2;
        titik.push(
          { p: [s1.b[0] - s1.d[0] * jog, s1.b[1] - s1.d[1] * jog], r: 6 },
          { p: [s2.a[0] + s2.d[0] * jog, s2.a[1] + s2.d[1] * jog], r: 6 },
        );
      } else {
        titik.push({ p: s1.b, r: 0 }, { p: s2.a, r: 0 });
      }
      continue;
    }
    const t = ((s2.a[0] - s1.a[0]) * s2.d[1] - (s2.a[1] - s1.a[1]) * s2.d[0]) / silang;
    const pojok: Titik = [s1.a[0] + s1.d[0] * t, s1.a[1] + s1.d[1] * t];
    const tanSetengah = Math.tan(Math.acos(Math.max(-1, Math.min(1, dot))) / 2);
    const rTengah = Math.min(R, Math.min(s1.L, s2.L) / 2 / tanSetengah);
    const belokKiri = silang < 0;
    const o = (s1.o + s2.o) / 2;
    titik.push({ p: pojok, r: Math.max(1.5, belokKiri ? rTengah - o : rTengah + o) });
  }
  titik.push({ p: off[off.length - 1].b, r: 0 });

  const f = (n: number) => Math.round(n * 10) / 10;
  let d = `M${f(titik[0].p[0])} ${f(titik[0].p[1])}`;
  for (let i = 1; i < titik.length - 1; i++) {
    const { p, r } = titik[i];
    const sebelum = titik[i - 1].p;
    const sesudah = titik[i + 1].p;
    const l1 = Math.hypot(p[0] - sebelum[0], p[1] - sebelum[1]);
    const l2 = Math.hypot(sesudah[0] - p[0], sesudah[1] - p[1]);
    if (r <= 0 || l1 < 1e-6 || l2 < 1e-6) {
      d += `L${f(p[0])} ${f(p[1])}`;
      continue;
    }
    const d1: Titik = [(p[0] - sebelum[0]) / l1, (p[1] - sebelum[1]) / l1];
    const d2: Titik = [(sesudah[0] - p[0]) / l2, (sesudah[1] - p[1]) / l2];
    const cos = Math.max(-1, Math.min(1, d1[0] * d2[0] + d1[1] * d2[1]));
    const tanSetengah = Math.tan(Math.acos(cos) / 2);
    if (tanSetengah < 1e-6) {
      d += `L${f(p[0])} ${f(p[1])}`;
      continue;
    }
    const potong = Math.min(r * tanSetengah, l1 / 2, l2 / 2);
    const rr = potong / tanSetengah;
    const m1: Titik = [p[0] - d1[0] * potong, p[1] - d1[1] * potong];
    const m2: Titik = [p[0] + d2[0] * potong, p[1] + d2[1] * potong];
    const sapu = d1[0] * d2[1] - d1[1] * d2[0] > 0 ? 1 : 0;
    d += `L${f(m1[0])} ${f(m1[1])}A${f(rr)} ${f(rr)} 0 0 ${sapu} ${f(m2[0])} ${f(m2[1])}`;
  }
  const z = titik[titik.length - 1].p;
  d += `L${f(z[0])} ${f(z[1])}`;
  return { jalur: d, titik: titik.map((x) => x.p) };
}

const lebarTeks = (s: string, ukuran: number) => s.length * ukuran * 0.56;

function bagi(nama: string, maks: number): string[] {
  if (nama.includes("|")) return nama.split("|");
  if (nama.length <= maks || !nama.includes(" ")) return [nama];
  const kata = nama.split(" ");
  const baris: string[] = [];
  let kini = "";
  for (const k of kata) {
    if (kini && (kini + " " + k).length > maks) {
      baris.push(kini);
      kini = k;
    } else kini = kini ? `${kini} ${k}` : k;
  }
  if (kini) baris.push(kini);
  return baris;
}

function buatLabel(
  id: string,
  teks: string,
  t: Titik,
  sisi: Titik,
  jarak: number,
  ukuran: number,
  tebal: boolean,
  koridor: string[],
  maksBaris: number,
): Label {
  const [sx, sy] = sisi;
  const datar = Math.abs(sx) < 0.2; // label di atas atau bawah garis
  const baris = bagi(teks, datar ? maksBaris : 28);
  const lh = ukuran * 1.13;
  const ax = t[0] + sx * jarak;
  const ay = t[1] + sy * jarak;
  const anchor: Label["anchor"] = sx > 0.2 ? "start" : sx < -0.2 ? "end" : "middle";
  const tinggi = (baris.length - 1) * lh;
  let y: number;
  if (sy < -0.2) y = ay - tinggi; // di atas: baris terakhir berakhir di titik tambat
  else if (sy > 0.2) y = ay + ukuran * 0.78;
  else y = ay + ukuran * 0.35 - tinggi / 2;
  const lebar = Math.max(...baris.map((b) => lebarTeks(b, ukuran)));
  const x0 = anchor === "start" ? ax : anchor === "end" ? ax - lebar : ax - lebar / 2;
  const y0 = y - ukuran * 0.8;
  return {
    id,
    baris,
    x: JAM(ax),
    y: JAM(y),
    anchor,
    ukuran,
    tebal,
    koridor,
    kotak: [JAM(x0), JAM(y0), JAM(x0 + lebar), JAM(y0 + tinggi + ukuran)],
  };
}

export function susunPeta(sumber: Jaringan): PetaBus {
  const j = keKanvas(sumber);
  const korRuas = koridorPerRuas(j);
  const sp = UKURAN.jarak;

  // Geser tiap koridor pada tiap ruas, searah ruas.
  const geserKor = new Map<string, number>(); // `${ruas}|${kor}` -> offset
  j.ruas.forEach((r, i) => {
    const kor = korRuas.get(i) ?? [];
    const urut = r.urutan
      ? [...r.urutan, ...kor.filter((k) => !r.urutan?.includes(k))]
      : [...kor].sort((a, b) => j.urutan.indexOf(a) - j.urutan.indexOf(b));
    const ada = urut.filter((k) => kor.includes(k));
    ada.forEach((k, n) => geserKor.set(`${i}|${k}`, (n - (ada.length - 1) / 2) * sp));
  });

  const indeks = new Map<string, number>();
  j.ruas.forEach((r, i) => indeks.set(kunci(r.dari, r.ke), i));
  const poli = j.ruas.map((r) => polilinRuas(j, r));

  // Garis koridor: tiap rantai dirangkai dari potongan garis tengah ruas beserta geserannya, lalu dibelokkan
  // dengan busur sepusat (jari-jari dalam lebih kecil), supaya garis sejajar tetap sejajar di tikungan.
  const titikDiSimpul = new Map<string, Titik[]>();
  const catat = (s: string, t: Titik) => titikDiSimpul.set(s, [...(titikDiSimpul.get(s) ?? []), t]);
  const garis: GarisKoridor[] = [];
  const batas: PetaBus["batas"] = {};
  for (const [kor, rantai] of Object.entries(j.jalur)) {
    const d: string[] = [];
    let [x0, y0, x1, y1] = [Infinity, Infinity, -Infinity, -Infinity];
    for (const r of rantai) {
      const segs: Potongan[] = [];
      for (let i = 0; i < r.length - 1; i++) {
        const idx = indeks.get(kunci(r[i], r[i + 1])) as number;
        const ruas = j.ruas[idx];
        const balik = ruas.dari !== r[i];
        const o = (geserKor.get(`${idx}|${kor}`) ?? 0) * (balik ? -1 : 1);
        const p = balik ? [...poli[idx]].reverse() : poli[idx];
        for (let k = 0; k < p.length - 1; k++) {
          const dd = arahSatuan(p[k], p[k + 1]);
          segs.push({ a: p[k], b: p[k + 1], d: dd, o, L: Math.hypot(p[k + 1][0] - p[k][0], p[k + 1][1] - p[k][1]) });
        }
        const awal = segs[segs.length - (p.length - 1)];
        const akhir = segs[segs.length - 1];
        const na = kiri(awal.d);
        const nb = kiri(akhir.d);
        catat(r[i], [awal.a[0] + na[0] * o, awal.a[1] + na[1] * o]);
        catat(r[i + 1], [akhir.b[0] + nb[0] * o, akhir.b[1] + nb[1] * o]);
      }
      const { jalur, titik } = jalurSejajar(segs);
      for (const [x, y] of titik) {
        x0 = Math.min(x0, x);
        y0 = Math.min(y0, y);
        x1 = Math.max(x1, x);
        y1 = Math.max(y1, y);
      }
      d.push(jalur);
    }
    garis.push({ id: kor, d });
    batas[kor] = [x0, y0, x1, y1];
  }

  // Halte di ruas. Entri "a+b" adalah sepasang halte berseberangan di posisi yang sama: label b di sisi lawan.
  const halte: TandaHalte[] = [];
  const label: Label[] = [];
  j.ruas.forEach((r, i) => {
    const kor = korRuas.get(i) ?? [];
    const p = poli[i];
    const L = panjang(p);
    const n = r.halte.length;
    const [ra, rb] = r.rentang ?? [0, 1];
    const offs = kor.map((k) => geserKor.get(`${i}|${k}`) ?? 0);
    const omin = Math.min(...offs, 0);
    const omax = Math.max(...offs, 0);
    // Jarak tiap halte dari pangkal ruas.
    const jarakHalte: number[] = [];
    if (r.perPotongan) {
      if (r.perPotongan.reduce((a, b) => a + b, 0) !== n || r.perPotongan.length !== p.length - 1) {
        throw new Error(`perPotongan tidak cocok: ruas ${r.dari}>${r.ke}`);
      }
      let awal = 0;
      r.perPotongan.forEach((jml, g) => {
        const lg = Math.hypot(p[g + 1][0] - p[g][0], p[g + 1][1] - p[g][1]);
        for (let q = 0; q < jml; q++) jarakHalte.push(awal + (lg * (q + 1)) / (jml + 1));
        awal += lg;
      });
    } else {
      for (let k = 0; k < n; k++) jarakHalte.push(L * ra + (L * (rb - ra) * (k + 1)) / (n + 1));
    }
    r.halte.forEach((entri, k) => {
      const { t, d } = padaJarak(p, jarakHalte[k]);
      const nk = kiri(d);
      let arah: SisiLabel;
      if (Array.isArray(r.label)) arah = r.label[k];
      else if (r.label === "seling-ns") arah = k % 2 === 0 ? "n" : "s";
      else if (r.label === "seling-ew") arah = k % 2 === 0 ? "e" : "w";
      else arah = r.label;
      if (arah === undefined) throw new Error(`Label kurang: ruas ${r.dari}>${r.ke}, halte ${entri}`);
      const ids = entri.split("+");
      const tk = UKURAN.tick;
      ids.forEach((h, urut) => {
        const sisi = urut === 0 ? arah : LAWAN[arah];
        const v: Titik = sisi === "kiri" ? nk : sisi === "kanan" ? [-nk[0], -nk[1]] : ARAH_VEKTOR[sisi];
        // Sisi kiri atau kanan garis yang paling dekat dengan arah label.
        const sisiKiri = v[0] * nk[0] + v[1] * nk[1] >= 0;
        const tepi = sisiKiri ? omax : omin; // garis terluar di sisi label
        const nSisi: Titik = sisiKiri ? nk : [-nk[0], -nk[1]];
        const pangkal: Titik = [t[0] + nk[0] * tepi, t[1] + nk[1] * tepi];
        if (urut === 0) {
          if (kor.length <= 1) {
            // Sepasang halte di satu garis: tanda melintang ke dua sisi.
            const a: Titik = ids.length > 1 ? [pangkal[0] - nSisi[0] * tk, pangkal[1] - nSisi[1] * tk] : pangkal;
            const b: Titik = [pangkal[0] + nSisi[0] * tk, pangkal[1] + nSisi[1] * tk];
            halte.push({ id: entri, ruas: i, koridor: kor, a, b, jenis: "tick" });
          } else {
            const a: Titik = [t[0] + nk[0] * (omin - 4), t[1] + nk[1] * (omin - 4)];
            const b: Titik = [t[0] + nk[0] * (omax + 4), t[1] + nk[1] * (omax + 4)];
            halte.push({ id: entri, ruas: i, koridor: kor, a, b, jenis: "batang" });
          }
        }
        // Label ditambatkan di sisi garis yang dipilih, lalu digeser ke arah label.
        const lepas = kor.length <= 1 ? tk : 4;
        const tambat: Titik = [pangkal[0] + nSisi[0] * lepas, pangkal[1] + nSisi[1] * lepas];
        const acuan = sisi === "kiri" || sisi === "kanan" ? nSisi : v;
        const sisiTeks: Titik =
          Math.abs(acuan[0]) > 0.2 && Math.abs(acuan[1]) > 0.2
            ? [Math.sign(acuan[0]), 0]
            : [Math.round(acuan[0]), Math.round(acuan[1])];
        label.push(
          buatLabel(h, j.nama(h), tambat, sisiTeks, UKURAN.celah - 3, UKURAN.font, false, kor, Math.abs(d[0]) > 0.9 ? 7 : 18),
        );
      });
    });
  });

  // Simpul.
  const simpul: TandaSimpul[] = [];
  for (const [id, s] of Object.entries(j.simpul)) {
    const titik = titikDiSimpul.get(id) ?? [[s.x, s.y]];
    let a: Titik = [s.x, s.y];
    let b: Titik = [s.x, s.y];
    let jauh = -1;
    for (const p of titik) {
      for (const q of titik) {
        const l = Math.hypot(p[0] - q[0], p[1] - q[1]);
        if (l > jauh) {
          jauh = l;
          a = p;
          b = q;
        }
      }
    }
    const kor = Object.entries(j.jalur)
      .filter(([, rantai]) => rantai.some((r) => r.includes(id)))
      .map(([k]) => k);
    if (!s.halte && !s.pos) continue;
    let ikonDi: Titik | null = null;
    if (s.pos && (s.halte || s.teks)) {
      const v = ARAH_VEKTOR[s.pos];
      const r = jauh / 2 + 7 + (s.jarak ?? 0);
      const tengah: Titik = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      const tambat: Titik = [tengah[0] + v[0] * r, tengah[1] + v[1] * r];
      const sisiTeks: Titik = Math.abs(v[0]) > 0.2 && Math.abs(v[1]) > 0.2 ? [Math.sign(v[0]), 0] : v;
      const teks = s.teks ?? j.nama(s.halte as string);
      const l = buatLabel(
        id,
        teks,
        tambat,
        sisiTeks,
        UKURAN.celah,
        s.utama ? UKURAN.fontUtama : UKURAN.font,
        !!s.utama || kor.length > 1,
        kor,
        14,
      );
      if (s.utama && kor.length) {
        // Deret nomor koridor di bawah label terminal (PetaBus.tsx: kotak 15, sela 2).
        // Label di utara: deret di atas teks, supaya tidak menimpa garis di bawahnya.
        const lebarDeret = kor.length * 17 - 2;
        const [x0, y0, x1, y1] = l.kotak;
        const kiriDeret = l.anchor === "start" ? x0 : l.anchor === "end" ? x1 - lebarDeret : (x0 + x1) / 2 - lebarDeret / 2;
        l.deret = s.pos.startsWith("n") ? "atas" : "bawah";
        l.kotak = [
          Math.min(x0, kiriDeret),
          l.deret === "atas" ? y0 - 17 : y0,
          Math.max(x1, kiriDeret + lebarDeret),
          l.deret === "atas" ? y1 : y1 + 17,
        ];
      }
      label.push(l);
      if (s.ikon) {
        const ukuran = l.ukuran;
        const kanan = l.anchor !== "end";
        ikonDi = [kanan ? l.kotak[2] + 13 : l.kotak[0] - 13, l.y - ukuran * 0.35 - ((l.baris.length - 1) * ukuran * 1.13) * 0];
      }
    }
    if (s.halte) {
      simpul.push({ id, halte: s.halte, koridor: kor, a, b, utama: !!s.utama, ikon: s.ikon, ikonDi });
    }
  }

  // Feri: garis tipis dari simpul ke laut, tanpa lintasan sebenarnya.
  const feri = (j.feri ?? []).map((f) => {
    const s = j.simpul[f.dari];
    const v = ARAH_VEKTOR[f.pos];
    const sisi: Titik = Math.abs(v[0]) > 0.2 && Math.abs(v[1]) > 0.2 ? [Math.sign(v[0]), 0] : v;
    return {
      d: keJalur([[s.x, s.y], f.ke]),
      label: buatLabel(`feri-${f.dari}`, f.teks, f.ke, sisi, 5, UKURAN.font - 1, false, [], 18),
    };
  });
  const rencana = (j.rencana ?? []).map((r) => {
    const v = ARAH_VEKTOR[r.pos];
    const ujung = r.titik[r.titik.length - 1];
    const sisi: Titik = Math.abs(v[0]) > 0.2 && Math.abs(v[1]) > 0.2 ? [Math.sign(v[0]), 0] : v;
    const label = buatLabel(`rencana-${r.id}`, r.teks, ujung, sisi, 6, UKURAN.font - 1, false, [r.id], 18);
    // Batas koridor rencana: garis dan labelnya, supaya sorotan memuat koridor ini juga.
    const xs = [...r.titik.map((t) => t[0]), label.kotak[0], label.kotak[2]];
    const ys = [...r.titik.map((t) => t[1]), label.kotak[1], label.kotak[3]];
    batas[r.id] = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
    return { id: r.id, d: keJalur(r.titik), label };
  });

  return { garis, halte, simpul, label, feri, rencana, batas };
}

/** Pasangan label yang kotaknya bertumpuk, untuk pratinjau dan tes. */
export function tabrakanLabel(p: PetaBus, celah = 1): [string, string][] {
  const hasil: [string, string][] = [];
  const L = p.label;
  for (let i = 0; i < L.length; i++) {
    for (let k = i + 1; k < L.length; k++) {
      const a = L[i].kotak;
      const b = L[k].kotak;
      if (a[0] < b[2] - celah && b[0] < a[2] - celah && a[1] < b[3] - celah && b[1] < a[3] - celah) {
        hasil.push([L[i].id, L[k].id]);
      }
    }
  }
  return hasil;
}
