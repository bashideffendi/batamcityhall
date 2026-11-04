import type { Lang } from "./types";

export type Currency = "IDR" | "SGD" | "MYR" | "USD";

/** Perkiraan rupiah per 1 unit mata uang (angka kasar pertengahan 2026, hanya panduan). */
export const CURRENCY_RATES: Record<Currency, number> = {
  IDR: 1,
  SGD: 12000,
  MYR: 3550,
  USD: 16200,
};

export const CURRENCY_SYMBOL: Record<Currency, string> = {
  IDR: "Rp",
  SGD: "S$",
  MYR: "RM",
  USD: "$",
};

export const CURRENCIES: Currency[] = ["IDR", "SGD", "MYR", "USD"];

/** Ambil angka rupiah (>= 1000) dari teks seperti "Rp 15.000–35.000". */
function idrNumbers(priceIdr: string): number[] {
  const nums = priceIdr.replace(/\./g, "").match(/\d{4,}/g);
  return nums ? nums.map((n) => parseInt(n, 10)) : [];
}

function round(v: number): string {
  if (v < 10) return v.toFixed(1);
  if (v < 100) return String(Math.round(v));
  return String(Math.round(v / 5) * 5);
}

/**
 * Teks harga rupiah ke mata uang tujuan. IDR dikembalikan apa adanya, lainnya mis. "~S$3–7".
 * "mulai Rp..." menjadi "~S$4.2+". Dua harga berbeda satuan ("Rp3.000/pc atau Rp80.000/25 pc") tidak
 * dikonversi, karena hasilnya akan terbaca sebagai rentang harga yang tidak pernah ada.
 */
export function convertPrice(priceIdr: string, currency: Currency): string {
  if (!priceIdr) return "";
  if (currency === "IDR") return priceIdr;
  if (/\batau\b/i.test(priceIdr)) return "";
  const nums = idrNumbers(priceIdr);
  if (nums.length === 0) return "";
  const rate = CURRENCY_RATES[currency];
  const sym = CURRENCY_SYMBOL[currency];
  const lo = Math.min(...nums) / rate;
  const hi = Math.max(...nums) / rate;
  if (/^\s*mulai/i.test(priceIdr)) return `~${sym}${round(lo)}+`;
  if (Math.abs(lo - hi) < 0.01 || nums.length === 1) return `~${sym}${round(hi)}`;
  return `~${sym}${round(lo)}–${round(hi)}`;
}

const WIB_MS = 7 * 3_600_000;

/**
 * Cek "buka sekarang" dari teks jam, selalu menurut WIB supaya turis dengan jam ponsel SGT/MYT tidak
 * mendapat jawaban yang geser satu jam. Mendukung "10.00–21.00", "24 jam", dan tiga keterangan yang
 * ada di data: "(Senin tutup)", "(Senin–Sabtu)", "(Jumat–Minggu hingga 20.00)". Selain itu, atau tanpa
 * jam tutup ("07.00"), hasilnya null: tidak tahu, bukan tutup.
 */
export function isOpenNow(hours: string, now: Date = new Date()): boolean | null {
  if (!hours) return null;
  const h = hours.toLowerCase();
  if (h.includes("24 jam") || h.includes("24 hours") || h.includes("24/7")) return true;

  const m = hours.match(/(\d{1,2})[.:](\d{2})\s*[–\-—]\s*(\d{1,2})[.:](\d{2})/);
  if (!m) return null;

  const wib = new Date(now.getTime() + WIB_MS);
  const hari = wib.getUTCDay(); // 0 = Minggu
  const cur = wib.getUTCHours() * 60 + wib.getUTCMinutes();
  const open = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  let close = parseInt(m[3], 10) * 60 + parseInt(m[4], 10);

  const ket = h.match(/\((.*)\)/)?.[1]?.trim();
  if (ket) {
    const hingga = ket.match(/^jumat[–-]minggu hingga (\d{1,2})[.:](\d{2})$/);
    if (ket === "senin tutup") {
      if (hari === 1) return false;
    } else if (/^senin[–-]sabtu$/.test(ket)) {
      if (hari === 0) return false;
    } else if (hingga) {
      if (hari === 5 || hari === 6 || hari === 0) close = parseInt(hingga[1], 10) * 60 + parseInt(hingga[2], 10);
    } else {
      return null;
    }
  }

  if (close <= open) {
    close += 24 * 60;
    if (cur < open) return cur + 24 * 60 < close;
    return cur < close;
  }
  return cur >= open && cur < close;
}

const LOCALE: Record<Lang, string> = { id: "id-ID", en: "en-GB", zh: "zh-CN" };

/** Jarak untuk dibaca manusia, mis. "1,2 km" atau "650 m". */
export function formatKm(km: number, lang: Lang = "id"): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toLocaleString(LOCALE[lang], { maximumFractionDigits: 1, minimumFractionDigits: 1 })} km`;
}
