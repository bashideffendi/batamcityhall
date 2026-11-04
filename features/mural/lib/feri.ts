// Posisi feri dihitung dari jadwal, bukan dari AIS. Jam di data/feri/jadwal.json selalu waktu lokal pelabuhan asal.
import { klem, sepanjangGaris, type Posisi, type Titik } from "./geom";

export type Zona = "Asia/Jakarta" | "Asia/Singapore" | "Asia/Kuala_Lumpur";

/** Offset tetap: ketiga zona ini tidak memakai waktu musim panas. */
const OFFSET_JAM: Record<Zona, number> = { "Asia/Jakarta": 7, "Asia/Singapore": 8, "Asia/Kuala_Lumpur": 8 };
export const SINGKATAN_ZONA: Record<Zona, string> = {
  "Asia/Jakarta": "WIB",
  "Asia/Singapore": "SGT",
  "Asia/Kuala_Lumpur": "MYT",
};

export type BarisJadwal = {
  ruteId: string;
  arah: string;
  operator: string;
  zona: Zona;
  jam: string[];
  hari: string;
  tanggalData: string;
  sumber: string | null;
  durasiMenit: number;
  /** true kalau kapal menuju terminal di mural, sehingga garis ditempuh dari ujung ke pangkal. */
  menujuTerminal: boolean;
};

export type Perjalanan = {
  id: string;
  ruteId: string;
  arah: string;
  operator: string;
  zona: Zona;
  jam: string;
  berangkat: number;
  tiba: number;
  fraksi: number;
  menujuTerminal: boolean;
};

const JAM_MS = 3_600_000;
const MENIT_MS = 60_000;
const HARI_MS = 24 * JAM_MS;

/** Awal hari lokal (epoch ms UTC) dari instan yang diberikan. */
export function awalHariLokal(sekarang: number, zona: Zona): number {
  const offset = OFFSET_JAM[zona] * JAM_MS;
  return Math.floor((sekarang + offset) / HARI_MS) * HARI_MS - offset;
}

/** "14:30" pada hari lokal yang awalnya diketahui, sebagai instan. */
export function instanJam(awalHari: number, jam: string): number {
  const [h, m] = jam.split(":").map(Number);
  return awalHari + h * JAM_MS + m * MENIT_MS;
}

/** Hari dalam minggu lokal: 0 Minggu sampai 6 Sabtu. */
export const hariLokal = (awalHari: number, zona: Zona) => new Date(awalHari + OFFSET_JAM[zona] * JAM_MS).getUTCDay();

/** null berarti data hari tidak jelas, sehingga trip tidak digambar. */
export function berlakuPadaHari(hari: string, hariKe: number): boolean | null {
  const h = hari.trim().toLowerCase();
  if (h === "setiap hari") return true;
  if (h === "sab–min" || h === "sab-min") return hariKe === 0 || hariKe === 6;
  return null;
}

/** Semua perjalanan yang sedang berada di antara berangkat dan tiba pada instan `sekarang`. */
export function perjalananAktif(jadwal: BarisJadwal[], sekarang: number): Perjalanan[] {
  const hasil: Perjalanan[] = [];
  for (const b of jadwal) {
    // Hari lokal ini dan kemarin: perjalanan malam bisa melewati tengah malam.
    for (const geser of [0, -1]) {
      const awal = awalHariLokal(sekarang, b.zona) + geser * HARI_MS;
      if (berlakuPadaHari(b.hari, hariLokal(awal, b.zona)) !== true) continue;
      for (const jam of b.jam) {
        const berangkat = instanJam(awal, jam);
        const tiba = berangkat + b.durasiMenit * MENIT_MS;
        if (sekarang < berangkat || sekarang >= tiba) continue;
        hasil.push({
          id: `${b.ruteId}-${b.arah}-${jam}-${geser}`,
          ruteId: b.ruteId,
          arah: b.arah,
          operator: b.operator,
          zona: b.zona,
          jam,
          berangkat,
          tiba,
          fraksi: klem((sekarang - berangkat) / (tiba - berangkat), 0, 1),
          menujuTerminal: b.menujuTerminal,
        });
      }
    }
  }
  return hasil.sort((a, b) => a.berangkat - b.berangkat);
}

export type Keberangkatan = { arah: string; jam: string; zona: Zona; berangkat: number };

/** Keberangkatan terdekat setelah `sekarang`, untuk teks saat tidak ada kapal di jalur. */
export function berikutnya(jadwal: BarisJadwal[], sekarang: number): Keberangkatan | null {
  let terbaik: Keberangkatan | null = null;
  for (const b of jadwal) {
    for (const geser of [0, 1]) {
      const awal = awalHariLokal(sekarang, b.zona) + geser * HARI_MS;
      if (berlakuPadaHari(b.hari, hariLokal(awal, b.zona)) !== true) continue;
      for (const jam of b.jam) {
        const berangkat = instanJam(awal, jam);
        if (berangkat > sekarang && (!terbaik || berangkat < terbaik.berangkat)) {
          terbaik = { arah: b.arah, jam, zona: b.zona, berangkat };
        }
      }
    }
  }
  return terbaik;
}

/** Garis rute digambar dari terminal ke tepi mural; kapal yang pulang menempuhnya terbalik. */
export function posisiKapal(garis: Titik[], fraksi: number, menujuTerminal: boolean): Posisi {
  return sepanjangGaris(garis, menujuTerminal ? 1 - fraksi : fraksi);
}

/** Saat gerak tenang kapal melompat tiap satu menit, tidak meluncur. */
export const lompatMenit = (sekarang: number) => Math.floor(sekarang / MENIT_MS) * MENIT_MS;

export const LABEL_FERI = "posisi perkiraan, bukan AIS";
