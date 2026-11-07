// Penyimpanan konten admin. Hanya di server. Mengikuti modeKiriman, sama dengan Tukang Langganan:
// supabase = basis data sungguhan, contoh = memori (dev dan e2e), mati = tidak ada (situs memakai berkas repo saja).
import { randomUUID } from "node:crypto";
import { modeKiriman, type Env } from "@/features/tukang/mode";
import type { InputAgenda, InputFoto, InputInfografik, InputJurnal, InputLoker, InputUbahanFoodCourt, InputUbahanMakan } from "./skema";
import type { BarisUbahan, BarisUbahanFoodCourt } from "./ubahan";

export type BarisJurnal = InputJurnal & { id: string };
export type BarisFoto = InputFoto & { id: string };
export type BarisAgenda = InputAgenda & { id: string };
export type BarisLoker = InputLoker & { id: string };
export type BarisInfografik = InputInfografik & { id: string };

export interface KontenStore {
  jurnal(semua: boolean): Promise<BarisJurnal[]>;
  simpanJurnal(d: InputJurnal): Promise<void>;
  hapusJurnal(id: string): Promise<void>;
  foto(): Promise<BarisFoto[]>;
  tambahFoto(d: InputFoto): Promise<void>;
  hapusFoto(id: string): Promise<void>;
  agenda(semua: boolean): Promise<BarisAgenda[]>;
  simpanAgenda(d: InputAgenda): Promise<void>;
  hapusAgenda(id: string): Promise<void>;
  loker(semua: boolean): Promise<BarisLoker[]>;
  simpanLoker(d: InputLoker): Promise<void>;
  hapusLoker(id: string): Promise<void>;
  ubahanMakan(): Promise<BarisUbahan[]>;
  simpanUbahanMakan(d: InputUbahanMakan): Promise<void>;
  hapusUbahanMakan(tempatId: string): Promise<void>;
  ubahanFoodCourt(): Promise<BarisUbahanFoodCourt[]>;
  simpanUbahanFoodCourt(d: InputUbahanFoodCourt): Promise<void>;
  hapusUbahanFoodCourt(foodCourtId: string): Promise<void>;
  infografik(semua: boolean): Promise<BarisInfografik[]>;
  simpanInfografik(d: InputInfografik): Promise<void>;
  hapusInfografik(id: string): Promise<void>;
  /** Mengembalikan alamat publik berkas. */
  unggah(nama: string, isi: Buffer, tipe: string): Promise<string>;
}

type Memori = {
  jurnal: BarisJurnal[];
  foto: BarisFoto[];
  agenda: BarisAgenda[];
  loker: BarisLoker[];
  makan: BarisUbahan[];
  foodcourt: BarisUbahanFoodCourt[];
  infografik: BarisInfografik[];
};

function memori(): Memori {
  const g = globalThis as unknown as { __bchKonten?: Memori };
  g.__bchKonten ??= { jurnal: [], foto: [], agenda: [], loker: [], makan: [], foodcourt: [], infografik: [] };
  // Memori dari versi sebelumnya saat dev belum punya kolom ini.
  g.__bchKonten.foodcourt ??= [];
  g.__bchKonten.infografik ??= [];
  return g.__bchKonten;
}

const pasang = <T extends { id: string }>(daftar: T[], baris: T) => {
  const i = daftar.findIndex((x) => x.id === baris.id);
  if (i >= 0) daftar[i] = baris;
  else daftar.push(baris);
};

export function storeContoh(m: Memori = memori()): KontenStore {
  return {
    jurnal: async (semua) => m.jurnal.filter((j) => semua || j.terbit).sort((a, b) => b.tanggal.localeCompare(a.tanggal)),
    simpanJurnal: async (d) => {
      if (m.jurnal.some((j) => j.slug === d.slug && j.id !== d.id)) throw new GalatSlugGanda();
      pasang(m.jurnal, { ...d, id: d.id ?? randomUUID() });
    },
    hapusJurnal: async (id) => void (m.jurnal = m.jurnal.filter((j) => j.id !== id)),
    foto: async () => [...m.foto],
    tambahFoto: async (d) => void m.foto.push({ ...d, id: randomUUID() }),
    hapusFoto: async (id) => void (m.foto = m.foto.filter((f) => f.id !== id)),
    agenda: async (semua) => m.agenda.filter((a) => semua || a.terbit).sort((a, b) => a.mulai.localeCompare(b.mulai)),
    simpanAgenda: async (d) => pasang(m.agenda, { ...d, id: d.id ?? randomUUID() }),
    hapusAgenda: async (id) => void (m.agenda = m.agenda.filter((a) => a.id !== id)),
    loker: async (semua) => m.loker.filter((l) => semua || l.terbit).sort((a, b) => b.tanggal.localeCompare(a.tanggal)),
    simpanLoker: async (d) => pasang(m.loker, { ...d, id: d.id ?? randomUUID() }),
    hapusLoker: async (id) => void (m.loker = m.loker.filter((l) => l.id !== id)),
    ubahanMakan: async () => [...m.makan],
    simpanUbahanMakan: async (d) => {
      const { tempat_id, baru, ...data } = d;
      m.makan = [...m.makan.filter((u) => u.tempat_id !== tempat_id), { tempat_id, baru, data }];
    },
    hapusUbahanMakan: async (tempatId) => void (m.makan = m.makan.filter((u) => u.tempat_id !== tempatId)),
    ubahanFoodCourt: async () => [...m.foodcourt],
    simpanUbahanFoodCourt: async (d) => {
      const { foodcourt_id, baru, ...data } = d;
      m.foodcourt = [...m.foodcourt.filter((u) => u.foodcourt_id !== foodcourt_id), { foodcourt_id, baru, data }];
    },
    hapusUbahanFoodCourt: async (id) => void (m.foodcourt = m.foodcourt.filter((u) => u.foodcourt_id !== id)),
    infografik: async (semua) => m.infografik.filter((i) => semua || i.terbit).sort((a, b) => b.tanggal.localeCompare(a.tanggal)),
    simpanInfografik: async (d) => {
      if (m.infografik.some((i) => i.slug === d.slug && i.id !== d.id)) throw new GalatSlugGanda();
      pasang(m.infografik, { ...d, id: d.id ?? randomUUID() });
    },
    hapusInfografik: async (id) => void (m.infografik = m.infografik.filter((i) => i.id !== id)),
    // Tidak ada penyimpanan berkas di mode contoh: gambar dibawa langsung di alamatnya.
    unggah: async (_nama, isi, tipe) => `data:${tipe};base64,${isi.toString("base64")}`,
  };
}

export class GalatSlugGanda extends Error {
  constructor() {
    super("Alamat tulisan sudah dipakai.");
  }
}

export async function ambilKonten(env: Env = process.env): Promise<KontenStore | null> {
  const mode = modeKiriman(env);
  if (mode === "contoh") return storeContoh();
  if (mode === "mati") return null;
  const { storeSupabase } = await import("./store-supabase");
  return storeSupabase(env);
}
