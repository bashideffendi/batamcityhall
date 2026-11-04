import type { Lang } from "./types";

export type Currency = "IDR" | "SGD" | "MYR" | "USD";

/** Approximate IDR per 1 unit of currency (mid-2026 ballpark — rough guidance only). */
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

/** Pull the IDR figures (>= 1000) from a price string like "Rp 15.000–35.000". */
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
 * Convert an IDR price-range string to the target currency.
 * IDR returns the original string; others return e.g. "~S$3–7".
 */
export function convertPrice(priceIdr: string, currency: Currency): string {
  if (!priceIdr) return "";
  if (currency === "IDR") return priceIdr;
  const nums = idrNumbers(priceIdr);
  if (nums.length === 0) return "";
  const rate = CURRENCY_RATES[currency];
  const sym = CURRENCY_SYMBOL[currency];
  const lo = Math.min(...nums) / rate;
  const hi = Math.max(...nums) / rate;
  if (Math.abs(lo - hi) < 0.01 || nums.length === 1)
    return `~${sym}${round(hi)}`;
  return `~${sym}${round(lo)}–${round(hi)}`;
}

const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

/**
 * Best-effort "open now" check from a free-text hours string.
 * Supports "10.00–21.00", "07.00-13.00", "24 jam".
 * Returns null when it cannot be determined.
 */
export function isOpenNow(hours: string, now = new Date()): boolean | null {
  if (!hours) return null;
  const h = hours.toLowerCase();
  if (h.includes("24 jam") || h.includes("24 hours") || h.includes("24/7"))
    return true;

  const m = hours.match(/(\d{1,2})[.:](\d{2})\s*[–\-—]\s*(\d{1,2})[.:](\d{2})/);
  if (!m) return null;

  const open = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  let close = parseInt(m[3], 10) * 60 + parseInt(m[4], 10);
  const cur = now.getHours() * 60 + now.getMinutes();

  if (close <= open) {
    close += 24 * 60;
    if (cur < open) return cur + 24 * 60 < close;
    return cur < close;
  }
  return cur >= open && cur < close;
}

export function todayLabel(now = new Date(), lang: Lang = "id"): string {
  if (lang === "en") {
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][now.getDay()];
  }
  return DAY_NAMES[now.getDay()];
}

export function formatRating(rating: number | null): string {
  if (rating == null) return "—";
  return rating.toFixed(1);
}

export function formatReviews(reviews: number | null): string {
  if (reviews == null) return "";
  if (reviews >= 1000) return `${(reviews / 1000).toFixed(1)}k`;
  return String(reviews);
}

/** Human distance label, e.g. "1.2 km" or "650 m". */
export function formatKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}
