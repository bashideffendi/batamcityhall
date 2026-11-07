// Infografik bawaan: poster yang digambar dari data situs, jadi angkanya selalu sama dengan halaman sumbernya.
// Infografik unggahan dashboard digabung lewat features/konten/baca.ts.

export type IdPoster = "penduduk" | "laut" | "wisman" | "darurat" | "makan";

export type Infografik = {
  slug: string;
  judul: string;
  ringkasan: string;
  rubrik: string;
  /** YYYY-MM-DD */
  tanggal: string;
  penulis: string;
  /** Poster bawaan. */
  poster?: IdPoster;
  /** Gambar unggahan dashboard. `deskripsi` adalah isi infografik dalam teks, untuk pembaca layar. */
  gambar?: { src: string; w: number; h: number; deskripsi: string };
  /** Halaman tempat datanya lengkap. */
  terkait?: { href: string; teks: string };
};

const REDAKSI = "Redaksi Batam City Hall";

export const INFOGRAFIK_REPO: Infografik[] = [
  {
    slug: "penduduk-batam-dari-1965",
    judul: "Dari Sekitar 6.000 Jiwa pada 1965",
    ringkasan: "Penduduk Batam dari 1965 sampai 2025, dan mengapa angka 2025 punya tiga versi.",
    rubrik: "Penduduk",
    tanggal: "2026-11-07",
    penulis: REDAKSI,
    poster: "penduduk",
    terkait: { href: "/cerita/angka", teks: "Semua angka di Batam dalam Angka" },
  },
  {
    slug: "batam-sebagian-besar-laut",
    judul: "Hampir 3 dari 4 Bagian Batam Adalah Laut",
    ringkasan: "Luas perairan dan daratan Kota Batam dalam seratus kotak.",
    rubrik: "Geografi",
    tanggal: "2026-11-07",
    penulis: REDAKSI,
    poster: "laut",
    terkait: { href: "/cerita/angka", teks: "Semua angka di Batam dalam Angka" },
  },
  {
    slug: "wisman-batam-2025",
    judul: "Hampir 1 dari 2 Kunjungan Wisman 2025 dari Singapura",
    ringkasan: "Kunjungan wisatawan mancanegara ke Batam pada 2025 menurut negara asal.",
    rubrik: "Wisata",
    tanggal: "2026-11-07",
    penulis: REDAKSI,
    poster: "wisman",
    terkait: { href: "/cerita/angka", teks: "Semua angka di Batam dalam Angka" },
  },
  {
    slug: "lima-nomor-darurat",
    judul: "Lima Nomor Darurat",
    ringkasan: "Nomor yang perlu disimpan setiap warga dan pendatang di Batam.",
    rubrik: "Layanan Warga",
    tanggal: "2026-11-07",
    penulis: REDAKSI,
    poster: "darurat",
    terkait: { href: "/info/darurat", teks: "Nomor Darurat lengkap" },
  },
  {
    slug: "peta-rasa-batam",
    judul: "Peta Rasa Batam",
    ringkasan: "Tempat makan di Batam City Hall menurut kategori, dari data Makanan.",
    rubrik: "Makanan",
    tanggal: "2026-11-07",
    penulis: REDAKSI,
    poster: "makan",
    terkait: { href: "/makan/hidangan", teks: "Semua kategori Makanan" },
  },
];
