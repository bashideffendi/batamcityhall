import type { NextConfig } from "next";

// Header keamanan dibawa dari hujandibatam (next.config.ts). Beda satu hal:
// geolocation=(self), karena tombol "Di sekitarku" di peta memintanya dari situs ini sendiri.
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), payment=(), usb=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  // Dari hujandibatam: cache build Turbopack pernah menghasilkan CSS basi di produksi
  // (deploy 006ab42, 29 Sep 2026). Build bersih sedikit lebih lama, hasilnya selalu sesuai kode.
  experimental: {
    turbopackFileSystemCacheForBuild: false,
  },
  async headers() {
    return [
      { source: "/(.*)", headers: SECURITY_HEADERS },
      {
        source: "/sw.js",
        headers: [{ key: "Cache-Control", value: "no-cache, max-age=0, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;
