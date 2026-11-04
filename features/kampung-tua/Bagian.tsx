import Link from "next/link";
import { domain, LABEL_DRAF, TERAKHIR_DIPERBARUI, type LencanaKampung } from "./data";
import { IkonCeritaRakyat } from "./Ikon";

export function DaftarSumber({ urls }: { urls: string[] }) {
  if (!urls.length) return <p>Sumber belum tercatat.</p>;
  return (
    <ul>
      {urls.map((u) => (
        <li key={u}>
          <a href={u} rel="noopener noreferrer">
            {domain(u)}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Lencana({ isi }: { isi: LencanaKampung[] }) {
  return (
    <div className="bch-badges mt-2">
      {isi.map((l) => (
        <span key={l.teks} className="bch-badge" data-tone={l.nada}>
          {l.ceritaRakyat && <IkonCeritaRakyat ukuran={12} />}
          {l.teks}
        </span>
      ))}
    </div>
  );
}

/** Pita wajib halaman bertanggal: draf dan tanggal terakhir diperbarui, ditulis, bukan hanya warna. */
export function PitaBertanggal({ draf = true, catatan }: { draf?: boolean; catatan?: string }) {
  return (
    <div className="kt-pita" data-pita-bertanggal>
      {draf && (
        <p className="m-0">
          <span className="bch-badge" data-tone="caution">
            {LABEL_DRAF}
          </span>
        </p>
      )}
      <p className="kt-pita-tanggal m-0">Terakhir diperbarui: {TERAKHIR_DIPERBARUI}</p>
      {catatan && <p className="m-0">{catatan}</p>}
    </div>
  );
}

export function NavKampungTua({ aktif }: { aktif: "daftar" | "legalitas" | "rempang" }) {
  const isi = [
    { id: "daftar", href: "/cerita/kampung-tua", nama: "Peta dan daftar" },
    { id: "legalitas", href: "/cerita/kampung-tua/legalitas", nama: "Kronologi legalitas" },
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
