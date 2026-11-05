// Identitas situs, menu Loket, dan teks wajib. Keputusan pemilik proyek: research/00.

export const SITE_NAME = "Batam City Hall";
export const SITE_TAGLINE = "Informasi Kota Batam";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Halaman yang disembunyikan sampai siap (docs/PEDOMAN.md bagian 6). Tetap ada di kode dengan noindex,
 * tidak muncul di menu, beranda, peta, dan sitemap. tests/e2e/situs.spec.ts menjaganya.
 */
export const HALAMAN_TERSEMBUNYI = [
  "/mural",
  "/mural/cara-dibuat",
  "/mural/gcp",
  "/main/vibe",
  "/cerita/dulu",
  "/info/warga-baru",
  "/admin",
  "/cerita/rempang",
  "/cerita/kampung-tua/legalitas",
] as const;
export const ROBOTS_TERSEMBUNYI = { index: false, follow: false } as const;

/** SITE_PRATINJAU=1 saat build: situs pratinjau (mis. Railway) tidak diindeks mesin pencari. */
export const SITE_PRATINJAU = process.env.SITE_PRATINJAU === "1";

/** Baris kaki halaman (PEDOMAN 3.1). Kredit data pindah ke Kolofon. */
export const KAKI_KETERANGAN = "Proyek independen warga Batam · Tanpa iklan";

export type Loket = {
  nomor: string;
  nama: string;
  href: string;
  lede: string;
  /** Penanda kecil di atas judul halaman pembuka: isi bagian ini. */
  penanda: string;
  /** Awalan alamat yang menandai loket ini aktif di menu. */
  aktifDi: string[];
  /** Ilustrasi di public/grafis (PEDOMAN 4.7). */
  grafis: string;
  isi: { label: string; href: string }[];
};

// Nama dan keterangan mengikuti PEDOMAN 3.1. Route lama tetap; hanya label yang berganti.
export const LOKET: Loket[] = [
  {
    nomor: "01",
    grafis: "/grafis/loket-cuaca.webp",
    aktifDi: ["/cuaca"],
    nama: "Cuaca dan Laut",
    href: "/cuaca",
    lede: "Radar hujan, tinggi gelombang, dan kamera lalu lintas",
    penanda: "Radar hujan · Gelombang · CCTV",
    isi: [
      { label: "Radar hujan", href: "/cuaca/hujan" },
      { label: "Tinggi gelombang", href: "/cuaca/gelombang" },
      { label: "CCTV lalu lintas", href: "/cuaca/cctv" },
      { label: "Peringatan dini cuaca", href: "/cuaca/peringatan" },
      { label: "Gempa terkini", href: "/cuaca/gempa" },
    ],
  },
  {
    nomor: "02",
    grafis: "/grafis/loket-makan.webp",
    aktifDi: ["/makan"],
    nama: "Makan",
    href: "/makan",
    lede: "Tempat makan pilihan, dari kopitiam sampai gonggong",
    penanda: "Daftar · Peta · Jalur kuliner",
    isi: [
      { label: "Daftar", href: "/makan/daftar" },
      { label: "Peta", href: "/makan/peta" },
      { label: "Jalur kuliner", href: "/makan/jalur" },
    ],
  },
  {
    nomor: "03",
    grafis: "/grafis/loket-tukang.webp",
    aktifDi: ["/tukang"],
    nama: "Tukang Langganan",
    href: "/tukang",
    lede: "Jasa yang direkomendasikan warga",
    penanda: "Daftar tukang · Kirim rekomendasi",
    isi: [
      { label: "Daftar tukang", href: "/tukang" },
      { label: "Kirim rekomendasi", href: "/tukang/rekomendasi" },
    ],
  },
  {
    nomor: "04",
    grafis: "/grafis/loket-transportasi.webp",
    aktifDi: ["/jalan"],
    nama: "Transportasi",
    href: "/jalan",
    lede: "Trans Batam, feri, dan pompong",
    penanda: "Trans Batam · Feri · Pompong",
    isi: [
      { label: "Trans Batam", href: "/jalan/trans-batam" },
      { label: "Peta transportasi", href: "/jalan/peta" },
      { label: "Feri", href: "/jalan/feri" },
      { label: "Pompong", href: "/jalan/pompong" },
      { label: "Panduan menyeberang", href: "/jalan/feri/panduan" },
    ],
  },
  {
    nomor: "05",
    grafis: "/grafis/loket-cerita.webp",
    aktifDi: ["/cerita"],
    nama: "Cerita dan Budaya",
    href: "/cerita",
    lede: "Sejarah, kampung tua, tokoh, dan kamus",
    penanda: "Sejarah · Kampung tua · Kamus",
    isi: [
      { label: "Sejarah Batam", href: "/cerita/sejarah" },
      { label: "Kampung tua", href: "/cerita/kampung-tua" },
      { label: "Siapa di balik nama jalan", href: "/cerita/nama-jalan" },
      { label: "Budaya Melayu", href: "/cerita/budaya" },
      { label: "Kalender acara", href: "/cerita/kalender" },
      { label: "Kamus", href: "/cerita/kamus" },
      { label: "Komunitas", href: "/cerita/komunitas" },
      { label: "Batam dalam angka", href: "/cerita/angka" },
    ],
  },
  {
    nomor: "06",
    grafis: "/grafis/loket-informasi.webp",
    aktifDi: ["/info"],
    nama: "Informasi Warga",
    href: "/info",
    lede: "Direktori, nomor darurat, dan panduan",
    penanda: "Direktori · Nomor darurat · Berita",
    isi: [
      { label: "Direktori", href: "/info/direktori" },
      { label: "Nomor darurat", href: "/info/darurat" },
      { label: "Urusan tanah dan rumah", href: "/info/urusan-tanah" },
      { label: "Bantuan hukum", href: "/info/bantuan-hukum" },
      { label: "Jasa dokumen dan usaha", href: "/info/jasa-dokumen" },
      { label: "Berita Batam", href: "/info/berita" },
    ],
  },
  {
    nomor: "07",
    grafis: "/grafis/loket-main.webp",
    aktifDi: ["/main"],
    nama: "Ruang Main",
    href: "/main",
    lede: "Kartu pos dan kalkulator belanja",
    penanda: "Kartu pos · Kalkulator belanja",
    isi: [
      { label: "Kartu pos dari Batam", href: "/main/kartu-pos" },
      { label: "Belanja di Singapura atau di Nagoya?", href: "/main/singapura-atau-nagoya" },
    ],
  },
];

/** Loket yang halamannya sudah jadi. Beranda hanya menautkan loket yang terdaftar di sini. */
export const LOKET_DIBUKA: readonly string[] = ["01", "02", "03", "04", "05", "06", "07"];

export const HALAMAN_PENDUKUNG = [
  { label: "Tentang", href: "/tentang" },
  { label: "Kolofon", href: "/kolofon" },
  { label: "Kirim koreksi", href: "/koreksi" },
  { label: "Privasi", href: "/privasi" },
  { label: "Syarat penggunaan", href: "/syarat" },
] as const;
