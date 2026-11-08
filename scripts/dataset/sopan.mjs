// Pembantu pengunduh dataset: satu permintaan per jeda, simpan berkas, dan catat asal-usulnya.
// Arsip ditulis ke dataset-arsip/ (di-gitignore) karena portal sumber tidak menyatakan lisensi.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export const ROOT = join(import.meta.dirname, "..", "..");
export const ARSIP = join(ROOT, "dataset-arsip");
// Nama klien umum tanpa identitas pribadi.
const UA = "Mozilla/5.0 (compatible; BatamCityHall-arsip/1.0)";

const tidur = (ms) => new Promise((r) => setTimeout(r, ms));
let terakhir = 0;

/** fetch dengan jeda minimal antarpermintaan dan batas waktu. */
export async function ambil(url, { jedaMs = 3000, init = {}, batasMs = 30000 } = {}) {
  const tunggu = terakhir + jedaMs - Date.now();
  if (tunggu > 0) await tidur(tunggu);
  terakhir = Date.now();
  return fetch(url, {
    ...init,
    headers: { "User-Agent": UA, ...(init.headers ?? {}) },
    signal: AbortSignal.timeout(batasMs),
  });
}

export function simpan(jalurRelatif, isi) {
  const f = join(ARSIP, jalurRelatif);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, isi);
  return {
    berkas: jalurRelatif.replace(/\\/g, "/"),
    byte: Buffer.byteLength(isi),
    sha256: createHash("sha256").update(isi).digest("hex"),
  };
}

export const ada = (jalurRelatif) => existsSync(join(ARSIP, jalurRelatif));
export const baca = (jalurRelatif) => readFileSync(join(ARSIP, jalurRelatif), "utf8");

/** Data pajak hotel tidak boleh masuk proyek (CLAUDE.md). Disaring dari judul. */
export const terlarang = (judul) => /pajak|pbjt|retribusi/i.test(judul ?? "");

export const hariIni = () => new Date().toISOString().slice(0, 10);
