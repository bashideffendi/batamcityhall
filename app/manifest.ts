import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

// PWA: manifest untuk "Add to Home Screen" + ikon. Service worker di public/sw.js: data realtime
// network-only supaya tidak basi, aset statis cache-first. orientation "any": video CCTV 16:9 boleh
// ditonton landscape.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: `${SITE_NAME}: ${SITE_TAGLINE}`,
    short_name: SITE_NAME,
    description: "Website kota indie untuk Batam: peta laut, hujan, feri, direktori, cerita.",
    start_url: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#FFFFFF",
    theme_color: "#FFFFFF",
    lang: "id",
    categories: ["weather", "navigation", "food"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
