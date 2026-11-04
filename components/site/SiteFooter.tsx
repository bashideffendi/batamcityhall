import Link from "next/link";
import GerakToggle from "@/components/site/GerakToggle";
import { ATTRIBUTION, FOOTER_DISCLAIMER, HALAMAN_PENDUKUNG } from "@/lib/site";

export default function SiteFooter() {
  const donasi = process.env.NEXT_PUBLIC_DONASI_URL;
  return (
    <footer className="bch-footer">
      <div className="bch-footer-inner">
        <p>{FOOTER_DISCLAIMER}</p>
        <nav aria-label="Halaman pendukung">
          {HALAMAN_PENDUKUNG.map((h) => (
            <Link key={h.href} href={h.href} prefetch={false}>
              {h.label}
            </Link>
          ))}
          {donasi && <a href={donasi}>Donasi</a>}
          <GerakToggle />
        </nav>
        <p className="bch-attrib">
          {ATTRIBUTION.join(" · ")}. Sumber arsip dicantumkan di tiap halaman dan di Kolofon.
        </p>
      </div>
    </footer>
  );
}
