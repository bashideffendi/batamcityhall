// Pembacaan konten untuk halaman publik. Hanya di server. Bila basis data bermasalah, situs tetap tampil dari
// berkas repo: daftar dari basis data dianggap kosong dan galatnya dicatat.
import { INFOGRAFIK_REPO, type Infografik } from "@/features/infografik/data";
import { TULISAN, type Tulisan } from "@/features/jurnal/data";
import type { Foto } from "@/features/makan/lib/foto";
import { pecahParagraf } from "./skema";
import { ambilKonten, type BarisAgenda, type BarisInfografik, type BarisJurnal, type BarisLoker } from "./store";

const GAMBAR_JURNAL = "/grafis/bagian/jurnal.webp";

async function aman<T>(ambil: () => Promise<T>, cadangan: T): Promise<T> {
  try {
    return await ambil();
  } catch (e) {
    console.error("Konten tidak terbaca:", e instanceof Error ? e.message : "galat tidak dikenal");
    return cadangan;
  }
}

export const tulisanDariBaris = (b: BarisJurnal): Tulisan => ({
  slug: b.slug,
  judul: b.judul,
  penulis: b.penulis,
  tanggal: b.tanggal,
  rubrik: b.rubrik,
  ringkasan: b.ringkasan,
  gambar: b.gambar ?? GAMBAR_JURNAL,
  isi: pecahParagraf(b.isi),
});

/** Tulisan di basis data menang bila alamatnya sama dengan tulisan di repo. Terbaru lebih dulu. */
export function gabungTulisan(repo: Tulisan[], db: Tulisan[]): Tulisan[] {
  const slugDb = new Set(db.map((t) => t.slug));
  return [...db, ...repo.filter((t) => !slugDb.has(t.slug))].sort((a, b) => b.tanggal.localeCompare(a.tanggal));
}

export async function semuaTulisan(): Promise<Tulisan[]> {
  const db = await aman(async () => (await (await ambilKonten())?.jurnal(false)) ?? [], [] as BarisJurnal[]);
  return gabungTulisan(TULISAN, db.map(tulisanDariBaris));
}

/** Acara yang belum lewat, menurut tanggal WIB. Terdekat lebih dulu. */
export const agendaBelumLewat = (daftar: BarisAgenda[], hariIni: string) =>
  daftar.filter((a) => (a.selesai ?? a.mulai) >= hariIni).sort((a, b) => a.mulai.localeCompare(b.mulai));

const hariIniWib = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

export async function agendaMendatang(): Promise<BarisAgenda[]> {
  const semua = await aman(async () => (await (await ambilKonten())?.agenda(false)) ?? [], [] as BarisAgenda[]);
  return agendaBelumLewat(semua, hariIniWib());
}

/** Lowongan yang batas lamarannya belum lewat. Terbaru lebih dulu. */
export const lokerBelumLewat = (daftar: BarisLoker[], hariIni: string) =>
  daftar.filter((l) => !l.batas || l.batas >= hariIni).sort((a, b) => b.tanggal.localeCompare(a.tanggal));

export async function lokerAktif(): Promise<BarisLoker[]> {
  const semua = await aman(async () => (await (await ambilKonten())?.loker(false)) ?? [], [] as BarisLoker[]);
  return lokerBelumLewat(semua, hariIniWib());
}

/** Foto per tempat, untuk ditambahkan ke foto yang ada di repo. */
/** Kunci cacheRespons untuk /api/konten/foto. Dilupakan saat admin menambah atau menghapus foto. */
export const KUNCI_CACHE_FOTO = "konten-foto";

export async function petaFoto(): Promise<Record<string, Foto[]>> {
  const semua = await aman(async () => (await (await ambilKonten())?.foto()) ?? [], []);
  const peta: Record<string, Foto[]> = {};
  for (const f of semua) {
    (peta[f.tempat_id] ??= []).push({ src: f.src, w: f.w, h: f.h, alt: f.alt ?? undefined, kredit: f.kredit ?? undefined });
  }
  return peta;
}

export const infografikDariBaris = (b: BarisInfografik): Infografik => ({
  slug: b.slug,
  judul: b.judul,
  ringkasan: b.ringkasan,
  rubrik: b.rubrik,
  tanggal: b.tanggal,
  penulis: "Redaksi Batam City Hall",
  gambar: { src: b.gambar, w: b.lebar, h: b.tinggi, deskripsi: b.deskripsi },
});

/** Infografik di basis data menang bila alamatnya sama dengan bawaan repo. Terbaru lebih dulu. */
export function gabungInfografik(repo: Infografik[], db: Infografik[]): Infografik[] {
  const slugDb = new Set(db.map((i) => i.slug));
  return [...db, ...repo.filter((i) => !slugDb.has(i.slug))].sort((a, b) => b.tanggal.localeCompare(a.tanggal));
}

export async function semuaInfografik(): Promise<Infografik[]> {
  const db = await aman(async () => (await (await ambilKonten())?.infografik(false)) ?? [], [] as BarisInfografik[]);
  return gabungInfografik(INFOGRAFIK_REPO, db.map(infografikDariBaris));
}
