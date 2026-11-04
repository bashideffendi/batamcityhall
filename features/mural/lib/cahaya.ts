// Siang, senja, malam dari posisi matahari di koordinat Batam, bukan dari jam tetap (research/02).
import { getPosition } from "suncalc";

export const LAT_BATAM = 1.1;
export const LNG_BATAM = 104.0;

export type Fase = "siang" | "senja" | "malam";
export type Cahaya = { fase: Fase; label: string; ketinggian: number };

/** Batas senja: matahari di antara 6 derajat di atas dan 6 derajat di bawah cakrawala. */
const BATAS_DERAJAT = 6;

const jamWibAngka = (saat: Date) => (saat.getTime() / 3_600_000 + 7) % 24;

export function cahayaBatam(saat: Date): Cahaya {
  // suncalc 2 mengembalikan ketinggian dalam derajat, sudah dikoreksi refraksi.
  const ketinggian = getPosition(saat, LAT_BATAM, LNG_BATAM).altitude;
  if (ketinggian > BATAS_DERAJAT) return { fase: "siang", label: "Siang", ketinggian };
  if (ketinggian < -BATAS_DERAJAT) return { fase: "malam", label: "Malam", ketinggian };
  return { fase: "senja", label: jamWibAngka(saat) < 12 ? "Fajar" : "Senja", ketinggian };
}

const FORMAT_WIB = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** "18.05 WIB" */
export const jamWib = (saat: Date) => `${FORMAT_WIB.format(saat).replace(":", ".")} WIB`;
