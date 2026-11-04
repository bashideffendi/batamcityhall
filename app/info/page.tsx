import type { Metadata } from "next";
import Link from "next/link";
import { KECAMATAN } from "@/lib/data/schema";
import { slugKecamatan } from "@/features/direktori/data";

export const metadata: Metadata = {
  title: "Info Warga",
  description: "Direktori, nomor darurat, urusan tanah, dan bantuan hukum di Batam.",
};

const PINTU = [
  { href: "/info/direktori", nama: "Direktori", lede: "Kantor, kesehatan, sekolah, ibadah, belanja, dan lainnya." },
  { href: "/info/darurat", nama: "Nomor darurat", lede: "Polisi, pemadam, SAR, ambulans, dan call center layanan." },
  {
    href: "/info/urusan-tanah",
    nama: "Urusan tanah",
    lede: "UWT, HPL, sertifikat, jual-beli rumah: ke mana untuk apa.",
  },
  { href: "/info/bantuan-hukum", nama: "Bantuan hukum", lede: "Posbakum, LBH, organisasi advokat, PPAT dan notaris." },
  {
    href: "/info/jasa-dokumen",
    nama: "Jasa dokumen & usaha",
    lede: "Konsultan pajak, penilai, izin usaha, legalisasi.",
  },
  { href: "/info/berita", nama: "Berita", lede: "Judul dari media lokal dan sumber resmi. Tautan saja." },
  { href: "/info/warga-baru", nama: "Warga baru", lede: "Baru pindah ke Batam? Mulai dari sini." },
];

export default function InfoWarga() {
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">Loket 06</p>
      <h1 className="mt-2">Info Warga</h1>
      <p className="bch-lede">Yang biasanya dicari warga ketika ada urusan, dikumpulkan di satu tempat.</p>
      <p className="bch-note">Situs ini bukan situs resmi. Untuk urusan yang menentukan, pastikan lagi ke kantornya.</p>

      <ul className="bch-grid mt-5">
        {PINTU.map((p) => (
          <li key={p.href}>
            <Link href={p.href} className="bch-card h-full" prefetch={false}>
              <h2>{p.nama}</h2>
              <span>{p.lede}</span>
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-7 mb-4">Menurut kecamatan</h2>
      <nav aria-label="Kecamatan" className="bch-sub-nav">
        {KECAMATAN.map((k) => (
          <Link key={k} href={`/info/kecamatan/${slugKecamatan(k)}`} prefetch={false}>
            {k}
          </Link>
        ))}
      </nav>
    </div>
  );
}
