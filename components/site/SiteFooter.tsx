import Link from "next/link";
import FormNewsletter from "@/components/site/FormNewsletter";
import GerakToggle from "@/components/site/GerakToggle";
import { KAKI_KETERANGAN, KIRIMAN_AKTIF, SITE_NAME } from "@/lib/site";

/** Kaki situs: tentang situs, kebijakan, dan newsletter. Menu tidak diulang di sini (koreksi pemilik 7 Nov 2026). */
export default function SiteFooter() {
  const donasi = process.env.NEXT_PUBLIC_DONASI_URL;
  const tentang = [
    { label: "Tentang", href: "/tentang" },
    { label: "Kolofon", href: "/kolofon" },
    ...(KIRIMAN_AKTIF
      ? [
          { label: "Cara Berkontribusi", href: "/kontribusi" },
          { label: "Kirim Koreksi", href: "/koreksi" },
        ]
      : []),
  ];
  return (
    <footer className="bch-footer">
      <svg className="bch-pita" viewBox="0 0 1440 30" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,16 C120,4 240,26 360,16 S600,4 720,16 960,26 1080,16 1320,4 1440,16 V30 H0Z" fill="#0078BF" fillOpacity=".85" />
        <path d="M0,22 C140,30 260,10 400,20 S660,30 800,20 1060,10 1200,20 1380,30 1440,22 V30 H0Z" fill="#0078BF" fillOpacity=".5" />
      </svg>
      <div className="bch-footer-inner">
        <div className="bch-footer-atas">
          <div className="bch-footer-identitas">
            <p className="bch-footer-merek">{SITE_NAME}</p>
            <p>{KAKI_KETERANGAN}</p>
          </div>
          <nav aria-labelledby="kaki-tentang" className="bch-footer-tautan">
            <p id="kaki-tentang" className="bch-footer-judul">
              Tentang Situs
            </p>
            {tentang.map((h) => (
              <Link key={h.href} href={h.href} prefetch={false}>
                {h.label}
              </Link>
            ))}
            {donasi && <a href={donasi}>Donasi</a>}
          </nav>
          <nav aria-labelledby="kaki-kebijakan" className="bch-footer-tautan">
            <p id="kaki-kebijakan" className="bch-footer-judul">
              Kebijakan
            </p>
            <Link href="/privasi" prefetch={false}>
              Privasi
            </Link>
            <Link href="/syarat" prefetch={false}>
              Syarat Penggunaan
            </Link>
          </nav>
          <FormNewsletter aktif={KIRIMAN_AKTIF} />
        </div>
        <div className="bch-footer-bawah">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}
          </p>
          <div className="bch-footer-animasi">
            <GerakToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
