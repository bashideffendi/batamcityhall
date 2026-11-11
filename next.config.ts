import type { NextConfig } from "next";

// Header keamanan dibawa dari hujandibatam (next.config.ts). Beda satu hal:
// geolocation=(self), karena tombol "Di sekitarku" di peta memintanya dari situs ini sendiri.
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  // Bagian CSP yang tidak mengganggu skrip inline Next: tanpa plugin, base dan tujuan formulir hanya situs ini.
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), payment=(), usb=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

// Berkas di public/ tidak bernama-hash, jadi Next memasang max-age=0. Gambar boleh dipakai sejam lalu disegarkan di
// latar, supaya foto yang diganti tetap muncul paling lambat sehari kemudian. Glyph peta tidak pernah berubah.
// /tiles sengaja tidak disentuh: ETag-nya lemah, jadi PMTiles tidak bisa mendeteksi arsip lama di cache peramban.
const CACHE_GAMBAR = [{ key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" }];
const CACHE_GLYPH = [{ key: "Cache-Control", value: "public, max-age=604800" }];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Dari hujandibatam: cache build Turbopack pernah menghasilkan CSS basi di produksi
  // (deploy 006ab42, 29 Sep 2026). Build bersih sedikit lebih lama, hasilnya selalu sesuai kode.
  experimental: {
    turbopackFileSystemCacheForBuild: false,
  },
  // Nama menu Makan berganti atas keputusan pemilik (5 Nov 2026). Alamat lama tetap hidup.
  async redirects() {
    return [
      // Alamat lama pindah ke domain baru (keputusan pemilik 11 Nov 2026). Jalur dan kueri ikut terbawa.
      { source: "/:path*", has: [{ type: "host", value: "batam.masbash.id" }], destination: "https://barelang.co/:path*", permanent: true },
      { source: "/makan/daftar", destination: "/makan/peta", permanent: true },
      { source: "/makan/kategori", destination: "/makan/hidangan", permanent: true },
      { source: "/makan/jalur", destination: "/makan/panduan", permanent: true },
      { source: "/makan/jalur/:slug", destination: "/makan/panduan/:slug", permanent: true },
      { source: "/makan/tersimpan", destination: "/makan/simpanan", permanent: true },
      { source: "/makan/tentang", destination: "/makan/cara-memilih", permanent: true },
      { source: "/admin/foto", destination: "/admin/makanan", permanent: false },
      // Kategori Makanan diganti pemilik.
      ...[
        ["makanan-laut", "seafood"],
        ["sup-ikan", "sop-ikan"],
        ["mi-tarempa", "mie-tarempa"],
        ["nasi-ayam", "nasi-ayam-hainan"],
        ["mi-bakmi", "nasi-mie-goreng"],
        ["nasi-padang", "makanan-padang"],
        ["sunda-jawa", "makanan-sunda"],
        ["sate-kambing", "sate"],
        ["bakso", "bakso-mie-ayam"],
        ["dim-sum", "dimsum"],
        ["ayam-penyet", "penyetan"],
        ["pecel-gado", "gado-pecel"],
        ["oleh-oleh", "kue-jajanan"],
        ["kafe", "coffee-shop"],
      ].map(([lama, baru]) => ({ source: `/makan/hidangan/${lama}`, destination: `/makan/hidangan/${baru}`, permanent: true })),
      // Saringan direktori yang digabung.
      { source: "/info/direktori/kesehatan/rs-:tipe", destination: "/info/direktori/kesehatan/rumah-sakit", permanent: true },
      { source: "/info/direktori/kesehatan/rsia-:tipe", destination: "/info/direktori/kesehatan/rumah-sakit", permanent: true },
      { source: "/info/direktori/kesehatan/puskesmas-:tipe", destination: "/info/direktori/kesehatan/puskesmas", permanent: true },
      { source: "/info/direktori/pemerintahan/dukcapil", destination: "/info/direktori/pemerintahan/disdukcapil", permanent: true },
      // Rombak menu situs (5 Nov 2026).
      { source: "/cuaca/cctv", destination: "/cctv", permanent: true },
      { source: "/langit-laut/peringatan", destination: "/cuaca/peringatan", permanent: true },
      { source: "/langit-laut/gempa", destination: "/cuaca/gempa", permanent: true },
      { source: "/cerita/kalender", destination: "/things-to-do", permanent: true },
      { source: "/cerita/komunitas", destination: "/komunitas", permanent: true },
      { source: "/info/berita", destination: "/berita", permanent: true },
      { source: "/main", destination: "/kartu-pos", permanent: true },
      { source: "/main/kartu-pos", destination: "/kartu-pos", permanent: true },
      { source: "/main/singapura-atau-nagoya", destination: "/jalan/feri", permanent: true },
      { source: "/main/vibe", destination: "/cctv", permanent: true },
    ];
  },
  async headers() {
    return [
      { source: "/(.*)", headers: SECURITY_HEADERS },
      ...["grafis", "kartu-pos", "foto", "mural", "logo"].map((d) => ({ source: `/${d}/:path*`, headers: CACHE_GAMBAR })),
      { source: "/glyphs/:path*", headers: CACHE_GLYPH },
      {
        source: "/sw.js",
        headers: [{ key: "Cache-Control", value: "no-cache, max-age=0, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;
