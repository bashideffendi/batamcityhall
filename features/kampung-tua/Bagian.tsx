import Link from "next/link";
import { TERAKHIR_DIPERBARUI, type LencanaKampung } from "./data";
import { IkonCeritaRakyat } from "./Ikon";

export function Lencana({ isi }: { isi: LencanaKampung }) {
  return (
    <div className="bch-badges mt-2">
      <span className="bch-badge" data-tone={isi.nada}>
        {isi.ceritaRakyat && <IkonCeritaRakyat ukuran={12} />}
        {isi.teks}
      </span>
    </div>
  );
}

/** Tanggal di bawah judul halaman bertanggal (pedoman 3.7). */
export function PitaBertanggal() {
  return (
    <div className="kt-pita" data-pita-bertanggal>
      <p className="kt-pita-tanggal m-0">Terakhir diperbarui {TERAKHIR_DIPERBARUI}</p>
    </div>
  );
}

export function NavKampungTua({ aktif }: { aktif: "daftar" | "legalitas" | "rempang" }) {
  // Kronologi disembunyikan sampai pemilik selesai membaca (PEDOMAN bagian 6): halaman publik tidak menautkannya.
  if (aktif === "daftar") return null;
  const isi = [
    { id: "daftar", href: "/cerita/kampung-tua", nama: "Peta dan Daftar" },
    { id: "legalitas", href: "/cerita/kampung-tua/legalitas", nama: "Kronologi Legalitas" },
    { id: "rempang", href: "/cerita/rempang", nama: "Kronologi Rempang" },
  ];
  return (
    <nav className="bch-sub-nav" aria-label="Bagian Kampung Tua">
      {isi.map((n) => (
        <Link key={n.id} href={n.href} aria-current={n.id === aktif ? "page" : undefined} prefetch={false}>
          {n.nama}
        </Link>
      ))}
    </nav>
  );
}
