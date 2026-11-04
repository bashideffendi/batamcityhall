// Membaca tabel dari asal_usul_nama.md dan bacaan_lanjutan.md. Berkasnya salinan laporan riset, jadi yang
// diambil hanya baris tabel dan butir nama tempat; kesimpulan dan catatan penyusun ditulis sendiri di halaman.
import { readFileSync } from "node:fs";
import path from "node:path";
import { rincianStatus, type KunciStatus } from "./data";

const baca = (nama: string) => readFileSync(path.join(process.cwd(), "data/sejarah", nama), "utf8");

const selTabel = (baris: string) =>
  baris
    .split("|")
    .slice(1, -1)
    .map((s) => s.trim());

/** Baris data tabel pertama setelah kepala yang diawali `kepala`. */
function barisTabel(md: string, kepala: string): string[][] {
  const semua = md.split(/\r?\n/);
  const awal = semua.findIndex((b) => b.startsWith(`| ${kepala}`));
  if (awal === -1) throw new Error(`Tabel "${kepala}" tidak ditemukan`);
  const hasil: string[][] = [];
  for (const b of semua.slice(awal + 2)) {
    if (!b.startsWith("|")) break;
    hasil.push(selTabel(b));
  }
  return hasil;
}

function statusDariTanda(t: string): KunciStatus[] {
  const hasil: KunciStatus[] = [];
  if (t.includes("✅")) hasil.push("terverifikasi");
  if (t.includes("📜")) hasil.push("cerita_rakyat");
  if (t.includes("⚠️")) hasil.push("perbedaan_versi");
  return hasil;
}

export type VersiNama = { versi: string; isi: string; asal: string; status: KunciStatus[]; rincian: string | null };
export type NamaTempat = { nama: string; isi: string; status: KunciStatus[] };
export type Bacaan = { judul: string; penulis: string; isi: string; url: string };

export function uraiVersiNama(md: string): VersiNama[] {
  return barisTabel(md, "Versi").map(([versi, isi, asal, tanda]) => ({
    versi: versi.replace(/"/g, ""),
    isi,
    asal,
    status: statusDariTanda(tanda),
    rincian: rincianStatus(tanda),
  }));
}

export function uraiNamaTempat(md: string): NamaTempat[] {
  return md
    .split(/\r?\n/)
    .map((b) => b.match(/^- \*\*(.+?)\*\* — (.+)$/))
    .filter((m): m is RegExpMatchArray => m !== null)
    .map((m) => {
      const akhir = m[2].match(/\s*((?:✅|⚠️|📜|\/)+)\s*$/);
      return {
        nama: m[1],
        isi: akhir ? m[2].slice(0, akhir.index).trim() : m[2],
        status: akhir ? statusDariTanda(akhir[1]) : [],
      };
    });
}

export function uraiBacaan(md: string): Bacaan[] {
  return barisTabel(md, "Judul").map(([judul, penulis, isi, url]) => ({ judul, penulis, isi, url }));
}

export const versiNama = () => uraiVersiNama(baca("asal_usul_nama.md"));
export const namaTempat = () => uraiNamaTempat(baca("asal_usul_nama.md"));
export const bacaanLanjutan = () => uraiBacaan(baca("bacaan_lanjutan.md"));
