import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import Providers from "@/features/makan/components/Providers";
import Header from "@/features/makan/components/Header";
import BottomNav from "@/features/makan/components/BottomNav";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Batam Bites — Curated Food Map for Travellers",
  description:
    "A hand-curated food directory for Batam, Indonesia. Find legendary warungs, seafood, halal eats and hidden gems near the ferry terminals. Built for travellers from Singapore & Malaysia.",
  applicationName: "Batam Bites",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Batam Bites" },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#e2552b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full">
        <Providers>
          <div className="app-shell flex max-w-[480px] flex-col md:max-w-none">
            <Header />
            <main className="min-h-0 w-full flex-1 md:mx-auto md:max-w-6xl">
              {children}
            </main>
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
