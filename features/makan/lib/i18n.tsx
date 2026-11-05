"use client";

import { useCallback, useSyncExternalStore, type ReactNode } from "react";
import { buatSimpanan } from "./simpanan";
import type { Lang, HalalStatus, RecLabel, PriceTier } from "./types";

type Tri = { id: string; en: string; zh: string };

// Naskah bahasa Indonesia mengikuti docs/PEDOMAN.md 3.4 persis, bahasa Inggris mengikuti 2.10.
// `*kata*` berarti miring (lihat miring() di bawah).
const DICT = {
  loket: { id: "LOKET 02", en: "Counter 02", zh: "02 号窗口" },
  nav_label: { id: "Halaman Makan", en: "Food pages", zh: "美食页面" },
  nav_home: { id: "Beranda", en: "Home", zh: "首页" },
  nav_map: { id: "Peta", en: "Map", zh: "地图" },
  nav_list: { id: "Daftar", en: "List", zh: "列表" },
  nav_cat: { id: "Kategori", en: "Categories", zh: "分类" },
  nav_trails: { id: "Jalur", en: "Trails", zh: "路线" },
  nav_saved: { id: "Tersimpan", en: "Saved", zh: "收藏" },
  nav_about: { id: "Tentang", en: "About", zh: "关于" },
  language: { id: "Bahasa", en: "Language", zh: "语言" },
  currency: { id: "Mata uang", en: "Currency", zh: "货币" },

  home_title: { id: "Makan", en: "Food", zh: "美食" },
  home_lede: {
    id: "Loket ini memuat {n} tempat makan pilihan di Batam: *kopitiam*, makanan laut, mi, dan warung lama. Tidak ada tempat yang membayar untuk masuk daftar ini.",
    en: "This counter lists {n} selected places to eat in Batam: *kopitiam*, seafood, noodles, and old *warung*. No place pays to be on this list.",
    zh: "本窗口收录巴淡岛 {n} 家精选餐饮：咖啡店、海鲜、面食和老店。没有任何店铺付费入选。",
  },
  search_label: { id: "Cari tempat makan", en: "Search places to eat", zh: "搜索餐饮" },
  search_ph: { id: "Cari tempat, menu, atau kategori", en: "Search places, dishes, or categories", zh: "搜索店铺、菜品、分类" },
  search_clear: { id: "Hapus pencarian", en: "Clear search", zh: "清除搜索" },
  near_ferry: { id: "Dekat Terminal Feri", en: "Near the ferry terminals", zh: "渡轮码头附近" },
  near_ferry_note: {
    id: "Tempat makan dalam radius sekitar {km} km dari terminal feri.",
    en: "Places to eat within about {km} km of a ferry terminal.",
    zh: "渡轮码头约 {km} 公里范围内的餐饮。",
  },
  near_me: { id: "Dekat saya", en: "Near me", zh: "我附近" },
  featured: { id: "Pilihan", en: "Picks", zh: "精选" },
  legendary: { id: "Legendaris", en: "Legendary", zh: "老字号" },
  popular: { id: "Sedang Populer", en: "Popular now", zh: "近期热门" },
  browse_cat: { id: "Jelajahi Kategori", en: "Browse categories", zh: "浏览分类" },
  browse_cat_sub: {
    id: "Tempat makan di Batam disusun dalam {n} kategori.",
    en: "Places to eat in Batam, sorted into {n} categories.",
    zh: "巴淡岛餐饮分为 {n} 个类别。",
  },
  see_all: { id: "Lihat semua", en: "See all", zh: "查看全部" },
  view_map: { id: "Lihat peta", en: "View map", zh: "查看地图" },
  view_list: { id: "Lihat daftar", en: "View list", zh: "查看列表" },
  filters: { id: "Saring", en: "Filter", zh: "筛选" },
  filters_title: { id: "Saringan", en: "Filters", zh: "筛选" },
  filter_close: { id: "Tutup saringan", en: "Close filters", zh: "关闭筛选" },
  reset: { id: "Atur ulang", en: "Reset", zh: "重置" },
  apply: { id: "Terapkan", en: "Apply", zh: "应用" },
  sort: { id: "Urutkan", en: "Sort", zh: "排序" },
  sort_featured: { id: "Pilihan", en: "Picks", zh: "精选" },
  sort_nearest_ferry: { id: "Terdekat dari feri", en: "Nearest to a ferry terminal", zh: "距渡轮最近" },
  sort_nearby: { id: "Terdekat dari saya", en: "Nearest to me", zh: "离我最近" },
  sort_az: { id: "Nama A—Z", en: "Name A—Z", zh: "名称 A—Z" },
  category: { id: "Kategori", en: "Category", zh: "分类" },
  area: { id: "Area", en: "Area", zh: "区域" },
  price: { id: "Harga", en: "Price", zh: "价格" },
  halal_label: { id: "Status halal", en: "Halal status", zh: "清真状态" },
  ferry: { id: "Terminal feri", en: "Ferry terminal", zh: "渡轮码头" },
  labels: { id: "Label", en: "Labels", zh: "标签" },
  results: { id: "tempat", en: "places", zh: "家" },
  no_results: {
    id: "Tidak ada tempat yang cocok. Coba hapus saringan.",
    en: "No places match. Try removing a filter.",
    zh: "没有符合条件的店铺。试试取消筛选。",
  },
  no_results_q: {
    id: "Tidak ada hasil untuk “{kata}”. Coba kata lain atau hapus saringan.",
    en: "No results for “{kata}”. Try another word or remove a filter.",
    zh: "没有与“{kata}”相关的结果。试试其他关键词或取消筛选。",
  },
  open_now: { id: "Buka sekarang", en: "Open now", zh: "营业中" },
  closed_now: { id: "Tutup sekarang", en: "Closed now", zh: "已打烊" },
  open_until: { id: "Buka sekarang, sampai pukul {jam} WIB", en: "Open now, until {jam} WIB", zh: "营业中，至 {jam} WIB" },
  closed_until: {
    id: "Tutup sekarang, buka lagi pukul {jam} WIB",
    en: "Closed now, opens again at {jam} WIB",
    zh: "已打烊，{jam} WIB 再营业",
  },
  hours: { id: "Jam buka", en: "Opening hours", zh: "营业时间" },
  hours_unknown: { id: "Jam buka tidak diketahui", en: "Opening hours unknown", zh: "营业时间未知" },
  navigate: { id: "Petunjuk arah", en: "Directions", zh: "导航" },
  save: { id: "Simpan", en: "Save", zh: "收藏" },
  unsave: { id: "Hapus dari tersimpan", en: "Remove from saved", zh: "取消收藏" },
  share: { id: "Bagikan", en: "Share", zh: "分享" },
  share_copied: { id: "Tautan disalin.", en: "Link copied.", zh: "链接已复制。" },
  signature: { id: "Menu andalan", en: "Signature dishes", zh: "招牌菜" },
  address: { id: "Alamat", en: "Address", zh: "地址" },
  payment: { id: "Pembayaran", en: "Payment", zh: "支付方式" },
  pay_cash: { id: "Tunai", en: "Cash", zh: "现金" },
  pay_card: { id: "Kartu", en: "Card", zh: "刷卡" },
  price_range: { id: "Kisaran harga", en: "Price range", zh: "价格区间" },
  price_note: {
    id: "Konversi memakai kurs perkiraan pertengahan 2026, bukan kurs hari ini.",
    en: "Conversion uses an approximate mid-2026 rate, not today's.",
    zh: "外币金额按 2026 年中的约估汇率换算，并非今日汇率。",
  },
  ferry_nearest: { id: "Terminal feri terdekat", en: "Nearest ferry terminal", zh: "最近的渡轮码头" },
  ferry_distance: { id: "Sekitar {km} dari {nama}", en: "About {km} from {nama}", zh: "距 {nama} 约 {km}" },
  from_you: { id: "Sekitar {km} dari kamu", en: "About {km} from you", zh: "距您约 {km}" },
  locating: { id: "Mencari lokasi", en: "Locating", zh: "定位中" },
  loc_denied: {
    id: "Lokasi tidak tersedia. Izinkan akses lokasi lalu coba lagi.",
    en: "Location unavailable. Allow location access and try again.",
    zh: "无法获取位置，请允许定位权限后重试。",
  },
  detail: { id: "Lihat detail", en: "View details", zh: "查看详情" },
  show_on_map: { id: "Tampilkan di peta", en: "Show on map", zh: "在地图上显示" },
  close: { id: "Tutup", en: "Close", zh: "关闭" },
  breadcrumb: { id: "Remah roti", en: "Breadcrumb", zh: "导航路径" },
  crumb_root: { id: "Makan", en: "Food", zh: "美食" },
  back_trails: { id: "Semua jalur", en: "All trails", zh: "全部路线" },
  call: { id: "Telepon", en: "Call", zh: "致电" },
  checked: { id: "Data diperiksa pada {bulan}.", en: "Data checked in {bulan}.", zh: "数据核对于 {bulan}。" },
  report: { id: "Laporkan data yang salah", en: "Report incorrect data", zh: "报告错误数据" },

  // Keterangan peta kecil: teks, tautan Petunjuk arah, lalu penutup.
  approx_loc: {
    id: "Titik di peta adalah perkiraan area. Gunakan",
    en: "The point on the map is an approximate area. Use",
    zh: "地图上的点为大致区域。请使用",
  },
  approx_loc_end: { id: "untuk lokasi persisnya.", en: "for the exact location.", zh: "查看确切位置。" },
  map_legend: {
    id: "Garis putus-putus menandai lokasi perkiraan.",
    en: "A dashed ring marks an approximate location.",
    zh: "虚线圈表示大致位置。",
  },
  map_legend_ferry: {
    id: "Ikon kapal menandai terminal feri.",
    en: "A ferry icon marks a terminal.",
    zh: "渡轮图标表示码头。",
  },
  map_title: {
    id: "Peta tempat makan di Batam. Semua titik adalah perkiraan area. Daftar yang sama ada di samping peta.",
    en: "Map of places to eat in Batam. All points are approximate areas. The same list sits beside the map.",
    zh: "巴淡岛餐饮地图。所有标记均为大致区域。地图旁有相同的列表。",
  },
  map_mini_title: {
    id: "Peta perkiraan area tempat ini",
    en: "Map of this place's approximate area",
    zh: "此店铺大致区域的地图",
  },
  map_trail_title: { id: "Peta jalur kuliner", en: "Food trail map", zh: "美食路线地图" },
  map_failed: {
    id: "Peta tidak dapat dimuat. Coba muat ulang dalam beberapa saat.",
    en: "The map could not load. Try reloading in a moment.",
    zh: "地图无法加载。请稍后重新加载。",
  },
  map_loading: { id: "Memuat peta", en: "Loading map", zh: "正在加载地图" },
  map_list: { id: "Daftar di peta", en: "List on the map", zh: "地图列表" },
  map_ferry_loc: { id: "Terminal feri", en: "Ferry terminal", zh: "渡轮码头" },

  saved_title: { id: "Tempat Tersimpan", en: "Saved places", zh: "我的收藏" },
  saved_empty: {
    id: "Belum ada tempat tersimpan. Tekan Simpan di halaman tempat makan untuk menyimpannya.",
    en: "No saved places yet. Press Save on a place's page to save it.",
    zh: "还没有收藏。在店铺页面点击“收藏”即可保存。",
  },
  saved_local: {
    id: "Daftar ini hanya tersimpan di peramban perangkat ini.",
    en: "This list is stored only in this device's browser.",
    zh: "此列表仅保存在本设备的浏览器中。",
  },
  all_places: { id: "Semua tempat", en: "All places", zh: "所有店铺" },
  all_places_title: { id: "Semua Tempat", en: "All places", zh: "所有店铺" },
  export_title: { id: "Pindahkan ke Perangkat Lain", en: "Move to another device", zh: "转移到其他设备" },
  export_sub: {
    id: "Salin tautan berikut, lalu buka di perangkat lain.",
    en: "Copy this link, then open it on another device.",
    zh: "复制以下链接，然后在其他设备上打开。",
  },
  export_label: { id: "Tautan daftar", en: "List link", zh: "列表链接" },
  copy_link: { id: "Salin tautan", en: "Copy link", zh: "复制链接" },
  import_label: { id: "Tautan dari perangkat lain", en: "Link from another device", zh: "来自其他设备的链接" },
  import_btn: { id: "Tempel tautan", en: "Paste link", zh: "粘贴链接" },
  import_done: { id: "Ditambahkan {n} tempat.", en: "Added {n} places.", zh: "已添加 {n} 家。" },
  import_rejected: {
    id: "Sebanyak {n} tempat tidak dikenal dan dilewati.",
    en: "Skipped {n} unknown places.",
    zh: "{n} 家无法识别，已跳过。",
  },
  import_none: {
    id: "Tidak ada tempat yang dikenal di tautan itu.",
    en: "No known places in that link.",
    zh: "该链接中没有可识别的店铺。",
  },
  link_found: {
    id: "Tautan ini berisi {n} tempat.",
    en: "This link holds {n} places.",
    zh: "此链接包含 {n} 家店铺。",
  },
  link_add: { id: "Tambahkan ke tersimpan", en: "Add to saved", zh: "加入收藏" },

  trails: { id: "Jalur Kuliner", en: "Food trails", zh: "美食路线" },
  trails_sub: {
    id: "Jalur kuliner adalah rute makan bertema yang bisa diikuti dalam setengah hari atau sehari.",
    en: "Food trails are themed eating routes you can follow in half a day or a day.",
    zh: "美食路线是可在半天或一天内走完的主题用餐路线。",
  },
  trail_line_note: {
    id: "Garis menunjukkan urutan perhentian, bukan rute jalan. Titiknya perkiraan area.",
    en: "The line shows the order of stops, not a road route. Points are approximate areas.",
    zh: "线条表示站点顺序，并非行车路线。各点为大致区域。",
  },
  stops: { id: "perhentian", en: "stops", zh: "站" },
  stops_list: { id: "Urutan Perhentian", en: "Order of stops", zh: "站点顺序" },
  duration: { id: "Durasi", en: "Duration", zh: "时长" },

  about_title: { id: "Tentang Loket Makan", en: "About the food counter", zh: "关于美食窗口" },
  about_choose_t: { id: "Cara Memilih", en: "How places are chosen", zh: "挑选方式" },
  about_choose: {
    id: "Tempat dipilih dan dikunjungi oleh penyusun. Tidak ada tempat yang membayar untuk masuk daftar ini, dan urutan tidak dapat dibeli.",
    en: "Places are chosen and visited by the compilers. No place pays to be on this list, and the order cannot be bought.",
    zh: "店铺由编者挑选并实地到访。没有店铺付费入选，排序也不能购买。",
  },
  about_labels_t: { id: "Arti Label", en: "What the labels mean", zh: "标签含义" },
  about_l_legend: {
    id: "sudah buka puluhan tahun dan tetap ramai.",
    en: "open for decades and still busy.",
    zh: "开业数十年，至今依然热闹。",
  },
  about_l_kurator: { id: "tempat yang paling kami sarankan.", en: "the places we recommend most.", zh: "我们最推荐的店铺。" },
  about_l_populer: { id: "banyak dibicarakan belakangan ini.", en: "much talked about lately.", zh: "近期讨论较多。" },
  about_l_jarang: { id: "bagus, tetapi tidak mudah ditemukan.", en: "good, but not easy to find.", zh: "不错，但不容易找到。" },
  about_halal_t: { id: "Status Halal", en: "Halal status", zh: "清真状态" },
  about_halal: {
    id: "Status halal adalah hasil kurasi, bukan sertifikasi. Ramah muslim berarti tempat ini umumnya dapat dikunjungi muslim, tetapi juga dapat menyajikan menu nonhalal. Bila ragu, tanyakan langsung kepada pengelolanya.",
    en: "Halal status is the result of curation, not certification. Muslim-friendly means Muslims can generally visit, but the place may also serve non-halal dishes. If unsure, ask the management directly.",
    zh: "清真状态是筛选结果，并非认证。“穆斯林友好”表示穆斯林一般可以前往，但店内也可能供应非清真菜品。如有疑问，请直接询问店家。",
  },
  about_coord_t: { id: "Lokasi di Peta", en: "Locations on the map", zh: "地图上的位置" },
  about_coord: {
    id: "Titik di peta menunjukkan perkiraan area. Gunakan tombol Petunjuk arah untuk lokasi yang tepat.",
    en: "Points on the map show an approximate area. Use the Directions button for the exact location.",
    zh: "地图上的点表示大致区域。如需确切位置，请使用导航按钮。",
  },
  about_rating_t: { id: "Tanpa Penilaian Bintang", en: "No star ratings", zh: "不显示星级" },
  about_rating: {
    id: "Situs ini tidak menampilkan penilaian bintang. Urutan tempat disusun berdasarkan kurasi.",
    en: "This site does not show star ratings. Places are ordered by curation.",
    zh: "本站不显示星级评分。店铺排序依据人工筛选。",
  },
  about_qris_t: { id: "QRIS Lintas Negara", en: "Cross-border QRIS", zh: "跨境 QRIS" },
  about_qris: {
    id: "Turis dari Singapura (OCBC, UOB, DBS menyusul) dan Malaysia (DuitNow) dapat memindai QRIS dengan aplikasi bank sendiri, tanpa menukar uang. Cari tanda QRIS di kasir.",
    en: "Travellers from Singapore (OCBC, UOB, DBS later) and Malaysia (DuitNow) can scan QRIS with their own bank app, with no money changing. Look for the QRIS sign at the counter.",
    zh: "来自新加坡（OCBC、UOB，DBS 随后）和马来西亚（DuitNow）的旅客可用本国银行 App 扫描 QRIS，无需换汇。请留意收银台的 QRIS 标识。",
  },
  about_tips_t: { id: "Kiat Makan di Batam", en: "Local tips", zh: "本地贴士" },
  about_tip1: {
    id: "Sup ikan dan bubur sering habis pada siang hari. Datanglah pagi.",
    en: "Fish soup and congee often sell out by noon. Go early.",
    zh: "鱼汤和粥常在中午前售罄，请早点去。",
  },
  about_tip2: {
    id: "Di restoran makanan laut, tanyakan harga per kg atau per porsi sebelum memesan.",
    en: "At seafood restaurants, ask the price per kg or per portion before ordering.",
    zh: "在海鲜餐厅，点菜前先问每公斤或每份的价格。",
  },
  about_tip3: {
    id: "Tiket feri akhir pekan cepat habis. Pesan lebih awal.",
    en: "Weekend ferry tickets sell fast. Book ahead.",
    zh: "周末船票很快售罄，请提前预订。",
  },
} satisfies Record<string, Tri>;

export type KunciTeks = keyof typeof DICT;

export const HALAL_LABEL: Record<HalalStatus, Tri> = {
  halal: { id: "Halal", en: "Halal", zh: "清真" },
  "non-halal": { id: "Nonhalal", en: "Non-halal", zh: "非清真" },
  "muslim-friendly": { id: "Ramah muslim", en: "Muslim-friendly", zh: "穆斯林友好" },
};

// Kode data lama tetap dipakai sebagai kunci. Yang tampil hanya nama label di pedoman 3.4.
export const LABEL_LABEL: Record<RecLabel, Tri> = {
  legendaris: { id: "Legendaris", en: "Legendary", zh: "老字号" },
  "wajib-coba": { id: "Pilihan kurator", en: "Curator's pick", zh: "编者精选" },
  hits: { id: "Sedang populer", en: "Popular now", zh: "近期热门" },
  "hidden-gem": { id: "Jarang diketahui", en: "Little known", zh: "鲜为人知" },
};

// Hanya untuk tombol saringan. Di kartu dan detail, harga selalu berupa kisaran dari price_idr.
export const PRICE_HINT: Record<PriceTier, Tri> = {
  $: { id: "Harga rendah", en: "Lower price", zh: "较低价位" },
  $$: { id: "Harga menengah", en: "Mid price", zh: "中等价位" },
  $$$: { id: "Harga tinggi", en: "Higher price", zh: "较高价位" },
};

export const LANGS: { code: Lang; label: string; nama: string }[] = [
  { code: "id", label: "ID", nama: "Bahasa Indonesia" },
  { code: "en", label: "EN", nama: "English" },
  { code: "zh", label: "中", nama: "中文" },
];

const bacaBahasa = (m: string | null): Lang => {
  if (m === "id" || m === "en" || m === "zh") return m;
  // Sasaran Makan termasuk turis SG/MY: tanpa pilihan tersimpan, ikut bahasa browser.
  const nl = navigator.language?.toLowerCase() ?? "id";
  return nl.startsWith("id") ? "id" : nl.startsWith("zh") ? "zh" : "en";
};

const simpanan = buatSimpanan<Lang>("bch-makan-bahasa", "id", bacaBahasa, (v) => v);

export function useI18n() {
  const lang = useSyncExternalStore(simpanan.langgan, simpanan.ambil, simpanan.ambilServer);
  const t = useCallback(
    (key: KunciTeks, isi?: Record<string, string | number>) => {
      let teks: string = DICT[key][lang];
      for (const [k, v] of Object.entries(isi ?? {})) teks = teks.replace(`{${k}}`, () => String(v));
      return teks;
    },
    [lang],
  );
  return { lang, setLang: simpanan.simpan, t };
}

/** Nilai atribut lang untuk konten Makan. */
export const htmlLang = (lang: Lang) => (lang === "zh" ? "zh-Hans" : lang);

/** Nama kategori sesuai bahasa. */
export function catName(lang: Lang, c?: { name_id: string; name_en: string; name_zh: string }): string {
  if (!c) return "";
  return lang === "id" ? c.name_id : lang === "zh" ? c.name_zh : c.name_en;
}

/** Deskripsi tempat sesuai bahasa. zh jatuh ke en kalau belum diterjemahkan. */
export function placeDesc(lang: Lang, p: { desc_id: string; desc_en: string; desc_zh?: string }): string {
  if (lang === "id") return p.desc_id;
  if (lang === "zh") return p.desc_zh || p.desc_en;
  return p.desc_en;
}

/** Tanda & di nama terminal dari data situs ditulis dengan kata (pedoman 2.7). */
export function namaTerminal(lang: Lang, nama: string): string {
  return lang === "zh" ? nama : nama.replace(/\s*&\s*/g, lang === "id" ? " dan " : " and ");
}

const POLA_MIRING = /\*([^*]+)\*|\b(kopitiam|dim sum)\b/gi;

/** Kata asing di dalam kalimat dimiringkan (pedoman 2.4): `*kata*` di naskah, dan kata yang dikenal di teks data. */
export function miring(teks: string): ReactNode[] {
  const hasil: ReactNode[] = [];
  let awal = 0;
  for (const m of teks.matchAll(POLA_MIRING)) {
    hasil.push(teks.slice(awal, m.index));
    hasil.push(<em key={m.index}>{m[1] ?? m[2]}</em>);
    awal = m.index + m[0].length;
  }
  hasil.push(teks.slice(awal));
  return hasil;
}
