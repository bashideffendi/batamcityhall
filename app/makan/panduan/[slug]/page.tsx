import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PanduanHalaman } from "@/features/makan/components/HalamanMakan";
import { getPanduan, panduan } from "@/features/makan/lib/panduan";

// Hanya panduan yang ada di data: slug lain langsung 404.
export function generateStaticParams() {
  return panduan.map((g) => ({ slug: g.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = getPanduan(slug);
  if (!g) return {};
  return { title: g.judul("id"), description: g.dek("id") };
}

export default async function Halaman({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getPanduan(slug)) notFound();
  return <PanduanHalaman id={slug} />;
}
