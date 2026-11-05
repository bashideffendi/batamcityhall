import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HidanganHalaman } from "@/features/makan/components/HalamanMakan";
import { categoryCounts, categoryMap } from "@/features/makan/lib/data";
import { DEK_HIDANGAN, kategoriDariSlug, semuaSlugHidangan } from "@/features/makan/lib/hidangan";

export const dynamicParams = false;

export function generateStaticParams() {
  return semuaSlugHidangan.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const kategori = kategoriDariSlug(slug);
  if (!kategori) return {};
  return {
    title: categoryMap[kategori].name_id,
    description: `${categoryCounts[kategori] ?? 0} tempat di Batam. ${DEK_HIDANGAN[kategori]?.id ?? ""}`,
  };
}

export default async function Halaman({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!kategoriDariSlug(slug)) notFound();
  return <HidanganHalaman slug={slug} />;
}
