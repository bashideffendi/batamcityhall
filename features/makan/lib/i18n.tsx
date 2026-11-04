"use client";

import { useCallback, useSyncExternalStore } from "react";
import { buatSimpanan } from "./simpanan";
import type { Lang, HalalStatus, RecLabel, PriceTier } from "./types";

type Tri = { id: string; en: string; zh: string };

const DICT = {
  loket: { id: "Loket 02 · Makan", en: "Counter 02 · Food", zh: "02 号窗口 · 美食" },
  nav_label: { id: "Halaman Makan", en: "Food pages", zh: "美食页面" },
  nav_home: { id: "Mulai", en: "Start", zh: "首页" },
  nav_map: { id: "Peta", en: "Map", zh: "地图" },
  nav_list: { id: "Daftar", en: "List", zh: "列表" },
  nav_cat: { id: "Kategori", en: "Categories", zh: "分类" },
  nav_trails: { id: "Jalur", en: "Trails", zh: "路线" },
  nav_saved: { id: "Tersimpan", en: "Saved", zh: "收藏" },
  nav_about: { id: "Tentang", en: "About", zh: "关于" },
  language: { id: "Bahasa", en: "Language", zh: "语言" },
  currency: { id: "Mata uang", en: "Currency", zh: "货币" },

  home_title: {
    id: "Makan enak di Batam, tanpa nyasar.",
    en: "Eat well in Batam, without getting lost.",
    zh: "在巴淡岛吃好，不迷路。",
  },
  home_lede: {
    id: "{n} tempat makan pilihan: warung lama, seafood, sup ikan, kopitiam. Gratis, tanpa iklan, tanpa listing berbayar.",
    en: "{n} hand-picked places: old warungs, seafood, fish soup, kopitiam. Free, no ads, no paid listings.",
    zh: "{n} 家精选餐饮：老店、海鲜、鱼汤、咖啡店。免费，无广告，无付费收录。",
  },
  search_label: { id: "Cari tempat makan", en: "Search food places", zh: "搜索餐饮" },
  search_ph: { id: "Cari tempat, menu, kategori", en: "Search places, dishes, categories", zh: "搜索店铺、菜品、分类" },
  search_clear: { id: "Hapus pencarian", en: "Clear search", zh: "清除搜索" },
  near_ferry: { id: "Dekat Terminal Ferry", en: "Near Ferry Terminal", zh: "渡轮码头附近" },
  near_ferry_note: {
    id: "Tempat yang terminal terdekatnya ini, dalam radius sekitar {km} km. Jarak dihitung dari perkiraan area.",
    en: "Places whose nearest terminal is this one, within about {km} km. Distance uses the approximate area.",
    zh: "以此为最近码头、约 {km} 公里内的店铺。距离按大致区域计算。",
  },
  near_me: { id: "Dekat saya", en: "Near me", zh: "我附近" },
  featured: { id: "Pilihan", en: "Picks", zh: "精选" },
  legendary: { id: "Legendaris", en: "Legendary", zh: "老字号" },
  hits: { id: "Ramai", en: "Busy", zh: "人气" },
  browse_cat: { id: "Jelajahi kategori", en: "Browse categories", zh: "浏览分类" },
  browse_cat_sub: {
    id: "{n} kategori kuliner di Batam.",
    en: "{n} categories of Batam's food.",
    zh: "巴淡岛美食 {n} 个分类。",
  },
  see_all: { id: "Lihat semua", en: "See all", zh: "查看全部" },
  view_map: { id: "Lihat peta", en: "View map", zh: "查看地图" },
  view_list: { id: "Lihat daftar", en: "View list", zh: "查看列表" },
  filters: { id: "Filter", en: "Filters", zh: "筛选" },
  filter_close: { id: "Tutup filter", en: "Close filters", zh: "关闭筛选" },
  reset: { id: "Atur ulang", en: "Reset", zh: "重置" },
  apply: { id: "Terapkan", en: "Apply", zh: "应用" },
  sort: { id: "Urutkan", en: "Sort", zh: "排序" },
  sort_featured: { id: "Pilihan", en: "Picks", zh: "精选" },
  sort_nearest_ferry: { id: "Terdekat dari ferry", en: "Nearest to ferry", zh: "距渡轮最近" },
  sort_nearby: { id: "Terdekat dari saya", en: "Nearest to me", zh: "离我最近" },
  sort_az: { id: "Nama A–Z", en: "Name A–Z", zh: "名称 A–Z" },
  category: { id: "Kategori", en: "Category", zh: "分类" },
  area: { id: "Area", en: "Area", zh: "区域" },
  price: { id: "Harga", en: "Price", zh: "价格" },
  halal_label: { id: "Status halal", en: "Halal status", zh: "清真状态" },
  ferry: { id: "Terminal ferry", en: "Ferry terminal", zh: "渡轮码头" },
  labels: { id: "Label", en: "Labels", zh: "标签" },
  results: { id: "tempat", en: "places", zh: "家" },
  no_results: {
    id: "Tidak ada tempat yang cocok. Coba longgarkan filter.",
    en: "No places match. Try loosening the filters.",
    zh: "没有符合条件的店铺。试试放宽筛选。",
  },
  open_now: { id: "Buka sekarang", en: "Open now", zh: "营业中" },
  closed_now: { id: "Tutup sekarang", en: "Closed now", zh: "已打烊" },
  hours: { id: "Jam buka", en: "Hours", zh: "营业时间" },
  hours_unknown: { id: "Jam buka belum tercatat", en: "Hours not listed", zh: "营业时间未知" },
  hours_tz: {
    id: "Status dihitung menurut WIB.",
    en: "Status follows Batam time (WIB).",
    zh: "状态按巴淡岛时间 (WIB) 计算。",
  },
  navigate: { id: "Navigasi", en: "Navigate", zh: "导航" },
  save: { id: "Simpan", en: "Save", zh: "收藏" },
  unsave: { id: "Hapus dari tersimpan", en: "Remove from saved", zh: "取消收藏" },
  share: { id: "Bagikan", en: "Share", zh: "分享" },
  share_copied: { id: "Tautan disalin.", en: "Link copied.", zh: "链接已复制。" },
  signature: { id: "Menu andalan", en: "Signature dishes", zh: "招牌菜" },
  address: { id: "Alamat", en: "Address", zh: "地址" },
  payment: { id: "Pembayaran", en: "Payment", zh: "支付方式" },
  pay_cash: { id: "Tunai", en: "Cash", zh: "现金" },
  pay_card: { id: "Kartu", en: "Card", zh: "刷卡" },
  price_unknown: { id: "Harga belum tercatat", en: "Price not listed", zh: "价格未知" },
  price_note: {
    id: "Konversi memakai kurs perkiraan pertengahan 2026, bukan kurs hari ini.",
    en: "Conversion uses an approximate mid-2026 rate, not today's.",
    zh: "外币金额按 2026 年中的约估汇率换算，并非今日汇率。",
  },
  from_ferry: { id: "dari", en: "from", zh: "距" },
  from_you: { id: "dari kamu", en: "from you", zh: "距您" },
  about_prefix: { id: "sekitar", en: "about", zh: "约" },
  locating: { id: "Mencari lokasi", en: "Locating", zh: "定位中" },
  loc_denied: {
    id: "Lokasi tidak tersedia. Izinkan akses lokasi lalu coba lagi.",
    en: "Location unavailable. Allow location access and try again.",
    zh: "无法获取位置，请允许定位权限后重试。",
  },
  detail: { id: "Lihat detail", en: "View details", zh: "查看详情" },
  show_on_map: { id: "Tampilkan di peta", en: "Show on map", zh: "在地图上显示" },
  close: { id: "Tutup", en: "Close", zh: "关闭" },
  back_list: { id: "Kembali ke daftar", en: "Back to list", zh: "返回列表" },
  back_trails: { id: "Semua jalur", en: "All trails", zh: "全部路线" },
  call: { id: "Telepon", en: "Call", zh: "致电" },
  checked: { id: "Terakhir dicek", en: "Last checked", zh: "最后核对" },
  recheck: { id: "Cek ulang sebelum berangkat.", en: "Re-check before you go.", zh: "出发前请再次确认。" },
  info_verified: { id: "Info terverifikasi", en: "Info verified", zh: "信息已核实" },

  // Kejujuran koordinat. Frasa "perkiraan area" dipakai persis di UI bahasa Indonesia.
  approx_badge: { id: "Perkiraan area", en: "Approximate area", zh: "大致区域" },
  approx_loc: {
    id: "Lokasi di peta adalah perkiraan area, bukan titik pasti tempat ini. Untuk arah, pakai tombol Navigasi.",
    en: "The map shows an approximate area, not this place's exact spot. For directions, use the Navigate button.",
    zh: "地图显示的是大致区域，并非店铺的确切位置。如需路线，请使用导航按钮。",
  },
  map_legend: {
    id: "Lingkaran berongga: perkiraan area, bukan titik pasti.",
    en: "Hollow circle: approximate area, not an exact spot.",
    zh: "空心圆：大致区域，并非确切位置。",
  },
  map_legend_ferry: {
    id: "Titik berlabel: terminal feri. Berongga kalau koordinatnya belum pasti.",
    en: "Labelled dot: ferry terminal. Hollow if its coordinates are not confirmed.",
    zh: "带标签的点：渡轮码头。坐标未确认时为空心。",
  },
  map_title: {
    id: "Peta tempat makan Batam. Semua pin adalah perkiraan area. Daftar yang sama ada di samping peta.",
    en: "Map of food places in Batam. All pins are approximate areas. The same list sits beside the map.",
    zh: "巴淡岛餐饮地图。所有标记均为大致区域。地图旁有相同的列表。",
  },
  map_mini_title: {
    id: "Peta perkiraan area tempat ini",
    en: "Map of this place's approximate area",
    zh: "此店铺大致区域的地图",
  },
  map_trail_title: { id: "Peta jalur kuliner", en: "Food trail map", zh: "美食路线地图" },
  map_failed: {
    id: "Peta gagal dimuat. Laut masih ada, kami saja yang belum.",
    en: "The map failed to load. The sea is still there, we just aren't yet.",
    zh: "地图加载失败。海还在，只是我们还没到。",
  },
  map_loading: { id: "Memuat peta", en: "Loading map", zh: "正在加载地图" },
  map_list: { id: "Daftar di peta", en: "List on the map", zh: "地图列表" },
  map_ferry_loc: { id: "Terminal feri", en: "Ferry terminal", zh: "渡轮码头" },
  coord_unsure: { id: "koordinat belum pasti", en: "coordinates unconfirmed", zh: "坐标未确认" },

  saved_title: { id: "Tempat tersimpan", en: "Saved places", zh: "我的收藏" },
  saved_empty: {
    id: "Belum ada tempat tersimpan. Tekan ikon hati untuk menyimpan.",
    en: "No saved places yet. Press the heart icon to save.",
    zh: "还没有收藏。点击爱心图标即可收藏。",
  },
  saved_local: {
    id: "Tersimpan di perangkat ini saja, tanpa akun.",
    en: "Stored on this device only, no account.",
    zh: "仅保存在此设备，无需账号。",
  },
  all_places: { id: "Semua tempat", en: "All places", zh: "所有店铺" },
  export_title: { id: "Bawa ke perangkat lain", en: "Take it to another device", zh: "带到其他设备" },
  export_sub: {
    id: "Tautan ini berisi daftar tempat tersimpanmu. Buka di perangkat lain, atau tempel di kolom impor.",
    en: "This link holds your saved list. Open it on another device, or paste it into the import box.",
    zh: "此链接包含您的收藏列表。在其他设备打开，或粘贴到导入框。",
  },
  export_label: { id: "Tautan daftar", en: "List link", zh: "列表链接" },
  copy_link: { id: "Salin tautan", en: "Copy link", zh: "复制链接" },
  import_label: {
    id: "Impor: tempel tautan atau daftar slug",
    en: "Import: paste a link or slug list",
    zh: "导入：粘贴链接或 slug 列表",
  },
  import_btn: { id: "Impor", en: "Import", zh: "导入" },
  import_done: { id: "{n} tempat ditambahkan.", en: "{n} places added.", zh: "已添加 {n} 家。" },
  import_rejected: {
    id: "{n} tidak dikenal dan dilewati.",
    en: "{n} unknown and skipped.",
    zh: "{n} 个无法识别，已跳过。",
  },
  import_none: {
    id: "Tidak ada slug yang dikenal di teks itu.",
    en: "No known slugs in that text.",
    zh: "文本中没有可识别的 slug。",
  },
  link_found: {
    id: "Tautan ini membawa {n} tempat.",
    en: "This link carries {n} places.",
    zh: "此链接包含 {n} 家店铺。",
  },
  link_add: { id: "Tambahkan ke tersimpan", en: "Add to saved", zh: "加入收藏" },

  trails: { id: "Jalur kuliner", en: "Food trails", zh: "美食路线" },
  trails_sub: {
    id: "Rute tematik kurasi. Tinggal ikuti urutannya.",
    en: "Curated themed routes. Just follow the order.",
    zh: "主题美食路线，跟着顺序走就行。",
  },
  trail_line_note: {
    id: "Garis menunjukkan urutan perhentian, bukan rute jalan. Titiknya perkiraan area.",
    en: "The line shows the order of stops, not a road route. Points are approximate areas.",
    zh: "线条表示站点顺序，并非行车路线。各点为大致区域。",
  },
  stops: { id: "perhentian", en: "stops", zh: "站" },
  stops_list: { id: "Urutan perhentian", en: "Order of stops", zh: "站点顺序" },
  duration: { id: "Durasi", en: "Duration", zh: "时长" },

  about_title: { id: "Tentang Loket Makan", en: "About the Food Counter", zh: "关于美食窗口" },
  about_lede: {
    id: "Peta kuliner saku untuk Batam, dikurasi tangan. {n} tempat, dipilih untuk warga dan untuk yang baru turun dari ferry.",
    en: "A pocket food map for Batam, hand-curated. {n} places, picked for residents and for travellers fresh off the ferry.",
    zh: "巴淡岛口袋美食地图，人工精选。{n} 家店铺，为居民和刚下渡轮的旅客挑选。",
  },
  about_promise_t: { id: "Janji kurasi", en: "Curation promise", zh: "精选承诺" },
  about_promise: {
    id: "Tanpa listing berbayar, tanpa endorse, tanpa bias iklan. Tujuannya satu: kasih tahu di mana makan enak, halal atau bukan, dan cara ke sananya.",
    en: "No paid listings, no sponsorships, no ad bias. One goal: tell you where to eat well, whether it's halal, and how to get there.",
    zh: "无付费收录，无代言，无广告偏见。只有一个目标：告诉您哪里好吃、是否清真、怎么去。",
  },
  about_labels_t: { id: "Arti label", en: "What the labels mean", zh: "标签含义" },
  about_l_wajib: { id: "Ikonik, jangan dilewatkan.", en: "Iconic, don't miss it.", zh: "标志性美食，不容错过。" },
  about_l_legend: {
    id: "Sudah puluhan tahun, teruji waktu.",
    en: "Decades old, stood the test of time.",
    zh: "数十年老店，经得起时间考验。",
  },
  about_l_hits: { id: "Lagi ramai diperbincangkan.", en: "Being talked about right now.", zh: "近期热议。" },
  about_l_gem: {
    id: "Tersembunyi tapi layak dicari.",
    en: "Tucked away but worth the hunt.",
    zh: "藏得深，但值得寻找。",
  },
  about_halal_t: { id: "Status halal", en: "Halal status", zh: "清真状态" },
  about_halal: {
    id: 'Status halal adalah kurasi best-effort, verifikasi langsung bila ragu. "Ramah Muslim" berarti umumnya aman, tetapi tempatnya bisa menyajikan menu non-halal.',
    en: 'Halal status is a best-effort curation, verify on site if unsure. "Muslim-Friendly" means generally fine, but the venue may also serve non-halal items.',
    zh: "清真状态是尽力而为的筛选，如有疑问请当面确认。“穆斯林友好”表示一般可以，但店内也可能供应非清真菜品。",
  },
  about_coord_t: { id: "Lokasi di peta", en: "Locations on the map", zh: "地图上的位置" },
  about_coord: {
    id: "{a} dari {n} tempat masih memakai perkiraan area: titik tengah area dengan sedikit geseran, bukan titik tempatnya. Tombol Navigasi mencari nama tempat di Google Maps.",
    en: "{a} of {n} places still use an approximate area: the area's centre with a small offset, not the place itself. The Navigate button searches the place's name on Google Maps.",
    zh: "{n} 家中有 {a} 家仍使用大致区域：区域中心加少量偏移，并非店铺本身。导航按钮会在 Google 地图上搜索店名。",
  },
  about_rating_t: { id: "Tanpa angka bintang", en: "No star ratings", zh: "不显示星级" },
  about_rating: {
    id: "Angka rating Google tidak ditampilkan dan tidak dipakai untuk mengurutkan. Urutan pilihan datang dari kurasi.",
    en: "Google rating numbers are not shown and not used for ordering. The picks come from curation.",
    zh: "不显示 Google 评分，也不用于排序。精选来自人工筛选。",
  },
  about_ferry_t: { id: "Terminal ferry", en: "Ferry terminals", zh: "渡轮码头" },
  about_ferry: {
    id: "Nama dan koordinat dari data feri situs ini. Rute dan jadwal bisa berubah, cek ke operator.",
    en: "Names and coordinates come from this site's ferry data. Routes and schedules change, check with the operator.",
    zh: "名称和坐标来自本站渡轮数据。航线和时刻可能变动，请向运营方确认。",
  },
  about_qris_t: { id: "QRIS lintas negara", en: "Cross-border QRIS", zh: "跨境 QRIS" },
  about_qris: {
    id: "Turis dari Singapura (OCBC, UOB, DBS menyusul) dan Malaysia (DuitNow) bisa memindai QRIS pakai aplikasi bank sendiri, tanpa tukar uang. Cari tanda QRIS di kasir.",
    en: "Travellers from Singapore (OCBC, UOB, DBS later) and Malaysia (DuitNow) can scan QRIS with their own bank app, no money changing. Look for the QRIS sign at the counter.",
    zh: "来自新加坡（OCBC、UOB，DBS 随后）和马来西亚（DuitNow）的旅客可用本国银行 App 扫描 QRIS，无需换汇。请留意收银台的 QRIS 标识。",
  },
  about_tips_t: { id: "Tips lokal", en: "Local tips", zh: "本地贴士" },
  about_tip1: {
    id: "Sup ikan dan bubur sering habis siang. Datang pagi.",
    en: "Fish soup and congee often sell out by noon. Go early.",
    zh: "鱼汤和粥常在中午前售罄，请早点去。",
  },
  about_tip2: {
    id: "Di restoran seafood, tanya harga per kg atau porsi sebelum pesan.",
    en: "At seafood spots, ask the price per kg or portion before ordering.",
    zh: "在海鲜餐厅，点菜前先问每公斤或每份的价格。",
  },
  about_tip3: {
    id: "Tiket ferry akhir pekan cepat habis. Pesan lebih awal.",
    en: "Weekend ferry tickets sell fast. Book ahead.",
    zh: "周末船票很快售罄，请提前预订。",
  },
  about_source: {
    id: "Info dikumpulkan dari Google Maps, TripAdvisor, dan sumber lokal pada pertengahan 2026. Bisa berubah, cek sebelum berangkat.",
    en: "Info gathered from Google Maps, TripAdvisor and local sources in mid-2026. Subject to change, check before you go.",
    zh: "信息收集自 Google 地图、TripAdvisor 和本地来源（2026 年中）。可能变动，出发前请确认。",
  },
  about_note: {
    id: "Dikurasi tangan dari {n} tempat. Tanpa listing berbayar, tanpa bias iklan.",
    en: "Hand-curated from {n} places. No paid listings, no ad bias.",
    zh: "从 {n} 家店铺中人工精选。无付费收录，无广告偏见。",
  },
} satisfies Record<string, Tri>;

export type KunciTeks = keyof typeof DICT;

export const HALAL_LABEL: Record<HalalStatus, Tri> = {
  halal: { id: "Halal", en: "Halal", zh: "清真" },
  "non-halal": { id: "Non-Halal", en: "Non-Halal", zh: "非清真" },
  "muslim-friendly": { id: "Ramah Muslim", en: "Muslim-Friendly", zh: "穆斯林友好" },
};

export const LABEL_LABEL: Record<RecLabel, Tri> = {
  legendaris: { id: "Legendaris", en: "Legendary", zh: "老字号" },
  hits: { id: "Ramai", en: "Busy", zh: "人气" },
  "wajib-coba": { id: "Layak dikejar", en: "Worth the trip", zh: "必吃" },
  "hidden-gem": { id: "Agak tersembunyi", en: "Off the main road", zh: "隐藏宝藏" },
};

export const PRICE_HINT: Record<PriceTier, Tri> = {
  $: { id: "Hemat", en: "Cheap", zh: "实惠" },
  $$: { id: "Sedang", en: "Mid", zh: "中等" },
  $$$: { id: "Premium", en: "Premium", zh: "高档" },
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
      for (const [k, v] of Object.entries(isi ?? {})) teks = teks.replace(`{${k}}`, String(v));
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
