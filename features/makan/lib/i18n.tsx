"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Lang, HalalStatus, RecLabel, PriceTier } from "./types";

type Tri = { id: string; en: string; zh: string };
type Dict = Record<string, Tri>;

const DICT: Dict = {
  app_name: { id: "Batam Bites", en: "Batam Bites", zh: "Batam Bites" },
  tagline: {
    id: "Peta kuliner saku untuk Batam",
    en: "Your pocket food map for Batam",
    zh: "您的巴淡岛美食地图",
  },
  nav_home: { id: "Beranda", en: "Home", zh: "首页" },
  nav_map: { id: "Peta", en: "Map", zh: "地图" },
  nav_list: { id: "Daftar", en: "List", zh: "列表" },
  nav_cat: { id: "Kategori", en: "Categories", zh: "分类" },
  nav_saved: { id: "Tersimpan", en: "Saved", zh: "收藏" },
  nav_about: { id: "Tentang", en: "About", zh: "关于" },

  search_ph: {
    id: "Cari tempat, menu, kategori…",
    en: "Search places, dishes, categories…",
    zh: "搜索店铺、菜品、分类…",
  },
  near_ferry: { id: "Dekat Terminal Ferry", en: "Near Ferry Terminal", zh: "渡轮码头附近" },
  near_me: { id: "Dekat Saya", en: "Near Me", zh: "我附近" },
  must_try: { id: "Wajib Coba", en: "Must Try", zh: "必吃" },
  legendary: { id: "Legendaris Batam", en: "Batam Legends", zh: "巴淡岛老字号" },
  hits: { id: "Hits & Viral", en: "Trending & Viral", zh: "人气 & 网红" },
  browse_cat: { id: "Jelajahi Kategori", en: "Browse Categories", zh: "浏览分类" },
  see_all: { id: "Lihat semua", en: "See all", zh: "查看全部" },
  view_map: { id: "Lihat Peta", en: "View Map", zh: "查看地图" },
  view_list: { id: "Lihat Daftar", en: "View List", zh: "查看列表" },
  filters: { id: "Filter", en: "Filters", zh: "筛选" },
  reset: { id: "Atur ulang", en: "Reset", zh: "重置" },
  apply: { id: "Terapkan", en: "Apply", zh: "应用" },
  sort: { id: "Urutkan", en: "Sort", zh: "排序" },
  sort_featured: { id: "Pilihan", en: "Featured", zh: "精选" },
  sort_rating: { id: "Rating tertinggi", en: "Top rated", zh: "评分最高" },
  sort_nearest_ferry: { id: "Terdekat dari ferry", en: "Nearest to ferry", zh: "距渡轮最近" },
  sort_nearby: { id: "Terdekat dari saya", en: "Nearest to me", zh: "离我最近" },
  sort_az: { id: "Nama A–Z", en: "Name A–Z", zh: "名称 A–Z" },
  category: { id: "Kategori", en: "Category", zh: "分类" },
  area: { id: "Area / Kecamatan", en: "Area / District", zh: "区域" },
  price: { id: "Harga", en: "Price", zh: "价格" },
  halal_label: { id: "Status Halal", en: "Halal Status", zh: "清真状态" },
  ferry: { id: "Terminal Ferry", en: "Ferry Terminal", zh: "渡轮码头" },
  labels: { id: "Label", en: "Labels", zh: "标签" },
  results: { id: "tempat", en: "places", zh: "家" },
  no_results: {
    id: "Tidak ada tempat yang cocok. Coba longgarkan filter.",
    en: "No places match. Try loosening the filters.",
    zh: "没有符合条件的店铺。试试放宽筛选。",
  },
  open_now: { id: "Buka sekarang", en: "Open now", zh: "营业中" },
  closed_now: { id: "Tutup sekarang", en: "Closed now", zh: "已打烊" },
  hours_unknown: { id: "Jam buka tidak tersedia", en: "Hours not listed", zh: "营业时间未知" },
  navigate: { id: "Navigasi", en: "Navigate", zh: "导航" },
  save: { id: "Simpan", en: "Save", zh: "收藏" },
  saved: { id: "Tersimpan", en: "Saved", zh: "已收藏" },
  share: { id: "Bagikan", en: "Share", zh: "分享" },
  signature: { id: "Menu Andalan", en: "Signature Dishes", zh: "招牌菜" },
  address: { id: "Alamat", en: "Address", zh: "地址" },
  payment: { id: "Pembayaran", en: "Payment", zh: "支付方式" },
  from_ferry: { id: "dari", en: "from", zh: "距" },
  from_you: { id: "dari kamu", en: "from you", zh: "距您" },
  locating: { id: "Mencari lokasi…", en: "Locating…", zh: "定位中…" },
  loc_denied: {
    id: "Lokasi tidak tersedia. Izinkan akses lokasi.",
    en: "Location unavailable. Allow location access.",
    zh: "无法获取位置，请允许定位权限。",
  },
  detail: { id: "Lihat detail", en: "View details", zh: "查看详情" },
  about_title: { id: "Tentang Batam Bites", en: "About Batam Bites", zh: "关于 Batam Bites" },
  saved_empty: {
    id: "Belum ada tempat tersimpan. Tap ikon hati untuk menyimpan.",
    en: "No saved places yet. Tap the heart icon to save.",
    zh: "还没有收藏。点击爱心图标即可收藏。",
  },
  saved_title: { id: "Tempat Tersimpan", en: "Saved Places", zh: "我的收藏" },
  reviews: { id: "ulasan", en: "reviews", zh: "条评价" },
  all_places: { id: "Semua Tempat", en: "All Places", zh: "所有店铺" },
  trails: { id: "Food Trail", en: "Food Trails", zh: "美食路线" },
  trails_sub: {
    id: "Rute kuliner tematik kurasi",
    en: "Curated themed food routes",
    zh: "精选主题美食路线",
  },
  stops: { id: "perhentian", en: "stops", zh: "站" },
  duration: { id: "Durasi", en: "Duration", zh: "时长" },
  price_note: {
    id: "Estimasi mata uang berdasar kurs perkiraan.",
    en: "Currency estimate uses an approximate rate.",
    zh: "外币金额按约估汇率换算。",
  },
};

export const HALAL_LABEL: Record<HalalStatus, Tri> = {
  halal: { id: "Halal", en: "Halal", zh: "清真" },
  "non-halal": { id: "Non-Halal", en: "Non-Halal", zh: "非清真" },
  "muslim-friendly": { id: "Ramah Muslim", en: "Muslim-Friendly", zh: "穆斯林友好" },
};

export const LABEL_LABEL: Record<RecLabel, Tri> = {
  legendaris: { id: "Legendaris", en: "Legendary", zh: "老字号" },
  hits: { id: "Hits", en: "Trending", zh: "人气" },
  "wajib-coba": { id: "Wajib Coba", en: "Must Try", zh: "必吃" },
  "hidden-gem": { id: "Hidden Gem", en: "Hidden Gem", zh: "隐藏宝藏" },
};

export const PRICE_HINT: Record<PriceTier, Tri> = {
  $: { id: "Hemat", en: "Cheap", zh: "实惠" },
  $$: { id: "Sedang", en: "Mid", zh: "中等" },
  $$$: { id: "Premium", en: "Premium", zh: "高档" },
};

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof DICT) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("id");

  useEffect(() => {
    const stored = localStorage.getItem("bb_lang") as Lang | null;
    if (stored === "id" || stored === "en" || stored === "zh") {
      setLangState(stored);
    } else if (typeof navigator !== "undefined" && navigator.language) {
      const nl = navigator.language.toLowerCase();
      setLangState(nl.startsWith("id") ? "id" : nl.startsWith("zh") ? "zh" : "en");
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("bb_lang", l);
  };

  const t = (key: keyof typeof DICT) => DICT[key]?.[lang] ?? String(key);

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

/** Pick a bilingual/trilingual pair by current lang (falls back to en). */
export function pick(lang: Lang, pair: Partial<Tri> & { en: string }): string {
  return pair[lang] ?? pair.en;
}

/** Localised category name (falls back to en). */
export function catName(
  lang: Lang,
  c?: { name_id: string; name_en: string; name_zh: string },
): string {
  if (!c) return "";
  return lang === "id" ? c.name_id : lang === "zh" ? c.name_zh : c.name_en;
}

/** Localised place description (zh falls back to en when not translated). */
export function placeDesc(
  lang: Lang,
  p: { desc_id: string; desc_en: string; desc_zh?: string },
): string {
  if (lang === "id") return p.desc_id;
  if (lang === "zh") return p.desc_zh || p.desc_en;
  return p.desc_en;
}
