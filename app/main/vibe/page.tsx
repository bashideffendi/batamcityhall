import type { Metadata } from "next";
import { ROBOTS_TERSEMBUNYI } from "@/lib/site";
import Link from "next/link";
import { TEMPAT, lokasiTeks } from "@/features/direktori/data";
import type { TitikVibe } from "@/features/main/PetaVibe";
import PetaVibeMuat from "@/features/main/PetaVibeMuat";
import { MAPPED_CAMS } from "@/features/langit-laut/lib/cctv";

export const metadata: Metadata = {
  title: "Peta Suasana",
  robots: ROBOTS_TERSEMBUNYI,
  description: "Kopitiam, kafe, dan kamera lalu lintas di Batam.",
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
    href: `/cuaca/cctv?cam=${c.slug}`,
    lat: c.lat as number,
    lng: c.lng as number,
    perkiraan: !!c.approx,
  })),
];

export default function HalamanVibe() {
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">
        <Link href="/main">Ruang Main</Link>
      </p>
      <h1 className="mt-2">Peta Suasana</h1>
      <p className="bch-lede">
        Temukan <em>kopitiam</em>, kafe, dan kamera lalu lintas di Batam.
      </p>
      <p className="bch-note">
        Cuaca ada di <Link href="/cuaca">Cuaca dan Laut</Link>. Peta ini tidak memuat kategori tentang kelompok orang.
      </p>
      <div className="mt-4">
        <PetaVibeMuat titik={titik} />
      </div>
    </div>
  );
}
