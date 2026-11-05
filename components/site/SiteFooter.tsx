import Link from "next/link";
import GerakToggle from "@/components/site/GerakToggle";
import { HALAMAN_PENDUKUNG, KAKI_KETERANGAN, SITE_NAME } from "@/lib/site";

export default function SiteFooter() {
  const donasi = process.env.NEXT_PUBLIC_DONASI_URL;
  return (
    <footer className="bch-footer">
      <svg className="bch-pita" viewBox="0 0 1440 30" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,16 C120,4 240,26 360,16 S600,4 720,16 960,26 1080,16 1320,4 1440,16 V30 H0Z" fill="#0078BF" fillOpacity=".85" />
        <path d="M0,22 C140,30 260,10 400,20 S660,30 800,20 1060,10 1200,20 1380,30 1440,22 V30 H0Z" fill="#0078BF" fillOpacity=".5" />
      </svg>
      <div className="bch-footer-inner">
        <div>
          <p className="bch-footer-merek">{SITE_NAME}</p>
          <p>{KAKI_KETERANGAN}</p>
        </div>
        <nav aria-label="Halaman pendukung">
          {HALAMAN_PENDUKUNG.map((h) => (
            <Link key={h.href} href={h.href} prefetch={false}>
              {h.label}
            </Link>
          ))}
          {donasi && <a href={donasi}>Donasi</a>}
        </nav>
        <div className="bch-footer-animasi">
          <GerakToggle />
        </div>
      </div>
    </footer>
  );
}
