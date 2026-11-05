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

const LOCALE: Record<Lang, string> = { id: "id-ID", en: "en-GB", zh: "zh-CN" };

/** Ambil angka rupiah (>= 1000) dari teks seperti "Rp 15.000–35.000". */
function idrNumbers(priceIdr: string): number[] {
  const nums = priceIdr.replace(/\./g, "").match(/\d{4,}/g);
  return nums ? nums.map((n) => parseInt(n, 10)) : [];
}

function round(v: number, lang: Lang): string {
  if (v < 10) return v.toLocaleString(LOCALE[lang], { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  if (v < 100) return String(Math.round(v));
  return String(Math.round(v / 5) * 5);
}

/**
 * Teks harga rupiah ke mata uang tujuan. IDR dikembalikan apa adanya, lainnya mis. "~S$3—S$7".
 * "mulai Rp..." menjadi "~S$4,2+". Dua harga berbeda satuan ("Rp3.000/pc atau Rp80.000/25 pc") tidak
 * dikonversi, karena hasilnya akan terbaca sebagai rentang harga yang tidak pernah ada.
 */
export function convertPrice(priceIdr: string, currency: Currency, lang: Lang = "id"): string {
  if (!priceIdr) return "";
  if (currency === "IDR") return priceIdr;
  if (/\batau\b/i.test(priceIdr)) return "";
  const nums = idrNumbers(priceIdr);
  if (nums.length === 0) return "";
  const rate = CURRENCY_RATES[currency];
  const sym = CURRENCY_SYMBOL[currency];
  const lo = Math.min(...nums) / rate;
  const hi = Math.max(...nums) / rate;
  if (/^\s*mulai/i.test(priceIdr)) return `~${sym}${round(lo, lang)}+`;
  if (Math.abs(lo - hi) < 0.01 || nums.length === 1) return `~${sym}${round(hi, lang)}`;
  return `~${sym}${round(lo, lang)}—${sym}${round(hi, lang)}`;
}

const KATA_HARGA: Record<Lang, { mulai: string; atau: string; perBuah: string; perN: (n: string) => string; perKotak: string }> = {
  id: { mulai: "Mulai", atau: "atau", perBuah: " per buah", perN: (n) => ` per ${n} buah`, perKotak: " per kotak" },
  en: { mulai: "From", atau: "or", perBuah: " per piece", perN: (n) => ` per ${n} pieces`, perKotak: " per box" },
  zh: { mulai: "起价", atau: "或", perBuah: "/个", perN: (n) => `/${n} 个`, perKotak: "/盒" },
};

/**
 * Teks harga dari price_idr untuk dibaca (pedoman 2.6 dan 3.4): "Rp150.000—Rp350.000". Hanya bentuk tulisan
 * yang berubah. Angka dan satuannya dari data, dan tidak ada "per orang" karena data tidak menyebutnya.
 */
export function formatHarga(priceIdr: string, lang: Lang = "id"): string {
  if (!priceIdr) return "";
  const k = KATA_HARGA[lang];
  return priceIdr
    .replace(/Rp([\d.]+)\s*[–—-]\s*([\d.]+)/g, "Rp$1—Rp$2")
    .replace(/\/(\d+)\s*pc\b/g, (_, n: string) => k.perN(n))
    .replace(/\/pc\b/g, k.perBuah)
    .replace(/\/(box|kotak)\b/g, k.perKotak)
    .replace(/\batau\b/g, k.atau)
    .replace(/^mulai\b/, k.mulai);
}

const WIB_MS = 7 * 3_600_000;
const RENTANG_JAM = /(\d{1,2})[.:](\d{2})\s*[–\-—]\s*(\d{1,2})[.:](\d{2})/;
const dua = (s: string) => s.padStart(2, "0");

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

  const m = hours.match(RENTANG_JAM);
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

/**
 * Bahan kalimat jam buka (pedoman 3.11): buka sampai pukul berapa, atau buka lagi pukul berapa.
 * `jam` null berarti tidak ada jam yang bisa disebut ("24 jam"). Status tidak diketahui menjadi null.
 */
export function statusJam(hours: string, now: Date = new Date()): { buka: boolean; jam: string | null } | null {
  const buka = isOpenNow(hours, now);
  if (buka === null) return null;
  const m = hours.match(RENTANG_JAM);
  if (!m) return { buka, jam: null };
  if (!buka) return { buka, jam: `${dua(m[1])}.${m[2]}` };
  const hari = new Date(now.getTime() + WIB_MS).getUTCDay();
  const hingga = hours.match(/hingga (\d{1,2})[.:](\d{2})/);
  if (hingga && (hari === 5 || hari === 6 || hari === 0)) return { buka, jam: `${dua(hingga[1])}.${hingga[2]}` };
  return { buka, jam: `${dua(m[3])}.${m[4]}` };
}

const KATA_JAM: Record<
  Lang,
  { jam24: string; seninTutup: string; seninSabtu: string; jumatMinggu: (jam: string) => string }
> = {
  id: {
    jam24: "24 jam",
    seninTutup: "Senin tutup",
    seninSabtu: "Senin—Sabtu",
    jumatMinggu: (j) => `Jumat—Minggu sampai ${j} WIB`,
  },
  en: {
    jam24: "24 hours",
    seninTutup: "closed Monday",
    seninSabtu: "Monday—Saturday",
    jumatMinggu: (j) => `Friday—Sunday until ${j} WIB`,
  },
  zh: {
    jam24: "24 小时",
    seninTutup: "周一休息",
    seninSabtu: "周一至周六",
    jumatMinggu: (j) => `周五至周日至 ${j} WIB`,
  },
};

/** Teks jam dari data untuk dibaca: "09.30—23.00 WIB" (pedoman 2.6). Jam di data tetap apa adanya. */
export function formatJam(hours: string, lang: Lang = "id"): string {
  const teks = hours.trim();
  if (!teks) return "";
  const k = KATA_JAM[lang];
  if (/^24 jam$/i.test(teks)) return k.jam24;
  const pecah = teks.match(/^([^(]*?)\s*(?:\((.*)\))?$/);
  const utama = `${(pecah?.[1] ?? teks).replace(/\s*[–-]\s*/, "—")} WIB`;
  const ket = pecah?.[2]?.trim();
  if (!ket) return utama;
  const hingga = ket.match(/^jumat[–-]minggu hingga (\d{1,2}[.:]\d{2})$/i);
  if (/^senin tutup$/i.test(ket)) return `${utama} (${k.seninTutup})`;
  if (/^senin[–-]sabtu$/i.test(ket)) return `${utama} (${k.seninSabtu})`;
  if (hingga) return `${utama} (${k.jumatMinggu(hingga[1].replace(":", "."))})`;
  return `${utama} (${ket})`;
}

/** Jarak dengan satu angka desimal, mis. "2,8 km". */
export function formatKmDesimal(km: number, lang: Lang = "id"): string {
  return `${km.toLocaleString(LOCALE[lang], { maximumFractionDigits: 1, minimumFractionDigits: 1 })} km`;
}

/** Jarak untuk dibaca manusia, mis. "1,2 km" atau "650 m". */
export function formatKm(km: number, lang: Lang = "id"): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return formatKmDesimal(km, lang);
}

/** "2026-06" (last_verified) menjadi "Juni 2026". Bentuk lain dikembalikan apa adanya. */
export function formatBulan(tahunBulan: string, lang: Lang = "id"): string {
  const m = tahunBulan.match(/^(\d{4})-(\d{2})$/);
  if (!m) return tahunBulan;
  return new Intl.DateTimeFormat(LOCALE[lang], { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, 1)),
  );
}

/** Nomor ponsel Indonesia: +62 8xx atau 08xx. Nomor kantor (+62 778) bukan ponsel. */
export const adalahPonsel = (telepon: string) => /^(\+?62|0)[\s-]*8/.test(telepon.trim());
