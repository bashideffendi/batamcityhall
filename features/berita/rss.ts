// Parser RSS/Atom kecil tanpa dependensi. Hasilnya hanya judul, tautan, dan waktu:
// isi dan ringkasan artikel memang tidak pernah keluar dari sini.

export type ItemFeed = { judul: string; tautan: string; waktu: string | null };
export type HasilFeed = { format: "rss" | "atom"; item: ItemFeed[] };

export class FeedRusak extends Error {
  constructor(alasan: string) {
    super(`feed rusak: ${alasan}`);
    this.name = "FeedRusak";
  }
}

type Simpul = { nama: string; attr: Record<string, string>; anak: Simpul[]; teks: string };

const KEDALAMAN_MAKS = 64;
const PANJANG_JUDUL_MAKS = 240;

const ENTITAS: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  ndash: "–",
  mdash: "—",
  hellip: "…",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  laquo: "«",
  raquo: "»",
  middot: "·",
};

function dariKodeTitik(n: number): string | null {
  if (!Number.isInteger(n) || n <= 0 || n > 0x10ffff || (n >= 0xd800 && n <= 0xdfff)) return null;
  return String.fromCodePoint(n);
}

/** Entitas yang tidak dikenal dibiarkan apa adanya, bukan ditebak. */
export function dekodEntitas(s: string): string {
  return s.replace(/&(#[xX][0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/g, (asli, isi: string) => {
    if (isi[0] !== "#") return ENTITAS[isi] ?? asli;
    const heks = isi[1] === "x" || isi[1] === "X";
    return dariKodeTitik(parseInt(isi.slice(heks ? 2 : 1), heks ? 16 : 10)) ?? asli;
  });
}

function bacaAtribut(s: string): Record<string, string> {
  const attr: Record<string, string> = {};
  for (const m of s.matchAll(/([^\s=/]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
    attr[m[1]] = dekodEntitas(m[2] ?? m[3] ?? "");
  }
  return attr;
}

/** Posisi `>` penutup tag, melewati tanda kutip pada nilai atribut. */
function akhirTag(xml: string, dari: number): number {
  let kutip = "";
  for (let i = dari; i < xml.length; i++) {
    const c = xml[i];
    if (kutip) {
      if (c === kutip) kutip = "";
    } else if (c === '"' || c === "'") kutip = c;
    else if (c === ">") return i;
  }
  return -1;
}

function lewati(xml: string, penutup: string, dari: number, alasan: string): number {
  const j = xml.indexOf(penutup, dari);
  if (j < 0) throw new FeedRusak(alasan);
  return j + penutup.length;
}

/** DOCTYPE dilewati tanpa dibaca, termasuk subset internalnya. Entitas buatan feed tidak pernah diperluas. */
function lewatiDoctype(xml: string, dari: number): number {
  let dalam = 0;
  for (let i = dari; i < xml.length; i++) {
    const c = xml[i];
    if (c === "[") dalam++;
    else if (c === "]") dalam--;
    else if (c === ">" && dalam <= 0) return i + 1;
  }
  throw new FeedRusak("DOCTYPE tidak tertutup");
}

/** Pembaca XML yang ketat soal pasangan tag: halaman HTML dan feed terpotong gagal di sini. */
function bacaXml(xml: string): Simpul {
  const akar: Simpul = { nama: "#akar", attr: {}, anak: [], teks: "" };
  const tumpukan = [akar];
  let i = 0;
  while (i < xml.length) {
    const kini = tumpukan[tumpukan.length - 1];
    const lt = xml.indexOf("<", i);
    if (lt < 0) {
      kini.teks += dekodEntitas(xml.slice(i));
      break;
    }
    if (lt > i) kini.teks += dekodEntitas(xml.slice(i, lt));
    if (xml.startsWith("<!--", lt)) {
      i = lewati(xml, "-->", lt + 4, "komentar tidak tertutup");
    } else if (xml.startsWith("<![CDATA[", lt)) {
      i = lewati(xml, "]]>", lt + 9, "CDATA tidak tertutup");
      kini.teks += xml.slice(lt + 9, i - 3);
    } else if (xml.startsWith("<?", lt)) {
      i = lewati(xml, "?>", lt + 2, "instruksi tidak tertutup");
    } else if (xml.startsWith("<!", lt)) {
      i = lewatiDoctype(xml, lt + 2);
    } else if (xml.startsWith("</", lt)) {
      const j = xml.indexOf(">", lt);
      if (j < 0) throw new FeedRusak("tag penutup tidak selesai");
      const nama = xml.slice(lt + 2, j).trim();
      if (tumpukan.length < 2 || kini.nama !== nama) throw new FeedRusak(`tag penutup ${nama} tidak berpasangan`);
      tumpukan.pop();
      i = j + 1;
    } else {
      const j = akhirTag(xml, lt + 1);
      if (j < 0) throw new FeedRusak("tag tidak selesai");
      const isi = xml.slice(lt + 1, j);
      const tutupSendiri = isi.endsWith("/");
      const m = /^[A-Za-z_:][\w:.-]*/.exec(isi);
      if (!m) throw new FeedRusak("tanda < tanpa nama tag");
      const simpul: Simpul = {
        nama: m[0],
        attr: bacaAtribut(isi.slice(m[0].length, tutupSendiri ? -1 : undefined)),
        anak: [],
        teks: "",
      };
      kini.anak.push(simpul);
      if (!tutupSendiri) {
        if (tumpukan.length >= KEDALAMAN_MAKS) throw new FeedRusak("terlalu dalam");
        tumpukan.push(simpul);
      }
      i = j + 1;
    }
  }
  if (tumpukan.length > 1) throw new FeedRusak("dokumen terpotong");
  return akar;
}

const anak = (s: Simpul, nama: string) => s.anak.find((a) => a.nama === nama);
const semuaAnak = (s: Simpul, nama: string) => s.anak.filter((a) => a.nama === nama);

function hapusHtml(s: string): string {
  return s
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, " ")
    .replace(/<\/?[a-zA-Z][^<>]*>/g, " ");
}

/**
 * Judul jadi teks polos. Feed sering menaruh HTML di dalam CDATA atau mengodekan entitas dua kali,
 * jadi diulang sampai stabil. Syarat huruf setelah `<` menjaga judul seperti "5 < 6" tetap utuh.
 */
export function bersihkanJudul(mentah: string): string {
  let kini = mentah;
  for (let i = 0; i < 3; i++) {
    const baru = dekodEntitas(hapusHtml(kini));
    if (baru === kini) break;
    kini = baru;
  }
  const rapi = hapusHtml(kini)
    .replace(/\s+/g, " ")
    .replace(/[\p{Cc}\p{Cf}]/gu, "")
    .trim();
  const huruf = Array.from(rapi);
  return huruf.length > PANJANG_JUDUL_MAKS ? `${huruf.slice(0, PANJANG_JUDUL_MAKS).join("").trimEnd()}…` : rapi;
}

/** Hanya http dan https, tanpa kredensial di URL. Selain itu null: item dibuang, bukan ditautkan. */
export function tautanAman(mentah: string | null | undefined): string | null {
  if (!mentah) return null;
  try {
    const u = new URL(dekodEntitas(mentah).trim());
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    if (u.username || u.password) return null;
    return u.href;
  } catch {
    return null;
  }
}

const BULAN: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  mei: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  agu: 7,
  agt: 7,
  sep: 8,
  okt: 9,
  oct: 9,
  nov: 10,
  dec: 11,
  des: 11,
};
const ZONA_MENIT: Record<string, number> = { GMT: 0, UT: 0, UTC: 0, Z: 0, WIB: 420, WITA: 480, WIT: 540 };

function menitZona(z: string): number | null {
  const m = /^([+-])(\d{2}):?(\d{2})$/.exec(z);
  if (m) return (m[1] === "-" ? -1 : 1) * (+m[2] * 60 + +m[3]);
  return ZONA_MENIT[z.toUpperCase()] ?? null;
}

function keIso(th: number, bln: number, tgl: number, j: number, mnt: number, dtk: number, zona: number): string | null {
  const lokal = new Date(Date.UTC(th, bln, tgl, j, mnt, dtk));
  // 32 Nov atau jam 25 ditolak: Date akan menggesernya diam-diam kalau tidak dicek.
  if (lokal.getUTCMonth() !== bln || lokal.getUTCDate() !== tgl || lokal.getUTCHours() !== j) return null;
  return new Date(lokal.getTime() - zona * 60_000).toISOString();
}

/**
 * Sengaja tidak memakai Date.parse: ia menerima "foo 1" sebagai tahun 2001.
 * Tanggal tanpa zona waktu juga null, karena jamnya tidak bisa dipastikan.
 */
export function bacaWaktu(mentah: string | null | undefined): string | null {
  const s = mentah?.trim();
  if (!s) return null;
  const rfc =
    /^(?:[\p{L}]{3,},?\s+)?(\d{1,2})\s+([\p{L}]{3,})\s+(\d{2}|\d{4})\s+(\d{1,2})[:.](\d{2})(?:[:.](\d{2}))?\s*(\S+)$/u.exec(
      s,
    );
  if (rfc) {
    const bln = BULAN[rfc[2].slice(0, 3).toLowerCase()];
    const zona = menitZona(rfc[7]);
    if (bln === undefined || zona === null) return null;
    const th = rfc[3].length === 2 ? 2000 + +rfc[3] : +rfc[3];
    return keIso(th, bln, +rfc[1], +rfc[4], +rfc[5], +(rfc[6] ?? 0), zona);
  }
  const iso = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?\s*(Z|z|[+-]\d{2}:?\d{2})$/.exec(s);
  if (iso) {
    const zona = menitZona(iso[7]);
    if (zona === null) return null;
    return keIso(+iso[1], +iso[2] - 1, +iso[3], +iso[4], +iso[5], +(iso[6] ?? 0), zona);
  }
  return null;
}

function itemRss(s: Simpul): ItemFeed | null {
  const judul = bersihkanJudul(anak(s, "title")?.teks ?? "");
  const guid = anak(s, "guid");
  const tautan =
    tautanAman(anak(s, "link")?.teks) ?? (guid?.attr.isPermaLink === "false" ? null : tautanAman(guid?.teks));
  if (!judul || !tautan) return null;
  return { judul, tautan, waktu: bacaWaktu(anak(s, "pubDate")?.teks ?? anak(s, "dc:date")?.teks) };
}

function itemAtom(s: Simpul): ItemFeed | null {
  const judul = bersihkanJudul(anak(s, "title")?.teks ?? "");
  const tautanSemua = semuaAnak(s, "link");
  const alternate = tautanSemua.find((l) => (l.attr.rel ?? "alternate") === "alternate");
  const tautan = tautanAman(alternate?.attr.href);
  if (!judul || !tautan) return null;
  return { judul, tautan, waktu: bacaWaktu(anak(s, "published")?.teks ?? anak(s, "updated")?.teks) };
}

const hanyaAda = <T>(x: T | null): x is T => x !== null;

/** Melempar FeedRusak kalau bukan RSS atau Atom yang utuh. Feed utuh tanpa item bukan kerusakan. */
export function bacaFeed(xml: string): HasilFeed {
  const akar = bacaXml(xml.replace(/^﻿/, ""));
  const atas = akar.anak[0];
  if (!atas) throw new FeedRusak("dokumen kosong");
  if (atas.nama === "feed") return { format: "atom", item: semuaAnak(atas, "entry").map(itemAtom).filter(hanyaAda) };
  if (atas.nama === "rss" || atas.nama === "rdf:RDF") {
    const kanal = anak(atas, "channel");
    if (!kanal) throw new FeedRusak("tidak ada channel");
    // RDF (RSS 1.0) menaruh item di samping channel, bukan di dalamnya.
    const item = [...semuaAnak(kanal, "item"), ...semuaAnak(atas, "item")];
    return { format: "rss", item: item.map(itemRss).filter(hanyaAda) };
  }
  throw new FeedRusak(`akar ${atas.nama} bukan feed`);
}
