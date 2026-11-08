// Peta Bus Trans Batam yang sudah disusun, satu kali saat build. Dipakai komponen server dan tes.
import { KORIDOR, namaKelompok, warnaMalam } from "../trans-data";
import { FERI, HALTE_TAMBAHAN, JALUR, KANVAS, PECAH, RENCANA, RUAS, SIMPUL, URUTAN } from "./jaringan";
import { susunPeta, type Jaringan, type PetaBus } from "./susun";

/** Nama halte untuk teks: dari halte.json bila ada, selain itu dari Peta Bus Batam 2024. */
export const namaHalte = (id: string) => HALTE_TAMBAHAN[id] ?? namaKelompok(id);

export const JARINGAN: Jaringan = {
  simpul: SIMPUL,
  ruas: RUAS,
  jalur: JALUR,
  urutan: URUTAN,
  nama: (id) => PECAH[id] ?? namaHalte(id),
  kanvas: KANVAS,
  feri: FERI,
  rencana: RENCANA,
};

export const PETA: PetaBus = susunPeta(JARINGAN);

/** Semua id halte di peta, termasuk pasangan "a+b" dan simpul. */
export function halteDiPeta(): Set<string> {
  const hasil = new Set<string>();
  for (const r of RUAS) for (const e of r.halte) for (const h of e.split("+")) hasil.add(h);
  for (const s of Object.values(SIMPUL)) if (s.halte) hasil.add(s.halte);
  return hasil;
}

export type InfoKoridor = { id: string; nama: string; warna: string; malam: string; rencana: boolean };

export const INFO_KORIDOR: InfoKoridor[] = KORIDOR.map((k) => ({
  id: k.id,
  nama: k.nama,
  warna: k.warna,
  malam: warnaMalam(k.warna),
  rencana: k.status === "rencana",
}));
