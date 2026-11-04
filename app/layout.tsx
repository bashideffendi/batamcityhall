import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Plus_Jakarta_Sans, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import SiteFooter from "@/components/site/SiteFooter";
import SiteNav from "@/components/site/SiteNav";
import ServiceWorkerRegister from "@/features/langit-laut/components/ServiceWorkerRegister";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

// Font di-self-host next/font: tidak ada request ke Google dari browser pengguna.
const serif = Source_Serif_4({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-serif",
});
const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-sans",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
  variable: "--font-mono",
});

const DESC =
  "Website kota indie untuk Batam: peta laut, hujan, feri, direktori, cerita. Tanpa iklan, tanpa listing berbayar.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: { default: `${SITE_NAME}: ${SITE_TAGLINE}`, template: `%s · ${SITE_NAME}` },
  description: DESC,
  openGraph: { type: "website", locale: "id_ID", siteName: SITE_NAME, description: DESC },
  appleWebApp: { capable: true, title: SITE_NAME, statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4EFE4" },
    { media: "(prefers-color-scheme: dark)", color: "#0F1B2A" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Tema dipasang sebelum paint. Pilihan tersimpan menang. Tanpa pilihan: Langit & Laut ikut jam WIB
// (paritas hujandibatam), halaman lain ikut prefers-color-scheme (CLAUDE_CODE_PROMPT 4.1).
const THEME_SCRIPT = `(function(){try{var s=localStorage.getItem("bch-theme"),d=document.documentElement,t;if(s==="day"||s==="night")t=s;else if(location.pathname.indexOf("/langit-laut")===0){var h=(new Date().getUTCHours()+7)%24;t=h>=6&&h<18?"day":"night"}else t=matchMedia("(prefers-color-scheme: dark)").matches?"night":"day";d.dataset.theme=t;var g=localStorage.getItem("bch-gerak");if(g==="tenang")d.dataset.gerak="tenang"}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${serif.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
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
