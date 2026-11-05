"use client";

import { KATA_TUGAS_EN, kaidahJudul } from "@/lib/judul";
import { useCallback, useSyncExternalStore, type ReactNode } from "react";
import { buatSimpanan } from "./simpanan";
import type { Lang, HalalStatus, RecLabel, PriceTier } from "./types";

type Tri = { id: string; en: string; zh: string };

// Naskah singkat atas koreksi pemilik (PEDOMAN, koreksi 6 November 2026). Satu gagasan, kata seperlunya.
// `*kata*` berarti miring (lihat miring() di bawah). Bahasa Inggris mengikuti pedoman 2.10.
const DICT = {
  nav_label: { id: "Halaman Makan", en: "Food pages", zh: "美食页面" },
  nav_home: { id: "Makan", en: "Eat", zh: "美食" },
  nav_dish: { id: "Hidangan", en: "Dishes", zh: "菜品" },
  nav_area: { id: "Kawasan", en: "Areas", zh: "区域" },
  nav_guides: { id: "Panduan", en: "Guides", zh: "指南" },
  nav_ferry: { id: "Dekat Feri", en: "Near the Ferry", zh: "码头附近" },
  nav_map: { id: "Peta", en: "Map", zh: "地图" },
  nav_saved: { id: "Simpanan", en: "Saved", zh: "收藏" },
  language: { id: "Bahasa", en: "Language", zh: "语言" },
  currency: { id: "Perkiraan harga", en: "Price estimate", zh: "价格换算" },
  rupiah_only: { id: "Rp saja", en: "Rp only", zh: "仅 Rp" },

  home_title: { id: "Makan", en: "Eat", zh: "美食" },
  home_data: {
    id: "{n} tempat · {h} hidangan · {k} kawasan",
    en: "{n} places · {h} dishes · {k} areas",
    zh: "{n} 家 · {h} 类 · {k} 区",
  },
  home_dek: {
    id: "Tidak ada yang membayar untuk masuk daftar ini.",
    en: "No one pays to be on this list.",
    zh: "没有任何店铺付费入选。",
  },
  cover_kicker: { id: "Panduan pilihan", en: "Featured guide", zh: "精选指南" },
  idx_title: { id: "Mau Makan Apa?", en: "What to Eat", zh: "想吃什么" },
  idx_all: { id: "Semua Tempat", en: "All Places", zh: "所有店铺" },
  near_title: { id: "Sebelum Feri Pulang", en: "Before the Ferry Home", zh: "回程前" },
  near_dek: {
    id: "Tempat terdekat dari terminal, dalam radius {km} km.",
    en: "Closest to the terminal, within {km} km.",
    zh: "距码头最近，{km} 公里内。",
  },
  near_terminal: { id: "Pilih terminal", en: "Choose a terminal", zh: "选择码头" },
  near_all: { id: "Semua dekat {nama}", en: "All near {nama}", zh: "{nama} 附近全部" },
  guides_title: { id: "Panduan", en: "Guides", zh: "指南" },
  guides_all: { id: "Semua panduan", en: "All guides", zh: "全部指南" },
  areas_title: { id: "Kawasan", en: "Areas", zh: "区域" },
  map_title_home: { id: "Peta", en: "Map", zh: "地图" },
  map_open: { id: "Buka peta", en: "Open the map", zh: "打开地图" },
  legend_title: { id: "Legendaris", en: "Legendary", zh: "老字号" },
  rare_title: { id: "Jarang Diketahui", en: "Little Known", zh: "鲜为人知" },
  random: { id: "Satu tempat acak", en: "A random place", zh: "随机一家" },
  trust: { id: "Tidak ada tempat yang membayar.", en: "No place pays.", zh: "没有店铺付费。" },
  how: { id: "Cara Kami Memilih", en: "How We Choose", zh: "我们如何挑选" },
  fix: { id: "Kirim koreksi", en: "Suggest a correction", zh: "提交更正" },

  search_label: { id: "Cari tempat makan", en: "Search places to eat", zh: "搜索餐饮" },
  search_ph: { id: "Cari tempat atau menu", en: "Search places or dishes", zh: "搜索店铺或菜品" },
  search_clear: { id: "Hapus pencarian", en: "Clear search", zh: "清除搜索" },
  see_all: { id: "Lihat semua", en: "See all", zh: "查看全部" },
  filters: { id: "Saring", en: "Filter", zh: "筛选" },
  filters_title: { id: "Saringan", en: "Filters", zh: "筛选" },
  filter_close: { id: "Tutup saringan", en: "Close filters", zh: "关闭筛选" },
  reset: { id: "Hapus saringan", en: "Clear filters", zh: "清除筛选" },
  apply: { id: "Tampilkan {n} tempat", en: "Show {n} places", zh: "显示 {n} 家" },
  sort: { id: "Urutkan", en: "Sort", zh: "排序" },
  sort_featured: { id: "Pilihan", en: "Picks", zh: "精选" },
  sort_nearest_ferry: { id: "Terdekat dari feri", en: "Nearest to the ferry", zh: "距码头最近" },
  sort_nearby: { id: "Terdekat dari saya", en: "Nearest to me", zh: "离我最近" },
  sort_late: { id: "Buka paling larut", en: "Open latest", zh: "营业最晚" },
  sort_price: { id: "Harga terendah", en: "Lowest price", zh: "价格最低" },
  sort_az: { id: "Nama A—Z", en: "Name A—Z", zh: "名称 A—Z" },
  category: { id: "Hidangan", en: "Dish", zh: "菜品" },
  area: { id: "Kawasan", en: "Area", zh: "区域" },
  price: { id: "Harga", en: "Price", zh: "价格" },
  halal_label: { id: "Status halal", en: "Halal status", zh: "清真状态" },
  ferry: { id: "Terminal feri", en: "Ferry terminal", zh: "渡轮码头" },
  labels: { id: "Label", en: "Label", zh: "标签" },
  time: { id: "Waktu", en: "Time", zh: "时段" },
  breakfast: { id: "Sarapan", en: "Breakfast", zh: "早餐" },
  late: { id: "Lewat 22.00", en: "After 10 p.m.", zh: "晚上十点后" },
  cheap: { id: "Di bawah Rp50 ribu", en: "Under Rp50k", zh: "五万盾以内" },
  near_me: { id: "Dekat saya", en: "Near me", zh: "我附近" },
  locating: { id: "Mencari lokasi", en: "Locating", zh: "定位中" },
  loc_denied: {
    id: "Lokasi tidak tersedia. Izinkan akses lokasi, lalu coba lagi.",
    en: "Location unavailable. Allow access and try again.",
    zh: "无法获取位置，请允许定位后重试。",
  },
  results: { id: "tempat", en: "places", zh: "家" },
  no_results: {
    id: "Tidak ada yang cocok. Coba hapus saringan.",
    en: "Nothing matches. Try clearing a filter.",
    zh: "没有符合条件的店铺。试试取消筛选。",
  },
  no_results_q: {
    id: "Tidak ada hasil untuk “{kata}”. Coba kata lain atau hapus saringan.",
    en: "No results for “{kata}”. Try another word or clear a filter.",
    zh: "没有与“{kata}”相关的结果。试试其他关键词或取消筛选。",
  },

  open_now: { id: "Buka sekarang", en: "Open now", zh: "营业中" },
  closed_now: { id: "Tutup sekarang", en: "Closed now", zh: "已打烊" },
  open_until: { id: "Buka sampai {jam} WIB", en: "Open until {jam} WIB", zh: "营业至 {jam} WIB" },
  closed_until: { id: "Tutup, buka {jam} WIB", en: "Closed, opens {jam} WIB", zh: "已打烊，{jam} WIB 开门" },
  open_until_sgt: { id: "Buka sampai {jam} WIB ({sgt} SGT)", en: "Open until {jam} WIB ({sgt} SGT)", zh: "营业至 {jam} WIB（{sgt} SGT）" },
  closed_until_sgt: { id: "Tutup, buka {jam} WIB ({sgt} SGT)", en: "Closed, opens {jam} WIB ({sgt} SGT)", zh: "已打烊，{jam} WIB（{sgt} SGT）开门" },
  hours: { id: "Jam buka", en: "Hours", zh: "营业时间" },
  hours_unknown: { id: "Tidak diketahui", en: "Unknown", zh: "未知" },
  navigate: { id: "Petunjuk arah", en: "Directions", zh: "导航" },
  save: { id: "Simpan", en: "Save", zh: "收藏" },
  saved_on: { id: "Tersimpan", en: "Saved", zh: "已收藏" },
  unsave: { id: "Hapus dari simpanan", en: "Remove from saved", zh: "取消收藏" },
  share: { id: "Bagikan", en: "Share", zh: "分享" },
  share_copied: { id: "Tautan disalin.", en: "Link copied.", zh: "链接已复制。" },
  signature: { id: "Menu Andalan", en: "Signature Dishes", zh: "招牌菜" },
  facts: { id: "Fakta", en: "Facts", zh: "基本信息" },
  address: { id: "Alamat", en: "Address", zh: "地址" },
  payment: { id: "Pembayaran", en: "Payment", zh: "支付方式" },
  pay_cash: { id: "Tunai", en: "Cash", zh: "现金" },
  pay_card: { id: "Kartu", en: "Card", zh: "刷卡" },
  price_range: { id: "Kisaran harga", en: "Price range", zh: "价格区间" },
  ferry_nearest: { id: "Feri terdekat", en: "Nearest ferry", zh: "最近码头" },
  ferry_distance: { id: "Sekitar {km} ke {nama}", en: "About {km} to {nama}", zh: "距 {nama} 约 {km}" },
  ferry_short: { id: "{km} ke {nama}", en: "{km} to {nama}", zh: "距 {nama} {km}" },
  from_you: { id: "{km} dari kamu", en: "{km} from you", zh: "距您 {km}" },
  call: { id: "Telepon", en: "Phone", zh: "电话" },
  what_means: { id: "Artinya", en: "What this means", zh: "含义" },
  data_as_of: { id: "Data per {bulan}", en: "Data as of {bulan}", zh: "数据截至 {bulan}" },
  near_here: { id: "Di Dekat Sini", en: "Nearby", zh: "附近" },
  in_guides: { id: "Juga di Panduan", en: "Also in these guides", zh: "也收录于" },
  show_on_map: { id: "Tampilkan di peta", en: "Show on map", zh: "在地图上显示" },
  detail: { id: "Lihat detail", en: "View details", zh: "查看详情" },
  close: { id: "Tutup", en: "Close", zh: "关闭" },
  breadcrumb: { id: "Remah roti", en: "Breadcrumb", zh: "导航路径" },
  view_map: { id: "Peta", en: "Map", zh: "地图" },
  view_list: { id: "Daftar", en: "List", zh: "列表" },
  view_label: { id: "Tampilan", en: "View", zh: "视图" },

  gallery: { id: "Foto", en: "Photos", zh: "照片" },
  gallery_soon: { id: "Foto menyusul", en: "Photos coming", zh: "照片稍后补上" },
  gallery_all: { id: "Semua foto", en: "All photos", zh: "全部照片" },
  gallery_open: { id: "Buka foto {n}", en: "Open photo {n}", zh: "查看第 {n} 张" },
  gallery_prev: { id: "Foto sebelumnya", en: "Previous photo", zh: "上一张" },
  gallery_next: { id: "Foto berikutnya", en: "Next photo", zh: "下一张" },
  gallery_photo: { id: "Foto {n} dari {total}: {nama}", en: "Photo {n} of {total}: {nama}", zh: "第 {n} 张，共 {total} 张：{nama}" },
  gallery_credit: { id: "Foto: {nama}", en: "Photo: {nama}", zh: "摄影：{nama}" },

  approx_loc: {
    id: "Titik perkiraan. Lokasi persis ada di Petunjuk arah.",
    en: "Approximate point. Directions has the exact spot.",
    zh: "大致位置。确切位置请用导航。",
  },
  map_legend: { id: "Semua titik adalah perkiraan area.", en: "All points are approximate.", zh: "所有标记均为大致位置。" },
  map_title: {
    id: "Peta tempat makan di Batam. Daftar yang sama ada di samping peta.",
    en: "Map of places to eat in Batam. The same list sits beside the map.",
    zh: "巴淡岛餐饮地图。地图旁有相同的列表。",
  },
  map_mini_title: { id: "Peta perkiraan area tempat ini", en: "Map of this place's approximate area", zh: "此店铺大致区域的地图" },
  map_trail_title: { id: "Peta panduan", en: "Guide map", zh: "指南地图" },
  map_failed: {
    id: "Peta tidak dapat dimuat. Coba muat ulang.",
    en: "The map could not load. Try reloading.",
    zh: "地图无法加载，请重新加载。",
  },
  map_loading: { id: "Memuat peta", en: "Loading map", zh: "正在加载地图" },
  map_print_alt: {
    id: "Peta Batam dengan {n} titik tempat makan, paling rapat di Nagoya dan Batam Centre.",
    en: "Map of Batam with {n} food points, densest around Nagoya and Batam Centre.",
    zh: "巴淡岛地图，标有 {n} 个餐饮点，纳卯和巴淡中心最密集。",
  },

  saved_title: { id: "Simpanan", en: "Saved", zh: "收藏" },
  saved_empty: {
    id: "Belum ada. Tekan ikon hati pada tempat mana pun.",
    en: "Nothing yet. Tap the heart on any place.",
    zh: "还没有收藏。点击任意店铺的爱心即可。",
  },
  saved_local: { id: "Tersimpan di peramban ini, tanpa akun.", en: "Kept in this browser, no account.", zh: "保存在此浏览器，无需账号。" },
  export_title: { id: "Pindah Perangkat", en: "Move to Another Device", zh: "转移到其他设备" },
  export_label: { id: "Tautan daftar", en: "List link", zh: "列表链接" },
  copy_link: { id: "Salin tautan", en: "Copy link", zh: "复制链接" },
  import_label: { id: "Tempel tautan dari perangkat lain", en: "Paste a link from another device", zh: "粘贴其他设备的链接" },
  import_btn: { id: "Tambahkan", en: "Add", zh: "添加" },
  import_done: { id: "Ditambahkan {n} tempat.", en: "Added {n} places.", zh: "已添加 {n} 家。" },
  import_rejected: { id: "Sebanyak {n} tempat tidak dikenal.", en: "{n} places not recognised.", zh: "{n} 家无法识别。" },
  import_none: { id: "Tidak ada tempat yang dikenal di tautan itu.", en: "No known places in that link.", zh: "该链接中没有可识别的店铺。" },
  link_found: { id: "Tautan ini berisi {n} tempat.", en: "This link holds {n} places.", zh: "此链接包含 {n} 家店铺。" },
  link_add: { id: "Tambahkan ke simpanan", en: "Add to saved", zh: "加入收藏" },

  guide_line_note: {
    id: "Garis menunjukkan urutan, bukan rute jalan.",
    en: "The line shows the order, not a road route.",
    zh: "线条表示顺序，并非行车路线。",
  },
  guide_order: { id: "Urutan", en: "In order", zh: "顺序" },

  about_title: { id: "Cara Kami Memilih", en: "How We Choose", zh: "我们如何挑选" },
  about_pay_t: { id: "Tidak Berbayar", en: "Nothing Is Paid For", zh: "不收费" },
  about_pay: {
    id: "Tidak ada tempat yang membayar untuk masuk daftar ini. Urutan tidak bisa dibeli.",
    en: "No place pays to be listed. The order cannot be bought.",
    zh: "没有店铺付费入选，排序也不能购买。",
  },
  about_labels_t: { id: "Arti Label", en: "What the Labels Mean", zh: "标签含义" },
  about_l_legend: { id: "buka puluhan tahun dan tetap ramai.", en: "open for decades and still busy.", zh: "开业数十年，依然热闹。" },
  about_l_kurator: { id: "paling kami sarankan.", en: "the ones we recommend most.", zh: "我们最推荐。" },
  about_l_populer: { id: "banyak dibicarakan belakangan ini.", en: "much talked about lately.", zh: "近期讨论较多。" },
  about_l_jarang: { id: "bagus, tetapi tidak mudah ditemukan.", en: "good, but hard to find.", zh: "不错，但不容易找到。" },
  about_halal_t: { id: "Status Halal", en: "Halal Status", zh: "清真状态" },
  about_halal: {
    id: "Status ini hasil kurasi, bukan sertifikasi. Ramah muslim berarti umumnya bisa dikunjungi muslim, tetapi mungkin ada menu nonhalal. Bila ragu, tanyakan kepada pengelola.",
    en: "This comes from curation, not certification. Muslim-friendly means Muslims can generally visit, but non-halal dishes may be served. If unsure, ask the staff.",
    zh: "此状态来自人工筛选，并非认证。穆斯林友好表示穆斯林一般可以前往，但可能供应非清真菜品。如有疑问，请询问店家。",
  },
  about_coord_t: { id: "Lokasi dan Jarak", en: "Location and Distance", zh: "位置与距离" },
  about_coord: {
    id: "Titik di peta adalah perkiraan. Jarak ke terminal diukur garis lurus dari titik itu.",
    en: "Map points are approximate. Distance to a terminal is a straight line from that point.",
    zh: "地图上的点为大致位置。到码头的距离为直线距离。",
  },
  about_rating_t: { id: "Tanpa Bintang", en: "No Star Ratings", zh: "没有星级" },
  about_rating: {
    id: "Tidak ada penilaian bintang. Urutan disusun lewat kurasi.",
    en: "No star ratings. The order comes from curation.",
    zh: "不显示星级。排序来自人工筛选。",
  },
  about_rate_t: { id: "Kurs", en: "Exchange Rates", zh: "汇率" },
  about_rate: {
    id: "Harga S$, RM, dan US$ hanya perkiraan. Kurs {tanggal}: S$1 = {sgd}.",
    en: "S$, RM, and US$ prices are estimates. Rate on {tanggal}: S$1 = {sgd}.",
    zh: "新元、令吉和美元价格仅为估算。{tanggal} 汇率：1 新元 = {sgd}。",
  },
  about_qris_t: { id: "QRIS dari Luar Negeri", en: "QRIS from Abroad", zh: "境外扫 QRIS" },
  about_qris: {
    id: "Aplikasi bank Singapura (OCBC, UOB, DBS menyusul) dan Malaysia (DuitNow) bisa memindai QRIS. Cari tandanya di kasir.",
    en: "Bank apps from Singapore (OCBC, UOB, DBS later) and Malaysia (DuitNow) can scan QRIS. Look for the sign at the counter.",
    zh: "新加坡（OCBC、UOB，DBS 随后）和马来西亚（DuitNow）的银行 App 可扫 QRIS。请留意收银台标识。",
  },
  about_tips_t: { id: "Kiat", en: "Tips", zh: "贴士" },
  about_tip1: { id: "Sup ikan dan bubur sering habis siang hari. Datanglah pagi.", en: "Fish soup and congee often sell out by noon. Go early.", zh: "鱼汤和粥常在中午前售罄，请早点去。" },
  about_tip2: { id: "Di restoran makanan laut, tanyakan harga per kilogram sebelum memesan.", en: "At seafood restaurants, ask the price per kilo before ordering.", zh: "在海鲜餐厅，点菜前先问每公斤价格。" },
  about_tip3: { id: "Tiket feri akhir pekan cepat habis. Pesan lebih awal.", en: "Weekend ferry tickets sell fast. Book ahead.", zh: "周末船票很快售罄，请提前预订。" },
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

// Hanya untuk tombol saringan. Di baris dan detail, harga selalu berupa kisaran dari price_idr.
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
  return lang === "id" ? kaidahJudul(c.name_id) : lang === "zh" ? c.name_zh : kaidahJudul(c.name_en, KATA_TUGAS_EN);
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
