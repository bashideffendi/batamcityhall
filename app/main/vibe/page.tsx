import type { Metadata } from "next";
import Link from "next/link";
import { TEMPAT, lokasiTeks } from "@/features/direktori/data";
import type { TitikVibe } from "@/features/main/PetaVibe";
import PetaVibeMuat from "@/features/main/PetaVibeMuat";
import { MAPPED_CAMS } from "@/features/langit-laut/lib/cctv";

export const metadata: Metadata = {
  title: "Peta vibe",
  description: "Ngopi dan macet di Batam. Hanya kategori yang aman.",
};

const titik: TitikVibe[] = [
  ...TEMPAT.filter(
    (p) => p.kategori === "kuliner" && ["kopitiam", "cafe"].includes(p.subkategori ?? "") && p.lat != null,
  ).map((p) => ({
    id: p.id,
    jenis: "ngopi" as const,
    nama: p.nama,
    lokasi: lokasiTeks(p),
    href: `/makan/tempat/${p.id}`,
    lat: p.lat as number,
    lng: p.lng as number,
    perkiraan: p.status_koordinat !== "terverifikasi",
  })),
  ...MAPPED_CAMS.map((c) => ({
    id: `cam-${c.slug}`,
    jenis: "macet" as const,
    nama: c.name,
    lokasi: c.area,
    href: `/langit-laut?mode=cctv&cam=${c.slug}`,
    lat: c.lat as number,
    lng: c.lng as number,
    perkiraan: !!c.approx,
  })),
];

export default function HalamanVibe() {
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">
        <Link href="/main">Main-main</Link>
      </p>
      <h1 className="mt-2">Peta vibe</h1>
      <p className="bch-lede">
        Ngopi, macet, dan untuk cuaca ada <Link href="/langit-laut">Langit &amp; Laut</Link>. Tidak ada kategori tentang
        kelompok orang, dan tidak akan ada.
      </p>
      <p className="bch-note">
        Label kiriman warga belum dibuka, karena butuh moderasi. Isi peta ini berasal dari data yang sudah ada di situs.
      </p>
      <div className="mt-4">
        <PetaVibeMuat titik={titik} />
      </div>
    </div>
  );
}
