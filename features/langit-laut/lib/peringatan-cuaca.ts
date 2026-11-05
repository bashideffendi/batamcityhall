// Penguraian peringatan dini cuaca BMKG (CAP 1.2) dan aturan tampilnya. Fungsi murni: dipakai
// app/api/peringatan-cuaca/route.ts dan klien, bisa diuji tanpa jaringan.
//
// Sumber (dok: data.bmkg.go.id/peringatan-dini-cuaca):
//  - RSS alerts/nowcast/id        daftar peringatan per provinsi. Butir yang sudah lewat masih ikut
//                                 (dicek 5 Nov 2026), jadi masa berlaku selalu dicek dari XML-nya.
//  - {kode}_alert.xml             satu peringatan: waktu, teks, dan poligon wilayah.
// Satu <area> mencakup seluruh provinsi. Nama kecamatan hanya ada di teks deskripsi.
//
// Tanpa pustaka XML: bentuk CAP sederhana dan tetap, dan yang tidak dikenali dikembalikan null
// supaya pemanggil melaporkan gagal, bukan "tidak ada peringatan".
import type { PeringatanCuaca, PeringatanResponse } from "./api-types";

/** Nama provinsi di RSS dan areaDesc. Kode berkas Kep. Riau berawalan CKR. */
const RSS_KEPRI = /\bkep(?:\.|ulauan)\s*riau\b/i;
const KODE_KEPRI = /^CKR\d/;
const KODE_SAH = /^[A-Z]{2,5}\d{8,16}$/;

/**
 * 12 kecamatan Kota Batam: titik label (kecamatan-geo.json, BIG) dan ejaan di teks BMKG.
 * Sama dengan KECAMATAN di lib/data/schema.ts; tests/unit/peringatan-cuaca.test.ts menjaganya.
 */
export const KECAMATAN_BATAM: { nama: string; lat: number; lon: number; ejaan: string[] }[] = [
  { nama: "Batam Kota", lat: 1.11887, lon: 104.0354, ejaan: ["BATAM KOTA"] },
  { nama: "Batu Aji", lat: 1.05746, lon: 103.98673, ejaan: ["BATU AJI", "BATUAJI"] },
  { nama: "Batu Ampar", lat: 1.17647, lon: 104.01227, ejaan: ["BATU AMPAR", "BATUAMPAR"] },
  { nama: "Belakang Padang", lat: 1.02207, lon: 103.7814, ejaan: ["BELAKANG PADANG", "BELAKANGPADANG"] },
  { nama: "Bengkong", lat: 1.15999, lon: 104.02985, ejaan: ["BENGKONG"] },
  { nama: "Bulang", lat: 0.96734, lon: 103.91653, ejaan: ["BULANG"] },
  { nama: "Galang", lat: 0.84096, lon: 104.20484, ejaan: ["GALANG"] },
  { nama: "Lubuk Baja", lat: 1.13383, lon: 104.00592, ejaan: ["LUBUK BAJA", "LUBUKBAJA"] },
  { nama: "Nongsa", lat: 1.15818, lon: 104.11649, ejaan: ["NONGSA"] },
  { nama: "Sagulung", lat: 1.0269, lon: 103.96294, ejaan: ["SAGULUNG"] },
  { nama: "Sei Beduk", lat: 1.06071, lon: 104.0635, ejaan: ["SEI BEDUK", "SEI. BEDUK", "SUNGAI BEDUK"] },
  { nama: "Sekupang", lat: 1.10833, lon: 103.95962, ejaan: ["SEKUPANG"] },
];

const ENTITAS: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };

/** Pulihkan teks XML: CDATA dan entitas dasar. */
function dekode(s: string): string {
  const cdata = /^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/.exec(s);
  if (cdata) return cdata[1].trim();
  return s
    .replace(/&(?:#(\d+)|#x([0-9a-f]+)|(\w+));/gi, (asli, des, hex, nama) => {
      if (des) return String.fromCodePoint(Number(des));
      if (hex) return String.fromCodePoint(parseInt(hex, 16));
      return ENTITAS[nama] ?? asli;
    })
    .trim();
}

const blok = (xml: string, tag: string): string[] =>
  [...xml.matchAll(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "g"))].map((m) => m[1]);

const isi = (xml: string, tag: string): string => {
  const b = blok(xml, tag)[0];
  return b === undefined ? "" : dekode(b);
};

const iso = (s: string): string => {
  const ms = Date.parse(s);
  return Number.isNaN(ms) ? "" : new Date(ms).toISOString();
};

export type ButirRss = { kode: string; judul: string };

/** Daftar butir RSS yang kodenya sah. null = bukan RSS yang dikenali. */
export function uraiRss(xml: string): ButirRss[] | null {
  if (!/<rss[\s>]/.test(xml) || !/<channel[\s>]/.test(xml)) return null;
  const hasil: ButirRss[] = [];
  for (const item of blok(xml, "item")) {
    const kode = /\/([A-Z0-9]+)_alert\.xml/.exec(isi(item, "link"))?.[1] ?? "";
    if (KODE_SAH.test(kode)) hasil.push({ kode, judul: isi(item, "title") });
  }
  return hasil;
}

export const butirKepri = (b: ButirRss) => KODE_KEPRI.test(b.kode) || RSS_KEPRI.test(b.judul);

/** "lintang,bujur lintang,bujur ..." menjadi cincin [bujur, lintang]. null kalau tidak sah. */
export function uraiPoligon(s: string): [number, number][] | null {
  const titik: [number, number][] = [];
  for (const p of s.trim().split(/\s+/)) {
    const [lat, lon] = p.split(",").map(Number);
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
    titik.push([lon, lat]);
  }
  return titik.length >= 4 ? titik : null;
}

function dalamCincin(lon: number, lat: number, cincin: [number, number][]): boolean {
  let hasil = false;
  for (let i = 0, j = cincin.length - 1; i < cincin.length; j = i++) {
    const [xi, yi] = cincin[i];
    const [xj, yj] = cincin[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) hasil = !hasil;
  }
  return hasil;
}

/**
 * Kecamatan Batam yang kena peringatan: disebut di teks, atau titik labelnya di dalam poligon. Keduanya
 * dicek supaya teks yang terpotong tidak menghilangkan Batam. Teks yang hanya menyebut "Batam" tanpa
 * kecamatan tetap terhitung sebagai "Kota Batam".
 */
export function kecamatanBatam(deskripsi: string, poligon: [number, number][][]): string[] {
  const teks = deskripsi.toUpperCase().replace(/\s+/g, " ");
  const kena = KECAMATAN_BATAM.filter(
    (k) =>
      k.ejaan.some((e) => new RegExp(`(^|[^A-Z])${e.replace(".", "\\.")}($|[^A-Z])`).test(teks)) ||
      poligon.some((c) => dalamCincin(k.lon, k.lat, c)),
  ).map((k) => k.nama);
  if (kena.length) return kena;
  return /(^|[^A-Z])BATAM($|[^A-Z])/.test(teks) ? ["Kota Batam"] : [];
}

export type HasilCap = {
  /** null = pesan sah tetapi bukan peringatan yang tampil: pembatalan atau bukan status Actual */
  peringatan: PeringatanCuaca | null;
  /** identifier yang digantikan atau dibatalkan pesan ini */
  merujuk: string[];
};

/** Satu XML CAP. null = bukan CAP yang dikenali atau kolom pentingnya kosong. */
export function uraiCap(xml: string, kode: string): HasilCap | null {
  if (!/<alert[\s>]/.test(xml)) return null;
  const id = isi(xml, "identifier");
  const msgType = isi(xml, "msgType");
  if (!id || !msgType) return null;
  const merujuk = isi(xml, "references")
    .split(/\s+/)
    .map((r) => r.split(",")[1] ?? "")
    .filter(Boolean);
  if (msgType === "Cancel" || isi(xml, "status") !== "Actual" || isi(xml, "scope") !== "Public") {
    return { peringatan: null, merujuk };
  }
  const infos = blok(xml, "info");
  const info = infos.find((b) => isi(b, "language").toLowerCase().startsWith("id")) ?? infos[0];
  if (!info) return null;
  const mulai = iso(isi(info, "effective")) || iso(isi(xml, "sent"));
  const sampai = iso(isi(info, "expires"));
  const deskripsi = isi(info, "description");
  if (!mulai || !sampai || !deskripsi) return null;
  const area = blok(info, "area");
  const poligon = area
    .flatMap((a) => blok(a, "polygon"))
    .map((p) => uraiPoligon(dekode(p)))
    .filter((p): p is [number, number][] => p !== null);
  const web = isi(info, "web");
  return {
    merujuk,
    peringatan: {
      id,
      kode,
      kejadian: isi(info, "event"),
      judul: isi(info, "headline"),
      deskripsi,
      terbit: iso(isi(xml, "sent")),
      mulai,
      sampai,
      keparahan: isi(info, "severity"),
      urgensi: isi(info, "urgency"),
      kepastian: isi(info, "certainty"),
      wilayah: area
        .map((a) => isi(a, "areaDesc"))
        .filter(Boolean)
        .join(", "),
      batam: kecamatanBatam(deskripsi, poligon),
      // hanya tautan BMKG sendiri yang boleh jadi href
      web: /^https:\/\/[\w.-]+\.bmkg\.go\.id\//.test(web) ? web : "",
      poligon,
    },
  };
}

/** Teks dari penerbit disalin apa adanya, kecuali ejaan yang tidak baku (PEDOMAN 2.8). */
export const rapikanTeks = (s: string) => s.replace(/\bdihimbau\b/g, "diimbau").replace(/\bDihimbau\b/g, "Diimbau");

/** Yang masih berlaku pada `now`. Dipakai server dan klien (dengan jamnya sendiri). */
export function aktifPada(daftar: PeringatanCuaca[] | undefined, now: number): PeringatanCuaca[] {
  return (daftar ?? []).filter((p) => Date.parse(p.sampai) > now);
}

/**
 * Pesan yang tampil dari kumpulan hasil CAP: buang yang sudah digantikan atau dibatalkan pesan lain
 * dan yang sudah lewat. Urut: yang kena Batam dulu, lalu yang mulainya paling baru.
 */
export function susunPeringatan(hasil: HasilCap[], now: number): PeringatanCuaca[] {
  const dirujuk = new Set(hasil.flatMap((h) => h.merujuk));
  const tersisa = hasil.map((h) => h.peringatan).filter((p): p is PeringatanCuaca => p !== null && !dirujuk.has(p.id));
  return aktifPada(tersisa, now).sort(
    (a, b) => Number(b.batam.length > 0) - Number(a.batam.length > 0) || Date.parse(b.mulai) - Date.parse(a.mulai),
  );
}

const WIB = "Asia/Jakarta";
const tanggalWib = (ms: number) =>
  new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", timeZone: WIB }).format(ms);

/** "10.10 WIB"; tanggal disebut kalau bukan hari ini menurut WIB. */
export function waktuWib(isoStr: string, now: number): string {
  const ms = Date.parse(isoStr);
  if (Number.isNaN(ms)) return "";
  const jam = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: WIB,
  }).format(ms);
  return tanggalWib(ms) === tanggalWib(now) ? `${jam} WIB` : `${tanggalWib(ms)}, ${jam} WIB`;
}

/** "Batu Aji, Sagulung, dan Sekupang" */
export function daftarNama(nama: string[]): string {
  if (nama.length < 2) return nama.join("");
  if (nama.length === 2) return nama.join(" dan ");
  return `${nama.slice(0, -1).join(", ")}, dan ${nama[nama.length - 1]}`;
}

/** Satu kalimat lurus, tanpa candaan: "Hujan Lebat dan Petir di Batu Aji dan Sagulung sampai 10.10 WIB." */
export function kalimatPeringatan(p: PeringatanCuaca, now: number): string {
  const tempat = p.batam.length ? daftarNama(p.batam) : p.wilayah;
  const belum = Date.parse(p.mulai) > now;
  return `${p.kejadian || p.judul}${tempat ? ` di ${tempat}` : ""}${belum ? `, mulai ${waktuWib(p.mulai, now)}` : ""} sampai ${waktuWib(p.sampai, now)}.`;
}

export type StatusBatam =
  { jenis: "memuat" } | { jenis: "tidak-ada" } | { jenis: "gagal"; teks: string } | { jenis: "aktif"; teks: string };

/**
 * Isi baris peringatan cuaca di kotak Hari Ini. Tidak tahu tetap ditulis tidak tahu. "tidak-ada" hanya
 * berarti BMKG tidak mencantumkan Batam; barisnya disembunyikan, dan tidak pernah ditulis "aman".
 */
export function statusUntukBatam(data: PeringatanResponse | null, error: boolean, now: number): StatusBatam {
  if (!data) return error ? { jenis: "gagal", teks: "Peringatan cuaca belum dapat dimuat." } : { jenis: "memuat" };
  const batam = aktifPada(data.peringatan, now).filter((p) => p.batam.length > 0);
  if (batam.length) {
    const lagi = batam.length > 1 ? ` Ada ${batam.length - 1} peringatan lain untuk Batam.` : "";
    return { jenis: "aktif", teks: `${kalimatPeringatan(batam[0], now)}${lagi}` };
  }
  if (error || data.status === "gagal" || data.status === "basi") {
    return { jenis: "gagal", teks: "Peringatan cuaca terbaru belum dapat dimuat." };
  }
  if (data.status === "sebagian") return { jenis: "gagal", teks: "Sebagian peringatan cuaca belum dapat dimuat." };
  return { jenis: "tidak-ada" };
}

/** Poligon peringatan untuk peta. */
export function keGeoJson(daftar: PeringatanCuaca[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: daftar
      .filter((p) => p.poligon?.length)
      .map((p) => ({
        type: "Feature" as const,
        properties: { id: p.id },
        geometry: { type: "MultiPolygon" as const, coordinates: (p.poligon ?? []).map((c) => [c]) },
      })),
  };
}
