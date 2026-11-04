// Identitas situs, menu Loket, dan teks wajib. Keputusan pemilik proyek: research/00.

export const SITE_NAME = "Batam City Hall";
export const SITE_TAGLINE = "Balai warga, bukan balai kota";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Wajib di semua halaman (research/00 bagian 1). Teks jangan diubah tanpa izin pemilik proyek. */
export const FOOTER_DISCLAIMER =
  "Proyek independen warga Batam, bukan situs resmi Pemerintah Kota Batam atau BP Batam. Untuk layanan resmi: batam.go.id.";

/** Atribusi gabungan (CLAUDE_CODE_PROMPT bagian 4.0 butir 10). */
export const ATTRIBUTION = [
  "Citra radar © Meteorological Service Singapore",
  "Kondisi cuaca © National Environment Agency (data.gov.sg)",
  "Prakiraan gelombang & cuaca © BMKG",
  "Peta dasar © OpenStreetMap contributors, Protomaps",
  "CCTV © Pemerintah Kota Batam",
  "Batimetri GEBCO",
] as const;

export type Loket = {
  nomor: string;
  nama: string;
  href: string;
  lede: string;
  isi: { label: string; href: string }[];
};

export const LOKET: Loket[] = [
  {
    nomor: "01",
    nama: "Langit & Laut",
    href: "/langit-laut",
    lede: "Hujan, ombak, CCTV, feri. Yang perlu dicek sebelum keluar rumah.",
    isi: [
      { label: "Radar hujan", href: "/langit-laut?mode=hujan" },
      { label: "Ombak", href: "/langit-laut?mode=ombak" },
      { label: "CCTV", href: "/langit-laut?mode=cctv" },
      { label: "Feri & pompong", href: "/jalan/feri" },
    ],
  },
  {
    nomor: "02",
    nama: "Makan",
    href: "/makan",
    lede: "Kopitiam, seafood, dan mi yang layak dikejar. Tanpa listing berbayar.",
    isi: [
      { label: "Daftar", href: "/makan/daftar" },
      { label: "Peta", href: "/makan/peta" },
      { label: "Jalur kuliner", href: "/makan/jalur" },
    ],
  },
  {
    nomor: "03",
    nama: "Tukang Langganan",
    href: "/tukang",
    lede: "Rekomendasi warga yang pernah pakai jasanya. Tidak ada yang bayar untuk masuk.",
    isi: [
      { label: "Daftar tukang", href: "/tukang" },
      { label: "Kirim rekomendasi", href: "/tukang/rekomendasi" },
    ],
  },
  {
    nomor: "04",
    nama: "Jalan-jalan",
    href: "/jalan",
    lede: "Trans Batam, feri, pelabuhan. Cara berpindah tanpa harus punya motor.",
    isi: [
      { label: "Trans Batam", href: "/jalan/trans-batam" },
      { label: "Feri & pompong", href: "/jalan/feri" },
      { label: "CCTV", href: "/langit-laut?mode=cctv" },
    ],
  },
  {
    nomor: "05",
    nama: "Cerita & Budaya",
    href: "/cerita",
    lede: "Dari mana kota ini datang, dan siapa nama-nama di papan jalan itu.",
    isi: [
      { label: "Sejarah", href: "/cerita/sejarah" },
      { label: "Batam Dulu vs Sekarang", href: "/cerita/dulu" },
      { label: "Kampung Tua", href: "/cerita/kampung-tua" },
      { label: "Nama jalan", href: "/cerita/nama-jalan" },
      { label: "Kalender", href: "/cerita/kalender" },
      { label: "Kamus", href: "/cerita/kamus" },
      { label: "Budaya Melayu", href: "/cerita/budaya" },
      { label: "Angka Batam", href: "/cerita/angka" },
    ],
  },
  {
    nomor: "06",
    nama: "Info Warga",
    href: "/info",
    lede: "Direktori, urusan tanah, bantuan hukum, nomor darurat, berita.",
    isi: [
      { label: "Direktori", href: "/info/direktori" },
      { label: "Nomor darurat", href: "/info/darurat" },
      { label: "Urusan tanah", href: "/info/urusan-tanah" },
      { label: "Bantuan hukum", href: "/info/bantuan-hukum" },
      { label: "Berita", href: "/info/berita" },
      { label: "Warga baru", href: "/info/warga-baru" },
    ],
  },
  {
    nomor: "07",
    nama: "Main-main",
    href: "/main",
    lede: "Mural, quest, kartu pos. Bagian yang tidak perlu diseriusi.",
    isi: [
      { label: "Mural", href: "/mural" },
      { label: "Kartu pos", href: "/main/kartu-pos" },
      { label: "Vibe map", href: "/main/vibe" },
    ],
  },
];

/** Loket yang halamannya sudah jadi. Beranda hanya menautkan loket yang terdaftar di sini. */
export const LOKET_DIBUKA: readonly string[] = ["01", "02"];

export const HALAMAN_PENDUKUNG = [
  { label: "Tentang", href: "/tentang" },
  { label: "Kolofon", href: "/kolofon" },
  { label: "Cara berkontribusi", href: "/kontribusi" },
  { label: "Koreksi data", href: "/koreksi" },
  { label: "Privasi", href: "/privasi" },
  { label: "Syarat", href: "/syarat" },
] as const;
