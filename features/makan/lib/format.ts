import kurs from "@/data/makan/kurs.json";
import type { Lang } from "./types";

export type Currency = "IDR" | "SGD" | "MYR" | "USD";

/** Rupiah per 1 unit mata uang, dari data/makan/kurs.json. Tanggalnya tampil di Cara Memilih. */
export const CURRENCY_RATES: Record<Currency, number> = { IDR: 1, ...kurs.rupiah_per };
export const TANGGAL_KURS = kurs.tanggal;

export const CURRENCY_SYMBOL: Record<Currency, string> = {
  IDR: "Rp",
  SGD: "S$",
  MYR: "RM",
  USD: "$",
};

const LOCALE: Record<Lang, string> = { id: "id-ID", en: "en-GB", zh: "zh-CN" };

/** Ambil angka rupiah (>= 1000) dari teks seperti "Rp 15.000–35.000". */
function idrNumbers(priceIdr: string): number[] {
  const nums = priceIdr.replace(/\./g, "").match(/\d{4,}/g);
  return nums ? nums.map((n) => parseInt(n, 10)) : [];
}

/** Dibulatkan ke 0,5 di bawah 10 dan ke bilangan bulat di atasnya. Paling kecil 0,5. */
function round(v: number, lang: Lang): string {
  if (v < 10) {
    const setengah = Math.max(Math.round(v * 2) / 2, 0.5);
    return setengah.toLocaleString(LOCALE[lang], { maximumFractionDigits: 1 });
  }
  return String(Math.round(v));
}

/**
 * Perkiraan harga dalam mata uang lain, mis. "≈ S$3—5". IDR berarti tanpa perkiraan: hasilnya kosong.
 * "mulai Rp..." menjadi "≈ S$4+". Dua harga berbeda satuan ("Rp3.000/pc atau Rp80.000/25 pc") tidak
 * dikonversi, karena hasilnya akan terbaca sebagai rentang harga yang tidak pernah ada.
 */
export function convertPrice(priceIdr: string, currency: Currency, lang: Lang = "id"): string {
  if (!priceIdr || currency === "IDR") return "";
  if (/\batau\b/i.test(priceIdr)) return "";
  const nums = idrNumbers(priceIdr);
  if (nums.length === 0) return "";
  const rate = CURRENCY_RATES[currency];
  const sym = CURRENCY_SYMBOL[currency];
  const lo = round(Math.min(...nums) / rate, lang);
  const hi = round(Math.max(...nums) / rate, lang);
  if (/^\s*mulai/i.test(priceIdr)) return `≈ ${sym}${lo}+`;
  if (lo === hi || nums.length === 1) return `≈ ${sym}${hi}`;
  return `≈ ${sym}${lo}—${hi}`;
}

/**
 * Harga ringkas untuk baris dan tabel: "Rp150—350 ribu". Bentuk bersatuan ("/pc", "atau", "mulai") memakai
 * formatHarga supaya maknanya tidak berubah. Angkanya tetap dari data.
 */
export function hargaRingkas(priceIdr: string, lang: Lang = "id"): string {
  if (!priceIdr) return "";
  if (/\batau\b|\/|mulai/i.test(priceIdr)) return formatHarga(priceIdr, lang);
  const nums = idrNumbers(priceIdr);
  if (nums.length === 0 || nums.some((n) => n % 1000 !== 0)) return formatHarga(priceIdr, lang);
  const ribu = nums.map((n) => n / 1000);
  const isi = ribu.length > 1 ? `${ribu[0]}—${ribu[ribu.length - 1]}` : `${ribu[0]}`;
  return lang === "id" ? `Rp${isi} ribu` : `Rp${isi}k`;
}

/** Harga tertinggi di kisaran. Null kalau harga tidak ada atau berbeda satuan, jadi tidak ikut saringan harga. */
export function hargaTertinggi(priceIdr: string): number | null {
  if (!priceIdr || /\batau\b|\/|mulai/i.test(priceIdr)) return null;
  const nums = idrNumbers(priceIdr);
  return nums.length ? Math.max(...nums) : null;
}

/** Plus code di depan alamat tidak berguna bagi pembaca. */
export const alamatBersih = (alamat: string) => alamat.replace(/^[23456789CFGHJMPQRVWX]{4,8}\+[23456789CFGHJMPQRVWX]{2,3},?\s*/, "");

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

const satuJam = (jam: string, menit: string) => `${dua(String((Number(jam) + 1) % 24))}.${menit}`;

/** Jam buka menurut waktu Singapura, satu jam di depan WIB. Kosong kalau tidak ada rentang yang jelas. */
export function jamSgt(hours: string): string {
  const m = hours.match(RENTANG_JAM);
  return m ? `${satuJam(m[1], m[2])}—${satuJam(m[3], m[4])} SGT` : "";
}

/** Jam WIB menjadi jam SGT, mis. "22.00" menjadi "23.00". */
export function keSgt(jam: string): string {
  const [j, m] = jam.split(".");
  return satuJam(j, m);
}

const menitDari = (j: string, m: string) => Number(j) * 60 + Number(m);

/** Buka paling lambat pukul 08.00 WIB. Jam yang tidak diketahui tidak dihitung. */
export function bukaPagi(hours: string): boolean {
  const m = hours.match(RENTANG_JAM) ?? hours.trim().match(/^(\d{1,2})[.:](\d{2})$/);
  return m ? menitDari(m[1], m[2]) <= 8 * 60 : false;
}

/** Menit tutup dari tengah malam sebelumnya. Lewat tengah malam menjadi lebih dari 1440. Null kalau tidak diketahui. */
export function menitTutup(hours: string): number | null {
  if (/24 jam/i.test(hours)) return 48 * 60;
  const m = hours.match(RENTANG_JAM);
  if (!m) return null;
  const buka = menitDari(m[1], m[2]);
  const tutup = menitDari(m[3], m[4]);
  return tutup <= buka ? tutup + 24 * 60 : tutup;
}

/** Masih buka sesudah pukul 22.00 WIB. */
export function bukaLarut(hours: string): boolean {
  const t = menitTutup(hours);
  return t !== null && t > 22 * 60;
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
