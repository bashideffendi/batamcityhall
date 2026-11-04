import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DetailView from "@/features/makan/components/DetailView";
import { getPlace, places } from "@/features/makan/lib/data";

// Hanya tempat yang ada di data: slug lain langsung 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return places.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPlace(slug);
  if (!p) return {};
  return { title: p.name, description: p.desc_id, openGraph: { title: p.name, description: p.desc_id } };
}

export default async function Halaman({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getPlace(slug)) notFound();
  return <DetailView slug={slug} />;
}
