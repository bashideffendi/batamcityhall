// Identitas situs, menu, dan teks wajib. Struktur menu: koreksi pemilik 5 November 2026. Nama Barelang.co: keputusan pemilik 11 November 2026 (sebelumnya Batam City Hall).

export const SITE_NAME = "Barelang.co";
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
  "/cerita/dulu",
  "/info/warga-baru",
  "/admin",
  "/cerita/rempang",
  "/cerita/kampung-tua/legalitas",
] as const;
export const ROBOTS_TERSEMBUNYI = { index: false, follow: false } as const;

/** SITE_PRATINJAU=1 saat build: situs pratinjau (mis. Railway) tidak diindeks mesin pencari. */
export const SITE_PRATINJAU = process.env.SITE_PRATINJAU === "1";

/** Formulir warga butuh basis data. Selama belum tersambung, tautan ke formulirnya tidak tampil (PEDOMAN 1.7). */
export const KIRIMAN_AKTIF =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) || process.env.NEXT_PUBLIC_MODE_CONTOH === "1" || process.env.NODE_ENV !== "production";

/** Baris kaki halaman. Kredit data ada di Kolofon. */
export const KAKI_KETERANGAN = "Proyek independen warga Batam. Tanpa iklan.";

export type Bagian = {
  id: string;
  nama: string;
  href: string;
  /** Keterangan singkat di menu ponsel dan halaman pembuka. */
  lede: string;
  /** Awalan alamat yang menandai bagian ini aktif di menu. */
  aktifDi: string[];
  /** Ilustrasi di public/grafis. */
  grafis: string;
  /** Submenu. Kosong bila bagian hanya satu halaman. */
  isi: { label: string; href: string; /** Kata pencarian tambahan. */ kata?: string }[];
};

/** Isinya dari dashboard, jadi menunya baru tampil setelah basis data tersambung. */
const BAGIAN_LOKER: Bagian = {
  id: "loker",
  nama: "Info Loker",
  href: "/loker",
  lede: "Lowongan kerja di Batam",
  aktifDi: ["/loker"],
  grafis: "/grafis/bagian/loker.webp",
  isi: [],
};

// Urutan mengikuti yang paling sering dicari setiap hari, lalu yang dibuka sesekali.
export const BAGIAN: Bagian[] = [
  {
    id: "cuaca",
    nama: "Cuaca",
    href: "/cuaca",
    lede: "Radar hujan, gelombang, peringatan dini, kualitas udara, dan gempa",
    aktifDi: ["/cuaca"],
    grafis: "/grafis/loket-cuaca.webp",
    isi: [
      { label: "Radar Hujan", href: "/cuaca/hujan" },
      { label: "Tinggi Gelombang", href: "/cuaca/gelombang" },
      { label: "Peringatan Dini", href: "/cuaca/peringatan" },
      { label: "Kualitas Udara", href: "/cuaca/udara", kata: "AQI polusi asap kabut PM2.5" },
      { label: "Gempa Terkini", href: "/cuaca/gempa" },
    ],
  },
  {
    id: "cctv",
    nama: "CCTV",
    href: "/cctv",
    lede: "Kamera lalu lintas di jalan utama Batam",
    aktifDi: ["/cctv"],
    grafis: "/grafis/bagian/cctv.webp",
    isi: [],
  },
  {
    id: "transportasi",
    nama: "Transportasi",
    href: "/jalan",
    lede: "Trans Batam, feri, dan pompong",
    aktifDi: ["/jalan"],
    grafis: "/grafis/loket-transportasi.webp",
    isi: [
      { label: "Trans Batam", href: "/jalan/trans-batam" },
      { label: "Feri", href: "/jalan/feri" },
      { label: "Pompong", href: "/jalan/pompong" },
      { label: "Panduan Menyeberang", href: "/jalan/feri/panduan" },
      { label: "Peta Transportasi", href: "/jalan/peta" },
    ],
  },
  {
    id: "layanan",
    nama: "Layanan Warga",
    href: "/info",
    lede: "Nomor darurat, direktori, dan panduan urusan",
    aktifDi: ["/info"],
    grafis: "/grafis/loket-informasi.webp",
    isi: [
      { label: "Nomor Darurat", href: "/info/darurat" },
      { label: "Direktori", href: "/info/direktori" },
      { label: "Urusan Tanah dan Rumah", href: "/info/urusan-tanah" },
      { label: "Bantuan Hukum", href: "/info/bantuan-hukum" },
      { label: "Jasa Dokumen dan Usaha", href: "/info/jasa-dokumen" },
    ],
  },
  {
    id: "makanan",
    nama: "Makanan",
    href: "/makan",
    lede: "117 tempat makan, dari kopitiam sampai gonggong",
    aktifDi: ["/makan"],
    grafis: "/grafis/loket-makan.webp",
    isi: [
      { label: "Hidangan", href: "/makan/hidangan" },
      { label: "Kawasan", href: "/makan/kawasan" },
      { label: "Food Court", href: "/makan/food-court", kata: "pujasera hawker kuliner malam" },
      { label: "Panduan", href: "/makan/panduan" },
      { label: "Dekat Feri", href: "/makan/dekat-feri" },
      { label: "Peta", href: "/makan/peta" },
      { label: "Simpanan", href: "/makan/simpanan" },
    ],
  },
  {
    id: "kegiatan",
    nama: "Things to Do",
    href: "/things-to-do",
    lede: "Acara sepanjang tahun dan tempat untuk dikunjungi",
    aktifDi: ["/things-to-do"],
    grafis: "/grafis/bagian/agenda.webp",
    isi: [],
  },
  {
    id: "berita",
    nama: "Berita",
    href: "/berita",
    lede: "Judul terbaru tentang Batam dari media lokal",
    aktifDi: ["/berita"],
    grafis: "/grafis/bagian/berita.webp",
    isi: [],
  },
  {
    id: "jurnal",
    nama: "Jurnal",
    href: "/jurnal",
    lede: "Tulisan tentang Batam",
    aktifDi: ["/jurnal"],
    grafis: "/grafis/bagian/jurnal.webp",
    isi: [],
  },
  {
    id: "infografik",
    nama: "Infografik",
    href: "/infografik",
    lede: "Data Batam dalam satu gambar",
    aktifDi: ["/infografik"],
    grafis: "/grafis/bagian/infografik.webp",
    isi: [],
  },
  {
    id: "dataset",
    nama: "Dataset",
    href: "/dataset",
    lede: "Data tentang Kota Batam dari lima portal data, dalam satu tempat",
    aktifDi: ["/dataset"],
    grafis: "/grafis/bagian/dataset.webp",
    isi: [],
  },
  {
    id: "budaya",
    nama: "Sejarah dan Budaya",
    href: "/cerita",
    lede: "Sejarah, kampung tua, nama jalan, kamus, dan kartu pos",
    aktifDi: ["/cerita", "/kartu-pos"],
    grafis: "/grafis/loket-cerita.webp",
    isi: [
      { label: "Sejarah Batam", href: "/cerita/sejarah" },
      { label: "Kampung Tua", href: "/cerita/kampung-tua" },
      { label: "Nama Jalan", href: "/cerita/nama-jalan" },
      { label: "Budaya Melayu", href: "/cerita/budaya" },
      { label: "Kamus", href: "/cerita/kamus" },
      { label: "Batam dalam Angka", href: "/cerita/angka" },
      { label: "Kartu Pos", href: "/kartu-pos" },
    ],
  },
  {
    id: "komunitas",
    nama: "Komunitas",
    href: "/komunitas",
    lede: "Komunitas kreatif, olahraga, dan budaya di Batam",
    aktifDi: ["/komunitas"],
    grafis: "/grafis/bagian/komunitas.webp",
    isi: [],
  },
  {
    id: "tukang",
    nama: "Tukang Langganan",
    href: "/tukang",
    lede: "Jasa yang direkomendasikan warga",
    aktifDi: ["/tukang"],
    grafis: "/grafis/loket-tukang.webp",
    isi: [
      { label: "Daftar Tukang", href: "/tukang" },
      ...(KIRIMAN_AKTIF ? [{ label: "Kirim Rekomendasi", href: "/tukang/rekomendasi" }] : []),
    ],
  },
  ...(KIRIMAN_AKTIF ? [BAGIAN_LOKER] : []),
];

export const bagianDari = (id: string): Bagian => {
  const b = [...BAGIAN, BAGIAN_LOKER].find((x) => x.id === id);
  if (!b) throw new Error(`bagian tidak dikenal: ${id}`);
  return b;
};

/** Bagian yang memuat alamat ini. */
export const bagianDiAlamat = (path: string): Bagian | undefined =>
  BAGIAN.find((b) => b.aktifDi.some((p) => path === p || path.startsWith(`${p}/`)));
