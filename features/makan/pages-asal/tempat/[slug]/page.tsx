import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPlace, places } from "@/features/makan/lib/data";
import DetailView from "@/features/makan/components/DetailView";

export function generateStaticParams() {
  return places.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getPlace(slug);
  if (!p) return { title: "Not found — Batam Bites" };
  const desc = p.desc_en || p.desc_id;
  return {
    title: `${p.name} — Batam Bites`,
    description: desc,
    openGraph: { title: p.name, description: desc },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getPlace(slug);
  if (!p) notFound();
  return <DetailView place={p} />;
}
