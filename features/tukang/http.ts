// Pembantu route handler kiriman warga: satu alur untuk mode, batas laju, ukuran, honeypot, dan validasi.
import type { z } from "zod";
import { buatBatasLaju, ipDari, type BatasLaju } from "./batas-laju";
import { GalatTidakAda } from "./galat";
import { modeKiriman, PESAN_MATI } from "./mode";
import { adaHoneypot, galatPerKolom } from "./skema";
import { ambilStore, type TukangStore } from "./store";

const MAKS_BYTE = 16 * 1024;
const JENDELA_MS = 10 * 60 * 1000;
// Mode contoh hanya untuk dev dan e2e, tempat banyak kiriman datang dari satu alamat.
const MAKS_CONTOH = 5000;

/**
 * Membaca badan permintaan paling banyak `maks` byte. Lebih dari itu hasilnya null dan sisanya tidak ditampung,
 * jadi pengirim yang berbohong soal content-length atau memakai chunked tidak bisa memenuhi memori.
 */
export async function bacaTeksTerbatas(req: Request, maks: number): Promise<string | null> {
  if (Number(req.headers.get("content-length") ?? 0) > maks) return null;
  if (!req.body) return "";
  const pembaca = req.body.getReader();
  const potongan: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await pembaca.read();
    if (done) break;
    total += value.byteLength;
    if (total > maks) {
      await pembaca.cancel().catch(() => {});
      return null;
    }
    potongan.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(potongan));
}

/** JSON dari badan permintaan, atau null bila terlalu besar atau tidak terbaca. */
export async function bacaJsonTerbatas(req: Request, maks: number): Promise<unknown> {
  try {
    const teks = await bacaTeksTerbatas(req, maks);
    return teks === null ? null : JSON.parse(teks);
  } catch {
    return null;
  }
}

export const jawab = (status: number, isi: Record<string, unknown>) => Response.json(isi, { status });
export const tolak = (status: number, pesan: string, galat?: Record<string, string>) =>
  jawab(status, { ok: false, pesan, galat });

type Opsi<S extends z.ZodType> = {
  skema: S;
  /** Kiriman per 10 menit per alamat IP. */
  maksPerJendela: number;
  simpan: (store: TukangStore, data: z.output<S>) => Promise<void>;
};

export function buatRouteKiriman<S extends z.ZodType>({ skema, maksPerJendela, simpan }: Opsi<S>) {
  const batas: BatasLaju = buatBatasLaju(maksPerJendela, JENDELA_MS);
  const batasContoh: BatasLaju = buatBatasLaju(MAKS_CONTOH, JENDELA_MS);

  return async function POST(req: Request): Promise<Response> {
    const mode = modeKiriman();
    const store = ambilStore();
    if (mode === "mati" || !store) return tolak(503, PESAN_MATI);

    if (!(mode === "contoh" ? batasContoh : batas)(ipDari(req))) {
      return tolak(429, "Terlalu banyak kiriman. Coba lagi beberapa menit lagi.");
    }
    let badan: unknown;
    try {
      const teks = await bacaTeksTerbatas(req, MAKS_BYTE);
      if (teks === null) return tolak(413, "Kirimannya terlalu panjang.");
      badan = JSON.parse(teks);
    } catch {
      return tolak(400, "Kirimannya tidak terbaca.");
    }

    // Robot mendapat jawaban sukses supaya tidak belajar apa-apa. Tidak ada yang disimpan.
    if (adaHoneypot(badan)) return jawab(200, { ok: true });

    const hasil = skema.safeParse(badan);
    if (!hasil.success) return tolak(400, "Ada isian yang perlu diperbaiki.", galatPerKolom(hasil.error));

    try {
      await simpan(store, hasil.data);
    } catch (e) {
      if (e instanceof GalatTidakAda) return tolak(404, "Entri ini sudah tidak tampil.");
      // Jangan mencatat isi kiriman: isinya bisa memuat data pribadi.
      console.error("Kiriman warga gagal disimpan:", e instanceof Error ? e.message : "galat tidak dikenal");
      return tolak(500, "Kiriman gagal disimpan. Coba lagi nanti.");
    }
    return jawab(200, { ok: true });
  };
}
