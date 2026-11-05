import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import SiteFooter from "@/components/site/SiteFooter";
import SiteNav from "@/components/site/SiteNav";
import ServiceWorkerRegister from "@/features/langit-laut/components/ServiceWorkerRegister";
import { SITE_NAME, SITE_PRATINJAU, SITE_TAGLINE, SITE_URL } from "@/lib/site";

// Font di-self-host next/font: tidak ada request ke Google dari browser pengguna.
const display = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-display",
});
const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-sans",
});
const mono = IBM_Plex_Mono({
  // Bukan huruf utama: jangan bersaing dengan teks judul saat halaman pertama dimuat.
  preload: false,
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
});

const DESC =
  "Panduan harian Kota Batam: cuaca dan laut, tempat makan, transportasi, cerita kota, dan direktori layanan. Tanpa iklan.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: { default: `${SITE_NAME}: ${SITE_TAGLINE}`, template: `%s · ${SITE_NAME}` },
  description: DESC,
  openGraph: { type: "website", locale: "id_ID", siteName: SITE_NAME, description: DESC },
  appleWebApp: { capable: true, title: SITE_NAME, statusBarStyle: "default" },
  ...(SITE_PRATINJAU ? { robots: { index: false, follow: false } } : {}),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#141414" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Tema dipasang sebelum paint. Pilihan tersimpan menang. Tanpa pilihan: halaman peta cuaca ikut jam WIB
// (paritas hujandibatam), halaman lain ikut prefers-color-scheme.
const THEME_SCRIPT = `(function(){try{var s=localStorage.getItem("bch-theme"),d=document.documentElement,t;if(s==="light"||s==="dark")t=s;else if(location.pathname.match("^/cuaca/(hujan|gelombang|cctv)")){var h=(new Date().getUTCHours()+7)%24;t=h>=6&&h<18?"light":"dark"}else t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";d.dataset.theme=t;var g=localStorage.getItem("bch-gerak");if(g==="tenang")d.dataset.gerak="tenang"}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <a href="#isi" className="sr-only-focusable">
          Langsung ke isi
        </a>
        <SiteNav />
        <main id="isi" tabIndex={-1} className="bch-main">
          {children}
        </main>
        <SiteFooter />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
