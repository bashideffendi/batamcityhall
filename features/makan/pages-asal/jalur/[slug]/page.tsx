import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTrail, trails } from "@/features/makan/lib/trails";
import TrailDetail from "@/features/makan/components/TrailDetail";

export function generateStaticParams() {
  return trails.map((t) => ({ slug: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tr = getTrail(slug);
  if (!tr) return { title: "Not found — Batam Bites" };
  return {
    title: `${tr.title_en} — Batam Bites`,
    description: tr.subtitle_en,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tr = getTrail(slug);
  if (!tr) notFound();
  return <TrailDetail trail={tr} />;
}
