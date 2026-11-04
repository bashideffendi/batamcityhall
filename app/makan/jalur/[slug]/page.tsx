import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TrailDetail from "@/features/makan/components/TrailDetail";
import { getTrail, trails } from "@/features/makan/lib/trails";

// Hanya jalur yang ada di data: slug lain langsung 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return trails.map((t) => ({ slug: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tr = getTrail(slug);
  if (!tr) return {};
  return { title: tr.title_id, description: tr.subtitle_id };
}

export default async function Halaman({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getTrail(slug)) notFound();
  return <TrailDetail slug={slug} />;
}
