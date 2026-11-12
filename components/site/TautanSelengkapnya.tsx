import Link from "next/link";

/**
 * Tautan "Selengkapnya" di modul beranda dan halaman bagian (keputusan pemilik). Pembaca layar juga mendengar
 * tujuannya ("Selengkapnya tentang Transportasi"), supaya tautannya tetap jelas bila dibaca di luar modulnya.
 */
export default function TautanSelengkapnya({
  href,
  tentang,
  className = "bch-aksi",
}: {
  href: string;
  tentang: string;
  className?: string;
}) {
  return (
    <Link href={href} className={className} prefetch={false}>
      Selengkapnya<span className="sr-only"> tentang {tentang}</span> <span aria-hidden="true">→</span>
    </Link>
  );
}
